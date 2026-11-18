<template>
  <!-- UI-03: menú principal. Escritorio (≥1024 px): barra lateral con el ícono a la
       izquierda y el texto al lado. Celular: barra inferior con el ícono arriba. -->
  <nav
    aria-label="Menú principal"
    class="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-leo-linea lg:sticky lg:top-4 lg:bottom-auto lg:inset-x-auto lg:z-auto lg:flex-shrink-0 lg:transition-all lg:duration-200 motion-reduce:transition-none lg:self-start lg:border-2 lg:rounded-2xl lg:m-4"
    :class="contraido ? 'lg:w-24' : 'lg:w-60'"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }"
    data-test="menu-principal"
  >
    <!-- Solo escritorio: contraer la barra a íconos y volver a expandirla -->
    <button
      type="button"
      class="hidden lg:flex items-center gap-2 w-full h-10 px-4 rounded-t-2xl text-sm font-semibold text-leo-suave bg-transparent border-0 border-b-2 border-leo-linea cursor-pointer hover:bg-gray-100"
      :class="contraido ? 'justify-center' : 'justify-start'"
      :aria-expanded="!contraido"
      :aria-label="contraido ? 'Expandir menú' : 'Contraer menú'"
      :title="contraido ? 'Expandir menú' : 'Contraer menú'"
      data-test="menu-alternar"
      @click="alternar"
    >
      <svg class="w-5 h-5 flex-shrink-0 transition-transform motion-reduce:transition-none" :class="{ 'rotate-180': contraido }" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5 L7 10 L12 15" /></svg>
      <span v-if="!contraido">Contraer</span>
    </button>
    <ul class="flex justify-around list-none m-0 p-1 lg:flex-col lg:gap-1 lg:p-3">
      <li v-for="item in items" :key="item.clave" class="flex-1 min-w-0 lg:flex-none">
        <router-link :to="item.to" custom v-slot="{ href, navigate }">
          <a
            :href="href"
            class="mp-item flex flex-col items-center justify-center h-16 rounded-2xl border-2 text-sm font-semibold no-underline select-none transition-transform active:scale-95 lg:flex-row lg:gap-3 lg:h-14 lg:text-base"
            :class="[
              contraido ? 'lg:justify-center lg:px-0' : 'lg:justify-start lg:px-3',
              activa(item) ? 'border-leo-azul bg-leo-cielo text-leo-azul-osc' : 'border-transparent text-leo-texto hover:bg-gray-100',
              { 'mp-anim': animando === item.clave }
            ]"
            :aria-current="activa(item) ? 'page' : null"
            :data-test="'menu-' + item.clave"
            :title="contraido ? item.texto : null"
            @click="tocar(item, navigate, $event)"
          >
            <IconoMenu :tipo="item.icono" class="w-8 h-8 flex-shrink-0" />
            <span class="leading-tight" :class="{ 'lg:sr-only': contraido }">{{ item.texto }}</span>
          </a>
        </router-link>
      </li>
      <!-- Cerrar sesión: no es una sección, es una acción (App.vue pide confirmación si hay un juego en curso) -->
      <li class="flex-1 min-w-0 lg:flex-none lg:mt-2 lg:pt-2 lg:border-t-2 lg:border-leo-linea">
        <button
          type="button"
          class="mp-item w-full flex flex-col items-center justify-center h-16 rounded-2xl border-2 border-transparent bg-transparent text-sm font-semibold select-none cursor-pointer transition-transform active:scale-95 text-leo-coral hover:bg-red-50 lg:flex-row lg:gap-3 lg:h-14 lg:text-base"
          :class="[contraido ? 'lg:justify-center lg:px-0' : 'lg:justify-start lg:px-3', { 'mp-anim': animando === 'salir' }]"
          :title="contraido ? 'Salir' : null"
          data-test="cerrar-sesion"
          @click="salir"
        >
          <IconoMenu tipo="salir" class="w-8 h-8 flex-shrink-0" />
          <span class="leading-tight" :class="{ 'lg:sr-only': contraido }">Salir</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import IconoMenu from './IconoMenu.vue'

// La elección (contraer/expandir) se recuerda en este navegador; si el almacenamiento falla, el menú funciona igual.
const CLAVE_CONTRAIDO = 'leo-perfecto-menu-contraido'
function leerContraido() {
  try {
    return localStorage.getItem(CLAVE_CONTRAIDO) === '1'
  } catch (error) {
    return false
  }
}

export default {
  name: 'MenuPrincipal',
  components: { IconoMenu },
  emits: ['salir'],
  props: {
    // Solo el rol docente ve la quinta opción
    esDocente: { type: Boolean, default: false }
  },
  data() {
    return { animando: null, temporizador: null, contraido: leerContraido() }
  },
  computed: {
    items() {
      const lista = [
        { clave: 'inicio', texto: 'Inicio', icono: 'inicio', to: { name: 'inicio' } },
        { clave: 'progreso', texto: 'Progreso', icono: 'progreso', to: { name: 'progreso' } },
        { clave: 'leoia', texto: 'LeoIA', icono: 'leoia', to: { name: 'leoia' } },
        { clave: 'ajustes', texto: 'Ajustes', icono: 'ajustes', to: { name: 'ajustes' } }
      ]
      if (this.esDocente) {
        lista.push({ clave: 'docente', texto: 'Docente', icono: 'docente', to: { name: 'docente' } })
      }
      return lista
    }
  },
  beforeUnmount() {
    clearTimeout(this.temporizador)
  },
  methods: {
    activa(item) {
      return this.$route.meta.seccion === item.clave
    },
    alternar() {
      this.contraido = !this.contraido
      try {
        localStorage.setItem(CLAVE_CONTRAIDO, this.contraido ? '1' : '0')
      } catch (error) {
        console.warn('No se pudo recordar el estado del menú:', error)
      }
    },
    salir() {
      this.animar('salir')
      this.$emit('salir')
    },
    animar(clave) {
      clearTimeout(this.temporizador)
      this.animando = null
      this.$nextTick(() => {
        this.animando = clave
        this.temporizador = setTimeout(() => { this.animando = null }, 900)
      })
    },
    // La animación se dispara solo al tocar (nada se mueve solo) y puede repetirse
    tocar(item, navigate, evento) {
      this.animar(item.clave)
      navigate(evento)
    }
  }
}
</script>
