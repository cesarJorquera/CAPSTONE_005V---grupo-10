/**
 * ============================================
 * SERVICIO DE AUTENTICACIÓN (CU-02, CU-03, CU-04)
 * ============================================
 * Todo lo de login/logout/perfil pasa por aquí.
 * App.vue no habla directo con supabase.auth: así, si mañana cambia
 * el proveedor de login, se cambia solo este archivo.
 */
import { supabase } from './supabaseClient'

/**
 * Abre el login de Google. El navegador sale de la app y vuelve a ella
 * (a la misma dirección) ya con la sesión iniciada.
 * La dirección de vuelta debe estar autorizada en Supabase:
 * Authentication → URL Configuration → Redirect URLs.
 */
export async function entrarConGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
  if (error) throw error
}

/** CU-03: cierra la sesión en este navegador. */
export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * CU-03: sesión guardada en el navegador (si la hay).
 * Supabase la persiste solo: al reabrir la app, sigue ahí.
 */
export async function obtenerSesion() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

/**
 * Avisa a la app cuando alguien entra o sale.
 *
 * OJO: Supabase emite más eventos que entrar y salir. TOKEN_REFRESHED llega
 * cada vez que renueva el token (~cada hora) e INITIAL_SESSION al cargar.
 * Si la app cambiara de pantalla con cualquier evento, un alumno a mitad de
 * juego volvería al inicio sin aviso. Por eso aquí SOLO se reacciona a
 * SIGNED_IN y SIGNED_OUT.
 *
 * El setTimeout difiere la reacción: así no se hacen otras llamadas a
 * Supabase dentro del propio aviso (precaución recomendada para este callback).
 *
 * Devuelve una función para dejar de escuchar.
 */
export function escucharCambiosDeSesion({ alEntrar, alSalir }) {
  const { data } = supabase.auth.onAuthStateChange((evento, sesion) => {
    setTimeout(() => {
      if (evento === 'SIGNED_OUT') alSalir()
      else if (evento === 'SIGNED_IN' && sesion) alEntrar(sesion)
    }, 0)
  })
  return () => data.subscription.unsubscribe()
}

/**
 * CU-04: perfil del usuario (lo crea solo el trigger de la BD al primer login).
 * Devuelve null si no se pudo leer: la app sigue funcionando con el nombre
 * que entrega Google, pero sin rol docente.
 */
export async function cargarPerfil(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) {
    console.warn('No se pudo cargar el perfil:', error.message)
    return null
  }
  return data
}

/** Nombre para saludar al alumno: perfil → datos de Google → correo. */
export function nombreVisible(perfil, usuario) {
  const meta = usuario?.user_metadata || {}
  return (
    perfil?.full_name ||
    meta.full_name ||
    meta.name ||
    (usuario?.email || '').split('@')[0] ||
    'Lector'
  )
}

/**
 * CU-04: ¿es docente? El rol SOLO se cambia por SQL (nadie se lo asigna).
 * Esto decide qué botones se ven; la protección real de los datos la da RLS.
 */
export function esDocente(perfil) {
  return perfil?.rol === 'docente'
}
