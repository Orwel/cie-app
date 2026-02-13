import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToStorage, isValidFileType, isValidFileSize } from '@/lib/servicios-utils';
import type { InvoiceCharge } from '@/lib/supabase-types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const meterGroupId = formData.get('meterGroupId') as string;
    const period = formData.get('period') as string;
    const provider = formData.get('provider') as string;
    const invoiceRef = formData.get('invoiceRef') as string | null;
    const totalAmount = parseFloat(formData.get('totalAmount') as string);
    const dueDate = formData.get('dueDate') as string | null;
    const photo = formData.get('photo') as File;
    const chargesJson = formData.get('charges') as string;

    // Validaciones básicas
    if (!meterGroupId || !period || !provider || !photo || !chargesJson) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (isNaN(totalAmount) || totalAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'El monto total debe ser un número positivo' },
        { status: 400 }
      );
    }

    if (!isValidFileType(photo)) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen (JPEG, PNG, WebP) o PDF' },
        { status: 400 }
      );
    }

    if (!isValidFileSize(photo)) {
      return NextResponse.json(
        { success: false, error: 'El archivo no puede exceder 5MB' },
        { status: 400 }
      );
    }

    // Parsear cargos
    let charges: Omit<InvoiceCharge, 'id' | 'invoice_id' | 'created_at'>[];
    try {
      charges = JSON.parse(chargesJson);
      if (!Array.isArray(charges) || charges.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Debe haber al menos un cargo' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Formato inválido de cargos' },
        { status: 400 }
      );
    }

    // Validar que cada cargo tenga los campos requeridos
    for (const charge of charges) {
      if (!charge.description || !charge.amount || !charge.allocation_method) {
        return NextResponse.json(
          { success: false, error: 'Cada cargo debe tener descripción, monto y método de asignación' },
          { status: 400 }
        );
      }
      if (charge.amount < 0) {
        return NextResponse.json(
          { success: false, error: 'Los montos de los cargos deben ser positivos' },
          { status: 400 }
        );
      }
    }

    // Subir foto/PDF al storage
    const photoPath = await uploadFileToStorage(photo, 'invoices');

    // Insertar factura
    const { data: invoice, error: invoiceError } = await supabase
      .from('utility_invoices')
      .insert({
        meter_group_id: meterGroupId,
        period: period,
        provider: provider,
        invoice_ref: invoiceRef || null,
        total_amount: totalAmount,
        due_date: dueDate || null,
        photo_path: photoPath,
      })
      .select()
      .single();

    if (invoiceError) {
      // Si es error de unique constraint, significa que ya existe una factura para ese periodo
      if (invoiceError.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Ya existe una factura para este mes y grupo de contador' },
          { status: 409 }
        );
      }
      throw invoiceError;
    }

    // Insertar cargos
    const chargesToInsert = charges.map((charge) => ({
      invoice_id: invoice.id,
      description: charge.description,
      amount: charge.amount,
      allocation_method: charge.allocation_method,
      metadata: charge.metadata || {},
    }));

    const { data: insertedCharges, error: chargesError } = await supabase
      .from('invoice_charges')
      .insert(chargesToInsert)
      .select();

    if (chargesError) {
      // Si falla la inserción de cargos, eliminar la factura creada
      await supabase.from('utility_invoices').delete().eq('id', invoice.id);
      throw chargesError;
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...invoice,
          charges: insertedCharges,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al subir factura:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const meterGroupId = searchParams.get('meterGroupId');
    const period = searchParams.get('period');

    let query = supabase
      .from('utility_invoices')
      .select(`
        *,
        meter_group:meter_groups(*),
        charges:invoice_charges(*),
        allocations:invoice_allocations(*)
      `)
      .order('period', { ascending: false });

    if (meterGroupId) {
      query = query.eq('meter_group_id', meterGroupId);
    }

    if (period) {
      query = query.eq('period', period);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error al obtener facturas:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
