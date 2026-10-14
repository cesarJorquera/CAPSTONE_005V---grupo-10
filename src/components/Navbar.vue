<template>
  <nav class="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg py-4 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3 rounded-b-3xl" style="min-height: 70px;">
    <div class="flex items-center gap-3 flex-shrink-0">
      <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo Perfecto" class="h-10 w-10" />
      <span class="text-white text-2xl font-bold tracking-wide">Leo Perfecto</span>
    </div>
    <div class="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      <button
        v-if="showProgressButton"
        class="text-white font-semibold text-base sm:text-lg bg-purple-600 hover:bg-purple-700 px-4 sm:px-6 py-2 rounded-xl transition-colors shadow-md"
        @click="$emit('go-progreso')"
      >
        🏠 Menú Principal
      </button>
      <!-- CU-04: solo visible para rol docente (el rol se asigna por SQL) -->
      <button
        v-if="mostrarPanelDocente"
        class="text-blue-700 font-semibold text-base sm:text-lg bg-white hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors shadow-md"
        data-test="panel-docente"
        @click="$emit('go-panel-docente')"
      >
        📊 Panel docente
      </button>
      <!-- CU-03: cerrar sesión -->
      <button
        v-if="sesionIniciada"
        class="text-white font-semibold text-base border-2 border-white hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
        data-test="cerrar-sesion"
        @click="$emit('cerrar-sesion')"
      >
        Salir
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  props: {
    showProgressButton: {
      type: Boolean,
      default: false
    },
    sesionIniciada: {
      type: Boolean,
      default: false
    },
    mostrarPanelDocente: {
      type: Boolean,
      default: false
    }
  },
  emits: ['go-progreso', 'cerrar-sesion', 'go-panel-docente']
}
</script>

<style scoped>
/* No hay reglas vacías */
</style>
