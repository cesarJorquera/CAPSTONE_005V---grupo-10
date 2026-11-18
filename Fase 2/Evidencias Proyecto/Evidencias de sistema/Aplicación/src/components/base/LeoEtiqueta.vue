<template>
  <!-- UI-05: etiqueta corta (UNIDAD 1 · LAS PALABRAS, Próximamente...).
       Los tonos tienen texto oscuro sobre fondo claro con contraste AA. -->
  <span class="leo-etiqueta" :class="`leo-etiqueta--${tono}`"><slot /></span>
</template>

<script>
export default {
  name: 'LeoEtiqueta',
  props: {
    /** azul | verde | ambar | gris */
    tono: {
      type: String,
      default: 'azul',
      validator: v => ['azul', 'verde', 'ambar', 'gris'].includes(v)
    }
  }
}
</script>

<style scoped>
.leo-etiqueta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.3;
  white-space: nowrap;
}
.leo-etiqueta--azul { background: #e4f0fb; color: #1b4f9e; }
.leo-etiqueta--verde { background: #e3f3ea; color: #1f6b40; }
.leo-etiqueta--ambar { background: #fff3cf; color: #8a5a00; }
.leo-etiqueta--gris { background: #eef2f7; color: #3a4960; }
</style>
