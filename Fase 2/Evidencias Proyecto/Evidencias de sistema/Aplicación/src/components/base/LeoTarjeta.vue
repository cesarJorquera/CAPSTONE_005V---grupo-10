<template>
  <!-- UI-05: tarjeta base. Fondo blanco, borde fino y esquinas redondeadas,
       sin degradados ni sombras grandes. `apagada` = contenido aún no disponible. -->
  <component :is="como" class="leo-tarjeta" :class="{ 'leo-tarjeta--apagada': apagada }">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'LeoTarjeta',
  props: {
    /** Etiqueta HTML: section, article, div... */
    como: { type: String, default: 'div' },
    apagada: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
.leo-tarjeta {
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.25rem;
  box-shadow: 0 1px 2px rgba(20, 35, 59, 0.05);
}
.leo-tarjeta--apagada {
  background: #f6f8fb;
}
</style>
