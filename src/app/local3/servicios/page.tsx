'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import WhatsAppButton from '@/app/components/WhatsAppButton';
import MeterReadingForm from '@/app/components/servicios/MeterReadingForm';
import ConsumptionHistoryCard from '@/app/components/servicios/ConsumptionHistoryCard';
import { getPeriodKey } from '@/lib/servicios-utils';
import type { MeterGroup } from '@/lib/supabase-types';

export default function Local3ServiciosPage() {
  const [meterGroups, setMeterGroups] = useState<MeterGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const currentPeriod = getPeriodKey(new Date());

  useEffect(() => {
    async function loadData() {
      try {
        const unitResponse = await fetch('/api/servicios/units?code=LOCAL_3');
        const unitData = await unitResponse.json();
        if (!unitData.success || !unitData.data) {
          throw new Error('No se pudo obtener la unidad');
        }

        const groupsResponse = await fetch(`/api/servicios/meter-groups?unitId=${unitData.data.id}`);
        const groupsData = await groupsResponse.json();
        if (groupsData.success && groupsData.data) {
          setMeterGroups(groupsData.data);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
          Servicios Públicos - Local 3
        </h1>

        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            📊 Lecturas del mes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {meterGroups.map((meterGroup) => (
              <MeterReadingForm
                key={meterGroup.id}
                meterGroup={meterGroup}
                unitCode="LOCAL_3"
                currentPeriod={currentPeriod}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
            📅 Historial
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {meterGroups.map((meterGroup) => (
              <ConsumptionHistoryCard
                key={meterGroup.id}
                meterGroup={meterGroup}
                unitCode="LOCAL_3"
                months={6}
              />
            ))}
          </div>
        </section>
      </div>

      <WhatsAppButton />
    </main>
  );
}
