<template>
  <div
    class="min-h-screen"
  >
    <div
      v-if="tema === 'verde'"
      class="ruta-actividad min-h-screen flex flex-col"
      :class="['ruta-actividad--' + tema, 'reto-tipo--' + paso.tipo]"
    >
    <header class="runner-top mx-auto flex w-full max-w-3xl items-center gap-3 px-4 pb-3 pt-4 sm:px-6">
      <button
        type="button"
        class="u2-runner-button-secondary inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-extrabold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-leo-azul disabled:opacity-50"
        :disabled="guardando"
        @click="salir"
      ><span aria-hidden="true">←</span> Ruta</button>
      <div class="h-3 flex-1 overflow-hidden rounded-full bg-white/90 shadow-inner" role="progressbar" :aria-valuenow="progreso" aria-valuemin="0" aria-valuemax="100" :aria-label="'Reto: ' + progreso + '% completado'">
        <div
          class="h-full rounded-full bg-gradient-to-r from-blue-800 via-blue-600 to-sky-400 transition-all duration-500"
          :style="{ width: progreso + '%' }"
        ></div>
      </div>
      <span class="min-w-[3.4rem] text-right text-xs font-black text-teal-950">{{ progreso }}%</span>
    </header>

    <main class="runner-main mx-auto w-full max-w-3xl flex-1 px-4 pb-28 sm:px-6">
      <section       class="runner-banner mb-4 overflow-hidden rounded-3xl border border-leo-linea bg-white shadow-lg shadow-blue-950/5">
      <div class="flex items-center gap-3 bg-gradient-to-r from-leo-cielo via-white to-blue-50/90 px-4 py-4 sm:px-6">
        <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]">
          <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo" class="h-14 w-14 object-contain sm:h-16 sm:w-16">
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-leo-azul-osc">{{ tituloHabilidad }}</p>
          <h1 class="mt-0.5 text-xl font-black leading-tight text-leo-tinta sm:text-2xl">Reto {{ numeroReto }} de 4</h1>
        </div>
      </div>
      </section>

      <div class="mb-4 rounded-2xl border border-leo-linea bg-white/95 px-4 py-3 shadow-sm">
      <p class="text-sm font-semibold leading-relaxed text-leo-tinta">{{ instrucciones }}</p>
      </div>

      <div
        v-if="errorGuardado"
        class="mb-4 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-950 shadow-sm"
        role="alert"
      >
        {{ errorGuardado }}
      </div>
      <p v-if="guardando" class="mb-4 rounded-xl bg-leo-azul-osc px-4 py-2 text-center text-sm font-bold text-white" role="status">
        Guardando tu resultado…
      </p>

      <section v-if="paso.tipo === 'resumen'" class="runner-challenge rounded-3xl border border-white/80 bg-white p-5 shadow-xl sm:p-8">
        <p class="text-xs font-black uppercase tracking-[0.14em] text-teal-800">Aprendizaje clave</p>
        <ul class="mt-3 space-y-3">
          <li
            v-for="(punto, i) in paso.ejercicio.puntos"
            :key="i"
            class="rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4 font-semibold leading-relaxed text-slate-800"
          >{{ punto }}</li>
        </ul>
        <button
          type="button"
          class="runner-button-primary mt-5 w-full rounded-2xl py-3.5 text-lg font-black shadow-md transition hover:-translate-y-0.5 disabled:opacity-50"
          :disabled="guardando"
          @click="terminar"
        >{{ guardando ? 'Guardando…' : 'Continuar' }}</button>
      </section>

      <section
        v-else
        class="runner-challenge rounded-3xl border border-white/80 p-4 shadow-xl shadow-teal-950/10 sm:p-7"
        :class="[
          fase === 'feedback' ? 'runner-challenge--feedback' : '',
          guardando ? 'pointer-events-none opacity-70' : ''
        ]"
      >
        <div v-if="paso.recordemos" class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-black text-blue-950">
          <span aria-hidden="true">↻</span> Recordemos
        </div>
        <component
          :is="componente"
          v-if="componente && fase !== 'feedback'"
          :key="claveMinijuego"
          class="reto-minijuego"
          :ejercicio="paso.ejercicio"
          @responder="onResponder"
        />
        <div v-else-if="!componente" class="space-y-4 text-slate-800">
          <p>Este tipo de ejercicio todavía no está disponible.</p>
          <button type="button" class="runner-button-primary rounded-xl px-4 py-3 font-bold" @click="avanzar">Continuar</button>
        </div>

        <div v-if="fase === 'feedback'" class="runner-result mt-1 space-y-4" :class="ultimo.correcta ? 'runner-result--bien' : 'runner-result--repaso'">
          <div class="flex items-start gap-3">
            <span class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-black" :class="ultimo.correcta ? 'bg-emerald-200 text-emerald-950' : 'bg-blue-100 text-blue-950'" aria-hidden="true">
              {{ ultimo.correcta ? '✓' : '↻' }}
            </span>
            <div>
              <p class="text-xl font-black" :class="ultimo.correcta ? 'text-emerald-950' : 'text-blue-950'">
                {{ esUltimoEvaluable ? (ultimo.correcta ? '¡Reto superado!' : '¡Buen intento!') : (ultimo.correcta ? '¡Muy bien!' : 'Sigue buscando') }}
              </p>
              <p v-if="esUltimoEvaluable" class="mt-1 text-sm font-semibold text-slate-700">
                {{ ultimo.correcta ? 'Encontraste la respuesta. Este reto queda aprobado.' : 'Revisa la pista y decide si quieres probar otra vez.' }}
              </p>
            </div>
          </div>

          <p v-if="mostrarPista" class="rounded-xl bg-white/80 p-3 text-sm font-semibold leading-relaxed text-slate-800">{{ paso.ejercicio.pista }}</p>
          <p v-if="mostrarSolucion" class="rounded-xl bg-white/80 p-3 text-sm leading-relaxed text-slate-800">
            La respuesta era: <strong class="font-black">{{ solucion }}</strong>
          </p>
          <p v-if="paso.ejercicio.explicacion" class="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm font-semibold leading-relaxed text-teal-950">
            {{ paso.ejercicio.explicacion }}
          </p>
          <p v-if="ultimo.correcta && ultimo.ortografia" class="rounded-xl bg-white/80 p-3 text-sm text-slate-800">
            Ojo con la tilde: se escribe <strong>{{ solucion }}</strong>.
          </p>

          <template v-if="puedeVerTexto">
            <button type="button" class="rounded-lg px-1 py-1 text-sm font-extrabold text-teal-900 underline decoration-2 underline-offset-2" @click="verTexto = !verTexto">
              {{ verTexto ? 'Ocultar evidencia' : 'Ver en el texto' }}
            </button>
            <RutaOracion
              v-if="verTexto"
              :palabras="paso.ejercicio.palabras"
              :resaltadas="paso.ejercicio.evidencia"
            />
          </template>

          <div v-if="esUltimoEvaluable && !ultimo.correcta" class="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              class="runner-button-secondary min-h-12 rounded-2xl border-2 px-4 py-3 font-black transition"
              :disabled="guardando"
              @click="reintentar"
            >Probar otra vez</button>
            <button
              type="button"
              class="runner-button-primary min-h-12 rounded-2xl px-4 py-3 font-black shadow-md transition hover:-translate-y-0.5 disabled:opacity-50"
              :disabled="guardando"
              @click="terminar"
            >Siguiente reto</button>
          </div>
          <button
            v-else
            type="button"
            class="w-full min-h-12 rounded-2xl px-4 py-3 font-black shadow-md transition hover:-translate-y-0.5 disabled:opacity-50"
            :class="ultimo.correcta ? 'runner-button-success' : 'runner-button-primary'"
            :disabled="guardando"
            @click="esUltimoEvaluable ? terminar() : avanzar()"
          >{{ guardando ? 'Guardando…' : esUltimoEvaluable ? 'Siguiente reto' : 'Continuar' }}</button>
        </div>
      </section>
    </main>

    <footer v-if="fase === 'feedback' && guardando" class="sticky bottom-0 z-10 bg-teal-950/95 px-4 py-3 text-center text-sm font-bold text-white" role="status">
      Guardando tu resultado…
    </footer>
    </div>

    <div v-else class="min-h-screen flex flex-col bg-gray-50">
      <header class="flex items-center gap-3 p-4">
        <button
          type="button"
          class="text-2xl text-gray-500 disabled:opacity-50"
          aria-label="Salir de la tarea"
          :disabled="guardando"
          @click="salir"
        >✕</button>
        <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-600 transition-all duration-300" :style="{ width: progreso + '%' }"></div>
        </div>
      </header>
      <div class="w-full max-w-xl mx-auto px-4">
        <LeoMascota :estado="estadoLeo" tamano="sm" />
      </div>
      <div v-if="errorGuardado" class="mx-4 mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-semibold text-red-900" role="alert">
        {{ errorGuardado }}
      </div>
      <p v-if="guardando" class="px-4 pt-3 text-center text-sm font-semibold text-teal-900" role="status">
        Guardando tu resultado…
      </p>
      <main
        class="flex-1 w-full max-w-xl mx-auto p-4"
        :class="fase === 'feedback' || guardando ? 'pointer-events-none opacity-75' : ''"
      >
        <section v-if="paso.tipo === 'resumen'" class="space-y-6">
          <h2 class="text-2xl font-extrabold text-indigo-900">¡Terminaste la tarea!</h2>
          <p class="text-lg text-gray-800">Respondiste bien {{ aciertos }} de {{ evaluables.length }} preguntas.</p>
          <ul class="space-y-2">
            <li v-for="(punto, i) in paso.ejercicio.puntos" :key="i" class="p-3 rounded-xl bg-white shadow text-gray-800">{{ punto }}</li>
          </ul>
          <button type="button" class="w-full py-3 rounded-xl bg-indigo-600 text-white text-lg font-bold" :disabled="guardando" @click="terminar">
            {{ guardando ? 'Guardando…' : 'Terminar' }}
          </button>
        </section>
        <template v-else>
          <p v-if="paso.recordemos" class="mb-4 inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold">🔁 Recordemos</p>
          <component :is="componente" v-if="componente" :key="claveMinijuego" :ejercicio="paso.ejercicio" @responder="onResponder" />
          <div v-else class="space-y-4 text-gray-800">
            <p>Este tipo de ejercicio todavía no está disponible.</p>
            <button type="button" class="underline" @click="avanzar">Saltar</button>
          </div>
        </template>
      </main>
      <footer v-if="fase === 'feedback'" class="sticky bottom-0 p-4" :class="ultimo.correcta ? 'bg-green-100' : 'bg-yellow-100'">
        <div class="max-w-xl mx-auto space-y-3">
          <p class="text-2xl font-extrabold" :class="ultimo.correcta ? 'text-green-700' : 'text-yellow-800'">
            {{ ultimo.correcta ? '¡Fenomenal!' : '¡Ya casi!' }}
          </p>
          <p v-if="mostrarPista" class="text-gray-800">{{ paso.ejercicio.pista }}</p>
          <p v-if="mostrarSolucion" class="text-gray-800">La respuesta era: <strong>{{ solucion }}</strong></p>
          <p v-if="paso.ejercicio.explicacion" class="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm font-semibold leading-relaxed text-teal-950">
            {{ paso.ejercicio.explicacion }}
          </p>
          <p v-if="ultimo.correcta && ultimo.ortografia" class="text-gray-800">Ojo con la tilde: se escribe <strong>{{ solucion }}</strong>.</p>
          <template v-if="puedeVerTexto">
            <button type="button" class="underline text-gray-800" @click="verTexto = !verTexto">Ver en el texto</button>
            <RutaOracion v-if="verTexto" :palabras="paso.ejercicio.palabras" :resaltadas="paso.ejercicio.evidencia" />
          </template>
          <div v-if="puedeReintentar" class="flex gap-3">
            <button type="button" class="flex-1 py-3 rounded-xl border-2 border-yellow-700 text-yellow-800 font-bold" :disabled="guardando" @click="avanzar">Saltar</button>
            <button type="button" class="flex-1 py-3 rounded-xl bg-yellow-600 text-white font-bold" :disabled="guardando" @click="reintentar">Reintentar</button>
          </div>
          <button v-else type="button" class="w-full py-3 rounded-xl text-white font-bold" :class="ultimo.correcta ? 'bg-green-700' : 'bg-yellow-600'" :disabled="guardando" @click="avanzar">
            Continuar
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { createGameProgressTracker } from '../../utils/supabaseProgress'
import RutaOracion from './RutaOracion.vue'
import MjExplica from './minijuegos/MjExplica.vue'
import MjTocar from './minijuegos/MjTocar.vue'
import MjElegir from './minijuegos/MjElegir.vue'
import MjVf from './minijuegos/MjVf.vue'
import MjEscribir from './minijuegos/MjEscribir.vue'
import MjClasificar from './minijuegos/MjClasificar.vue'
import LeoMascota from './LeoMascota.vue'

// Tipo de paso → componente.
// Agregar un minijuego = importarlo, registrarlo en components y sumar una línea aquí.
const MINIJUEGOS = {
  explica: 'MjExplica',
  tocar: 'MjTocar',
  elegir: 'MjElegir',
  vf: 'MjVf',
  escribir: 'MjEscribir',
  clasificar: 'MjClasificar'
}

// Pasos que cuentan como pregunta (se guardan y suman al puntaje).
const TIPOS_EVALUABLES = ['tocar', 'elegir', 'vf', 'escribir', 'clasificar']

export default {
  name: 'TareaRunner',
  components: { LeoMascota, RutaOracion, MjExplica, MjTocar, MjElegir, MjVf, MjEscribir, MjClasificar },
  props: {
    tarea: { type: Object, required: true },
    // id de la ruta en la tabla games. Si es null, se juega sin guardar.
    gameId: { type: [String, Number], default: null },
    tema: { type: String, default: 'indigo' },
    tituloHabilidad: { type: String, default: '' },
    numeroReto: { type: Number, default: 1 }
  },
  emits: ['terminar', 'salir'],
  data() {
    return {
      indice: 0,
      fase: 'jugando', // 'jugando' | 'feedback'
      ultimo: null, // { correcta, respuesta, ortografia? } de la última respuesta
      intentos: 1,
      claveMinijuego: 0, // al cambiarla, Vue recrea el minijuego vacío
      verTexto: false,
      aciertos: 0,
      tracker: null,
      cerrado: false,
      guardando: false,
      errorGuardado: ''
    }
  },
  computed: {
    paso() {
      return this.tarea.pasos[this.indice]
    },
    estadoLeo() {
      if (this.paso.tipo === 'resumen') return 'celebrando'
      if (this.fase === 'feedback') return this.ultimo.correcta ? 'feliz' : 'yaCasi'
      if (this.paso.tipo === 'explica') return 'explicando'
      return 'pensando'
    },
    componente() {
      return MINIJUEGOS[this.paso.tipo] || null
    },
    indiceUltimoEvaluable() {
      return this.tarea.pasos.reduce((ultimo, paso, index) =>
        TIPOS_EVALUABLES.includes(paso.tipo) ? index : ultimo, -1
      )
    },
    esUltimoEvaluable() {
      return this.indice === this.indiceUltimoEvaluable
    },
    instrucciones() {
      const porTipo = {
        explica: 'Lee la pista y observa qué información destaca.',
        tocar: 'Toca en el texto las palabras que responden la pregunta.',
        elegir: 'Lee con atención y selecciona la respuesta mejor respaldada.',
        vf: 'Decide si la afirmación coincide con la información disponible.',
        escribir: 'Busca el dato en el texto y escribe tu respuesta.',
        clasificar: 'Toca una ficha y luego la categoría donde corresponde.'
      }
      return porTipo[this.paso.tipo] || 'Resuelve el reto y revisa la retroalimentación de Leo.'
    },
    evaluables() {
      return this.tarea.pasos.filter(p => TIPOS_EVALUABLES.includes(p.tipo))
    },
    progreso() {
      if (this.tema === 'verde' && this.fase === 'feedback' && this.esUltimoEvaluable) return 100
      const ultimo = this.tarea.pasos.length - 1
      return ultimo > 0 ? Math.round((this.indice / ultimo) * 100) : 100
    },
    puedeReintentar() {
      return !this.ultimo.correcta && this.paso.conAyuda
    },
    mostrarPista() {
      return !this.ultimo.correcta && this.paso.conAyuda && this.paso.ejercicio.pista
    },
    mostrarSolucion() {
      return !this.ultimo.correcta && !this.paso.conAyuda
    },
    puedeVerTexto() {
      // Solo cuando ya no hay reintento, para no regalar la respuesta.
      const e = this.paso.ejercicio
      return (this.ultimo.correcta || !this.paso.conAyuda) && e.evidencia && e.palabras
    },
    solucion() {
      const e = this.paso.ejercicio
      if (this.paso.tipo === 'elegir') return e.opciones[e.correcta]
      if (this.paso.tipo === 'tocar') return e.correctas.map(i => e.palabras[i]).join(', ')
      if (this.paso.tipo === 'vf') return e.correcta ? 'Verdadero' : 'Falso'
      if (this.paso.tipo === 'escribir') return e.palabras[e.correcta]
      if (this.paso.tipo === 'clasificar') {
        return e.fichas
          .map(f => f.texto + ': ' + e.cajas.find(c => c.id === f.caja).titulo)
          .join(' · ')
      }
      return ''
    }
  },
  methods: {
    estadoCamino(estado) {
      return {
        aprobado: 'aprobado',
        actual: 'en curso',
        reintento: 'por mejorar',
        pendiente: 'pendiente'
      }[estado]
    },
    async onResponder(resultado) {
      if (this.fase !== 'jugando' || this.guardando) return
      if (this.paso.tipo === 'explica') {
        this.avanzar()
        return
      }
      this.guardando = true
      this.errorGuardado = ''
      try {
        await this.guardar(resultado)
        this.ultimo = resultado
        if (resultado.correcta) this.aciertos++
        this.fase = 'feedback'
      } catch (error) {
        console.error('No se pudo guardar la respuesta de la tarea:', error)
        this.errorGuardado = 'No se guardó tu respuesta. Vuelve a pulsar Comprobar para reintentar.'
      } finally {
        this.guardando = false
      }
    },
    guardar(resultado) {
      if (!this.tracker) return
      return this.tracker.record({
        itemId: this.paso.id,
        isCorrect: resultado.correcta,
        attemptNumber: this.intentos,
        assessmentType: this.tarea.assessmentType || 'basic_concept',
        // Mismos códigos que los juegos (src/utils/assessment.js), para analizar todo junto.
        assessmentCode: this.paso.codigo || this.tarea.codigo || 'language.word_classification',
        answer: {
          tipo: this.paso.tipo,
          respuesta: resultado.respuesta,
          ortografia: resultado.ortografia || null
        }
      })
    },
    reintentar() {
      this.intentos++
      this.reiniciarPaso()
    },
    avanzar() {
      const siguiente = this.tarea.pasos[this.indice + 1]
      if (!siguiente || (this.tema === 'verde' && siguiente.tipo === 'resumen')) {
        this.terminar()
        return
      }
      this.indice++
      this.intentos = 1
      this.ultimo = null
      this.reiniciarPaso()
    },
    reiniciarPaso() {
      this.fase = 'jugando'
      this.verTexto = false
      this.claveMinijuego++
    },
    async terminar() {
      if (this.guardando) return
      this.guardando = true
      this.errorGuardado = ''
      try {
        await this.cerrarSesion('complete')
      } catch (error) {
        console.error('No se pudo completar la sesión de la tarea:', error)
        this.errorGuardado = 'No pudimos guardar el cierre de la actividad. Vuelve a intentarlo.'
        this.guardando = false
        return
      }
      this.guardando = false
      this.$emit('terminar', {
        tareaId: this.tarea.id,
        aciertos: this.aciertos,
        total: this.evaluables.length
      })
    },
    async salir() {
      if (this.guardando) return
      this.guardando = true
      this.errorGuardado = ''
      try {
        await this.cerrarSesion('abandon')
      } catch (error) {
        console.error('No se pudo abandonar la sesión de la tarea:', error)
        this.errorGuardado = 'No pudimos guardar la salida. Vuelve a intentarlo.'
        this.guardando = false
        return
      }
      this.guardando = false
      this.$emit('salir')
    },
    async cerrarSesion(tipo) {
      if (!this.tracker || this.cerrado) return
      const promesa = tipo === 'complete' ? this.tracker.complete() : this.tracker.abandon()
      await promesa
      this.cerrado = true
    }
  },
  created() {
    if (this.gameId !== null) {
      this.tracker = createGameProgressTracker({
        gameId: this.gameId,
        contentId: this.tarea.id,
        totalQuestions: this.evaluables.length,
        mode: 'ruta'
      })
    }
  },
  beforeUnmount() {
    // Si sale a mitad de la tarea, la sesión queda como abandonada.
    this.cerrarSesion('abandon').catch(error => {
      console.error('No se pudo abandonar la sesión al salir de la ruta:', error)
    })
  }
}
</script>

<style scoped>
.ruta-actividad--verde {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(ellipse at 2% 12%, rgba(37, 104, 196, 0.14), transparent 25rem),
    radial-gradient(ellipse at 98% 38%, rgba(125, 211, 252, 0.2), transparent 23rem),
    linear-gradient(155deg, #e7f0fa 0%, #f5f9fd 52%, #e4f0fb 100%);
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}

.ruta-actividad--verde::before,
.ruta-actividad--verde::after {
  position: absolute;
  z-index: -1;
  width: 18rem;
  height: 18rem;
  border-radius: 9999px;
  content: '';
  pointer-events: none;
  animation: fondo-runner-flotar 13s ease-in-out infinite alternate;
}

.ruta-actividad--verde::before {
  top: 16%;
  right: 0;
  width: min(18rem, 55vw);
  height: min(18rem, 55vw);
  background: radial-gradient(circle, rgba(125, 211, 252, 0.3), transparent 70%);
}

.ruta-actividad--verde::after {
  bottom: 8%;
  left: 0;
  width: min(18rem, 55vw);
  height: min(18rem, 55vw);
  background: radial-gradient(circle, rgba(37, 104, 196, 0.13), transparent 70%);
  animation-delay: -6s;
}

.ruta-actividad--verde > header,
.ruta-actividad--verde > main {
  position: relative;
  z-index: 1;
}

@keyframes fondo-runner-flotar {
  from { transform: translateY(-8px); }
  to { transform: translateY(12px); }
}

.ruta-actividad--verde :deep(.bg-indigo-600) {
  background-color: #2568c4 !important;
}

.ruta-actividad--verde :deep(.bg-indigo-100) {
  background-color: #e4f0fb !important;
}

.ruta-actividad--verde :deep(.bg-indigo-50) {
  background-color: #f3f8fd !important;
}

.ruta-actividad--verde :deep(.text-indigo-900),
.ruta-actividad--verde :deep(.text-indigo-800),
.ruta-actividad--verde :deep(.text-indigo-700),
.ruta-actividad--verde :deep(.text-indigo-600) {
  color: #1b4f9e;
}

.ruta-actividad--verde :deep(.border-indigo-600),
.ruta-actividad--verde :deep(.border-indigo-400) {
  border-color: #2568c4 !important;
}

.ruta-actividad--verde :deep(.border-indigo-200) {
  border-color: #bfd7f2 !important;
}

.ruta-actividad--verde :deep(.focus\:border-indigo-600:focus) {
  border-color: #2568c4 !important;
}

.ruta-actividad--verde :deep(.text-teal-950),
.ruta-actividad--verde :deep(.text-teal-900),
.ruta-actividad--verde :deep(.text-teal-800),
.ruta-actividad--verde :deep(.text-teal-700) {
  color: #1b4f9e !important;
}

.ruta-actividad--verde :deep(.border-teal-300),
.ruta-actividad--verde :deep(.border-teal-200),
.ruta-actividad--verde :deep(.border-teal-100) {
  border-color: #bfd7f2 !important;
}

.ruta-actividad--verde :deep(.bg-teal-900),
.ruta-actividad--verde :deep(.bg-teal-800),
.ruta-actividad--verde :deep(.bg-teal-700) {
  background-color: #2568c4 !important;
}

.ruta-actividad--verde :deep(.bg-teal-100),
.ruta-actividad--verde :deep(.bg-teal-50) {
  background-color: #e4f0fb !important;
}

.ruta-actividad--verde .runner-button-primary {
  background-color: #2568c4 !important;
  color: #ffffff !important;
  border-bottom: 4px solid #1b4f9e;
}

.ruta-actividad--verde .runner-button-primary:hover {
  background-color: #1b4f9e !important;
}

.ruta-actividad--verde .runner-button-success {
  background-color: #1f7a47 !important;
  color: #ffffff !important;
}

.ruta-actividad--verde .runner-button-success:hover {
  background-color: #17613a !important;
}

.ruta-actividad--verde .runner-button-secondary {
  border-color: #1b4f9e !important;
  border-bottom: 4px solid #2568c4;
  background-color: #ffffff !important;
  color: #1b4f9e !important;
}

.ruta-actividad--verde .runner-button-secondary:hover {
  background-color: #f3f8fd !important;
}

.ruta-actividad--verde .u2-runner-button-secondary {
  border: 2px solid #2568c4;
  border-bottom-width: 4px;
  background: #ffffff;
  color: #1b4f9e;
}

.ruta-actividad--verde .u2-runner-button-secondary:hover {
  background: #f3f8fd;
}

.runner-main {
  animation: entrar-suave 420ms ease-out both;
}

html[data-animaciones="off"] .ruta-actividad--verde::before,
html[data-animaciones="off"] .ruta-actividad--verde::after {
  animation: none;
}

.ruta-actividad--verde h1,
.ruta-actividad--verde h2,
.ruta-actividad--verde h3 {
  font-family: 'Lexend', system-ui, sans-serif;
}

.runner-challenge {
  position: relative;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.96);
  transition: background-color 240ms ease, border-color 240ms ease, transform 240ms ease;
}

.runner-challenge::before {
  position: absolute;
  top: -3.5rem;
  right: -2.5rem;
  width: 9rem;
  height: 9rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.48);
  content: '';
  pointer-events: none;
}

.runner-challenge > * {
  position: relative;
}

.reto-minijuego :deep(button:not(:disabled)) {
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
}

.reto-minijuego :deep(button:not(:disabled):hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(15, 118, 110, 0.12);
}

.reto-minijuego :deep(button:focus-visible),
.runner-challenge button:focus-visible {
  outline: 3px solid #0f766e;
  outline-offset: 3px;
}

.reto-tipo--explica .runner-challenge {
  border-color: #a7f3d0;
  background:
    repeating-linear-gradient(180deg, rgba(20, 184, 166, 0.035) 0, rgba(20, 184, 166, 0.035) 1px, transparent 1px, transparent 2.8rem),
    linear-gradient(135deg, #f0fdfa 0%, #fff 58%, #eff6ff 100%);
}

.reto-tipo--explica .reto-minijuego :deep(p:first-child) {
  border-left: 4px solid #0f766e;
  padding-left: 1rem;
  font-size: 1.15rem;
  line-height: 1.75;
}

.reto-tipo--tocar .runner-challenge {
  border-color: #67e8f9;
  background: radial-gradient(circle at 10% 12%, #cffafe, transparent 35%), linear-gradient(135deg, #ecfeff 0%, #fff 70%);
}

.reto-tipo--tocar .reto-minijuego :deep(div.flex button) {
  border-radius: 9999px;
  border-color: #5eead4;
  background: #fff;
  box-shadow: 0 2px 6px rgba(13, 148, 136, 0.08);
}

.reto-tipo--elegir .runner-challenge {
  border-color: #a7f3d0;
  background: linear-gradient(145deg, #ecfdf5 0%, #fff 52%, #eff6ff 100%);
}

.reto-tipo--elegir .reto-minijuego :deep(.grid > button) {
  min-height: 4.25rem;
  border-radius: 1.25rem;
  border-color: #99f6e4;
  box-shadow: 0 4px 12px rgba(15, 118, 110, 0.06);
}

.reto-tipo--vf .runner-challenge {
  border-color: #93c5fd;
  background: radial-gradient(circle at 90% 8%, #dbeafe, transparent 36%), linear-gradient(145deg, #eff6ff 0%, #fff 65%);
}

.reto-tipo--vf .reto-minijuego :deep(p.p-4) {
  border: 1px solid #93c5fd;
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.08);
  font-size: 1.1rem;
  line-height: 1.65;
}

.reto-tipo--escribir .runner-challenge {
  border-color: #86efac;
  background:
    radial-gradient(circle at 12px 12px, rgba(16, 185, 129, 0.12) 1.2px, transparent 1.5px),
    linear-gradient(135deg, #f0fdf4 0%, #fff 55%, #ecfeff 100%);
  background-size: 24px 24px, auto;
}

.reto-tipo--escribir .reto-minijuego :deep(input) {
  min-height: 3.5rem;
  border-color: #34d399;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.08);
}

.reto-tipo--clasificar .runner-challenge {
  border-color: #5eead4;
  background: linear-gradient(145deg, #f0fdfa 0%, #ecfeff 52%, #fff 100%);
}

.reto-tipo--clasificar .reto-minijuego :deep(div.bg-white.shadow) {
  border: 1px dashed #14b8a6;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.82);
}

.reto-tipo--clasificar .reto-minijuego :deep(.grid > div) {
  border-color: #5eead4;
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.82);
}

.runner-result--bien {
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #ecfdf5, #fff);
  padding: 1rem;
}

.runner-result--repaso {
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #eff6ff, #fff);
  padding: 1rem;
}

@keyframes entrar-suave {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .ruta-actividad--verde::before,
  .ruta-actividad--verde::after {
    animation: none;
  }

  .runner-main,
  .reto-minijuego :deep(button),
  .runner-challenge {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>