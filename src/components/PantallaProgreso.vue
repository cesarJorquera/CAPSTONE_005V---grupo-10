<template>
  <!-- UI-06: Rework de Progreso. Misma familia visual que Inicio (UI-05): fondo plano,
       tarjetas blancas, íconos SVG (sin emojis) y componentes base. Solo cambia lo visual;
       el único cálculo que se tocó es el total del curso (ver `totalActividades`). -->
  <div class="progreso" :class="{ 'progreso--entrada': conEntrada }">

    <header class="progreso__cabecera">
      <h1 class="progreso__titulo">Tu progreso</h1>
      <p class="progreso__bajada">{{ bajada }}</p>
    </header>

    <!-- UI-10: si no se pudo leer el progreso (antes solo quedaba en la consola y se veía todo en cero) -->
    <LeoVacio
      v-if="errorCarga"
      tipo="error"
      compacto
      titulo="No pudimos leer tu progreso"
      texto="Lo que ves puede estar incompleto. Inténtalo de nuevo en un momento."
      accion="Intentar de nuevo"
      data-test="progreso-error"
      @accion="reintentarCarga"
    />

    <!-- Resumen + próximo logro -->
    <div class="progreso__fila">
      <LeoTarjeta como="section" class="resumen" aria-labelledby="resumen-titulo" data-test="resumen-nivel">
        <div class="resumen__cabecera">
          <span class="icono icono--grande" style="background: #e4f0fb">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="iconoNivel" /></svg>
          </span>
          <div>
            <p class="antetitulo" style="color: #1b4f9e">Tu nivel</p>
            <h2 id="resumen-titulo" class="resumen__nivel" data-test="nivel">Nivel {{ nivel }} · {{ nivelNombre }}</h2>
          </div>
        </div>
        <p class="resumen__mensaje">{{ mensajeMotivacional }}</p>
        <div class="resumen__avance">
          <div class="resumen__avance-fila">
            <span class="resumen__avance-nombre">Avance del curso</span>
            <span class="resumen__avance-dato" data-test="avance-curso">{{ textoAvanceCurso }}</span>
          </div>
          <LeoBarraProgreso
            :valor="barrasLlenas ? juegosCompletados : 0"
            :maximo="totalActividades"
            :alto="12"
            etiqueta="Avance del curso"
          />
          <span class="resumen__nota">Incluye los juegos y los pasos de tu ruta.</span>
        </div>
      </LeoTarjeta>

      <LeoTarjeta como="section" class="proximo" aria-labelledby="proximo-titulo" data-test="proximo-logro">
        <p class="antetitulo" style="color: #8a5a00">Tu próximo logro</p>
        <div v-if="proximoLogro" class="proximo__logro">
          <span class="icono" style="background: #fff3cf">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b07a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="proximoLogro.icono" /></svg>
          </span>
          <div>
            <h2 id="proximo-titulo" class="proximo__nombre">{{ proximoLogro.nombre }}</h2>
            <p class="proximo__falta" data-test="proximo-falta">{{ proximoLogro.falta }}</p>
          </div>
        </div>
        <h2 v-else id="proximo-titulo" class="proximo__nombre">Lograste todo lo disponible</h2>
        <LeoBurbuja
          class="proximo__leo"
          :mensaje="mensajeLeo"
          disposicion="lado"
          :tamano="esAncho ? 88 : 76"
        />
      </LeoTarjeta>
    </div>

    <!-- Tres cifras -->
    <div class="cifras">
      <LeoTarjeta v-for="c in cifras" :key="c.id" como="section" class="cifra" :data-test="`cifra-${c.id}`">
        <span class="icono icono--cifra" :style="{ background: c.tint }">
          <svg viewBox="0 0 24 24" fill="none" :stroke="c.ink" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="c.icono" /></svg>
        </span>
        <div class="cifra__textos">
          <p class="cifra__valor">{{ c.valor }}</p>
          <p class="cifra__nombre">{{ c.nombre }}</p>
          <p class="cifra__nota">{{ c.nota }}</p>
        </div>
      </LeoTarjeta>
    </div>

    <!-- Logros -->
    <section class="logros" aria-labelledby="logros-titulo">
      <div class="seccion__cabecera">
        <h2 id="logros-titulo" class="seccion__titulo">Logros</h2>
        <span class="seccion__dato" data-test="logros-resumen">{{ resumenLogros }}</span>
      </div>
      <ul class="logros__grilla">
        <li v-for="l in logros" :key="l.id">
          <button
            type="button"
            class="logro"
            :class="{ 'logro--bloqueado': !l.desbloqueado, 'logro--brilla': brillando === l.id }"
            :data-test="`logro-${l.id}`"
            :aria-label="`${l.nombre}: ${l.desbloqueado ? 'desbloqueado' : l.estado}`"
            @click="abrirLogro(l)"
          >
            <span class="logro__cabecera">
              <span class="icono logro__icono" :style="{ background: l.desbloqueado ? l.tint : '#eef2f7' }">
                <svg viewBox="0 0 24 24" fill="none" :stroke="l.desbloqueado ? l.ink : '#8a99ad'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="l.icono" /></svg>
              </span>
              <span v-if="nuevos.includes(l.id)" class="logro__nuevo" data-test="logro-nuevo">Nuevo</span>
            </span>
            <span class="logro__textos">
              <span class="logro__nombre">{{ l.nombre }}</span>
              <span class="logro__desc">{{ l.desc }}</span>
            </span>
            <span class="logro__pie">
              <span v-if="!l.desbloqueado && l.meta" class="logro__barra" aria-hidden="true">
                <span class="logro__relleno" :style="{ width: (barrasLlenas ? l.pct : 0) + '%' }"></span>
              </span>
              <span class="logro__estado" :class="{ 'logro__estado--ok': l.desbloqueado }">{{ l.desbloqueado ? 'Desbloqueado' : l.estado }}</span>
            </span>
          </button>
        </li>
      </ul>
    </section>

    <!-- Fortalezas y Para seguir creciendo -->
    <div class="analisis">
      <LeoTarjeta como="section" class="analisis__tarjeta" aria-labelledby="fortalezas-titulo" data-test="fortalezas">
        <div class="analisis__cabecera">
          <span class="icono" style="background: #e3f3ea">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="iconos.estrella" /></svg>
          </span>
          <h2 id="fortalezas-titulo" class="seccion__titulo">Tus fortalezas</h2>
        </div>
        <ul v-if="fortalezas.length" class="analisis__lista">
          <li v-for="(f, i) in fortalezas" :key="i" class="analisis__item">
            <p class="analisis__item-titulo">{{ f.titulo }}</p>
            <p class="analisis__item-texto">{{ f.descripcion }}</p>
            <div class="analisis__item-barra">
              <LeoBarraProgreso :valor="barrasLlenas ? f.porcentaje : 0" color="verde" :etiqueta="f.titulo" />
              <span class="analisis__item-dato">{{ f.porcentaje }}%</span>
            </div>
          </li>
        </ul>
        <div v-else class="analisis__vacio">
          <p class="analisis__item-titulo">Aquí aparecerá en qué destacas</p>
          <p class="analisis__item-texto">Completa algunas actividades y Leo te mostrará tus puntos fuertes.</p>
        </div>
      </LeoTarjeta>

      <LeoTarjeta como="section" class="analisis__tarjeta" aria-labelledby="crecer-titulo" data-test="seguir-creciendo">
        <div class="analisis__cabecera">
          <span class="icono" style="background: #fff3cf">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b07a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="iconos.brote" /></svg>
          </span>
          <h2 id="crecer-titulo" class="seccion__titulo">Para seguir creciendo</h2>
          <!-- UI-10: Leo con cara de "déjame pensar", junto a los consejos -->
          <LeoPersonaje v-if="debilidades.length" class="analisis__leo" estado="piensa" :tamano="56" decorativo />
        </div>
        <ul v-if="debilidades.length" class="analisis__lista">
          <!-- Sin porcentajes aquí: el consejo dice qué hacer, sin marcar lo que falta -->
          <li v-for="(d, i) in debilidades" :key="i" class="analisis__item">
            <p class="analisis__item-titulo">{{ d.titulo }}</p>
            <p class="analisis__item-texto">{{ d.descripcion }}</p>
            <p v-if="d.consejo" class="analisis__consejo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="iconos.ampolleta" /></svg>
              {{ d.consejo }}
            </p>
          </li>
        </ul>
        <div v-else class="analisis__vacio">
          <p class="analisis__item-titulo">¡Todo marcha bien!</p>
          <p class="analisis__item-texto">Cuando tengas más actividades, aquí verás consejos para seguir mejorando.</p>
        </div>
      </LeoTarjeta>
    </div>

    <!-- Ranking Global (trabajo de otro compañero: solo cambia su aspecto) -->
    <RankingGlobal />

    <!-- Detalle de un logro -->
    <LeoPanelDetalle
      :abierto="!!logroAbierto"
      :titulo="logroAbierto ? logroAbierto.nombre : ''"
      antetitulo="Logro"
      :color-antetitulo="'#8a5a00'"
      @cerrar="logroAbierto = null"
    >
      <template #icono>
        <span v-if="logroAbierto" class="icono icono--grande" :style="{ background: logroAbierto.desbloqueado ? logroAbierto.tint : '#eef2f7' }">
          <svg viewBox="0 0 24 24" fill="none" :stroke="logroAbierto.desbloqueado ? logroAbierto.ink : '#8a99ad'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="logroAbierto.icono" /></svg>
        </span>
      </template>
      <template v-if="logroAbierto">
        <p class="detalle__como">{{ logroAbierto.como }}</p>
        <p v-if="logroAbierto.desbloqueado" class="detalle__logrado">¡Lo lograste! Este logro ya es tuyo.</p>
        <div v-else-if="logroAbierto.meta" class="detalle__avance">
          <LeoBarraProgreso :valor="logroAbierto.valor" :maximo="logroAbierto.meta" color="ambar" :etiqueta="`Avance de ${logroAbierto.nombre}`" />
          <span class="detalle__dato">{{ logroAbierto.estado }}</span>
        </div>
        <p v-else class="detalle__dato">{{ logroAbierto.estado }}</p>
      </template>
      <template v-if="logroAbierto && !logroAbierto.desbloqueado" #pie>
        <LeoBoton ancho data-test="logro-practicar" @click="irAPracticar">Seguir practicando</LeoBoton>
      </template>
    </LeoPanelDetalle>
  </div>
</template>

<script>
// UI-04: sección "Progreso". Aquí viven el bloque "Tu Progreso" y el Ranking Global, que antes estaban
// al final de MiProgreso.vue (hoy solo Inicio). La lógica de estadísticas se movió tal cual desde allí.
// UI-06: rework visual con los componentes base de UI-05. Las estadísticas (nivel, efectividad,
// racha, fortalezas, áreas de mejora) se calculan igual que antes; solo cambió el total del curso.
import { createGameManager, UNIDADES_CONFIG } from '../utils/gameManager'
import RankingGlobal from './RankingGlobal.vue'
import LeoBoton from './base/LeoBoton.vue'
import LeoTarjeta from './base/LeoTarjeta.vue'
import LeoBarraProgreso from './base/LeoBarraProgreso.vue'
import LeoBurbuja from './base/LeoBurbuja.vue'
import LeoPanelDetalle from './base/LeoPanelDetalle.vue'
import LeoVacio from './base/LeoVacio.vue' // UI-10
import LeoPersonaje from './base/LeoPersonaje.vue' // UI-10
import unidad1 from '../data/ruta/unidad1'
import { estadoSesion } from '../router/estadoSesion'
import { animacionesActivas } from '../utils/preferencias'

// UI-06: íconos de trazo (24x24) para niveles, cifras y logros. Reemplazan a los emojis.
const ICONOS = {
  brote: 'M12 20 V11 M12 11 C12 7 9 5 5 5 C5 9 8 11 12 11 M12 13 C12 10 14.5 8 19 8 C19 11.5 16 13 12 13',
  libro: 'M3 6 C6 5 9 5 12 7 C15 5 18 5 21 6 V19 C18 18 15 18 12 20 C9 18 6 18 3 19 Z M12 7 V20',
  libros: 'M4 4 H8 V20 H4 Z M10 4 H14 V20 H10 Z M16.5 5 L20 4.2 L22.5 19 L19 19.8 Z',
  birrete: 'M2 9 L12 4 L22 9 L12 14 Z M6 11 V16 C9 18.5 15 18.5 18 16 V11',
  corona: 'M3 8 L7.5 12 L12 5 L16.5 12 L21 8 L19 19 H5 Z',
  check: 'M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M8 12 L11 15 L16 9',
  diana: 'M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M7 12 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M11 12 a1 1 0 1 0 2 0 a1 1 0 1 0 -2 0',
  calendario: 'M4 6 H20 V20 H4 Z M4 10 H20 M8 3 V7 M16 3 V7 M9 15 L11 17 L15 13',
  bandera: 'M5 21 V4 M5 4 H16 L14 8 L16 12 H5',
  sube: 'M4 18 L10 12 L14 15 L20 7 M15 7 H20 V12',
  capas: 'M12 4 L20 8 L12 12 L4 8 Z M4 12 L12 16 L20 12 M4 16 L12 20 L20 16',
  diamante: 'M6 4 H18 L22 9 L12 21 L2 9 Z M2 9 H22 M9 4 L12 9 L15 4',
  rayo: 'M13 2 L4 14 H12 L11 22 L20 10 H12 Z',
  estrellaCal: 'M4 6 H20 V20 H4 Z M4 10 H20 M8 3 V7 M16 3 V7 M12 12.5 L13.2 15 L15.8 15.3 L13.9 17 L14.4 19.5 L12 18.2 L9.6 19.5 L10.1 17 L8.2 15.3 L10.8 15 Z',
  estrella: 'M12 3 L14.6 8.6 L20.6 9.2 L16 13.3 L17.4 19.3 L12 16.2 L6.6 19.3 L8 13.3 L3.4 9.2 L9.4 8.6 Z',
  ampolleta: 'M9 18 H15 M10 21 H14 M12 3 C8.7 3 6 5.6 6 8.9 C6 11.1 7.2 12.6 8.5 13.8 C9.1 14.4 9.5 15.2 9.5 16 H14.5 C14.5 15.2 14.9 14.4 15.5 13.8 C16.8 12.6 18 11.1 18 8.9 C18 5.6 15.3 3 12 3 Z'
}
const NIVEL_ICONO = { 1: ICONOS.brote, 2: ICONOS.libro, 3: ICONOS.libros, 4: ICONOS.birrete, 5: ICONOS.corona }
const NIVEL_NOMBRE = { 1: 'Aprendiz', 2: 'Estudiante', 3: 'Lector Avanzado', 4: 'Experto', 5: 'Maestro de la Lectura' }
const COLOR = {
  azul: { tint: '#e4f0fb', ink: '#2568c4' },
  verde: { tint: '#e3f3ea', ink: '#1f7a47' },
  ambar: { tint: '#fff3cf', ink: '#b07a00' }
}
// Logros de racha: siguen en la grilla, pero "Tu próximo logro" no los propone (sin presión por jugar a diario)
const LOGROS_DE_RACHA = ['racha3', 'racha7']
const CLAVE_ENTRADA = 'leo-perfecto-progreso-animado'

export default {
  name: 'PantallaProgreso',

  components: { RankingGlobal, LeoBoton, LeoTarjeta, LeoBarraProgreso, LeoBurbuja, LeoPanelDetalle, LeoVacio, LeoPersonaje },

  props: {
    playerName: {
      type: String,
      default: 'Jugador'
    },
    userProgress: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      errorCarga: false, // UI-10: no se pudo leer el progreso
      // Estadísticas del jugador
      juegosCompletados: 0,
      efectividad: 0,
      rachaActual: 0,
      fortalezas: [],
      debilidades: [],
      juegosPerfectos: 0,
      tiempoPromedioRapido: false,

      // Gestor de juegos
      gameManager: null,

      // --- UI-06 ---
      iconos: ICONOS,
      logroAbierto: null,
      nuevos: [], // ids de logros desbloqueados que el alumno ve por primera vez
      brillando: null, // id del logro que hace el brillo al tocarlo
      temporizadorBrillo: null,
      conEntrada: false,
      barrasLlenas: true, // con la animación de entrada, parten en 0 y se llenan una vez
      esAncho: false,
      consultaAncho: null,
      alCambiarAncho: null
    }
  },
  computed: {
    // ============================================
    // UI-06: TOTAL DEL CURSO
    // ============================================
    // Antes era un número fijo (32 = 12 + 10 + 10) que ya no calzaba con los juegos que existen
    // ni contaba los pasos de la ruta. Ahora se cuenta desde los datos: todos los juegos
    // configurados (UNIDADES_CONFIG: 53 hoy) + los pasos de la ruta de la Unidad 1 (8).
    // `juegosCompletados` (getEstadisticas) ya cuenta los pasos de la ruta, porque la copia local
    // del progreso se baja de Supabase con todas las partidas completadas.
    totalActividades() {
      const juegos = new Set()
      Object.values(UNIDADES_CONFIG).forEach(u => (u.juegos || []).forEach(j => juegos.add(`${j.gameId}-${j.textId}`)))
      return juegos.size + unidad1.nodos.length
    },
    porcentajeCurso() {
      if (!this.totalActividades) return 0
      return Math.min(Math.round((this.juegosCompletados / this.totalActividades) * 100), 100)
    },
    textoAvanceCurso() {
      if (!this.juegosCompletados) return 'Listo para empezar'
      return `${this.juegosCompletados} de ${this.totalActividades} actividades · ${this.porcentajeCurso}%`
    },

    // ============================================
    // UI-06: TEXTOS E ÍCONOS DE LA VISTA
    // ============================================
    nivelNombre() {
      return NIVEL_NOMBRE[this.nivel] || NIVEL_NOMBRE[1]
    },
    iconoNivel() {
      return NIVEL_ICONO[this.nivel] || NIVEL_ICONO[1]
    },
    bajada() {
      return this.juegosCompletados
        ? 'Mira cuánto has avanzado. Cada paso cuenta.'
        : 'Aquí verás cómo avanzas. Tu primer paso está a un toque.'
    },
    cifras() {
      const hay = this.juegosCompletados > 0
      return [
        { id: 'actividades', valor: String(this.juegosCompletados), nombre: 'Actividades completadas', nota: 'Juegos y pasos de tu ruta', icono: ICONOS.check, ...COLOR.azul },
        { id: 'efectividad', valor: hay ? `${this.efectividadSegura}%` : '—', nombre: 'Efectividad', nota: hay ? 'Respuestas correctas' : 'Aparece tras tu primera actividad', icono: ICONOS.diana, ...COLOR.verde },
        { id: 'racha', valor: hay ? String(this.rachaActual) : '—', nombre: 'Días seguidos', nota: 'Practica a tu ritmo', icono: ICONOS.calendario, ...COLOR.ambar }
      ]
    },

    // Los mismos 10 logros y condiciones de antes; ahora con avance (valor / meta) para mostrar
    // cuánto falta. "juegos" pasa a decir "actividades" porque también cuentan los pasos de la ruta.
    logros() {
      const n = this.juegosCompletados
      const ef = this.efectividadSegura
      const racha = this.rachaActual
      const lista = [
        { id: 'paso1', nombre: 'Primer Paso', desc: 'Completa 1 actividad', icono: ICONOS.bandera, color: 'verde', valor: n, meta: 1, unidad: 'actividades' },
        { id: 'camino', nombre: 'En Camino', desc: 'Completa 3 actividades', icono: ICONOS.sube, color: 'azul', valor: n, meta: 3, unidad: 'actividades' },
        { id: 'persistente', nombre: 'Persistente', desc: 'Completa 5 actividades', icono: ICONOS.capas, color: 'ambar', valor: n, meta: 5, unidad: 'actividades' },
        { id: 'maestro', nombre: 'Maestro', desc: 'Completa 10 actividades', icono: ICONOS.birrete, color: 'azul', valor: n, meta: 10, unidad: 'actividades' },
        { id: 'experto', nombre: 'Experto', desc: '80% de efectividad', icono: ICONOS.diana, color: 'verde', valor: ef, meta: 80, unidad: '%' },
        { id: 'perfeccion', nombre: 'Perfección', desc: '95% de efectividad', icono: ICONOS.diamante, color: 'ambar', valor: ef, meta: 95, unidad: '%' },
        { id: 'racha3', nombre: 'Racha de Fuego', desc: 'Practica 3 días seguidos', icono: ICONOS.calendario, color: 'azul', valor: racha, meta: 3, unidad: 'días' },
        { id: 'velocista', nombre: 'Velocista', desc: 'Respuestas rápidas', icono: ICONOS.rayo, color: 'verde', valor: this.tiempoPromedioRapido ? 1 : 0, meta: null, unidad: '' },
        { id: 'sinerrores', nombre: 'Sin Errores', desc: '100% en una actividad', icono: ICONOS.check, color: 'ambar', valor: this.juegosPerfectos, meta: 1, unidad: 'actividades' },
        { id: 'racha7', nombre: 'Dedicado', desc: 'Practica 7 días seguidos', icono: ICONOS.estrellaCal, color: 'azul', valor: racha, meta: 7, unidad: 'días' }
      ]
      return lista.map(l => {
        const desbloqueado = l.meta ? l.valor >= l.meta : l.valor > 0
        const pct = l.meta ? Math.min(Math.round((l.valor / l.meta) * 100), 100) : 0
        let estado = 'Por descubrir'
        if (!desbloqueado && l.meta && l.valor > 0) {
          estado = l.unidad === '%' ? `Llevas ${l.valor} de ${l.meta}%` : `Llevas ${l.valor} de ${l.meta}${l.unidad === 'días' ? ' días' : ''}`
        }
        const como = l.meta
          ? `${l.desc}.`
          : 'Responde con rapidez en tus actividades.'
        return { ...l, ...COLOR[l.color], desbloqueado, pct, estado, como }
      })
    },
    desbloqueados() {
      return this.logros.filter(l => l.desbloqueado).map(l => l.id)
    },
    resumenLogros() {
      const total = this.logros.length
      const listos = this.desbloqueados.length
      return listos ? `${listos} de ${total} desbloqueados` : `${total} por descubrir`
    },
    // El más cercano que se pueda medir, sin los de racha
    proximoLogro() {
      const candidatos = this.logros.filter(l => !l.desbloqueado && l.meta && !LOGROS_DE_RACHA.includes(l.id))
      if (!candidatos.length) return null
      // Primero los que se ganan completando actividades (lo que el alumno controla); los de
      // efectividad solo si ya no quedan de esos: un 80 de 95% "parece" cerca, pero no lo está.
      const porActividades = candidatos.filter(l => l.unidad === 'actividades')
      const lista = porActividades.length ? porActividades : candidatos
      const elegido = lista.reduce((a, b) => (b.valor / b.meta > a.valor / a.meta ? b : a))
      const falta = elegido.meta - elegido.valor
      let texto
      if (elegido.unidad === '%') texto = `Llega a ${elegido.meta}% de efectividad`
      else if (elegido.valor === 0 && elegido.meta === 1) texto = elegido.id === 'paso1' ? 'Completa tu primera actividad' : 'Haz una actividad sin errores'
      else texto = falta === 1 ? 'Te falta 1 actividad' : `Te faltan ${falta} actividades`
      return { ...elegido, falta: texto }
    },
    mensajeLeo() {
      const p = this.proximoLogro
      if (!p) return '¡Lo lograste! Sigue practicando a tu ritmo.'
      if (!this.juegosCompletados) return 'Empecemos juntos. Es corto.'
      if (p.valor / p.meta >= 0.5) return '¡Vas muy bien! Ya llevas más de la mitad.'
      return 'Cada actividad suma. Vamos de a poco.'
    },

    // Calcular nivel del jugador basado en juegos completados y efectividad
    nivel() {
      const puntosTotales = (this.juegosCompletados * 10) + (this.efectividadSegura / 10);
      if (puntosTotales >= 50) return 5;
      if (puntosTotales >= 35) return 4;
      if (puntosTotales >= 20) return 3;
      if (puntosTotales >= 10) return 2;
      return 1;
    },
    
    // Título del nivel
    // UI-06: ya no se muestra (traía emoji); la vista usa `nivelNombre` e `iconoNivel`. Se deja por si se reutiliza.
    nivelJugador() {
      const niveles = {
        1: '🌱 Aprendiz',
        2: '📘 Estudiante',
        3: '📚 Lector Avanzado',
        4: '🎓 Experto',
        5: '👑 Maestro de la Lectura'
      };
      return niveles[this.nivel] || '🌱 Aprendiz';
    },
    
    // Calcular progreso total del curso (32 juegos en total: 12 texto + 10 drag + 10 comprensión)
    // UI-06: reemplazado por `porcentajeCurso` (el 32 fijo no contaba la ruta ni todos los juegos de hoy).
    // Se deja por si otra parte lo necesita.
    progresoTotal() {
      const TOTAL_JUEGOS_CURSO = 32 // 12 textos + 10 drag & drop + 10 comprensión
      const porcentaje = Math.min(
        Math.round((this.juegosCompletados / TOTAL_JUEGOS_CURSO) * 100), 
        100
      )
      return porcentaje
    },
    
    // Emoji motivacional según rendimiento REAL (efectividad + ejercicios)
    // UI-06: ya no se muestra (la vista no usa emojis). Se deja por si se reutiliza.
    emojiMotivacional() {
      if (this.efectividadSegura >= 95 && this.juegosCompletados >= 15) return '🏆'
      if (this.efectividadSegura >= 90 && this.juegosCompletados >= 10) return '🌟'
      if (this.efectividadSegura >= 85 && this.juegosCompletados >= 8) return '⭐'
      if (this.efectividadSegura >= 75 && this.juegosCompletados >= 5) return '💪'
      if (this.efectividadSegura >= 60 && this.juegosCompletados >= 3) return '👍'
      if (this.juegosCompletados >= 3) return '📚'
      if (this.juegosCompletados >= 1) return '🌱'
      return '📖'
    },
    
    // Efectividad segura (nunca muestra Infinity o NaN)
    efectividadSegura() {
      if (!Number.isFinite(this.efectividad)) return 0
      if (this.efectividad < 0) return 0
      if (this.efectividad > 100) return 100
      return Math.round(this.efectividad)
    },
    
    // Mensaje motivacional dinámico según el progreso REAL
    mensajeMotivacional() {
      // Mensajes basados en efectividad Y cantidad de juegos
      if (this.efectividad >= 95 && this.juegosCompletados >= 15) {
        return '¡Excelente dominio! Tu comprensión lectora es sobresaliente.';
      } else if (this.efectividad >= 90 && this.juegosCompletados >= 10) {
        return 'Muy buen nivel. Mantienes consistencia en tu desempeño.';
      } else if (this.efectividad >= 80 && this.juegosCompletados >= 8) {
        return 'Buen progreso. Estás desarrollando habilidades sólidas.';
      } else if (this.efectividad >= 70 && this.juegosCompletados >= 5) {
        return 'Vas por buen camino. Sigue practicando regularmente.';
      } else if (this.efectividad >= 60 && this.juegosCompletados >= 3) {
        return 'Progreso visible. La constancia te ayudará a mejorar.';
      } else if (this.juegosCompletados >= 5) {
        return 'Has practicado varios ejercicios. Revisa tus errores para mejorar.';
      } else if (this.juegosCompletados >= 2) {
        return 'Primeros pasos completados. Continúa practicando para avanzar.';
      } else if (this.juegosCompletados === 1) {
        return 'Primer ejercicio completado. Sigue practicando para mejorar.';
      } else {
        return 'Comienza tu práctica y desarrolla tus habilidades de lectura.';
      }
    }
  },

  mounted() {
    try {
      this.gameManager = createGameManager(this.playerName)
      this.loadPlayerData()
      // UI-06: animación de entrada, barras que se llenan y logros nuevos
      this.prepararVista()
    } catch (error) {
      console.error('❌ Error al inicializar la sección Progreso:', error)
      this.errorCarga = true // UI-10
    }
  },

  beforeUnmount() {
    clearTimeout(this.temporizadorBrillo)
    try {
      if (this.consultaAncho && this.alCambiarAncho) {
        if (this.consultaAncho.removeEventListener) this.consultaAncho.removeEventListener('change', this.alCambiarAncho)
        else this.consultaAncho.removeListener(this.alCambiarAncho)
      }
    } catch (error) {
      // nada que limpiar
    }
  },

  methods: {
    // ============================================
    // UI-06: VISTA
    // ============================================
    prepararVista() {
      this.medirAncho()
      this.marcarNuevos()
      if (!animacionesActivas()) return
      try {
        if (sessionStorage.getItem(CLAVE_ENTRADA)) return
        sessionStorage.setItem(CLAVE_ENTRADA, '1')
      } catch (error) {
        return
      }
      // Primera vez en la sesión: las tarjetas aparecen y las barras se llenan desde cero
      this.conEntrada = true
      this.barrasLlenas = false
      setTimeout(() => { this.barrasLlenas = true }, 150)
    },
    medirAncho() {
      try {
        this.consultaAncho = window.matchMedia('(min-width: 768px)')
        this.esAncho = this.consultaAncho.matches
        this.alCambiarAncho = e => { this.esAncho = e.matches }
        if (this.consultaAncho.addEventListener) this.consultaAncho.addEventListener('change', this.alCambiarAncho)
        else this.consultaAncho.addListener(this.alCambiarAncho)
      } catch (error) {
        this.esAncho = false
      }
    },
    // "Nuevo": logros desbloqueados que este alumno aún no había visto en este navegador.
    // Se guarda en localStorage (por usuario); si no se puede guardar, simplemente no se marca nada.
    marcarNuevos() {
      const usuarioId = estadoSesion.usuario && estadoSesion.usuario.id
      if (!usuarioId) return
      const clave = `leo-perfecto-logros-vistos:${usuarioId}`
      try {
        const vistos = JSON.parse(localStorage.getItem(clave) || '[]')
        this.nuevos = this.desbloqueados.filter(id => !vistos.includes(id))
        localStorage.setItem(clave, JSON.stringify([...new Set([...vistos, ...this.desbloqueados])]))
      } catch (error) {
        this.nuevos = []
      }
    },
    abrirLogro(logro) {
      if (logro.desbloqueado) {
        this.brillando = null
        clearTimeout(this.temporizadorBrillo)
        this.$nextTick(() => {
          this.brillando = logro.id
          this.temporizadorBrillo = setTimeout(() => { this.brillando = null }, 900)
        })
      }
      this.logroAbierto = logro
    },
    irAPracticar() {
      this.logroAbierto = null
      this.$router.push({ name: 'inicio' })
    },

    /**
     * Carga todos los datos del jugador desde localStorage
     * OPTIMIZADO: Usa el mejor puntaje de cada juego, no el promedio de intentos
     */
    loadPlayerData() {
      try {
        if (!this.gameManager) {
          console.warn('⚠️ GameManager no inicializado')
          this.resetearEstadisticas()
          return
        }

        // Obtener estadísticas mejoradas del GameManager
        const stats = this.gameManager.getEstadisticas()
        
        // Validar y actualizar estado con valores seguros
        this.juegosCompletados = Number.isFinite(stats.juegosCompletados) ? stats.juegosCompletados : 0
        this.efectividad = Number.isFinite(stats.efectividad) ? stats.efectividad : 0
        this.juegosPerfectos = Number.isFinite(stats.juegosPerfectos) ? stats.juegosPerfectos : 0
        
        // Calcular racha (días únicos con actividad)
        const progreso = this.gameManager.loadProgress()
        this.rachaActual = this.calcularRachaDias(progreso)

        // Calcular fortalezas y debilidades con análisis mejorado
        this.calcularFortalezasYDebilidades(progreso)
        
        console.log('✅ Datos del jugador cargados (optimizados):', {
          juegosCompletados: this.juegosCompletados,
          efectividad: this.efectividad,
          juegosPerfectos: this.juegosPerfectos,
          nivel: this.nivel,
          racha: this.rachaActual
        })
      } catch (error) {
        console.error('❌ Error al cargar datos del jugador:', error)
        this.errorCarga = true // UI-10
        this.resetearEstadisticas()
      }
    },

    // UI-10: "Intentar de nuevo" del aviso de error (vuelve a leer el mismo progreso)
    reintentarCarga() {
      this.errorCarga = false
      try {
        if (!this.gameManager) this.gameManager = createGameManager(this.playerName)
        this.loadPlayerData()
      } catch (error) {
        console.error('❌ Error al reintentar la carga de Progreso:', error)
        this.errorCarga = true
      }
    },

    /**
     * Resetea todas las estadísticas a valores por defecto
     */
    resetearEstadisticas() {
      this.juegosCompletados = 0
      this.efectividad = 0
      this.rachaActual = 0
      this.juegosPerfectos = 0
      this.fortalezas = []
      this.debilidades = []
    },

    /**
     * Calcula la racha de días consecutivos
     * @param {Array} progressArray - Array de progreso
     * @returns {number} - Días de racha actual
     */
    calcularRachaDias(progressArray) {
      if (progressArray.length === 0) return 0

      // Obtener fechas únicas (sin hora) y ordenarlas
      const fechasUnicas = [...new Set(progressArray.map(p => {
        const fecha = new Date(p.date)
        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
      }))].sort().reverse()

      // Calcular racha consecutiva desde hoy
      let racha = 0
      const hoy = new Date()
      const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
      
      // Si jugó hoy, empieza racha
      if (fechasUnicas[0] === hoyStr) {
        racha = 1
        
        // Contar días consecutivos hacia atrás
        for (let i = 1; i < fechasUnicas.length; i++) {
          const fechaActual = new Date(fechasUnicas[i - 1])
          const fechaSiguiente = new Date(fechasUnicas[i])
          const diferenciaDias = Math.floor((fechaActual - fechaSiguiente) / (1000 * 60 * 60 * 24))
          
          if (diferenciaDias === 1) {
            racha++
          } else {
            break // Racha rota
          }
        }
      }
      
      return racha
    },

    calcularFortalezasYDebilidades(progressArray) {
      this.fortalezas = [];
      this.debilidades = [];

      if (progressArray.length === 0) {
        return; // Sin datos, no hay análisis
      }

      // Analizar por tipo de pregunta o categoría
      const categorias = {
        sustantivos: [],
        verbos: [],
        adjetivos: [],
        conectores: []
      };

      // Agrupar puntajes por categoría (si tienes esa info guardada)
      progressArray.forEach(p => {
        if (p.categoria) {
          if (!categorias[p.categoria]) categorias[p.categoria] = [];
          categorias[p.categoria].push(p.score);
        }
      });

      // Analizar rendimiento general
      const puntajes = progressArray.map(p => p.score || 0);
      const promedioGeneral = puntajes.reduce((a, b) => a + b, 0) / puntajes.length;
      
      // FORTALEZAS
      if (promedioGeneral >= 90) {
        this.fortalezas.push({
          emoji: '🌟',
          titulo: 'Excelencia en Comprensión',
          descripcion: 'Mantienes un rendimiento excepcional en todos los ejercicios',
          porcentaje: Math.round(promedioGeneral)
        });
      }

      if (this.juegosPerfectos >= 2) {
        this.fortalezas.push({
          emoji: '💎',
          titulo: 'Perfeccionista',
          descripcion: `Has logrado ${this.juegosPerfectos} juegos con puntuación perfecta`,
          porcentaje: 100
        });
      }

      if (this.rachaActual >= 5) {
        this.fortalezas.push({
          emoji: '�',
          titulo: 'Constancia Ejemplar',
          descripcion: `Racha de ${this.rachaActual} días practicando. ¡Increíble dedicación!`,
          porcentaje: Math.min(this.rachaActual * 10, 100)
        });
      }

      // Analizar mejora a lo largo del tiempo
      if (progressArray.length >= 3) {
        const primerosTres = progressArray.slice(0, 3).map(p => p.score).reduce((a,b) => a+b) / 3;
        const ultimosTres = progressArray.slice(-3).map(p => p.score).reduce((a,b) => a+b) / 3;
        
        if (ultimosTres > primerosTres + 10) {
          this.fortalezas.push({
            emoji: '�',
            titulo: 'Progreso Acelerado',
            descripcion: 'Has mejorado significativamente con la práctica',
            porcentaje: Math.round(ultimosTres)
          });
        }
      }

      if (promedioGeneral >= 80 && this.juegosCompletados >= 5) {
        this.fortalezas.push({
          emoji: '🎯',
          titulo: 'Dominio Consistente',
          descripcion: 'Mantienes un alto rendimiento en múltiples ejercicios',
          porcentaje: Math.round(promedioGeneral)
        });
      }

      // DEBILIDADES / ÁREAS DE MEJORA
      if (promedioGeneral < 70 && progressArray.length >= 2) {
        this.debilidades.push({
          emoji: '📚',
          titulo: 'Comprensión en Desarrollo',
          descripcion: 'Continúa practicando para fortalecer tu comprensión lectora',
          porcentaje: Math.round(promedioGeneral),
          consejo: 'Lee cada texto 2 veces'
        });
      }

      // Detectar inconsistencia en resultados
      if (progressArray.length >= 3) {
        const desviacion = Math.sqrt(
          puntajes.map(x => Math.pow(x - promedioGeneral, 2)).reduce((a,b) => a+b) / puntajes.length
        );
        
        if (desviacion > 25) {
          this.debilidades.push({
            emoji: '⚡',
            titulo: 'Resultados Variables',
            descripcion: 'Tu rendimiento varía entre ejercicios',
            porcentaje: Math.round(promedioGeneral),
            consejo: 'Mantén concentración constante'
          });
        }
      }

      if (this.rachaActual < 2 && this.juegosCompletados >= 2) {
        this.debilidades.push({
          emoji: '📅',
          titulo: 'Práctica Espaciada',
          descripcion: 'La práctica regular mejora la retención',
          porcentaje: this.rachaActual * 50,
          consejo: 'Practica un poco cada día'
        });
      }

      // Si hay puntajes bajos recientes
      const ultimosPuntajes = progressArray.slice(-3).map(p => p.score);
      const promedioReciente = ultimosPuntajes.reduce((a,b) => a+b, 0) / ultimosPuntajes.length;
      
      if (promedioReciente < 60 && progressArray.length >= 3) {
        this.debilidades.push({
          emoji: '🎲',
          titulo: 'Desafíos Recientes',
          descripcion: 'Tus últimos ejercicios presentaron dificultad',
          porcentaje: Math.round(promedioReciente),
          consejo: 'Revisa las reglas antes de empezar'
        });
      }

      // Si no hay debilidades detectadas pero hay margen de mejora
      if (this.debilidades.length === 0 && promedioGeneral < 95 && progressArray.length >= 2) {
        this.debilidades.push({
          emoji: '🚀',
          titulo: 'Camino a la Excelencia',
          descripcion: 'Vas muy bien, sigue practicando para alcanzar el 100%',
          porcentaje: Math.round(promedioGeneral),
          consejo: 'Lee con atención los detalles'
        });
      }

      // Limitar a máximo 3 fortalezas y 3 debilidades
      this.fortalezas = this.fortalezas.slice(0, 3);
      this.debilidades = this.debilidades.slice(0, 3);
    },
  }
}
</script>

<style scoped>
/* UI-06: el carrusel de logros se reemplazó por una grilla; sus estilos quedan comentados.
.overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #a78bfa; border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #8b5cf6; } */

.progreso {
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
.progreso__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.625rem;
  line-height: 1.2;
  color: #14233b;
}
.progreso__bajada { margin: 0.25rem 0 0; font-size: 1rem; color: #52627a; }
.progreso__fila { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }

.antetitulo {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Ícono en recuadro de color pálido (mismo patrón que las unidades de Inicio) */
.icono {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icono svg { width: 1.625rem; height: 1.625rem; }
.icono--grande { width: 3.5rem; height: 3.5rem; border-radius: 1rem; }
.icono--grande svg { width: 1.875rem; height: 1.875rem; }

/* Resumen */
.resumen { display: flex; flex-direction: column; gap: 1rem; padding: 1.125rem; }
.resumen__cabecera { display: flex; align-items: center; gap: 0.875rem; }
.resumen__nivel {
  margin: 0.125rem 0 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: #14233b;
}
.resumen__mensaje { margin: 0; font-size: 1rem; line-height: 1.45; color: #3a4960; }
.resumen__avance { display: flex; flex-direction: column; gap: 0.4375rem; }
.resumen__avance-fila { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
.resumen__avance-nombre { font-size: 0.875rem; font-weight: 700; color: #14233b; }
.resumen__avance-dato { font-size: 0.875rem; font-weight: 700; color: #3a4960; }
.resumen__nota { font-size: 0.8125rem; color: #52627a; }

/* Próximo logro */
.proximo { display: flex; flex-direction: column; gap: 0.75rem; padding: 1.125rem; }
.proximo__logro { display: flex; align-items: center; gap: 0.75rem; }
.proximo__nombre {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.0625rem;
  color: #14233b;
}
.proximo__falta { margin: 0.125rem 0 0; font-size: 0.875rem; color: #52627a; }
.proximo__leo { margin-top: auto; }

/* Cifras */
.cifras { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.625rem; }
.cifra { display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.875rem 0.625rem; border-radius: 1rem; }
.icono--cifra { width: 2.25rem; height: 2.25rem; border-radius: 0.6875rem; }
.icono--cifra svg { width: 1.25rem; height: 1.25rem; }
.cifra__valor {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.375rem;
  line-height: 1.1;
  color: #14233b;
}
.cifra__nombre { margin: 0.125rem 0 0; font-size: 0.8125rem; font-weight: 700; line-height: 1.25; color: #3a4960; }
.cifra__nota { display: none; margin: 0.125rem 0 0; font-size: 0.8125rem; color: #52627a; }

/* Encabezado de sección */
.seccion__cabecera { display: flex; align-items: baseline; justify-content: space-between; gap: 0.5rem; }
.seccion__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
}
.seccion__dato { font-size: 0.875rem; font-weight: 700; color: #3a4960; }

/* Logros */
.logros { display: flex; flex-direction: column; gap: 0.625rem; }
.logros__grilla {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.625rem;
}
.logros__grilla li { display: flex; }
.logro {
  width: 100%;
  min-height: 9.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem;
  border: 1px solid #d9e4f1;
  border-radius: 1rem;
  background: #ffffff;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.logro:active { transform: scale(0.98); }
.logro:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.logro--bloqueado { background: #f6f8fb; }
.logro__cabecera { display: flex; align-items: flex-start; justify-content: space-between; width: 100%; }
.logro__icono { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; }
.logro__icono svg { width: 1.375rem; height: 1.375rem; }
.logro__nuevo {
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  background: #2568c4;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
}
.logro__textos { display: flex; flex-direction: column; gap: 0.125rem; }
.logro__nombre { font-family: 'Lexend', system-ui, sans-serif; font-weight: 600; font-size: 0.9375rem; color: #14233b; }
.logro__desc { font-size: 0.8125rem; color: #52627a; }
.logro__pie { margin-top: auto; display: flex; flex-direction: column; gap: 0.3125rem; width: 100%; }
.logro__barra { display: block; height: 6px; border-radius: 999px; background: #dfe8f3; overflow: hidden; }
.logro__relleno { display: block; height: 100%; border-radius: 999px; background: #8a99ad; transition: width 0.5s ease; }
.logro__estado { font-size: 0.8125rem; font-weight: 700; color: #52627a; }
.logro__estado--ok { color: #1f6b40; }

/* Brillo al tocar un logro desbloqueado */
.logro--brilla .logro__icono { animation: logro-brillo 0.9s ease-out; }
@keyframes logro-brillo {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.55); }
  35% { transform: scale(1.12); box-shadow: 0 0 0 8px rgba(255, 193, 7, 0.25); }
  100% { transform: scale(1); box-shadow: 0 0 0 14px rgba(255, 193, 7, 0); }
}

/* Fortalezas y Para seguir creciendo */
.analisis { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.analisis__tarjeta { display: flex; flex-direction: column; gap: 0.875rem; padding: 1.125rem; }
.analisis__cabecera { display: flex; align-items: center; gap: 0.75rem; }
.analisis__leo { margin-left: auto; flex-shrink: 0; margin-top: -0.5rem; } /* UI-10 */
.analisis__lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.875rem; }
.analisis__item { display: flex; flex-direction: column; gap: 0.25rem; padding-top: 0.875rem; border-top: 1px solid #e8eef6; }
.analisis__item:first-child { padding-top: 0; border-top: 0; }
.analisis__item-titulo { margin: 0; font-weight: 700; font-size: 1rem; color: #14233b; }
.analisis__item-texto { margin: 0; font-size: 0.9375rem; line-height: 1.4; color: #3a4960; }
.analisis__item-barra { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.25rem; }
.analisis__item-dato { font-size: 0.875rem; font-weight: 700; color: #3a4960; }
.analisis__consejo {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  margin: 0.25rem 0 0;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: #fff3cf;
  color: #8a5a00;
  font-size: 0.8125rem;
  font-weight: 700;
}
.analisis__vacio { display: flex; flex-direction: column; gap: 0.25rem; }

/* Panel de un logro */
.detalle__como { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #3a4960; }
.detalle__logrado { margin: 0; font-weight: 700; color: #1f6b40; }
.detalle__avance { display: flex; flex-direction: column; gap: 0.375rem; }
.detalle__dato { margin: 0; font-size: 0.9375rem; font-weight: 700; color: #3a4960; }

/* Tablet */
@media (min-width: 768px) {
  .progreso { padding: 1.75rem 1.5rem 2.5rem; gap: 1.5rem; }
  .progreso__titulo { font-size: 2rem; }
  .progreso__bajada { font-size: 1.125rem; }
  .progreso__fila { grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 1.25rem; }
  .resumen { padding: 1.5rem 1.75rem; }
  .resumen__nivel { font-size: 1.5rem; }
  .resumen__mensaje { font-size: 1.0625rem; }
  .proximo { padding: 1.375rem 1.5rem; }
  .proximo__nombre { font-size: 1.1875rem; }
  .cifras { gap: 1.25rem; }
  .cifra { flex-direction: row; align-items: center; gap: 1rem; padding: 1.125rem 1.25rem; border-radius: 1.25rem; }
  .icono--cifra { width: 3rem; height: 3rem; border-radius: 0.875rem; }
  .icono--cifra svg { width: 1.625rem; height: 1.625rem; }
  .cifra__valor { font-size: 1.75rem; }
  .cifra__nombre { font-size: 0.9375rem; }
  .cifra__nota { display: block; }
  .seccion__titulo { font-size: 1.375rem; }
  .logros__grilla { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
  .logro { min-height: 10.5rem; padding: 1rem; border-radius: 1.125rem; }
  .analisis { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
  .analisis__tarjeta { padding: 1.5rem; }
}
/* Escritorio */
@media (min-width: 1024px) {
  .progreso { padding: 1.5rem 2.5rem 2.5rem 1.5rem; }
  .logros__grilla { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
/* En la columna más angosta de tablet, las cifras se apilan para que quepan */
@media (min-width: 768px) and (max-width: 1199px) {
  .cifra { flex-direction: column; align-items: flex-start; }
}

/* Entrada: las tarjetas aparecen una vez por sesión (se apaga con las preferencias) */
.progreso--entrada .progreso__cabecera,
.progreso--entrada .progreso__fila,
.progreso--entrada .cifras,
.progreso--entrada .logros,
.progreso--entrada .analisis {
  animation: progreso-aparece 0.45s ease-out both;
}
.progreso--entrada .progreso__fila { animation-delay: 0.05s; }
.progreso--entrada .cifras { animation-delay: 0.1s; }
.progreso--entrada .logros { animation-delay: 0.15s; }
.progreso--entrada .analisis { animation-delay: 0.2s; }
@keyframes progreso-aparece {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .progreso--entrada .progreso__cabecera,
  .progreso--entrada .progreso__fila,
  .progreso--entrada .cifras,
  .progreso--entrada .logros,
  .progreso--entrada .analisis,
  .logro--brilla .logro__icono { animation: none; }
  .logro, .logro__relleno { transition: none; }
  .logro:active { transform: none; }
}
html[data-animaciones="off"] .progreso--entrada .progreso__cabecera,
html[data-animaciones="off"] .progreso--entrada .progreso__fila,
html[data-animaciones="off"] .progreso--entrada .cifras,
html[data-animaciones="off"] .progreso--entrada .logros,
html[data-animaciones="off"] .progreso--entrada .analisis,
html[data-animaciones="off"] .logro--brilla .logro__icono { animation: none; }
html[data-animaciones="off"] .logro,
html[data-animaciones="off"] .logro__relleno { transition: none; }
</style>
