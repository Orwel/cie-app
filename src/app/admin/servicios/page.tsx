'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import WhatsAppButton from '@/app/components/WhatsAppButton';
import MeterReadingForm from '@/app/components/servicios/MeterReadingForm';
import InvoiceUploadForm from '@/app/components/servicios/InvoiceUploadForm';
import { getPeriodKey, formatPeriod, formatCurrency } from '@/lib/servicios-utils';
import type { MeterGroup, MeterReading, UtilityInvoiceWithDetails } from '@/lib/supabase-types';

export default function AdminServiciosPage() {
  const [meterGroups, setMeterGroups] = useState<MeterGroup[]>([]);
  const [selectedMeterGroupId, setSelectedMeterGroupId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(getPeriodKey(new Date()));
  const [readings, setReadings] = useState<MeterReading[]>([]);
  const [invoice, setInvoice] = useState<UtilityInvoiceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedMeterGroup = meterGroups.find((mg) => mg.id === selectedMeterGroupId);

  useEffect(() => {
    async function loadMeterGroups() {
      try {
        const response = await fetch('/api/servicios/meter-groups');
        const data = await response.json();
        if (data.success && data.data) {
          setMeterGroups(data.data);
        }
      } catch (error) {
        console.error('Error al cargar grupos de contadores:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMeterGroups();
  }, []);

  useEffect(() => {
    if (selectedMeterGroupId && selectedPeriod) {
      loadReadingsAndInvoice();
    }
  }, [selectedMeterGroupId, selectedPeriod]);

  async function loadReadingsAndInvoice() {
    if (!selectedMeterGroupId || !selectedPeriod) return;

    try {
      // Cargar lecturas
      const readingsResponse = await fetch(
        `/api/servicios/readings?meterGroupId=${selectedMeterGroupId}&period=${selectedPeriod}`
      );
      const readingsData = await readingsResponse.json();
      setReadings(readingsData.success ? readingsData.data : []);

      // Cargar factura
      const invoiceResponse = await fetch(
        `/api/servicios/invoices?meterGroupId=${selectedMeterGroupId}&period=${selectedPeriod}`
      );
      const invoiceData = await invoiceResponse.json();
      if (invoiceData.success && invoiceData.data && invoiceData.data.length > 0) {
        setInvoice(invoiceData.data[0]);
      } else {
        setInvoice(null);
      }

      setCalculationResult(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  }

  async function handleCalculate() {
    if (!invoice) {
      setMessage({ type: 'error', text: 'No hay factura para calcular' });
      return;
    }

    setCalculating(true);
    setMessage(null);
    setCalculationResult(null);

    try {
      const response = await fetch('/api/servicios/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al calcular');
      }

      setCalculationResult(result.data);
      setMessage({ type: 'success', text: '✅ Cálculo completado con éxito' });
      
      // Recargar invoice para ver las allocations
      await loadReadingsAndInvoice();
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ ${error.message || 'Error al calcular'}` });
    } finally {
      setCalculating(false);
    }
  }

  // Verificar si el meter_group tiene COMMON
  const [hasCommon, setHasCommon] = useState(false);

  useEffect(() => {
    async function checkCommon() {
      if (!selectedMeterGroupId) {
        setHasCommon(false);
        return;
      }
      try {
        const response = await fetch(
          `/api/servicios/meter-group-units?meterGroupId=${selectedMeterGroupId}`
        );
        const data = await response.json();
        if (data.success && data.data) {
          const hasCommonUnit = data.data.some(
            (mgu: any) => mgu.unit?.code === 'COMMON'
          );
          setHasCommon(hasCommonUnit);
        }
      } catch (error) {
        console.error('Error al verificar COMMON:', error);
        setHasCommon(false);
      }
    }
    checkCommon();
  }, [selectedMeterGroupId]);

  // Verificar si todas las lecturas están completas
  const allReadingsComplete = selectedMeterGroup
    ? (async () => {
        const unitsResponse = await fetch(
          `/api/servicios/meter-group-units?meterGroupId=${selectedMeterGroupId}`
        );
        const unitsData = await unitsResponse.json();
        if (!unitsData.success) return false;
        const requiredUnits = unitsData.data || [];
        return requiredUnits.every((mgu: any) =>
          readings.some((r) => r.unit_id === mgu.unit_id)
        );
      })()
    : false;

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-white">Cargando...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
          🔧 Administración de Servicios Públicos
        </h1>

        {/* Selector de meter_group y periodo */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Grupo de contador
              </label>
              <select
                value={selectedMeterGroupId}
                onChange={(e) => setSelectedMeterGroupId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar grupo de contador</option>
                {meterGroups.map((mg) => (
                  <option key={mg.id} value={mg.id}>
                    {mg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Periodo
              </label>
              <input
                type="month"
                value={selectedPeriod.substring(0, 7)}
                onChange={(e) => {
                  const date = new Date(e.target.value + '-01');
                  setSelectedPeriod(getPeriodKey(date));
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {selectedMeterGroup && selectedPeriod && (
          <>
            {/* Sección 1: Subir lectura de COMMON (si aplica) */}
            {hasCommon && (
              <section className="mb-8 sm:mb-12">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                  📊 Lectura de Áreas Comunes
                </h2>
                <div className="max-w-2xl">
                  <MeterReadingForm
                    meterGroup={selectedMeterGroup}
                    unitCode="COMMON"
                    currentPeriod={selectedPeriod}
                  />
                </div>
              </section>
            )}

            {/* Sección 2: Subir factura y cargos */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                💵 Subir Factura
              </h2>
              <InvoiceUploadForm
                meterGroup={selectedMeterGroup}
                period={selectedPeriod}
                onSuccess={loadReadingsAndInvoice}
              />
            </section>

            {/* Sección 3: Ver lecturas registradas */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                📋 Lecturas registradas - {formatPeriod(selectedPeriod)}
              </h2>
              {readings.length > 0 ? (
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
                  <div className="space-y-3">
                    {readings.map((reading) => (
                      <div
                        key={reading.id}
                        className="bg-gray-800 rounded p-3 border border-gray-700"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-white font-medium">
                              Lectura: {Number(reading.reading_value).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(reading.created_at).toLocaleDateString('es-CO')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800 text-gray-400">
                  No hay lecturas registradas para este periodo
                </div>
              )}
            </section>

            {/* Sección 4: Botón calcular */}
            <section>
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      🧮 Calcular y distribuir costos
                    </h3>
                    <p className="text-sm text-gray-400">
                      {invoice
                        ? 'Factura disponible. Verifica que todas las lecturas estén completas antes de calcular.'
                        : 'Primero debes subir la factura para este periodo.'}
                    </p>
                  </div>
                  <button
                    onClick={handleCalculate}
                    disabled={!invoice || calculating || readings.length === 0}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    {calculating ? 'Calculando...' : 'Calcular'}
                  </button>
                </div>

                {message && (
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      message.type === 'success'
                        ? 'bg-green-900/50 border border-green-700 text-green-300'
                        : 'bg-red-900/50 border border-red-700 text-red-300'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {calculationResult && (
                  <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Resultado del cálculo:
                    </h4>
                    <div className="space-y-2">
                      {calculationResult.allocations?.map((allocation: any) => (
                        <div
                          key={allocation.id}
                          className="flex justify-between items-center p-2 bg-gray-700 rounded"
                        >
                          <span className="text-gray-300">
                            {allocation.unit?.name || 'Unidad'}
                          </span>
                          <span className="text-white font-semibold">
                            {formatCurrency(Number(allocation.amount))}
                          </span>
                        </div>
                      ))}
                    </div>
                    {calculationResult.consumptions && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <h5 className="text-sm font-medium text-gray-400 mb-2">Consumos:</h5>
                        <div className="space-y-1 text-sm text-gray-300">
                          {calculationResult.consumptions.map((c: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <span>Unidad {idx + 1}</span>
                              <span>{Number(c.consumption).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {invoice && invoice.allocations && invoice.allocations.length > 0 && (
                  <div className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-lg font-semibold text-white mb-3">
                      Distribuciones guardadas:
                    </h4>
                    <div className="space-y-2">
                      {invoice.allocations.map((allocation: any) => (
                        <div
                          key={allocation.id}
                          className="flex justify-between items-center p-2 bg-gray-700 rounded"
                        >
                          <span className="text-gray-300">
                            {allocation.unit?.name || 'Unidad'}
                          </span>
                          <span className="text-white font-semibold">
                            {formatCurrency(Number(allocation.amount))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      <WhatsAppButton />
    </main>
  );
}
