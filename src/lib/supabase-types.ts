// Tipos para el módulo de Servicios Públicos

export type ServiceType = 'WATER' | 'ELECTRICITY' | 'GAS';
export type AllocationMethod = 'PROPORTIONAL_CONSUMPTION' | 'EQUAL_SPLIT' | 'FIXED_AMOUNT' | 'PERCENTAGE';
export type UnitCode = 'LOCAL_1A' | 'LOCAL_1B' | 'LOCAL_3' | 'COMMON';

export interface Unit {
  id: string;
  code: UnitCode;
  name: string;
  description: string | null;
  created_at: string;
}

export interface MeterGroup {
  id: string;
  code: string;
  service_type: ServiceType;
  name: string;
  provider: string | null;
  created_at: string;
}

export interface MeterGroupUnit {
  id: string;
  meter_group_id: string;
  unit_id: string;
  weight: number;
  created_at: string;
}

export interface MeterReading {
  id: string;
  meter_group_id: string;
  unit_id: string;
  period: string; // YYYY-MM-DD
  reading_value: number;
  photo_path: string;
  created_at: string;
  updated_at: string;
}

export interface UtilityInvoice {
  id: string;
  meter_group_id: string;
  period: string; // YYYY-MM-DD
  provider: string;
  invoice_ref: string | null;
  total_amount: number;
  due_date: string | null;
  photo_path: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceCharge {
  id: string;
  invoice_id: string;
  description: string;
  amount: number;
  allocation_method: AllocationMethod;
  metadata: Record<string, any>;
  created_at: string;
}

export interface InvoiceAllocation {
  id: string;
  invoice_id: string;
  unit_id: string;
  amount: number;
  breakdown: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos para metadatos de allocation methods
export interface FixedAmountMetadata {
  targetUnitCode: UnitCode;
}

export interface PercentageMetadata {
  percentages: Record<UnitCode, number>;
}

// Tipos extendidos con relaciones
export interface MeterGroupWithUnits extends MeterGroup {
  units: (MeterGroupUnit & { unit: Unit })[];
}

export interface MeterReadingWithDetails extends MeterReading {
  meter_group: MeterGroup;
  unit: Unit;
}

export interface UtilityInvoiceWithDetails extends UtilityInvoice {
  meter_group: MeterGroup;
  charges: InvoiceCharge[];
  allocations: InvoiceAllocation[];
}

export interface InvoiceAllocationWithDetails extends InvoiceAllocation {
  invoice: UtilityInvoice;
  unit: Unit;
}
