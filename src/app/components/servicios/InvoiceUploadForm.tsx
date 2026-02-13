'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/servicios-utils';
import type { MeterGroup, AllocationMethod, UnitCode } from '@/lib/supabase-types';

interface InvoiceCharge {
  description: string;
  amount: string;
  allocation_method: AllocationMethod;
  metadata: Record<string, any>;
}

interface MeterGroupUnit {
  unit_id: string;
  unit: {
    code: UnitCode;
    name: string;
  };
}

interface InvoiceUploadFormProps {
  meterGroup: MeterGroup;
  period: string;
  onSuccess?: () => void;
}

export default function InvoiceUploadForm({
  meterGroup,
  period,
  onSuccess,
}: InvoiceUploadFormProps) {
  const [provider, setProvider] = useState('');
  const [invoiceRef, setInvoiceRef] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [charges, setCharges] = useState<InvoiceCharge[]>([
    { description: '', amount: '', allocation_method: 'PROPORTIONAL_CONSUMPTION', metadata: {} },
  ]);
  const [meterGroupUnits, setMeterGroupUnits] = useState<MeterGroupUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadMeterGroupUnits() {
      try {
        const response = await fetch(`/api/servicios/meter-group-units?meterGroupId=${meterGroup.id}`);
        const data = await response.json();
        if (data.success && data.data) {
          setMeterGroupUnits(data.data);
        }
      } catch (error) {
        console.error('Error al cargar unidades del grupo:', error);
      }
    }
    loadMeterGroupUnits();
  }, [meterGroup.id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addCharge = () => {
    setCharges([
      ...charges,
      { description: '', amount: '', allocation_method: 'PROPORTIONAL_CONSUMPTION', metadata: {} },
    ]);
  };

  const removeCharge = (index: number) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const updateCharge = (index: number, field: keyof InvoiceCharge, value: any) => {
    const updated = [...charges];
    updated[index] = { ...updated[index], [field]: value };
    setCharges(updated);
  };

  const updateChargeMetadata = (index: number, metadata: Record<string, any>) => {
    const updated = [...charges];
    updated[index] = { ...updated[index], metadata };
    setCharges(updated);
  };

  const calculateTotal = () => {
    return charges.reduce((sum, charge) => {
      const amount = parseFloat(charge.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const totalCharges = calculateTotal();
  const totalAmountNum = parseFloat(totalAmount) || 0;
  const difference = Math.abs(totalCharges - totalAmountNum);
  const differencePercent = totalAmountNum > 0 ? (difference / totalAmountNum) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!photo) {
      setMessage({ type: 'error', text: 'Debes seleccionar una foto/PDF de la factura' });
      return;
    }

    if (!provider || !totalAmount) {
      setMessage({ type: 'error', text: 'Provider y monto total son requeridos' });
      return;
    }

    // Validar cargos
    for (const charge of charges) {
      if (!charge.description || !charge.amount) {
        setMessage({ type: 'error', text: 'Todos los cargos deben tener descripción y monto' });
        return;
      }

      const amount = parseFloat(charge.amount);
      if (isNaN(amount) || amount < 0) {
        setMessage({ type: 'error', text: 'Los montos de los cargos deben ser números positivos' });
        return;
      }

      // Validar metadata según método
      if (charge.allocation_method === 'FIXED_AMOUNT' && !charge.metadata.targetUnitCode) {
        setMessage({ type: 'error', text: 'Debes seleccionar una unidad para FIXED_AMOUNT' });
        return;
      }

      if (charge.allocation_method === 'PERCENTAGE') {
        const percentages = charge.metadata.percentages || {};
        const total = Object.values(percentages).reduce((sum: number, pct: any) => sum + (Number(pct) || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          setMessage({ type: 'error', text: `Los porcentajes deben sumar 100% (actualmente suman ${total.toFixed(2)}%)` });
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('meterGroupId', meterGroup.id);
      formData.append('period', period);
      formData.append('provider', provider);
      formData.append('invoiceRef', invoiceRef);
      formData.append('totalAmount', totalAmount);
      formData.append('dueDate', dueDate);
      formData.append('photo', photo);
      formData.append(
        'charges',
        JSON.stringify(
          charges.map((c) => ({
            description: c.description,
            amount: parseFloat(c.amount),
            allocation_method: c.allocation_method,
            metadata: c.metadata,
          }))
        )
      );

      const response = await fetch('/api/servicios/invoices', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al subir la factura');
      }

      setMessage({ type: 'success', text: '✅ Factura subida con éxito' });
      
      // Reset form
      setProvider('');
      setInvoiceRef('');
      setTotalAmount('');
      setDueDate('');
      setPhoto(null);
      setPhotoPreview(null);
      setCharges([
        { description: '', amount: '', allocation_method: 'PROPORTIONAL_CONSUMPTION', metadata: {} },
      ]);

      // Notificar al padre
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ ${error.message || 'Error al procesar la solicitud'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
        💵 Subir Factura
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proveedor *
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Acueducto de Bogotá"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Referencia de factura
            </label>
            <input
              type="text"
              value={invoiceRef}
              onChange={(e) => setInvoiceRef(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Número de factura"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Monto total *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Foto/PDF de la factura *
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handlePhotoChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            required
            disabled={loading}
          />
          {photoPreview && (
            <div className="mt-3">
              <img
                src={photoPreview}
                alt="Preview"
                className="max-w-full h-32 object-contain rounded"
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-300">
              Desgloses de cargos *
            </label>
            <button
              type="button"
              onClick={addCharge}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              disabled={loading}
            >
              + Añadir cargo
            </button>
          </div>

          <div className="space-y-4">
            {charges.map((charge, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Descripción *
                    </label>
                    <input
                      type="text"
                      value={charge.description}
                      onChange={(e) => updateCharge(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-500"
                      placeholder="Ej: Consumo base"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Monto *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={charge.amount}
                      onChange={(e) => updateCharge(index, 'amount', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-500"
                      placeholder="0.00"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Método de asignación *
                  </label>
                  <select
                    value={charge.allocation_method}
                    onChange={(e) =>
                      updateCharge(index, 'allocation_method', e.target.value as AllocationMethod)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    disabled={loading}
                  >
                    <option value="PROPORTIONAL_CONSUMPTION">Proporcional al consumo</option>
                    <option value="EQUAL_SPLIT">División equitativa</option>
                    <option value="FIXED_AMOUNT">Monto fijo a unidad</option>
                    <option value="PERCENTAGE">Porcentajes</option>
                  </select>
                </div>

                {charge.allocation_method === 'FIXED_AMOUNT' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Unidad objetivo *
                    </label>
                    <select
                      value={charge.metadata.targetUnitCode || ''}
                      onChange={(e) =>
                        updateChargeMetadata(index, { targetUnitCode: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccionar unidad</option>
                      {meterGroupUnits.map((mgu) => (
                        <option key={mgu.unit_id} value={mgu.unit.code}>
                          {mgu.unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {charge.allocation_method === 'PERCENTAGE' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">
                      Porcentajes por unidad (debe sumar 100%) *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {meterGroupUnits.map((mgu) => (
                        <div key={mgu.unit_id}>
                          <label className="block text-xs text-gray-400 mb-1">
                            {mgu.unit.name}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={
                              charge.metadata.percentages?.[mgu.unit.code] || ''
                            }
                            onChange={(e) => {
                              const percentages = {
                                ...(charge.metadata.percentages || {}),
                                [mgu.unit.code]: e.target.value,
                              };
                              updateChargeMetadata(index, { percentages });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                            placeholder="0"
                            required
                            disabled={loading}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {charges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCharge(index)}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    disabled={loading}
                  >
                    Eliminar cargo
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Suma de cargos:</span>
              <span className="text-sm font-semibold text-white">
                {formatCurrency(totalCharges)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-300">Monto total factura:</span>
              <span className="text-sm font-semibold text-white">
                {formatCurrency(totalAmountNum)}
              </span>
            </div>
            {differencePercent > 1 && (
              <div className="mt-2 text-xs text-yellow-400">
                ⚠️ La diferencia es del {differencePercent.toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-900/50 border border-green-700 text-green-300'
                : 'bg-red-900/50 border border-red-700 text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar factura'}
        </button>
      </form>
    </div>
  );
}
