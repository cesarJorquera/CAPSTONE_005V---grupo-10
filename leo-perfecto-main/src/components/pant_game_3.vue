<template>
  <div>
    <!-- Pantalla de instrucciones -->
    <pant-instrucciones-game3
      v-if="mostrarInstrucciones"
      @iniciar="iniciarConModo"
    />

    <!-- Juego -->
    <div v-else class="min-h-screen bg-gradient-to-br from-blue-300 via-cyan-300 to-green-300 flex items-center justify-center px-4 py-8 relative overflow-hidden">
    
      <!-- Fondo animado con formas flotantes -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <!-- Círculos grandes -->
        <div v-for="n in 8" :key="'circle-'+n" 
             class="absolute rounded-full bg-white/10 animate-float"
             :style="{
               left: Math.random() * 100 + '%',
               top: Math.random() * 100 + '%',
               width: (Math.random() * 100 + 50) + 'px',
               height: (Math.random() * 100 + 50) + 'px',
               animationDelay: Math.random() * 5 + 's',
               animationDuration: (Math.random() * 10 + 15) + 's'
             }">
        </div>
      </div>

      <!-- Ventana flotante principal -->
      <transition name="slide-fade" mode="out-in">
        <!-- Durante el juego -->
        <div v-if="!juegoTerminado" 
             class="relative w-full max-w-4xl bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl shadow-2xl p-8 md:p-10 border-4 border-white/50 backdrop-blur-sm mb-8"
             :key="textoActual?.id">
          
          <!-- Timer (solo en modo desafío) -->
          <div v-if="modoJuego === 'desafio'" class="flex items-center justify-center mb-6">
            <div :class="[
              'flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold text-xl shadow-lg transition-all backdrop-blur-sm',
              tiempoRestante <= 30 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse scale-110' 
                : 'bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white'
            ]">
              <!-- Icono reloj SVG -->
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span>{{ formatearTiempo(tiempoRestante) }}</span>
            </div>
          </div>

          <!-- Contenedor con fondo blanco para texto + pregunta + alternativas -->
          <div class="bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-100">
            
            <!-- Texto principal (PRIMERO) -->
            <div class="relative bg-gradient-to-br from-green-300 via-teal-300 to-cyan-300 rounded-3xl p-8 mb-8 shadow-lg border-3 border-green-400/50 transform hover:scale-[1.01] transition-all">
              <!-- Icono de libro decorativo -->
              <div class="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <p class="text-lg md:text-xl leading-relaxed text-gray-900 font-bold">
                {{ textoActual?.texto }}
              </p>
            </div>

            <!-- Pregunta y alternativas (antes de responder) -->
            <div v-if="!mostrarFeedback">
              <!-- Pregunta con icono -->
              <div class="flex items-start space-x-4 mb-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 shadow-md border-2 border-blue-200">
                <div class="flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-3 shadow-lg">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="flex-1 text-xl font-bold text-gray-900 leading-relaxed">
                  {{ textoActual?.pregunta }}
                </h3>
              </div>

              <!-- Alternativas -->
              <div class="space-y-4">
                <button
                  v-for="alt in textoActual?.alternativas"
                  :key="alt.id"
                  @click="seleccionarRespuesta(alt)"
                  :disabled="respuestaSeleccionada !== null"
                  class="w-full bg-gradient-to-r from-white to-blue-50 hover:from-blue-100 hover:to-cyan-100 border-3 border-blue-200 hover:border-blue-400 rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl disabled:cursor-not-allowed group"
                >
                  <div class="flex items-center space-x-5">
                    <div class="flex-shrink-0 w-14 h-14 bg-blue-400 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      {{ alt.id }}
                    </div>
                    <p class="flex-1 text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {{ alt.texto }}
                    </p>
                    <!-- Flecha decorativa -->
                    <svg class="w-6 h-6 text-gray-400 group-hover:text-green-500 group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Feedback después de responder -->
            <div v-else>
              <!-- Resultado -->
              <div :class="[
                'rounded-3xl p-10 mb-8 text-center shadow-2xl transform transition-all duration-500 border-4',
                respuestaCorrecta 
                  ? 'bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 border-green-300' 
                  : 'bg-gradient-to-br from-red-400 via-pink-400 to-rose-400 border-red-300'
              ]">
                <!-- Icono SVG en lugar de emoji -->
                <div class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm mb-6 shadow-lg">
                  <svg v-if="respuestaCorrecta" class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 class="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {{ respuestaCorrecta ? '¡Correcto!' : '¡Incorrecto!' }}
                </h3>
                <p class="text-2xl text-white font-semibold drop-shadow">
                  {{ respuestaCorrecta ? '¡Excelente comprensión!' : 'Sigue practicando' }}
                </p>
              </div>

              <!-- Respuestas mostradas -->
              <div class="space-y-4 mb-6">
                <div
                  v-for="alt in textoActual?.alternativas"
                  :key="alt.id"
                  :class="[
                    'w-full rounded-2xl p-6 border-3 transition-all duration-300',
                    alt.correcta 
                      ? 'bg-green-100 border-green-500 shadow-lg' 
                      : respuestaSeleccionada?.id === alt.id 
                        ? 'bg-red-100 border-red-500' 
                        : 'bg-gray-50 border-gray-300 opacity-50'
                  ]"
                >
                  <div class="flex items-center space-x-4">
                    <div :class="[
                      'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg',
                      alt.correcta 
                        ? 'bg-green-500 text-white' 
                        : respuestaSeleccionada?.id === alt.id 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-400 text-white'
                    ]">
                      {{ alt.id }}
                    </div>
                    <p class="flex-1 text-lg font-medium text-gray-700">
                      {{ alt.texto }}
                    </p>
                    <div v-if="alt.correcta" class="text-3xl">✓</div>
                    <div v-else-if="respuestaSeleccionada?.id === alt.id" class="text-3xl">✗</div>
                  </div>
                </div>
              </div>

              <!-- Explicación -->
              <div class="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-2xl p-8 shadow-lg mb-6">
                <div class="flex items-start space-x-4">
                  <!-- Icono bombilla SVG -->
                  <div class="flex-shrink-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full p-3 shadow-lg">
                    <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-blue-900 mb-3 text-xl">
                      Explicación
                    </h4>
                    <p class="text-blue-800 leading-relaxed text-lg">{{ textoActual?.explicacion }}</p>
                  </div>
                </div>
              </div>

              <!-- Botón siguiente -->
              <div class="text-center">
                <button
                  @click="siguienteTexto"
                  class="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-green-500 hover:from-blue-700 hover:via-cyan-700 hover:to-green-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl transform hover:scale-110 transition-all duration-300"
                >
                  <span>{{ hasNextText ? 'Siguiente Texto' : 'Ver Resultados' }}</span>
                  <!-- Icono flecha o bandera -->
                  <svg v-if="hasNextText" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

        </div>

        <!-- Pantalla de resultados finales -->
        <div v-else class="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12">
        
        <!-- Título -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">{{ getMascotaEmoji() }}</div>
          <h2 class="text-4xl font-bold text-gray-800 mb-2">
            {{ getTituloResultado() }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ getMensajeResultado() }}
          </p>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <!-- Aciertos -->
          <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all">
            <div class="text-5xl mb-2">✅</div>
            <div class="text-4xl font-bold text-white mb-1">{{ respuestasCorrectas }}</div>
            <div class="text-white/90 font-semibold">Correctas</div>
          </div>

          <!-- Errores -->
          <div class="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all">
            <div class="text-5xl mb-2">❌</div>
            <div class="text-4xl font-bold text-white mb-1">{{ respuestasIncorrectas }}</div>
            <div class="text-white/90 font-semibold">Incorrectas</div>
          </div>

          <!-- Efectividad -->
          <div class="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all">
            <div class="text-5xl mb-2">🎯</div>
            <div class="text-4xl font-bold text-white mb-1">{{ porcentajeAciertos }}%</div>
            <div class="text-white/90 font-semibold">Efectividad</div>
          </div>

        </div>

        <!-- Análisis de errores por habilidad -->
        <div v-if="erroresJuego.length > 0" class="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8">
          <h3 class="text-xl font-bold text-red-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">📝</span>
            Habilidades a Mejorar
          </h3>
          <div class="space-y-2">
            <div v-for="error in erroresJuego" :key="error.textoId" 
                 class="bg-white rounded-lg p-4 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-semibold text-gray-800">{{ error.habilidad }}</p>
                  <p class="text-sm text-gray-600">{{ error.titulo }}</p>
                </div>
                <div class="text-red-500 font-bold">✗</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de la mascota -->
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <div class="flex items-start space-x-4">
            <div class="text-5xl">{{ getMascotaEmoji() }}</div>
            <div>
              <h4 class="font-bold text-purple-900 mb-2 text-lg">Leo te dice:</h4>
              <p class="text-purple-800 leading-relaxed">{{ getMensajeMascota() }}</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="reintentar"
            class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-all"
          >
            🔄 Jugar de Nuevo
          </button>
          <button
            @click="volverMenu"
            class="bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-full font-bold text-lg shadow-xl transform hover:scale-105 transition-all"
          >
            🏠 Volver al Menú
          </button>
        </div>

      </div>
    </transition>

    </div>
  </div>
</template>

<script>
import { game3Texts } from '@/data/game3_texts.js';
import { createGameManager } from '@/utils/gameManager.js';
import { emitter } from '@/utils/eventBus.js';
import PantInstruccionesGame3 from './pant_instrucciones_game3.vue';

export default {
  name: 'PantGame3',
  components: {
    PantInstruccionesGame3
  },
  props: {
    playerName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // Control de pantallas
      mostrarInstrucciones: true,
      modoJuego: null, // 'practica' o 'desafio'
      
      // Timer (modo desafío)
      tiempoRestante: 90, // 1:30 en segundos
      timerInterval: null,
      
      // Texto actual
      textoActual: null,
      numeroTextoActual: 1,
      totalTextos: 30,
      
      // Estado del juego
      respuestaSeleccionada: null,
      mostrarFeedback: false,
      respuestaCorrecta: false,
      juegoTerminado: false,
      
      // Estadísticas
      respuestasCorrectas: 0,
      respuestasIncorrectas: 0,
      textosProcesados: 0,
      
      // Errores para análisis
      erroresJuego: [],
      
      // Control de textos
      textosJugados: [],
      hasNextText: true,
      textosDisponibles: []
    };
  },
  computed: {
    porcentajeAciertos() {
      if (this.textosProcesados === 0) return 0;
      return Math.round((this.respuestasCorrectas / this.textosProcesados) * 100);
    }
  },
  mounted() {
    // No cargar texto hasta que se elija el modo
  },
  beforeUnmount() {
    // Limpiar timer si existe
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
  methods: {
    iniciarConModo(modo) {
      this.modoJuego = modo;
      this.mostrarInstrucciones = false;
      
      // Si es modo desafío, iniciar timer
      if (modo === 'desafio') {
        this.iniciarTimer();
      }
      
      // Cargar primer texto
      this.cargarTexto();
    },
    
    iniciarTimer() {
      this.timerInterval = setInterval(() => {
        this.tiempoRestante--;
        
        if (this.tiempoRestante <= 0) {
          clearInterval(this.timerInterval);
          this.juegoTerminado = true;
        }
      }, 1000);
    },
    
    formatearTiempo(segundos) {
      const mins = Math.floor(segundos / 60);
      const secs = segundos % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    cargarTexto() {
      // Obtener todos los textos de game3
      const todosLosTextos = Object.keys(game3Texts);
      
      // Filtrar textos no jugados
      const textosNoJugados = todosLosTextos.filter(id => !this.textosJugados.includes(id));
      
      if (textosNoJugados.length > 0) {
        // Seleccionar un texto aleatorio de los no jugados
        const randomIndex = Math.floor(Math.random() * textosNoJugados.length);
        const textoId = textosNoJugados[randomIndex];
        this.textoActual = game3Texts[textoId];
        this.hasNextText = textosNoJugados.length > 1;
      } else {
        // No hay más textos, terminar
        this.juegoTerminado = true;
      }
    },

    seleccionarRespuesta(alternativa) {
      if (this.respuestaSeleccionada) return;
      
      this.respuestaSeleccionada = alternativa;
      this.respuestaCorrecta = alternativa.correcta;
      this.mostrarFeedback = true;
      
      // Actualizar estadísticas
      this.textosProcesados++;
      
      if (this.respuestaCorrecta) {
        this.respuestasCorrectas++;
      } else {
        this.respuestasIncorrectas++;
        
        // Registrar error con detalles
        this.erroresJuego.push({
          textoId: this.textoActual.id,
          titulo: this.textoActual.titulo,
          tipo: this.textoActual.tipo,
          habilidad: this.textoActual.habilidad,
          respuestaIncorrecta: alternativa.texto,
          respuestaCorrecta: this.textoActual.alternativas.find(a => a.correcta)?.texto
        });
      }
      
      // Guardar progreso
      this.guardarProgreso();
      
      // Emitir evento para la mascota
      emitter.emit('respuesta-enviada', {
        correcta: this.respuestaCorrecta,
        tipo: 'comprension'
      });
    },

    siguienteTexto() {
      // Registrar texto actual como jugado
      this.textosJugados.push(this.textoActual.id);
      
      // Obtener textos no jugados
      const todosLosTextos = Object.keys(game3Texts);
      const textosNoJugados = todosLosTextos.filter(id => !this.textosJugados.includes(id));
      
      if (textosNoJugados.length > 0) {
        // Preparar para siguiente texto
        this.numeroTextoActual++;
        this.respuestaSeleccionada = null;
        this.mostrarFeedback = false;
        this.respuestaCorrecta = false;
        
        // Seleccionar un texto aleatorio
        const randomIndex = Math.floor(Math.random() * textosNoJugados.length);
        const textoId = textosNoJugados[randomIndex];
        this.textoActual = game3Texts[textoId];
        this.hasNextText = textosNoJugados.length > 1;
      } else {
        // Terminar juego - todos los textos completados
        this.juegoTerminado = true;
      }
    },

    guardarProgreso() {
      try {
        const gameManager = createGameManager(this.playerName);
        
        const resultado = gameManager.registrarIntento({
          textId: this.textoActual.id,
          gameId: 3,
          score: this.respuestaCorrecta ? 100 : 0,
          correctAnswers: this.respuestaCorrecta ? 1 : 0,
          totalQuestions: 1,
          errores: this.respuestaCorrecta ? [] : [{
            tipo: this.textoActual.tipo,
            habilidad: this.textoActual.habilidad,
            titulo: this.textoActual.titulo
          }]
        });
        
        if (resultado.success) {
          console.log('✅ Progreso guardado:', resultado.message);
        }
      } catch (error) {
        console.error('❌ Error al guardar progreso:', error);
      }
    },

    // Resultados finales
    getMascotaEmoji() {
      if (this.porcentajeAciertos >= 90) return '🌟';
      if (this.porcentajeAciertos >= 70) return '😊';
      if (this.porcentajeAciertos >= 50) return '📚';
      return '💪';
    },

    getTituloResultado() {
      if (this.porcentajeAciertos === 100) return '¡Perfecto!';
      if (this.porcentajeAciertos >= 80) return '¡Excelente!';
      if (this.porcentajeAciertos >= 60) return '¡Bien!';
      return '¡Sigue Practicando!';
    },

    getMensajeResultado() {
      if (this.porcentajeAciertos === 100) return 'Dominas la comprensión lectora';
      if (this.porcentajeAciertos >= 80) return 'Muy buen nivel de comprensión';
      if (this.porcentajeAciertos >= 60) return 'Vas por buen camino';
      return 'La práctica te hará mejorar';
    },

    getMensajeMascota() {
      if (this.porcentajeAciertos >= 90) {
        return '¡Increíble! Tu comprensión lectora es sobresaliente. Sigue así y serás un experto en analizar textos.';
      }
      if (this.porcentajeAciertos >= 70) {
        return '¡Muy bien! Comprendes bien las ideas principales. Practica más con las inferencias y serás imparable.';
      }
      if (this.porcentajeAciertos >= 50) {
        return 'Buen trabajo. Sigue practicando identificando ideas principales y detalles específicos.';
      }
      return 'No te desanimes. La comprensión mejora con la práctica. Lee cada texto con calma y piensa antes de responder.';
    },

    reintentar() {
      // Resetear estado
      this.textoActual = null;
      this.numeroTextoActual = 1;
      this.respuestaSeleccionada = null;
      this.mostrarFeedback = false;
      this.respuestaCorrecta = false;
      this.juegoTerminado = false;
      this.respuestasCorrectas = 0;
      this.respuestasIncorrectas = 0;
      this.textosProcesados = 0;
      this.erroresJuego = [];
      this.textosJugados = [];
      this.hasNextText = true;
      
      // Cargar nuevo texto
      this.cargarTexto();
    },

    volverMenu() {
      this.$emit('volver-menu');
    }
  }
};
</script>

<style scoped>
/* Animaciones */
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-10px); }
  75% { transform: translateY(-15px) translateX(5px); }
}

.animate-float {
  animation: float 10s infinite ease-in-out;
}

/* Transiciones */
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Hover effects */
button:active {
  transform: scale(0.98) !important;
}
</style>
