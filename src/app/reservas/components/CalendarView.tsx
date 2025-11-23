'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase, Reserva } from '@/lib/supabase';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
}

export default function CalendarView({ onDateSelect }: CalendarViewProps) {
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [currentDate]);

  useEffect(() => {
    // Inyectar estilos para mejorar el contraste y responsive
    const style = document.createElement('style');
    style.textContent = `
      /* Botones de navegación - texto blanco */
      .rbc-toolbar button {
        color: white !important;
      }
      
      /* Label del mes/año - texto blanco */
      .rbc-toolbar-label {
        color: white !important;
      }
      
      /* Día seleccionado - fondo blanco */
      .rbc-day-bg.rbc-selected {
        background-color: #ffffff !important;
      }
      
      /* Texto del día cuando está seleccionado - debe ser negro */
      .rbc-month-row .rbc-day-bg.rbc-selected ~ .rbc-date-cell,
      .rbc-month-row .rbc-day-bg.rbc-selected + .rbc-date-cell {
        color: #000000 !important;
      }
      
      .rbc-month-row .rbc-day-bg.rbc-selected ~ .rbc-date-cell a,
      .rbc-month-row .rbc-day-bg.rbc-selected + .rbc-date-cell a {
        color: #000000 !important;
      }
      
      /* Estilo adicional usando selector de hermanos adyacentes */
      .rbc-day-bg.rbc-selected ~ .rbc-date-cell,
      .rbc-day-bg.rbc-selected + .rbc-date-cell {
        color: #000000 !important;
      }
      
      .rbc-day-bg.rbc-selected ~ .rbc-date-cell a,
      .rbc-day-bg.rbc-selected + .rbc-date-cell a {
        color: #000000 !important;
      }
      
      /* Día de hoy - fondo amarillo claro con texto negro */
      .rbc-day-bg.rbc-today {
        background-color: #fef3c7 !important;
      }
      
      .rbc-month-row .rbc-day-bg.rbc-today ~ .rbc-date-cell,
      .rbc-month-row .rbc-day-bg.rbc-today + .rbc-date-cell {
        color: #000000 !important;
      }
      
      .rbc-month-row .rbc-day-bg.rbc-today ~ .rbc-date-cell a,
      .rbc-month-row .rbc-day-bg.rbc-today + .rbc-date-cell a {
        color: #000000 !important;
        font-weight: 600 !important;
      }
      
      /* Asegurar texto negro en día de hoy */
      .rbc-day-bg.rbc-today ~ .rbc-date-cell,
      .rbc-day-bg.rbc-today + .rbc-date-cell {
        color: #000000 !important;
      }
      
      .rbc-day-bg.rbc-today ~ .rbc-date-cell a,
      .rbc-day-bg.rbc-today + .rbc-date-cell a {
        color: #000000 !important;
        font-weight: 600 !important;
      }
      
      /* Responsive - Mobile */
      @media (max-width: 640px) {
        /* Toolbar responsive - apilar botones verticalmente */
        .rbc-toolbar {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          padding: 8px !important;
          align-items: stretch !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Forzar que todos los elementos hijos se apilen */
        .rbc-toolbar > * {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .rbc-toolbar button {
          font-size: 12px !important;
          padding: 8px 12px !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          display: block !important;
        }
        
        /* Grupo de botones de navegación */
        .rbc-toolbar button + button {
          margin-top: 8px !important;
        }
        
        .rbc-toolbar-label {
          font-size: 14px !important;
          margin: 4px 0 !important;
          text-align: center !important;
          width: 100% !important;
          box-sizing: border-box !important;
          order: -1 !important; /* Mover el label al inicio */
        }
        
        /* Estilos específicos para los grupos de botones */
        .rbc-toolbar .rbc-btn-group {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
          gap: 8px !important;
        }
        
        .rbc-toolbar .rbc-btn-group button {
          width: 100% !important;
          margin: 0 !important;
        }
        
        /* Contenedor del calendario */
        .rbc-calendar {
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        
        /* Celdas del calendario MUCHO más grandes en mobile */
        .rbc-date-cell {
          font-size: 16px !important;
          padding: 8px 4px !important;
          min-height: 70px !important;
          line-height: 1.4 !important;
        }
        
        .rbc-day-bg {
          min-height: 80px !important;
        }
        
        /* Headers de días más pequeños pero legibles */
        .rbc-header {
          font-size: 12px !important;
          padding: 10px 4px !important;
          font-weight: 600 !important;
        }
        
        /* Eventos en mobile - emoji + nombre truncado */
        .rbc-event {
          font-size: 11px !important;
          padding: 4px 6px !important;
          line-height: 1.4 !important;
          min-height: 24px !important;
          margin-bottom: 2px !important;
        }
        
        .rbc-event-content {
          font-size: 11px !important;
          padding: 0 !important;
          text-align: left !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 4px !important;
        }
        
        .rbc-month-row {
          min-height: 90px !important;
        }
        
        /* Más espacio entre filas */
        .rbc-month-view {
          border-spacing: 2px !important;
        }
        
        /* Día de hoy en mobile - texto negro */
        .rbc-day-bg.rbc-today ~ .rbc-date-cell,
        .rbc-day-bg.rbc-today + .rbc-date-cell {
          color: #000000 !important;
        }
        
        .rbc-day-bg.rbc-today ~ .rbc-date-cell a,
        .rbc-day-bg.rbc-today + .rbc-date-cell a {
          color: #000000 !important;
          font-weight: 700 !important;
        }
        
        /* Ajustar altura del calendario en mobile */
        .rbc-calendar {
          font-size: 12px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Observer para aplicar estilos cuando se selecciona un día o es el día de hoy
    const applyDayStyles = () => {
      // Aplicar estilos a días seleccionados
      const selectedDays = document.querySelectorAll('.rbc-day-bg.rbc-selected');
      selectedDays.forEach((dayBg) => {
        const dateCell = dayBg.nextElementSibling as HTMLElement;
        if (dateCell && dateCell.classList.contains('rbc-date-cell')) {
          dateCell.style.color = '#000000';
          const link = dateCell.querySelector('a') as HTMLElement;
          if (link) {
            link.style.color = '#000000';
          }
        }
      });
      
      // Aplicar estilos al día de hoy - buscar en toda la fila y aplicar directamente
      const todayDays = document.querySelectorAll('.rbc-day-bg.rbc-today');
      todayDays.forEach((dayBg) => {
        // Buscar la celda de fecha correspondiente en la misma fila usando el índice
        const row = dayBg.closest('.rbc-month-row');
        if (row) {
          const dateCells = row.querySelectorAll('.rbc-date-cell');
          const dayIndex = Array.from(row.querySelectorAll('.rbc-day-bg')).indexOf(dayBg);
          if (dateCells[dayIndex]) {
            const dateCell = dateCells[dayIndex] as HTMLElement;
            dateCell.style.color = '#000000';
            const link = dateCell.querySelector('a') as HTMLElement;
            if (link) {
              link.style.color = '#000000';
              link.style.fontWeight = '700';
            }
          }
        }
      });
    };

    const observer = new MutationObserver(() => {
      applyDayStyles();
    });
    
    // Aplicar estilos inmediatamente y después de pequeños delays
    setTimeout(applyDayStyles, 100);
    setTimeout(applyDayStyles, 500);
    setTimeout(applyDayStyles, 1000);
    setTimeout(applyDayStyles, 2000);
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      observer.disconnect();
    };
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    // Obtener reservas del mes actual y el siguiente
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
    
    const startStr = format(startOfMonth, 'yyyy-MM-dd');
    const endStr = format(endOfMonth, 'yyyy-MM-dd');

    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .gte('fecha', startStr)
      .lte('fecha', endStr)
      .in('estado', ['pendiente', 'confirmada']);

    if (error) {
      console.error('Error fetching reservations:', error);
    } else {
      setReservations(data || []);
    }
    setLoading(false);
  };

  const events = useMemo(() => {
    return reservations.map(reserva => {
      const start = new Date(`${reserva.fecha}T${reserva.hora_inicio}`);
      const end = new Date(`${reserva.fecha}T${reserva.hora_fin}`);
      
      return {
        id: reserva.id,
        title: `${reserva.lavadora === 'blanca' ? '🧺' : '🩶'} ${reserva.nombre_huésped}`,
        start,
        end,
        resource: reserva.lavadora,
        nombre: reserva.nombre_huésped,
      };
    });
  }, [reservations]);

  const eventStyleGetter = (event: any) => {
    const isBlanca = event.resource === 'blanca';
    
    return {
      style: {
        backgroundColor: isBlanca ? '#3b82f6' : '#6b7280',
        borderColor: isBlanca ? '#2563eb' : '#4b5563',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: isMobile ? '3px 4px' : '2px 4px',
        fontSize: isMobile ? '11px' : '12px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minHeight: isMobile ? '22px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        lineHeight: '1.3',
      },
    };
  };

  const handleSelectSlot = ({ start }: { start: Date }) => {
    onDateSelect(start);
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-2 sm:p-4 border border-gray-700 mb-8 overflow-x-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ 
          height: isMobile ? 850 : 600,
          minHeight: isMobile ? 850 : 500
        }}
        onSelectSlot={handleSelectSlot}
        selectable
        longPressThreshold={10}
        onDrillDown={(date) => onDateSelect(date)}
        onNavigate={handleNavigate}
        defaultDate={new Date()}
        defaultView="month"
        views={['month']}
        eventPropGetter={eventStyleGetter}
        components={{
            event: ({ event }: any) => {
              if (isMobile) {
                // En mobile mostrar emoji + nombre truncado
                const nombreCorto = event.nombre ? event.nombre.split(' ')[0] : '';
                const emoji = event.resource === 'blanca' ? '🧺' : '🩶';
                return (
                  <div className="rbc-event-content" title={event.title} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{emoji}</span>
                    {nombreCorto && <span style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nombreCorto}</span>}
                  </div>
                );
              }
              return (
                <div className="rbc-event-content" title={event.title}>
                  {event.title}
                </div>
              );
            }
          }}
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay reservas en este rango',
        }}
        className="text-white"
      />
    </div>
  );
}

