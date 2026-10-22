// ============================================
// NIVEL DE COMPRENSIÓN LECTORA (PR-05) — CONSTANTES
// Umbrales y nombres provisionales: los validará la profesora.
// Cambiar solo aquí; nivelComprension.js no tiene números fijos.
// ============================================

// Juego cuyas respuestas cuentan para el nivel (games.id en Supabase)
export const GAME_ID_COMPRENSION = 3

// Ítems resueltos mínimos para pasar de Descubriendo a Practicando
export const MIN_ITEMS_PRACTICANDO = 3

// Fracción de ítems resueltos para ser Competente (se redondea hacia arriba)
export const PORCENTAJE_COMPETENTE = 0.8

// Estados de cada habilidad, de menor a mayor
export const ESTADOS_HABILIDAD = [
  { id: 'descubriendo', nombre: 'Descubriendo' },
  { id: 'practicando', nombre: 'Practicando' },
  { id: 'competente', nombre: 'Competente' },
  { id: 'dominado', nombre: 'Dominado' }
]

// Estado desde el cual una habilidad suma para el nivel
export const ESTADO_QUE_SUMA = 'competente'

// Valor especial: exige todas las habilidades del catálogo
export const TODAS = 'todas'

// Niveles, de menor a mayor, según habilidades en Competente o superior
export const NIVELES = [
  { id: 'explorador', nombre: 'Explorador', minHabilidades: 0 },
  { id: 'aprendiz', nombre: 'Aprendiz', minHabilidades: 1 },
  { id: 'lector', nombre: 'Lector', minHabilidades: 3 },
  { id: 'maestro', nombre: 'Maestro', minHabilidades: TODAS }
]

// Mensajes para estudiantes TEA/FIL: solo alientan, nunca hablan de bajar o perder
export const MENSAJES = {
  faltanParaNivel: (faltan, nivel) =>
    `Te ${faltan === 1 ? 'falta' : 'faltan'} ${faltan} ${faltan === 1 ? 'habilidad' : 'habilidades'} para llegar a ${nivel}.`,
  nivelMaximo: nivel =>
    `¡Llegaste a ${nivel}! Cada texto que resuelvas te acerca a dominar todas las habilidades.`,
  todoDominado: nivel =>
    `¡Dominaste todas las habilidades! Eres ${nivel} de la lectura.`,
  faltanParaEstado: (faltan, estado) =>
    `Resuelve ${faltan} ${faltan === 1 ? 'texto' : 'textos'} más para llegar a ${estado}.`,
  habilidadDominada: () =>
    '¡Resolviste todos los textos de esta habilidad!'
}
