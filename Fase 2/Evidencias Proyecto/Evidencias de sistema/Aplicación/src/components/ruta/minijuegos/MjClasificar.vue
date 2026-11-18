<template>
  <div class="space-y-6">
    <p class="text-xl font-semibold text-gray-800">{{ ejercicio.enunciado }}</p>
    <p class="text-sm text-gray-600">Toca una palabra y después toca la caja donde va.</p>

    <!-- Banco: fichas que todavía no están en una caja -->
    <div class="flex flex-wrap justify-center gap-2 p-3 rounded-xl bg-white shadow">
      <button
        v-for="i in fichasSinUbicar"
        :key="i"
        type="button"
        :class="seleccionada === i
          ? 'px-3 py-2 rounded-xl border-2 border-indigo-600 bg-indigo-100 text-indigo-700 text-lg font-bold'
          : 'px-3 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-800 text-lg font-bold'"
        :aria-pressed="seleccionada === i ? 'true' : 'false'"
        @click="seleccionar(i)"
      >{{ ejercicio.fichas[i].texto }}</button>
      <p v-if="!fichasSinUbicar.length" class="text-gray-500">¡Todas las palabras están en una caja!</p>
    </div>

    <!-- Cajas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div
        v-for="caja in ejercicio.cajas"
        :key="caja.id"
        class="p-3 rounded-xl border-2"
        :class="seleccionada !== null ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white'"
      >
        <button
          type="button"
          class="w-full py-2 text-left text-lg font-bold text-gray-800"
          @click="ubicarEn(caja.id)"
        >
          {{ caja.titulo }}
          <span v-if="seleccionada !== null" class="text-sm font-normal text-indigo-700">· tocar para poner aquí</span>
        </button>
        <div class="flex flex-wrap gap-2 mt-2">
          <button
            v-for="i in fichasEn(caja.id)"
            :key="i"
            type="button"
            class="px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-bold"
            :aria-label="'Sacar ' + ejercicio.fichas[i].texto + ' de la caja'"
            @click="devolver(i)"
          >{{ ejercicio.fichas[i].texto }} ✕</button>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="w-full py-3 rounded-xl text-lg font-bold"
      :class="todasUbicadas ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'"
      :disabled="!todasUbicadas"
      @click="comprobar"
    >Comprobar</button>
  </div>
</template>

<script>
export default {
  name: 'MjClasificar',
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  data() {
    return {
      seleccionada: null, // índice de la ficha tocada, o null
      ubicacion: {} // { índiceFicha: idCaja }
    }
  },
  computed: {
    fichasSinUbicar() {
      return this.ejercicio.fichas
        .map((ficha, i) => i)
        .filter(i => this.ubicacion[i] === undefined)
    },
    todasUbicadas() {
      return this.fichasSinUbicar.length === 0
    }
  },
  methods: {
    seleccionar(i) {
      // Tocar la misma ficha otra vez la deselecciona.
      this.seleccionada = this.seleccionada === i ? null : i
    },
    ubicarEn(idCaja) {
      if (this.seleccionada === null) return
      this.ubicacion[this.seleccionada] = idCaja
      this.seleccionada = null
    },
    devolver(i) {
      delete this.ubicacion[i]
    },
    fichasEn(idCaja) {
      return this.ejercicio.fichas
        .map((ficha, i) => i)
        .filter(i => this.ubicacion[i] === idCaja)
    },
    comprobar() {
      const fichas = this.ejercicio.fichas
      this.$emit('responder', {
        correcta: fichas.every((ficha, i) => this.ubicacion[i] === ficha.caja),
        respuesta: fichas.map((ficha, i) => ({ texto: ficha.texto, caja: this.ubicacion[i] }))
      })
    }
  }
}
</script>