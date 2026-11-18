<template>
  <!-- UI-09: mascota de los juegos con el Leo nuevo y burbujas con el estilo de la app.
       Misma lógica, mensajes, eventos y métodos que mascota.vue (que se conserva intacta para poder volver a ella).
       Celular: Leo abajo a la derecha y la burbuja encima. Escritorio: Leo a la izquierda y la burbuja a su lado. -->
  <div class="mj">
    <div
      v-if="activeMessageType === 'ayuda' && helpMessage"
      class="mj-burbuja"
      role="status"
      data-test="mascota-ayuda"
    >
      <div class="mj-burbuja__cuerpo">
        <span class="mj-burbuja__titulo">Consejo {{ helpClickCount + 1 }} de {{ helpMessages.length }}</span>
        <p class="mj-burbuja__texto">{{ helpMessage }}</p>
        <div class="mj-burbuja__pie">
          <span class="mj-puntos" aria-hidden="true">
            <span
              v-for="(msg, i) in helpMessages"
              :key="i"
              class="mj-punto"
              :class="{ 'mj-punto--activo': i === helpClickCount }"
            ></span>
          </span>
          <span class="mj-burbuja__nota">Toca a Leo para el siguiente consejo.</span>
        </div>
      </div>
      <button type="button" class="mj-cerrar" aria-label="Cerrar consejo de Leo" data-test="mascota-cerrar" @click="closeHelp">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </div>

    <div
      v-else-if="activeMessageType === 'feedback' && feedbackMessage"
      class="mj-burbuja"
      role="status"
      data-test="mascota-respuesta"
    >
      <div class="mj-burbuja__cuerpo">
        <span class="mj-etiqueta" :class="esCorrecto ? 'mj-etiqueta--bien' : 'mj-etiqueta--casi'">{{ esCorrecto ? 'Correcto' : 'Casi' }}</span>
        <!-- El mensaje lo arma cada juego (puede traer formato), igual que en la mascota anterior -->
        <p class="mj-burbuja__texto mj-burbuja__texto--fuerte" v-html="feedbackMessage"></p>
        <p v-if="explanationMessage" class="mj-explicacion">{{ explanationMessage }}</p>
      </div>
      <button type="button" class="mj-cerrar" aria-label="Cerrar mensaje de Leo" data-test="mascota-cerrar" @click="closeFeedback">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </div>

    <div
      v-else-if="activeMessageType === 'none' && (currentScreen === 'questions' || currentScreen === 'dragdrop') && showInitialHelp"
      class="mj-burbuja mj-burbuja--corta"
      data-test="mascota-inicial"
    >
      <p class="mj-burbuja__cuerpo mj-burbuja__texto mj-burbuja__texto--azul">¡Si necesitas ayuda puedes hacerme click!</p>
      <button type="button" class="mj-cerrar" aria-label="Cerrar aviso de Leo" @click="closeInitialHelp">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </div>

    <button
      type="button"
      class="mj-leo"
      :aria-label="(currentScreen === 'questions' || currentScreen === 'dragdrop') ? 'Leo. Toca para ver un consejo' : 'Leo'"
      data-test="mascota-leo"
      @click="handleMascotClick"
    >
      <LeoPersonaje ref="personaje" :estado="estadoLeo" :tamano="tamanoLeo" decorativo />
    </button>
  </div>
</template>

<script>
import { emitter } from '../utils/eventBus'
import LeoPersonaje from './base/LeoPersonaje.vue'

// UI-09: estado del Leo nuevo según la animación que pide el juego
const ESTADO_SEGUN_ANIMACION = {
  happy: 'acierto',
  sad: 'animo',
  celebrate: 'celebra',
  fireworks: 'celebra'
}

export default {
  name: 'MascotaJuego',
  components: { LeoPersonaje },
  props: {
    currentScreen: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    helpClickCount: 0,
    // Mensajes de ayuda para game 1 (questions)
    helpMessagesGame1: [
      'Recuerda que en este juego debes reconocer que tipo de palabras claves son las preguntadas, esto te ayudara a identificar las ideas principales de los párrafos, buena suerte',
      'Debes seleccionar que tipo de palabra es la que está en negrita en la oración, estas pueden ser sustantivos (cosas o personas), adjetivos (describen a los sustantivos), verbos (acciones) o conectores (palabras que unen 2 ideas)',
      'Los sustantivos son palabras como "Ron" o "Hogwarts", los verbos son acciones como "caminaba" o "sabían", los conectores son palabras como "pero" o "por lo tanto" y los adjetivos son palabras como "difícil" o "rápido"'
    ],
    // Mensajes de ayuda para game 2 (dragdrop)
    helpMessagesGame2: [
      'Tu objetivo es completar el texto arrastrando las 12 palabras correctas a sus espacios. Lee cada oración con atención antes de colocar una palabra. Tienes 4 vidas, ¡úsalas sabiamente!',
      'Por ejemplo: el primer espacio dice "_____ de que..". ¿Qué se puede inferir aca?, sabemos que debe ir un conector, segun el contexto podemos inferir que conector deberiamos usar! ¡Inténtalo!',
      'Fijate tambien en detalles, como las mayusculas cuando las palabras inician una oracion, o cuando van seguido de un punto, debes guiarte por el contexto y las palabras que rodean al espacio en blanco!'
    ],
    helpMessage: null,
    feedbackMessage: null,
    lastAnswerCorrect: false,
    explanationMessage: null,
    mascotIcon: require('@/assets/icons/libro-sin-fondo-feliz.png'),
    mascotClass: 'mascot-happy',
    fireworksActive: false,
    activeMessageType: 'none',
    showInitialHelp: true,
    // UI-09
    estadoLeo: 'neutro',
    esAncho: false,
    consultaAncho: null,
    alCambiarAncho: null
    }
  },
  computed: {
    // UI-09: el juego 2 pasa 'correct' / 'incorrect' en vez de true / false
    esCorrecto() {
      return this.lastAnswerCorrect !== false && this.lastAnswerCorrect !== 'incorrect'
    },
    tamanoLeo() {
      return this.esAncho ? 112 : 72
    },
    helpMessages() {
      // Retorna los mensajes de ayuda según la pantalla de juego actual
      if (this.currentScreen === 'dragdrop') {
        return this.helpMessagesGame2
      } else if (this.currentScreen === 'questions') {
        return this.helpMessagesGame1
      }
      return []
    }
  },
  methods: {
    handleMascotClick() {
      // Funciona tanto en game1 (questions) como en game2 (dragdrop)
      if (this.currentScreen !== 'questions' && this.currentScreen !== 'dragdrop') return;

      // Avanza a la siguiente ayuda, vuelve al inicio si está en la última
      if (this.activeMessageType !== 'ayuda') {
        this.showHelp(0);
      } else {
        const next = (this.helpClickCount + 1) % this.helpMessages.length;
        this.showHelp(next);
      }
      this.animateMascot('wiggle');
    },
    showHelp(index) {
      // Funciona tanto en game1 (questions) como en game2 (dragdrop)
      if (this.currentScreen !== 'questions' && this.currentScreen !== 'dragdrop') return;
      try {
        this.activeMessageType = 'ayuda';
        this.estadoLeo = 'piensa'; // UI-09
        this.helpClickCount = index;
        this.feedbackMessage = null;
        this.helpMessage = this.helpMessages[this.helpClickCount] || this.helpMessages[0];
      } catch (error) {
        console.error('Error al mostrar ayuda:', error)
      }
    },
    closeHelp() {
      // Funciona tanto en game1 (questions) como en game2 (dragdrop)
      if (this.currentScreen !== 'questions' && this.currentScreen !== 'dragdrop') return;
      try {
        this.helpMessage = null;
        this.activeMessageType = 'none';
        this.estadoLeo = 'neutro'; // UI-09
        // No mostrar el mensaje de ayuda inicial otra vez
        this.showInitialHelp = false;
      } catch (error) {
        console.error('Error al cerrar ayuda:', error)
      }
    },
    closeInitialHelp() {
      // Funciona tanto en game1 (questions) como en game2 (dragdrop)
      if (this.currentScreen !== 'questions' && this.currentScreen !== 'dragdrop') return;
      this.showInitialHelp = false;
    },
    showFeedback(message, isCorrect, explanation = null, isGameCompleted = false) {
      try {
        this.activeMessageType = 'feedback';
        this.feedbackMessage = message
        this.lastAnswerCorrect = isCorrect
        this.explanationMessage = explanation;
        // Animación según el tipo de feedback
        if (isGameCompleted) {
          this.animateMascot('fireworks');
        } else if (isCorrect) {
          this.animateMascot('happy');
        } else {
          this.animateMascot('sad');
        }
        // Ya no se cierra automáticamente, solo con la cruz
      } catch (error) {
        console.error('Error al mostrar feedback:', error)
      }
    },
    closeFeedback() {
      this.feedbackMessage = null;
      this.explanationMessage = null;
      this.activeMessageType = 'none';
      this.estadoLeo = 'neutro'; // UI-09
    },
    animateMascot(type) {
      // UI-09: el Leo nuevo cambia de cara (acierto, ánimo, celebra) o hace un gesto al tocarlo.
      // Lo de abajo (imagen y clases de la mascota anterior) se mantiene tal cual.
      if (type === 'wiggle') {
        if (this.$refs.personaje) this.$refs.personaje.reaccionar()
      } else if (ESTADO_SEGUN_ANIMACION[type]) {
        if (this.estadoLeo === ESTADO_SEGUN_ANIMACION[type] && this.$refs.personaje) this.$refs.personaje.reproducir()
        this.estadoLeo = ESTADO_SEGUN_ANIMACION[type]
      }
      try {
        if (type === 'happy') {
          this.mascotIcon = require('@/assets/icons/libro-sin-fondo-feliz.png')
          this.mascotClass = 'mascot-happy mascot-wiggle correct-bg'
          setTimeout(() => {
            this.mascotClass = 'mascot-happy'
          }, 1000)
        } else if (type === 'sad') {
          this.mascotIcon = require('@/assets/icons/libro-sin-fondo-triste.png')
          this.mascotClass = 'mascot-sad'
          setTimeout(() => {
            this.mascotIcon = require('@/assets/icons/libro-sin-fondo-feliz.png')
            this.mascotClass = 'mascot-happy'
          }, 2000)
        } else if (type === 'celebrate') {
          this.mascotClass = 'mascot-happy mascot-celebrate';
          setTimeout(() => {
            this.mascotClass = 'mascot-happy';
          }, 1200);
        } else if (type === 'wiggle') {
          this.mascotClass = 'mascot-happy mascot-wiggle'
          setTimeout(() => {
            this.mascotClass = 'mascot-happy'
          }, 800)
        }
      } catch (error) {
        console.error('Error al animar mascota:', error)
        this.mascotIcon = require('@/assets/icons/libro-sin-fondo-feliz.png')
        this.mascotClass = 'mascot-happy'
      }
    }
  },
  watch: {
    currentScreen(newScreen) {
      // Al cambiar de pantalla, resetear el estado de ayuda
      if (newScreen === 'questions' || newScreen === 'dragdrop') {
        this.estadoLeo = 'neutro' // UI-09
        this.showInitialHelp = true
        this.helpClickCount = 0
        this.activeMessageType = 'none'
        this.helpMessage = null
        this.feedbackMessage = null
      }
    }
  },
  mounted() {
    // UI-09: tamaño de Leo según el ancho (escritorio o celular)
    if (window.matchMedia) {
      this.consultaAncho = window.matchMedia('(min-width: 768px)')
      this.esAncho = this.consultaAncho.matches
      this.alCambiarAncho = e => { this.esAncho = e.matches }
      if (this.consultaAncho.addEventListener) this.consultaAncho.addEventListener('change', this.alCambiarAncho)
    }
    try {
      // Eventos del juego 1 (questions) - el juego 2 llama directamente a los métodos
      emitter.on('answer-selected', (payload) => {
        // Solo responder a eventos en el juego 1 (questions)
        if (this.currentScreen !== 'questions') return;

        // Si el juego está completado y todas correctas, solo mostrar mensaje final normal
        if (payload.gameCompleted) {
          if (payload.allCorrect) {
            this.showFeedback('🎉 <span style="font-size:1.2em">¡Juego completado al 100%!<br> <b>¡Eres un crack! 🏆🥳🎊</b></span>', true, null, 'celebrate');
          }
          // Si no todas son correctas, no mostrar feedback de respuesta
          return;
        }
        if (payload.correct) {
          this.showFeedback('¡Respuesta correcta! ¡Muy bien!', true, payload.explanation)
        } else {
          this.showFeedback('¡Ups! Esa no era la respuesta correcta. ¡Sigue intentando!', false, payload.explanation)
        }
      })
    } catch (error) {
      console.error('Error al montar componente:', error)
    }
  },
  beforeUnmount() {
    if (this.consultaAncho && this.consultaAncho.removeEventListener) this.consultaAncho.removeEventListener('change', this.alCambiarAncho)
    try {
      emitter.off('answer-selected')
    } catch (error) {
      console.error('Error al desmontar componente:', error)
    }
  }
}
</script>

<style scoped>
/* UI-09: colores de la paleta leo-*, sin degradados ni emojis */
.mj {
  position: fixed;
  right: 0.875rem;
  bottom: 1rem;
  z-index: 50;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  text-align: left; /* las pantallas de juego centran el texto; la burbuja se lee mejor alineada */
}
.mj-leo {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 1rem;
  background: transparent;
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
}
.mj-leo:focus-visible { outline: 3px solid #2568c4; outline-offset: 3px; }

.mj-burbuja {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 7.5rem;
  display: flex;
  gap: 0.25rem;
  padding: 1rem 0.5rem 1rem 1.125rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.125rem;
  box-shadow: 0 10px 28px rgba(20, 35, 59, 0.14);
  color: #14233b;
  animation: mj-aparece 0.25s ease-out;
}
.mj-burbuja__cuerpo {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding-top: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
.mj-burbuja__titulo {
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #1b4f9e;
}
.mj-burbuja__texto { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #14233b; }
.mj-burbuja__texto--fuerte { font-weight: 700; }
.mj-burbuja__texto--azul { font-weight: 700; color: #1b4f9e; }
.mj-burbuja__pie { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
.mj-burbuja__nota { font-size: 0.9375rem; color: #52627a; }
.mj-puntos { display: flex; gap: 0.375rem; }
.mj-punto { width: 8px; height: 8px; border-radius: 50%; background: #c9daef; }
.mj-punto--activo { background: #2568c4; }
.mj-etiqueta {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9375rem;
  font-weight: 700;
}
.mj-etiqueta--bien { background: #e3f3ea; color: #1f7a47; }
.mj-etiqueta--casi { background: #fff3cf; color: #8a5a00; }
.mj-explicacion {
  margin: 0;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  background: #e4f0fb;
  font-size: 1rem;
  line-height: 1.45;
  color: #1b4f9e;
}
.mj-cerrar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.75rem;
  background: transparent;
  cursor: pointer;
}
.mj-cerrar:hover { background: #f1f6fc; }
.mj-cerrar:focus-visible { outline: 3px solid #2568c4; outline-offset: 2px; }

/* Escritorio: Leo arriba a la izquierda y la burbuja a su lado (como antes) */
@media (min-width: 768px) {
  .mj { right: auto; bottom: auto; top: 5.5rem; left: 1.5rem; }
  .mj-burbuja {
    position: absolute;
    left: calc(100% + 1rem);
    right: auto;
    bottom: auto;
    top: 0;
    width: 20rem;
  }
}

@keyframes mj-aparece { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) { .mj-burbuja { animation: none; } }
html[data-animaciones="off"] .mj-burbuja { animation: none; }
</style>
