<template>
  <!-- UI-05: Leo con una burbuja de texto corta.
       Al tocar a Leo hace un pequeño saludo (solo al tocar, nunca en bucle);
       se apaga con la preferencia de animaciones y con "reducir movimiento". -->
  <div class="leo-burbuja" :class="`leo-burbuja--${disposicion}`">
    <p class="leo-burbuja__texto" aria-live="polite">{{ mensaje }}</p>
    <button
      type="button"
      class="leo-burbuja__leo"
      :class="{ 'leo-burbuja__leo--saluda': saludando }"
      :style="{ width: tamano + 'px', height: tamano + 'px' }"
      aria-label="Leo, tu guía"
      @click="saludar"
    >
      <!-- UI-09: Leo nuevo (SVG con brazos y piernas). Saluda una vez al aparecer y,
           al tocarlo, hace un gesto distinto cada vez. -->
      <LeoPersonaje
        v-if="!leoAnterior"
        ref="personaje"
        class="leo-burbuja__personaje"
        :estado="estado"
        :tamano="Math.round(tamano * 140 / 165)"
        :animar-al-entrar="saludarAlEntrar"
        decorativo
      />
      <!-- UI-09: imagen anterior de Leo; se conserva para poder volver a ella (leoAnterior = true) -->
      <img
        v-else
        src="@/assets/icons/libro-sin-fondo-feliz.png"
        alt=""
        class="leo-burbuja__img"
        draggable="false"
      />
    </button>
  </div>
</template>

<script>
import LeoPersonaje from './LeoPersonaje.vue'

export default {
  name: 'LeoBurbuja',
  components: { LeoPersonaje },
  props: {
    /** UI-09: estado de Leo (neutro, saluda, piensa, explica, acierto, animo, celebra) */
    estado: { type: String, default: 'saluda' },
    /** UI-09: Leo saluda una vez al aparecer */
    saludarAlEntrar: { type: Boolean, default: true },
    mensaje: { type: String, required: true },
    /** 'arriba' = burbuja sobre Leo (escritorio) | 'lado' = burbuja a la izquierda (celular) */
    disposicion: {
      type: String,
      default: 'arriba',
      validator: v => ['arriba', 'lado'].includes(v)
    },
    tamano: { type: Number, default: 140 }
  },
  emits: ['tocar'],
  data() {
    // UI-09: leoAnterior = true vuelve a la imagen PNG de antes
    return { saludando: false, temporizador: null, leoAnterior: false }
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
  },
  methods: {
    saludar() {
      this.$emit('tocar')
      // UI-09: el Leo nuevo hace un gesto distinto en cada toque
      if (this.$refs.personaje) this.$refs.personaje.reaccionar()
      this.saludando = false
      clearTimeout(this.temporizador)
      // Reiniciar la clase permite repetir el saludo con toques seguidos
      this.$nextTick(() => {
        this.saludando = true
        this.temporizador = setTimeout(() => { this.saludando = false }, 900)
      })
    }
  }
}
</script>

<style scoped>
.leo-burbuja {
  display: flex;
}
.leo-burbuja--arriba {
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}
.leo-burbuja--lado {
  flex-direction: row;
  align-items: flex-end;
  gap: 0.25rem;
}

.leo-burbuja__texto {
  position: relative;
  margin: 0;
  max-width: 16rem;
  padding: 0.75rem 1rem;
  border: 1px solid #d9e4f1;
  border-radius: 1rem;
  background: #f3f8fd;
  color: #14233b;
  font-size: 1rem;
  line-height: 1.4;
  text-align: left;
}
/* Colita de la burbuja, apuntando a Leo */
.leo-burbuja__texto::after {
  content: '';
  position: absolute;
  width: 0.875rem;
  height: 0.875rem;
  background: #f3f8fd;
  transform: rotate(45deg);
}
.leo-burbuja--arriba .leo-burbuja__texto::after {
  right: 3.5rem;
  bottom: -0.5rem;
  border-right: 1px solid #d9e4f1;
  border-bottom: 1px solid #d9e4f1;
}
.leo-burbuja--lado .leo-burbuja__texto {
  flex: 1;
  min-width: 0;
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
}
.leo-burbuja--lado .leo-burbuja__texto::after {
  right: -0.45rem;
  bottom: 0.875rem;
  border-top: 1px solid #d9e4f1;
  border-right: 1px solid #d9e4f1;
}

.leo-burbuja__leo {
  flex-shrink: 0;
  padding: 0;
  border: 0;
  border-radius: 1rem;
  background: transparent;
  cursor: pointer;
}
.leo-burbuja__leo:focus-visible { outline: 3px solid #14233b; outline-offset: 3px; }
/* UI-09: el Leo nuevo se centra en el mismo espacio que ocupaba la imagen */
.leo-burbuja__leo {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.leo-burbuja__personaje { pointer-events: none; }
.leo-burbuja__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.leo-burbuja__leo--saluda .leo-burbuja__img {
  transform-origin: 50% 90%;
  animation: leo-saludo 0.9s ease-in-out;
}
@keyframes leo-saludo {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  20% { transform: rotate(-7deg) translateY(-4px); }
  45% { transform: rotate(6deg) translateY(-6px); }
  70% { transform: rotate(-3deg) translateY(-2px); }
}
@media (prefers-reduced-motion: reduce) {
  .leo-burbuja__leo--saluda .leo-burbuja__img { animation: none; }
}
html[data-animaciones="off"] .leo-burbuja__leo--saluda .leo-burbuja__img { animation: none; }
</style>
