<template>
  <div class="fixed top-6 left-6 z-50">
    <div class="relative">
      <button 
        @click="handleMascotClick"
        class="text-4xl md:text-5xl transition-all focus:outline-none relative"
        :class="mascotClass"
      >
        <img :src="mascotIcon" alt="Icono de Libro" class="w-32 h-32" />
      </button>
      
      <div v-if="activeMessageType === 'ayuda' && helpMessage" class="absolute top-0 left-full ml-4 w-80 max-w-xs">
        <div class="bg-blue-100 rounded-xl shadow-xl p-4 border-2 border-blue-200 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-4 h-4 bg-blue-100 border-l-2 border-t-2 border-blue-200 transform -rotate-45"></div>
          <p class="text-base text-gray-900">{{helpMessage}}</p>
          <div class="flex justify-center mt-2 gap-1">
            <span v-for="(msg, i) in helpMessages" :key="i" class="inline-block w-2 h-2 rounded-full" :style="{ background: i === helpClickCount ? '#2563eb' : '#dbeafe' }"></span>
          </div>
          <button 
            @click="closeHelp"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      </div>
   <div v-else-if="activeMessageType === 'feedback' && feedbackMessage" class="absolute top-0 left-full ml-4 w-80 max-w-xs">
     <div class="bg-blue-100 rounded-xl shadow-xl p-4 border-2 relative"
       :class="lastAnswerCorrect ? 'border-green-200' : 'border-red-200'">
    <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-4 h-4 bg-blue-100 transform -rotate-45"
      :class="lastAnswerCorrect ? 'border-l-2 border-t-2 border-green-200' : 'border-l-2 border-t-2 border-red-200'" ></div>
          <p class="text-base text-gray-700" v-html="feedbackMessage"></p>
          <p v-if="explanationMessage" class="mt-2 text-base text-blue-700 bg-blue-100 rounded px-2 py-1">{{explanationMessage}}</p>
          <button 
            @click="closeFeedback"
            class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >✕</button>
        </div>
      </div>
      <div v-else-if="activeMessageType === 'none' && (currentScreen === 'questions' || currentScreen === 'dragdrop') && showInitialHelp" class="absolute top-0 left-full ml-4 w-80 max-w-xs">
        <div class="bg-white rounded-xl shadow-xl p-4 border-2 border-blue-200 relative">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-4 h-4 bg-white border-l-2 border-t-2 border-blue-200 transform -rotate-45"></div>
          <p class="text-sm text-blue-700 font-semibold">¡Si necesitas ayuda puedes hacerme click!</p>
          <button @click="closeInitialHelp" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { emitter } from '../utils/eventBus'

export default {
  name: 'MascotaAyuda',
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
    showInitialHelp: true
    }
  },
  computed: {
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
    },
    animateMascot(type) {
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
        this.showInitialHelp = true
        this.helpClickCount = 0
        this.activeMessageType = 'none'
        this.helpMessage = null
        this.feedbackMessage = null
      }
    }
  },
  mounted() {
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
    try {
      emitter.off('answer-selected')
    } catch (error) {
      console.error('Error al desmontar componente:', error)
    }
  }
}
</script>
