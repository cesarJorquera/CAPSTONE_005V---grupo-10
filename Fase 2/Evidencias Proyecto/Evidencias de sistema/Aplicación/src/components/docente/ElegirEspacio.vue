<template>
  <div class="max-w-3xl mx-auto px-4 py-6 text-center">
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Elegir espacio</h1>
      <p class="text-lg text-gray-600">
        {{ saludoDocente }} ¿Dónde vas a trabajar hoy?
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
      <!-- Opción 1: Leo Aula -->
      <div class="bg-white rounded-3xl shadow-lg border border-purple-100 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-shadow">
        <div>
          <div class="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-3xl mb-4">
            📽️
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Leo Aula</h2>
          <p class="text-gray-600 mb-6">
            Para la pantalla grande de la sala. Proyecta actividades interactivas en tiempo real para tus estudiantes.
          </p>
        </div>
        <button
          type="button"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-md text-lg"
          data-test="btn-leo-aula"
          @click="$emit('elegir-aula')"
        >
          Entrar a Leo Aula
        </button>
      </div>

      <!-- Opción 2: Leo Dash -->
      <div class="bg-white rounded-3xl shadow-lg border border-blue-100 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-shadow">
        <div>
          <div class="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-3xl mb-4">
            📱
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Leo Dash</h2>
          <p class="text-gray-600 mb-6">
            Para tu celular o computador. Controla la actividad en vivo y administra tus sesiones de clase.
          </p>
        </div>
        <button
          type="button"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-md text-lg"
          data-test="btn-leo-dash"
          @click="$emit('elegir-dash')"
        >
          Entrar a Leo Dash
        </button>
      </div>
    </div>

    <div>
      <button
        type="button"
        class="text-gray-600 hover:text-gray-800 font-semibold py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-100 transition-colors"
        @click="$emit('volver')"
      >
        ← Volver al modo estudiante
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElegirEspacio',
  props: {
    nombreDocente: {
      type: String,
      default: ''
    }
  },
  emits: ['elegir-aula', 'elegir-dash', 'volver'],
  computed: {
    saludoDocente() {
      return this.nombreDocente ? `Hola, ${this.nombreDocente}.` : 'Hola, docente.'
    }
  }
}
</script>
