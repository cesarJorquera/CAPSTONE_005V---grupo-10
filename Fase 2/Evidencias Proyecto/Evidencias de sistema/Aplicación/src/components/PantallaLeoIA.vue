<template>
  <!-- UI-04: sección LeoIA. El asistente (AsistenteIA.vue) antes iba en medio de Inicio; ahora tiene su pantalla.
       UI-07: sin el fondo con degradado; usa el fondo plano de la app (bg-leo-fondo, en App.vue)
       y el ancho lo maneja AsistenteIA, igual que Inicio y Progreso. -->
  <!-- Contenedor anterior (UI-04), reemplazado en UI-07:
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <AsistenteIA />
    </div>
  </div>
  -->
  <AsistenteIA :nombre="playerName" />
</template>

<script>
import AsistenteIA from './AsistenteIA.vue'

export default {
  name: 'PantallaLeoIA',
  components: { AsistenteIA },
  props: {
    // UI-07: para que Leo salude por el nombre
    playerName: { type: String, default: '' }
  }
}
</script>
