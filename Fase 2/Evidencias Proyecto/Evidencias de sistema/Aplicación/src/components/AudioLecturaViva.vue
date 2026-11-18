<template>
  <div class="relative z-10 bg-white rounded-3xl shadow-xl p-6 md:p-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 class="text-xl font-bold text-gray-800">Lectura Viva</h3>
        <p class="text-sm text-gray-500">Escucha el texto narrado</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Zona sensible: botón + reproductor (hover, foco y toque) -->
        <div
          ref="zona"
          class="relative"
          @mouseenter="alEntrarMouse"
          @mouseleave="alSalirMouse"
          @focusin="alEnfocar"
          @focusout="programarCierre"
          @keydown.esc="cerrarConEscape"
        >
          <button
            ref="boton"
            type="button"
            :disabled="!disponible"
            :aria-label="reproduciendo ? 'Pausar' : 'Escuchar el texto'"
            :aria-pressed="reproduciendo ? 'true' : 'false'"
            :aria-expanded="abierto ? 'true' : 'false'"
            class="lv-boton lv-foco flex items-center gap-2 px-5 rounded-xl font-semibold text-white bg-gradient-to-r transition-all"
            :class="[
              reproduciendo ? 'lv-sonando from-green-500 to-green-600' : 'from-blue-500 to-purple-600',
              disponible ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
            ]"
            @click="alPulsarBoton"
          >
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2.5 6.2c2.3-1 4.6-.9 6.7.4v11.2c-2.1-1.3-4.4-1.4-6.7-.4z"/>
              <path d="M9.2 6.6c2.1-1.3 4.4-1.4 6.7-.4v11.2c-2.3-1-4.6-.9-6.7.4z"/>
              <path class="onda-1" d="M18.3 9.6a3.6 3.6 0 010 4.8"/>
              <path class="onda-2" d="M20.6 7.4a6.6 6.6 0 010 9.2"/>
            </svg>
            <span>Audio</span>
          </button>

          <!-- Reproductor: el relleno superior hace de puente para el mouse -->
          <div
            v-show="disponible && abierto"
            class="lv-panel absolute right-0 top-full z-20 pt-2"
          >
            <div
              class="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-4 space-y-3"
              role="group"
              aria-label="Reproductor de Lectura Viva"
            >
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  :aria-label="reproduciendo ? 'Pausar' : 'Reproducir'"
                  class="lv-tactil lv-foco flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all"
                  @click="alternar"
                >
                  <svg v-if="!reproduciendo" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <svg v-else class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7 5h4v14H7zM13 5h4v14h-4z"/>
                  </svg>
                </button>
                <p class="text-sm font-semibold text-gray-700" aria-hidden="true">
                  {{ formatear(tiempo) }} / {{ formatear(duracion) }}
                </p>
              </div>

              <input
                type="range"
                class="lv-rango"
                min="0"
                step="1"
                :max="duracionMaxima"
                :value="tiempo"
                :disabled="!duracion"
                :style="{ '--pct': porcentajeAvance + '%' }"
                aria-label="Barra de avance"
                :aria-valuetext="formatear(tiempo) + ' de ' + formatear(duracion)"
                @input="buscar"
              />

              <!-- Volumen solo con puntero fino: en táctiles se usan los botones del teléfono -->
              <div v-if="punteroFino" class="flex items-center gap-3">
                <span class="text-sm font-semibold text-gray-600">Volumen</span>
                <input
                  type="range"
                  class="lv-rango"
                  min="0"
                  max="1"
                  step="0.05"
                  :value="volumen"
                  :style="{ '--pct': volumen * 100 + '%' }"
                  aria-label="Volumen"
                  :aria-valuetext="Math.round(volumen * 100) + '%'"
                  @input="cambiarVolumen"
                />
              </div>

              <div role="group" aria-label="Velocidad" class="flex gap-2">
                <button
                  v-for="valor in velocidades"
                  :key="valor"
                  type="button"
                  :aria-label="'Velocidad ' + valor + 'x'"
                  :aria-pressed="valor === velocidad ? 'true' : 'false'"
                  class="lv-tactil lv-foco flex-1 rounded-xl border-2 text-sm font-semibold transition-all"
                  :class="valor === velocidad
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'"
                  @click="cambiarVelocidad(valor)"
                >
                  {{ valor }}x
                </button>
              </div>
            </div>
          </div>
        </div>

        <p
          v-if="!disponible"
          class="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-3 py-2 text-sm text-yellow-800"
          role="status"
        >
          Audio no disponible aún
        </p>
      </div>
    </div>

    <audio
      v-if="src"
      ref="audio"
      :src="src"
      preload="metadata"
      @loadedmetadata="alCargarMetadatos"
      @durationchange="actualizarDuracion"
      @timeupdate="actualizarTiempo"
      @play="reproduciendo = true"
      @pause="reproduciendo = false"
      @ended="reproduciendo = false"
      @error="alError"
    ></audio>
  </div>
</template>

<script>
// ============================================
// CONSTANTES
// ============================================
// Los audios son WAV pregenerados que se colocan a mano en public/audio/lectura-viva/
const CARPETA_AUDIO = 'audio/lectura-viva/'
const EXTENSION_AUDIO = '.wav'
const VELOCIDADES = [0.75, 1, 1.25]

// Tiempo que el reproductor espera antes de minimizarse, para poder llegar a él con el mouse
const RETARDO_CIERRE_MS = 400

// Dispositivos con mouse (hover real y puntero preciso); en táctiles no hay hover ni volumen
const CONSULTA_PUNTERO_FINO = '(hover: hover) and (pointer: fine)'

// ============================================
// COMPONENTE: Lectura Viva - audio narrado del texto del Juego 1
// ============================================
// El archivo se deriva del id del texto: "text7" -> "audio7.wav".
// Un archivo faltante NO da 404 (netlify.toml y el servidor de desarrollo
// devuelven index.html con 200), por eso se detecta con el evento "error" del <audio>.
export default {
  name: 'AudioLecturaViva',

  props: {
    textId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      reproduciendo: false,
      error: false,
      abierto: false,
      punteroFino: false,
      tiempo: 0,
      duracion: 0,
      volumen: 1,
      velocidad: VELOCIDADES[1],
      velocidades: VELOCIDADES
    }
  },

  computed: {
    // "text7" -> "7"; si el id no sigue el patrón textN, no hay audio
    numeroTexto() {
      const coincidencia = /^text(\d+)$/.exec(this.textId)
      return coincidencia ? coincidencia[1] : null
    },

    src() {
      if (!this.numeroTexto) return null
      return process.env.BASE_URL + CARPETA_AUDIO + 'audio' + this.numeroTexto + EXTENSION_AUDIO
    },

    disponible() {
      return Boolean(this.src) && !this.error
    },

    // El máximo de la barra es entero (paso 1 s) para que llegar al final sea posible
    duracionMaxima() {
      return Math.ceil(this.duracion) || 0
    },

    porcentajeAvance() {
      if (!this.duracionMaxima) return 0
      return Math.min(100, (this.tiempo / this.duracionMaxima) * 100)
    }
  },

  created() {
    // Estado interno sin reactividad
    this.temporizadorCierre = null
    this.mouseDentro = false
    this.omitirFoco = false
    this.consultaPuntero = null
  },

  mounted() {
    if (window.matchMedia) {
      this.consultaPuntero = window.matchMedia(CONSULTA_PUNTERO_FINO)
      this.punteroFino = this.consultaPuntero.matches
      if (this.consultaPuntero.addEventListener) {
        this.consultaPuntero.addEventListener('change', this.alCambiarPuntero)
      }
    }
    document.addEventListener('pointerdown', this.alPulsarFuera)
  },

  beforeUnmount() {
    this.detener()
    clearTimeout(this.temporizadorCierre)
    document.removeEventListener('pointerdown', this.alPulsarFuera)
    if (this.consultaPuntero && this.consultaPuntero.removeEventListener) {
      this.consultaPuntero.removeEventListener('change', this.alCambiarPuntero)
    }
  },

  methods: {
    // ---------- Reproducción ----------

    // Reproduce o pausa; nunca hay autoplay
    alternar() {
      const audio = this.$refs.audio
      if (!this.disponible || !audio) return

      if (audio.paused) {
        audio.playbackRate = this.velocidad
        audio.play().catch(() => {
          this.reproduciendo = false
        })
      } else {
        audio.pause()
      }
    },

    // Pausa conservando la posición: al reproducir de nuevo continúa desde ahí
    pausar() {
      const audio = this.$refs.audio
      if (audio) audio.pause()
    },

    // Pausa y vuelve al segundo 0: al reproducir de nuevo empieza desde el inicio
    reiniciar() {
      const audio = this.$refs.audio
      if (!audio) return
      audio.pause()
      audio.currentTime = 0
      this.tiempo = 0
    },

    // Detiene y libera el archivo (al desmontar el componente)
    detener() {
      const audio = this.$refs.audio
      if (!audio) return
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      this.reproduciendo = false
    },

    alPulsarBoton() {
      if (!this.disponible) return
      this.abrir()
      this.alternar()
    },

    buscar(evento) {
      const audio = this.$refs.audio
      if (!audio) return
      audio.currentTime = Number(evento.target.value)
      this.tiempo = audio.currentTime
    },

    cambiarVolumen(evento) {
      const audio = this.$refs.audio
      this.volumen = Number(evento.target.value)
      if (audio) audio.volume = this.volumen
    },

    cambiarVelocidad(valor) {
      const audio = this.$refs.audio
      this.velocidad = valor
      if (audio) audio.playbackRate = valor
    },

    // ---------- Eventos del <audio> ----------

    alCargarMetadatos() {
      const audio = this.$refs.audio
      if (audio) audio.playbackRate = this.velocidad
      this.actualizarDuracion()
    },

    actualizarDuracion() {
      const audio = this.$refs.audio
      this.duracion = audio && isFinite(audio.duration) ? audio.duration : 0
    },

    actualizarTiempo() {
      const audio = this.$refs.audio
      if (audio) this.tiempo = audio.currentTime
    },

    alError() {
      this.error = true
      this.reproduciendo = false
      this.abierto = false
    },

    // ---------- Apertura y minimizado del reproductor ----------

    abrir() {
      if (!this.disponible) return
      clearTimeout(this.temporizadorCierre)
      this.abierto = true
    },

    alEntrarMouse() {
      if (!this.punteroFino) return
      this.mouseDentro = true
      this.abrir()
    },

    alSalirMouse() {
      if (!this.punteroFino) return
      this.mouseDentro = false
      this.programarCierre()
    },

    alEnfocar() {
      if (this.omitirFoco) {
        this.omitirFoco = false
        return
      }
      this.abrir()
    },

    // Minimiza tras un retardo, salvo que el mouse siga encima o el foco de teclado siga dentro
    programarCierre() {
      clearTimeout(this.temporizadorCierre)
      this.temporizadorCierre = setTimeout(() => {
        if (!this.mouseDentro && !this.focoDeTecladoDentro()) this.abierto = false
      }, RETARDO_CIERRE_MS)
    },

    focoDeTecladoDentro() {
      const zona = this.$refs.zona
      const activo = document.activeElement
      if (!zona || !activo || !zona.contains(activo)) return false
      try {
        return activo.matches(':focus-visible')
      } catch (error) {
        return false
      }
    },

    // Tocar o hacer clic fuera del reproductor lo minimiza (el audio sigue sonando)
    alPulsarFuera(evento) {
      const zona = this.$refs.zona
      if (this.abierto && zona && !zona.contains(evento.target)) {
        clearTimeout(this.temporizadorCierre)
        this.abierto = false
      }
    },

    cerrarConEscape() {
      if (!this.abierto) return
      clearTimeout(this.temporizadorCierre)
      this.abierto = false
      const boton = this.$refs.boton
      if (boton && document.activeElement !== boton) {
        this.omitirFoco = true
        boton.focus()
      }
    },

    alCambiarPuntero(evento) {
      this.punteroFino = evento.matches
      if (!evento.matches) this.mouseDentro = false
    },

    // ---------- Utilidades ----------

    // Segundos -> m:ss
    formatear(segundos) {
      const total = isFinite(segundos) && segundos > 0 ? Math.floor(segundos) : 0
      const minutos = Math.floor(total / 60)
      const resto = String(total % 60).padStart(2, '0')
      return minutos + ':' + resto
    }
  }
}
</script>

<style scoped>
/* Áreas táctiles de al menos 44 px */
.lv-boton,
.lv-tactil {
  min-height: 44px;
  min-width: 44px;
}

/* Foco visible para uso con teclado */
.lv-foco:focus-visible {
  outline: 3px solid #1d4ed8;
  outline-offset: 2px;
}

/* Ancho del reproductor: no se sale de pantallas angostas */
.lv-panel {
  width: min(20rem, calc(100vw - 4rem));
}

/* Ondas animadas mientras suena */
@keyframes lv-onda {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}

.lv-sonando .onda-1 {
  animation: lv-onda 1s ease-in-out infinite;
}

.lv-sonando .onda-2 {
  animation: lv-onda 1s ease-in-out 0.3s infinite;
}

/* Sin animación: el cambio de color del botón (verde) indica que está sonando */
@media (prefers-reduced-motion: reduce) {
  .lv-sonando .onda-1,
  .lv-sonando .onda-2 {
    animation: none;
  }
}

/* Tailwind 2.2 no estiliza la perilla de los input range */
.lv-rango {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 44px;
  background: transparent;
  cursor: pointer;
}

.lv-rango::-webkit-slider-runnable-track {
  height: 8px;
  border-radius: 9999px;
  background: linear-gradient(to right, #3b82f6 var(--pct, 0%), #e5e7eb var(--pct, 0%));
}

.lv-rango::-moz-range-track {
  height: 8px;
  border-radius: 9999px;
  background: #e5e7eb;
}

.lv-rango::-moz-range-progress {
  height: 8px;
  border-radius: 9999px;
  background: #3b82f6;
}

.lv-rango::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  margin-top: -7px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.lv-rango::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffffff;
  border: 3px solid #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.lv-rango:focus-visible {
  outline: none;
}

.lv-rango:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.5);
}

.lv-rango:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.5);
}

.lv-rango:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
