<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-between select-none">
    <!-- Barra superior morado oscuro (indigo-900) -->
    <header class="bg-indigo-900 text-white px-4 py-3.5 flex items-center justify-between shadow-md">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white shadow-inner">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        </div>
        <span class="text-xl font-black tracking-wide">Leo Ideas</span>
      </div>

      <div v-if="salaActiva" class="bg-indigo-800 text-yellow-300 font-mono font-bold text-sm px-3 py-1 rounded-lg">
        Sala {{ salaActiva }}
      </div>
    </header>

    <!-- Contenido principal según la etapa -->
    <main class="flex-1 max-w-md w-full mx-auto p-4 flex flex-col justify-center">
      <!-- AVISO: ACTIVIDAD TERMINADA -->
      <section v-if="actividadTerminada" class="bg-white rounded-3xl shadow-lg border border-yellow-200 p-6 text-center animate-fade-in">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-3xl">
          ℹ️
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">La actividad terminó</h2>
        <p class="text-gray-600 mb-6 text-sm">
          El aula cerró la sesión o la pantalla ya no está disponible.
        </p>
        <button
          type="button"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-colors text-base"
          data-test="btn-volver-inicio"
          @click="volverAlInicio"
        >
          Volver al inicio
        </button>
      </section>

      <!-- 1. FORMULARIO DE INGRESO (Antes de unirse) -->
      <section v-else-if="!unidoASala" class="bg-white rounded-3xl shadow-lg border border-purple-100 p-6 sm:p-8">
        <div class="text-center mb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
            Bienvenido a Leo Perfecto
          </h1>
          <p class="text-sm text-gray-500">
            {{ tieneSalaPrevia ? 'Únete a la actividad con tu alias' : 'Ingresa el código de tu clase y tu alias' }}
          </p>
        </div>

        <form @submit.prevent="unirse">
          <!-- Campo Código (solo si no viene fijado por URL) -->
          <div v-if="!tieneSalaPrevia" class="mb-4">
            <label for="campo-codigo" class="block text-sm font-bold text-gray-700 mb-1">
              Código de sesión (6 dígitos)
            </label>
            <input
              id="campo-codigo"
              v-model="codigoIngresado"
              type="text"
              inputmode="numeric"
              maxlength="6"
              placeholder="Ej: 123456"
              class="w-full text-center text-xl font-mono tracking-widest p-3 border-2 border-gray-300 rounded-2xl focus:border-purple-600 focus:outline-none"
              required
            />
          </div>

          <!-- Campo Alias -->
          <div class="mb-6">
            <label for="campo-alias" class="block text-sm font-bold text-gray-700 mb-1">
              Tu nombre o alias (máx 14 caracteres)
            </label>
            <input
              id="campo-alias"
              v-model="alias"
              type="text"
              maxlength="14"
              placeholder="Ej: Sofia"
              class="w-full text-xl p-3 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:outline-none"
              required
            />
            <div class="text-right text-xs text-gray-400 mt-1">
              {{ alias.length }}/14
            </div>
          </div>

          <p v-if="errorIngreso" class="text-sm text-red-600 mb-4 text-center font-semibold">
            {{ errorIngreso }}
          </p>

          <button
            type="submit"
            :disabled="!formularioValido || conectando"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-test="btn-entrar-sala"
          >
            {{ conectando ? 'Conectando…' : 'Entrar' }}
          </button>
        </form>
      </section>

      <!-- 2. LOBBY: Esperando a que comience la pregunta -->
      <section v-else-if="fase === 'lobby'" class="bg-white rounded-3xl shadow-lg border border-purple-100 p-6 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-3xl animate-bounce">
          💡
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Ya estás dentro, {{ alias }}!</h2>
        <div class="bg-purple-50 rounded-2xl p-4 text-sm text-purple-900 mb-6 text-left">
          <p class="font-bold mb-1">¿Cómo se juega?</p>
          <p>
            Tu profesora proyectará una pregunta en la pantalla grande. Cuando empiece, podrás escribir una palabra o idea clave para armar la nube colaborativa.
          </p>
        </div>
        <div class="flex items-center justify-center gap-2 text-purple-700 font-semibold animate-pulse text-base">
          <span>●</span>
          <span>Espera a que inicie la pregunta…</span>
        </div>
      </section>

      <!-- 3. PREGUNTA: Escribir y enviar respuesta -->
      <section v-else-if="fase === 'pregunta'" class="bg-white rounded-3xl shadow-lg border border-purple-100 p-6">
        <div class="text-center mb-6">
          <span class="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full inline-block mb-2">
            Pregunta
          </span>
          <h2 class="text-xl sm:text-2xl font-black text-gray-900">
            {{ preguntaActual }}
          </h2>
        </div>

        <div v-if="respuestaEnviada" class="bg-green-50 border border-green-200 rounded-2xl p-5 text-center text-green-900">
          <p class="text-2xl mb-1">✓</p>
          <p class="font-bold text-lg">¡Respuesta enviada!</p>
          <p class="text-sm mt-1 text-green-700">Tu aporte: <strong>{{ textoRespuesta }}</strong></p>
          <p class="text-xs text-green-600 mt-3">Espera a que la profesora muestre los resultados.</p>
        </div>

        <form v-else @submit.prevent="enviarRespuesta">
          <label for="campo-respuesta" class="block text-sm font-bold text-gray-700 mb-2">
            Tu palabra o idea (máx 20 caracteres)
          </label>
          <input
            id="campo-respuesta"
            v-model="textoRespuesta"
            type="text"
            maxlength="20"
            placeholder="Ej: Perseverancia"
            class="w-full text-xl p-3.5 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:outline-none mb-1"
            required
          />
          <div class="text-right text-xs text-gray-400 mb-6">
            {{ textoRespuesta.length }}/20
          </div>

          <button
            type="submit"
            :disabled="!textoRespuesta.trim()"
            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl text-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            data-test="btn-enviar-respuesta"
          >
            Enviar
          </button>
        </form>
      </section>

      <!-- 4. MOSTRAR: Mirar la pantalla -->
      <section v-else-if="fase === 'mostrar'" class="bg-white rounded-3xl shadow-lg border border-purple-100 p-8 text-center animate-fade-in">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-4xl shadow-inner">
          👀
        </div>
        <h2 class="text-3xl font-black text-gray-900 mb-2">
          ¡Mira la pantalla!
        </h2>
        <p class="text-gray-600 text-base mb-4">
          La nube de palabras se está armando en vivo con las respuestas de toda la clase.
        </p>
        <div class="bg-purple-50 text-purple-800 text-xs sm:text-sm font-semibold rounded-xl py-2 px-4 inline-block">
          Tu respuesta: {{ textoRespuesta || 'Enviada' }}
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabaseClient'

export default {
  name: 'LeoIdeasAlumno',
  props: {
    codigoSalaInicial: {
      type: String,
      default: ''
    }
  },
  emits: ['volver-inicio'],
  data() {
    return {
      alias: '',
      codigoIngresado: '',
      unidoASala: false,
      conectando: false,
      errorIngreso: '',
      fase: 'lobby', // 'lobby' | 'pregunta' | 'mostrar'
      preguntaActual: '',
      textoRespuesta: '',
      respuestaEnviada: false,
      actividadTerminada: false,
      proyectorVisto: false,
      canalSala: null,
      timerEsperaProyector: null,
      alumnoId: `alm_${Math.random().toString(36).slice(2, 10)}`
    }
  },
  computed: {
    tieneSalaPrevia() {
      return Boolean(this.codigoSalaInicial && this.codigoSalaInicial.trim())
    },
    salaActiva() {
      return this.tieneSalaPrevia ? this.codigoSalaInicial.trim() : this.codigoIngresado.trim()
    },
    formularioValido() {
      const aliasValido = this.alias.trim().length >= 2 && this.alias.trim().length <= 14
      const codigoValido = /^\d{6}$/.test(this.salaActiva)
      return aliasValido && codigoValido
    }
  },
  beforeUnmount() {
    this.limpiarTimer()
    this.desconectarCanal()
  },
  methods: {
    async unirse() {
      this.errorIngreso = ''
      if (!/^\d{6}$/.test(this.salaActiva)) {
        this.errorIngreso = 'El código debe tener 6 números'
        return
      }
      if (!this.formularioValido || !supabase) return
      this.conectando = true

      const canalNombre = `leo-ideas-sala-${this.salaActiva}`
      this.canalSala = supabase.channel(canalNombre)

      this.canalSala
        .on('presence', { event: 'sync' }, () => {
          this.verificarPresenciaProyector()
        })
        .on('broadcast', { event: 'fase' }, ({ payload }) => {
          this.procesarCambioFase(payload)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await this.canalSala.track({
              rol: 'alumno',
              alias: this.alias.trim().slice(0, 14),
              id: this.alumnoId
            })
            this.unidoASala = true
            this.conectando = false
            this.iniciarTimerEsperaProyector()
          } else if (status === 'CHANNEL_ERROR') {
            this.errorIngreso = 'No se pudo conectar a la sala. Revisa tu conexión.'
            this.conectando = false
          }
        })
    },
    verificarPresenciaProyector() {
      if (!this.canalSala) return
      const state = this.canalSala.presenceState()
      let hayProyector = false

      Object.values(state).forEach((presencias) => {
        presencias.forEach((p) => {
          if (p.rol === 'proyector') hayProyector = true
        })
      })

      if (hayProyector) {
        this.proyectorVisto = true
        this.limpiarTimer()
      } else if (this.proyectorVisto) {
        // Estaba conectado y desapareció
        this.actividadTerminada = true
      }
    },
    iniciarTimerEsperaProyector() {
      this.limpiarTimer()
      // Esperar ~5 segundos para dar tiempo al primer sync
      this.timerEsperaProyector = setTimeout(() => {
        if (!this.proyectorVisto) {
          this.actividadTerminada = true
        }
      }, 5000)
    },
    limpiarTimer() {
      if (this.timerEsperaProyector) {
        clearTimeout(this.timerEsperaProyector)
        this.timerEsperaProyector = null
      }
    },
    procesarCambioFase(payload) {
      if (!payload) return
      if (payload.fase === 'finalizada') {
        this.actividadTerminada = true
        return
      }

      if (payload.fase) {
        if (payload.fase !== this.fase) {
          // Si cambia la fase a pregunta, resetear respuestaEnviada
          if (payload.fase === 'pregunta') {
            this.respuestaEnviada = false
            this.textoRespuesta = ''
          }
          this.fase = payload.fase
        }
      }
      if (payload.pregunta) {
        this.preguntaActual = payload.pregunta
      }
    },
    enviarRespuesta() {
      const texto = this.textoRespuesta.trim().slice(0, 20)
      if (!texto || this.respuestaEnviada || !this.canalSala) return

      // Token aleatorio único por cada pregunta, sin alias
      const token = `tok_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`

      this.canalSala.send({
        type: 'broadcast',
        event: 'respuesta',
        payload: {
          texto,
          token
        }
      })

      this.respuestaEnviada = true
    },
    volverAlInicio() {
      this.desconectarCanal()
      this.$emit('volver-inicio')
    },
    desconectarCanal() {
      if (this.canalSala && supabase) {
        supabase.removeChannel(this.canalSala)
        this.canalSala = null
      }
    }
  }
}
</script>
