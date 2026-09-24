<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        ¡Segundo Desafío!
      </h2>

      <!-- Mostrar título del texto actual -->
      <div class="mb-6 text-center">
        <p class="text-lg font-semibold text-purple-600">
          📖 {{ currentTextTitle }}
        </p>
      </div>

      <div class="bg-green-50 p-6 rounded-xl text-lg leading-relaxed text-gray-700 mb-8">
        <div class="mb-6">
          <p class="mb-4">
            El objetivo de este juego es completar el texto con las palabras clave correctas.
          </p>
          <p class="mb-4">
            Arrastra las palabras desde los contenedores hacia los espacios vacíos en el texto:
          </p>
        </div>

        <!-- Contenedores de ejemplo -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="border-2 border-red-400 rounded-xl p-4">
            <h4 class="font-bold text-red-600 mb-2">Verbos</h4>
            <p class="text-sm">Palabras que indican acciones o estados.</p>
            <p class="text-sm italic">Ejemplo: correr, saltar, ser</p>
            <div class="flex gap-2 mt-2">
              <span class="bg-yellow-100 px-3 py-1 rounded">correr</span>
              <span class="bg-yellow-100 px-3 py-1 rounded">saltar</span>
            </div>
          </div>

          <div class="border-2 border-blue-400 rounded-xl p-4">
            <h4 class="font-bold text-blue-600 mb-2">Sustantivos</h4>
            <p class="text-sm">Palabras que nombran personas, lugares, objetos o ideas.</p>
            <p class="text-sm italic">Ejemplo: casa, libro, Harry</p>
            <div class="flex gap-2 mt-2">
              <span class="bg-yellow-100 px-3 py-1 rounded">casa</span>
              <span class="bg-yellow-100 px-3 py-1 rounded">libro</span>
            </div>
          </div>

          <div class="border-2 border-purple-400 rounded-xl p-4">
            <h4 class="font-bold text-purple-600 mb-2">Conectores</h4>
            <p class="text-sm">Palabras que unen ideas o partes de una oración.</p>
            <p class="text-sm italic">Ejemplo: pero, sin embargo, además</p>
            <div class="flex gap-2 mt-2">
              <span class="bg-yellow-100 px-3 py-1 rounded">pero</span>
              <span class="bg-yellow-100 px-3 py-1 rounded">además</span>
            </div>
          </div>

          <div class="border-2 border-green-400 rounded-xl p-4">
            <h4 class="font-bold text-green-600 mb-2">Adjetivos</h4>
            <p class="text-sm">Palabras que describen o califican a los sustantivos.</p>
            <p class="text-sm italic">Ejemplo: grande, bonito, rápido</p>
            <div class="flex gap-2 mt-2">
              <span class="bg-yellow-100 px-3 py-1 rounded">grande</span>
              <span class="bg-yellow-100 px-3 py-1 rounded">rápido</span>
            </div>
          </div>
        </div>

        <!-- Ejemplo visual de drag and drop -->
        <div class="bg-white rounded-xl p-4 mb-6">
          <h4 class="font-bold text-gray-800 mb-2">¿Cómo jugar?</h4>
          <div class="flex items-center justify-center gap-4">
            <div class="border-2 border-dashed border-gray-400 px-3 py-1 rounded">
              contenedor
            </div>
            <span class="text-2xl">→</span>
            <div class="bg-yellow-100 px-3 py-1 rounded">
              <span class="italic">(espacio en el texto)</span>
            </div>
          </div>
          <p class="text-sm text-center mt-2">
            Arrastra las palabras desde los contenedores hacia los espacios vacíos en el texto
          </p>
        </div>

        <p class="text-center font-semibold text-blue-600">
          ¡Diviértete mientras aprendes y clasifica las palabras correctamente!
        </p>
      </div>

      <!-- Botón para empezar -->
      <div class="flex justify-center mt-8">
        <button 
          @click="$emit('continue')"
          class="bg-gradient-to-r from-blue-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
        >
          ¡Comenzar Juego!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getGame2TextById } from '../data/game2_texts'

export default {
  name: 'ReglasGame2',
  props: {
    textId: {
      type: String,
      default: 'drag1'
    }
  },
  computed: {
    currentTextTitle() {
      const text = getGame2TextById(this.textId)
      return text ? text.title : 'Texto no encontrado'
    }
  }
}
</script>