<script setup>
import { ref } from 'vue';
import { api } from '../services/api.js';

// Ejemplo de uso del botón de auxilio "Leo IA" (diagrama de secuencia, Propuesta 5).
const consulta = ref('');
const pista = ref(null);
const degradado = ref(false);
const cargando = ref(false);

async function pedir() {
  cargando.value = true;
  pista.value = null;
  degradado.value = false;
  try {
    const data = await api.pedirPista({
      nivel: 'basico',
      fragmento: 'El sol salía detrás de los cerros cuando María despertó.',
      consulta: consulta.value,
    });
    pista.value = data.pista;
  } catch (err) {
    if (err.modoDegradado) degradado.value = true;
    else throw err;
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold">Ejercicio de ejemplo</h1>
  <p class="mt-4 rounded border border-gray-200 p-4">
    El sol salía detrás de los cerros cuando María despertó.
  </p>

  <form class="mt-4 flex gap-2" @submit.prevent="pedir">
    <input
      v-model="consulta"
      required
      maxlength="500"
      placeholder="Pídele una pista a Leo…"
      class="flex-1 rounded border border-gray-300 px-3 py-2"
    />
    <button
      type="submit"
      :disabled="cargando"
      class="rounded bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
    >
      {{ cargando ? 'Pensando…' : 'Pedir pista' }}
    </button>
  </form>

  <p v-if="pista" class="mt-4 rounded bg-teal-50 p-4 text-teal-900">
    <strong>Leo:</strong> {{ pista }}
  </p>
  <p v-if="degradado" class="mt-4 rounded bg-amber-50 p-4 text-amber-900">
    Leo no está disponible ahora, pero puedes seguir ejercitando sin la pista.
  </p>
</template>
