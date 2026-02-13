import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const unitId = searchParams.get('unitId');

    // Si hay code, buscar un solo resultado
    if (code) {
      const { data, error } = await supabase
        .from('meter_groups')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, data });
    }

    // Construir query base
    let query = supabase
      .from('meter_groups')
      .select('*')
      .order('created_at', { ascending: true });

    if (unitId) {
      // Obtener meter_groups asociados a una unit específica
      const { data: meterGroupUnits } = await supabase
        .from('meter_group_units')
        .select('meter_group_id')
        .eq('unit_id', unitId);

      if (meterGroupUnits && meterGroupUnits.length > 0) {
        const meterGroupIds = meterGroupUnits.map((mgu) => mgu.meter_group_id);
        query = query.in('id', meterGroupIds);
      } else {
        query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // No results
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error al obtener meter_groups:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
