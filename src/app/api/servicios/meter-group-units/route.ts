import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const meterGroupId = searchParams.get('meterGroupId');
    const unitId = searchParams.get('unitId');

    let query = supabase
      .from('meter_group_units')
      .select('*, unit:units(*)')
      .order('created_at', { ascending: true });

    if (meterGroupId) {
      query = query.eq('meter_group_id', meterGroupId);
    }

    if (unitId) {
      query = query.eq('unit_id', unitId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error al obtener meter_group_units:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
