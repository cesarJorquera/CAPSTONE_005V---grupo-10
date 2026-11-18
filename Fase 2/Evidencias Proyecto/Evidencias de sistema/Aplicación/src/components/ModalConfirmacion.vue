<template>
  <div
    v-if="dialogo.abierto"
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
    style="background: rgba(20, 35, 59, 0.55);"
    @click.self="responder(false)"
    @keydown="alTeclear"
  >
    <!-- role alertdialog: avisa a los lectores de pantalla y atrapa el foco mientras está abierto -->
    <div
      ref="caja"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirmacion-titulo"
      aria-describedby="confirmacion-mensaje"
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 text-left"
      style="font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;"
    >
      <h2
        id="confirmacion-titulo"
        class="text-xl font-bold mb-2 text-leo-tinta"
        style="font-family: 'Lexend', system-ui, sans-serif;"
      >
        {{ dialogo.titulo }}
      </h2>
      <p id="confirmacion-mensaje" class="text-base text-leo-texto mb-6">
        {{ dialogo.mensaje }}
      </p>

      <!-- Primero la opción segura (quedarse), con el foco; la que pierde algo, aparte -->
      <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          class="rounded-xl border-2 border-leo-coral text-leo-coral font-semibold px-5 hover:bg-red-50 transition-colors"
          style="min-height: 48px;"
          data-test="confirmar-salida"
          @click="responder(true)"
        >
          {{ dialogo.textoConfirmar }}
        </button>
        <button
          ref="seguro"
          type="button"
          class="rounded-xl bg-leo-azul hover:bg-leo-azul-osc text-white font-semibold px-5 transition-colors"
          style="min-height: 48px;"
          data-test="cancelar-salida"
          @click="responder(false)"
        >
          {{ dialogo.textoCancelar }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { dialogo, responderConfirmacion } from '../utils/confirmarSalida'

export default {
  name: 'ModalConfirmacion',
  data() {
    return {
      dialogo,
      foco: null // elemento que tenía el foco antes de abrir, para devolvérselo al cerrar
    }
  },
  watch: {
    'dialogo.abierto'(abierto) {
      try {
        document.body.style.overflow = abierto ? 'hidden' : ''
      } catch (error) {
        console.warn('No se pudo bloquear el scroll del fondo:', error)
      }
      if (abierto) {
        this.foco = document.activeElement
        this.$nextTick(() => this.$refs.seguro && this.$refs.seguro.focus())
      } else if (this.foco && typeof this.foco.focus === 'function') {
        this.foco.focus()
        this.foco = null
      }
    }
  },
  beforeUnmount() {
    document.body.style.overflow = ''
  },
  methods: {
    responder(confirmo) {
      responderConfirmacion(confirmo)
    },
    // Esc = quedarse. Tab se mantiene dentro del diálogo.
    alTeclear(evento) {
      if (evento.key === 'Escape') {
        evento.stopPropagation()
        this.responder(false)
        return
      }
      if (evento.key !== 'Tab' || !this.$refs.caja) return
      const botones = this.$refs.caja.querySelectorAll('button')
      if (!botones.length) return
      const primero = botones[0]
      const ultimo = botones[botones.length - 1]
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
