-- Fija search_path (advisor de Supabase: function_search_path_mutable).
ALTER FUNCTION public.update_updated_at() SET search_path = '';
