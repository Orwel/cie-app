'use client';

import { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface MetricsData {
  sessionStart: number;
  timeOnPage: number;
  pageViews: number;
  whatsappClicks: number;
  browserInfo: string;
  screenSize: string;
  referrer: string;
  userAgent: string;
}

export default function MetricsPage() {
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData>({
    sessionStart: Date.now(),
    timeOnPage: 0,
    pageViews: 1,
    whatsappClicks: 0,
    browserInfo: '',
    screenSize: '',
    referrer: '',
    userAgent: '',
  });

  const { trackSectionView } = useAnalytics();

  useEffect(() => {
    setMounted(true);
    
    // Track que alguien visitó la página de métricas
    trackSectionView('metrics_page');

    // Obtener información del navegador
    setMetrics(prev => ({
      ...prev,
      browserInfo: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                  navigator.userAgent.includes('Firefox') ? 'Firefox' :
                  navigator.userAgent.includes('Safari') ? 'Safari' : 'Otro',
      screenSize: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer || 'Directo',
      userAgent: navigator.userAgent,
    }));

    // Timer para tiempo en página
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        timeOnPage: Math.floor((Date.now() - prev.sessionStart) / 1000)
      }));
    }, 1000);

    // Obtener datos de localStorage si existen
    const savedMetrics = localStorage.getItem('cielocanto_metrics');
    if (savedMetrics) {
      try {
        const parsed = JSON.parse(savedMetrics);
        setMetrics(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.log('Error parsing saved metrics:', error);
      }
    }

    return () => clearInterval(interval);
  }, [trackSectionView]);

  // Guardar métricas en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cielocanto_metrics', JSON.stringify(metrics));
    }
  }, [metrics, mounted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  // No renderizar nada hasta que el componente esté montado en el cliente
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-400">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">📊 Métricas de Cielocanto</h1>
          <p className="text-gray-400">Panel de análisis en tiempo real</p>
        </div>

        {/* Navegación */}
        <div className="mb-8">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            ← Volver al sitio
          </a>
        </div>

        {/* Grid de métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Tiempo en sesión" 
            value={formatTime(metrics.timeOnPage)} 
            icon="⏱️" 
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Páginas vistas" 
            value={metrics.pageViews} 
            icon="👀" 
            color="from-green-500 to-green-600"
          />
          <StatCard 
            title="Clicks WhatsApp" 
            value={metrics.whatsappClicks} 
            icon="💬" 
            color="from-purple-500 to-purple-600"
          />
          <StatCard 
            title="Navegador" 
            value={metrics.browserInfo} 
            icon="🌐" 
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información de sesión */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">🔍</span> Información de Sesión
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Resolución de pantalla:</span>
                <span className="font-semibold">{metrics.screenSize}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Referrer:</span>
                <span className="font-semibold text-sm">{metrics.referrer}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400">Hora de inicio:</span>
                <span className="font-semibold">
                  {new Date(metrics.sessionStart).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones disponibles */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚡</span> Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => window.open('https://analytics.google.com', '_blank')}
                className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">📈</span> Abrir Google Analytics
              </button>
              <button 
                onClick={() => setMetrics(prev => ({ ...prev, pageViews: prev.pageViews + 1 }))}
                className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🔄</span> Simular Vista de Página
              </button>
              <button 
                onClick={() => setMetrics(prev => ({ ...prev, whatsappClicks: prev.whatsappClicks + 1 }))}
                className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center justify-center"
              >
                <span className="mr-2">💬</span> Simular Click WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">ℹ️</span> Información Importante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-400">📊 Métricas Completas</h3>
              <p className="text-gray-300 text-sm">
                Para ver métricas completas y detalladas, visita tu panel de Google Analytics. 
                Ahí encontrarás datos sobre visitantes únicos, ubicaciones, dispositivos y mucho más.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-400">🔄 Actualización en Tiempo Real</h3>
              <p className="text-gray-300 text-sm">
                Esta página muestra métricas de tu sesión actual. Los datos se actualizan automáticamente 
                y se guardan localmente en tu navegador.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🏠 Cielocanto - Panel de Métricas | Datos actualizados en tiempo real</p>
        </div>
      </div>
    </div>
  );
} 