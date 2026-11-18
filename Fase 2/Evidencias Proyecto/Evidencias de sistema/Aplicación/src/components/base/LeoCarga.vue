<template>
  <!-- UI-10: carga con Leo (sonríe, con puntos y nube de pensamiento).
       Variantes: 'pantalla' (ocupa la pantalla), 'superpuesta' (tarjeta sobre la pantalla actual),
       'bloque' (dentro de una sección) y 'linea' (Leo pequeño y una frase).
       Solo aparece si la espera dura más que `retraso` (300 ms): así una carga rápida no destella.
       Con las animaciones apagadas Leo queda quieto y el texto avisa que está cargando. -->
  <div
    v-if="visible"
    class="leo-carga"
    :class="'leo-carga--' + variante"
    role="status"
    aria-live="polite"
    data-test="leo-carga"
  >
    <div class="leo-carga__caja">
      <span class="leo-carga__leo" :style="{ paddingLeft: Math.round(tamanoFinal * 0.24) + 'px' }">
        <LeoPersonaje estado="carga" :tamano="tamanoFinal" decorativo />
      </span>
      <div class="leo-carga__textos">
        <p v-if="titulo" class="leo-carga__titulo" data-test="leo-carga-titulo">{{ titulo }}</p>
        <p class="leo-carga__mensaje">{{ mensaje }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LeoPersonaje from './LeoPersonaje.vue'

const TAMANOS = { pantalla: 132, superpuesta: 112, bloque: 84, linea: 44 }

export default {
  name: 'LeoCarga',
  components: { LeoPersonaje },
  props: {
    mensaje: { type: String, default: 'Cargando…' },
    titulo: { type: String, default: '' },
    variante: {
      type: String,
      default: 'bloque',
      validator: v => ['pantalla', 'superpuesta', 'bloque', 'linea'].includes(v)
    },
    /** ms antes de mostrarse (0 = de inmediato) */
    retraso: { type: Number, default: 300 },
    /** Ancho de Leo en px (por defecto, según la variante) */
    tamano: { type: Number, default: null }
  },
  data() {
    return { visible: this.retraso <= 0, temporizador: null }
  },
  computed: {
    tamanoFinal() {
      return this.tamano || TAMANOS[this.variante]
    }
  },
  mounted() {
    if (!this.visible) this.temporizador = setTimeout(() => { this.visible = true }, this.retraso)
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
  }
}
</script>

<style scoped>
.leo-carga {
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
  animation: leo-carga-entra 0.25s ease-out;
}
.leo-carga__caja { display: flex; align-items: center; gap: 1rem; }
.leo-carga__leo { display: block; flex-shrink: 0; padding-top: 1.25rem; }
.leo-carga__textos { display: flex; flex-direction: column; gap: 0.375rem; min-width: 0; }
.leo-carga__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.3;
  color: #14233b;
}
.leo-carga__mensaje { margin: 0; font-size: 1.0625rem; line-height: 1.5; }

/* Pantalla completa: centrado, Leo arriba */
.leo-carga--pantalla {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e7f0fa;
  text-align: center;
}
.leo-carga--pantalla .leo-carga__caja,
.leo-carga--superpuesta .leo-carga__caja { flex-direction: column; gap: 1.125rem; }
.leo-carga--pantalla .leo-carga__titulo { font-size: 1.625rem; }
.leo-carga--pantalla .leo-carga__mensaje { font-size: 1.125rem; }

/* Sobre la pantalla actual (al abrir un juego) */
.leo-carga--superpuesta {
  position: fixed;
  inset: 0;
  z-index: 55;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(231, 240, 250, 0.88);
  text-align: center;
}
.leo-carga--superpuesta .leo-carga__caja {
  padding: 1.5rem 1.75rem 1.75rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.5rem;
  box-shadow: 0 16px 40px rgba(20, 35, 59, 0.16);
}

/* Dentro de una sección */
.leo-carga--bloque { padding: 1.25rem 0.5rem; }
.leo-carga--bloque .leo-carga__caja { justify-content: center; }

/* Una línea */
.leo-carga--linea .leo-carga__caja { gap: 0.75rem; }
.leo-carga--linea .leo-carga__leo { padding-top: 0.75rem; }

@keyframes leo-carga-entra { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .leo-carga { animation: none; } }
html[data-animaciones="off"] .leo-carga { animation: none; }
</style>
