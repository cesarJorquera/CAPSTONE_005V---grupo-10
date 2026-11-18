/**
 * ============================================
 * ESTADO DE SESIÓN PARA EL ROUTER (MEJ-03)
 * ============================================
 * Los guards del router necesitan saber, ANTES de mostrar una pantalla,
 * si hay una sesión y si es docente. La sesión se lee de forma asíncrona
 * (Supabase), así que aquí hay dos cosas:
 *
 *  - `estadoSesion`: copia mínima y reactiva (usuario y rol) que App.vue
 *    actualiza cada vez que cambia la sesión.
 *  - `sesionLista`: promesa que se resuelve cuando ya se sabe si hay sesión
 *    (con o sin usuario). Los guards la esperan; sin esto, al recargar
 *    la página siempre mandarían al login.
 */
import { reactive } from 'vue'

export const estadoSesion = reactive({
  usuario: null, // usuario de Supabase Auth (null = sin sesión)
  esDocente: false
})

let resolverSesionLista
export const sesionLista = new Promise(resolve => {
  resolverSesionLista = resolve
})

/** Avisa a los guards que ya terminó la lectura de la sesión. */
export function marcarSesionLista() {
  resolverSesionLista()
}
