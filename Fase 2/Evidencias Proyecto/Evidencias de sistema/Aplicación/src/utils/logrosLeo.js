/**
 * UI-09: logros grandes de Leo (Leo con gafas de sol y el pulgar arriba).
 *
 * Tres momentos, cada uno se muestra una sola vez por usuario en este dispositivo:
 *  - u1:      completar la Unidad 1 (todos los pasos obligatorios de la Ruta).
 *  - juegoN:  completar todos los textos de un juego (1, 2, 3 o 4).
 *  - u2:      completar la Unidad 2 (Comprensión lectora). Hoy son los 30 textos del juego 3,
 *             así que coincide con "juego3": se muestra solo el de la unidad, que es el mayor.
 *
 * Solo lee el progreso que la app ya tiene (copia local de gameManager y lo que trae Inicio
 * de Supabase). No escribe en la base de datos. Lo "ya visto" se guarda en localStorage.
 */
import { UNIDADES_CONFIG } from './gameManager'

const ORDEN = ['u1', 'juego1', 'juego2', 'juego4', 'juego3', 'u2']

const NOMBRE_JUEGO = {
  1: 'Palabras clave',
  2: 'Clasificar palabras',
  3: 'Comprensión lectora',
  4: 'la Trivia de comprensión'
}

function claveVistos(nombre) {
  return `leo-perfecto-logros-vistos-${nombre || 'anonimo'}`
}

/** Textos (textId) que tiene cada juego, según la configuración de unidades */
export function textosDeJuego(gameId) {
  const ids = []
  Object.values(UNIDADES_CONFIG).forEach(unidad => {
    unidad.juegos.forEach(j => {
      if (Number(j.gameId) === Number(gameId)) ids.push(j.textId)
    })
  })
  return [...new Set(ids)]
}

function textosDeUnidad(unidadId) {
  const unidad = UNIDADES_CONFIG[unidadId]
  return unidad ? unidad.juegos.map(j => `${j.gameId}:${j.textId}`) : []
}

/**
 * Logros alcanzados con el progreso actual.
 * @param {{ pasosRuta: { hechos: number, total: number }, progreso: Array }} datos
 * @returns {string[]} ids en el orden en que conviene mostrarlos
 */
export function logrosAlcanzados({ pasosRuta, progreso }) {
  const hechos = new Set(
    (progreso || [])
      .filter(p => p && p.gameId != null && p.textId && (!p.status || p.status === 'completed'))
      .map(p => `${Number(p.gameId)}:${p.textId}`)
  )
  const ids = []
  if (pasosRuta && pasosRuta.total > 0 && pasosRuta.hechos >= pasosRuta.total) ids.push('u1')
  ;[1, 2, 3, 4].forEach(gameId => {
    const textos = textosDeJuego(gameId)
    if (textos.length && textos.every(t => hechos.has(`${gameId}:${t}`))) ids.push('juego' + gameId)
  })
  const unidad2 = textosDeUnidad(2)
  if (unidad2.length && unidad2.every(t => hechos.has(t))) ids.push('u2')
  return ORDEN.filter(id => ids.includes(id))
}

export function logrosVistos(nombre) {
  try {
    const guardado = JSON.parse(localStorage.getItem(claveVistos(nombre)) || '[]')
    return Array.isArray(guardado) ? guardado : []
  } catch (e) {
    return []
  }
}

export function marcarLogroVisto(nombre, id) {
  const vistos = logrosVistos(nombre)
  const nuevos = [id]
  // La Unidad 2 y el juego 3 son el mismo avance: al ver uno, el otro ya no se muestra
  if (id === 'u2') nuevos.push('juego3')
  if (id === 'juego3') nuevos.push('u2')
  nuevos.forEach(n => { if (!vistos.includes(n)) vistos.push(n) })
  try {
    localStorage.setItem(claveVistos(nombre), JSON.stringify(vistos))
  } catch (e) {
    // sin almacenamiento: el logro podría volver a mostrarse, no es grave
  }
}

/** Primer logro alcanzado que la persona aún no ha visto (o null) */
export function siguienteLogro(nombre, datos) {
  const vistos = logrosVistos(nombre)
  let pendientes = logrosAlcanzados(datos).filter(id => !vistos.includes(id))
  if (pendientes.includes('u2')) pendientes = pendientes.filter(id => id !== 'juego3')
  return pendientes[0] || null
}

/** Textos del diálogo de cada logro */
export function textoLogro(id, { totalPasos } = {}) {
  if (id === 'u1') {
    return {
      id,
      tono: 'verde',
      etiqueta: 'Unidad 1 completada',
      titulo: '¡Terminaste Las palabras!',
      cuerpo: `Completaste ${totalPasos ? 'los ' + totalPasos + ' pasos' : 'todos los pasos'} de tu ruta. Cuando quieras, sigue con Comprensión lectora.`,
      chispas: false
    }
  }
  if (id === 'u2') {
    return {
      id,
      tono: 'ambar',
      etiqueta: 'Unidad 2 completada',
      titulo: '¡Terminaste Comprensión lectora!',
      cuerpo: `Completaste los ${textosDeUnidad(2).length} textos de la unidad. Lo lograste paso a paso.`,
      chispas: true
    }
  }
  const gameId = Number(String(id).replace('juego', ''))
  const nombre = NOMBRE_JUEGO[gameId] || `el Juego ${gameId}`
  const unSoloTexto = textosDeJuego(gameId).length === 1
  return {
    id,
    tono: 'azul',
    etiqueta: 'Juego completado',
    titulo: unSoloTexto ? `¡Completaste ${nombre}!` : `¡Completaste todos los textos de ${nombre}!`,
    cuerpo: unSoloTexto ? 'Respondiste todo el juego. Buen trabajo.' : 'Leíste y resolviste cada uno. Buen trabajo.',
    chispas: false
  }
}
