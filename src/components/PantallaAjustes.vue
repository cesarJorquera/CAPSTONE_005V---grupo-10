<template>
  <!-- UI-08: sección Ajustes. Reemplaza la pantalla provisional de UI-03 (SeccionEnConstruccion).
       Dos bloques: "Tu perfil" (solo lectura, datos de Google y Supabase) y "Preferencias"
       (sonidos y animaciones). Las preferencias se guardan solo en este dispositivo
       (localStorage, utils/preferencias.js); pasarlas a Supabase queda para quien ve la base de datos.
       Salir sigue siendo una opción del menú, no se repite aquí. -->
  <div class="ajustes">
    <header>
      <h1 class="ajustes__titulo">Ajustes</h1>
      <p class="ajustes__bajada">Tu perfil y cómo prefieres usar la app.</p>
    </header>

    <div class="ajustes__fila">
      <!-- Tu perfil (solo lectura) -->
      <LeoTarjeta como="section" class="bloque" aria-labelledby="perfil-titulo" data-test="perfil">
        <h2 id="perfil-titulo" class="bloque__titulo">Tu perfil</h2>
        <div class="perfil__cabecera">
          <span class="perfil__inicial" aria-hidden="true">{{ letra }}</span>
          <div class="perfil__datos">
            <p class="perfil__nombre" data-test="perfil-nombre">{{ nombreCompleto }}</p>
            <p v-if="correo" class="perfil__correo" data-test="perfil-correo">{{ correo }}</p>
            <LeoEtiqueta :tono="esDocente ? 'ambar' : 'azul'" class="perfil__rol" data-test="perfil-rol">{{ esDocente ? 'Docente' : 'Alumno' }}</LeoEtiqueta>
          </div>
        </div>
        <p class="nota">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M8 12 L11 15 L16 9" /></svg>
          Cuenta conectada con Google. Tu nombre y tu correo vienen de ahí.
        </p>
      </LeoTarjeta>

      <!-- Preferencias -->
      <LeoTarjeta como="section" class="bloque" aria-labelledby="pref-titulo" data-test="preferencias">
        <h2 id="pref-titulo" class="bloque__titulo">Preferencias</h2>

        <ul class="preferencias">
          <li class="preferencia" data-test="pref-sonidos">
            <div class="preferencia__fila">
              <span class="icono" style="background: #e4f0fb">
                <svg viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.sonido" /></svg>
              </span>
              <div class="preferencia__textos">
                <p id="pref-sonidos-nombre" class="preferencia__nombre">Sonidos de la app</p>
                <p id="pref-sonidos-desc" class="preferencia__desc">La bienvenida al entrar y los sonidos al tocar en Inicio. No cambia el audio de los textos (Lectura Viva).</p>
                <p class="preferencia__estado" :class="{ 'preferencia__estado--on': sonidos }" data-test="estado-sonidos">{{ sonidos ? 'Activado' : 'Desactivado' }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="interruptor"
                :class="{ 'interruptor--on': sonidos }"
                :aria-checked="sonidos ? 'true' : 'false'"
                aria-labelledby="pref-sonidos-nombre"
                aria-describedby="pref-sonidos-desc"
                data-test="switch-sonidos"
                @click="alternarSonidos"
              >
                <span class="interruptor__pista"><span class="interruptor__perilla"></span></span>
              </button>
            </div>
          </li>

          <li class="preferencia" data-test="pref-animaciones">
            <div class="preferencia__fila">
              <span class="icono" style="background: #e3f3ea">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.animaciones" /></svg>
              </span>
              <div class="preferencia__textos">
                <p id="pref-anim-nombre" class="preferencia__nombre">Animaciones</p>
                <p id="pref-anim-desc" class="preferencia__desc">Movimientos suaves al tocar botones y al entrar a una sección.</p>
                <p class="preferencia__estado" :class="{ 'preferencia__estado--on': animacionesVisibles }" data-test="estado-animaciones">{{ animacionesVisibles ? 'Activado' : 'Desactivado' }}</p>
              </div>
              <button
                type="button"
                role="switch"
                class="interruptor"
                :class="{ 'interruptor--on': animacionesVisibles }"
                :aria-checked="animacionesVisibles ? 'true' : 'false'"
                :disabled="sistemaReduce"
                aria-labelledby="pref-anim-nombre"
                aria-describedby="pref-anim-desc"
                data-test="switch-animaciones"
                @click="alternarAnimaciones"
              >
                <span class="interruptor__pista"><span class="interruptor__perilla"></span></span>
              </button>
            </div>
            <p v-if="sistemaReduce" class="preferencia__aviso" data-test="aviso-movimiento">
              Tu dispositivo ya pide reducir el movimiento, así que las animaciones quedan apagadas. Puedes cambiarlo en la accesibilidad de tu dispositivo.
            </p>
          </li>
        </ul>

        <div class="ajustes__pie">
          <p class="nota">
            <svg viewBox="0 0 24 24" fill="none" stroke="#52627a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3 H18 V21 H6 Z M10 18 H14" /></svg>
            Se guardan solo en este dispositivo.
          </p>
          <LeoBoton variante="secundario" tamano="compacto" class="ajustes__restablecer" data-test="restablecer" @click="restablecer">Restablecer preferencias</LeoBoton>
        </div>
        <p v-if="restablecido" class="ajustes__listo" role="status" data-test="restablecido">Listo: volviste a los valores de siempre.</p>
      </LeoTarjeta>
    </div>
  </div>
</template>

<script>
import LeoTarjeta from './base/LeoTarjeta.vue'
import LeoEtiqueta from './base/LeoEtiqueta.vue'
import LeoBoton from './base/LeoBoton.vue'
import { inicial } from '../utils/nombre'
import {
  sonidosActivos,
  cambiarSonidos,
  animacionesGuardadas,
  cambiarAnimaciones,
  restablecerPreferencias
} from '../utils/preferencias'

const ICONOS = {
  sonido: 'M4 9 H8 L13 5 V19 L8 15 H4 Z M16.5 9 C17.8 10.5 17.8 13.5 16.5 15 M19 6.5 C21.6 9.5 21.6 14.5 19 17.5',
  animaciones: 'M5 19 C9 19 9 5 13 5 M13 5 L11 3 M13 5 L11 7 M15 12 H20 M15 16 H19 M15 8 H18'
}

const REDUCIR_MOVIMIENTO = '(prefers-reduced-motion: reduce)'

export default {
  name: 'PantallaAjustes',
  components: { LeoTarjeta, LeoEtiqueta, LeoBoton },
  props: {
    playerName: { type: String, default: '' },
    correo: { type: String, default: '' },
    esDocente: { type: Boolean, default: false }
  },
  data() {
    return {
      ICONOS,
      sonidos: sonidosActivos(),
      animaciones: animacionesGuardadas(),
      sistemaReduce: false,
      consultaMovimiento: null,
      restablecido: false
    }
  },
  computed: {
    nombreCompleto() {
      return this.playerName || 'Tu cuenta'
    },
    letra() {
      return inicial(this.playerName) || '?'
    },
    // Si el dispositivo pide reducir movimiento, la app ya las apaga (preferencias.js)
    animacionesVisibles() {
      return this.animaciones && !this.sistemaReduce
    }
  },
  mounted() {
    try {
      this.consultaMovimiento = window.matchMedia(REDUCIR_MOVIMIENTO)
      this.sistemaReduce = this.consultaMovimiento.matches
      this.consultaMovimiento.addEventListener('change', this.alCambiarMovimiento)
    } catch (error) {
      console.warn('No se pudo leer la preferencia de movimiento del sistema:', error)
    }
  },
  beforeUnmount() {
    if (this.consultaMovimiento) this.consultaMovimiento.removeEventListener('change', this.alCambiarMovimiento)
  },
  methods: {
    alCambiarMovimiento(evento) {
      this.sistemaReduce = evento.matches
    },
    // El cambio se aplica al tiro, sin botón "Guardar"
    alternarSonidos() {
      this.sonidos = !this.sonidos
      cambiarSonidos(this.sonidos)
      this.restablecido = false
    },
    alternarAnimaciones() {
      if (this.sistemaReduce) return
      this.animaciones = !this.animaciones
      cambiarAnimaciones(this.animaciones)
      this.restablecido = false
    },
    restablecer() {
      restablecerPreferencias()
      this.sonidos = sonidosActivos()
      this.animaciones = animacionesGuardadas()
      this.restablecido = true
    }
  }
}
</script>

<style scoped>
.ajustes {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
}
.ajustes__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.625rem;
  line-height: 1.2;
  color: #14233b;
}
.ajustes__bajada { margin: 0.25rem 0 0; font-size: 1rem; color: #52627a; }
.ajustes__fila { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; align-items: start; }

.bloque { padding: 1.125rem; display: flex; flex-direction: column; gap: 0.875rem; }
.bloque__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
}

.perfil__cabecera { display: flex; align-items: center; gap: 0.875rem; }
.perfil__inicial {
  width: 3.5rem;
  height: 3.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e4f0fb;
  color: #1b4f9e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
}
.perfil__datos { min-width: 0; }
.perfil__nombre {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
  overflow-wrap: anywhere;
}
.perfil__correo { margin: 0.125rem 0 0; font-size: 0.9375rem; color: #3a4960; overflow-wrap: anywhere; }
.perfil__rol { margin-top: 0.375rem; }

.nota {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #52627a;
}
.nota svg { width: 1.125rem; height: 1.125rem; flex-shrink: 0; }

.icono {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icono svg { width: 1.5rem; height: 1.5rem; }

.preferencias { list-style: none; margin: 0; padding: 0; }
.preferencia {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.875rem 0;
  border-bottom: 1px solid #e6edf6;
}
.preferencia:first-child { padding-top: 0.25rem; }
.preferencia__fila { display: flex; align-items: flex-start; gap: 0.75rem; }
.preferencia__textos { flex: 1; min-width: 0; }
.preferencia__nombre {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.0625rem;
  color: #14233b;
}
.preferencia__desc { margin: 0.125rem 0 0; font-size: 0.875rem; line-height: 1.4; color: #52627a; }
.preferencia__estado { margin: 0.375rem 0 0; font-size: 0.875rem; font-weight: 700; color: #52627a; }
.preferencia__estado--on { color: #1b4f9e; }
.preferencia__aviso {
  margin: 0;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  background: #f3f8fd;
  border: 1px solid #d9e4f1;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #3a4960;
}

/* Interruptor: 56x44 de área táctil; el estado también va escrito al lado */
.interruptor {
  width: 3.5rem;
  height: 2.75rem;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.interruptor__pista {
  position: relative;
  display: block;
  width: 3.5rem;
  height: 2rem;
  border-radius: 999px;
  background: #6b7a90;
  transition: background-color 0.15s ease;
}
.interruptor__perilla {
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(20, 35, 59, 0.3);
  transition: transform 0.15s ease;
}
.interruptor--on .interruptor__pista { background: #2568c4; }
.interruptor--on .interruptor__perilla { transform: translateX(1.5rem); }
.interruptor:focus-visible { outline: none; }
.interruptor:focus-visible .interruptor__pista { outline: 3px solid #14233b; outline-offset: 2px; }
.interruptor:disabled { cursor: not-allowed; opacity: 0.55; }

.ajustes__pie {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  padding-top: 0.25rem;
}
.ajustes__restablecer { width: 100%; }
.ajustes__listo { margin: 0; text-align: center; font-size: 0.875rem; color: #1f6b40; }

@media (min-width: 768px) {
  .ajustes { padding: 1.5rem 1.5rem 2rem; }
  .ajustes__titulo { font-size: 2rem; }
  .ajustes__bajada { font-size: 1.125rem; }
  .bloque { padding: 1.5rem; gap: 1rem; }
  .bloque__titulo { font-size: 1.25rem; }
  .perfil__inicial { width: 4rem; height: 4rem; font-size: 1.75rem; }
  .perfil__nombre { font-size: 1.1875rem; }
  .icono { width: 3rem; height: 3rem; border-radius: 0.875rem; }
  .icono svg { width: 1.625rem; height: 1.625rem; }
  .preferencia__nombre { font-size: 1.125rem; }
  .preferencia__desc { font-size: 0.9375rem; }
  .ajustes__pie { flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; }
  .ajustes__restablecer { width: auto; }
  .ajustes__listo { text-align: right; }
}
@media (min-width: 1024px) {
  .ajustes { padding: 1.25rem 2.5rem 2rem 1.5rem; }
  .ajustes__fila { grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 1.25rem; }
}

@media (prefers-reduced-motion: reduce) {
  .interruptor__pista, .interruptor__perilla { transition: none; }
}
html[data-animaciones="off"] .interruptor__pista,
html[data-animaciones="off"] .interruptor__perilla { transition: none; }
</style>
