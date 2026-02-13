import { supabase } from './supabase';
import type { ServiceType, UnitCode } from './supabase-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET_NAME = 'servicios-publicos';

/**
 * Sube un archivo al bucket de servicios públicos
 * @param file Archivo a subir
 * @param folder Carpeta dentro del bucket (ej: 'readings', 'invoices')
 * @returns Ruta del archivo subido (photo_path)
 */
export async function uploadFileToStorage(
  file: File,
  folder: string
): Promise<string> {
  // Generar nombre único: timestamp_nombre_sanitizado
  const timestamp = Date.now();
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase();
  const filePath = `${folder}/${timestamp}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Error al subir archivo: ${error.message}`);
  }

  return filePath;
}

/**
 * Obtiene la URL pública de un archivo en storage
 * @param path Ruta del archivo (photo_path)
 * @returns URL pública completa
 */
export function getStoragePublicUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${path}`;
}

/**
 * Convierte una fecha al primer día del mes en formato YYYY-MM-01
 * @param date Fecha a convertir
 * @returns String en formato YYYY-MM-01
 */
export function getPeriodKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

/**
 * Calcula el consumo entre dos lecturas
 * @param currentReading Lectura actual
 * @param previousReading Lectura anterior
 * @returns Consumo calculado
 * @throws Error si la lectura actual es menor a la anterior
 */
export function calculateConsumption(
  currentReading: number,
  previousReading: number
): number {
  if (currentReading < previousReading) {
    throw new Error(
      `La lectura actual (${currentReading}) no puede ser menor a la anterior (${previousReading})`
    );
  }
  return currentReading - previousReading;
}

/**
 * Obtiene el label amigable para un código de unidad
 * @param code Código de unidad
 * @returns Nombre amigable
 */
export function getUnitLabel(code: UnitCode): string {
  const labels: Record<UnitCode, string> = {
    LOCAL_1A: 'Local 1A',
    LOCAL_1B: 'Local 1B',
    LOCAL_3: 'Local 3',
    COMMON: 'Áreas Comunes',
  };
  return labels[code] || code;
}

/**
 * Obtiene el label y unidad de medida para un tipo de servicio
 * @param type Tipo de servicio
 * @returns Objeto con nombre y unidad
 */
export function getServiceLabel(type: ServiceType): {
  name: string;
  unit: string;
} {
  const labels: Record<
    ServiceType,
    { name: string; unit: string }
  > = {
    WATER: { name: 'Agua', unit: 'm³' },
    ELECTRICITY: { name: 'Energía', unit: 'kWh' },
    GAS: { name: 'Gas', unit: 'm³' },
  };
  return labels[type];
}

/**
 * Formatea un número como moneda colombiana
 * @param amount Monto a formatear
 * @returns String formateado (ej: "$1.234.567")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 * @param value Número a formatear
 * @param decimals Número de decimales (default: 2)
 * @returns String formateado (ej: "1.234,56")
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Obtiene el mes anterior a una fecha dada
 * @param period Periodo en formato YYYY-MM-01
 * @returns Periodo anterior en formato YYYY-MM-01
 */
export function getPreviousPeriod(period: string): string {
  const date = new Date(period);
  date.setMonth(date.getMonth() - 1);
  return getPeriodKey(date);
}

/**
 * Formatea un periodo para mostrar (ej: "Febrero 2026")
 * @param period Periodo en formato YYYY-MM-01
 * @returns String formateado
 */
export function formatPeriod(period: string): string {
  const date = new Date(period);
  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Valida que un archivo sea una imagen o PDF
 * @param file Archivo a validar
 * @returns true si es válido, false en caso contrario
 */
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
  ];
  return validTypes.includes(file.type);
}

/**
 * Valida el tamaño de un archivo (máximo 5MB)
 * @param file Archivo a validar
 * @returns true si es válido, false en caso contrario
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}
