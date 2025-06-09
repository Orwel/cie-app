'use client';

import { useEffect } from 'react';

const PropertyList = () => {
  
  useEffect(() => {
    // Cargar el SDK de Airbnb cuando el componente se monta
    const script = document.createElement('script');
    script.src = 'https://www.airbnb.com.co/embeddable/airbnb_jssdk';
    script.async = true;
    document.head.appendChild(script);

    // Estilos agresivos para forzar el centrado
    const style = document.createElement('style');
    style.textContent = `
      .airbnb-embed-frame {
        border-radius: 12px !important;
        overflow: hidden !important;
      }
      .airbnb-embed-frame iframe {
        border: none !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        width: 100% !important;
        height: 100% !important;
      }
      /* Ocultar el corazón/wishlist */
      .airbnb-embed-frame label[for*="wishlist"],
      .airbnb-embed-frame input[id*="wishlist"],
      .airbnb-embed-frame [class*="_1figzu9"],
      .airbnb-embed-frame [class*="_1dp4576"] {
        display: none !important;
        visibility: hidden !important;
      }
      /* Ocultar barras de scroll */
      .airbnb-embed-frame *::-webkit-scrollbar {
        display: none !important;
      }
      .airbnb-embed-frame * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      /* Ocultar botones de navegación */
      .airbnb-embed-frame button[aria-label*="Anterior"],
      .airbnb-embed-frame button[aria-label*="Siguiente"],
      .airbnb-embed-frame [class*="_gem7oc6"],
      .airbnb-embed-frame [class*="_1rftspj9"] {
        display: none !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    // Función simple para manejar la carga de embeds sin acceso cross-origin
    const handleEmbedLoad = () => {
      // Solo aplicamos estilos externos sin acceder al contenido del iframe
      const embeds = document.querySelectorAll('.airbnb-embed-frame');
      embeds.forEach(embed => {
        // Aplicar estilos solo al contenedor, no al iframe interno
        const embedElement = embed as HTMLElement;
        embedElement.style.border = '1px solid #e5e7eb';
        embedElement.style.borderRadius = '12px';
        embedElement.style.overflow = 'hidden';
      });
    };

    // Ejecutar después de un delay para que los embeds se carguen
    setTimeout(handleEmbedLoad, 1000);
    
    // También ejecutar cuando se cargue el script
    script.onload = handleEmbedLoad;

    return () => {
      const existingScript = document.querySelector('script[src="https://www.airbnb.com.co/embeddable/airbnb_jssdk"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  const airbnbEmbeds = [
    {
      id: '1374832663542030937',
      title: '401: Estudio vibrante, céntrico y económico',
      location: 'Chapinero'
    },
    {
      id: '1385462085011542494', 
      title: '303: Central, básico y económico',
      location: 'Bogotá'
    },
    {
      id: '1374828475111138717',
      title: '403: Vibrante, céntrico y acogedor', 
      location: 'Bogotá'
    },
    {
      id: '1420603919146297317',
      title: 'Central, Zona T, Wi-Fi Ultra Rápido, con balcón',
      location: 'Bogotá'
    },
    {
      id: '1392220537293371648',
      title: 'Céntrico, acogedor e iluminado',
      location: 'Bogotá'
    }
  ];

  return (
    <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header con nuevo texto */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Conoce Cielocanto
          </h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Consulta el precio y la disponibilidad de las propiedades haciendo click en la imagen de tu interés, la cual te llevará a la página de Airbnb. Si es de tu interés, deberás hacer la reserva directamente en Airbnb y/o contactarnos por WhatsApp. Únicamente se arrienda mediante Airbnb (nunca fuera de la plataforma). La estadías mínima es  de un mes.
          </p>
        </div>
        
        {/* Grid más grande - menos columnas, cards más grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {airbnbEmbeds.map((property, index) => (
            <div
              key={property.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Header centrado */}
              <div className="p-6 pb-4 text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 leading-tight">
                  {property.title}
                </h3>
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <span className="text-red-500 mr-2">📍</span>
                  <span className="text-base font-medium">{property.location}</span>
                </div>
              </div>
              
              {/* Embed centrado */}
              <div className="px-6 pb-6">
                                  <div className="relative overflow-hidden rounded-xl border border-gray-200 mx-auto" style={{ height: '400px', width: '100%' }}>
                  <div 
                    className="airbnb-embed-frame" 
                    data-id={property.id} 
                    data-view="home" 
                    data-hide-price="false"
                    style={{ 
                      width: '450px', 
                      height: '400px',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      overflow: 'hidden'
                    }}
                  >
                    <a 
                      href={`https://es-l.airbnb.com/rooms/${property.id}?guests=1&adults=1&s=66&source=embed_widget`}
                      className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">🏠</div>
                        <div className="font-semibold text-xl mb-2">Ver en Airbnb</div>
                        <div className="text-base opacity-90">Información completa y reservas</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Efecto hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
            </div>
          ))}
        </div>

      </div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default PropertyList; 