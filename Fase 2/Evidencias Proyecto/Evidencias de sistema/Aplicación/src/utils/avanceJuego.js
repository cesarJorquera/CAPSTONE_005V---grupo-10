/**
 * ============================================
 * AVANCE DE JUEGO (MEJ-03)
 * ============================================
 * Guarda en el navegador (localStorage) el avance de una partida en curso para
 * que, si el alumno recarga la página o el celular cierra el navegador, pueda
 * retomarla donde iba, sin perder lo respondido.
 *
 * Reglas:
 *  - La copia se identifica por usuario + juego + contenido, y lleva un número
 *    de versión del formato (si cambia, la copia vieja se ignora).
 *  - Guarda el `sessionId` de la partida en Supabase: al retomar se sigue
 *    escribiendo en ESA partida (no se crea otra fila en game_sessions).
 *  - Vigencia de 24 horas desde que empezó la partida: es el mismo plazo con
 *    que la base cierra como "abandonada" una partida interrumpida.
 *  - Antes de retomar se consulta a la base si la partida sigue `in_progress`.
 *    Si ya no lo está (se completó, se abandonó a propósito o venció), la copia
 *    se descarta y se empieza una partida nueva.
 *  - Todo va dentro de try/catch: si localStorage no está disponible el juego
 *    funciona igual que antes, solo que sin poder retomar.
 */
import { estadoSesion } from '../router/estadoSesion'
import { sesionSigueEnCurso } from './supabaseProgress'

const VERSION = 1
const VIGENCIA_MS = 24 * 60 * 60 * 1000

// Avances ya verificados por el router, esperando a que la pantalla del juego los tome
const pendientes = new Map()

function clave(juego, contenido) {
  const usuarioId = estadoSesion.usuario && estadoSesion.usuario.id
  if (!usuarioId) return null
  return `leo-perfecto-avance:v${VERSION}:${usuarioId}:${juego}:${contenido}`
}

/** Guarda el avance. `estado` es lo que cada juego necesita para reconstruirse. */
export function guardarAvance(juego, contenido, { sessionId, iniciadaEn, estado }) {
  const k = clave(juego, contenido)
  if (!k || !sessionId) return
  try {
    localStorage.setItem(k, JSON.stringify({
      version: VERSION,
      sessionId,
      iniciadaEn,
      guardadoEn: Date.now(),
      estado
    }))
  } catch (error) {
    console.warn('No se pudo guardar el avance del juego:', error)
  }
}

/** Lee el avance guardado, o null si no hay, está vencido o no tiene el formato esperado. */
export function leerAvance(juego, contenido) {
  const k = clave(juego, contenido)
  if (!k) return null
  try {
    const crudo = localStorage.getItem(k)
    if (!crudo) return null
    const avance = JSON.parse(crudo)
    const valido =
      avance &&
      avance.version === VERSION &&
      typeof avance.sessionId === 'string' &&
      typeof avance.iniciadaEn === 'number' &&
      avance.estado &&
      typeof avance.estado === 'object'
    if (!valido || Date.now() - avance.iniciadaEn > VIGENCIA_MS) {
      localStorage.removeItem(k)
      return null
    }
    return avance
  } catch (error) {
    console.warn('No se pudo leer el avance del juego:', error)
    return null
  }
}

/**
 * UI-05: lista las partidas interrumpidas de ESTE usuario en ESTE navegador que
 * siguen vigentes (menos de 24 horas), de la más reciente a la más antigua.
 * La usa Inicio para la tarjeta "Continuar donde lo dejaste". Solo lee: las
 * copias vencidas o con otro formato las descarta `leerAvance`, como siempre.
 * Devuelve [{ juego, contenido, guardadoEn, sessionId }].
 */
export function listarAvancesGuardados() {
  const usuarioId = estadoSesion.usuario && estadoSesion.usuario.id
  if (!usuarioId) return []
  const prefijo = `leo-perfecto-avance:v${VERSION}:${usuarioId}:`
  const encontrados = []
  try {
    const claves = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith(prefijo)) claves.push(k)
    }
    // Se recorren aparte porque leerAvance puede borrar claves (cambia los índices)
    claves.forEach(k => {
      const [juegoTexto, ...resto] = k.slice(prefijo.length).split(':')
      const juego = Number(juegoTexto)
      const contenido = resto.join(':')
      if (!juego || !contenido) return
      const avance = leerAvance(juego, contenido)
      if (avance) {
        encontrados.push({
          juego,
          contenido,
          guardadoEn: avance.guardadoEn || avance.iniciadaEn,
          sessionId: avance.sessionId
        })
      }
    })
  } catch (error) {
    console.warn('No se pudieron revisar las partidas guardadas:', error)
    return []
  }
  return encontrados.sort((a, b) => b.guardadoEn - a.guardadoEn)
}

export function borrarAvance(juego, contenido) {
  const k = clave(juego, contenido)
  if (!k) return
  try {
    localStorage.removeItem(k)
  } catch (error) {
    console.warn('No se pudo borrar el avance del juego:', error)
  }
}

/**
 * La llama el router ANTES de abrir la pantalla de un juego: si hay un avance
 * guardado y la partida sigue abierta en la base, lo deja listo para que la
 * pantalla lo tome (así la pantalla puede restaurarse sin esperar a la red
 * y sin mostrar un instante la primera pregunta).
 */
export async function prepararAvance(juego, contenido, { exigirPartidaAbierta = true } = {}) {
  const clavePendiente = `${juego}:${contenido}`
  pendientes.delete(clavePendiente)
  const avance = leerAvance(juego, contenido)
  if (!avance) return
  let abierta = true
  try {
    abierta = await sesionSigueEnCurso(avance.sessionId)
  } catch (error) {
    // Sin conexión no se puede comprobar: se prefiere retomar antes que perder el avance
    console.warn('No se pudo comprobar la partida guardada; se intenta retomar igual:', error)
  }
  // Juegos 1, 2 y 4: una partida cerrada no se retoma (se descarta la copia).
  // Juego 3: cada respuesta cierra su partida, así que lo guardado es la carrera completa
  // y solo se anota si la partida de ese texto sigue abierta (`partidaAbierta`).
  if (!abierta && exigirPartidaAbierta) {
    borrarAvance(juego, contenido)
    return
  }
  pendientes.set(clavePendiente, { ...avance, partidaAbierta: abierta })
}

/** La pantalla del juego retira (una sola vez) el avance que preparó el router. */
export function tomarAvance(juego, contenido) {
  const clavePendiente = `${juego}:${contenido}`
  const avance = pendientes.get(clavePendiente) || null
  pendientes.delete(clavePendiente)
  return avance
}
