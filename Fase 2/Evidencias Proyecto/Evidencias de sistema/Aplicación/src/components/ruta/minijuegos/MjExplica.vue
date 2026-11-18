<template>
  <div class="space-y-6">
    <p class="text-xl leading-relaxed text-gray-800">{{ ejercicio.texto }}</p>
    <RutaOracion
      v-if="ejercicio.palabras"
      :palabras="ejercicio.palabras"
      :resaltadas="ejercicio.evidencia || []"
    />
    <button
      type="button"
      class="w-full py-3 rounded-xl bg-indigo-600 text-white text-lg font-bold"
      @click="continuar"
    >Continuar</button>
  </div>
</template>

<script>
import RutaOracion from '../RutaOracion.vue'

export default {
  name: 'MjExplica',
  components: { RutaOracion },
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  methods: {
    continuar() {
      // "explica" no se evalúa: siempre es correcta y el runner no la guarda.
      this.$emit('responder', { correcta: true, respuesta: null })
    }
  }
}
</script>