import Hero from './components/Hero';
import PropertyList from './components/PropertyList';
import WhatsAppButton from './components/WhatsAppButton';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <PropertyList />
      <WhatsAppButton />
    </main>
  );
}
