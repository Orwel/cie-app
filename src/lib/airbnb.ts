export interface Property {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  rating: number;
  location: string;
}

export async function getAirbnbProperties(): Promise<Property[]> {
  const apiKey = process.env.AIRBNB_API_KEY;
  const apiSecret = process.env.AIRBNB_API_SECRET;
  const userId = process.env.AIRBNB_USER_ID;

  if (!apiKey || !apiSecret || !userId) {
    throw new Error('Faltan las credenciales de la API de Airbnb');
  }

  // Aquí iría la lógica para hacer la petición a la API de Airbnb
  // Por ahora, retornamos datos de ejemplo
  return [
    {
      id: '1',
      title: 'Luxury Apartment Downtown',
      imageUrl: '/property1.jpg',
      price: 150,
      rating: 4.8,
      location: 'Centro Histórico'
    },
    // Agrega más propiedades aquí
  ];
} 