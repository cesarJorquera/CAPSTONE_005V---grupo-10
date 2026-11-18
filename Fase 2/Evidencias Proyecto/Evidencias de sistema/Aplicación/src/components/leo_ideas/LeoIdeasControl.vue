<template>
  <div class="max-w-md mx-auto px-4 py-6 select-none">
    <!-- Encabezado con estado de conexión de la pantalla -->
    <div class="flex items-center justify-between mb-6">
      <button
        type="button"
        class="text-gray-600 hover:text-gray-800 font-semibold py-2 px-3 rounded-xl hover:bg-gray-100 transition-colors"
        @click="$emit('volver')"
      >
        ← Leo Dash
      </button>

      <!-- Indicador de conexión con el proyector -->
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
        :class="proyectorConectado
          ? 'bg-green-50 text-green-800 border-green-200'
          : 'bg-yellow-50 text-yellow-800 border-yellow-200'"
      >
        <span
          class="w-2.5 h-2.5 rounded-full"
          :class="proyectorConectado ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'"
        ></span>
        <span>
          Pantalla del aula: {{ proyectorConectado ? 'conectada' : 'desconectada' }}
        </span>
      </div>
    </div>

    <!-- Título y código de sesión si existe -->
    <div class="bg-white rounded-3xl shadow-md border border-purple-100 p-6 mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold text-gray-800">Control Leo Ideas</h1>
        <span
          v-if="codigoSala"
          class="bg-purple-100 text-purple-900 font-mono font-black px-3 py-1 rounded-xl text-base"
        >
          #{{ codigoSala }}
        </span>
      </div>
      <p class="text-sm text-gray-500 mb-4">
        Escribe la pregunta y avanza cada etapa en orden.
      </p>

      <!-- Resumen en vivo de la sala -->
      <div v-if="fase !== 'reposo' && fase !== 'inicial'" class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-center">
        <div class="bg-purple-50 p-3 rounded-2xl">
          <p class="text-xs font-semibold text-purple-700 uppercase">Alumnos</p>
          <p class="text-2xl font-black text-purple-900">{{ totalAlumnos }}</p>
        </div>
        <div class="bg-purple-50 p-3 rounded-2xl">
          <p class="text-xs font-semibold text-purple-700 uppercase">Respuestas</p>
          <p class="text-2xl font-black text-purple-900">{{ totalRespuestas }}</p>
        </div>
      </div>
    </div>

    <!-- Caja de texto para la pregunta -->
    <div class="bg-white rounded-3xl shadow-md border border-gray-100 p-6 mb-6">
      <label for="pregunta-actividad" class="block text-sm font-bold text-gray-700 mb-2">
        Pregunta para los estudiantes
      </label>
      <textarea
        id="pregunta-actividad"
        v-model="pregunta"
        rows="3"
        maxlength="120"
        placeholder="Ej: ¿Qué palabra resume la lectura?"
        class="w-full text-base sm:text-lg p-3 border-2 border-purple-200 rounded-2xl focus:border-purple-600 focus:outline-none transition-colors resize-none disabled:bg-gray-100"
        :disabled="fase === 'mostrar' || fase === 'pregunta'"
      ></textarea>
      <div class="flex justify-between items-center text-xs text-gray-400 mt-1">
        <span>Máximo 120 caracteres</span>
        <span>{{ pregunta.length }}/120</span>
      </div>
    </div>

    <!-- 4 Botones en orden secuencial -->
    <div class="space-y-3">
      <!-- 1. LOBBY -->
      <button
        type="button"
        class="w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-md transition-all flex items-center justify-between"
        :class="puedeIniciarLobby
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!puedeIniciarLobby"
        data-test="btn-ctrl-lobby"
        @click="accionLobby"
      >
        <span>1. Lobby</span>
        <span class="text-sm font-normal opacity-80">
          {{ fase === 'lobby' ? '● En pantalla' : 'Abrir sala y QR' }}
        </span>
      </button>

      <!-- 2. PREGUNTA -->
      <button
        type="button"
        class="w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-md transition-all flex items-center justify-between"
        :class="puedeLanzarPregunta
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!puedeLanzarPregunta"
        data-test="btn-ctrl-pregunta"
        @click="accionPregunta"
      >
        <span>2. Pregunta</span>
        <span class="text-sm font-normal opacity-80">
          {{ fase === 'pregunta' ? '● Respondiendo' : 'Lanzar al aula' }}
        </span>
      </button>

      <!-- 3. MOSTRAR -->
      <button
        type="button"
        class="w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-md transition-all flex items-center justify-between"
        :class="puedeMostrarNube
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!puedeMostrarNube"
        data-test="btn-ctrl-mostrar"
        @click="accionMostrar"
      >
        <span>3. Mostrar</span>
        <span class="text-sm font-normal opacity-80">
          {{ fase === 'mostrar' ? '● Nube visible' : 'Proyectar nube' }}
        </span>
      </button>

      <!-- 4. FINALIZAR -->
      <button
        type="button"
        class="w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-md transition-all flex items-center justify-between"
        :class="puedeFinalizar
          ? 'bg-purple-600 hover:bg-purple-700 text-white'
          : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        :disabled="!puedeFinalizar"
        data-test="btn-ctrl-finalizar"
        @click="accionFinalizar"
      >
        <span>4. Finalizar</span>
        <span class="text-sm font-normal opacity-80">Cerrar actividad</span>
      </button>
    </div>
  </div>
</template>

<script>
import { supabase } from '../../utils/supabaseClient'

export default {
  name: 'LeoIdeasControl',
  props: {
    docenteId: {
      type: String,
      required: true
    }
  },
  emits: ['volver'],
  data() {
    return {
      fase: 'reposo', // 'reposo' | 'lobby' | 'pregunta' | 'mostrar' | 'finalizada'
      pregunta: '',
      codigoSala: '',
      totalAlumnos: 0,
      totalRespuestas: 0,
      proyectorConectado: false,
      canalControl: null
    }
  },
  computed: {
    puedeIniciarLobby() {
      // Habilitado si hay pregunta escrita y estamos en reposo, inicial o finalizada
      const tienePregunta = this.pregunta.trim().length > 0
      return tienePregunta && (this.fase === 'reposo' || this.fase === 'inicial' || this.fase === 'finalizada')
    },
    puedeLanzarPregunta() {
      // Habilitado solo cuando estamos en Lobby y hay pregunta
      return this.fase === 'lobby' && this.pregunta.trim().length > 0
    },
    puedeMostrarNube() {
      // Habilitado solo cuando estamos en fase de Pregunta
      return this.fase === 'pregunta'
    },
    puedeFinalizar() {
      // Habilitado cuando estamos en Mostrar o en Pregunta
      return this.fase === 'mostrar' || this.fase === 'pregunta'
    }
  },
  mounted() {
    this.conectarCanalControl()
  },
  beforeUnmount() {
    this.desconectarCanal()
  },
  methods: {
    conectarCanalControl() {
      if (!this.docenteId || !supabase) return

      const canalNombre = `leo-ideas-ctrl-${this.docenteId}`
      this.canalControl = supabase.channel(canalNombre)

      this.canalControl
        .on('presence', { event: 'sync' }, () => {
          const state = this.canalControl.presenceState()
          let encontrado = false
          Object.values(state).forEach((presencias) => {
            presencias.forEach((p) => {
              if (p.rol === 'proyector') encontrado = true
            })
          })
          this.proyectorConectado = encontrado
        })
        .on('broadcast', { event: 'sync_estado' }, ({ payload }) => {
          if (!payload) return
          if (payload.fase) this.fase = payload.fase
          if (payload.codigoSala) this.codigoSala = payload.codigoSala
          if (typeof payload.totalAlumnos === 'number') this.totalAlumnos = payload.totalAlumnos
          if (typeof payload.totalRespuestas === 'number') this.totalRespuestas = payload.totalRespuestas
          if (payload.pregunta && !this.pregunta.trim()) {
            this.pregunta = payload.pregunta
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await this.canalControl.track({ rol: 'control' })
          }
        })
    },
    enviarComando(accion) {
      if (!this.canalControl) return
      this.canalControl.send({
        type: 'broadcast',
        event: 'cmd',
        payload: {
          accion,
          pregunta: this.pregunta.trim()
        }
      })
    },
    accionLobby() {
      if (!this.puedeIniciarLobby) return
      this.fase = 'lobby'
      this.enviarComando('LOBBY')
    },
    accionPregunta() {
      if (!this.puedeLanzarPregunta) return
      this.fase = 'pregunta'
      this.enviarComando('PREGUNTA')
    },
    accionMostrar() {
      if (!this.puedeMostrarNube) return
      this.fase = 'mostrar'
      this.enviarComando('MOSTRAR')
    },
    accionFinalizar() {
      if (!this.puedeFinalizar) return
      this.fase = 'finalizada'
      this.enviarComando('FINALIZAR')
    },
    desconectarCanal() {
      if (this.canalControl && supabase) {
        supabase.removeChannel(this.canalControl)
        this.canalControl = null
      }
    }
  }
}
</script>
