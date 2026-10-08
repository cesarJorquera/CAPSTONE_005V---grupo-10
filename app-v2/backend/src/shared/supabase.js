import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

// Cliente con service_role: SOLO vive en el backend (veto V-1).
// Cada query está sujeta a las políticas RLS definidas en Supabase (segunda barrera, P-1).
// Nunca exponer este cliente ni sus resultados crudos al frontend sin validar.
export const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
