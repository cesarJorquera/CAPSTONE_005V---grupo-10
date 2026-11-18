<template>
  <!-- UI-10: estado vacío, error o "próximamente" con Leo.
       - 'error': Leo apenado (solo cuando falla la app, nunca por un error del alumno), etiqueta ámbar
         y, si se pasa `accion`, el botón para intentarlo de nuevo.
       - 'vacio': todavía no hay nada; `accion` invita a empezar.
       - 'proximamente': función aún no disponible; mantiene el texto de cada pantalla. -->
  <section
    class="leo-vacio"
    :class="['leo-vacio--' + tipo, { 'leo-vacio--compacto': compacto }]"
    :role="tipo === 'error' ? 'alert' : null"
    :aria-labelledby="titulo ? idTitulo : null"
    data-test="leo-vacio"
  >
    <div class="leo-vacio__cabecera">
      <LeoPersonaje :estado="estadoFinal" :tamano="tamanoFinal" decorativo />
      <div class="leo-vacio__titulos">
        <LeoEtiqueta v-if="etiquetaFinal" :tono="tono" class="leo-vacio__etiqueta">{{ etiquetaFinal }}</LeoEtiqueta>
        <component :is="'h' + nivel" v-if="titulo" :id="idTitulo" class="leo-vacio__titulo">{{ titulo }}</component>
        <p v-if="texto && compacto" class="leo-vacio__texto">{{ texto }}</p>
      </div>
    </div>
    <p v-if="texto && !compacto" class="leo-vacio__texto">{{ texto }}</p>
    <slot />
    <div v-if="accion || cerrable" class="leo-vacio__acciones">
      <LeoBoton v-if="accion" tamano="compacto" class="leo-vacio__accion" data-test="leo-vacio-accion" @click="$emit('accion')">{{ accion }}</LeoBoton>
      <button v-if="cerrable" type="button" class="leo-vacio__cerrar" aria-label="Cerrar aviso" data-test="leo-vacio-cerrar" @click="$emit('cerrar')">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5 L15 15 M15 5 L5 15" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </div>
  </section>
</template>

<script>
import LeoPersonaje from './LeoPersonaje.vue'
import LeoEtiqueta from './LeoEtiqueta.vue'
import LeoBoton from './LeoBoton.vue'

let contador = 0

const POR_TIPO = {
  error: { estado: 'apenado', tono: 'ambar', etiqueta: 'Algo no salió bien' },
  vacio: { estado: 'neutro', tono: 'azul', etiqueta: '' },
  proximamente: { estado: 'neutro', tono: 'gris', etiqueta: 'Próximamente' }
}

export default {
  name: 'LeoVacio',
  components: { LeoPersonaje, LeoEtiqueta, LeoBoton },
  props: {
    tipo: { type: String, default: 'vacio', validator: v => ['vacio', 'error', 'proximamente'].includes(v) },
    titulo: { type: String, default: '' },
    texto: { type: String, default: '' },
    /** Texto de la etiqueta; null = la del tipo, '' = sin etiqueta */
    etiqueta: { type: String, default: null },
    /** Texto del botón principal (vacío = sin botón) */
    accion: { type: String, default: '' },
    cerrable: { type: Boolean, default: false },
    /** Más bajo, con el texto junto a Leo (para avisos dentro de una tarjeta) */
    compacto: { type: Boolean, default: false },
    /** Nivel del título (h2, h3…) */
    nivel: { type: Number, default: 2 },
    estadoLeo: { type: String, default: '' },
    tamano: { type: Number, default: null }
  },
  emits: ['accion', 'cerrar'],
  data() {
    contador++
    return { idTitulo: 'leo-vacio-' + contador }
  },
  computed: {
    config() {
      return POR_TIPO[this.tipo]
    },
    estadoFinal() {
      return this.estadoLeo || this.config.estado
    },
    tono() {
      return this.config.tono
    },
    etiquetaFinal() {
      return this.etiqueta === null ? this.config.etiqueta : this.etiqueta
    },
    tamanoFinal() {
      return this.tamano || (this.compacto ? 60 : 76)
    }
  }
}
</script>

<style scoped>
.leo-vacio {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: 1.25rem 1.125rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.25rem;
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
}
.leo-vacio--error { border-color: #f0d9a3; }
.leo-vacio--proximamente { background: #f4f8fd; }
.leo-vacio--compacto { padding: 0.875rem 1rem; gap: 0.75rem; }
.leo-vacio__cabecera { display: flex; align-items: center; gap: 0.875rem; }
.leo-vacio__cabecera > :first-child { flex-shrink: 0; }
.leo-vacio__titulos { display: flex; flex-direction: column; align-items: flex-start; gap: 0.375rem; min-width: 0; }
.leo-vacio__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.3;
  color: #14233b;
}
.leo-vacio__texto { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #3a4960; }
.leo-vacio__acciones { display: flex; gap: 0.625rem; }
.leo-vacio__accion { flex: 1; }
.leo-vacio__cerrar {
  width: 3rem;
  min-height: 3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9e4f1;
  border-radius: 0.875rem;
  background: #ffffff;
  cursor: pointer;
}
.leo-vacio__cerrar:focus-visible { outline: 3px solid #14233b; outline-offset: 3px; }
@media (min-width: 640px) {
  .leo-vacio__accion { flex: 0 1 auto; min-width: 12rem; }
}
</style>
