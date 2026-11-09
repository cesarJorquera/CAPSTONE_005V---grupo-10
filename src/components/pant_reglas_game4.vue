<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-orange-300">
      
      <!-- Header con Mascota -->
      <div class="flex flex-col items-center mb-8">
        <div class="relative mb-4">
          <div class="absolute inset-0 bg-gradient-to-br from-orange-300 to-amber-400 rounded-full blur-xl opacity-50"></div>
          <LeoPersonaje class="relative z-10" estado="saluda" :tamano="110" animar-al-entrar etiqueta="Leo" />
          <!-- UI-09: imagen anterior de Leo, se conserva para poder volver a ella
          <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo" class="w-32 h-32 relative z-10 drop-shadow-2xl" />
          -->
        </div>
        
        <h1 class="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4 text-center">
          🧠 Trivia de Fundamentos
        </h1>
        
        <p class="text-xl text-gray-700 font-semibold text-center max-w-2xl">
          ¡Pon a prueba tus conocimientos sobre los conceptos básicos de la comprensión lectora!
        </p>
      </div>

      <!-- Mensaje de Leo -->
      <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <div class="bg-gradient-to-br from-orange-400 to-amber-500 rounded-full p-3">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-800 text-lg mb-2">💡 ¿Por qué es importante?</h3>
            <p class="text-gray-700 leading-relaxed">
              Dominar estos conceptos fundamentales te ayudará a comprender mejor cualquier texto que leas. 
              ¡Conocer la teoría es el primer paso para ser un lector experto! 📚
            </p>
          </div>
        </div>
      </div>

      <!-- Reglas del Juego -->
      <div class="space-y-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span class="bg-gradient-to-br from-orange-400 to-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
            📋
          </span>
          ¿Cómo jugar?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Regla 1 -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200 shadow-md">
            <div class="flex items-start gap-3">
              <div class="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 class="font-bold text-gray-800 mb-2">20 Preguntas Conceptuales</h3>
                <p class="text-sm text-gray-700">
                  Responde preguntas sobre conceptos fundamentales: párrafos, ideas principales, 
                  inferencias, vocabulario, conectores y más.
                </p>
              </div>
            </div>
          </div>

          <!-- Regla 2 -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200 shadow-md">
            <div class="flex items-start gap-3">
              <div class="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 class="font-bold text-gray-800 mb-2">4 Alternativas por Pregunta</h3>
                <p class="text-sm text-gray-700">
                  Cada pregunta tiene 4 opciones. Lee con atención y selecciona la respuesta correcta.
                </p>
              </div>
            </div>
          </div>

          <!-- Regla 3 -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200 shadow-md">
            <div class="flex items-start gap-3">
              <div class="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 class="font-bold text-gray-800 mb-2">Explicaciones Educativas</h3>
                <p class="text-sm text-gray-700">
                  Después de cada respuesta, recibirás una explicación detallada del concepto 
                  para reforzar tu aprendizaje.
                </p>
              </div>
            </div>
          </div>

          <!-- Regla 4 -->
          <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-2 border-amber-200 shadow-md">
            <div class="flex items-start gap-3">
              <div class="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 class="font-bold text-gray-800 mb-2">Sin Límite de Tiempo</h3>
                <p class="text-sm text-gray-700">
                  Tómate el tiempo que necesites. Este juego se enfoca en el aprendizaje, 
                  no en la velocidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categorías Cubiertas -->
      <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border-2 border-indigo-200">
        <h3 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
          📚 Temas que aprenderás:
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Conceptos Básicos</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Gramática</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Vocabulario</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Estructura Textual</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Habilidades Lectoras</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Análisis Textual</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Pensamiento Crítico</p>
          </div>
          <div class="bg-white rounded-lg p-3 text-center shadow-sm">
            <p class="text-sm font-semibold text-gray-700">Relaciones Lógicas</p>
          </div>
        </div>
      </div>

      <!-- Consejo Final -->
      <div class="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-5 mb-8 border-2 border-yellow-300">
        <div class="flex items-start gap-3">
          <svg class="w-8 h-8 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
          <div>
            <h3 class="font-bold text-yellow-800 mb-1">💡 Consejo de Leo:</h3>
            <p class="text-sm text-gray-700">
              Lee cada pregunta con atención. Si no conoces la respuesta, intenta razonarla 
              usando lo que ya sabes. ¡Las explicaciones te ayudarán a aprender!
            </p>
          </div>
        </div>
      </div>

      <!-- Botón para Comenzar -->
      <div class="flex justify-center">
        <button 
          @click="$emit('continue')"
          class="group bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center gap-3"
        >
          <svg class="w-8 h-8 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          <span>¡Comenzar Trivia!</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
// UI-09: Leo nuevo en lugar de la imagen PNG (la imagen anterior queda comentada en el template)
import LeoPersonaje from './base/LeoPersonaje.vue'
export default {
  name: 'ReglasGame4',
  components: { LeoPersonaje },
  emits: ['continue']
}
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 0.6s ease-in-out infinite;
}
</style>
