<script setup>
import { ref, computed } from "vue";
import { api } from "../services/api.js";
import { casos, obtenerCasoPorId } from "../data/casos.js";

// Estado del caso seleccionado
const casoSeleccionado = ref(casos[0].id);
const casoActual = computed(() => obtenerCasoPorId(casoSeleccionado.value));

// Estado de la consulta a Leo
const consulta = ref("");
const pista = ref(null);
const degradado = ref(false);
const cargando = ref(false);

// Cambiar de caso
function seleccionarCaso(id) {
  casoSeleccionado.value = id;
  consulta.value = "";
  pista.value = null;
  degradado.value = false;
}

// Pedir pista a Leo IA
async function pedir() {
  if (!consulta.value.trim()) return;

  cargando.value = true;
  pista.value = null;
  degradado.value = false;

  try {
    const data = await api.pedirPista({
      nivel: "basico",
      fragmento: casoActual.value.fragmento,
      consulta: `[Caso: ${casoActual.value.titulo}] ${consulta.value}`,
    });
    pista.value = data.pista;
  } catch (err) {
    if (err.modoDegradado) {
      degradado.value = true;
    } else {
      console.error("Error al pedir pista:", err);
      degradado.value = true;
    }
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <!-- Encabezado -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Ejercicio de Comprensión Lectora
      </h1>
      <p class="mt-2 text-gray-600">
        Lee el caso técnico y pídele pistas a Leo si tienes dudas.
      </p>
    </header>

    <!-- Selector de casos -->
    <div class="mb-6 flex flex-wrap gap-3">
      <button
        v-for="caso in casos"
        :key="caso.id"
        @click="seleccionarCaso(caso.id)"
        :class="[
          'rounded-lg px-4 py-3 text-left transition-colors',
          casoSeleccionado === caso.id
            ? 'bg-teal-700 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
      >
        <p class="text-xs font-medium opacity-75">{{ caso.carrera }}</p>
        <p class="font-semibold">{{ caso.titulo }}</p>
      </button>
    </div>

    <!-- Texto del caso -->
    <article class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center gap-2">
        <span
          class="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800"
        >
          {{ casoActual.carrera }}
        </span>
      </div>

      <h2 class="mb-4 text-xl font-bold text-gray-900">
        {{ casoActual.titulo }}
      </h2>

      <div class="prose prose-gray max-w-none">
        <p
          v-for="(parrafo, index) in casoActual.fragmento.split('\n\n')"
          :key="index"
          class="mb-4 leading-relaxed text-gray-700"
        >
          {{ parrafo }}
        </p>
      </div>
    </article>

    <!-- Preguntas guía -->
    <section class="mt-6 rounded-xl bg-gray-50 p-6">
      <h3 class="mb-3 font-semibold text-gray-900">
        Preguntas para reflexionar:
      </h3>
      <ul class="list-inside list-disc space-y-1 text-gray-700">
        <li v-for="(pregunta, index) in casoActual.preguntasGuia" :key="index">
          {{ pregunta }}
        </li>
      </ul>
    </section>

    <!-- Consulta a Leo -->
    <section class="mt-6 rounded-xl border-2 border-teal-200 bg-teal-50 p-6">
      <h3 class="mb-3 flex items-center gap-2 font-semibold text-teal-900">
        <span class="text-2xl">🦁</span>
        Pregúntale a Leo
      </h3>

      <p class="mb-4 text-sm text-teal-700">
        Leo te dará pistas para que encuentres la respuesta por ti mismo. Nunca
        te dará la respuesta directa.
      </p>

      <form class="flex flex-col gap-3 sm:flex-row" @submit.prevent="pedir">
        <input
          v-model="consulta"
          type="text"
          required
          maxlength="500"
          placeholder="Escribe tu duda sobre el texto…"
          class="flex-1 rounded-lg border border-teal-300 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
        <button
          type="submit"
          :disabled="cargando"
          class="rounded-lg bg-teal-700 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
        >
          {{ cargando ? "Pensando…" : "Pedir pista" }}
        </button>
      </form>

      <!-- Respuesta de Leo -->
      <div
        v-if="pista"
        class="mt-4 rounded-lg border border-teal-300 bg-white p-4"
      >
        <p class="font-medium text-teal-900">
          <span class="mr-2">🦁</span>
          <strong>Leo dice:</strong>
        </p>
        <p class="mt-2 text-gray-700">{{ pista }}</p>
      </div>

      <!-- Modo degradado -->
      <div
        v-if="degradado"
        class="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4"
      >
        <p class="text-amber-800">
          <strong>Leo no está disponible ahora.</strong>
          Puedes seguir leyendo y responder las preguntas por tu cuenta. Intenta
          de nuevo más tarde.
        </p>
      </div>
    </section>

    <!-- Botón para volver -->
    <div class="mt-8 text-center">
      <router-link
        to="/"
        class="inline-block rounded-lg bg-gray-200 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-300"
      >
        ← Volver al inicio
      </router-link>
    </div>
  </div>
</template>
