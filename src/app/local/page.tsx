'use client';

import { useState } from 'react';
import Image from 'next/image';
import LocalWhatsAppButton from './components/LocalWhatsAppButton';

const images = [
  '/local/Local1.jpeg',
  '/local/Local2.jpeg',
  '/local/Local3.jpeg',
  '/local/Local4.jpeg',
  '/local/Local5.jpeg',
  '/local/Local6.jpeg',
  '/local/Local7.jpeg',
  '/local/Local8.jpeg',
  '/local/Local9.jpeg',
  '/local/Local10.jpeg',
  '/local/Local11.jpeg',
  '/local/Local12.jpeg',
  '/local/Local13.jpeg',
  '/local/Local14.jpeg',
  '/local/Local15.jpeg',
];

export default function LocalPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Título y descripción principal */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
            🏆 Local Premium - Historial Comprobado de Éxito
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            <span className="block text-white font-semibold mb-2 sm:mb-3">
              Se arrienda junto al local de Papadictos: ambos frentes conforman un solo local de 122m² —no son dos arriendos aparte, es una misma unidad comercial.
            </span>
            Ese espacio de 122m² fue el hogar de BBC (Bogotá Beer Company) por 10 años consecutivos. Papadictos desocupa el 31 de mayo tras tres años en el punto; a partir de esa fecha queda disponible el local completo. 
            Un historial de éxito, perfecto para marcas importantes que buscan un espacio premium.
          </p>
        </div>

        {/* Información destacada */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📏</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">122m²</div>
            <div className="text-gray-400 text-xs sm:text-sm md:text-base">Área total (ambos frentes)</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">↔️</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">5.7m</div>
            <div className="text-gray-400 text-xs sm:text-sm md:text-base">Frente</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📅</div>
            <div className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">31 de mayo</div>
            <div className="text-gray-400 text-xs sm:text-sm">Disponible</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">💵</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">$10.000.000</div>
            <div className="text-gray-400 text-xs sm:text-sm md:text-base">Canon mensual</div>
          </div>
        </div>

        {/* Galería de imágenes */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center px-2">
            Galería de Imágenes
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-300 w-full"
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square relative w-full">
                  <Image
                    src={image}
                    alt={`Local comercial - Imagen ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                    unoptimized={false}
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Características adicionales */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-700 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Características Premium del Local</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🏆</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Historial Comprobado de Éxito</h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  10 años consecutivos arrendado a BBC (Bogotá Beer Company), una de las marcas más reconocidas del país. 
                  El arriendo actual es del local unificado de 122m² que se ofrece junto al de Papadictos: ambos frentes son el mismo local, una sola superficie. 
                  Papadictos lleva tres años en su tramo y desocupa el 31 de mayo; así se suma otro caso de marca que consolidó operación en este mismo frente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">⚡</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Luz Trifásica - Potencia Industrial</h3>
                <p className="text-gray-400 text-sm sm:text-base">Instalación eléctrica trifásica que permite operar equipos de alta demanda energética, sistemas de refrigeración, iluminación profesional y tecnología avanzada sin limitaciones.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🚿</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">2 baños</h3>
                <p className="text-gray-400 text-sm sm:text-base">Dos baños para el local, con comodidad y privacidad para clientes y personal. Ideal para establecimientos con flujo de visitantes.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🌳</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Área Externa Adicional</h3>
                <p className="text-gray-400 text-sm sm:text-base">Espacio exterior que permite ampliar tu operación, crear terrazas, áreas de descanso o zonas de exhibición adicionales. Maximiza tu potencial comercial.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🎯</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Frente Amplio de 5.7m</h3>
                <p className="text-gray-400 text-sm sm:text-base">Excelente visibilidad y presencia comercial con un frente generoso que permite vitrinas impactantes, señalización destacada y máxima exposición a tu marca.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usos ideales */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-800">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Ideal para Marcas Importantes:</h2>
          <div className="space-y-4 sm:space-y-6">
            {/* Tecnología */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600">
              <div className="flex items-start">
                <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">💻</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Tecnología & Innovación</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-3">
                    Perfecto para showrooms tecnológicos, tiendas de dispositivos, gaming centers, o espacios de realidad virtual. 
                    La luz trifásica permite alimentar servidores, equipos de alta gama y sistemas de iluminación profesional. 
                    El espacio de 122m² es ideal para exhibir productos tecnológicos con comodidad y estilo.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Showrooms Tech</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Gaming Centers</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">VR/AR Experiences</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Tiendas de Dispositivos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pubs Elegantes */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600">
              <div className="flex items-start">
                <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">🍺</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Pubs Elegantes & Gastronomía Premium</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-3">
                    El historial de BBC demuestra que este espacio funciona perfectamente para conceptos gastronómicos de alta calidad. 
                    Con luz trifásica puedes operar equipos de cocina profesional, sistemas de refrigeración y climatización. 
                    Los 2 baños y el área externa permiten crear una experiencia completa y exclusiva para tus clientes.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Cervecerías Artesanales</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Bares Premium</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Restaurantes Temáticos</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Wine Bars</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Cocktail Bars</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Supermercados */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600">
              <div className="flex items-start">
                <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 flex-shrink-0">🛒</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Supermercados & Retail Especializado</h3>
                  <p className="text-gray-300 text-sm sm:text-base mb-3">
                    Espacio perfecto para minimercados, tiendas especializadas o conceptos de retail innovadores. 
                    La luz trifásica es esencial para sistemas de refrigeración, congeladores y equipos de punto de venta. 
                    El frente de 5.7m garantiza excelente visibilidad y los 2 baños mejoran la experiencia del cliente.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Minimercados</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Tiendas Gourmet</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Retail Especializado</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Tiendas de Conveniencia</span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-xs sm:text-sm text-gray-300">Marketplaces</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Otros usos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
              {[
                { icon: '🏪', title: 'Showrooms de Lujo', desc: 'Espacios exclusivos para marcas premium' },
                { icon: '☕', title: 'Cafeterías Premium', desc: 'Conceptos gastronómicos especializados' },
                { icon: '🎨', title: 'Galerías & Arte', desc: 'Espacios culturales y de exhibición' },
                { icon: '💼', title: 'Oficinas Corporativas', desc: 'Espacios de trabajo modernos y funcionales' },
                { icon: '🏋️', title: 'Estudios Especializados', desc: 'Yoga, pilates, fitness boutique' },
                { icon: '💅', title: 'Salones & Spa', desc: 'Belleza y bienestar de alta gama' },
              ].map((use, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <span className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{use.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-1">{use.title}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">{use.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox para ver imágenes en grande */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de imagen"
        >
          <button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black bg-opacity-50 rounded-full"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Vista ampliada"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] sm:max-h-[95vh] w-auto h-auto max-w-full"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              unoptimized={false}
              quality={90}
            />
          </div>
        </div>
      )}

      <LocalWhatsAppButton />
    </main>
  );
}

