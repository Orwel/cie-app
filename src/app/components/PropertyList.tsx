'use client';

interface Property {
  id: string;
  title: string;
  price: number;
  rating: number;
  location: string;
}

const PropertyList = () => {
  // Aquí se implementará la conexión con la API de Airbnb
  const properties: Property[] = [
    // Datos de ejemplo - Reemplazar con datos reales de la API
    {
      id: '1',
      title: 'Luxury Apartment Downtown',
      price: 150,
      rating: 4.8,
      location: 'Centro Histórico'
    },
    // Agregar más propiedades aquí
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestras Propiedades
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200" />
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-2">{property.location}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${property.price}/noche</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{property.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyList; 