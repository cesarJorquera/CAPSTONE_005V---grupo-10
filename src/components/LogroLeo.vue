<template>
  <!-- UI-09: logro grande. Leo entra, se pone las gafas de sol y levanta el pulgar; luego aparece
       la tarjeta con la felicitación. Se cierra con "Continuar", tocando fuera o con Esc.
       Con las animaciones apagadas se muestra quieto. -->
  <teleport to="body">
    <div class="logro" data-test="logro" @click.self="cerrar">
      <div
        class="logro__dialogo"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logro-titulo"
        aria-describedby="logro-cuerpo"
      >
        <div class="logro__escena">
          <LeoPersonaje estado="logro" :tamano="168" :chispas="logro.chispas" animar-al-entrar />
          <span class="logro__sombra" aria-hidden="true"></span>
        </div>
        <div class="logro__texto">
          <LeoEtiqueta :tono="logro.tono" data-test="logro-etiqueta">{{ logro.etiqueta }}</LeoEtiqueta>
          <h2 id="logro-titulo" class="logro__titulo" data-test="logro-titulo">{{ logro.titulo }}</h2>
          <p id="logro-cuerpo" class="logro__cuerpo">{{ logro.cuerpo }}</p>
          <button ref="continuar" type="button" class="logro__continuar" data-test="logro-continuar" @click="cerrar">Continuar</button>
          <span class="logro__nota">También puedes tocar fuera o presionar Esc para cerrar.</span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import LeoPersonaje from './base/LeoPersonaje.vue'
import LeoEtiqueta from './base/LeoEtiqueta.vue'

export default {
  name: 'LogroLeo',
  components: { LeoPersonaje, LeoEtiqueta },
  props: {
    /** { id, tono, etiqueta, titulo, cuerpo, chispas } (ver utils/logrosLeo.js) */
    logro: { type: Object, required: true }
  },
  emits: ['cerrar'],
  data() {
    return { focoAnterior: null, overflowAnterior: '' }
  },
  mounted() {
    this.focoAnterior = document.activeElement
    this.overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', this.alTeclado)
    this.$nextTick(() => this.$refs.continuar && this.$refs.continuar.focus())
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.alTeclado)
    document.body.style.overflow = this.overflowAnterior
    if (this.focoAnterior && this.focoAnterior.focus) this.focoAnterior.focus()
  },
  methods: {
    alTeclado(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        this.cerrar()
      } else if (e.key === 'Tab') {
        // Un solo botón: el foco se queda dentro del diálogo
        e.preventDefault()
        if (this.$refs.continuar) this.$refs.continuar.focus()
      }
    },
    cerrar() {
      this.$emit('cerrar')
    }
  }
}
</script>

<style scoped>
.logro {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(20, 35, 59, 0.62);
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  animation: logro-fondo 0.25s ease-out;
}
.logro__dialogo {
  width: 100%;
  max-width: 26rem;
  max-height: 100%;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 48px rgba(10, 20, 40, 0.35);
}
.logro__escena {
  position: relative;
  height: 14.75rem;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.125rem;
  box-sizing: border-box;
  background: #e4f0fb;
  overflow: hidden;
}
.logro__escena :deep(svg) { position: relative; z-index: 1; }
.logro__sombra {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  width: 5rem;
  height: 0.75rem;
  margin-left: -2.5rem;
  border-radius: 50%;
  background: #c9daef;
}
.logro__texto {
  padding: 1.375rem 1.375rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  animation: logro-tarjeta 0.4s ease-out 1.25s both;
}
.logro__texto > :first-child { align-self: flex-start; }
.logro__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.25;
  color: #14233b;
}
.logro__cuerpo { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #3a4960; }
.logro__continuar {
  margin-top: 0.375rem;
  min-height: 3.25rem;
  border: 0;
  border-radius: 0.875rem;
  background: #2568c4;
  color: #ffffff;
  font-family: inherit;
  font-size: 1.0625rem;
  font-weight: 700;
  cursor: pointer;
}
.logro__continuar:hover { background: #1b4f9e; }
.logro__continuar:focus-visible { outline: 3px solid #14233b; outline-offset: 3px; }
.logro__nota { font-size: 0.875rem; color: #52627a; text-align: center; }

@keyframes logro-fondo { from { opacity: 0; } to { opacity: 1; } }
@keyframes logro-tarjeta { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@media (prefers-reduced-motion: reduce) {
  .logro, .logro__texto { animation: none; }
}
html[data-animaciones="off"] .logro,
html[data-animaciones="off"] .logro__texto { animation: none; }
</style>
