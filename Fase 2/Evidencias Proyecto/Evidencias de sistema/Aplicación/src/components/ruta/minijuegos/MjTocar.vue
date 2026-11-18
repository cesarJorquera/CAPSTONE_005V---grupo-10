<template>
  <div class="space-y-6">
    <p class="text-xl font-semibold text-gray-800">{{ ejercicio.enunciado }}</p>

    <div class="flex flex-wrap justify-center gap-2">
      <button
        v-for="(palabra, i) in ejercicio.palabras"
        :key="i"
        type="button"
        :disabled="esPuntuacion(palabra)"
        :class="claseDe(i, palabra)"
        @click="alternar(i)"
      >{{ palabra }}</button>
    </div>

    <button
      type="button"
      class="w-full py-3 rounded-xl text-lg font-bold"
      :class="seleccion.length ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'"
      :disabled="!seleccion.length"
      @click="comprobar"
    >Comprobar</button>
  </div>
</template>

<script>
import { esPuntuacion } from '../texto'

export default {
  name: 'MjTocar',
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  data() {
    return {
      seleccion: []
    }
  },
  methods: {
    esPuntuacion,
    alternar(i) {
      const pos = this.seleccion.indexOf(i)
      if (pos === -1) {
        this.seleccion.push(i)
      } else {
        this.seleccion.splice(pos, 1)
      }
    },
    claseDe(i, palabra) {
      // Clases completas (no concatenadas) para que el purge de Tailwind no las borre.
      if (esPuntuacion(palabra)) return 'text-2xl font-bold text-gray-800 -ml-2'
      if (this.seleccion.includes(i)) {
        return 'px-3 py-2 rounded-xl border-2 border-indigo-600 bg-indigo-100 text-indigo-700 text-2xl font-bold'
      }
      return 'px-3 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-800 text-2xl font-bold'
    },
    comprobar() {
      const correctas = this.ejercicio.correctas
      const esCorrecta = this.seleccion.length === correctas.length &&
        correctas.every(i => this.seleccion.includes(i))
      this.$emit('responder', {
        correcta: esCorrecta,
        respuesta: [...this.seleccion].sort((a, b) => a - b)
      })
    }
  }
}
</script>