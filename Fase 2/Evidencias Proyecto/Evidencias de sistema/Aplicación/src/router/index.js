/**
 * ============================================
 * ROUTER (MEJ-03)
 * ============================================
 * Cada pantalla tiene una URL propia, así que el botón "atrás" del navegador,
 * recargar la página y compartir un enlace funcionan.
 *
 * `meta` de cada ruta:
 *  - publica:      se puede ver sin iniciar sesión.
 *  - soloInvitado: si ya hay sesión, redirige al inicio (landing y login).
 *  - docente:      solo para rol docente.
 *  - layout:       'bare' = pantalla completa sin navbar; 'app' = con navbar.
 *  - ancho:        (layout app) ocupa todo el ancho, sin contenedor central.
 *  - mascota:      muestra a Leo (mascota) junto a la pantalla.
 *  - seccion:      opción del menú principal que queda resaltada (UI-03).
 *  - sinMenu:      oculta el menú principal (durante los juegos, para no distraer ni salir sin querer).
 *  - titulo:       (UI-05) nombre de la sección en la barra superior del celular.
 *  - atras:        (UI-05) a dónde vuelve la flecha de la barra superior (pantallas internas, celular).
 *  - avance:       (juegos) función que devuelve { juego, contenido } para retomar
 *                  una partida interrumpida; ver utils/avanceJuego.js.
 */
import { createRouter, createWebHistory } from 'vue-router'
import { getAllTextIds } from '../data/game1_texts'
import { estadoSesion, sesionLista } from './estadoSesion'
import { prepararAvance } from '../utils/avanceJuego'
import { confirmarSiHayAvance, confirmacionOmitida } from '../utils/confirmarSalida'

import PantallaLanding from '../components/PantallaLanding.vue'
import pant_login from '../components/pant_login.vue'
import LeoIdeasAlumno from '../components/leo_ideas/LeoIdeasAlumno.vue'
import MiProgreso from '../components/MiProgreso.vue'
import PantallaProgreso from '../components/PantallaProgreso.vue'
import PantallaLeoIA from '../components/PantallaLeoIA.vue'
// UI-08: Ajustes ya tiene su pantalla; SeccionEnConstruccion queda sin uso (se deja el archivo
// por si se necesita para una sección futura).
// import SeccionEnConstruccion from '../components/menu/SeccionEnConstruccion.vue'
import PantallaAjustes from '../components/PantallaAjustes.vue'
import RutaAprendizaje from '../components/ruta/RutaAprendizaje.vue'
import RutaUnidad2 from '../components/ruta/RutaUnidad2.vue'
import pant_reglas_game1 from '../components/pant_reglas_game1.vue'
import pant_game_1 from '../components/pant_game_1.vue'
import pant_reglas_game2 from '../components/pant_reglas_game2.vue'
import pant_game_2 from '../components/pant_game_2.vue'
import pant_game_3 from '../components/pant_game_3.vue'
import pant_reglas_game4 from '../components/pant_reglas_game4.vue'
import pant_game_4 from '../components/pant_game_4.vue'

// Los espacios docentes se cargan solo cuando se entra a ellos: el alumno
// (celular) no descarga ese código. Los juegos del alumno van en el paquete
// principal para que no fallen a mitad de partida si se corta la conexión.
const LeoAula = () => import(/* webpackChunkName: "docente" */ '../components/docente/LeoAula.vue')
const LeoDash = () => import(/* webpackChunkName: "docente" */ '../components/docente/LeoDash.vue')
const ElegirEspacio = () => import(/* webpackChunkName: "docente" */ '../components/docente/ElegirEspacio.vue')
const LeoIdeasProyector = () => import(/* webpackChunkName: "docente" */ '../components/leo_ideas/LeoIdeasProyector.vue')
const LeoIdeasControl = () => import(/* webpackChunkName: "docente" */ '../components/leo_ideas/LeoIdeasControl.vue')

/** Identificadores válidos de texto del Juego 2 (arrastrar y soltar). */
export const TEXTOS_JUEGO2 = ['drag1', 'drag2', 'drag3']

const CODIGO_SALA = /^\d{6}$/

function textoJuego1Valido(to) {
  return getAllTextIds().includes(to.params.textId) ? true : { name: 'inicio' }
}
function textoJuego2Valido(to) {
  return TEXTOS_JUEGO2.includes(to.params.textId) ? true : { name: 'inicio' }
}

const BARE = { layout: 'bare' }
const APP = { layout: 'app' }
const JUEGO = { ...APP, seccion: 'inicio', sinMenu: true }

const routes = [
  // --- Públicas ---
  { path: '/', name: 'landing', component: PantallaLanding, meta: { ...BARE, publica: true, soloInvitado: true } },
  { path: '/login', name: 'login', component: pant_login, meta: { ...BARE, publica: true, soloInvitado: true } },
  {
    // Sala de ideas del alumno: no necesita login (QR / código de 6 dígitos)
    path: '/sala',
    name: 'sala',
    component: LeoIdeasAlumno,
    meta: { ...BARE, publica: true },
    beforeEnter: to => (CODIGO_SALA.test(String(to.query.sala || '').trim()) ? true : { name: 'landing' })
  },

  // --- Alumno ---
  { path: '/inicio', name: 'inicio', component: MiProgreso, meta: { ...APP, seccion: 'inicio', ancho: true, titulo: 'Inicio' } },
  // UI-03/UI-04: secciones del menú (Ajustes sigue provisional hasta UI-08)
  { path: '/progreso', name: 'progreso', component: PantallaProgreso, meta: { ...APP, seccion: 'progreso', ancho: true, titulo: 'Progreso' } },
  { path: '/leoia', name: 'leoia', component: PantallaLeoIA, meta: { ...APP, seccion: 'leoia', ancho: true, titulo: 'LeoIA' } },
  { path: '/ajustes', name: 'ajustes', component: PantallaAjustes, meta: { ...APP, seccion: 'ajustes', ancho: true, titulo: 'Ajustes' } },
  { path: '/ruta', name: 'ruta', component: RutaAprendizaje, meta: { ...APP, seccion: 'inicio', titulo: 'Unidad 1 · Las palabras', atras: 'inicio' } },
  { path: '/ruta/unidad-2', name: 'ruta-unidad2', component: RutaUnidad2, meta: { ...APP, seccion: 'inicio', ancho: true, titulo: 'Unidad 2', atras: 'inicio' } },
  { path: '/juego/1/:textId/reglas', name: 'juego1-reglas', component: pant_reglas_game1, meta: { ...APP, seccion: 'inicio', titulo: 'Instrucciones', atras: 'inicio' }, beforeEnter: textoJuego1Valido },
  { path: '/juego/1/:textId', name: 'juego1', component: pant_game_1, meta: { ...JUEGO, mascota: true, avance: to => ({ juego: 1, contenido: to.params.textId }) }, beforeEnter: textoJuego1Valido },
  { path: '/juego/2/:textId/reglas', name: 'juego2-reglas', component: pant_reglas_game2, meta: { ...APP, seccion: 'inicio', titulo: 'Instrucciones', atras: 'inicio' }, beforeEnter: textoJuego2Valido },
  { path: '/juego/2/:textId', name: 'juego2', component: pant_game_2, meta: { ...JUEGO, avance: to => ({ juego: 2, contenido: to.params.textId }) }, beforeEnter: textoJuego2Valido },
  { path: '/juego/3', name: 'juego3', component: pant_game_3, meta: { ...JUEGO, avance: () => ({ juego: 3, contenido: 'principal', exigirPartidaAbierta: false }) } },
  { path: '/juego/4/reglas', name: 'juego4-reglas', component: pant_reglas_game4, meta: { ...APP, seccion: 'inicio', titulo: 'Instrucciones', atras: 'inicio' } },
  { path: '/juego/4', name: 'juego4', component: pant_game_4, meta: { ...JUEGO, avance: () => ({ juego: 4, contenido: 'trivia' }) } },

  // --- Docente ---
  { path: '/docente', name: 'docente', component: ElegirEspacio, meta: { ...APP, seccion: 'docente', docente: true, titulo: 'Panel docente' } },
  { path: '/docente/aula', name: 'docente-aula', component: LeoAula, meta: { ...APP, seccion: 'docente', docente: true, titulo: 'Leo Aula', atras: 'docente' } },
  { path: '/docente/aula/proyector', name: 'docente-proyector', component: LeoIdeasProyector, meta: { ...BARE, docente: true } },
  { path: '/docente/panel', name: 'docente-panel', component: LeoDash, meta: { ...APP, seccion: 'docente', docente: true, titulo: 'Leo Dash', atras: 'docente' } },
  { path: '/docente/panel/control', name: 'docente-control', component: LeoIdeasControl, meta: { ...APP, seccion: 'docente', docente: true, titulo: 'Leo Ideas', atras: 'docente-panel' } },

  // Cualquier otra dirección vuelve a la landing
  { path: '/:pathMatch(.*)*', redirect: { name: 'landing' } }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // Cada pantalla nueva empieza arriba (antes la página conservaba el scroll)
  scrollBehavior: (to, from, saved) => saved || { top: 0 }
})

/** Pantalla de inicio según el rol. */
export function rutaInicio() {
  return { name: estadoSesion.esDocente ? 'docente' : 'inicio' }
}

const CLAVE_REDIRECT = 'leo-perfecto-redirect'

/**
 * El login con Google saca al navegador de la app y vuelve a "/", así que la
 * página que se quería abrir (?redirect=) se guarda un momento en sessionStorage.
 */
export function recordarDestino(destino) {
  try {
    if (destino) sessionStorage.setItem(CLAVE_REDIRECT, String(destino))
    else sessionStorage.removeItem(CLAVE_REDIRECT) // no dejar un destino viejo de un intento anterior
  } catch (error) {
    console.warn('No se pudo recordar la página de destino:', error)
  }
}

function destinoRecordado() {
  try {
    const destino = sessionStorage.getItem(CLAVE_REDIRECT)
    sessionStorage.removeItem(CLAVE_REDIRECT)
    // Solo rutas internas de la app (nunca otra dirección web)
    if (destino && destino.startsWith('/') && !destino.startsWith('//')) return destino
  } catch (error) {
    console.warn('No se pudo leer la página de destino:', error)
  }
  return null
}

// Antes que nada: si se sale de algo en curso (un juego, una actividad), pedir confirmación.
// Cubre los botones de la app y el botón "atrás" del navegador (si se cancela, la URL se queda).
router.beforeEach(async (to, from) => {
  if (confirmacionOmitida()) return true
  if (to.name === from.name && JSON.stringify(to.params) === JSON.stringify(from.params)) return true
  return confirmarSiHayAvance('navegar')
})

router.beforeEach(async to => {
  // Enlaces antiguos de la sala (QR ya impresos): /?sala=NNNNNN → /sala
  const salaAntigua = String(to.query.sala || '').trim()
  if (to.name === 'landing' && CODIGO_SALA.test(salaAntigua)) {
    return { name: 'sala', query: { sala: salaAntigua } }
  }

  // No decidir nada hasta saber si hay sesión (evita mandar al login al recargar)
  await sesionLista

  if (to.meta.soloInvitado && estadoSesion.usuario) return destinoRecordado() || rutaInicio()
  if (to.meta.publica) return true

  if (!estadoSesion.usuario) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.docente && !estadoSesion.esDocente) return { name: 'inicio' }
  return true
})

// Antes de abrir un juego: si hay una partida interrumpida, dejarla lista para retomarla
router.beforeResolve(async to => {
  if (typeof to.meta.avance !== 'function' || !estadoSesion.usuario) return true
  const { juego, contenido, exigirPartidaAbierta } = to.meta.avance(to)
  await prepararAvance(juego, contenido, { exigirPartidaAbierta })
  return true
})

export default router
