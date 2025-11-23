import Header from '../components/Header';
import WhatsAppButton from '../components/WhatsAppButton';
import Reservas from '../components/Reservas';

export const metadata = {
  title: 'Reservas | Cielocanto',
  description: 'Sistema de reservas de lavadoras en Cielocanto',
};

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Reservas />
      <WhatsAppButton />
    </main>
  );
}

