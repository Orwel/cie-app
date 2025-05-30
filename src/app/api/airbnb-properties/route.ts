import { NextResponse } from 'next/server';
import { getAirbnbProperties } from '@/lib/airbnb';

export async function GET() {
  try {
    const properties = await getAirbnbProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error al obtener propiedades de Airbnb:', error);
    return NextResponse.json(
      { error: 'Error al obtener las propiedades' },
      { status: 500 }
    );
  }
} 