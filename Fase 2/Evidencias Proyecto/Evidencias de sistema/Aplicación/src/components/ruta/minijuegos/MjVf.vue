<template>
  <div class="space-y-6">
    <p class="text-xl font-semibold text-gray-800">{{ ejercicio.enunciado }}</p>
    <RutaOracion v-if="ejercicio.palabras" :palabras="ejercicio.palabras" />
    <p class="p-4 rounded-xl bg-white shadow text-xl text-gray-800">{{ ejercicio.afirmacion }}</p>

    <div class="grid grid-cols-2 gap-3">
      <button type="button" :class="claseDe(true)" @click="elegida = true">Verdadero</button>
      <button type="button" :class="claseDe(false)" @click="elegida = false">Falso</button>
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
  name: 'MjVf',
  components: { RutaOracion },
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  data() {
    return {
      elegida: null // true, false o null (sin elegir)
    }
  },
  methods: {
    claseDe(valor) {
      if (this.elegida === valor) {
        return 'py-3 rounded-xl border-2 border-indigo-600 bg-indigo-100 text-indigo-700 text-xl font-bold'
      }
      return 'py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-800 text-xl font-bold'
    },
    comprobar() {
      this.$emit('responder', {
        correcta: this.elegida === this.ejercicio.correcta,
        respuesta: this.elegida
      })
    }
  }
}
</script>