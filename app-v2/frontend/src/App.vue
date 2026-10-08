<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { RouterView, RouterLink, useRouter } from "vue-router";
import { auth } from "./services/auth.js";

const router = useRouter();
const logueado = ref(false);
let sub;

onMounted(async () => {
  logueado.value = Boolean(await auth.token());
  const { data } = auth.onChange((v) => {
    logueado.value = v;
  });
  sub = data?.subscription;
});

onUnmounted(() => {
  sub?.unsubscribe();
});

async function salir() {
  await auth.logout();
  router.push("/login");
}
</script>

<template>
  <div class="min-h-screen bg-white text-gray-800">
    <header class="border-b border-gray-200">
      <nav
        class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3"
      >
        <span class="text-lg font-bold text-teal-700">Leo Perfecto</span>
        <div class="flex items-center gap-4 text-sm">
          <RouterLink class="hover:text-teal-700" to="/">Inicio</RouterLink>
          <RouterLink class="hover:text-teal-700" to="/ejercicio">
            Ejercicio
          </RouterLink>
          <RouterLink v-if="!logueado" class="hover:text-teal-700" to="/login">
            Login
          </RouterLink>
          <button
            v-else
            class="hover:text-teal-700"
            type="button"
            @click="salir"
          >
            Salir
          </button>
        </div>
      </nav>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
