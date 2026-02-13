import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateConsumption, getPreviousPeriod } from '@/lib/servicios-utils';
import type { AllocationMethod, UnitCode } from '@/lib/supabase-types';

interface ConsumptionData {
  unit_id: string;
  consumption: number;
}

interface AllocationData {
  unit_id: string;
  amount: number;
  breakdown: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere invoiceId' },
        { status: 400 }
      );
    }

    // 1. Obtener la factura y validar que existe
    const { data: invoice, error: invoiceError } = await supabase
      .from('utility_invoices')
      .select('*, meter_group:meter_groups(*)')
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { success: false, error: 'Factura no encontrada' },
        { status: 404 }
      );
    }

    const meterGroupId = invoice.meter_group_id;
    const period = invoice.period;

    // 2. Obtener todas las units del meter_group
    const { data: meterGroupUnits, error: unitsError } = await supabase
      .from('meter_group_units')
      .select('*, unit:units(*)')
      .eq('meter_group_id', meterGroupId);

    if (unitsError || !meterGroupUnits || meterGroupUnits.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se encontraron unidades para este grupo de contador' },
        { status: 404 }
      );
    }

    const units = meterGroupUnits.map((mgu) => ({
      id: mgu.unit_id,
      code: mgu.unit.code as UnitCode,
      weight: Number(mgu.weight),
    }));

    // 3. Obtener lecturas actuales y previas para cada unit
    const previousPeriod = getPreviousPeriod(period);
    const currentReadings: Record<string, number> = {};
    const previousReadings: Record<string, number> = {};
    const missingReadings: string[] = [];

    for (const unit of units) {
      // Lectura actual
      const { data: currentReading } = await supabase
        .from('meter_readings')
        .select('reading_value')
        .eq('meter_group_id', meterGroupId)
        .eq('unit_id', unit.id)
        .eq('period', period)
        .single();

      // Lectura previa
      const { data: previousReading } = await supabase
        .from('meter_readings')
        .select('reading_value')
        .eq('meter_group_id', meterGroupId)
        .eq('unit_id', unit.id)
        .eq('period', previousPeriod)
        .single();

      if (!currentReading) {
        missingReadings.push(`${unit.code} (actual)`);
      } else {
        currentReadings[unit.id] = Number(currentReading.reading_value);
      }

      if (!previousReading) {
        missingReadings.push(`${unit.code} (anterior)`);
      } else {
        previousReadings[unit.id] = Number(previousReading.reading_value);
      }
    }

    if (missingReadings.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan lecturas',
          details: `Faltan las siguientes lecturas: ${missingReadings.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 4. Calcular consumos
    const consumptions: ConsumptionData[] = [];
    let totalConsumption = 0;

    for (const unit of units) {
      const current = currentReadings[unit.id];
      const previous = previousReadings[unit.id];

      // Validar que lectura actual >= previa
      if (current < previous) {
        return NextResponse.json(
          {
            success: false,
            error: 'Lectura menor a la anterior',
            details: `La lectura actual de ${unit.code} (${current}) es menor a la anterior (${previous})`,
          },
          { status: 400 }
        );
      }

      const consumption = calculateConsumption(current, previous);
      consumptions.push({
        unit_id: unit.id,
        consumption,
      });
      totalConsumption += consumption;
    }

    // 5. Obtener todos los cargos de la factura
    const { data: charges, error: chargesError } = await supabase
      .from('invoice_charges')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });

    if (chargesError || !charges || charges.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se encontraron cargos para esta factura' },
        { status: 404 }
      );
    }

    // 6. Calcular distribución por cada cargo
    const allocations: Record<string, AllocationData> = {};

    // Inicializar allocations para cada unit
    for (const unit of units) {
      allocations[unit.id] = {
        unit_id: unit.id,
        amount: 0,
        breakdown: {},
      };
    }

    for (const charge of charges) {
      const amount = Number(charge.amount);
      const method = charge.allocation_method as AllocationMethod;
      const metadata = charge.metadata || {};

      switch (method) {
        case 'PROPORTIONAL_CONSUMPTION': {
          if (totalConsumption === 0) {
            // Si no hay consumo, dividir equitativamente
            const splitAmount = amount / units.length;
            for (const unit of units) {
              allocations[unit.id].amount += splitAmount;
              allocations[unit.id].breakdown[charge.description] = splitAmount;
            }
          } else {
            for (const unit of units) {
              const consumption = consumptions.find((c) => c.unit_id === unit.id)?.consumption || 0;
              const proportion = consumption / totalConsumption;
              const allocatedAmount = amount * proportion;
              allocations[unit.id].amount += allocatedAmount;
              allocations[unit.id].breakdown[charge.description] = allocatedAmount;
            }
          }
          break;
        }

        case 'EQUAL_SPLIT': {
          // Usar weights si están definidos
          const totalWeight = units.reduce((sum, u) => sum + u.weight, 0);
          if (totalWeight > 0) {
            for (const unit of units) {
              const proportion = unit.weight / totalWeight;
              const allocatedAmount = amount * proportion;
              allocations[unit.id].amount += allocatedAmount;
              allocations[unit.id].breakdown[charge.description] = allocatedAmount;
            }
          } else {
            const splitAmount = amount / units.length;
            for (const unit of units) {
              allocations[unit.id].amount += splitAmount;
              allocations[unit.id].breakdown[charge.description] = splitAmount;
            }
          }
          break;
        }

        case 'FIXED_AMOUNT': {
          const targetCode = metadata.targetUnitCode as UnitCode;
          const targetUnit = units.find((u) => u.code === targetCode);
          if (!targetUnit) {
            return NextResponse.json(
              {
                success: false,
                error: `Unidad objetivo no encontrada: ${targetCode}`,
              },
              { status: 400 }
            );
          }
          allocations[targetUnit.id].amount += amount;
          allocations[targetUnit.id].breakdown[charge.description] = amount;
          break;
        }

        case 'PERCENTAGE': {
          const percentages = metadata.percentages as Record<UnitCode, number>;
          if (!percentages) {
            return NextResponse.json(
              {
                success: false,
                error: 'Metadata de porcentajes no encontrada',
              },
              { status: 400 }
            );
          }

          let totalPercentage = 0;
          for (const unit of units) {
            const pct = percentages[unit.code] || 0;
            totalPercentage += pct;
            const allocatedAmount = amount * (pct / 100);
            allocations[unit.id].amount += allocatedAmount;
            allocations[unit.id].breakdown[charge.description] = allocatedAmount;
          }

          // Validar que los porcentajes sumen 100 (con tolerancia)
          if (Math.abs(totalPercentage - 100) > 0.01) {
            console.warn(`Los porcentajes suman ${totalPercentage}% en lugar de 100%`);
          }
          break;
        }

        default:
          return NextResponse.json(
            {
              success: false,
              error: `Método de asignación desconocido: ${method}`,
            },
            { status: 400 }
          );
      }
    }

    // 7. Guardar allocations con upsert
    const allocationsToUpsert = Object.values(allocations).map((allocation) => ({
      invoice_id: invoiceId,
      unit_id: allocation.unit_id,
      amount: Math.round(allocation.amount * 100) / 100, // Redondear a 2 decimales
      breakdown: allocation.breakdown,
    }));

    const { data: insertedAllocations, error: allocationsError } = await supabase
      .from('invoice_allocations')
      .upsert(allocationsToUpsert, {
        onConflict: 'invoice_id,unit_id',
      })
      .select('*, unit:units(*)');

    if (allocationsError) {
      throw allocationsError;
    }

    return NextResponse.json({
      success: true,
      data: {
        allocations: insertedAllocations,
        consumptions,
        totalConsumption,
      },
    });
  } catch (error: any) {
    console.error('Error al calcular distribución:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
