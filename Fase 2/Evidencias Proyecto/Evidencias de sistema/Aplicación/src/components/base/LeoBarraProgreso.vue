<template>
  <!-- UI-05: barra de progreso. Siempre va acompañada de un texto visible
       ("3 de 8 pasos"), así que el color no es lo único que informa. -->
  <div
    class="leo-progreso"
    :class="`leo-progreso--${color}`"
    role="progressbar"
    :aria-valuenow="valorSeguro"
    aria-valuemin="0"
    :aria-valuemax="maximo"
    :aria-label="etiqueta"
    :style="{ height: alto + 'px' }"
  >
    <div class="leo-progreso__relleno" :style="{ width: porcentaje + '%' }"></div>
  </div>
</template>

<script>
export default {
  name: 'LeoBarraProgreso',
  props: {
    valor: { type: Number, default: 0 },
    maximo: { type: Number, default: 100 },
    /** azul | verde | ambar */
    color: { type: String, default: 'azul' },
    /** Texto para lectores de pantalla, p. ej. "Avance de la Unidad 1" */
    etiqueta: { type: String, default: 'Avance' },
    alto: { type: Number, default: 8 }
  },
  computed: {
    valorSeguro() {
      return Math.min(Math.max(Number(this.valor) || 0, 0), this.maximo)
    },
    porcentaje() {
      if (!this.maximo) return 0
      return Math.round((this.valorSeguro / this.maximo) * 1000) / 10
    }
  }
}
</script>

<style scoped>
.leo-progreso {
  width: 100%;
  border-radius: 999px;
  background: #dfe8f3;
  overflow: hidden;
}
.leo-progreso__relleno {
  height: 100%;
  border-radius: 999px;
  transition: width 0.5s ease;
}
.leo-progreso--azul .leo-progreso__relleno { background: #2568c4; }
.leo-progreso--verde .leo-progreso__relleno { background: #1f7a47; }
.leo-progreso--ambar .leo-progreso__relleno { background: #b07a00; }

@media (prefers-reduced-motion: reduce) {
  .leo-progreso__relleno { transition: none; }
}
html[data-animaciones="off"] .leo-progreso__relleno { transition: none; }
</style>
