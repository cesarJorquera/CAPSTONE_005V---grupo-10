/**
 * ============================================
 * PREFERENCIAS DE SONIDO Y ANIMACIÓN (UI-05; la pantalla para cambiarlas es Ajustes, UI-08)
 * ============================================
 * UI-05 deja estos interruptores conectados; la pantalla para cambiarlos llega
 * con UI-08 (Ajustes). Mientras tanto se respetan sus valores por defecto:
 * sonidos encendidos y animaciones encendidas.
 *
 * UI-08: se guardan solo en este dispositivo (localStorage), decisión del equipo.
 * Si más adelante se pasan a Supabase, basta con cambiar leer() y escribir();
 * el resto de la app usa solo las funciones exportadas. Todo va en try/catch
 * para que la app funcione igual si el navegador no deja guardar.
 *
 * Las animaciones también se apagan si el sistema pide "reducir movimiento"
 * (prefers-reduced-motion). El CSS usa el atributo <html data-animaciones="off">,
 * el mismo gancho que ya usan los íconos del menú (UI-03).
 */

const CLAVE_SONIDOS = 'leo-perfecto-sonidos'
const CLAVE_ANIMACIONES = 'leo-perfecto-animaciones'

function leer(clave) {
  try {
    return localStorage.getItem(clave)
  } catch (error) {
    return null
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, valor)
  } catch (error) {
    console.warn('No se pudo guardar la preferencia:', error)
  }
}

/** ¿Suenan los efectos (bienvenida, clic)? Por defecto, sí. */
export function sonidosActivos() {
  return leer(CLAVE_SONIDOS) !== 'off'
}

export function cambiarSonidos(activos) {
  escribir(CLAVE_SONIDOS, activos ? 'on' : 'off')
}

/** ¿Se muestran animaciones? Por defecto sí, salvo que el sistema pida reducir movimiento. */
export function animacionesActivas() {
  if (leer(CLAVE_ANIMACIONES) === 'off') return false
  try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  } catch (error) {
    // sin matchMedia: se asume que no se pidió reducir movimiento
  }
  return true
}

export function cambiarAnimaciones(activas) {
  escribir(CLAVE_ANIMACIONES, activas ? 'on' : 'off')
  aplicarAnimaciones()
}

/** Refleja la preferencia en <html data-animaciones>, que es lo que mira el CSS. */
export function aplicarAnimaciones() {
  try {
    const html = document.documentElement
    if (leer(CLAVE_ANIMACIONES) === 'off') html.setAttribute('data-animaciones', 'off')
    else html.removeAttribute('data-animaciones')
  } catch (error) {
    console.warn('No se pudo aplicar la preferencia de animaciones:', error)
  }
}

/**
 * UI-08: lo que eligió la persona en Ajustes, sin mirar el sistema.
 * (animacionesActivas() además se apaga si el dispositivo pide reducir movimiento.)
 */
export function animacionesGuardadas() {
  return leer(CLAVE_ANIMACIONES) !== 'off'
}

/** UI-08: "Restablecer preferencias" vuelve a los valores de siempre (sonidos y animaciones encendidos). */
export function restablecerPreferencias() {
  try {
    localStorage.removeItem(CLAVE_SONIDOS)
    localStorage.removeItem(CLAVE_ANIMACIONES)
  } catch (error) {
    console.warn('No se pudieron restablecer las preferencias:', error)
  }
  aplicarAnimaciones()
}
