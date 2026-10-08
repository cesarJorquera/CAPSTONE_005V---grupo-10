<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "../services/auth.js";
import { api } from "../services/api.js";

const email = ref("");
const password = ref("");
const cargando = ref(false);
const error = ref("");
const userId = ref("");

const route = useRoute();
const router = useRouter();

async function entrar() {
  error.value = "";
  userId.value = "";
  cargando.value = true;

  try {
    await auth.login(email.value, password.value);
    const me = await api.me();
    userId.value = me.user.id;

    await router.push(String(route.query.next || "/ejercicio"));
  } catch {
    error.value =
      "No se pudo iniciar sesión. Revisa email, password y que el backend esté corriendo.";
  } finally {
    cargando.value = false;
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold">Iniciar sesión</h1>

  <form class="mt-6 max-w-sm space-y-4" @submit.prevent="entrar">
    <label class="block text-sm">
      Email
      <input
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
      />
    </label>

    <label class="block text-sm">
      Password
      <input
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="mt-1 w-full rounded border border-gray-300 px-3 py-2"
      />
    </label>

    <button
      type="submit"
      :disabled="cargando"
      class="rounded bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
    >
      {{ cargando ? "Entrando…" : "Entrar" }}
    </button>
  </form>

  <p v-if="error" class="mt-4 text-sm text-red-700">{{ error }}</p>
  <p v-if="userId" class="mt-4 text-sm text-green-700">
    Sesión válida. Usuario: {{ userId }}
  </p>
</template>
