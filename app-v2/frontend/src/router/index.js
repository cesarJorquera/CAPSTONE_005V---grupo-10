import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import EjercicioView from "../views/EjercicioView.vue";
import LoginView from "../views/LoginView.vue";
import { auth } from "../services/auth.js";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "inicio", component: HomeView },
    {
      path: "/ejercicio",
      name: "ejercicio",
      component: EjercicioView,
      meta: { requiresAuth: true },
    },
    { path: "/login", name: "login", component: LoginView },
  ],
});

// Guard mínimo de Sprint 1: si la ruta exige auth y no hay sesión Supabase,
// manda a /login conservando a dónde quería entrar.
router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true;

  const token = await auth.token();
  if (!token) {
    return { name: "login", query: { next: to.fullPath } };
  }

  return true;
});
