<template>
  <nav class="w-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg py-4 px-8 flex items-center justify-between rounded-b-3xl" style="min-height: 70px;">
    <div class="flex items-center gap-3 flex-shrink-0">
      <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo Perfecto" class="h-10 w-10" />
      <span class="text-white text-2xl font-bold tracking-wide">Leo Perfecto</span>
    </div>
    <div class="flex items-center gap-6">
      <button 
        v-if="showProgressButton"
        class="text-white font-semibold text-lg bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl transition-colors shadow-md"
        @click="$emit('go-progreso')"
      >
        🏠 Menú Principal
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
    }
  },
  emits: ['go-progreso']
}
</script>

<style scoped>
/* No hay reglas vacías */
</style>
