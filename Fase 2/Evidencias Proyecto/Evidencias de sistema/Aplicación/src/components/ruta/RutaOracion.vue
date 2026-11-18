<template>
  <p class="flex flex-wrap justify-center gap-2 text-2xl font-bold">
    <span
      v-for="(palabra, i) in palabras"
      :key="i"
      :class="[
        resaltadas.includes(i) ? 'bg-indigo-100 text-indigo-700 rounded px-1' : 'text-gray-800',
        esPuntuacion(palabra) ? '-ml-2' : ''
      ]"
    >{{ palabra }}</span>
  </p>
</template>

<script>
import { esPuntuacion } from './texto'

export default {
  name: 'RutaOracion',
  props: {
    palabras: { type: Array, required: true },
    resaltadas: { type: Array, default: () => [] }
  },
  methods: {
    esPuntuacion
  }
}
</script>