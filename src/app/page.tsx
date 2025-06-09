import Header from './components/Header';
import PropertyList from './components/PropertyList';
import WhatsAppButton from './components/WhatsAppButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <PropertyList />
      <WhatsAppButton />
    </main>
  );
}
