'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

interface ReservationFormProps {
  date: Date;
  startTime: string;
  endTime: string;
  machine: 'blanca' | 'gris';
  onSuccess: () => void;
  onShowInstructions: () => void;
}

export default function ReservationForm({
  date,
  startTime,
  endTime,
  machine,
  onSuccess,
  onShowInstructions
}: ReservationFormProps) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'nequi' | ''>('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!telefono.trim()) {
      setError('El teléfono es requerido');
      return;
    }

    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    if (!aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const fechaStr = format(date, 'yyyy-MM-dd');
      
      const { data, error: insertError } = await supabase
        .from('reservas')
        .insert({
          fecha: fechaStr,
          hora_inicio: startTime,
          hora_fin: endTime,
          lavadora: machine,
          nombre_huésped: nombre.trim(),
          telefono: telefono.trim(),
          email: email.trim() || null,
          metodo_pago: metodoPago,
          estado: 'pendiente',
          pago_realizado: false
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error creating reservation:', err);
      setError(err.message || 'Error al crear la reserva. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Completa tus datos</h3>
      
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nombre completo <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Teléfono <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="300 123 4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Email (opcional)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Método de pago <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodoPago('efectivo')}
            className={`p-3 rounded-lg border-2 transition-all ${
              metodoPago === 'efectivo'
                ? 'border-white bg-white/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="text-white font-medium">💰 Efectivo</div>
          </button>
          <button
            type="button"
            onClick={() => setMetodoPago('nequi')}
            className={`p-3 rounded-lg border-2 transition-all ${
              metodoPago === 'nequi'
                ? 'border-white bg-white/10'
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
            }`}
          >
            <div className="text-white font-medium">📱 Nequi</div>
            <div className="text-xs text-gray-400 mt-1">311 346 3082</div>
          </button>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
        <p className="text-sm text-yellow-200 mb-2">
          <strong>💰 Costo:</strong> $20.000 COP
        </p>
        <p className="text-xs text-yellow-300">
          ⚠️ El pago no incluye jabones ni detergente. El usuario es responsable por el uso adecuado 
          de la máquina y cualquier daño potencial. Debes estar pendiente cuando termine el ciclo 
          y recoger tus cosas a tiempo para no interferir con otros horarios.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terminos"
          checked={aceptaTerminos}
          onChange={(e) => setAceptaTerminos(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="terminos" className="text-sm text-gray-300">
          Acepto los términos y condiciones. Entiendo que debo pagar $20.000 COP, 
          que el tiempo mínimo es de 3 horas, y que soy responsable por el uso adecuado 
          de la máquina.{' '}
          <button
            type="button"
            onClick={onShowInstructions}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Ver instrucciones
          </button>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {loading ? 'Reservando...' : 'Confirmar Reserva'}
      </button>
    </form>
  );
}

