<template>
  <div class="text-left">
    <TareaRunner
      v-if="tareaActual"
      :key="tareaActual.id"
      :tarea="tareaActual"
      :game-id="unidad.gameId"
      :modo-demo="modoDemo"
      @terminar="alTerminar"
      @salir="tareaActual = null"
    />

    <template v-else>
      <!-- UI-10: si falla la carga, el aviso de Leo apenado reemplaza al saludo (un solo Leo en pantalla) -->
      <div v-if="!errorCarga" class="max-w-xl mx-auto px-4 pt-4">
        <LeoMascota
          :estado="estadoLeo"
          :mensaje="mensajeLeo"
        />
      </div>

      <!-- UI-10: el aviso anterior, en texto plano:
      <p
        v-if="errorCarga"
        class="max-w-xl mx-auto mx-4 mt-4 p-3 rounded-xl bg-yellow-100 text-yellow-800 text-sm"
        role="alert"
      >
        No pudimos cargar tu avance guardado. Puedes seguir practicando; revisa tu conexión y vuelve a entrar más tarde.
      </p>
      -->
      <div v-if="errorCarga" class="max-w-xl mx-auto px-4 pt-4">
        <LeoVacio
          tipo="error"
          titulo="No pudimos cargar tu avance guardado"
          texto="Puedes seguir practicando. Revisa tu conexión e inténtalo de nuevo."
          accion="Intentar de nuevo"
          data-test="ruta-error"
          @accion="cargarCompletadas"
        />
      </div>

      <RutaUnidad
        v-if="!cargando"
        :unidad="unidad"
        :nodos="nodosConEstado"
        @abrir="abrirTarea"
      />
      <!-- UI-10: silueta quieta del camino mientras carga, en vez de la pantalla vacía -->
      <div v-else class="ruta-silueta" aria-hidden="true" data-test="ruta-silueta">
        <div v-for="n in 5" :key="n" class="ruta-silueta__paso" :class="{ 'ruta-silueta__paso--der': n % 2 === 0 }">
          <span class="ruta-silueta__nodo"></span>
          <span class="ruta-silueta__lineas"><span></span><span></span></span>
        </div>
      </div>

      <div class="max-w-xl mx-auto px-4 pb-8 space-y-4">
        <!-- Herramientas de demo: solo existen con npm run serve, nunca en producción -->
        <div
          v-if="modoDemo && !cargando"
          class="p-3 rounded-xl border-2 border-dashed border-gray-300 space-y-2"
        >
          <p class="text-xs font-bold uppercase tracking-wide text-gray-500">Modo demo (solo en desarrollo)</p>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 py-2 rounded-lg bg-gray-800 text-white text-sm font-bold"
              @click="desbloquearTodo"
            >Desbloquear todo</button>
            <button
              type="button"
              class="flex-1 py-2 rounded-lg border-2 border-gray-800 text-gray-800 text-sm font-bold"
              @click="reiniciar"
            >Reiniciar</button>
          </div>
        </div>

        <button
          type="button"
          class="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold"
          @click="$emit('salir')"
        >Volver</button>
      </div>
    </template>
  </div>
</template>

<script>
import TareaRunner from './TareaRunner.vue'
import RutaUnidad from './RutaUnidad.vue'
import LeoMascota from './LeoMascota.vue'
import LeoVacio from '../base/LeoVacio.vue'
import { estadoDeNodos } from './progresoRuta'
import { cargarProgresoNube } from '../../utils/supabaseProgress'
import unidad1 from '../../data/ruta/unidad1'

export default {
  name: 'RutaAprendizaje',
  components: { TareaRunner, RutaUnidad, LeoMascota, LeoVacio },
  emits: ['salir'],
  data() {
    return {
      unidad: unidad1,
      tareaActual: null,
      ultimoResultado: null,
      completadas: [], // ids de las tareas completadas (se cargan desde Supabase)
      cargando: true,
      errorCarga: false,
      // true solo con `npm run serve`. En el build de producción es false.
      modoDemo: process.env.NODE_ENV === 'development'
    }
  },
  computed: {
    nodosConEstado() {
      return estadoDeNodos(this.unidad.nodos, this.completadas)
    },
    estadoLeo() {
      if (this.cargando) return 'pensando'
      return this.ultimoResultado ? 'feliz' : 'saludando'
    },
    mensajeLeo() {
      if (this.cargando) return 'Buscando dónde quedaste…'
      if (this.ultimoResultado) {
        const { aciertos, total } = this.ultimoResultado
        return '¡Bien hecho! Respondiste ' + aciertos + ' de ' + total + '. Sigue con el próximo paso cuando quieras.'
      }
      if (this.completadas.length) return '¡Qué bueno verte de nuevo! Sigue desde donde quedaste.'
      return '¡Hola! Avanza en tu ruta un paso a la vez.'
    }
  },
  created() {
    this.cargarCompletadas()
  },
  methods: {
    async cargarCompletadas() {
      this.cargando = true
      this.errorCarga = false
      try {
        const sesiones = await cargarProgresoNube()
        const ids = sesiones
          .filter(s => s.gameId === this.unidad.gameId && s.status === 'completed')
          .map(s => s.textId)
        // Sin repetidos: una tarea completada dos veces cuenta una sola vez.
        this.completadas = [...new Set(ids)]
      } catch (error) {
        console.error('No se pudo cargar el progreso de la ruta:', error)
        this.errorCarga = true
      } finally {
        this.cargando = false
        this.abrirTareaPedida()
      }
    },
    // UI-05: el botón "Continuar" de Inicio llega con ?tarea=<id> para abrir ese paso
    // directamente. Solo se abre si el paso no está bloqueado; si lo está, queda el camino.
    abrirTareaPedida() {
      const pedida = this.$route && this.$route.query && this.$route.query.tarea
      if (!pedida) return
      const nodo = this.nodosConEstado.find(n => n.tareaId === pedida)
      // Se quita de la URL para que "atrás" o recargar no vuelvan a abrir la tarea
      this.$router.replace({ query: {} }).catch(() => {})
      if (nodo && (nodo.estado === 'disponible' || nodo.estado === 'completado')) {
        this.abrirTarea(pedida)
      }
    },
    abrirTarea(tareaId) {
      const tarea = this.unidad.tareas[tareaId]
      if (!tarea) {
        console.error('La tarea no existe en los datos de la unidad:', tareaId)
        return
      }
      this.ultimoResultado = null
      this.tareaActual = tarea
    },
    alTerminar(resultado) {
      if (!this.completadas.includes(resultado.tareaId)) {
        this.completadas.push(resultado.tareaId)
      }
      this.ultimoResultado = resultado
      this.tareaActual = null
    },
    desbloquearTodo() {
      this.completadas = this.unidad.nodos
        .filter(nodo => !nodo.pronto)
        .map(nodo => nodo.tareaId)
    },
    reiniciar() {
      this.completadas = []
      this.ultimoResultado = null
    }
  }
}
</script>

<style scoped>
/* UI-10: silueta de la ruta mientras carga (quieta, sin brillo) */
.ruta-silueta {
  max-width: 36rem;
  margin: 1.5rem auto 0;
  padding: 1.375rem 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.25rem;
}
@media (max-width: 39.99rem) { .ruta-silueta { margin-left: 1rem; margin-right: 1rem; } }
.ruta-silueta__paso { display: flex; align-items: center; gap: 0.875rem; }
.ruta-silueta__paso--der { padding-left: 4rem; }
.ruta-silueta__nodo { width: 3.5rem; height: 3.5rem; border-radius: 50%; background: #e4ecf6; flex-shrink: 0; }
.ruta-silueta__lineas { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.ruta-silueta__lineas span { height: 0.875rem; width: 62%; border-radius: 0.375rem; background: #e4ecf6; }
.ruta-silueta__lineas span + span { height: 0.75rem; width: 40%; background: #eef3f9; }
</style>
