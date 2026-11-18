<template>
  <section class="max-w-xl mx-auto p-4 space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-extrabold text-indigo-900">{{ unidad.titulo }}</h1>
      <p class="text-lg text-gray-700">{{ unidad.descripcion }}</p>
      <div class="flex items-center gap-3">
        <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-600 transition-all duration-300"
            :style="{ width: porcentaje + '%' }"
          ></div>
        </div>
        <span class="text-sm font-bold text-gray-700">{{ obligatoriosListos }} de {{ obligatoriosTotal }}</span>
      </div>
    </header>

    <ol class="relative space-y-4">
      <li v-for="nodo in nodos" :key="nodo.id">
        <button
          type="button"
          class="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
          :class="claseTarjeta(nodo.estado)"
          :disabled="nodo.estado === 'bloqueado' || nodo.estado === 'pronto'"
          :aria-label="nodo.titulo + ': ' + textoEstado(nodo.estado)"
          @click="$emit('abrir', nodo.tareaId)"
        >
          <span
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            :class="claseIcono(nodo.estado)"
          >{{ icono(nodo) }}</span>

          <span class="flex-1">
            <span class="block text-xs font-bold uppercase tracking-wide text-gray-500">{{ etiquetaTipo(nodo.tipo) }}</span>
            <span class="block text-lg font-bold text-gray-800">{{ nodo.titulo }}</span>
            <span class="block text-sm" :class="claseTextoEstado(nodo.estado)">{{ textoEstado(nodo.estado) }}</span>
          </span>
        </button>
      </li>
    </ol>
  </section>
</template>

<script>
import { TIPOS_OBLIGATORIOS } from './progresoRuta'

const ETIQUETAS = {
  aprende: 'Aprende',
  practica: 'Práctica',
  opcional: 'Práctica opcional',
  desafio: 'Desafío'
}

const ICONOS = {
  aprende: '📖',
  practica: '✏️',
  opcional: '⭐',
  desafio: '🏆'
}

export default {
  name: 'RutaUnidad',
  props: {
    unidad: { type: Object, required: true },
    // Nodos ya calculados con estadoDeNodos() (cada uno trae `estado`).
    nodos: { type: Array, required: true }
  },
  emits: ['abrir'],
  computed: {
    obligatorios() {
      return this.nodos.filter(n => TIPOS_OBLIGATORIOS.includes(n.tipo))
    },
    obligatoriosTotal() {
      return this.obligatorios.length
    },
    obligatoriosListos() {
      return this.obligatorios.filter(n => n.estado === 'completado').length
    },
    porcentaje() {
      if (!this.obligatoriosTotal) return 0
      return Math.round((this.obligatoriosListos / this.obligatoriosTotal) * 100)
    }
  },
  methods: {
    etiquetaTipo(tipo) {
      return ETIQUETAS[tipo] || tipo
    },
    icono(nodo) {
      if (nodo.estado === 'completado') return '✅'
      if (nodo.estado === 'bloqueado') return '🔒'
      return ICONOS[nodo.tipo] || '📖'
    },
    textoEstado(estado) {
      if (estado === 'completado') return 'Completado · puedes repetirlo'
      if (estado === 'disponible') return 'Disponible · toca para empezar'
      if (estado === 'bloqueado') return 'Completa el anterior para desbloquear'
      return 'Pronto'
    },
    // Clases completas (no concatenadas) por el purge de Tailwind.
    claseTarjeta(estado) {
      if (estado === 'disponible') return 'bg-white border-2 border-indigo-600 shadow-lg'
      if (estado === 'completado') return 'bg-white border-2 border-green-600'
      if (estado === 'bloqueado') return 'bg-gray-100 border-2 border-gray-200 opacity-75 cursor-not-allowed'
      return 'bg-gray-50 border-2 border-dashed border-gray-300 opacity-60 cursor-not-allowed'
    },
    claseIcono(estado) {
      if (estado === 'disponible') return 'bg-indigo-100'
      if (estado === 'completado') return 'bg-green-100'
      return 'bg-gray-200'
    },
    claseTextoEstado(estado) {
      if (estado === 'disponible') return 'text-indigo-700 font-semibold'
      if (estado === 'completado') return 'text-green-700'
      return 'text-gray-500'
    }
  }
}
</script>