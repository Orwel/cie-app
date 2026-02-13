'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { getStoragePublicUrl } from '@/lib/servicios-utils';

interface ImageLightboxProps {
  imagePath: string | null;
  onClose: () => void;
  alt?: string;
}

export default function ImageLightbox({
  imagePath,
  onClose,
  alt = 'Imagen',
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (imagePath) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [imagePath, onClose]);

  if (!imagePath) return null;

  const imageUrl = imagePath.startsWith('http')
    ? imagePath
    : getStoragePublicUrl(imagePath);

  const isPDF = imagePath.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada"
    >
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 bg-black bg-opacity-50 rounded-full"
        onClick={onClose}
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

      <div
        className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isPDF ? (
          <iframe
            src={imageUrl}
            className="w-full h-full min-h-[80vh] border-0"
            title={alt}
          />
        ) : (
          <Image
            src={imageUrl}
            alt={alt}
            width={1200}
            height={800}
            className="object-contain max-h-[90vh] sm:max-h-[95vh] w-auto h-auto max-w-full"
            unoptimized={imagePath.startsWith('http')}
            quality={90}
          />
        )}
      </div>
    </div>
  );
}
