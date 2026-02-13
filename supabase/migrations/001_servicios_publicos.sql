-- ============================================
-- Módulo de Servicios Públicos
-- Migración completa con enums, tablas, seeds y RLS
-- ============================================

-- Crear enums
CREATE TYPE service_type AS ENUM ('WATER', 'ELECTRICITY', 'GAS');
CREATE TYPE allocation_method AS ENUM ('PROPORTIONAL_CONSUMPTION', 'EQUAL_SPLIT', 'FIXED_AMOUNT', 'PERCENTAGE');
CREATE TYPE unit_code AS ENUM ('LOCAL_1A', 'LOCAL_1B', 'LOCAL_3', 'COMMON');

-- Tabla: units
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code unit_code UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: meter_groups
CREATE TABLE meter_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    service_type service_type NOT NULL,
    name TEXT NOT NULL,
    provider TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: meter_group_units (relación many-to-many)
CREATE TABLE meter_group_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_group_id UUID NOT NULL REFERENCES meter_groups(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    weight NUMERIC(10, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(meter_group_id, unit_id)
);

-- Tabla: meter_readings
CREATE TABLE meter_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_group_id UUID NOT NULL REFERENCES meter_groups(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    period DATE NOT NULL,
    reading_value NUMERIC(12, 2) NOT NULL CHECK (reading_value >= 0),
    photo_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(meter_group_id, unit_id, period)
);

-- Tabla: utility_invoices
CREATE TABLE utility_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meter_group_id UUID NOT NULL REFERENCES meter_groups(id) ON DELETE CASCADE,
    period DATE NOT NULL,
    provider TEXT NOT NULL,
    invoice_ref TEXT,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    due_date DATE,
    photo_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(meter_group_id, period)
);

-- Tabla: invoice_charges
CREATE TABLE invoice_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES utility_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    allocation_method allocation_method NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: invoice_allocations
CREATE TABLE invoice_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES utility_invoices(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    breakdown JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(invoice_id, unit_id)
);

-- Índices para mejorar performance
CREATE INDEX idx_meter_readings_meter_group_period ON meter_readings(meter_group_id, period);
CREATE INDEX idx_meter_readings_unit_period ON meter_readings(unit_id, period);
CREATE INDEX idx_utility_invoices_meter_group_period ON utility_invoices(meter_group_id, period);
CREATE INDEX idx_invoice_charges_invoice_id ON invoice_charges(invoice_id);
CREATE INDEX idx_invoice_allocations_invoice_id ON invoice_allocations(invoice_id);
CREATE INDEX idx_invoice_allocations_unit_id ON invoice_allocations(unit_id);
CREATE INDEX idx_meter_group_units_meter_group_id ON meter_group_units(meter_group_id);
CREATE INDEX idx_meter_group_units_unit_id ON meter_group_units(unit_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_meter_readings_updated_at
    BEFORE UPDATE ON meter_readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_utility_invoices_updated_at
    BEFORE UPDATE ON utility_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_allocations_updated_at
    BEFORE UPDATE ON invoice_allocations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEEDS: Datos iniciales
-- ============================================

-- Insertar units
INSERT INTO units (code, name, description) VALUES
    ('LOCAL_1A', 'Local 1A', 'Local comercial 1A'),
    ('LOCAL_1B', 'Local 1B', 'Local comercial 1B'),
    ('LOCAL_3', 'Local 3', 'Local comercial 3'),
    ('COMMON', 'Áreas Comunes', 'Espacios comunes del edificio');

-- Insertar meter_groups
INSERT INTO meter_groups (code, service_type, name, provider) VALUES
    ('WATER_1A_1B', 'WATER', 'Agua Local 1A y 1B', 'Acueducto de Bogotá'),
    ('ELEC_1A_1B', 'ELECTRICITY', 'Energía Local 1A y 1B', 'Codensa'),
    ('WATER_3_COMMON', 'WATER', 'Agua Local 3 y Áreas Comunes', 'Acueducto de Bogotá'),
    ('ELEC_3_COMMON', 'ELECTRICITY', 'Energía Local 3 y Áreas Comunes', 'Codensa'),
    ('GAS_1B_3', 'GAS', 'Gas Local 1B y Local 3', 'Gas Natural');

-- Insertar relaciones meter_group_units
-- WATER_1A_1B → LOCAL_1A, LOCAL_1B
INSERT INTO meter_group_units (meter_group_id, unit_id, weight)
SELECT mg.id, u.id, 1.0
FROM meter_groups mg, units u
WHERE mg.code = 'WATER_1A_1B' AND u.code IN ('LOCAL_1A', 'LOCAL_1B');

-- ELEC_1A_1B → LOCAL_1A, LOCAL_1B
INSERT INTO meter_group_units (meter_group_id, unit_id, weight)
SELECT mg.id, u.id, 1.0
FROM meter_groups mg, units u
WHERE mg.code = 'ELEC_1A_1B' AND u.code IN ('LOCAL_1A', 'LOCAL_1B');

-- WATER_3_COMMON → LOCAL_3, COMMON
INSERT INTO meter_group_units (meter_group_id, unit_id, weight)
SELECT mg.id, u.id, 1.0
FROM meter_groups mg, units u
WHERE mg.code = 'WATER_3_COMMON' AND u.code IN ('LOCAL_3', 'COMMON');

-- ELEC_3_COMMON → LOCAL_3, COMMON
INSERT INTO meter_group_units (meter_group_id, unit_id, weight)
SELECT mg.id, u.id, 1.0
FROM meter_groups mg, units u
WHERE mg.code = 'ELEC_3_COMMON' AND u.code IN ('LOCAL_3', 'COMMON');

-- GAS_1B_3 → LOCAL_1B, LOCAL_3
INSERT INTO meter_group_units (meter_group_id, unit_id, weight)
SELECT mg.id, u.id, 1.0
FROM meter_groups mg, units u
WHERE mg.code = 'GAS_1B_3' AND u.code IN ('LOCAL_1B', 'LOCAL_3');

-- ============================================
-- Storage Bucket
-- ============================================

-- Crear bucket para servicios públicos (si no existe)
INSERT INTO storage.buckets (id, name, public)
VALUES ('servicios-publicos', 'servicios-publicos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies públicas para el bucket
-- SELECT: público (cualquiera puede ver)
CREATE POLICY "Public Access for SELECT"
ON storage.objects FOR SELECT
USING (bucket_id = 'servicios-publicos');

-- INSERT: público (cualquiera puede subir)
CREATE POLICY "Public Access for INSERT"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'servicios-publicos');

-- ============================================
-- RLS Policies
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_group_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_allocations ENABLE ROW LEVEL SECURITY;

-- Policies para units: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on units"
ON units FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on units"
ON units FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on units"
ON units FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on units"
ON units FOR DELETE
USING (true);

-- Policies para meter_groups: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on meter_groups"
ON meter_groups FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on meter_groups"
ON meter_groups FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on meter_groups"
ON meter_groups FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on meter_groups"
ON meter_groups FOR DELETE
USING (true);

-- Policies para meter_group_units: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on meter_group_units"
ON meter_group_units FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on meter_group_units"
ON meter_group_units FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on meter_group_units"
ON meter_group_units FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on meter_group_units"
ON meter_group_units FOR DELETE
USING (true);

-- Policies para meter_readings: SELECT público, INSERT público, UPDATE solo del mes actual, DELETE solo del mes actual
CREATE POLICY "Public SELECT on meter_readings"
ON meter_readings FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on meter_readings"
ON meter_readings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on meter_readings"
ON meter_readings FOR UPDATE
USING (
    period >= DATE_TRUNC('month', CURRENT_DATE)
    AND period < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
);

CREATE POLICY "Public DELETE on meter_readings"
ON meter_readings FOR DELETE
USING (
    period >= DATE_TRUNC('month', CURRENT_DATE)
    AND period < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
);

-- Policies para utility_invoices: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on utility_invoices"
ON utility_invoices FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on utility_invoices"
ON utility_invoices FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on utility_invoices"
ON utility_invoices FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on utility_invoices"
ON utility_invoices FOR DELETE
USING (true);

-- Policies para invoice_charges: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on invoice_charges"
ON invoice_charges FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on invoice_charges"
ON invoice_charges FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on invoice_charges"
ON invoice_charges FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on invoice_charges"
ON invoice_charges FOR DELETE
USING (true);

-- Policies para invoice_allocations: SELECT público, INSERT/UPDATE/DELETE público
CREATE POLICY "Public SELECT on invoice_allocations"
ON invoice_allocations FOR SELECT
USING (true);

CREATE POLICY "Public INSERT on invoice_allocations"
ON invoice_allocations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public UPDATE on invoice_allocations"
ON invoice_allocations FOR UPDATE
USING (true);

CREATE POLICY "Public DELETE on invoice_allocations"
ON invoice_allocations FOR DELETE
USING (true);
