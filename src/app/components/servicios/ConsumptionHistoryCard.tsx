'use client';

import { useState, useEffect } from 'react';
import { getServiceLabel, formatPeriod, formatCurrency, formatNumber, getStoragePublicUrl, getPreviousPeriod } from '@/lib/servicios-utils';
import type { MeterGroup, UnitCode, MeterReading, UtilityInvoice, InvoiceAllocation } from '@/lib/supabase-types';
import ImageLightbox from './ImageLightbox';

interface ConsumptionHistoryCardProps {
  meterGroup: MeterGroup;
  unitCode: UnitCode;
  months?: number;
}

interface HistoryEntry {
  period: string;
  reading: MeterReading | null;
  previousReading: MeterReading | null;
  consumption: number | null;
  invoice: UtilityInvoice | null;
  allocation: InvoiceAllocation | null;
}

export default function ConsumptionHistoryCard({
  meterGroup,
  unitCode,
  months = 6,
}: ConsumptionHistoryCardProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [unitId, setUnitId] = useState<string | null>(null);

  const serviceLabel = getServiceLabel(meterGroup.service_type);

  useEffect(() => {
    async function loadHistory() {
      try {
        // Obtener unit_id
        const unitResponse = await fetch(`/api/servicios/units?code=${unitCode}`);
        const unitData = await unitResponse.json();
        if (!unitData.success || !unitData.data) {
          throw new Error('No se pudo obtener la unidad');
        }
        const uId = unitData.data.id;
        setUnitId(uId);

        // Generar lista de periodos (últimos N meses)
        const periods: string[] = [];
        const today = new Date();
        for (let i = 0; i < months; i++) {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          periods.push(period);
        }

        // Obtener lecturas y facturas para estos periodos
        const readingsResponse = await fetch(
          `/api/servicios/readings?meterGroupId=${meterGroup.id}&unitId=${uId}`
        );
        const readingsData = await readingsResponse.json();

        const invoicesResponse = await fetch(
          `/api/servicios/invoices?meterGroupId=${meterGroup.id}`
        );
        const invoicesData = await invoicesResponse.json();

        const readings = readingsData.success ? readingsData.data : [];
        const invoices = invoicesData.success ? invoicesData.data : [];

        // Construir historial
        const historyEntries: HistoryEntry[] = periods.map((period) => {
          const reading = readings.find((r: MeterReading) => r.period === period) || null;
          const previousPeriod = getPreviousPeriod(period);
          const previousReading =
            readings.find((r: MeterReading) => r.period === previousPeriod) || null;
          const invoice = invoices.find((i: UtilityInvoice) => i.period === period) || null;

          let consumption: number | null = null;
          if (reading && previousReading) {
            consumption = Number(reading.reading_value) - Number(previousReading.reading_value);
          }

          // Obtener allocation si existe
          let allocation: InvoiceAllocation | null = null;
          if (invoice && invoice.allocations) {
            allocation = invoice.allocations.find((a: InvoiceAllocation) => a.unit_id === uId) || null;
          }

          return {
            period,
            reading,
            previousReading,
            consumption,
            invoice,
            allocation,
          };
        });

        setHistory(historyEntries);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [meterGroup.id, unitCode, months]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="text-gray-400">Cargando historial...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
          📅 Historial - {serviceLabel.name}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-2 text-gray-300">Mes</th>
                <th className="text-right py-2 px-2 text-gray-300">Lectura</th>
                <th className="text-right py-2 px-2 text-gray-300">Consumo</th>
                <th className="text-right py-2 px-2 text-gray-300">Factura</th>
                <th className="text-right py-2 px-2 text-gray-300">Tu monto</th>
                <th className="text-center py-2 px-2 text-gray-300">Fotos</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.period} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-2 text-gray-300">{formatPeriod(entry.period)}</td>
                  <td className="py-3 px-2 text-right text-gray-300">
                    {entry.reading ? (
                      <span>{formatNumber(Number(entry.reading.reading_value), 2)}</span>
                    ) : (
                      <span className="text-yellow-500 text-xs">Pendiente</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-300">
                    {entry.consumption !== null ? (
                      <span>{formatNumber(entry.consumption, 2)} {serviceLabel.unit}</span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-300">
                    {entry.invoice ? (
                      <span>{formatCurrency(Number(entry.invoice.total_amount))}</span>
                    ) : (
                      <span className="text-yellow-500 text-xs">Pendiente</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-white">
                    {entry.allocation ? (
                      <span>{formatCurrency(Number(entry.allocation.amount))}</span>
                    ) : entry.invoice ? (
                      <span className="text-gray-500 text-xs">No calculado</span>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex gap-2 justify-center">
                      {entry.reading && (
                        <button
                          onClick={() => setLightboxImage(entry.reading!.photo_path)}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                          title="Ver foto de lectura"
                        >
                          📷
                        </button>
                      )}
                      {entry.invoice && (
                        <button
                          onClick={() => setLightboxImage(entry.invoice!.photo_path)}
                          className="text-green-400 hover:text-green-300 text-xs"
                          title="Ver factura"
                        >
                          📄
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No hay historial disponible
          </div>
        )}
      </div>

      {lightboxImage && (
        <ImageLightbox
          imagePath={lightboxImage}
          onClose={() => setLightboxImage(null)}
          alt="Imagen del historial"
        />
      )}
    </>
  );
}
