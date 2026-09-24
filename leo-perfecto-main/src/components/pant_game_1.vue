<template>
  <div class="space-y-6">
    <!-- Mensaje de error si no hay preguntas para este texto -->
    <div v-if="!hasValidQuestions" class="bg-white rounded-3xl shadow-xl p-8 text-center">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        Texto sin preguntas disponibles
      </h2>
      <p class="text-gray-600 mb-6">
        Lo sentimos, este texto aún no tiene preguntas configuradas.
      </p>
      <button 
        @click="$emit('restart')"
        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
      >
        Volver al inicio
      </button>
    </div>

    <!-- Layout responsive del juego -->
    <div v-else class="flex flex-col md:flex-row gap-6">
      <!-- Texto de referencia -->
      <div class="md:w-1/2 bg-white rounded-3xl shadow-xl p-8">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">
          {{ currentText.title }}
        </h3>
        <div class="bg-green-50 p-6 rounded-xl text-lg leading-relaxed text-gray-700">
          <p v-html="currentText.content"></p>
        </div>
      </div>

      <!-- Preguntas -->
      <div class="md:w-1/2 space-y-6">
        <!-- Pantalla de preguntas activa -->
        <div v-if="!gameCompleted" class="bg-white rounded-3xl shadow-xl p-6 md:p-8 question-card">
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-semibold text-gray-500">Pregunta {{currentQuestionIndex + 1}} de {{questions.length}}</span>
              <span class="text-sm font-semibold text-gray-500">{{correctAnswers}}/{{answeredQuestions}} correctas</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all" 
                   :style="{width: progress + '%'}"></div>
            </div>
          </div>

          <!-- Validación adicional antes de mostrar la pregunta -->
          <div v-if="currentQuestion">
            <h3 class="text-xl font-bold text-gray-800 mb-6">
              {{currentQuestion.question}}
            </h3>

            <div class="space-y-3">
              <button 
                v-for="option in currentQuestion.options" 
                :key="option"
                @click="selectAnswer(option)"
                @mouseenter="!questionAnswered && playSound('click')"
                :disabled="questionAnswered"
                class="w-full p-4 text-left border-2 border-gray-200 rounded-xl option-button font-bold disabled:cursor-not-allowed transition-all"
                :class="[getOptionClass(option), getOptionBg(option)]"
              >
                {{option}}
              </button>
            </div>
          </div>

          <div v-if="questionAnswered" class="mt-6 text-center">
            <button 
              @click="nextQuestion"
              class="bg-gradient-to-r from-blue-400 to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              {{isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}}
            </button>
          </div>
        </div>

        <!-- Pantalla de resultados finales -->
        <div v-if="gameCompleted" class="bg-white rounded-3xl shadow-xl p-6 md:p-8 text-center">
          <div class="text-6xl mb-6">
            <span v-if="correctAnswers === questions.length">🎉</span>
            <span v-else-if="correctAnswers >= questions.length * 0.8">😊</span>
            <span v-else-if="correctAnswers >= questions.length * 0.6">😐</span>
            <span v-else>😔</span>
          </div>

          <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            ¡Texto Completado, {{playerName}}!
          </h2>

          <p class="text-lg text-gray-600 mb-2">
            Has completado: <span class="font-bold text-purple-600">{{ currentText.title }}</span>
          </p>
          
          <div class="text-lg text-gray-600 mb-6">
            <p class="mb-2">Respuestas correctas: <span class="font-bold text-green-600">{{correctAnswers}}</span> de {{questions.length}}</p>
            <p class="mb-4">Puntuación: <span class="font-bold text-blue-600">{{score}}%</span></p>
            
            <div v-if="correctAnswers === questions.length" class="text-green-600 font-semibold">
              ¡Excelente trabajo! Dominaste completamente las palabras clave de este texto.
            </div>
            <div v-else-if="correctAnswers >= questions.length * 0.8" class="text-blue-600 font-semibold">
              ¡Muy bien! Tienes un buen dominio de las palabras clave.
            </div>
            <div v-else-if="correctAnswers >= questions.length * 0.6" class="text-yellow-600 font-semibold">
              Buen trabajo. Con un poco más de práctica serás excelente.
            </div>
            <div v-else class="text-red-600 font-semibold">
              No te preocupes, la práctica hace al maestro. ¡Inténtalo de nuevo!
            </div>
          </div>

          <!-- Botones de acción después del juego -->
          <div class="flex flex-col gap-4 mt-8">
            <!-- Botón para siguiente texto si existe -->
            <button 
              v-if="hasNextText"
              @click="irASiguienteTexto"
              class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:scale-105"
            >
              📖 Siguiente Texto
            </button>
            
            <!-- Botón para ver progreso si no hay más textos -->
            <button 
              v-else
              @click="goToProgreso"
              class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:shadow-lg hover:scale-105"
            >
              📊 Ver Mi Progreso
            </button>
            
            <!-- Botón secundario: Reintentar -->
            <button 
              @click="$emit('restart')"
              class="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              🔄 Reintentar este Texto
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ============================================
// IMPORTACIONES
// ============================================
import { emitter } from '../utils/eventBus'
import { getTextById } from '../data/game1_texts'
import { getQuestionsByTextId } from '../data/quest_game_keyword'
import { createGameManager } from '../utils/gameManager'

// ============================================
// COMPONENTE: Juego 1 - Preguntas sobre Palabras Clave
// ============================================
// Este componente muestra un texto con palabras clave destacadas
// y realiza preguntas de opción múltiple sobre esas palabras.
// El jugador debe identificar el tipo de palabra (sustantivo, verbo, etc.)
// ============================================
export default {
  name: 'QuestionsScreen',
  
  // Props recibidas desde el componente padre (App.vue)
  props: {
    playerName: {
      type: String,
      required: true,
      description: 'Nombre del jugador para personalizar mensajes'
    },
    textId: {
      type: String,
      default: 'text1',
      description: 'ID del texto a mostrar (text1, text2, etc.)'
    }
  },
  
  // Estado del componente
  data() {
    return {
      currentQuestionIndex: 0,      // Índice de la pregunta actual
      questionAnswered: false,       // Si la pregunta actual fue respondida
      selectedAnswer: null,          // Respuesta seleccionada por el jugador
      correctAnswers: 0,             // Contador de respuestas correctas
      answeredQuestions: 0,          // Total de preguntas respondidas
      gameCompleted: false,          // Si el juego fue completado
      audioContext: null,            // Contexto para reproducir sonidos
      erroresJuego: [],              // Array de errores cometidos
      hasNextText: false,            // Si hay siguiente texto disponible
      nextTextId: null               // ID del siguiente texto
    }
  },
  
  // ============================================
  // PROPIEDADES COMPUTADAS
  // ============================================
  // Estas propiedades se recalculan automáticamente cuando cambian sus dependencias
  computed: {
    // Obtiene el texto actual por ID
    currentText() {
      return getTextById(this.textId) || {
        id: 'text1',
        title: 'Texto de referencia',
        content: 'Texto no encontrado'
      }
    },
    
    // Obtiene las preguntas para el texto actual
    questions() {
      return getQuestionsByTextId(this.textId) || []
    },
    
    // Validación: verifica que existan preguntas
    hasValidQuestions() {
      return this.questions && this.questions.length > 0
    },
    
    // Obtiene la pregunta actual (con validación para evitar undefined)
    currentQuestion() {
      if (!this.hasValidQuestions) return null
      return this.questions[this.currentQuestionIndex] || null
    },
    
    // Verifica si es la última pregunta
    isLastQuestion() {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    
    // Calcula el progreso en porcentaje (0-100)
    progress() {
      if (!this.hasValidQuestions) return 0
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100
    },
    
    // Calcula el puntaje final en porcentaje
    score() {
      if (!this.hasValidQuestions || this.questions.length === 0) return 0
      return Math.round((this.correctAnswers / this.questions.length) * 100)
    }
  },
  
  // ============================================
  // CICLO DE VIDA: MOUNTED
  // ============================================
  // Se ejecuta cuando el componente se monta en el DOM
  mounted() {
    // Guardar el nombre del jugador en localStorage
    this.savePlayerName();
    
    // Inicializar AudioContext para sonidos del juego
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio no disponible en este navegador:', error);
    }
  },
  
  // ============================================
  // MÉTODOS DEL COMPONENTE
  // ============================================
  methods: {
    // Maneja la selección de una respuesta
    selectAnswer(answer) {
      if (this.questionAnswered || !this.currentQuestion) return;
      
      this.selectedAnswer = answer;
      this.questionAnswered = true;
      this.answeredQuestions++;
      
      // Explicaciones para cada tipo de palabra
      const tipoExplicacion = {
        'Un sustantivo': 'Un sustantivo es el nombre de una persona, lugar, cosa o idea. Ejemplo: "Harry Potter", "escuela", "libro".',
        'Un verbo': 'Un verbo indica una acción, estado o proceso. Ejemplo: "correr", "sabían", "leer".',
        'Un adjetivo': 'Un adjetivo describe o califica a un sustantivo. Ejemplo: "difícil", "rápido", "grande".',
        'Un conector': 'Un conector une ideas o frases en una oración. Ejemplo: "pero", "aunque", "y".'
      };
      
      if (answer === this.currentQuestion.correct) {
        this.correctAnswers++;
        this.playSound('correct');
        emitter.emit('answer-selected', {
          correct: true,
          explanation: this.currentQuestion.explanation
        });
      } else {
        this.playSound('incorrect');
        const explicacion = tipoExplicacion[answer] || 'Revisa la definición de este tipo de palabra.';
        
        // Guardar error específico
        this.erroresJuego.push({
          pregunta: this.currentQuestion.question,
          palabra: this.currentQuestion.word,
          respuestaCorrecta: this.currentQuestion.correct,
          respuestaUsuario: answer,
          explicacion: explicacion
        });
        
        emitter.emit('answer-selected', {
          correct: false,
          explanation: explicacion
        });
      }
    },
    
    // Clases CSS para las opciones
    getOptionClass() {
      return '';
    },
    
    // Colores de fondo para cada tipo de opción
    getOptionBg(option) {
      const opt = option.toLowerCase();
      if (opt.includes('sustantivo')) return 'bg-blue-300 text-black hover:bg-blue-500 hover:text-white';
      if (opt.includes('verbo')) return 'bg-green-300 text-black hover:bg-green-500 hover:text-white';
      if (opt.includes('conector') || opt.includes('idea')) return 'bg-purple-300 text-black hover:bg-purple-500 hover:text-white';
      if (opt.includes('adjetivo')) return 'bg-yellow-300 text-black hover:bg-yellow-500 hover:text-white';
      return 'bg-gray-100 text-black hover:bg-gray-300';
    },
    
    // Avanza a la siguiente pregunta o muestra resultados
    nextQuestion() {
      if (!this.hasValidQuestions) return;
      
      this.questionAnswered = false;
      this.selectedAnswer = null;
      
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.gameCompleted = true;
        this.playSound('complete');
        
        const allCorrect = this.correctAnswers === this.questions.length;
        emitter.emit('answer-selected', {
          gameCompleted: true,
          allCorrect
        });
        
        // Guardar progreso
        this.saveProgress();
      }
    },
    
    // Navega a Mi Progreso
    goToProgreso() {
      this.$emit('go-to-progreso');
    },
    
    // Ir al siguiente texto disponible
    irASiguienteTexto() {
      if (this.nextTextId) {
        this.$emit('try-next-text', this.nextTextId);
      }
    },
    
    // Verificar si hay un siguiente texto no completado
    checkNextText() {
      const gameManager = createGameManager(this.playerName || 'anonimo');
      const disponibles = gameManager.getJuegosDisponibles(1); // Unidad 1
      
      // Filtrar solo juegos del tipo 1 (palabras clave)
      const textosDisponibles = disponibles.filter(j => j.gameId === 1);
      
      // Buscar el siguiente texto diferente al actual
      const siguiente = textosDisponibles.find(t => t.textId !== this.textId);
      
      if (siguiente) {
        this.hasNextText = true;
        this.nextTextId = siguiente.textId;
      } else {
        this.hasNextText = false;
      }
    },
    
    // ============================================
    // GUARDAR PROGRESO CON GAME MANAGER
    // ============================================
    // Guarda el progreso usando el sistema inteligente de GameManager
    // que detecta si el jugador mejoró o empeoró su puntaje
    saveProgress() {
      try {
        // Crear instancia de GameManager
        const gameManager = createGameManager(this.playerName || 'anonimo')
        
        // Registrar intento con todas las validaciones
        const resultado = gameManager.registrarIntento({
          textId: this.textId,
          gameId: 1, // Juego 1: Palabras clave
          correctAnswers: this.correctAnswers,
          totalQuestions: this.questions.length,
          score: this.score,
          errores: this.erroresJuego // Agregar errores específicos
        })

        if (resultado.success) {
          console.log('✅ Progreso guardado exitosamente')
          console.log(resultado.mensaje)
          
          // Si mejoró o empeoró, puedes mostrar un mensaje especial
          if (resultado.mejoro) {
            console.log(`🎉 ¡Mejoraste tu puntaje! +${resultado.diferencia}%`)
          } else if (resultado.empeoro) {
            console.log(`📚 Tu mejor puntaje sigue siendo ${resultado.mejorPrevio}%`)
          }
          
          // Verificar si hay siguiente texto disponible
          this.checkNextText()
        } else {
          console.error('❌ Error al guardar progreso:', resultado.error)
        }
      } catch (error) {
        console.error('❌ Error crítico al guardar progreso:', error)
        // Fallback: guardar de la manera antigua si falla GameManager
        this.saveProgressLegacy()
      }
    },
    
    // Método legacy como respaldo
    saveProgressLegacy() {
      try {
        const playerId = this.playerName || 'anonimo'
        const progressKey = `leo-perfecto-progress-${playerId}`
        
        const progressData = {
          player: playerId,
          textId: this.textId,
          textTitle: this.currentText.title,
          correctAnswers: this.correctAnswers,
          totalQuestions: this.questions.length,
          score: this.score,
          gameId: 1,
          completed: true,
          date: new Date().toISOString()
        }
        
        let generalProgress = JSON.parse(localStorage.getItem(progressKey) || '[]')
        generalProgress.push(progressData)
        localStorage.setItem(progressKey, JSON.stringify(generalProgress))
        
        console.log('✅ Progreso guardado (modo legacy)')
      } catch (error) {
        console.error('❌ Error en saveProgressLegacy:', error)
      }
    },
    
    // Guarda el nombre del jugador en localStorage
    savePlayerName() {
      if (this.playerName) {
        const playerKey = 'leo-perfecto-player';
        localStorage.setItem(playerKey, this.playerName);
      }
    },
    
    // ============================================
    // SISTEMA DE SONIDOS
    // ============================================
    // Reproduce diferentes sonidos según el tipo de evento
    // Reproduce diferentes sonidos según el tipo de evento
    playSound(type) {
      if (!this.audioContext) return;

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      switch(type) {
        case 'correct':
          // Sonido alegre ascendente: Do-Mi-Sol (respuesta correcta)
          oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); 
          oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); 
          oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); 
          gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
          break;

        case 'incorrect':
          // Sonido descendente (respuesta incorrecta)
          oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.2);
          break;

        case 'click':
          // Sonido breve para hover en botones
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.1);
          break;

        case 'complete': {
          // Fanfare de victoria: Do-Mi-Sol-Do (juego completado)
          const frequencies = [523.25, 659.25, 783.99, 1046.50];
          frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);
            gain.gain.setValueAtTime(0.2, this.audioContext.currentTime + index * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + (index * 0.1) + 0.2);
            osc.start(this.audioContext.currentTime + index * 0.1);
            osc.stop(this.audioContext.currentTime + (index * 0.1) + 0.2);
          });
          break;
        }
      }
    }
  }
}
</script>
