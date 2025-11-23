'use client';

import { useState } from 'react';
import CalendarView from '../reservas/components/CalendarView';
import TimeSlotSelector from '../reservas/components/TimeSlotSelector';
import PaymentInfo from '../reservas/components/PaymentInfo';

export default function Reservas() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowTimeSelector(true);
  };

  const handleReservationComplete = () => {
    setRefreshKey(prev => prev + 1);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center sm:text-left">
            Reserva de Lavadoras
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6 text-justify sm:text-left">
            Reserva tu espacio de tiempo en nuestras lavadoras disponibles. 
            Selecciona una lavadora y posteriormente, selecciona un día en el calendario para ver los horarios disponibles y las instrucciones de uso haciendo click en "Ver las instrucciones de uso".
          </p>
        </div>

        <PaymentInfo />

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Calendario de Disponibilidad</h2>
          <p className="text-sm text-gray-400 mb-4">
            Haz clic en un día para ver los horarios disponibles y realizar tu reserva.
            El tiempo mínimo de reserva es de 3 horas.
          </p>
        </div>

        <div key={refreshKey}>
          <CalendarView onDateSelect={handleDateSelect} />
        </div>

        <TimeSlotSelector
          isOpen={showTimeSelector}
          onClose={() => {
            setShowTimeSelector(false);
            setSelectedDate(null);
          }}
          selectedDate={selectedDate}
          onReservationComplete={handleReservationComplete}
        />

        <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Información Importante</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Tiempo mínimo de reserva: <strong>3 horas</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Costo por uso: <strong>$20.000 COP</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>El pago no incluye jabones ni detergente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Debes estar pendiente cuando termine el ciclo y recoger tus cosas a tiempo</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">•</span>
              <span>Eres responsable por el uso adecuado de la máquina y cualquier daño potencial</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
