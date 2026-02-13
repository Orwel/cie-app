'use client';

import { useState } from 'react';
import { getServiceLabel, getPeriodKey, formatPeriod, isValidFileType, isValidFileSize } from '@/lib/servicios-utils';
import type { MeterGroup, UnitCode } from '@/lib/supabase-types';
import ImageLightbox from './ImageLightbox';

interface MeterReadingFormProps {
  meterGroup: MeterGroup;
  unitCode: UnitCode;
  currentPeriod: string;
}

export default function MeterReadingForm({
  meterGroup,
  unitCode,
  currentPeriod,
}: MeterReadingFormProps) {
  const [readingValue, setReadingValue] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const serviceLabel = getServiceLabel(meterGroup.service_type);
  const periodFormatted = formatPeriod(currentPeriod);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidFileType(file)) {
      setMessage({ type: 'error', text: 'El archivo debe ser una imagen (JPEG, PNG, WebP) o PDF' });
      return;
    }

    if (!isValidFileSize(file)) {
      setMessage({ type: 'error', text: 'El archivo no puede exceder 5MB' });
      return;
    }

    setPhoto(file);
    setMessage(null);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!photo) {
      setMessage({ type: 'error', text: 'Debes seleccionar una foto del contador' });
      return;
    }

    const value = parseFloat(readingValue);
    if (isNaN(value) || value < 0) {
      setMessage({ type: 'error', text: 'El valor de lectura debe ser un número positivo' });
      return;
    }

    setLoading(true);

    try {
      // Obtener unit_id desde el código
      const unitResponse = await fetch(`/api/servicios/units?code=${unitCode}`);
      const unitData = await unitResponse.json();
      if (!unitData.success || !unitData.data) {
        throw new Error('No se pudo obtener la unidad');
      }
      const unitId = unitData.data.id;

      const formData = new FormData();
      formData.append('meterGroupId', meterGroup.id);
      formData.append('unitId', unitId);
      formData.append('period', currentPeriod);
      formData.append('readingValue', readingValue);
      formData.append('photo', photo);

      const response = await fetch('/api/servicios/readings', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error al subir la lectura');
      }

      setMessage({ type: 'success', text: '✅ Lectura subida con éxito' });
      setReadingValue('');
      setPhoto(null);
      setPhotoPreview(null);
      
      // Reset file input
      const fileInput = document.getElementById(`photo-${meterGroup.id}`) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ ${error.message || 'Error al procesar la solicitud'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
          📊 Lectura de {serviceLabel.name} - {periodFormatted}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={`reading-${meterGroup.id}`}
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Valor de lectura actual (en {serviceLabel.unit})
            </label>
            <input
              id={`reading-${meterGroup.id}`}
              type="number"
              step="0.01"
              min="0"
              value={readingValue}
              onChange={(e) => setReadingValue(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1234.56"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor={`photo-${meterGroup.id}`}
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Foto del contador
            </label>
            <input
              id={`photo-${meterGroup.id}`}
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
                  className="max-w-full h-32 object-contain rounded cursor-pointer"
                  onClick={() => setShowLightbox(true)}
                />
              </div>
            )}
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
            {loading ? 'Subiendo...' : 'Subir lectura'}
          </button>
        </form>
      </div>

      {showLightbox && photoPreview && (
        <ImageLightbox
          imagePath={photoPreview}
          onClose={() => setShowLightbox(false)}
          alt="Preview de foto del contador"
        />
      )}
    </>
  );
}
