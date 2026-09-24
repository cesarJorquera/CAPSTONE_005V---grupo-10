<template>
  <div class="text-center space-y-6">
    <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div class="flex justify-center mb-6">
        <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="icono Feliz" class="w-36 h-36" />
      </div>
      
      <h2 class="text-2xl md:text-3xl font-bold text-gray-1000 mb-4">
        <span v-if="!isReturningUser">¡Hola {{playerName}}! 👋</span>
        <span v-else>¡Bienvenido de nuevo, {{playerName}}! 🎉</span>
      </h2>
      
      <!-- Mensaje para usuario nuevo -->
      <div v-if="!isReturningUser" class="bg-green-50 p-6 rounded-xl text-lg text-gray-1500 space-y-3 mb-8">
        <p>¡Bienvenido a nuestra aplicación para mejorar la comprensión lectora!</p>
        <p>Juntos vamos a practicar y desarrollar tus habilidades básicas del lenguaje de una manera divertida e interactiva.</p>
        <p>¿Estás listo para comenzar?</p>
      </div>

      <!-- Mensaje para usuario que regresa -->
      <div v-else class="space-y-4 mb-8">
        <div class="bg-blue-50 p-6 rounded-xl text-lg text-gray-700 space-y-3">
          <p>¡Qué bueno verte de nuevo! He cargado tu progreso anterior.</p>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="font-bold text-gray-800 mb-3">📊 Tu Progreso:</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div class="bg-green-100 p-3 rounded-lg">
                <span class="font-semibold text-green-800">✅ Textos Completados:</span>
                <br>{{ completedTextsCount }} de {{ totalTexts }}
              </div>
              <div v-if="bestScore !== null" class="bg-yellow-100 p-3 rounded-lg">
                <span class="font-semibold text-yellow-800">🏆 Mejor Puntaje:</span>
                <br>{{ bestScore }}%
              </div>
            </div>
          </div>
          <p v-if="nextTextTitle" class="text-blue-700 font-semibold">
            📖 Siguiente: "{{ nextTextTitle }}"
          </p>
        </div>
      </div>
      
      <button 
        @click="$emit('continue')"
        class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
      >
        <span v-if="!isReturningUser">¡Vamos!</span>
        <span v-else>¡Continuar!</span>
      </button>
    </div>
  </div>
</template>

<script>
import { getAllTextIds, getTextById } from '../data/game1_texts'

export default {
  name: 'WelcomeScreen',
  props: {
    playerName: {
      type: String,
      required: true
    },
    userProgress: {
      type: Array,
      default: () => []
    },
    isReturningUser: {
      type: Boolean,
      default: false
    },
    completedTexts: {
      type: Array,
      default: () => []
    },
    nextTextId: {
      type: String,
      default: 'text1'
    }
  },
  computed: {
    completedTextsCount() {
      return this.completedTexts.length
    },
    totalTexts() {
      return getAllTextIds().length
    },
    bestScore() {
      if (!this.userProgress || this.userProgress.length === 0) return null
      return Math.max(...this.userProgress.map(p => p.score))
    },
    nextTextTitle() {
      if (!this.nextTextId) return null
      const nextText = getTextById(this.nextTextId)
      return nextText ? nextText.title : null
    }
  }
}
</script>
