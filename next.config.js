/** @type {import('next').NextConfig} */
const nextConfig = {
  // Los embeds de Airbnb manejan sus propias imágenes
  // No necesitamos configuración especial de imágenes remotas
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig; 