<template>
  <!-- UI-05: barra superior blanca y delgada (antes: bloque azul con degradado).
       - Escritorio: logo + "Leo Perfecto" a la izquierda; quién ingresó a la derecha.
       - Celular y tablet (bajo 1024px): el título de la sección al centro; en pantallas
         internas (la ruta, las reglas de un juego) una flecha para volver reemplaza al logo.
       - En los juegos (sin menú) se mantienen "Menú Principal", "Panel docente" y "Salir",
         que son la única forma de salir de ahí. -->
  <header
    class="barra"
    :class="{ 'barra--juego': enJuego }"
    data-test="barra-superior"
  >
    <!-- Izquierda: volver (pantallas internas, celular) o logo -->
    <div class="barra__izq">
      <router-link
        v-if="atras && !enJuego"
        :to="atras"
        class="barra__volver"
        aria-label="Volver"
        data-test="barra-volver"
      >
        <svg viewBox="0 0 20 20" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 4 L6.5 10 L12.5 16" /></svg>
      </router-link>
      <span
        class="barra__marca"
        :class="{ 'barra__marca--oculta-movil': atras && !enJuego, 'barra__marca--sin-texto': !enJuego }"
      >
        <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="" class="barra__logo" />
        <span class="barra__nombre-app">Leo Perfecto</span>
      </span>
    </div>

    <!-- Centro (celular y tablet): nombre de la sección -->
    <p
      v-if="titulo && !enJuego"
      class="barra__titulo"
      data-test="barra-titulo"
    >{{ titulo }}</p>

    <!-- Derecha -->
    <div class="barra__der">
      <template v-if="enJuego">
        <button
          v-if="showProgressButton"
          type="button"
          class="barra__boton"
          @click="$emit('go-progreso')"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9.5 L10 3.5 L17 9.5 M5 8 V16.5 H15 V8" /></svg>
          Menú Principal
        </button>
        <!-- CU-04: solo visible para rol docente (el rol se asigna por SQL) -->
        <button
          v-if="mostrarPanelDocente"
          type="button"
          class="barra__boton"
          data-test="panel-docente"
          @click="$emit('go-panel-docente')"
        >
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 16 V10 M10 16 V4 M16 16 V8" /></svg>
          Panel docente
        </button>
        <!-- CU-03: cerrar sesión -->
        <button
          v-if="sesionIniciada"
          type="button"
          class="barra__boton barra__boton--salir"
          data-test="cerrar-sesion"
          @click="$emit('cerrar-sesion')"
        >
          Salir
        </button>
      </template>

      <div
        v-else-if="nombreCorto"
        class="barra__usuario"
        data-test="barra-usuario"
      >
        <span class="barra__nombre">{{ nombreCorto }}</span>
        <span class="barra__inicial" role="img" :aria-label="`Sesión de ${nombreCorto}`">{{ letra }}</span>
      </div>
    </div>
  </header>
</template>

<script>
import { primerNombre, inicial } from '../utils/nombre'

export default {
  name: 'AppNavbar',
  props: {
    showProgressButton: {
      type: Boolean,
      default: false
    },
    sesionIniciada: {
      type: Boolean,
      default: false
    },
    mostrarPanelDocente: {
      type: Boolean,
      default: false
    },
    // --- UI-05 ---
    /** Nombre del usuario (el completo de Google; se muestra solo el primero) */
    nombre: { type: String, default: '' },
    /** Nombre de la sección, para celular ("Inicio", "Progreso"...) */
    titulo: { type: String, default: '' },
    /** Destino de la flecha "volver" en pantallas internas (celular), o null */
    atras: { type: [String, Object], default: null },
    /** Pantalla de juego: muestra los botones para salir del juego */
    enJuego: { type: Boolean, default: false }
  },
  emits: ['go-progreso', 'cerrar-sesion', 'go-panel-docente'],
  computed: {
    nombreCorto() {
      return primerNombre(this.nombre)
    },
    letra() {
      return inicial(this.nombre)
    }
  }
}
</script>

<style scoped>
.barra {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 3.5rem;
  padding: 0 0.5rem;
  background: #ffffff;
  border-bottom: 1px solid #d9e4f1;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}
/* En los juegos: logo a la izquierda y botones a la derecha (pueden bajar de línea) */
.barra--juego {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.barra__izq { grid-column: 1; display: flex; align-items: center; min-width: 0; }
.barra__der { grid-column: 3; display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap; }

.barra__volver {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  color: #14233b;
}
.barra__volver:hover { background: #eef3f9; }

.barra__marca { display: flex; align-items: center; gap: 0.625rem; padding-left: 0.375rem; }
.barra__logo { width: 2rem; height: 2rem; object-fit: contain; }
.barra__nombre-app {
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.1875rem;
  color: #14233b;
  white-space: nowrap;
}
/* Celular: con el título de la sección al centro, el logo va solo;
   en pantallas internas la flecha "volver" ocupa su lugar */
.barra__marca--sin-texto .barra__nombre-app { display: none; }
.barra__marca--oculta-movil { display: none; }
.barra__nombre { display: none; }

.barra__titulo {
  grid-column: 2;
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 60vw;
}

.barra__usuario { display: flex; align-items: center; gap: 0.75rem; padding-right: 0.25rem; }
.barra__nombre { font-weight: 700; font-size: 1rem; color: #14233b; }
.barra__inicial {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e4f0fb;
  color: #1b4f9e;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1rem;
}

.barra__boton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0 1rem;
  border: 2px solid #d9e4f1;
  border-radius: 0.875rem;
  background: #ffffff;
  color: #1b4f9e;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}
.barra__boton:hover { background: #f3f8fd; border-color: #2568c4; }
.barra__boton--salir { color: #c2382d; }
.barra__boton--salir:hover { background: #fdf1f0; border-color: #c2382d; }
.barra__boton:focus-visible,
.barra__volver:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }

/* Escritorio: barra de 64px, nombre de la app visible, sin título de sección */
@media (min-width: 1024px) {
  .barra { position: static; min-height: 4rem; padding: 0 1.75rem; }
  .barra--juego { padding: 0.5rem 1.75rem; }
  .barra__marca { padding-left: 0; gap: 0.75rem; }
  .barra__logo { width: 2.125rem; height: 2.125rem; }
  .barra__marca--sin-texto .barra__nombre-app { display: inline; }
  .barra__marca--oculta-movil { display: flex; }
  .barra__volver { display: none; }
  .barra__titulo { display: none; }
  .barra__nombre { display: inline; }
  .barra__inicial { width: 2.5rem; height: 2.5rem; font-size: 1.0625rem; }
}
</style>
