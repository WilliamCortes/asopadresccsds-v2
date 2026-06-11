-- ASOPADRES CCSDS — Supabase Migration 001
-- Run in Supabase SQL Editor

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- AFILIADOS (membership registrations)
-- ============================================================
CREATE TABLE IF NOT EXISTS afiliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  id_number TEXT,
  student_name TEXT NOT NULL,
  student_grade TEXT,
  habeas_data_accepted BOOLEAN NOT NULL DEFAULT false,
  habeas_data_date TIMESTAMPTZ,
  wompi_reference TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_amount NUMERIC(10, 2),
  currency TEXT DEFAULT 'COP',
  locale TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DONACIONES (donations)
-- ============================================================
CREATE TABLE IF NOT EXISTS donaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT,
  donor_email TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COP' CHECK (currency IN ('COP', 'EUR', 'USD')),
  gateway TEXT NOT NULL CHECK (gateway IN ('wompi', 'paypal')),
  gateway_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  type TEXT DEFAULT 'donation' CHECK (type IN ('donation', 'membership')),
  project TEXT DEFAULT 'cancha_cubierta',
  locale TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- COMUNICADOS (news posts)
-- ============================================================
CREATE TABLE IF NOT EXISTS comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('proyectos', 'asambleas', 'actividades', 'logros')),
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author TEXT,
  -- Content by locale
  title_es TEXT NOT NULL,
  title_en TEXT,
  title_fr TEXT,
  body_es TEXT NOT NULL,
  body_en TEXT,
  body_fr TEXT,
  excerpt_es TEXT,
  excerpt_en TEXT,
  excerpt_fr TEXT,
  -- SEO by locale
  meta_title_es TEXT,
  meta_title_en TEXT,
  meta_title_fr TEXT,
  meta_desc_es TEXT,
  meta_desc_en TEXT,
  meta_desc_fr TEXT,
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CONTENIDO (editable page content)
-- ============================================================
CREATE TABLE IF NOT EXISTS contenido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('es', 'en', 'fr')),
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (page, section, key, locale)
);

-- ============================================================
-- PROYECTO_PROGRESO (project progress tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS proyecto_progreso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_key TEXT UNIQUE NOT NULL DEFAULT 'cancha_cubierta',
  goal_amount NUMERIC(12, 2) NOT NULL DEFAULT 50000000,
  current_amount NUMERIC(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'COP',
  description_es TEXT,
  description_en TEXT,
  description_fr TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default project
INSERT INTO proyecto_progreso (project_key, goal_amount, current_amount)
VALUES ('cancha_cubierta', 50000000, 0)
ON CONFLICT (project_key) DO NOTHING;

-- ============================================================
-- IMAGENES (managed images)
-- ============================================================
CREATE TABLE IF NOT EXISTS imagenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_es TEXT,
  alt_en TEXT,
  alt_fr TEXT,
  section TEXT CHECK (section IN ('hero', 'gallery', 'project', 'board', 'general')),
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUTORIZACIONES_MENORES (minor image consent — Ley 1098/2006 Art. 12)
-- ============================================================
CREATE TABLE IF NOT EXISTS autorizaciones_menores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  guardian_name TEXT NOT NULL,
  guardian_id TEXT NOT NULL,
  event_description TEXT,
  authorized_uses TEXT[] DEFAULT ARRAY['web'],
  signed_at TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ,
  document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Public read access for comunicados (published only)
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published comunicados"
  ON comunicados FOR SELECT
  USING (published = true);
CREATE POLICY "Admins can manage comunicados"
  ON comunicados FOR ALL
  USING (auth.role() = 'authenticated');

-- Public read for proyecto_progreso
ALTER TABLE proyecto_progreso ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read project progress"
  ON proyecto_progreso FOR SELECT
  TO public USING (true);
CREATE POLICY "Admins can update project progress"
  ON proyecto_progreso FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Admin-only for sensitive tables
ALTER TABLE afiliados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins only for afiliados"
  ON afiliados FOR ALL
  USING (auth.role() = 'authenticated');

ALTER TABLE donaciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins only for donaciones"
  ON donaciones FOR ALL
  USING (auth.role() = 'authenticated');

ALTER TABLE autorizaciones_menores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins only for autorizaciones"
  ON autorizaciones_menores FOR ALL
  USING (auth.role() = 'authenticated');

-- Contenido: public read, admin write
ALTER TABLE contenido ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read contenido"
  ON contenido FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage contenido"
  ON contenido FOR ALL
  USING (auth.role() = 'authenticated');

-- Imagenes: public read active, admin manage
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active images"
  ON imagenes FOR SELECT TO public USING (active = true);
CREATE POLICY "Admins can manage images"
  ON imagenes FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TRIGGERS (updated_at auto-update)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_afiliados_updated
  BEFORE UPDATE ON afiliados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_comunicados_updated
  BEFORE UPDATE ON comunicados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_contenido_updated
  BEFORE UPDATE ON contenido
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_proyecto_updated
  BEFORE UPDATE ON proyecto_progreso
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
