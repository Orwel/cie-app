import Header from '../components/Header';
import WhatsAppButton from '../components/WhatsAppButton';

export const metadata = {
  title: 'Reservas | Cielocanto',
  description: 'Información sobre reservas en Cielocanto',
};

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Reservas
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Para realizar una reserva, por favor contacta con nosotros a través de WhatsApp o visita nuestras propiedades en Airbnb.
          </p>
        </div>
      </div>
      <WhatsAppButton />
    </main>
  );
}

