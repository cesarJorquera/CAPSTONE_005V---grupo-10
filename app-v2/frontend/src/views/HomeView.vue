<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../services/api.js';

// Comprueba la conexión con la API al cargar — útil para el walking skeleton
// y para la medición de cold-start de la semana 0 (ADR-011).
const estado = ref('comprobando…');

onMounted(async () => {
  const inicio = performance.now();
  try {
    await api.health();
    estado.value = `API conectada (${Math.round(performance.now() - inicio)} ms)`;
  } catch {
    estado.value = 'API no disponible — revisa que el backend esté corriendo';
  }
});
</script>

<template>
  <h1 class="text-2xl font-bold">Bienvenido a Leo Perfecto</h1>
  <p class="mt-2 text-gray-600">
    Plataforma de comprensión lectora con IA acotada y gamificación.
  </p>
  <p class="mt-4 text-sm text-gray-500">Estado de la API: {{ estado }}</p>
</template>
