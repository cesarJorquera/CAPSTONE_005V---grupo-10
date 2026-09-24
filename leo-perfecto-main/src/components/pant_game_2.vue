<template>
  <div class="space-y-6">
    <!-- Mensaje de error si no hay datos válidos -->
    <div v-if="!hasValidData" class="bg-white rounded-3xl shadow-xl p-8 text-center">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        Texto no disponible
      </h2>
      <p class="text-gray-600 mb-6">
        Lo sentimos, este texto aún no está configurado.
      </p>
      <button 
        @click="$emit('restart-game2')"
        class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
      >
        Volver al inicio
      </button>
    </div>

    <!-- Juego normal cuando hay datos válidos -->
    <div v-else class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Clasifica las palabras
      </h2>

      <!-- Barra de progreso, puntaje y vidas -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div class="w-full md:w-2/3">
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all" :style="{width: progreso + '%'}"></div>
          </div>
          <div class="text-sm text-gray-600 mt-1">Progreso: {{ espaciosCompletados }}/{{ totalEspacios }} completados</div>
        </div>
        <div class="flex flex-col md:items-end">
          <div class="text-base font-semibold text-blue-700">Aciertos: {{ aciertos }}</div>
          <div class="text-base font-semibold text-red-500">Errores: {{ errores }} / {{ vidasMaximas }}</div>
          <div class="flex items-center gap-1 mt-1">
            <span v-for="n in vidasRestantes" :key="n" class="text-2xl text-red-400 animate-pulse">❤️</span>
            <span v-for="n in (vidasMaximas - vidasRestantes)" :key="'x'+n" class="text-2xl text-gray-300 opacity-30">💔</span>
          </div>
        </div>
      </div>


      <!-- Contenedor de la mascota (similar a game 1) -->
      <mascota 
        ref="mascota"
        :current-screen="'dragdrop'"
      />

      <!-- Contenedores de palabras -->
      <div class="grid grid-cols-2 gap-4 mb-8">
        <div class="border-4 border-red-300 rounded-xl p-4">
          <h3 class="text-lg font-bold text-red-400 mb-2">Verbos</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="palabra in palabrasPorTipo.verbos"
              :key="palabra.id"
              v-show="!palabra.colocada"
              draggable="true"
              @dragstart="iniciarArrastre($event, palabra)"
              class="px-2 py-1 bg-red-100 rounded cursor-move hover:bg-red-300 transition-all"
            >
              {{ palabra.texto }}
            </span>
          </div>
        </div>

        <div class="border-4 border-blue-400 rounded-xl p-4">
          <h3 class="text-lg font-bold text-blue-600 mb-2">Sustantivos</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="palabra in palabrasPorTipo.sustantivos"
              :key="palabra.id"
              v-show="!palabra.colocada"
              draggable="true"
              @dragstart="iniciarArrastre($event, palabra)"
              class="px-2 py-1 bg-blue-100 rounded cursor-move hover:bg-blue-200 transition-all"
            >
              {{ palabra.texto }}
            </span>
          </div>
        </div>

        <div class="border-4 border-purple-400 rounded-xl p-4">
          <h3 class="text-lg font-bold text-purple-600 mb-2">Conectores</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="palabra in palabrasPorTipo.conectores"
              :key="palabra.id"
              v-show="!palabra.colocada"
              draggable="true"
              @dragstart="iniciarArrastre($event, palabra)"
              class="px-2 py-1 bg-purple-100 rounded cursor-move hover:bg-purple-200 transition-all"
            >
              {{ palabra.texto }}
            </span>
          </div>
        </div>

        <div class="border-4 border-green-400 rounded-xl p-4">
          <h3 class="text-lg font-bold text-green-600 mb-2">Adjetivos</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="palabra in palabrasPorTipo.adjetivos"
              :key="palabra.id"
              v-show="!palabra.colocada"
              draggable="true"
              @dragstart="iniciarArrastre($event, palabra)"
              class="px-2 py-1 bg-green-100 rounded cursor-move hover:bg-green-200 transition-all"
            >
              {{ palabra.texto }}
            </span>
          </div>
        </div>
      </div>

      <!-- Texto con espacios para completar -->
      <div class="bg-green-50 p-6 rounded-xl text-lg leading-relaxed text-gray-700 mb-8">
        <p class="space-x-2 flex flex-wrap">
          <template v-for="(espacio, index) in espaciosTexto" :key="index">
            <template v-if="espacio.tipo === 'texto'">
              {{ espacio.texto }}
            </template>
            <template v-else>
              <span
                @dragover.prevent
                @drop="soltarPalabra($event, espacio)"
                :class="[getEspacioClase(espacio), pistaActiva && index === indicePista ? 'ring-4 ring-purple-300' : '', 'inline-block min-w-[100px] px-2 py-1 mx-1 align-middle transition-all duration-200']"
              >
                {{ espacio.palabraColocada ? espacio.palabraColocada.texto : '' }}
                <span class="text-sm text-gray-500 ml-1" v-if="!espacio.palabraColocada">
                  ({{ espacio.tipoRequerido }})
                </span>
              </span>
            </template>
          </template>
        </p>
      </div>

      <!-- Modal de resultado o de vidas agotadas -->
      <div v-if="mostrarResultado || mostrarVidasAgotadas" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
        <div class="bg-gradient-to-br from-white to-blue-50 p-10 rounded-3xl max-w-lg shadow-2xl transform animate-bounce-in">
          <!-- Icono de resultado -->
          <div class="text-center mb-6">
            <div v-if="mostrarResultado" class="text-8xl mb-4 animate-bounce-slow">
              {{ aciertos === totalEspacios ? '🎉' : aciertos >= totalEspacios * 0.7 ? '😊' : '😐' }}
            </div>
            <div v-else class="text-6xl mb-4">
              😢
            </div>
          </div>

          <!-- Título -->
          <h3 class="text-3xl font-bold mb-6 text-center" :class="mostrarResultado ? 'text-green-600' : 'text-red-500'">
            {{ mostrarResultado ? '¡Juego Completado!' : '¡Se acabaron las vidas!' }}
          </h3>

          <!-- Resultados detallados -->
          <div v-if="mostrarResultado" class="bg-white rounded-2xl p-6 mb-6 shadow-inner">
            <div class="space-y-4">
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-lg font-semibold text-gray-700">Palabras correctas:</span>
                <span class="text-2xl font-bold text-green-600">{{ aciertos }} / {{ totalEspacios }}</span>
              </div>
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-lg font-semibold text-gray-700">Errores cometidos:</span>
                <span class="text-2xl font-bold text-red-500">{{ errores }}</span>
              </div>
              <div class="flex justify-between items-center border-b pb-3">
                <span class="text-lg font-semibold text-gray-700">Precisión:</span>
                <span class="text-2xl font-bold text-blue-600">{{ Math.round((aciertos / totalEspacios) * 100) }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-700">Vidas restantes:</span>
                <span class="text-2xl">{{ '❤️'.repeat(vidasRestantes) || '💔' }}</span>
              </div>
            </div>

            <!-- Mensaje motivacional -->
            <div class="mt-6 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl text-center">
              <p class="text-lg font-semibold" :class="aciertos === totalEspacios ? 'text-green-700' : aciertos >= totalEspacios * 0.7 ? 'text-blue-700' : 'text-gray-700'">
                {{ aciertos === totalEspacios ? '¡Perfecto! ¡Eres un experto en palabras! 🌟' : 
                   aciertos >= totalEspacios * 0.7 ? '¡Muy bien! ¡Sigue practicando! 💪' : 
                   '¡Buen intento! La práctica hace al maestro 📚' }}
              </p>
            </div>
          </div>

          <!-- Mensaje de vidas agotadas -->
          <div v-else class="bg-red-50 rounded-2xl p-6 mb-6 border-2 border-red-200">
            <p class="text-center text-lg text-gray-700 mb-4">
              Has cometido <span class="font-bold text-red-600">{{ errores }}</span> errores.
            </p>
            <p class="text-center text-md text-gray-600">
              ¡No te preocupes! Intenta nuevamente y recuerda: cada palabra tiene un lugar específico en el texto.
            </p>
          </div>

          <!-- Botones de acción -->
          <div class="flex gap-4 justify-center">
            <!-- Botón de reintentar cuando se agotan las vidas -->
            <button 
              v-if="mostrarVidasAgotadas"
              @click="reiniciarJuego"
              class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
            >
              🔄 Reintentar
            </button>
            
            <!-- Botones cuando se completa el juego exitosamente -->
            <template v-if="mostrarResultado">
              <!-- Botón para siguiente texto si existe -->
              <button 
                v-if="hasNextText"
                @click="irASiguienteTexto"
                class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
              >
                📖 Siguiente Texto
              </button>
              
              <!-- Botón para ver progreso si no hay más textos -->
              <button 
                v-else
                @click="irAMiProgreso"
                class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-lg"
              >
                📊 Ver Mi Progreso
              </button>
              
              <button 
                @click="reiniciarJuego"
                class="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg"
              >
                🔄 Jugar de nuevo
              </button>
            </template>
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
import mascota from './mascota.vue'
import { createGameManager } from '../utils/gameManager'
import { getGame2TextById } from '../data/game2_texts'

export default {
  name: 'GameDragDrop',
  components: { mascota },
  
  // ============================================
  // PROPS
  // ============================================
  props: {
    currentScreen: {
      type: String,
      default: 'dragdrop'
    },
    playerName: {
      type: String,
      default: 'Jugador'
    },
    textId: {
      type: String,
      default: 'drag1',
      description: 'ID del texto para el juego de drag & drop'
    }
  },
  
  // ============================================
  // ESTADO DEL COMPONENTE
  // ============================================
  data() {
    return {
      palabrasPorTipo: null,  // Se cargará desde datos
      espaciosTexto: null,    // Se cargará desde datos
      currentTextData: null,  // Almacena el texto completo
      estadoMascota: 'feliz',
      mensajeMascota: '¡Arrastra las palabras a los espacios correctos del texto! Si te equivocas, perderás una vida.',
      mostrarResultado: false,
      mostrarVidasAgotadas: false,
      aciertos: 0,
      errores: 0,
      erroresJuego: [],       // Array de errores específicos
      vidasMaximas: 4,
      pistaActiva: false,
      indicePista: null,
      palabraActual: null,
      animarError: false,
      animarAcierto: false,
      mensajesAcierto: [
        '¡Perfecto! ¡Muy bien hecho!',
        '¡Excelente! ¡Esa es!',
        '¡Correcto! ¡Sigue así!',
        '¡Genial! ¡Lo estás haciendo muy bien!',
        '¡Bravo! ¡Palabra correcta!'
      ],
      audioContext: null,
      hasNextText: false,
      nextTextId: null
    }
  },
  computed: {
    // Validar que los datos estén cargados
    hasValidData() {
      return this.palabrasPorTipo && this.espaciosTexto && this.currentTextData
    },
    
    totalEspacios() {
      if (!this.espaciosTexto) return 0
      return this.espaciosTexto.filter(e => e.tipo === 'espacio').length
    },
    
    espaciosCompletados() {
      if (!this.espaciosTexto) return 0
      return this.espaciosTexto.filter(e => e.tipo === 'espacio' && e.palabraColocada).length
    },
    
    progreso() {
      if (this.totalEspacios === 0) return 0
      return Math.round((this.espaciosCompletados / this.totalEspacios) * 100)
    },
    
    vidasRestantes() {
      return Math.max(0, this.vidasMaximas - this.errores)
    }
  },
  mounted() {
    // Cargar datos del texto
    this.loadTextData()
    
    // Inicializar AudioContext para sonidos
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
  },
  methods: {
    /**
     * Cargar datos del texto según el textId
     */
    loadTextData() {
      const textData = getGame2TextById(this.textId)
      
      if (!textData) {
        console.error(`Texto ${this.textId} no encontrado`)
        return
      }
      
      // Hacer deep copy para evitar mutaciones del original
      this.currentTextData = JSON.parse(JSON.stringify(textData))
      this.palabrasPorTipo = JSON.parse(JSON.stringify(textData.palabrasPorTipo))
      this.espaciosTexto = JSON.parse(JSON.stringify(textData.espaciosTexto))
    },
    
    playSound(type) {
      if (!this.audioContext) return
      
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      if (type === 'acierto') {
        // Sonido agradable para acierto (Do - Mi - Sol)
        oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime) // Do
        oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1) // Mi
        oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2) // Sol
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.3)
      } else if (type === 'error') {
        // Sonido suave para error
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
        oscillator.type = 'sawtooth'
        oscillator.start(this.audioContext.currentTime)
        oscillator.stop(this.audioContext.currentTime + 0.2)
      }
    },
    getMensajeAleatorio() {
      return this.mensajesAcierto[Math.floor(Math.random() * this.mensajesAcierto.length)]
    },
    getMensajeError(palabra, espacio) {
      const tiposPalabra = {
        'verbo': 'un VERBO',
        'sustantivo': 'un SUSTANTIVO',
        'conector': 'un CONECTOR',
        'adjetivo': 'un ADJETIVO'
      }
      const tipoEsperado = tiposPalabra[espacio.tipoRequerido] || espacio.tipoRequerido
      const tipoPalabra = tiposPalabra[palabra.tipo] || palabra.tipo
      
      if (palabra.tipo === espacio.tipoRequerido) {
        return `"${palabra.texto}" es ${tipoPalabra}, ¡pero no es la palabra correcta para este espacio!`
      } else {
        return `"${palabra.texto}" es ${tipoPalabra}, pero aquí necesitas ${tipoEsperado}. ¡Busca en el contenedor correcto!`
      }
    },
    iniciarArrastre(event, palabra) {
      this.palabraActual = palabra
      event.dataTransfer.setData('text/plain', palabra.id)
    },
    soltarPalabra(event, espacio) {
      event.preventDefault()
      if (!this.palabraActual) return
      if (espacio.palabraColocada) return
      
      const palabra = this.palabraActual
      // Solo es correcto si el id de la palabra es el correcto para ese espacio
      const esCorrecto = palabra.id === espacio.palabraCorrectaId
      
      if (esCorrecto) {
        // Si es correcto, coloca la palabra y suma acierto
        palabra.colocada = true
        espacio.palabraColocada = palabra
        this.aciertos++
        this.animarAcierto = true
        this.playSound('acierto')
        setTimeout(() => { this.animarAcierto = false }, 600)
        
        // Llamar a la mascota directamente (igual que en game 1)
        if (this.$refs.mascota) {
          this.$refs.mascota.showFeedback(this.getMensajeAleatorio(), 'correct')
          this.$refs.mascota.animateMascot('happy')
        }
      } else {
        // Si es incorrecto, NO coloques la palabra, devuélvela al contenedor y resta vida
        palabra.colocada = false
        this.errores++
        this.animarError = true
        this.playSound('error')
        setTimeout(() => { this.animarError = false }, 600)
        
        // Guardar error específico
        this.erroresJuego.push({
          palabraColocada: palabra.texto,
          tipoColocado: palabra.tipo,
          tipoRequerido: espacio.tipoRequerido,
          mensaje: this.getMensajeError(palabra, espacio)
        });
        
        // Llamar a la mascota directamente (igual que en game 1)
        if (this.$refs.mascota) {
          this.$refs.mascota.showFeedback(this.getMensajeError(palabra, espacio), 'incorrect')
          this.$refs.mascota.animateMascot('sad')
        }
        
        if (this.errores > this.vidasMaximas) {
          this.mostrarVidasAgotadas = true
        }
      }
      
      this.pistaActiva = false
      this.indicePista = null
      this.verificarFinJuego()
    },
    getEspacioClase(espacio) {
      if (!espacio.palabraColocada) {
        return 'border-2 border-dashed border-gray-400 bg-white'
      }
      const esCorrecto = espacio.palabraColocada.id === espacio.palabraCorrectaId
      if (esCorrecto) {
        return this.animarAcierto ? 'bg-green-200 border-2 border-green-400 animate-bounce-once' : 'bg-green-200 border-2 border-green-400'
      } else {
        return this.animarError ? 'bg-red-200 border-2 border-red-400 animate-shake-once' : 'bg-red-200 border-2 border-red-400'
      }
    },
    mostrarRetroalimentacion() {
      // No se usa, feedback directo en mensajeMascota
    },
    verificarFinJuego() {
      const totalColocadas = this.espaciosTexto.filter(
        espacio => espacio.tipo === 'espacio' && espacio.palabraColocada
      ).length
      
      if (totalColocadas === this.totalEspacios) {
        this.mostrarResultado = true
        this.estadoMascota = this.aciertos > (this.totalEspacios / 2) ? 'feliz' : 'triste'
        this.mensajeMascota = this.aciertos > (this.totalEspacios / 2) 
          ? '¡Excelente trabajo! ¡Lo has hecho muy bien!' 
          : 'No te preocupes, ¡sigue practicando!'
        
        // Guardar progreso automáticamente al completar
        this.guardarProgresoGame2()
        
        // Verificar si hay más textos disponibles
        this.checkNextText()
      }
    },
    
    /**
     * Verificar si hay un siguiente texto no completado
     */
    checkNextText() {
      const playerName = this.playerName || localStorage.getItem('leo-perfecto-player') || 'anonimo'
      const progressKey = `leo-perfecto-progress-${playerName}`
      const savedProgress = localStorage.getItem(progressKey)
      
      const availableTexts = ['drag1', 'drag2', 'drag3']
      const currentIndex = availableTexts.indexOf(this.textId)
      
      if (savedProgress && currentIndex < availableTexts.length - 1) {
        try {
          const progress = JSON.parse(savedProgress)
          const game2Progress = progress.filter(p => p.gameId === 2)
          const completedTexts = game2Progress.map(p => p.textId)
          
          // Buscar el siguiente texto no completado
          for (let i = currentIndex + 1; i < availableTexts.length; i++) {
            if (!completedTexts.includes(availableTexts[i])) {
              this.nextTextId = availableTexts[i]
              this.hasNextText = true
              return
            }
          }
        } catch (error) {
          console.error('Error al verificar siguiente texto:', error)
        }
      }
      
      this.hasNextText = false
    },
    
    /**
     * Guarda el progreso del Juego 2 usando GameManager
     */
    guardarProgresoGame2() {
      try {
        // Obtener nombre del jugador (de props o de localStorage)
        const playerName = this.playerName || localStorage.getItem('leo-perfecto-player') || 'anonimo'
        
        // Crear GameManager
        const gameManager = createGameManager(playerName)
        
        // Calcular score en porcentaje
        const score = Math.round((this.aciertos / this.totalEspacios) * 100)
        
        // Registrar intento con textId dinámico
        const resultado = gameManager.registrarIntento({
          textId: this.textId, // ID dinámico del texto actual
          gameId: 2, // Juego 2: Clasificar palabras
          correctAnswers: this.aciertos,
          totalQuestions: this.totalEspacios,
          score: score,
          errores: this.erroresJuego // Agregar errores específicos
        })

        if (resultado.success) {
          console.log('✅ Progreso Juego 2 guardado')
          console.log(resultado.mensaje)
          
          if (resultado.mejoro) {
            console.log(`🎉 ¡Mejoraste! +${resultado.diferencia}%`)
          } else if (resultado.empeoro) {
            console.log(`📚 Tu mejor: ${resultado.mejorPrevio}%`)
          }
        }
      } catch (error) {
        console.error('❌ Error al guardar progreso Juego 2:', error)
      }
    },
    mostrarPista() {
      // Encuentra el primer espacio vacío y resáltalo
      const idx = this.espaciosTexto.findIndex(e => e.tipo === 'espacio' && !e.palabraColocada)
      if (idx !== -1) {
        this.pistaActiva = true
        this.indicePista = idx
        this.estadoMascota = 'pensando'
        this.mensajeMascota = '¡Aquí va una pista! Busca la palabra exacta para este espacio.'
      }
    },
    animarEspacio() {
      // Hook para animaciones futuras - ahora se usa directamente en getEspacioClase
    },
    
    // Reinicia el juego volviendo a las reglas
    reiniciarJuego() {
      this.$emit('restart-game2')
    },
    
    // Navega a Mi Progreso después de completar el juego
    irAMiProgreso() {
      this.$emit('continue')
    },
    
    // Ir al siguiente texto disponible
    irASiguienteTexto() {
      if (this.nextTextId) {
        this.$emit('try-next-text', this.nextTextId)
      }
    },
    
    // Método legacy: mantener por compatibilidad
    continuarJuego() {
      if (this.mostrarVidasAgotadas) {
        this.reiniciarJuego()
      } else {
        this.irAMiProgreso()
      }
    }
  }
}
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  25% { transform: translate(-1px, -2px) rotate(-1deg); }
  50% { transform: translate(-3px, 0px) rotate(1deg); }
  75% { transform: translate(2px, 2px) rotate(0deg); }
  100% { transform: translate(1px, 1px) rotate(0deg); }
}

@keyframes shake-once {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

@keyframes heart-break {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    opacity: 0.7;
  }
  100% { 
    transform: scale(0.5) rotate(-10deg);
    opacity: 0.3;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes shake-slow {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Clases de animación */
.animate-bounce {
  animation: bounce 1s ease infinite;
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease;
}

.animate-shake {
  animation: shake 0.5s ease infinite;
}

.animate-shake-once {
  animation: shake-once 0.6s ease;
}

.animate-heart-break {
  animation: heart-break 0.5s ease forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}

.animate-shake-slow {
  animation: shake-slow 1.5s ease infinite;
}
</style>