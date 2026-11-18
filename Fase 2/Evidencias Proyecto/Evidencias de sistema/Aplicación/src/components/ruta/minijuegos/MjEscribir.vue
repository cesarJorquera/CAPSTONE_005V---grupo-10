<template>
  <div class="space-y-6">
    <p class="text-xl font-semibold text-gray-800">{{ ejercicio.enunciado }}</p>
    <RutaOracion :palabras="ejercicio.palabras" />

    <input
      v-model="texto"
      type="text"
      class="w-full p-3 rounded-xl border-2 border-gray-300 text-xl text-gray-800 focus:border-indigo-600 focus:outline-none"
      placeholder="Escribe aquí"
      aria-label="Tu respuesta"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      @keyup.enter="comprobar"
    >

    <button
      type="button"
      class="w-full py-3 rounded-xl text-lg font-bold"
      :class="texto.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'"
      :disabled="!texto.trim()"
      @click="comprobar"
    >Comprobar</button>
  </div>
</template>

<script>
import RutaOracion from '../RutaOracion.vue'

// Minúsculas, sin signos de puntuación y sin espacios de sobra.
function normalizar(texto) {
  return texto.trim().toLowerCase().replace(/[.,;:!?¡¿"]/g, '').replace(/\s+/g, ' ')
}

// Quita solo las tildes (á→a) y la diéresis (ü→u). La ñ se mantiene.
function sinTildes(texto) {
  return texto.normalize('NFD').replace(/[\u0301\u0308]/g, '').normalize('NFC')
}

export default {
  name: 'MjEscribir',
  components: { RutaOracion },
  props: {
    ejercicio: { type: Object, required: true }
  },
  emits: ['responder'],
  data() {
    return {
      texto: ''
    }
  },
  methods: {
    comprobar() {
      if (!this.texto.trim()) return
      const esperada = normalizar(this.ejercicio.palabras[this.ejercicio.correcta])
      const escrita = normalizar(this.texto)
      const exacta = escrita === esperada
      const soloFaltaTilde = !exacta && sinTildes(escrita) === sinTildes(esperada)
      this.$emit('responder', {
        correcta: exacta || soloFaltaTilde,
        respuesta: this.texto,
        ortografia: soloFaltaTilde ? 'tilde' : null
      })
    }
  }
}
</script>