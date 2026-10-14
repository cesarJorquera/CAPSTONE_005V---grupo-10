/**
 * ============================================
 * CLIENTE DE SUPABASE (CU-01)
 * ============================================
 * Único lugar donde se crea la conexión a Supabase.
 * El resto de la app importa `supabase` desde aquí.
 *
 * Las variables vienen de .env.local (en local) o de Netlify (en producción).
 * Vue CLI solo deja pasar al navegador las que empiezan con VUE_APP_.
 *
 * La anon key es pública a propósito: la seguridad real la dan las
 * políticas RLS de la base de datos. NUNCA poner aquí la service_role key.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VUE_APP_SUPABASE_URL
const anonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// Si faltan las variables, no rompemos toda la app (pantalla en blanco):
// exportamos null y la pantalla de login muestra qué falta.
export const supabaseConfigurado = Boolean(url && anonKey)

export const supabase = supabaseConfigurado ? createClient(url, anonKey) : null

if (!supabaseConfigurado) {
  console.error(
    '⚠️ Supabase no está configurado: faltan VUE_APP_SUPABASE_URL y/o VUE_APP_SUPABASE_ANON_KEY ' +
      '(en .env.local para desarrollo, o en las variables de entorno de Netlify).'
  )
}
