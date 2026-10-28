-- Requerido por los webhooks (upsert onConflict: gateway_reference).
-- Si ya existen duplicados en donaciones.gateway_reference, limpiarlos ANTES de aplicar esto.
CREATE UNIQUE INDEX IF NOT EXISTS donaciones_gateway_reference_key
  ON donaciones (gateway_reference);

-- Incremento atómico del progreso del proyecto (evita read-modify-write).
CREATE OR REPLACE FUNCTION increment_project_progress(p_key TEXT, p_amount NUMERIC)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = ''
AS $$
  UPDATE public.proyecto_progreso
  SET current_amount = COALESCE(current_amount, 0) + p_amount
  WHERE project_key = p_key;
$$;

REVOKE ALL ON FUNCTION increment_project_progress(TEXT, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_project_progress(TEXT, NUMERIC) TO service_role;
