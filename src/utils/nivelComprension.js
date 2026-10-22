// ============================================
// NIVEL DE COMPRENSIÓN LECTORA (PR-05)
// Funciones puras: reciben el progreso que entrega cargarProgresoNube()
// y devuelven el estado por habilidad y el nivel del alumno.
// Sin Supabase ni Vue, para poder probarlas con Node.
// ============================================
import { readingQuestionAssessment } from './assessment.js'
import { game3Texts } from '../data/game3_texts.js'
import {
  GAME_ID_COMPRENSION,
  MIN_ITEMS_PRACTICANDO,
  PORCENTAJE_COMPETENTE,
  ESTADOS_HABILIDAD,
  ESTADO_QUE_SUMA,
  TODAS,
  NIVELES,
  MENSAJES
} from './nivelComprensionConfig.js'

/**
 * Agrupa los textos del Juego 3 por habilidad.
 * El código se calcula igual que al guardar la respuesta (assessment.js),
 * así coincide siempre con game_responses.assessment_code.
 */
export function catalogoHabilidades(textos = game3Texts) {
  const porCodigo = new Map()

  Object.values(textos || {}).forEach(texto => {
    if (!texto || !texto.id || !texto.habilidad) return

    const { code } = readingQuestionAssessment(texto.habilidad)
    const habilidad = porCodigo.get(code) || { codigo: code, nombre: texto.habilidad, items: [] }
    habilidad.items.push(texto.id)
    porCodigo.set(code, habilidad)
  })

  return Array.from(porCodigo.values())
}

/**
 * Ítems resueltos necesarios para ser Competente.
 * Se redondea a 6 decimales antes de Math.ceil para que errores de coma
 * flotante (ej. 10 * 0.7 = 7.000000000000001) no exijan un ítem de más.
 */
export function minimoCompetente(total) {
  return Math.ceil(Math.round(total * PORCENTAJE_COMPETENTE * 1e6) / 1e6)
}

function estadoPorId(id) {
  return ESTADOS_HABILIDAD.find(estado => estado.id === id)
}

function estadoHabilidad(resueltos, total) {
  if (total > 0 && resueltos >= total) return estadoPorId('dominado')
  if (total > 0 && resueltos >= minimoCompetente(total)) return estadoPorId('competente')
  if (resueltos >= MIN_ITEMS_PRACTICANDO) return estadoPorId('practicando')
  return estadoPorId('descubriendo')
}

// Primer estado superior alcanzable y cuántos ítems faltan para llegar a él
function siguienteEstado(resueltos, total) {
  const actual = estadoHabilidad(resueltos, total)
  for (let n = resueltos + 1; n <= total; n++) {
    const estado = estadoHabilidad(n, total)
    if (estado.id !== actual.id) {
      return { id: estado.id, nombre: estado.nombre, faltan: n - resueltos }
    }
  }
  return null
}

/**
 * Ítems con al menos una respuesta correcta, en cualquier sesión del Juego 3.
 * Se ignoran respuestas de otros juegos, ítems que no están en el catálogo
 * y códigos que no corresponden a la habilidad del ítem.
 */
function itemsResueltos(progreso, codigoPorItem) {
  const resueltos = new Set()

  ;(Array.isArray(progreso) ? progreso : []).forEach(sesion => {
    if (!sesion || sesion.gameId !== GAME_ID_COMPRENSION) return

    ;(Array.isArray(sesion.respuestas) ? sesion.respuestas : []).forEach(respuesta => {
      if (!respuesta || respuesta.is_correct !== true) return
      if (codigoPorItem.get(respuesta.item_id) !== respuesta.assessment_code) return
      resueltos.add(respuesta.item_id)
    })
  })

  return resueltos
}

function minimoNivel(nivel, totalHabilidades) {
  if (nivel.minHabilidades !== TODAS) return nivel.minHabilidades
  return totalHabilidades > 0 ? totalHabilidades : Infinity
}

/**
 * Calcula el nivel de comprensión lectora del alumno.
 * @param {Array} progreso - Sesiones de cargarProgresoNube() (userProgress)
 * @param {Array} catalogo - Resultado de catalogoHabilidades()
 */
export function calcularNivelComprension(progreso, catalogo = catalogoHabilidades()) {
  const codigoPorItem = new Map()
  catalogo.forEach(habilidad => {
    habilidad.items.forEach(itemId => codigoPorItem.set(itemId, habilidad.codigo))
  })

  const resueltos = itemsResueltos(progreso, codigoPorItem)
  const rangoQueSuma = ESTADOS_HABILIDAD.findIndex(estado => estado.id === ESTADO_QUE_SUMA)

  const habilidades = catalogo.map(habilidad => {
    const total = habilidad.items.length
    const resueltosHabilidad = habilidad.items.filter(itemId => resueltos.has(itemId)).length
    const estado = estadoHabilidad(resueltosHabilidad, total)
    const siguiente = siguienteEstado(resueltosHabilidad, total)

    return {
      codigo: habilidad.codigo,
      nombre: habilidad.nombre,
      resueltos: resueltosHabilidad,
      total,
      porcentaje: total > 0 ? Math.round((resueltosHabilidad / total) * 100) : 0,
      estado: { id: estado.id, nombre: estado.nombre },
      siguienteEstado: siguiente,
      mensaje: siguiente
        ? MENSAJES.faltanParaEstado(siguiente.faltan, siguiente.nombre)
        : MENSAJES.habilidadDominada()
    }
  })

  const habilidadesQueSuman = habilidades.filter(habilidad =>
    ESTADOS_HABILIDAD.findIndex(estado => estado.id === habilidad.estado.id) >= rangoQueSuma
  ).length

  const indiceNivel = NIVELES.reduce(
    (indice, nivel, i) => (habilidadesQueSuman >= minimoNivel(nivel, catalogo.length) ? i : indice),
    0
  )
  const nivel = NIVELES[indiceNivel]
  const proximo = NIVELES[indiceNivel + 1] || null
  const siguienteNivel = proximo
    ? {
        id: proximo.id,
        nombre: proximo.nombre,
        faltanHabilidades: minimoNivel(proximo, catalogo.length) - habilidadesQueSuman
      }
    : null

  const todoDominado = habilidades.length > 0 && habilidades.every(h => h.estado.id === 'dominado')
  let mensaje
  if (siguienteNivel && Number.isFinite(siguienteNivel.faltanHabilidades)) {
    mensaje = MENSAJES.faltanParaNivel(siguienteNivel.faltanHabilidades, siguienteNivel.nombre)
  } else if (todoDominado) {
    mensaje = MENSAJES.todoDominado(nivel.nombre)
  } else {
    mensaje = MENSAJES.nivelMaximo(nivel.nombre)
  }

  return {
    habilidades,
    habilidadesQueSuman,
    nivel: { id: nivel.id, nombre: nivel.nombre, indice: indiceNivel },
    siguienteNivel,
    mensaje
  }
}
