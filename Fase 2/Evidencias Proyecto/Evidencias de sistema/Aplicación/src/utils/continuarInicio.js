/**
 * ============================================
 * TARJETA "CONTINUAR" DE INICIO (UI-05)
 * ============================================
 * Decide qué le propone Inicio al alumno. Sin pantalla: recibe datos y
 * devuelve datos, para poder probarlo aparte.
 *
 * Prioridad (acordada en UI-05):
 *  1. Una partida interrumpida en este dispositivo, de hace menos de 24 horas.
 *  2. El siguiente paso disponible de la ruta de la Unidad 1.
 *  3. Si la ruta está terminada, la Unidad 2.
 *  Sin nada empezado, el paso 2 se presenta como "Empieza tu ruta".
 */
import { UNIDADES_CONFIG } from './gameManager'
import { TIPOS_OBLIGATORIOS } from '../components/ruta/progresoRuta'

/**
 * Pasos hechos / total, contando solo los obligatorios (igual que el camino de la ruta,
 * que muestra "0 de 7"): el paso opcional no suma ni resta.
 */
export function contarPasos(nodos) {
  const obligatorios = nodos.filter(n => TIPOS_OBLIGATORIOS.includes(n.tipo) && n.estado !== 'pronto')
  return {
    hechos: obligatorios.filter(n => n.estado === 'completado').length,
    total: obligatorios.length
  }
}

const NOMBRES_JUEGO = {
  1: 'Palabras clave',
  2: 'Clasificar palabras',
  3: 'Comprensión lectora',
  4: 'Trivia de comprensión'
}

/** Nombre legible de una partida guardada ("Palabras Clave - Frodo"). */
export function nombrePartida(juego, contenido) {
  for (const unidad of Object.values(UNIDADES_CONFIG)) {
    const encontrado = (unidad.juegos || []).find(j => j.gameId === juego && j.textId === contenido)
    if (encontrado) return encontrado.nombre
  }
  return NOMBRES_JUEGO[juego] || 'Tu partida'
}

/** A qué pantalla lleva retomar una partida (el router restaura el avance al entrar). */
export function destinoPartida(juego, contenido) {
  switch (juego) {
    case 1: return { name: 'juego1', params: { textId: contenido } }
    case 2: return { name: 'juego2', params: { textId: contenido } }
    case 3: return { name: 'juego3' }
    case 4: return { name: 'juego4' }
    default: return null
  }
}

/** "hace 5 minutos", "hace 2 horas" (las partidas guardadas duran 24 horas como máximo). */
export function haceCuanto(marcaDeTiempo, ahora = Date.now()) {
  const minutos = Math.max(0, Math.round((ahora - marcaDeTiempo) / 60000))
  if (minutos < 1) return 'hace un momento'
  if (minutos < 60) return minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`
  const horas = Math.round(minutos / 60)
  return horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`
}

/**
 * @param {object} datos
 * @param {object|null} datos.partida   partida interrumpida ya verificada ({ juego, contenido, guardadoEn }) o null
 * @param {object} datos.unidad         datos de la ruta (src/data/ruta/unidad1.js)
 * @param {Array}  datos.nodos          nodos de la ruta con `estado` (ver progresoRuta.estadoDeNodos)
 * @param {number} [datos.ahora]
 * @returns {object} lo que muestra la tarjeta
 */
export function elegirContinuar({ partida, unidad, nodos, ahora = Date.now() }) {
  const { hechos, total } = contarPasos(nodos)

  // 1) Partida interrumpida
  if (partida) {
    const destino = destinoPartida(partida.juego, partida.contenido)
    if (destino) {
      return {
        tipo: 'partida',
        etiqueta: 'Continuar donde lo dejaste',
        titulo: nombrePartida(partida.juego, partida.contenido),
        detalle: `Partida en curso · la dejaste ${haceCuanto(partida.guardadoEn, ahora)}`,
        mensajeLeo: 'Tu partida sigue guardada. Retómala donde ibas.',
        boton: 'Continuar',
        destino
      }
    }
  }

  // 2) Siguiente paso de la ruta: el primer nodo obligatorio disponible. El opcional
  //    ("Detective de palabras") no se propone aquí: sigue a mano en la ruta.
  const siguiente = nodos.find(n => n.estado === 'disponible' && n.tipo !== 'opcional')
  if (siguiente) {
    const tarea = (unidad.tareas && unidad.tareas[siguiente.tareaId]) || {}
    const nuevo = hechos === 0
    return {
      tipo: nuevo ? 'empezar' : 'ruta',
      etiqueta: nuevo ? 'Empieza tu ruta' : 'Tu siguiente paso',
      titulo: siguiente.titulo,
      unidad: `Unidad 1 · ${unidad.titulo}`,
      minutos: tarea.minutos || null,
      hechos,
      total,
      mensajeLeo: nuevo
        ? 'Empecemos por lo básico. Son pocos minutos.'
        : 'Sigamos con tu ruta. Son pocos minutos.',
      boton: nuevo ? 'Empezar' : 'Continuar',
      destino: { name: 'ruta', query: { tarea: siguiente.tareaId } }
    }
  }

  // 3) Ruta terminada: proponer la Unidad 2
  return {
    tipo: 'unidad2',
    etiqueta: 'Unidad 1 completada',
    titulo: 'Sigue con Comprensión lectora',
    unidad: 'Unidad 2 · Comprensión lectora',
    hechos,
    total,
    mensajeLeo: '¡Terminaste la Unidad 1! Ahora vamos con textos completos.',
    boton: 'Jugar',
    destino: null // la Unidad 2 elige el juego (gameManager), lo resuelve la pantalla
  }
}
