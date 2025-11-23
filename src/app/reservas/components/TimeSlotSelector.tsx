'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, addHours, isBefore, isAfter, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase, Reserva } from '@/lib/supabase';
import ReservationForm from './ReservationForm';
import InstructionsModal from './InstructionsModal';

interface TimeSlotSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onReservationComplete: () => void;
}

export default function TimeSlotSelector({ 
  isOpen, 
  onClose, 
  selectedDate,
  onReservationComplete 
}: TimeSlotSelectorProps) {
  const [selectedMachine, setSelectedMachine] = useState<'blanca' | 'gris' | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [existingReservations, setExistingReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isOpen && selectedDate) {
      fetchReservations();
    }
  }, [isOpen, selectedDate]);

  const fetchReservations = async () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('fecha', dateStr)
      .in('estado', ['pendiente', 'confirmada']);

    if (error) {
      console.error('Error fetching reservations:', error);
      return;
    }

    setExistingReservations(data || []);
  };

  const isSlotOccupied = (hour: number, machine: 'blanca' | 'gris'): boolean => {
    if (!selectedDate) return false;
    
    const slotStart = setMinutes(setHours(selectedDate, hour), 0);
    const slotEnd = addHours(slotStart, 1);

    return existingReservations.some(reserva => {
      if (reserva.lavadora !== machine) return false;
      
      const reservaStart = new Date(`${reserva.fecha}T${reserva.hora_inicio}`);
      const reservaEnd = new Date(`${reserva.fecha}T${reserva.hora_fin}`);
      
      return (
        (isAfter(slotStart, reservaStart) && isBefore(slotStart, reservaEnd)) ||
        (isAfter(slotEnd, reservaStart) && isBefore(slotEnd, reservaEnd)) ||
        (isBefore(slotStart, reservaStart) && isAfter(slotEnd, reservaEnd))
      );
    });
  };

  const handleTimeSelect = (hour: number) => {
    if (!selectedMachine) {
      alert('Por favor selecciona una lavadora primero');
      return;
    }

    if (isSlotOccupied(hour, selectedMachine)) {
      alert('Este horario ya está ocupado');
      return;
    }

    if (!startTime) {
      setStartTime(`${hour.toString().padStart(2, '0')}:00`);
    } else if (!endTime) {
      const startHour = parseInt(startTime.split(':')[0]);
      if (hour <= startHour) {
        alert('La hora de fin debe ser posterior a la hora de inicio');
        return;
      }
      const duration = hour - startHour;
      if (duration < 3) {
        alert('El tiempo mínimo de reserva es de 3 horas');
        return;
      }
      setEndTime(`${hour.toString().padStart(2, '0')}:00`);
    } else {
      setStartTime(`${hour.toString().padStart(2, '0')}:00`);
      setEndTime('');
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (!isOpen || !selectedDate) return null;

  const dateStr = format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Seleccionar Horario</h2>
            <p className="text-sm text-gray-400 mt-1">{dateStr}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Selección de lavadora */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecciona la lavadora:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSelectedMachine('blanca');
                  setStartTime('');
                  setEndTime('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMachine === 'blanca'
                    ? 'border-white bg-white/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">🧺</div>
                <div className="font-semibold text-white">Lavadora Blanca</div>
                <div className="text-xs text-gray-400 mt-1">Lavadora + Secadora</div>
              </button>
              <button
                onClick={() => {
                  setSelectedMachine('gris');
                  setStartTime('');
                  setEndTime('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMachine === 'gris'
                    ? 'border-white bg-white/10'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-2">🩶</div>
                <div className="font-semibold text-white">Lavadora Gris</div>
                <div className="text-xs text-gray-400 mt-1">Lava y seca</div>
              </button>
            </div>
          </div>

          {selectedMachine && (
            <div className="mb-4">
              <button
                onClick={() => setShowInstructions(true)}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Ver instrucciones de uso
              </button>
            </div>
          )}

          {/* Grid de horas */}
          {selectedMachine && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Selecciona el rango de horas (mínimo 3 horas):
              </label>
              {startTime && (
                <div className="mb-3 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                  <p className="text-sm text-white">
                    <span className="font-semibold">Inicio:</span> {startTime}
                    {endTime && (
                      <>
                        {' '}→ <span className="font-semibold">Fin:</span> {endTime}
                        {' '}({parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} horas)
                      </>
                    )}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2">
                {hours.map(hour => {
                  const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                  const isOccupied = isSlotOccupied(hour, selectedMachine);
                  const isSelected = startTime === hourStr || 
                    (startTime && endTime && 
                     parseInt(hourStr.split(':')[0]) >= parseInt(startTime.split(':')[0]) &&
                     parseInt(hourStr.split(':')[0]) < parseInt(endTime.split(':')[0]));
                  const isStart = startTime === hourStr;
                  const isEnd = endTime === hourStr;

                  return (
                    <button
                      key={hour}
                      onClick={() => handleTimeSelect(hour)}
                      disabled={isOccupied}
                      className={`
                        p-2 rounded text-sm font-medium transition-all
                        ${isOccupied 
                          ? 'bg-red-900/30 border border-red-700 text-red-400 cursor-not-allowed' 
                          : isSelected
                          ? isStart || isEnd
                            ? 'bg-blue-600 border-2 border-blue-400 text-white'
                            : 'bg-blue-600/50 border border-blue-500 text-white'
                          : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                        }
                      `}
                    >
                      {hourStr}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-900/30 border border-red-700 rounded"></div>
                  <span>Ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 border border-blue-400 rounded"></div>
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>
          )}

          {selectedMachine && startTime && endTime && (
            <ReservationForm
              date={selectedDate}
              startTime={startTime}
              endTime={endTime}
              machine={selectedMachine}
              onSuccess={() => {
                onReservationComplete();
                onClose();
              }}
              onShowInstructions={() => setShowInstructions(true)}
            />
          )}
        </div>
      </div>

      {showInstructions && selectedMachine && (
        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          machine={selectedMachine}
        />
      )}
    </div>
  );
}

