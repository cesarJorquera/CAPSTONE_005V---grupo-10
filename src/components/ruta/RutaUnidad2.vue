<template>
  <main class="ruta-u2 min-h-screen px-4 py-4 sm:px-6 sm:py-7">
    <div class="ruta-u2__decoracion" aria-hidden="true">
      <svg viewBox="0 0 96 80" fill="none">
        <path d="M8 16c12-6 24-6 36 1v47c-12-7-24-7-36-1V16Z" />
        <path d="M88 16c-12-6-24-6-44 1v47c20-7 32-7 44-1V16Z" />
        <path d="M48 17v47M17 25c7-2 14-2 21 1M79 25c-7-2-14-2-21 1" />
        <path d="m76 6 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
      </svg>
    </div>
    <div class="mx-auto max-w-3xl">
      <header class="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          class="u2-button-secondary rounded-xl px-4 py-2.5 font-bold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-leo-azul focus:ring-offset-2"
          @click="$emit('salir')"
        >
          <span aria-hidden="true">←</span> Mi progreso
        </button>
        <span class="text-xs font-extrabold uppercase tracking-[0.16em] text-leo-azul-osc">Unidad 2 · Leer más allá</span>
      </header>

      <div
        v-if="modoVistaPrevia"
        class="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-950"
        role="status"
      >
        Exploración docente: puedes recorrer los retos sin guardar respuestas ni cambiar el progreso.
      </div>

      <div v-if="errorGuardado" class="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
        {{ errorGuardado }}
        <button v-if="errorCarga" type="button" class="ml-2 font-bold underline" @click="cargarAvance">Reintentar</button>
      </div>

      <p v-if="mensajeRuta && !retoActual" class="mb-4 rounded-2xl border border-blue-200 bg-white/90 px-4 py-3 text-sm font-semibold text-blue-950 shadow-sm" role="status">
        {{ mensajeRuta }}
      </p>

      <TareaRunner
        v-if="retoActual"
        :key="retoActual.id + '-' + intentosPorReto[retoActual.id]"
        :tarea="retoActual"
        :game-id="modoVistaPrevia ? null : unidad.gameId"
        tema="verde"
        :titulo-habilidad="habilidadActual.titulo"
        :numero-reto="numeroRetoActual"
        @terminar="alTerminar"
        @salir="salirDelReto"
      />

      <section v-else-if="modoExploracionDocente" class="overflow-hidden rounded-3xl border border-leo-linea bg-white shadow-xl shadow-blue-950/10">
        <div class="flex items-center justify-between gap-3 border-b border-leo-linea bg-gradient-to-r from-leo-cielo via-white to-blue-50 px-5 py-5 sm:px-7">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-[0.16em] text-leo-azul-osc">Herramienta docente</p>
            <h1 class="mt-1 text-2xl font-black text-slate-950">Explorar minijuegos</h1>
          </div>
          <button type="button" class="u2-button-secondary rounded-xl px-3 py-2 text-sm font-bold" @click="cerrarExploracionDocente">
            Volver a mi ruta
          </button>
        </div>
        <div class="space-y-5 p-4 sm:p-7">
          <section v-for="habilidad in unidad.habilidades" :key="habilidad.id" class="rounded-2xl border border-leo-linea bg-gradient-to-br from-white to-blue-50/70 p-4">
            <div class="mb-3 flex items-center gap-3">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-leo-cielo text-xs font-black text-leo-azul-osc">{{ numeroHabilidad(habilidad) }}</span>
              <div>
                <h2 class="font-extrabold text-slate-950">{{ habilidad.titulo }}</h2>
                <p class="text-xs text-slate-600">{{ habilidad.descripcion }}</p>
              </div>
            </div>
            <ol class="grid gap-2 sm:grid-cols-2">
              <li v-for="(reto, retoIndex) in habilidad.retos" :key="reto.id">
                <button type="button" class="u2-button-secondary flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-leo-azul" @click="abrirRetoDocente(habilidad, reto)">
                  <span class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-black text-blue-950">{{ retoIndex + 1 }}</span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm font-bold text-slate-900">{{ reto.titulo }}</span>
                    <span class="block text-xs text-slate-600">{{ nombreMecanica(reto) }}</span>
                  </span>
                  <span class="text-leo-azul-osc" aria-hidden="true">›</span>
                </button>
              </li>
            </ol>
          </section>
        </div>
      </section>

      <template v-else>
        <section class="overflow-hidden rounded-3xl border border-leo-linea bg-white shadow-lg shadow-blue-900/10">
          <div class="grid gap-3 bg-gradient-to-br from-leo-cielo via-white to-blue-50 px-5 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:px-8 sm:py-7">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.17em] text-leo-azul-osc">Unidad 2 · Comprensión lectora</p>
              <h1 class="mt-1 max-w-[14ch] break-words text-3xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-4xl">Leer más allá</h1>
              <p class="mt-2 max-w-xl text-sm leading-relaxed text-leo-texto sm:text-base">
                Conecta ideas, descubre pistas, reconoce causas e inferencias y compara lo que lees para comprender mensajes más complejos.
              </p>
              <button
                type="button"
                class="u2-button-primary mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-leo-tinta focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="cargando || errorCarga || !habilidadSiguiente"
                @click="jugarSiguiente"
              >
                {{ cargando ? 'Cargando tu ruta…' : habilidadSiguiente ? (Object.keys(intentosPorReto).length ? 'Continuar ruta' : 'Empezar ruta') : 'Ruta completada' }}
                <span v-if="habilidadSiguiente" aria-hidden="true">›</span>
              </button>
            </div>
            <div class="flex items-center gap-3 sm:justify-end">
              <img
                src="@/assets/icons/libro-sin-fondo-feliz.png"
                alt="Leo Perfecto"
                class="h-20 w-20 flex-shrink-0 object-contain sm:h-24 sm:w-24"
              />
              <p class="max-w-[9rem] text-sm font-bold leading-snug text-leo-azul-osc sm:hidden">¡Hola! Vamos a leer con atención.</p>
            </div>
          </div>

          <div class="border-t border-leo-linea px-5 py-4 sm:px-8">
            <div class="mb-2 flex items-center justify-between gap-3">
              <h2 class="text-sm font-extrabold text-slate-900">Tu avance</h2>
              <span class="text-sm font-bold text-leo-azul-osc">{{ habilidadesAprobadas.length }} / {{ unidad.habilidades.length }} habilidades</span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-leo-cielo" role="progressbar" :aria-valuenow="habilidadesAprobadas.length" aria-valuemin="0" :aria-valuemax="unidad.habilidades.length" :aria-label="habilidadesAprobadas.length + ' de ' + unidad.habilidades.length + ' habilidades aprobadas'">
              <div class="h-full rounded-full bg-leo-azul transition-all duration-500" :style="{ width: porcentajeRuta + '%' }"></div>
            </div>
          </div>

          <div class="px-4 pb-5 sm:px-8 sm:pb-8">
            <div v-if="cargando" class="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-700" role="status">
              Cargando tu avance…
            </div>

            <ol v-else class="space-y-3">
              <li v-for="(habilidad, index) in unidad.habilidades" :key="habilidad.id">
                <button
                  type="button"
                  class="flex min-h-[82px] w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-leo-azul focus:ring-offset-2 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  :class="claseHabilidad(index, habilidad)"
                  :disabled="!estaDesbloqueada(index) || errorCarga"
                  :aria-label="habilidad.titulo + ': ' + estadoHabilidad(index)"
                  @click="abrirHabilidad(habilidad)"
                >
                  <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-black" :class="claseNumero(index, habilidad)">
                    {{ numeroHabilidad(habilidad) }}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-base font-extrabold leading-tight text-slate-950">{{ habilidad.titulo }}</span>
                    <span class="mt-1 block text-xs font-medium text-slate-600">{{ aprobadasDe(habilidad).length }}/4 minijuegos aprobados</span>
                    <span class="mt-2 flex gap-1.5" :aria-label="resumenRetos(habilidad)">
                      <span
                        v-for="reto in habilidad.retos"
                        :key="reto.id"
                        class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black"
                        :class="clasePuntoReto(index, habilidad, reto)"
                        aria-hidden="true"
                      >{{ aprobadas.includes(reto.id) ? '✓' : intentosPorReto[reto.id] ? '↻' : '' }}</span>
                    </span>
                  </span>
                  <span class="max-w-[7rem] text-right text-xs font-extrabold" :class="habilidadAprobada(habilidad) ? 'text-emerald-800' : estaDesbloqueada(index) ? 'text-leo-azul-osc' : 'text-slate-500'">
                    {{ estadoHabilidad(index) }}
                  </span>
                  <span v-if="estaDesbloqueada(index)" class="text-lg font-bold text-leo-azul-osc" aria-hidden="true">›</span>
                </button>
              </li>
            </ol>

            <button
              v-if="esDocente || modoDesarrolloDisponible"
              type="button"
              class="u2-button-primary mt-5 w-full rounded-2xl px-4 py-3.5 text-left text-sm font-extrabold shadow-md transition focus:outline-none focus:ring-2 focus:ring-leo-tinta focus:ring-offset-2"
              @click="abrirExploracionDocente"
            >
              Modo desarrollador · Probar los 28 minijuegos
              <span class="mt-0.5 block text-xs font-semibold text-blue-100">Sin guardar resultados ni cambiar el avance</span>
            </button>

            <div v-if="!cargando && unidadCompletada" class="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
              <p class="font-extrabold text-emerald-950">¡Ruta completada!</p>
              <p class="mt-1 text-sm text-emerald-900">Puedes repetir los minijuegos y revisar cómo cambian tus resultados.</p>
            </div>
          </div>
        </section>
      </template>
    </div>
  </main>
</template>

<script>
import unidad from '@/data/ruta/unidad2.js'
import { cargarProgresoNube } from '@/utils/supabaseProgress.js'
import TareaRunner from './TareaRunner.vue'

const RETOS_PARA_AVANZAR = 3
const MECANICAS = {
  explica: 'Observa la pista',
  tocar: 'Toca la evidencia',
  elegir: 'Elige una respuesta',
  vf: 'Verdadero o falso',
  escribir: 'Escribe tu respuesta',
  clasificar: 'Clasifica las pistas'
}

export default {
  name: 'RutaUnidad2',
  components: { TareaRunner },
  props: {
    esDocente: { type: Boolean, default: false }
  },
  emits: ['salir'],
  data() {
    return {
      unidad,
      aprobadas: [],
      intentosPorReto: {},
      retosVisitados: [],
      habilidadActual: null,
      retoActual: null,
      cargando: true,
      errorCarga: false,
      errorGuardado: '',
      modoVistaPrevia: false,
      modoExploracionDocente: false,
      mensajeRuta: '',
      modoDesarrolloDisponible: process.env.NODE_ENV === 'development'
    }
  },
  computed: {
    habilidadesAprobadas() {
      return this.unidad.habilidades.filter(habilidad => this.habilidadAprobada(habilidad))
    },
    porcentajeRuta() {
      return Math.round((this.habilidadesAprobadas.length / this.unidad.habilidades.length) * 100)
    },
    unidadCompletada() {
      return this.habilidadesAprobadas.length === this.unidad.habilidades.length
    },
    habilidadSiguiente() {
      return this.unidad.habilidades.find((habilidad, index) =>
        this.estaDesbloqueada(index) && !this.habilidadAprobada(habilidad)
      ) || null
    },
    numeroRetoActual() {
      if (!this.habilidadActual || !this.retoActual) return 1
      return this.habilidadActual.retos.findIndex(reto => reto.id === this.retoActual.id) + 1
    }
  },
  created() {
    this.modoExploracionDocente = (this.esDocente || this.modoDesarrolloDisponible) &&
      new URLSearchParams(window.location.search).get('demoRuta2') === '1'
    this.modoVistaPrevia = this.modoExploracionDocente
    if (this.modoVistaPrevia) {
      this.cargando = false
      return
    }
    this.cargarAvance()
  },
  methods: {
    async cargarAvance() {
      this.cargando = true
      this.errorCarga = false
      this.errorGuardado = ''
      try {
        const sesiones = await cargarProgresoNube()
        const idsReto = new Set(Object.keys(this.unidad.tareas))
        const intentos = {}
        const aprobadas = new Set()
        sesiones
          .filter(sesion => Number(sesion.gameId) === this.unidad.gameId && idsReto.has(sesion.textId))
          .forEach(sesion => {
            if (!sesion.answeredCount) return
            intentos[sesion.textId] = (intentos[sesion.textId] || 0) + 1
            if (
              sesion.status === 'completed' &&
              sesion.totalQuestions > 0 &&
              sesion.correctAnswers === sesion.totalQuestions
            ) {
              aprobadas.add(sesion.textId)
            }
          })
        this.intentosPorReto = intentos
        this.aprobadas = [...aprobadas]
      } catch (error) {
        console.error('No se pudo cargar el progreso de la ruta Unidad 2:', error)
        this.errorCarga = true
        this.errorGuardado = 'No pudimos cargar tu avance. Revisa tu conexión y vuelve a intentarlo.'
      } finally {
        this.cargando = false
      }
    },
    numeroHabilidad(habilidad) {
      const index = this.unidad.habilidades.findIndex(item => item.id === habilidad.id)
      return String(index + 1).padStart(2, '0')
    },
    aprobadasDe(habilidad) {
      return habilidad.retos.filter(reto => this.aprobadas.includes(reto.id))
    },
    habilidadAprobada(habilidad) {
      return this.aprobadasDe(habilidad).length >= RETOS_PARA_AVANZAR
    },
    estaDesbloqueada(index) {
      if (index === 0) return true
      return this.habilidadAprobada(this.unidad.habilidades[index - 1])
    },
    estadoHabilidad(index) {
      const habilidad = this.unidad.habilidades[index]
      if (this.habilidadAprobada(habilidad)) return 'Aprobada · repetir'
      if (this.estaDesbloqueada(index)) return 'Disponible'
      return 'Completa la anterior'
    },
    claseNumero(index, habilidad) {
      if (this.habilidadAprobada(habilidad)) return 'bg-emerald-100 text-emerald-900'
      if (this.estaDesbloqueada(index)) return 'bg-leo-cielo text-leo-azul-osc'
      return 'bg-slate-200 text-slate-600'
    },
    clasePuntoReto(index, habilidad, reto) {
      if (this.aprobadas.includes(reto.id)) return 'bg-emerald-100 text-emerald-900'
      if (!this.estaDesbloqueada(index)) return 'bg-slate-200 text-slate-500'
      if (reto.id === this.retoPendiente(habilidad).id) return 'bg-leo-cielo text-leo-azul-osc ring-2 ring-blue-200'
      if (this.intentosPorReto[reto.id]) return 'bg-blue-100 text-blue-900'
      return 'bg-slate-100 text-slate-700'
    },
    resumenRetos(habilidad) {
      return habilidad.retos.map((reto, index) => {
        const estado = this.aprobadas.includes(reto.id)
          ? 'aprobado'
          : reto.id === this.retoPendiente(habilidad).id && this.estaDesbloqueada(this.unidad.habilidades.indexOf(habilidad))
            ? 'siguiente'
            : this.intentosPorReto[reto.id]
              ? 'por mejorar'
              : 'pendiente'
        return 'Reto ' + (index + 1) + ': ' + estado
      }).join(', ')
    },
    abrirHabilidad(habilidad) {
      const index = this.unidad.habilidades.findIndex(item => item.id === habilidad.id)
      if (!this.estaDesbloqueada(index) || this.errorCarga) return
      this.mensajeRuta = ''
      this.habilidadActual = habilidad
      this.retosVisitados = []
      if (this.modoExploracionDocente) return
      const reto = this.retoPendiente(habilidad)
      this.jugarReto(reto)
    },
    retoPendiente(habilidad) {
      return habilidad.retos.find(reto => !this.aprobadas.includes(reto.id)) || habilidad.retos[0]
    },
    claseHabilidad(index, habilidad) {
      if (this.habilidadAprobada(habilidad)) return 'border-leo-linea bg-white hover:border-leo-azul hover:bg-blue-50'
      if (this.estaDesbloqueada(index)) return 'border-leo-azul bg-white hover:border-leo-azul-osc hover:bg-leo-cielo'
      return 'border-leo-linea bg-slate-100 opacity-75'
    },
    jugarSiguiente() {
      if (this.cargando || this.errorCarga || !this.habilidadSiguiente) return
      this.abrirHabilidad(this.habilidadSiguiente)
    },
    abrirExploracionDocente() {
      if (!this.esDocente && !this.modoDesarrolloDisponible) return
      this.modoExploracionDocente = true
      this.modoVistaPrevia = true
      this.habilidadActual = null
      this.mensajeRuta = ''
    },
    cerrarExploracionDocente() {
      this.modoExploracionDocente = false
      this.modoVistaPrevia = false
      this.habilidadActual = null
      this.retoActual = null
      this.mensajeRuta = ''
    },
    abrirRetoDocente(habilidad, reto) {
      if ((!this.esDocente && !this.modoDesarrolloDisponible) || !this.modoExploracionDocente) return
      this.habilidadActual = habilidad
      this.jugarReto(reto)
    },
    nombreMecanica(reto) {
      const paso = reto.pasos.find(item => item.tipo !== 'resumen')
      return MECANICAS[paso.tipo] || 'Reto breve'
    },
    jugarReto(reto) {
      this.errorGuardado = ''
      this.mensajeRuta = ''
      this.retoActual = reto
    },
    salirDelReto() {
      this.retoActual = null
      this.habilidadActual = null
    },
    alTerminar(resultado) {
      if (this.modoExploracionDocente) {
        this.retoActual = null
        this.habilidadActual = null
        return
      }

      const retoId = resultado.tareaId
      this.intentosPorReto = {
        ...this.intentosPorReto,
        [retoId]: (this.intentosPorReto[retoId] || 0) + 1
      }
      if (resultado.total > 0 && resultado.aciertos === resultado.total && !this.aprobadas.includes(retoId)) {
        this.aprobadas = [...this.aprobadas, retoId]
      }
      this.retosVisitados = [...new Set([...this.retosVisitados, retoId])]
      const siguiente = this.habilidadActual.retos.find(reto =>
        !this.aprobadas.includes(reto.id) && !this.retosVisitados.includes(reto.id)
      )
      if (siguiente) {
        this.jugarReto(siguiente)
        return
      }

      const habilidadTerminada = this.habilidadActual
      this.retoActual = null
      this.habilidadActual = null
      this.mensajeRuta = this.habilidadAprobada(habilidadTerminada)
        ? '¡Habilidad aprobada! Ya puedes seguir por la ruta o volver a practicar.'
        : 'Terminaste los retos disponibles de esta habilidad. Ábrela de nuevo para repetir los que quieras mejorar.'
    }
  }
}
</script>

<style scoped>
.ruta-u2 {
  position: relative;
  isolation: isolate;
  background-color: #e7f0fa;
  background-attachment: fixed;
  color: #3a4960;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}

.ruta-u2 > .mx-auto {
  position: relative;
  z-index: 1;
}

.ruta-u2 h1,
.ruta-u2 h2,
.ruta-u2 h3 {
  font-family: 'Lexend', system-ui, sans-serif;
}

.ruta-u2__decoracion {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ruta-u2__decoracion::before,
.ruta-u2__decoracion::after {
  position: absolute;
  display: block;
  content: '';
  border-radius: 9999px;
  animation: ruta-u2-flotar 12s ease-in-out infinite alternate;
}

.ruta-u2__decoracion::before {
  top: 11rem;
  right: max(1rem, calc((100vw - 72rem) / 2));
  width: 15rem;
  height: 15rem;
  background: radial-gradient(circle, rgba(125, 211, 252, 0.32), rgba(125, 211, 252, 0));
}

.ruta-u2__decoracion::after {
  bottom: 5rem;
  left: max(-5rem, calc((100vw - 86rem) / 2));
  width: 19rem;
  height: 19rem;
  background: radial-gradient(circle, rgba(37, 104, 196, 0.12), rgba(37, 104, 196, 0));
  animation-delay: -5s;
}

.ruta-u2__decoracion svg {
  position: absolute;
  top: 12rem;
  right: max(1.5rem, calc((100vw - 76rem) / 2));
  width: clamp(5rem, 11vw, 9rem);
  stroke: #2568c4;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.12;
  animation: ruta-u2-flotar 8s ease-in-out infinite alternate;
}

.u2-button-primary,
.u2-button-secondary {
  font-family: 'Lexend', system-ui, sans-serif;
  transition: transform 120ms ease, filter 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
}

.u2-button-primary {
  border: 0;
  border-bottom: 4px solid #1b4f9e;
  background: #2568c4;
  color: #ffffff;
}

.u2-button-primary:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.u2-button-primary:active:not(:disabled) {
  border-bottom-width: 1px;
  transform: translateY(3px);
}

.u2-button-secondary {
  border: 2px solid #2568c4;
  border-bottom-width: 4px;
  background: #ffffff;
  color: #1b4f9e;
}

.u2-button-secondary:hover {
  background: #f3f8fd;
}

.u2-button-secondary:active {
  border-bottom-width: 1px;
  transform: translateY(3px);
}

.u2-button-primary:focus-visible,
.u2-button-secondary:focus-visible {
  outline: 3px solid #14233b;
  outline-offset: 3px;
}

@keyframes ruta-u2-flotar {
  from { transform: translate3d(0, -6px, 0); }
  to { transform: translate3d(0, 10px, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .ruta-u2__decoracion::before,
  .ruta-u2__decoracion::after,
  .ruta-u2__decoracion svg {
    animation: none;
  }

  .ruta-u2 :deep(*) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

html[data-animaciones="off"] .ruta-u2__decoracion::before,
html[data-animaciones="off"] .ruta-u2__decoracion::after,
html[data-animaciones="off"] .ruta-u2__decoracion svg,
html[data-animaciones="off"] .u2-button-primary,
html[data-animaciones="off"] .u2-button-secondary {
  animation: none;
  transition: none;
}
</style>
