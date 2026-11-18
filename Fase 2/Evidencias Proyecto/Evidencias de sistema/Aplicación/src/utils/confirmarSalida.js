/**
 * ============================================
 * AVISOS DE CONFIRMACIÓN AL SALIR (MEJ-03)
 * ============================================
 * Antes de salir de algo en curso (un juego, una carrera de textos o una
 * actividad de LeoIdeas con estudiantes conectados) se pide confirmación, con un
 * texto que dice lo que REALMENTE pasa en el código:
 *
 *  - Juegos: salir marca la partida como abandonada y descarta su avance guardado.
 *  - Actividad de LeoIdeas (docente): al salir del proyector se avisa a la sala
 *    que terminó (fase 'finalizada') y los estudiantes conectados se quedan sin actividad.
 *
 * Cómo se usa:
 *  1. La pantalla que tiene algo en curso se registra con `registrarSalida(fn)`.
 *     `fn` devuelve `{ tipo }` (qué está en curso) o `null` si no hay nada que perder.
 *  2. El router (antes de cambiar de pantalla, incluido el botón "atrás") y
 *     "Cerrar sesión" llaman a `confirmarSiHayAvance(motivo)`.
 *  3. App.vue muestra el diálogo (ModalConfirmacion) mientras `dialogo.abierto`.
 *
 * No se usa el `confirm()` del navegador: en celular es feo y no se puede personalizar.
 */
import { reactive } from 'vue'

export const dialogo = reactive({
  abierto: false,
  titulo: '',
  mensaje: '',
  textoConfirmar: '',
  textoCancelar: ''
})

const TEXTOS = {
  juego: {
    navegar: {
      titulo: '¿Salir del juego?',
      mensaje: 'Si sales ahora, perderás el avance de esta partida.',
      textoConfirmar: 'Salir',
      textoCancelar: 'Seguir jugando'
    },
    'cerrar-sesion': {
      titulo: '¿Cerrar sesión?',
      mensaje: 'Estás en medio de una partida. Si cierras sesión ahora, perderás su avance.',
      textoConfirmar: 'Cerrar sesión',
      textoCancelar: 'Seguir jugando'
    }
  },
  carrera: {
    navegar: {
      titulo: '¿Salir del juego?',
      mensaje: 'Si sales ahora, perderás el avance de esta carrera de textos.',
      textoConfirmar: 'Salir',
      textoCancelar: 'Seguir jugando'
    },
    'cerrar-sesion': {
      titulo: '¿Cerrar sesión?',
      mensaje: 'Estás en medio de una carrera de textos. Si cierras sesión ahora, perderás su avance.',
      textoConfirmar: 'Cerrar sesión',
      textoCancelar: 'Seguir jugando'
    }
  },
  actividad: {
    navegar: {
      titulo: '¿Terminar la actividad?',
      mensaje: 'Si sales ahora, la actividad termina para los estudiantes conectados.',
      textoConfirmar: 'Terminar y salir',
      textoCancelar: 'Seguir en la actividad'
    },
    'cerrar-sesion': {
      titulo: '¿Cerrar sesión?',
      mensaje: 'Hay una actividad en curso. Si cierras sesión ahora, termina para los estudiantes conectados.',
      textoConfirmar: 'Cerrar sesión',
      textoCancelar: 'Seguir en la actividad'
    }
  }
}

let verificador = null // función de la pantalla actual: devuelve { tipo } o null
let resolverRespuesta = null
let omitir = false

/** La pantalla con algo en curso se registra aquí al montarse. */
export function registrarSalida(fn) {
  verificador = fn
}

/** ...y se retira al desmontarse (solo si sigue siendo la registrada). */
export function liberarSalida(fn) {
  if (verificador === fn) verificador = null
}

/** Abre el diálogo y devuelve una promesa: true = confirmó la salida, false = se quedó. */
function pedirConfirmacion(textos) {
  if (resolverRespuesta) resolverRespuesta(false) // si ya había uno abierto, ese se cancela
  Object.assign(dialogo, textos, { abierto: true })
  return new Promise(resolve => {
    resolverRespuesta = resolve
  })
}

/** La llama el diálogo al elegir una opción. */
export function responderConfirmacion(confirmo) {
  dialogo.abierto = false
  const resolver = resolverRespuesta
  resolverRespuesta = null
  if (resolver) resolver(confirmo)
}

/**
 * ¿Se puede salir? Devuelve true enseguida si no hay nada en curso;
 * si lo hay, pregunta y espera la respuesta.
 * `motivo`: 'navegar' (cambiar de pantalla / botón atrás) o 'cerrar-sesion'.
 */
export async function confirmarSiHayAvance(motivo = 'navegar') {
  const enCurso = verificador ? verificador() : null
  if (!enCurso) return true
  const textos = TEXTOS[enCurso.tipo] && TEXTOS[enCurso.tipo][motivo]
  if (!textos) return true
  return pedirConfirmacion(textos)
}

/** Mientras es true el router no pregunta (la salida ya fue confirmada o no es voluntaria). */
export function omitirConfirmacion(valor) {
  omitir = Boolean(valor)
}
export function confirmacionOmitida() {
  return omitir
}
