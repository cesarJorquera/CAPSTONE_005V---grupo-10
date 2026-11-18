<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Leo Aula</h1>
        <p class="text-gray-600">Actividades interactivas para proyectar en la sala</p>
      </div>
      <button
        type="button"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors"
        @click="$emit('volver')"
      >
        ← Volver
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Tarjeta: Leo Ideas (Activo) -->
      <div class="bg-white rounded-3xl shadow-lg border-2 border-purple-300 p-6 flex flex-col justify-between hover:shadow-xl transition-all">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 bg-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">
              💡
            </div>
            <span class="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Listo para usar
            </span>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Leo Ideas</h2>
          <p class="text-gray-600 mb-6 text-sm sm:text-base">
            Lluvia de ideas en tiempo real. Proyecta la pregunta y el código QR; tus estudiantes responden desde su celular y las palabras se organizan en vivo.
          </p>
        </div>
        <button
          type="button"
          class="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-2xl transition-colors shadow-md text-lg"
          data-test="btn-proyectar-leo-ideas"
          @click="$emit('abrir-leo-ideas')"
        >
          Abrir Proyector
        </button>
      </div>

      <!-- Tarjeta: Próximamente 1 -->
      <div class="bg-white rounded-3xl shadow-md border border-gray-200 p-6 flex flex-col justify-between opacity-75">
        <div>
          <div class="flex items-center justify-between mb-4">
            <!-- UI-10: Leo en vez del emoji 🎯 (el texto de la tarjeta no cambia) -->
            <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-end justify-center overflow-hidden" aria-hidden="true">
              <LeoPersonaje :tamano="42" quieto decorativo style="margin-bottom: -6px" />
            </div>
            <span class="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Próximamente
            </span>
          </div>
          <h2 class="text-2xl font-bold text-gray-700 mb-2">Trivia en Equipo</h2>
          <p class="text-gray-500 mb-6 text-sm">
            Preguntas rápidas de comprensión lectora para competir de manera colaborativa en grupos.
          </p>
        </div>
        <button
          type="button"
          disabled
          class="w-full bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-2xl cursor-not-allowed"
        >
          <!-- UI-10: texto gris más oscuro para que se lea (antes bg-gray-200 text-gray-400) -->
          Próximamente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import LeoPersonaje from '../base/LeoPersonaje.vue' // UI-10

export default {
  name: 'LeoAula',
  components: { LeoPersonaje },
  emits: ['abrir-leo-ideas', 'volver']
}
</script>
