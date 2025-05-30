import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative h-[80vh] w-full bg-gray-900">
      {/* Contenido del hero */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
        <div className="mb-8">
          <Image
            src="/Logo_Cielocanto_cielocanto-3.png"
            alt="Cielocanto Logo"
            width={300}
            height={100}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
          Experiencias Únicas en el Corazón de la Ciudad
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
          Descubre nuestros exclusivos alojamientos diseñados para hacer tu estadía inolvidable
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all">
          Ver Propiedades
        </button>
      </div>
    </div>
  );
};

export default Hero; 