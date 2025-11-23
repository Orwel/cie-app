'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import LocalWhatsAppButton from './components/LocalWhatsAppButton';

const images = [
  '/local/Local1.jpeg',
  '/local/Local2.jpeg',
  '/local/Local3.jpeg',
  '/local/Local4.jpeg',
  '/local/Local5.jpeg',
  '/local/Local6.jpeg',
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
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Título y descripción principal */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight">
            💥 ¡Gangazo en la 15 frente a Unilago!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Amplio local de 100m², perfecto para tu negocio, almacenamiento, showroom o marca independiente.
          </p>
        </div>

        {/* Información destacada */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📏</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">100m²</div>
            <div className="text-gray-400 text-xs sm:text-sm md:text-base">Área total</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">↔️</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">2.5m</div>
            <div className="text-gray-400 text-xs sm:text-sm md:text-base">Frente</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">📍</div>
            <div className="text-white font-semibold text-xs sm:text-sm md:text-base mb-1">Cra 15 #76-22</div>
            <div className="text-gray-400 text-xs sm:text-sm">Bogotá D.C</div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-800">
            <div className="text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">💵</div>
            <div className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1">$5.500.000</div>
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Características del Local</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">🚶‍♂️</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Zona de altísimo movimiento y valorización</h3>
                <p className="text-gray-400 text-sm sm:text-base">Ubicación estratégica con gran flujo de personas y potencial de crecimiento.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="text-xl sm:text-2xl mr-3 sm:mr-4 flex-shrink-0">✨</span>
              <div>
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1">Excelente iluminación, amplio, versátil</h3>
                <p className="text-gray-400 text-sm sm:text-base">Espacio bien iluminado que se adapta a diferentes tipos de negocios.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usos ideales */}
        <div className="bg-gray-900 rounded-lg p-4 sm:p-6 md:p-8 border border-gray-800">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6">Ideal para:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              'Tiendas especializadas',
              'Logística urbana',
              'E-commerce con punto de entrega',
              'Tecnología',
              'Minimercado',
              'Showroom',
            ].map((use, index) => (
              <div
                key={index}
                className="flex items-center p-3 sm:p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <span className="text-green-400 mr-2 sm:mr-3 flex-shrink-0">✓</span>
                <span className="text-gray-300 text-sm sm:text-base">{use}</span>
              </div>
            ))}
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

