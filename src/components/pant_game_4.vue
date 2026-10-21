<template>
  <div class="max-w-5xl mx-auto px-4">
    <!-- Contenedor principal -->
    <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-300">
      
      <!-- Header con progreso -->
      <div class="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="bg-white rounded-full p-2">
            <svg class="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Trivia de Fundamentos</h2>
            <p class="text-sm text-orange-100">{{ totalPreguntas }} preguntas sobre conceptos básicos</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3">
          <!-- Progreso -->
          <div class="bg-white px-4 py-2 rounded-full shadow-lg">
            <span class="text-sm font-bold text-orange-700">{{ preguntaActual + 1 }}/{{ totalPreguntas }}</span>
          </div>
          <div class="bg-amber-600 px-4 py-2 rounded-full shadow-lg">
            <span class="text-sm font-bold text-white">{{ porcentajeProgreso }}%</span>
          </div>
          
          <button @click="cerrarJuego" class="text-white hover:bg-white/20 rounded-full p-2 transition-all">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenedor del carrusel con scroll -->
      <div class="max-h-[600px] overflow-y-auto p-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        
        <!-- Tarjeta de pregunta con transición -->
        <transition name="slide" mode="out-in">
          <div :key="preguntaActual" class="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            
            <!-- Categoría -->
            <div class="flex items-center justify-center gap-2 mb-6">
              <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo" class="w-12 h-12" />
              <div class="bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-2 rounded-full border-2 border-indigo-300">
                <p class="text-sm font-bold text-indigo-700">
                  📚 {{ preguntaData.categoria }}
                </p>
              </div>
            </div>

            <!-- Pregunta -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200 shadow-md">
              <p class="text-xl font-bold text-gray-800 text-center leading-relaxed">
                {{ preguntaData.pregunta }}
              </p>
            </div>

            <!-- Alternativas -->
            <div class="space-y-4 mb-6">
              <button
                v-for="alternativa in preguntaData.alternativas"
                :key="alternativa.id"
                @click="seleccionarRespuesta(alternativa.id)"
                :disabled="respuestaSeleccionada !== null"
                :class="getClassAlternativa(alternativa.id)"
                class="w-full text-left p-5 rounded-xl font-semibold text-base transition-all transform hover:scale-102 disabled:cursor-not-allowed border-2"
              >
                <div class="flex items-center gap-4">
                  <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                       :class="getClassLetra(alternativa.id)">
                    {{ alternativa.id.toUpperCase() }}
                  </div>
                  <span class="flex-1">{{ alternativa.texto }}</span>
                  <svg v-if="respuestaSeleccionada === alternativa.id && esCorrecta" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-if="respuestaSeleccionada === alternativa.id && !esCorrecta" class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>

            <!-- Explicación (aparece después de responder) -->
            <transition name="fade">
              <div v-if="respuestaSeleccionada !== null" class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300 shadow-lg mb-6">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo explica" class="w-16 h-16" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
                      <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                      💡 Explicación:
                    </h3>
                    <p class="text-gray-700 leading-relaxed text-base">
                      {{ preguntaData.explicacion }}
                    </p>
                  </div>
                </div>
              </div>
            </transition>

          </div>
        </transition>

        <!-- Mini indicadores de progreso (círculos) -->
        <div class="flex justify-center gap-2 mt-6 flex-wrap">
          <div
            v-for="(_, index) in totalPreguntas"
            :key="index"
            class="w-3 h-3 rounded-full transition-all"
            :class="index < preguntaActual ? 'bg-green-500' : index === preguntaActual ? 'bg-orange-500 scale-125' : 'bg-gray-300'"
          ></div>
        </div>

        <!-- Botones de navegación -->
        <div class="flex justify-between items-center mt-8 gap-4">
          <button
            @click="anteriorPregunta"
            :disabled="preguntaActual === 0"
            class="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Anterior
          </button>

          <button
            v-if="preguntaActual < totalPreguntas - 1"
            @click="siguientePregunta"
            :disabled="respuestaSeleccionada === null"
            class="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
          >
            Siguiente
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
            v-else
            @click="finalizarTrivia"
            :disabled="respuestaSeleccionada === null"
            class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 disabled:hover:scale-100 flex items-center gap-2 text-lg"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Finalizar Trivia
          </button>
        </div>

      </div>
    </div>

    <!-- Nuevo Modal de Completación -->
    <GameCompletionModal
      :show="mostrarResultados"
      :score="puntajeFinal"
      :correct-answers="respuestasCorrectas"
      :total-questions="totalPreguntas"
      :has-next-challenge="false"
      :recommendation="getRecommendation()"
      @retry="reiniciarTrivia"
      @choose-game="elegirJuego"
      @back-to-progress="volverAProgreso"
    />

  </div>
</template>

<script>
import { getAllTriviaPreguntas } from '../data/game4_trivia'
import { createGameManager } from '../utils/gameManager'
import { createGameProgressTracker } from '../utils/supabaseProgress'
import { triviaQuestionAssessment } from '../utils/assessment'

export default {
  name: 'PantGame4',
  components: {
  },
  props: {
    playerName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      preguntas: [],
      preguntaActual: 0,
      respuestaSeleccionada: null,
      respuestasCorrectas: 0,
      respuestasUsuario: {},
      mostrarResultados: false,
      gameManager: null,
      progressTracker: null,
      progressClosed: false
    }
  },
  computed: {
    totalPreguntas() {
      return this.preguntas.length
    },
    preguntaData() {
      return this.preguntas[this.preguntaActual] || {}
    },
    esCorrecta() {
      return this.respuestaSeleccionada === this.preguntaData.respuestaCorrecta
    },
    porcentajeProgreso() {
      const respondidas = Object.keys(this.respuestasUsuario).length
      return Math.round((respondidas / this.totalPreguntas) * 100)
    },
    puntajeFinal() {
      return Math.round((this.respuestasCorrectas / this.totalPreguntas) * 100)
    }
  },
  mounted() {
    this.gameManager = createGameManager(this.playerName)
    this.preguntas = getAllTriviaPreguntas()
    this.iniciarRegistroSesion()
  },
  beforeUnmount() {
    if (this.progressTracker && !this.progressClosed) {
      this.progressTracker.abandon().catch(error => {
        console.error('❌ No se pudo registrar el abandono del Juego 4:', error)
      })
    }
  },
  methods: {
    iniciarRegistroSesion() {
      this.progressClosed = false
      this.progressTracker = createGameProgressTracker({
        gameId: 4,
        contentId: 'trivia1',
        totalQuestions: this.totalPreguntas
      })
    },
    seleccionarRespuesta(alternativaId) {
      if (this.respuestaSeleccionada !== null) return
      
      this.respuestaSeleccionada = alternativaId
      const preguntaId = this.preguntaData.id
      
      // Guardar respuesta
      this.respuestasUsuario[preguntaId] = {
        seleccionada: alternativaId,
        correcta: this.preguntaData.respuestaCorrecta,
        esCorrecta: alternativaId === this.preguntaData.respuestaCorrecta
      }
      
      // Contar correctas
      if (alternativaId === this.preguntaData.respuestaCorrecta) {
        this.respuestasCorrectas++
      }

      const assessment = triviaQuestionAssessment(this.preguntaData.categoria)
      this.progressTracker.record({
        itemId: `trivia:${preguntaId}`,
        assessmentType: assessment.type,
        assessmentCode: assessment.code,
        answer: { selected: alternativaId },
        isCorrect: alternativaId === this.preguntaData.respuestaCorrecta
      }).catch(error => {
        console.error('❌ No se pudo guardar la respuesta del Juego 4:', error)
      })
    },
    
    getClassAlternativa(alternativaId) {
      if (this.respuestaSeleccionada === null) {
        return 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
      }
      
      if (alternativaId === this.preguntaData.respuestaCorrecta) {
        return 'bg-green-100 border-green-400'
      }
      
      if (alternativaId === this.respuestaSeleccionada && !this.esCorrecta) {
        return 'bg-red-100 border-red-400'
      }
      
      return 'bg-gray-100 border-gray-300'
    },
    
    getClassLetra(alternativaId) {
      if (this.respuestaSeleccionada === null) {
        return 'bg-blue-100 text-blue-700'
      }
      
      if (alternativaId === this.preguntaData.respuestaCorrecta) {
        return 'bg-green-500 text-white'
      }
      
      if (alternativaId === this.respuestaSeleccionada && !this.esCorrecta) {
        return 'bg-red-500 text-white'
      }
      
      return 'bg-gray-200 text-gray-600'
    },
    
    siguientePregunta() {
      if (this.preguntaActual < this.totalPreguntas - 1) {
        this.preguntaActual++
        this.respuestaSeleccionada = null
      }
    },
    
    anteriorPregunta() {
      if (this.preguntaActual > 0) {
        this.preguntaActual--
        const preguntaId = this.preguntaData.id
        this.respuestaSeleccionada = this.respuestasUsuario[preguntaId]?.seleccionada || null
      }
    },
    
    async finalizarTrivia() {
      if (this.progressClosed || this.mostrarResultados) return

      this.progressClosed = true
      // Guardar progreso en gameManager
      this.gameManager.saveGameResult({
        gameId: 4,
        textId: 'trivia1',
        score: this.puntajeFinal,
        correctAnswers: this.respuestasCorrectas,
        totalQuestions: this.totalPreguntas,
        date: new Date().toISOString()
      })

      try {
        await this.progressTracker.complete()
      } catch (error) {
        this.progressClosed = false
        console.error('❌ No se pudo cerrar la sesión del Juego 4:', error)
      }
      
      this.mostrarResultados = true
    },
    
    getMensajeMotivacional() {
      const porcentaje = this.puntajeFinal
      if (porcentaje === 100) return '🏆 ¡Perfecto! Dominas todos los conceptos fundamentales.'
      if (porcentaje >= 90) return '⭐ ¡Excelente! Tu comprensión de los fundamentos es sobresaliente.'
      if (porcentaje >= 75) return '👍 ¡Muy bien! Tienes una base sólida de conocimientos.'
      if (porcentaje >= 60) return '📚 ¡Buen trabajo! Sigue estudiando para mejorar.'
      return '💪 ¡Sigue practicando! Cada intento te acerca al dominio.'
    },
    
    getMensajeClass() {
      const porcentaje = this.puntajeFinal
      if (porcentaje >= 90) return 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300'
      if (porcentaje >= 75) return 'bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300'
      if (porcentaje >= 60) return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-300'
      return 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300'
    },
    
    volverAProgreso() {
      this.$emit('go-to-progreso')
    },
    
    reiniciarTrivia() {
      this.preguntaActual = 0
      this.respuestaSeleccionada = null
      this.respuestasCorrectas = 0
      this.respuestasUsuario = {}
      this.mostrarResultados = false
      this.iniciarRegistroSesion()
    },
    
    cerrarJuego() {
      if (confirm('¿Seguro que quieres salir? Perderás tu progreso actual.')) {
        this.$emit('go-to-progreso')
      }
    },
    
    elegirJuego() {
      this.$emit('choose-game')
    },
    
    getRecommendation() {
      const porcentaje = this.puntajeFinal
      if (porcentaje === 100) return 'Estás listo para desafíos más complejos. Prueba los ejercicios de comprensión lectora.'
      if (porcentaje >= 75) return 'Buen trabajo. Refuerza tus conocimientos con más ejercicios de clasificación.'
      if (porcentaje >= 60) return 'Sigue practicando. Te recomiendo repasar conceptos básicos y volver a intentarlo.'
      return 'No te rindas. Revisa las explicaciones de cada pregunta y practica con textos simples primero.'
    }
  }
}
</script>

<style scoped>
/* Animaciones de transición */
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}
</style>
