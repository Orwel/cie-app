'use client';

import { useEffect } from 'react';

const PropertyList = () => {
  
  useEffect(() => {
    // Cargar el SDK de Airbnb cuando el componente se monta
    const script = document.createElement('script');
    script.src = 'https://www.airbnb.com.co/embeddable/airbnb_jssdk';
    script.async = true;
    document.head.appendChild(script);

    // Función para interceptar clics y redirigir a /rooms/
    const interceptClicks = () => {
      const embeds = document.querySelectorAll('.airbnb-embed-frame');
      embeds.forEach(embed => {
        // Remover listeners previos para evitar duplicados
        embed.removeEventListener('click', handleEmbedClick);
        embed.addEventListener('click', handleEmbedClick);
        
        // También interceptar clics en enlaces dentro del embed
        const links = embed.querySelectorAll('a');
        links.forEach(link => {
          link.removeEventListener('click', handleLinkClick);
          link.addEventListener('click', handleLinkClick);
        });
      });
    };

    const handleEmbedClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const embed = e.currentTarget as HTMLElement;
      const propertyId = embed.getAttribute('data-id');
      
      if (propertyId) {
        const url = `https://www.airbnb.com.co/rooms/${propertyId}?guests=1&adults=1&s=66&source=embed_widget`;
        window.open(url, '_blank');
      }
    };

    const handleLinkClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const link = e.currentTarget as HTMLAnchorElement;
      let href = link.getAttribute('href') || '';
      
      // Cambiar /room/ por /rooms/ en la URL
      if (href.includes('/room/')) {
        href = href.replace('/room/', '/rooms/');
        window.open(href, '_blank');
      }
    };

    // Interceptar clics inmediatamente
    interceptClicks();

    // Volver a interceptar después de que el SDK se cargue
    script.onload = () => {
      setTimeout(() => {
        interceptClicks();
        
        // Usar MutationObserver para detectar cuando se agregan nuevos elementos
        const observer = new MutationObserver(() => {
          interceptClicks();
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['href']
        });

        // Guardar el observer para limpiarlo después
        (window as any).airbnbObserver = observer;
      }, 1000);
    };

    // Estilos agresivos para eliminar barras de scroll y contenedores fijos
    const style = document.createElement('style');
    style.textContent = `
      .airbnb-embed-frame {
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        cursor: pointer !important;
      }
      .airbnb-embed-frame iframe {
        border: none !important;
        width: 100% !important;
        height: 100% !important;
        overflow: visible !important;
        pointer-events: none !important;
      }
      .airbnb-embed-frame a {
        cursor: pointer !important;
      }
      /* Ocultar barras de scroll específicamente */
      .airbnb-embed-frame *,
      .airbnb-embed-frame iframe * {
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }
      .airbnb-embed-frame::-webkit-scrollbar,
      .airbnb-embed-frame *::-webkit-scrollbar,
      .airbnb-embed-frame iframe::-webkit-scrollbar,
      .airbnb-embed-frame iframe *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: transparent !important;
      }
      /* Ocultar el corazón/wishlist de manera más agresiva */
      .airbnb-embed-frame label[for*="wishlist"],
      .airbnb-embed-frame input[id*="wishlist"],
      .airbnb-embed-frame button[aria-label*="wishlist"],
      .airbnb-embed-frame button[aria-label*="Wishlist"],
      .airbnb-embed-frame button[aria-label*="lista de deseos"],
      .airbnb-embed-frame button[aria-label*="favoritos"],
      .airbnb-embed-frame [class*="_1figzu9"],
      .airbnb-embed-frame [class*="_1dp4576"],
      .airbnb-embed-frame [class*="wishlist"],
      .airbnb-embed-frame [class*="heart"],
      .airbnb-embed-frame [class*="favorite"],
      .airbnb-embed-frame [role="button"][aria-label*="heart"],
      .airbnb-embed-frame svg[class*="heart"],
      .airbnb-embed-frame [data-testid*="wishlist"],
      .airbnb-embed-frame [data-testid*="heart"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
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

    return () => {
      const existingScript = document.querySelector('script[src="https://www.airbnb.com.co/embeddable/airbnb_jssdk"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      
      // Limpiar el observer
      if ((window as any).airbnbObserver) {
        (window as any).airbnbObserver.disconnect();
        delete (window as any).airbnbObserver;
      }
      
      // Remover event listeners
      const embeds = document.querySelectorAll('.airbnb-embed-frame');
      embeds.forEach(embed => {
        embed.removeEventListener('click', handleEmbedClick);
        const links = embed.querySelectorAll('a');
        links.forEach(link => {
          link.removeEventListener('click', handleLinkClick);
        });
      });
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
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Conoce Cielocanto
          </h2>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Consulta el precio y la disponibilidad de las propiedades haciendo click en la imagen de tu interés, la cual te llevará a la página de Airbnb. Si es de tu interés, deberás hacer la reserva directamente en Airbnb y/o contactarnos por WhatsApp. Únicamente se arrienda mediante Airbnb (nunca fuera de la plataforma). La estadía mínima es  de un mes.
          </p>
        </div>
        
        {/* Grid con menos columnas para más espacio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
          {airbnbEmbeds.map((property, index) => (
            <div
              key={property.id}
              className="overflow-visible"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              <div 
                className="airbnb-embed-frame" 
                data-id={property.id} 
                data-view="home" 
                data-hide-price="true"
                style={{ 
                  width: '450px',
                  height: '300px',
                  margin: 'auto',
                  maxWidth: '100%'
                }}
              >
                <a href={`https://es-l.airbnb.com/rooms/${property.id}?guests=1&adults=1&s=66&source=embed_widget`}>
                  Ver en Airbnb
                </a>
                <a 
                  href={`https://es-l.airbnb.com/rooms/${property.id}?guests=1&adults=1&s=66&source=embed_widget`} 
                  rel="nofollow"
                >
                  {property.title} · {property.location}
                </a>
              </div>
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