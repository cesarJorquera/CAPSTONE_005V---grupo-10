<template>
  <div class="min-h-screen bg-sky-100 flex items-center justify-center p-4">
    
    <!-- Ventana flotante de instrucciones -->
    <div class="relative w-full max-w-3xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 animate-slide-up">
      
      <!-- Mascota Leo -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <img 
            src="@/assets/icons/libro-sin-fondo-feliz.png" 
            alt="Leo - Mascota" 
            class="w-32 h-32 animate-bounce-slow"
          />
          <!-- Indicador de habla -->
          <div class="absolute -right-2 top-4 animate-ping">
            <div class="w-4 h-4 bg-blue-500 rounded-full opacity-75"></div>
          </div>
        </div>
      </div>

      <!-- Título -->
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
        Desafío de Comprensión Lectora
      </h2>

      <!-- Diálogo de Leo -->
      <div class="bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 relative">
        <!-- Pico de diálogo -->
        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-blue-200"></div>
        
        <div class="space-y-4">
          <p class="text-lg text-gray-700 leading-relaxed">
            En este desafío pondrás a prueba tu <span class="font-semibold text-indigo-600">comprensión lectora</span>.
          </p>
          
          <p class="text-lg text-gray-700 leading-relaxed">
            Leerás textos cortos y responderás preguntas sobre ellos. Trabajarás estas habilidades:
          </p>
          
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start bg-white/70 p-3 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                </svg>
              </div>
              <span><strong>Identificar ideas principales:</strong> ¿Cuál es el mensaje central del texto?</span>
            </li>
            <li class="flex items-start bg-white/70 p-3 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.025l-2.796 2.796a1 1 0 101.415 1.414l2.796-2.796A4 4 0 1011 5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 text-left"><strong>Hacer inferencias:</strong> ¿Qué se puede deducir de lo que no se dice explícitamente?</div>
            </li>
            <li class="flex items-start bg-white/70 p-3 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span><strong>Analizar propósitos:</strong> ¿Cuál es la intención del autor?</span>
            </li>
            <li class="flex items-start bg-white/70 p-3 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span><strong>Reconocer detalles:</strong> Información específica y precisa del texto</span>
            </li>
            <li class="flex items-start bg-white/70 p-3 rounded-lg">
              <div class="flex-shrink-0 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/>
                </svg>
              </div>
              <span><strong>Causa y efecto:</strong> ¿Qué provocó qué y por qué?</span>
            </li>
          </ul>
          
          <p class="text-lg text-gray-700 leading-relaxed mt-4">
            Lee con <span class="font-semibold text-purple-600">atención</span>, piensa antes de responder y 
            <span class="font-semibold text-green-600">diviértete aprendiendo</span>.
          </p>
        </div>
      </div>

      <!-- Selector de modo -->
      <div class="mb-8">
        <h3 class="text-xl font-bold text-gray-800 mb-4 text-center">
          Elige tu modo de juego:
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Modo Práctica -->
          <button
            @click="seleccionarModo('practica')"
            :class="[
              'p-6 rounded-2xl border-3 transition-all transform hover:scale-105',
              modoSeleccionado === 'practica' 
                ? 'bg-green-400 border-green-600 shadow-xl' 
                : 'bg-white border-gray-300 hover:border-green-400 shadow-md'
            ]"
          >
            <div class="flex justify-center mb-3">
              <svg class="w-12 h-12" :class="modoSeleccionado === 'practica' ? 'text-white' : 'text-green-600'" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
            <h4 :class="[
              'text-xl font-bold mb-2',
              modoSeleccionado === 'practica' ? 'text-white' : 'text-gray-800'
            ]">
              Modo Práctica
            </h4>
            <p :class="[
              'text-sm',
              modoSeleccionado === 'practica' ? 'text-white/90' : 'text-gray-600'
            ]">
              Sin límite de tiempo. Perfecto para aprender y mejorar sin presión.
            </p>
            <div v-if="modoSeleccionado === 'practica'" class="mt-3 flex items-center justify-center text-white font-bold">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Seleccionado
            </div>
          </button>

          <!-- Modo Desafío -->
          <button
            @click="seleccionarModo('desafio')"
            :class="[
              'p-6 rounded-2xl border-3 transition-all transform hover:scale-105',
              modoSeleccionado === 'desafio' 
                ? 'bg-green-400 border-green-600 shadow-xl' 
                : 'bg-white border-gray-300 hover:border-orange-400 shadow-md'
            ]"
          >
            <div class="flex justify-center mb-3">
              <svg class="w-12 h-12" :class="modoSeleccionado === 'desafio' ? 'text-white' : 'text-orange-600'" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h4 :class="[
              'text-xl font-bold mb-2',
              modoSeleccionado === 'desafio' ? 'text-white' : 'text-gray-800'
            ]">
              Modo Desafío
            </h4>
            <p :class="[
              'text-sm mb-2',
              modoSeleccionado === 'desafio' ? 'text-white/90' : 'text-gray-600'
            ]">
              <span class="font-semibold">1:30 minutos</span> - ¿Cuántos textos puedes completar a tiempo?
            </p>
            <div v-if="modoSeleccionado === 'desafio'" class="mt-3 flex items-center justify-center text-white font-bold">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              Seleccionado
            </div>
          </button>

        </div>
      </div>

      <!-- Botón continuar -->
      <div class="text-center">
        <button
          @click="iniciarJuego"
          :disabled="!modoSeleccionado"
          :class="[
            'px-10 py-4 rounded-full font-bold text-xl shadow-xl transition-all transform inline-flex items-center',
            modoSeleccionado
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ modoSeleccionado ? 'Comenzar' : 'Selecciona un modo' }}
          <svg v-if="modoSeleccionado" class="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'InstruccionesGame3',
  data() {
    return {
      modoSeleccionado: null // 'practica' o 'desafio'
    };
  },
  methods: {
    seleccionarModo(modo) {
      this.modoSeleccionado = modo;
    },
    iniciarJuego() {
      if (this.modoSeleccionado) {
        this.$emit('iniciar', this.modoSeleccionado);
      }
    }
  }
};
</script>

<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}
</style>
