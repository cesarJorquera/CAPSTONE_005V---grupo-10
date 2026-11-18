<template>
  <!-- UI-05: botón base de la app. Mismo estilo que los botones del login
       (borde inferior más oscuro que se "hunde" al presionar), para que la app
       se vea de una sola pieza. Con `to` es un enlace del router; si no, un <button>. -->
  <router-link
    v-if="to"
    :to="to"
    class="leo-boton"
    :class="clases"
  >
    <slot />
  </router-link>
  <button
    v-else
    :type="type"
    class="leo-boton"
    :class="clases"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'LeoBoton',
  props: {
    /** 'primario' (azul lleno) | 'secundario' (blanco con borde azul) */
    variante: {
      type: String,
      default: 'primario',
      validator: v => ['primario', 'secundario'].includes(v)
    },
    /** 'normal' (52px de alto) | 'compacto' (48px) */
    tamano: {
      type: String,
      default: 'normal',
      validator: v => ['normal', 'compacto'].includes(v)
    },
    /** Ocupa todo el ancho disponible */
    ancho: { type: Boolean, default: false },
    /** Destino del router: lo convierte en enlace */
    to: { type: [String, Object], default: null },
    type: { type: String, default: 'button' }
  },
  computed: {
    clases() {
      return [
        `leo-boton--${this.variante}`,
        `leo-boton--${this.tamano}`,
        { 'leo-boton--ancho': this.ancho }
      ]
    }
  }
}
</script>

<style scoped>
.leo-boton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0 1.75rem;
  border-radius: 0.875rem;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: transform 0.1s ease, border-bottom-width 0.1s ease, filter 0.15s ease, background-color 0.15s ease;
}
.leo-boton--normal { min-height: 3.25rem; font-size: 1.0625rem; }
.leo-boton--compacto { min-height: 3rem; font-size: 1rem; padding: 0 1.25rem; }
.leo-boton--ancho { width: 100%; }

.leo-boton--primario {
  background: #2568c4;
  color: #ffffff;
  border: 0;
  border-bottom: 4px solid #1b4f9e;
}
.leo-boton--primario:hover { filter: brightness(1.05); }

.leo-boton--secundario {
  background: #ffffff;
  color: #1b4f9e;
  border: 2px solid #2568c4;
  border-bottom-width: 4px;
}
.leo-boton--secundario:hover { background: #f3f8fd; }

.leo-boton:active { transform: translateY(3px); border-bottom-width: 1px; }
.leo-boton:focus-visible { outline: 3px solid #14233b; outline-offset: 3px; }
/* UI-07: estado desactivado (botones "Siguiente" y "Ver mi diagnóstico" del test) */
.leo-boton:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }
.leo-boton:disabled:active { transform: none; border-bottom-width: 4px; }

@media (prefers-reduced-motion: reduce) {
  .leo-boton { transition: none; }
  .leo-boton:active { transform: none; }
}
html[data-animaciones="off"] .leo-boton { transition: none; }
html[data-animaciones="off"] .leo-boton:active { transform: none; }
</style>
