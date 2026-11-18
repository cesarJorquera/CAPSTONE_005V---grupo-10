<template>
  <div class="min-h-screen bg-white flex flex-col justify-between text-gray-800 select-none">
    <!-- Barra Superior: morado oscuro (indigo-900) -->
    <header class="bg-indigo-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white shadow-inner">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        </div>
        <span class="text-2xl font-black tracking-wide">Leo Ideas</span>
      </div>

      <div class="flex items-center gap-4">
        <div v-if="codigoSala" class="bg-indigo-800 border border-indigo-700 px-4 py-1.5 rounded-xl flex items-center gap-2">
          <span class="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Código de sala:</span>
          <span class="text-2xl font-black tracking-widest text-yellow-300">{{ codigoSala }}</span>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <span
            class="w-3 h-3 rounded-full"
            :class="controlConectado ? 'bg-green-400 animate-pulse' : 'bg-gray-400'"
          ></span>
          <span class="text-indigo-200 hidden sm:inline">
            {{ controlConectado ? 'Control conectado' : 'Sin control móvil' }}
          </span>
        </div>
      </div>
    </header>

    <!-- Contenido Principal: adaptado para pantalla grande de proyector -->
    <main class="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden">
      <!-- 1. FASE INICIAL (Reposo) -->
      <section v-if="fase === 'inicial'" class="text-center max-w-3xl animate-fade-in">
        <div class="w-32 h-32 mx-auto mb-6 rounded-full bg-purple-700 flex items-center justify-center text-white shadow-2xl">
          <svg class="w-20 h-20" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
        </div>
        <h1 class="text-6xl sm:text-7xl font-black text-gray-900 tracking-tight mb-4">
          Leo Ideas
        </h1>
        <p class="text-2xl sm:text-3xl text-gray-600 font-medium mb-8">
          Lluvia de ideas interactiva para el aula
        </p>
        <div class="inline-block bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4 text-purple-900 text-lg">
          📱 Abre <strong>Leo Dash</strong> en tu celular o presiona <strong>Lobby</strong> abajo para comenzar.
        </div>
      </section>

      <!-- 2. FASE LOBBY (Esperando participantes) -->
      <section v-else-if="fase === 'lobby'" class="w-full max-w-5xl text-center">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-8">
          <!-- Columna QR -->
          <div class="flex flex-col items-center">
            <div class="bg-white p-3 rounded-3xl border-4 border-indigo-900 shadow-xl inline-block">
              <img
                v-if="qrDataUrl"
                :src="qrDataUrl"
                alt="Código QR para unirse a Leo Ideas"
                class="w-48 h-48 sm:w-56 sm:h-56"
              />
              <div v-else class="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-gray-400">
                Generando QR…
              </div>
            </div>
            <p class="mt-3 text-sm font-bold text-gray-600">Escanea para entrar</p>
          </div>

          <!-- Columna Centro: Logo y Espera -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 mb-3 rounded-full bg-purple-700 flex items-center justify-center text-white shadow-lg">
              <svg class="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
            </div>
            <h2 class="text-4xl font-extrabold text-gray-800 mb-2">Esperando participantes</h2>
            <div class="text-2xl font-black text-purple-700 bg-purple-100 px-6 py-2 rounded-full">
              {{ totalAlumnos }} {{ totalAlumnos === 1 ? 'participante' : 'participantes' }}
            </div>
          </div>

          <!-- Columna Derecha: Código grande -->
          <div class="flex flex-col items-center">
            <div class="bg-purple-50 border-2 border-purple-300 rounded-3xl p-6 w-full max-w-xs shadow-md">
              <p class="text-sm font-bold text-purple-800 uppercase tracking-wider mb-1">O entra con código:</p>
              <p class="text-5xl font-black tracking-widest text-indigo-950 font-mono">{{ codigoSala }}</p>
            </div>
          </div>
        </div>

        <!-- Píldoras de alumnos conectados -->
        <div class="mt-6">
          <p class="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
            Alumnos en la sala:
          </p>
          <div v-if="alumnosTotales.length === 0" class="text-gray-400 italic text-xl">
            Aún no se ha unido ningún estudiante.
          </div>
          <div v-else class="flex flex-wrap justify-center gap-3 max-h-60 overflow-y-auto p-2">
            <span
              v-for="(alumno, idx) in alumnosTotales"
              :key="idx"
              class="rounded-full bg-purple-50 text-purple-900 border border-purple-200 px-5 py-2 text-xl font-bold shadow-sm"
            >
              {{ alumno }}
            </span>
          </div>
        </div>
      </section>

      <!-- 3. FASE PREGUNTA (Respondiendo) -->
      <section v-else-if="fase === 'pregunta'" class="w-full max-w-4xl text-center">
        <div class="mb-12">
          <span class="text-base font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-4 py-1.5 rounded-full inline-block mb-4">
            Pregunta en curso
          </span>
          <h2 class="text-5xl sm:text-6xl font-black text-gray-900 leading-tight">
            {{ preguntaActual }}
          </h2>
        </div>

        <!-- Marcador y barra de progreso -->
        <div class="max-w-xl mx-auto bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div class="text-2xl sm:text-3xl font-extrabold text-gray-700 mb-3">
            {{ totalRespuestas }} de {{ totalAlumnos }} respondieron
          </div>
          <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              class="bg-purple-600 h-6 rounded-full transition-all duration-500 ease-out"
              :style="{ width: porcentajeRespuestas + '%' }"
            ></div>
          </div>
        </div>
      </section>

      <!-- 4. FASE MOSTRAR (Nube de palabras) -->
      <section v-else-if="fase === 'mostrar'" class="w-full max-w-6xl flex flex-col items-center">
        <!-- Pregunta animada en la parte superior -->
        <div class="text-center mb-8 transform transition-all duration-700 ease-in-out">
          <span class="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-2 inline-block">
            Resultados de la sala
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {{ preguntaActual }}
          </h2>
        </div>

        <!-- Nube de palabras -->
        <div class="w-full bg-purple-50 rounded-3xl p-8 sm:p-12 border-2 border-purple-100 shadow-inner min-h-64 flex flex-wrap items-center justify-center gap-6">
          <div v-if="nubePalabras.length === 0" class="text-gray-400 italic text-2xl">
            No se recibieron respuestas en esta ronda.
          </div>
          <span
            v-for="(item, idx) in nubePalabras"
            :key="idx"
            class="font-black leading-tight transition-transform duration-300 hover:scale-110 cursor-default"
            :class="item.colorClase"
            :style="{ fontSize: item.fontSizeRem + 'rem' }"
          >
            {{ item.textoOriginal }}
          </span>
        </div>

        <div class="mt-4 text-gray-500 text-sm font-semibold">
          Total de respuestas recibidas: {{ totalRespuestas }}
        </div>
      </section>

      <!-- 5. FASE FINALIZADA -->
      <section v-else-if="fase === 'finalizada'" class="text-center max-w-2xl">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-4xl shadow-md">
          ✓
        </div>
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
          ¡Actividad finalizada!
        </h2>
        <p class="text-xl text-gray-600 mb-6">
          Las respuestas se mostraron con éxito. Puedes iniciar otra ronda cuando quieras.
        </p>
        <button
          type="button"
          class="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-md transition-colors"
          @click="reiniciarParaNuevaPregunta"
        >
          Preparar otra pregunta
        </button>
      </section>
    </main>

    <!-- Franja Inferior: Controles de Respaldo y Modo Demo -->
    <footer class="bg-gray-100 border-t border-gray-300 py-2.5 px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-bold text-gray-500 uppercase tracking-wider text-xs mr-1">
          Respaldo proyector:
        </span>
        <button
          type="button"
          class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="fase === 'lobby'"
          @click="irALobbyRespaldado"
        >
          1. Lobby
        </button>
        <button
          type="button"
          class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="fase !== 'lobby'"
          @click="lanzarPregunta"
        >
          2. Pregunta
        </button>
        <button
          type="button"
          class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="fase !== 'pregunta'"
          @click="mostrarNube"
        >
          3. Mostrar
        </button>
        <button
          type="button"
          class="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-1.5 px-3 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="fase !== 'mostrar' && fase !== 'pregunta'"
          @click="finalizarActividad"
        >
          4. Finalizar
        </button>
      </div>

      <!-- Botones de Simulación (?demo=1) -->
      <div v-if="esDemo" class="flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-xl px-3 py-1">
        <span class="font-bold text-yellow-800 text-xs">🧪 DEMO:</span>
        <button
          type="button"
          class="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold py-1 px-2.5 rounded-lg text-xs"
          @click="simularAlumnos"
        >
          Simular alumnos ({{ alumnosSimulados.length }}/12)
        </button>
        <button
          type="button"
          class="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold py-1 px-2.5 rounded-lg text-xs"
          @click="simularRespuestas"
        >
          Simular respuestas ({{ respuestasSimuladas.length }})
        </button>
      </div>

      <div>
        <button
          type="button"
          class="text-red-600 hover:text-red-800 font-semibold py-1 px-3 rounded-lg hover:bg-red-50 transition-colors"
          @click="salirProyector"
        >
          ✕ Salir del aula
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { supabase } from '../../utils/supabaseClient'
import { registrarSalida, liberarSalida } from '../../utils/confirmarSalida'

export default {
  name: 'LeoIdeasProyector',
  props: {
    docenteId: {
      type: String,
      required: true
    }
  },
  emits: ['salir'],
  data() {
    return {
      fase: 'inicial', // 'inicial' | 'lobby' | 'pregunta' | 'mostrar' | 'finalizada'
      codigoSala: '',
      preguntaActual: '¿Qué palabra resume la idea principal de la lectura?',
      qrDataUrl: '',
      controlConectado: false,
      alumnosReales: [],
      alumnosSimulados: [],
      respuestasReales: [],
      respuestasSimuladas: [],
      respuestasPorToken: {},
      // Canales de Realtime
      canalControl: null,
      canalSala: null,
      // Temporizadores de demo
      timerDemoAlumnos: null,
      timerDemoRespuestas: null,
      esDemo: false
    }
  },
  computed: {
    alumnosTotales() {
      return [...this.alumnosReales, ...this.alumnosSimulados]
    },
    respuestasTotales() {
      return [...this.respuestasReales, ...this.respuestasSimuladas]
    },
    totalAlumnos() {
      return this.alumnosTotales.length
    },
    totalRespuestas() {
      return this.respuestasTotales.length
    },
    porcentajeRespuestas() {
      if (this.totalAlumnos === 0) return 0
      const pct = Math.round((this.totalRespuestas / this.totalAlumnos) * 100)
      return Math.min(pct, 100)
    },
    nubePalabras() {
      if (this.respuestasTotales.length === 0) return []

      const conteo = {}
      this.respuestasTotales.forEach((item) => {
        const texto = String(item.texto || '').trim().slice(0, 20)
        if (!texto) return
        const normalizado = texto
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        if (!conteo[normalizado]) {
          conteo[normalizado] = {
            textoOriginal: texto,
            count: 0
          }
        }
        conteo[normalizado].count += 1
      })

      const palabras = Object.values(conteo)
      if (palabras.length === 0) return []

      const counts = palabras.map((p) => p.count)
      const min = Math.min(...counts)
      const max = Math.max(...counts)

      const colores = [
        'text-blue-700',
        'text-purple-700',
        'text-green-700',
        'text-yellow-700',
        'text-pink-700'
      ]

      return palabras.map((p, idx) => {
        let sizeRem = 2.2
        if (max > min) {
          const ratio = (p.count - min) / (max - min)
          sizeRem = 1.8 + ratio * 3.2 // escala fluida entre 1.8rem y 5.0rem
        } else if (p.count > 1) {
          sizeRem = 3.0
        }

        return {
          textoOriginal: p.textoOriginal,
          count: p.count,
          fontSizeRem: sizeRem.toFixed(2),
          colorClase: colores[idx % colores.length]
        }
      })
    }
  },
  mounted() {
    // MEJ-03: avisar antes de salir si hay una actividad en marcha (sala abierta o pregunta en curso)
    this.avisoSalida = () => (['lobby', 'pregunta', 'mostrar'].includes(this.fase) ? { tipo: 'actividad' } : null)
    registrarSalida(this.avisoSalida)
    this.detectarModoDemo()
    this.conectarCanalControl()
  },
  beforeUnmount() {
    liberarSalida(this.avisoSalida)
    this.limpiarTimersDemo()
    this.desconectarTodo()
  },
  methods: {
    detectarModoDemo() {
      const params = new URLSearchParams(window.location.search)
      this.esDemo = params.get('demo') === '1'
    },
    // ============================================
    // CANAL DE CONTROL: leo-ideas-ctrl-<docenteId>
    // ============================================
    conectarCanalControl() {
      if (!this.docenteId || !supabase) return

      const canalNombre = `leo-ideas-ctrl-${this.docenteId}`
      this.canalControl = supabase.channel(canalNombre)

      this.canalControl
        .on('presence', { event: 'sync' }, () => {
          const state = this.canalControl.presenceState()
          let controlPresente = false
          Object.values(state).forEach((presencias) => {
            presencias.forEach((p) => {
              if (p.rol === 'control') controlPresente = true
            })
          })
          this.controlConectado = controlPresente
        })
        .on('broadcast', { event: 'cmd' }, ({ payload }) => {
          this.procesarComandoControl(payload)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await this.canalControl.track({ rol: 'proyector' })
            this.notificarEstadoControl()
          }
        })
    },
    procesarComandoControl(payload) {
      if (!payload || !payload.accion) return

      if (payload.pregunta && typeof payload.pregunta === 'string') {
        const limpia = payload.pregunta.trim().slice(0, 120)
        if (limpia) this.preguntaActual = limpia
      }

      switch (payload.accion) {
        case 'LOBBY':
          this.iniciarLobby()
          break
        case 'PREGUNTA':
          this.lanzarPregunta()
          break
        case 'MOSTRAR':
          this.mostrarNube()
          break
        case 'FINALIZAR':
          this.finalizarActividad()
          break
      }
    },
    notificarEstadoControl() {
      if (!this.canalControl) return
      this.canalControl.send({
        type: 'broadcast',
        event: 'sync_estado',
        payload: {
          fase: this.fase,
          codigoSala: this.codigoSala,
          pregunta: this.preguntaActual,
          totalAlumnos: this.totalAlumnos,
          totalRespuestas: this.totalRespuestas
        }
      })
    },
    // ============================================
    // CANAL DE SALA: leo-ideas-sala-<codigoSala>
    // ============================================
    async conectarCanalSala() {
      if (!this.codigoSala || !supabase) return

      if (this.canalSala) {
        await supabase.removeChannel(this.canalSala)
        this.canalSala = null
      }

      const canalNombre = `leo-ideas-sala-${this.codigoSala}`
      this.canalSala = supabase.channel(canalNombre)

      this.canalSala
        .on('presence', { event: 'sync' }, () => {
          this.actualizarAlumnosPresence()
        })
        .on('presence', { event: 'join' }, () => {
          // Alumno nuevo entra: le reenviamos la fase actual
          this.retransmitirFaseSala()
        })
        .on('broadcast', { event: 'respuesta' }, ({ payload }) => {
          this.recibirRespuestaAlumno(payload)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await this.canalSala.track({ rol: 'proyector' })
            this.retransmitirFaseSala()
          }
        })
    },
    actualizarAlumnosPresence() {
      if (!this.canalSala) return
      const state = this.canalSala.presenceState()
      const nuevos = []

      Object.values(state).forEach((presencias) => {
        presencias.forEach((p) => {
          if (p.rol !== 'proyector' && p.alias) {
            const aliasLimpio = String(p.alias).trim().slice(0, 14)
            if (aliasLimpio && !nuevos.includes(aliasLimpio)) {
              nuevos.push(aliasLimpio)
            }
          }
        })
      })

      this.alumnosReales = nuevos
      this.notificarEstadoControl()
    },
    retransmitirFaseSala() {
      if (!this.canalSala) return
      this.canalSala.send({
        type: 'broadcast',
        event: 'fase',
        payload: {
          fase: this.fase,
          pregunta: this.preguntaActual
        }
      })
    },
    recibirRespuestaAlumno(payload) {
      if (!payload || !payload.texto || !payload.token) return
      if (this.fase !== 'pregunta' && this.fase !== 'mostrar') return

      const token = String(payload.token).trim()
      const texto = String(payload.texto).trim().slice(0, 20)

      if (!token || !texto) return
      if (this.respuestasPorToken[token]) return

      this.respuestasPorToken[token] = true
      this.respuestasReales.push({ texto, token })
      this.notificarEstadoControl()
    },
    // ============================================
    // GESTIÓN DE FASES
    // ============================================
    async iniciarLobby() {
      if (!this.codigoSala) {
        this.codigoSala = String(Math.floor(100000 + Math.random() * 900000))
      }

      // MEJ-03: el alumno entra por /sala (antes era la ruta actual + ?sala=)
      const urlDestino = `${window.location.origin}${this.$router.resolve({ name: 'sala', query: { sala: this.codigoSala } }).href}`
      try {
        this.qrDataUrl = await QRCode.toDataURL(urlDestino, {
          width: 260,
          margin: 1,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff'
          }
        })
      } catch (err) {
        console.error('Error generando QR:', err)
      }

      this.fase = 'lobby'
      await this.conectarCanalSala()
      this.notificarEstadoControl()
    },
    irALobbyRespaldado() {
      this.iniciarLobby()
    },
    lanzarPregunta() {
      this.fase = 'pregunta'
      this.retransmitirFaseSala()
      this.notificarEstadoControl()
    },
    mostrarNube() {
      this.fase = 'mostrar'
      this.retransmitirFaseSala()
      this.notificarEstadoControl()
    },
    finalizarActividad() {
      this.fase = 'finalizada'
      this.retransmitirFaseSala()
      this.notificarEstadoControl()
    },
    reiniciarParaNuevaPregunta() {
      this.fase = 'inicial'
      this.codigoSala = ''
      this.qrDataUrl = ''
      this.alumnosReales = []
      this.alumnosSimulados = []
      this.respuestasReales = []
      this.respuestasSimuladas = []
      this.respuestasPorToken = {}
      if (this.canalSala && supabase) {
        supabase.removeChannel(this.canalSala)
        this.canalSala = null
      }
      this.notificarEstadoControl()
    },
    // ============================================
    // MODO SIMULACIÓN (?demo=1)
    // ============================================
    simularAlumnos() {
      if (this.timerDemoAlumnos) {
        clearInterval(this.timerDemoAlumnos)
        this.timerDemoAlumnos = null
      }
      const listaFicticia = [
        'Cata', 'Lucas', 'Mati', 'Valen',
        'Sofi', 'Diego', 'Nico', 'Anto',
        'Benja', 'Javi', 'Isi', 'Tomi'
      ]
      let indice = 0
      this.alumnosSimulados = []

      this.timerDemoAlumnos = setInterval(() => {
        if (indice < listaFicticia.length) {
          this.alumnosSimulados.push(listaFicticia[indice])
          indice += 1
          this.notificarEstadoControl()
        } else {
          clearInterval(this.timerDemoAlumnos)
          this.timerDemoAlumnos = null
        }
      }, 500)
    },
    simularRespuestas() {
      if (this.timerDemoRespuestas) {
        clearInterval(this.timerDemoRespuestas)
        this.timerDemoRespuestas = null
      }
      const listaRespuestas = [
        'Amistad', 'amistad', 'AMISTAD',
        'Empatía', 'empatia', 'EMPATIA',
        'Respeto', 'respeto', 'Solidaridad',
        'solidaridad', 'Compasión', 'compasion',
        'Cariño', 'cariño', 'Apoyo'
      ]
      let indice = 0
      this.respuestasSimuladas = []

      this.timerDemoRespuestas = setInterval(() => {
        if (indice < listaRespuestas.length) {
          const texto = listaRespuestas[indice]
          this.respuestasSimuladas.push({
            texto,
            token: `demo_${indice}`
          })
          indice += 1
          this.notificarEstadoControl()
        } else {
          clearInterval(this.timerDemoRespuestas)
          this.timerDemoRespuestas = null
        }
      }, 500)
    },
    limpiarTimersDemo() {
      if (this.timerDemoAlumnos) clearInterval(this.timerDemoAlumnos)
      if (this.timerDemoRespuestas) clearInterval(this.timerDemoRespuestas)
      this.timerDemoAlumnos = null
      this.timerDemoRespuestas = null
    },
    // ============================================
    // SALIDA Y CIERRE
    // ============================================
    desconectarTodo() {
      if (this.canalSala && supabase) {
        this.canalSala.send({
          type: 'broadcast',
          event: 'fase',
          payload: { fase: 'finalizada' }
        })
        supabase.removeChannel(this.canalSala)
        this.canalSala = null
      }
      if (this.canalControl && supabase) {
        supabase.removeChannel(this.canalControl)
        this.canalControl = null
      }
    },
    salirProyector() {
      // MEJ-03: ya no se desconecta aquí. Antes se avisaba a la sala que la actividad terminó
      // (desconectarTodo) y recién después se salía; ahora App/router piden confirmación primero
      // y, si se confirma, beforeUnmount llama a desconectarTodo() con el mismo resultado.
      // this.desconectarTodo()
      this.$emit('salir')
    }
  }
}
</script>
