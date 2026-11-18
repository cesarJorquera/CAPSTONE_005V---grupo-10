<template>
  <div class="space-y-6">
    <p class="text-xl font-semibold text-gray-800">{{ ejercicio.enunciado }}</p>
    <RutaOracion v-if="ejercicio.palabras" :palabras="ejercicio.palabras" />

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="(opcion, i) in ejercicio.opciones"
        :key="i"
        type="button"
        :class="i === elegida
          ? 'py-3 rounded-xl border-2 border-indigo-600 bg-indigo-100 text-indigo-700 text-xl font-bold'
          : 'py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-800 text-xl font-bold'"
        @click="elegida = i"
      >{{ opcion }}</button>
    </div>

    <button
      type="button"
      class="w-full py-3 rounded-xl text-lg font-bold"
      :class="elegida !== null ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'"
      :disabled="elegida === null"
      @click="comprobar"
    >Comprobar</button>
  </div>
</template>

<script>
import RutaOracion from '../RutaOracion.vue'

export default {
  name: 'MjElegir',
  components: { RutaOracion },
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  data() {
    return {
      elegida: null
    }
  },
  methods: {
    comprobar() {
      this.$emit('responder', {
        correcta: this.elegida === this.ejercicio.correcta,
        respuesta: this.ejercicio.opciones[this.elegida]
      })
    }
  }
}
</script>