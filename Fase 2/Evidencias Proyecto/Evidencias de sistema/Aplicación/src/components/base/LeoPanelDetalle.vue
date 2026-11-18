<template>
  <!-- UI-05: panel de detalle. En celular sube desde abajo (bottom sheet);
       desde 640px se muestra centrado. Mismo comportamiento accesible que
       ModalConfirmacion: foco dentro, Esc cierra, el foco vuelve al botón que lo abrió. -->
  <teleport to="body">
    <transition name="leo-panel">
      <div
        v-if="abierto"
        class="leo-panel__fondo"
        @click.self="cerrar"
        @keydown="alTeclear"
      >
        <section
          ref="caja"
          class="leo-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="idTitulo"
          data-test="panel-detalle"
        >
          <span class="leo-panel__asa" aria-hidden="true"></span>

          <header class="leo-panel__cabecera">
            <slot name="icono" />
            <div class="leo-panel__titulos">
              <p v-if="antetitulo" class="leo-panel__antetitulo" :style="{ color: colorAntetitulo }">{{ antetitulo }}</p>
              <h2 :id="idTitulo" class="leo-panel__titulo">{{ titulo }}</h2>
            </div>
            <button
              ref="cerrar"
              type="button"
              class="leo-panel__cerrar"
              aria-label="Cerrar"
              data-test="cerrar-panel"
              @click="cerrar"
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15" /></svg>
            </button>
          </header>

          <div class="leo-panel__cuerpo">
            <slot />
          </div>

          <footer v-if="$slots.pie" class="leo-panel__pie">
            <slot name="pie" />
          </footer>
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script>
let contador = 0

export default {
  name: 'LeoPanelDetalle',
  props: {
    abierto: { type: Boolean, default: false },
    titulo: { type: String, required: true },
    antetitulo: { type: String, default: '' },
    colorAntetitulo: { type: String, default: '#1b4f9e' }
  },
  emits: ['cerrar'],
  data() {
    contador += 1
    return {
      idTitulo: `leo-panel-titulo-${contador}`,
      foco: null // elemento que tenía el foco antes de abrir
    }
  },
  watch: {
    abierto: {
      immediate: true,
      handler(abierto) {
        try {
          document.body.style.overflow = abierto ? 'hidden' : ''
        } catch (error) {
          console.warn('No se pudo bloquear el scroll del fondo:', error)
        }
        if (abierto) {
          this.foco = document.activeElement
          this.$nextTick(() => this.$refs.cerrar && this.$refs.cerrar.focus())
        } else if (this.foco && typeof this.foco.focus === 'function') {
          this.foco.focus()
          this.foco = null
        }
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  methods: {
    cerrar() {
      this.$emit('cerrar')
    },
    alTeclear(evento) {
      if (evento.key === 'Escape') {
        evento.stopPropagation()
        this.cerrar()
        return
      }
      if (evento.key !== 'Tab' || !this.$refs.caja) return
      const enfocables = this.$refs.caja.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
      if (!enfocables.length) return
      const primero = enfocables[0]
      const ultimo = enfocables[enfocables.length - 1]
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }
  }
}
</script>

<style scoped>
.leo-panel__fondo {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(20, 35, 59, 0.45);
}
.leo-panel {
  width: 100%;
  max-height: 88vh;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.625rem 1.25rem 1.5rem;
  background: #ffffff;
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -8px 24px rgba(20, 35, 59, 0.12);
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
}
.leo-panel__asa {
  align-self: center;
  width: 2.75rem;
  height: 0.3125rem;
  border-radius: 3px;
  background: #d9e4f1;
}
.leo-panel__cabecera {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}
.leo-panel__titulos { flex: 1; min-width: 0; }
.leo-panel__antetitulo {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.leo-panel__titulo {
  margin: 0.125rem 0 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.375rem;
  line-height: 1.2;
  color: #14233b;
}
.leo-panel__cerrar {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  margin: -0.25rem -0.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: #eef3f9;
  color: #3a4960;
  cursor: pointer;
}
.leo-panel__cerrar:hover { background: #e4ecf5; }
.leo-panel__cerrar:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.leo-panel__cuerpo { display: flex; flex-direction: column; gap: 1rem; }
.leo-panel__pie { padding-top: 0.25rem; }

/* Desde 640px: panel centrado */
@media (min-width: 640px) {
  .leo-panel__fondo { align-items: center; padding: 1.5rem; }
  .leo-panel {
    max-width: 32rem;
    border-radius: 1.5rem;
    padding: 1.5rem 1.75rem 1.75rem;
  }
  .leo-panel__asa { display: none; }
}

/* Entrada: sube (celular) o aparece (escritorio). Se apaga con las preferencias. */
.leo-panel-enter-active, .leo-panel-leave-active { transition: opacity 0.2s ease; }
.leo-panel-enter-active .leo-panel, .leo-panel-leave-active .leo-panel { transition: transform 0.25s ease; }
.leo-panel-enter-from, .leo-panel-leave-to { opacity: 0; }
.leo-panel-enter-from .leo-panel, .leo-panel-leave-to .leo-panel { transform: translateY(2rem); }

@media (prefers-reduced-motion: reduce) {
  .leo-panel-enter-active, .leo-panel-leave-active,
  .leo-panel-enter-active .leo-panel, .leo-panel-leave-active .leo-panel { transition: none; }
}
html[data-animaciones="off"] .leo-panel-enter-active,
html[data-animaciones="off"] .leo-panel-leave-active,
html[data-animaciones="off"] .leo-panel-enter-active .leo-panel,
html[data-animaciones="off"] .leo-panel-leave-active .leo-panel { transition: none; }
</style>
