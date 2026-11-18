<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Leo Dash</h1>
        <p class="text-gray-600">Panel de control docente</p>
      </div>
      <button
        type="button"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl transition-colors"
        @click="$emit('volver')"
      >
        ← Volver
      </button>
    </div>

    <!-- Pestañas de secciones (mobile-first con scroll horizontal si es necesario) -->
    <div class="flex border-b border-gray-200 mb-6 overflow-x-auto">
      <button
        type="button"
        class="py-3 px-5 font-bold text-base border-b-2 border-purple-600 text-purple-700 focus:outline-none whitespace-nowrap"
      >
        🎮 Juegos de Aula
      </button>
      <button
        type="button"
        class="py-3 px-5 font-medium text-base text-gray-400 hover:text-gray-600 focus:outline-none whitespace-nowrap cursor-not-allowed"
        disabled
      >
        <!-- UI-10: sin emoji (antes: 👥) -->
        Estudiantes (Próximamente)
      </button>
      <button
        type="button"
        class="py-3 px-5 font-medium text-base text-gray-400 hover:text-gray-600 focus:outline-none whitespace-nowrap cursor-not-allowed"
        disabled
      >
        <!-- UI-10: sin emoji (antes: 📈) -->
        Reportes (Próximamente)
      </button>
    </div>

    <!-- Sección Activa: Juegos de Aula -->
    <div class="space-y-4">
      <div class="bg-white rounded-3xl shadow-md border border-purple-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start sm:items-center gap-4">
          <div class="w-14 h-14 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            💡
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="text-xl font-bold text-gray-800">Leo Ideas</h2>
              <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Control Remoto
              </span>
            </div>
            <p class="text-gray-600 text-sm mt-1">
              Controla la sesión en vivo desde tu celular: abre el lobby, lanza la pregunta y muestra la nube.
            </p>
          </div>
        </div>

        <div class="sm:flex-shrink-0">
          <button
            type="button"
            class="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md text-base"
            data-test="btn-control-leo-ideas"
            @click="$emit('abrir-control-leo-ideas')"
          >
            Abrir Control
          </button>
        </div>
      </div>

      <!-- Sección informativa para el docente -->
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
        <p class="font-bold mb-1">💡 ¿Cómo funciona?</p>
        <p>
          Abre la pantalla de <strong>Leo Aula</strong> en el computador conectado al proyector. Luego, desde este celular en <strong>Leo Dash</strong>, maneja las etapas de la actividad sin moverte de tu puesto.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeoDash',
  emits: ['abrir-control-leo-ideas', 'volver']
}
</script>
