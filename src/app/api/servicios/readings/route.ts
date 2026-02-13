import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { uploadFileToStorage, isValidFileType, isValidFileSize } from '@/lib/servicios-utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const meterGroupId = formData.get('meterGroupId') as string;
    const unitId = formData.get('unitId') as string;
    const period = formData.get('period') as string;
    const readingValue = parseFloat(formData.get('readingValue') as string);
    const photo = formData.get('photo') as File;

    // Validaciones
    if (!meterGroupId || !unitId || !period || !photo) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (isNaN(readingValue) || readingValue < 0) {
      return NextResponse.json(
        { success: false, error: 'El valor de lectura debe ser un número positivo' },
        { status: 400 }
      );
    }

    if (!isValidFileType(photo)) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen (JPEG, PNG, WebP) o PDF' },
        { status: 400 }
      );
    }

    if (!isValidFileSize(photo)) {
      return NextResponse.json(
        { success: false, error: 'El archivo no puede exceder 5MB' },
        { status: 400 }
      );
    }

    // Subir foto al storage
    const photoPath = await uploadFileToStorage(photo, 'readings');

    // Insertar lectura en la base de datos
    const { data, error } = await supabase
      .from('meter_readings')
      .insert({
        meter_group_id: meterGroupId,
        unit_id: unitId,
        period: period,
        reading_value: readingValue,
        photo_path: photoPath,
      })
      .select()
      .single();

    if (error) {
      // Si es error de unique constraint, significa que ya existe una lectura para ese periodo
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'Ya existe una lectura para este mes y unidad' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al subir lectura:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const meterGroupId = searchParams.get('meterGroupId');
    const unitId = searchParams.get('unitId');
    const period = searchParams.get('period');

    let query = supabase
      .from('meter_readings')
      .select(`
        *,
        meter_group:meter_groups(*),
        unit:units(*)
      `)
      .order('period', { ascending: false });

    if (meterGroupId) {
      query = query.eq('meter_group_id', meterGroupId);
    }

    if (unitId) {
      query = query.eq('unit_id', unitId);
    }

    if (period) {
      query = query.eq('period', period);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error al obtener lecturas:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
