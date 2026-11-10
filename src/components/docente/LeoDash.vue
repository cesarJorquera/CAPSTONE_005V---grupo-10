<template>
  <div class="leo-dash mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
    <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-leo-azul-osc">Espacio docente</p>
        <h1 class="mt-1 flex items-center gap-2 text-3xl font-black text-leo-tinta">
          Leo Dash
          <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="" class="leo-dash__logo h-9 w-9 object-contain">
        </h1>
        <p class="mt-1 text-leo-texto">Actividad y desempeño a partir de respuestas registradas.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full border px-3 py-1.5 text-xs font-extrabold" :class="estadoRealtime === 'SUBSCRIBED' ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-amber-300 bg-amber-50 text-amber-950'">
          {{ estadoRealtime === 'SUBSCRIBED' ? 'Actualización en vivo' : 'Actualización manual' }}
        </span>
        <button type="button" class="leo-dash__button-secondary rounded-xl px-4 py-2.5 font-bold" :disabled="cargando" @click="cargarDatos">
          {{ cargando ? 'Actualizando…' : 'Actualizar' }}
        </button>
        <button
          type="button"
          class="leo-dash__button-secondary rounded-xl px-4 py-2.5 font-bold"
          @click="$emit('volver')"
        >
          ← Volver
        </button>
      </div>
    </header>

    <nav class="mb-5 flex gap-2 overflow-x-auto border-b border-leo-linea" aria-label="Secciones de Leo Dash">
      <button
        type="button"
        class="leo-dash__tab whitespace-nowrap px-4 py-3 text-sm font-extrabold"
        :class="vistaActiva === 'rendimiento' ? 'leo-dash__tab--activa' : ''"
        :aria-current="vistaActiva === 'rendimiento' ? 'page' : null"
        @click="vistaActiva = 'rendimiento'"
      >Rendimiento lector</button>
      <button
        type="button"
        class="leo-dash__tab whitespace-nowrap px-4 py-3 text-sm font-bold"
        :class="vistaActiva === 'aula' ? 'leo-dash__tab--activa' : ''"
        :aria-current="vistaActiva === 'aula' ? 'page' : null"
        @click="vistaActiva = 'aula'"
      >Leo Ideas · Aula</button>
    </nav>

    <section v-if="vistaActiva === 'rendimiento'" aria-labelledby="rendimiento-titulo">
      <div class="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="rendimiento-titulo" class="text-xl font-black text-leo-tinta">Avance de lectura</h2>
          <p class="mt-1 text-sm text-leo-texto">Actividad, precisión y habilidades trabajadas.</p>
        </div>
        <div class="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3">
          <label class="text-xs font-bold text-leo-texto">
            Periodo
            <select v-model.number="periodo" class="leo-dash__select mt-1 block w-full">
              <option :value="7">Últimos 7 días</option>
              <option :value="30">Últimos 30 días</option>
            </select>
          </label>
          <label class="text-xs font-bold text-leo-texto">
            Unidad
            <select v-model="unidadFiltro" class="leo-dash__select mt-1 block w-full">
              <option value="todas">Todas</option>
              <option value="1">Unidad 1</option>
              <option value="2">Unidad 2</option>
            </select>
          </label>
          <label class="col-span-2 text-xs font-bold text-leo-texto sm:col-span-1">
            Cuenta
            <select v-model="estudianteFiltro" class="leo-dash__select mt-1 block w-full">
              <option value="todos">Todas las cuentas</option>
              <option v-for="alumno in estudiantes" :key="alumno.id" :value="alumno.id">{{ nombreCuenta(alumno) }}</option>
            </select>
          </label>
        </div>
      </div>

      <p v-if="errorCarga" class="mb-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold leading-relaxed text-rose-950" role="alert">
        {{ errorCarga }}
      </p>
      <p v-else-if="cargando && !datos" class="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950" role="status">Cargando actividad real desde Supabase…</p>
      <div v-else class="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
        Acceso docente global: incluye a todos los alumnos. Tu cuenta también aparece para pruebas. Datos actualizados: {{ fechaActualizacion }}.
        <span v-if="estadoRealtime !== 'SUBSCRIBED'">La suscripción en vivo no está disponible; usa Actualizar para consultar los datos más recientes.</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article class="leo-dash__metric rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-sm font-bold text-leo-texto">Cuentas activas</p>
          <p class="mt-2 text-3xl font-black text-leo-tinta">{{ estudiantesActivos }}</p>
          <p class="mt-1 text-xs text-leo-suave">con respuestas en los filtros activos</p>
        </article>
        <article class="leo-dash__metric rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-sm font-bold text-leo-texto">Respuestas recibidas</p>
          <p class="mt-2 text-3xl font-black text-leo-tinta">{{ respuestasTotales }}</p>
          <p class="mt-1 text-xs text-leo-suave">{{ primerosIntentos }} primeros intentos · {{ errores }} respuestas incorrectas en total</p>
        </article>
        <article class="leo-dash__metric rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-sm font-bold text-leo-texto">Precisión al primer intento</p>
          <p class="mt-2 text-3xl font-black text-leo-azul-osc">{{ precisionInicial }}%</p>
          <p class="mt-1 text-xs text-leo-suave">{{ correctasPrimerIntento }} correctas de {{ primerosIntentos }} primeras respuestas</p>
        </article>
        <article class="leo-dash__metric rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-sm font-bold text-leo-texto">Sesiones completadas</p>
          <p class="mt-2 text-3xl font-black text-emerald-800">{{ porcentajeCompletadas }}%</p>
          <p class="mt-1 text-xs text-leo-suave">{{ completadas }} de {{ totalSesiones }} sesiones iniciadas</p>
        </article>
      </div>

      <section class="mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="comparacion-unidades-titulo">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="comparacion-unidades-titulo" class="text-lg font-black text-leo-tinta">Desempeño por unidad</h3>
            <p class="mt-1 text-sm text-leo-texto">Respuestas correctas al primer intento · últimos {{ periodo }} días</p>
          </div>
          <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-900">Unidad 1: lenguaje · Unidad 2: comprensión lectora</span>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="unidad in resumenesUnidades"
            :key="unidad.id"
            class="leo-dash__unidad rounded-2xl border p-4 sm:p-5"
            :class="unidad.id === 1 ? 'leo-dash__unidad--azul' : 'leo-dash__unidad--verde'"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-wide" :class="unidad.id === 1 ? 'text-blue-800' : 'text-teal-800'">Unidad {{ unidad.id }}</p>
                <h4 class="mt-1 text-lg font-black text-leo-tinta">{{ unidad.titulo }}</h4>
              </div>
              <strong class="text-3xl font-black tabular-nums" :class="unidad.id === 1 ? 'text-blue-800' : 'text-teal-800'">
                {{ unidad.precision === null ? '—' : `${unidad.precision}%` }}
              </strong>
            </div>
            <div class="mt-4 h-3 overflow-hidden rounded-full bg-white/80" role="progressbar" :aria-valuenow="unidad.precision || 0" aria-valuemin="0" aria-valuemax="100" :aria-label="`Unidad ${unidad.id}: ${unidad.precision === null ? 'sin respuestas' : unidad.precision + '% de precisión inicial'}`">
              <div
                class="leo-dash__barra h-full rounded-full transition-all duration-700"
                :class="unidad.id === 1 ? 'leo-dash__barra--azul' : 'leo-dash__barra--verde'"
                :style="{ width: `${unidad.precision || 0}%` }"
              ></div>
            </div>
            <div class="mt-3 flex flex-wrap justify-between gap-2 text-xs font-semibold text-slate-700">
              <span>{{ unidad.correctas }} correctas de {{ unidad.respuestas }} primeras respuestas</span>
              <span>{{ unidad.sesionesCompletadas }} de {{ unidad.sesiones }} actividades terminadas</span>
            </div>
            <div class="mt-4">
              <div class="mb-1.5 flex justify-between text-xs font-bold text-slate-700">
                <span>Estado de las actividades</span>
                <span>{{ unidad.sesiones }} iniciadas</span>
              </div>
              <div class="flex h-2.5 overflow-hidden rounded-full bg-white/80" role="img" :aria-label="`Unidad ${unidad.id}: ${unidad.sesionesCompletadas} completadas, ${unidad.sesionesAbandonadas} abandonadas y ${unidad.sesionesEnCurso} en curso`">
                <span class="bg-emerald-500 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesCompletadas / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesCompletadas} completadas`"></span>
                <span class="bg-rose-400 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesAbandonadas / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesAbandonadas} abandonadas`"></span>
                <span class="bg-amber-400 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesEnCurso / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesEnCurso} en curso`"></span>
              </div>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-600">
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></i>{{ unidad.sesionesCompletadas }} completadas</span>
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-rose-400"></i>{{ unidad.sesionesAbandonadas }} abandonadas</span>
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400"></i>{{ unidad.sesionesEnCurso }} en curso</span>
              </div>
            </div>
            <p v-if="!unidad.respuestas" class="mt-3 text-xs font-medium text-slate-600">Aún no hay respuestas en el periodo seleccionado.</p>
          </article>
        </div>
        <p class="mt-4 text-xs leading-relaxed text-leo-suave">
          La comparación usa las cuentas y el periodo seleccionados, pero no el filtro de unidad. Unidad 3 aún no está disponible; cuando tenga actividades y códigos de habilidad podrá aparecer aquí.
        </p>
      </section>

      <details class="mt-3 rounded-2xl border border-leo-linea bg-white px-4 py-3 text-sm text-leo-texto">
        <summary class="cursor-pointer font-extrabold text-leo-azul-osc">¿Cómo leo estas métricas?</summary>
        <dl class="mt-3 grid gap-3 sm:grid-cols-2">
          <div><dt class="font-bold text-leo-tinta">Cuentas activas</dt><dd>Personas con al menos una respuesta durante el periodo y la unidad elegidos.</dd></div>
          <div><dt class="font-bold text-leo-tinta">Respuestas recibidas</dt><dd>Incluye intentos iniciales y reintentos. Los errores cuentan respuestas incorrectas, no estudiantes distintos.</dd></div>
          <div><dt class="font-bold text-leo-tinta">Precisión inicial</dt><dd>Porcentaje de respuestas correctas en el primer intento de cada pregunta. No incluye reintentos. La vista por unidad compara lenguaje (U1) y comprensión lectora (U2).</dd></div>
          <div><dt class="font-bold text-leo-tinta">Sesiones completadas</dt><dd>Porcentaje de partidas terminadas sobre todas las iniciadas en el periodo; las abandonadas y en curso no cuentan como terminadas.</dd></div>
        </dl>
        <p class="mt-3 border-t border-leo-linea pt-3 text-xs leading-relaxed text-leo-suave">
          Las habilidades se agrupan con etiquetas técnicas del contenido y aún no son una evaluación pedagógica validada. Los logros de la tabla son estimaciones derivadas, no logros guardados como registros individuales.
        </p>
      </details>

      <div class="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section class="rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="habilidades-titulo">
          <div class="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3 id="habilidades-titulo" class="text-lg font-black text-leo-tinta">Habilidades lectoras</h3>
              <p class="mt-1 text-sm text-leo-texto">Precisión por habilidad en las respuestas del periodo.</p>
            </div>
            <span class="rounded-full bg-leo-cielo px-3 py-1 text-xs font-extrabold text-leo-azul-osc">{{ nombreUnidadFiltro }}</span>
          </div>
          <div v-if="habilidades.length" class="space-y-4">
            <div v-for="habilidad in habilidades" :key="habilidad.clave">
              <div class="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span class="font-bold text-leo-tinta">{{ habilidad.nombre }}</span>
                <span class="font-extrabold text-leo-azul-osc">{{ habilidad.precisionInicial }}%</span>
              </div>
              <div class="h-2.5 overflow-hidden rounded-full bg-blue-50" role="progressbar" :aria-valuenow="habilidad.precisionInicial" aria-valuemin="0" aria-valuemax="100" :aria-label="habilidad.nombre + ': ' + habilidad.precisionInicial + '%'">
                <div class="h-full rounded-full bg-gradient-to-r from-blue-800 to-sky-400 transition-all" :style="{ width: habilidad.precisionInicial + '%' }"></div>
              </div>
              <p class="mt-1 text-xs text-leo-suave">{{ habilidad.primerosIntentos }} primeras respuestas · {{ habilidad.intentos }} respuestas contando reintentos · {{ habilidad.errores }} incorrectas</p>
            </div>
          </div>
          <p v-else class="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">No hay respuestas para los filtros seleccionados.</p>
        </section>

        <section class="rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="actividad-titulo">
          <div class="mb-4">
            <h3 id="actividad-titulo" class="text-lg font-black text-leo-tinta">Respuestas recientes</h3>
            <p class="mt-1 text-sm text-leo-texto">Los errores muestran la respuesta enviada para facilitar el refuerzo.</p>
          </div>
          <ul v-if="respuestasRecientes.length" class="divide-y divide-leo-linea">
            <li v-for="respuesta in respuestasRecientes" :key="respuesta.id" class="py-3 first:pt-0 last:pb-0">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black" :class="respuesta.correct ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'">
                  {{ respuesta.correct ? '✓' : '!' }}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-extrabold text-leo-tinta">{{ respuesta.isTeacher ? 'Tu prueba docente · ' : '' }}{{ respuesta.studentName }}</span>
                  <span class="block truncate text-xs text-leo-suave">U{{ respuesta.unitId }} · {{ nombreHabilidad(respuesta.assessmentCode) }} · {{ nombreActividad(respuesta) }}</span>
                </span>
                <span class="text-right">
                  <span class="block text-sm font-black" :class="respuesta.correct ? 'text-emerald-800' : 'text-rose-800'">{{ respuesta.correct ? 'Correcta' : 'Incorrecta' }}</span>
                  <span class="block text-xs text-leo-suave">{{ tiempoRelativo(respuesta.answeredAt) }}</span>
                </span>
              </div>
              <p v-if="!respuesta.correct && respuesta.incorrectAnswer" class="ml-[3.25rem] mt-1 break-words rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-950">Respuesta: {{ formatearRespuesta(respuesta.incorrectAnswer) }}</p>
            </li>
          </ul>
          <p v-else class="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">No hay respuestas para los filtros seleccionados.</p>
        </section>
      </div>

      <section class="mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="estudiantes-titulo">
        <div class="mb-4">
          <h3 id="estudiantes-titulo" class="text-lg font-black text-leo-tinta">Progreso personal</h3>
          <p class="mt-1 text-sm text-leo-texto">La racha cuenta días seguidos con respuestas; Unidad 1 cuenta pasos completados y Unidad 2, retos perfectos. Los logros se estiman desde esos datos.</p>
        </div>
        <div v-if="estudiantesFiltrados.length" class="overflow-x-auto">
          <table class="w-full min-w-[850px] text-left text-sm">
            <thead class="border-b border-leo-linea text-xs uppercase text-leo-suave">
              <tr>
                <th scope="col" class="px-3 py-3">Estudiante</th>
                <th scope="col" class="px-3 py-3">Actividad</th>
                <th scope="col" class="px-3 py-3">U1 · Las palabras</th>
                <th scope="col" class="px-3 py-3">U2 · Comprensión</th>
                <th scope="col" class="px-3 py-3">Racha</th>
                <th scope="col" class="px-3 py-3">Logros</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-leo-linea">
              <tr v-for="alumno in estudiantesFiltrados" :key="alumno.id">
                <th scope="row" class="px-3 py-3 font-extrabold text-leo-tinta">
                  {{ nombreCuenta(alumno) }}
                  <span class="block text-xs font-normal text-leo-suave">{{ alumno.lastActivityAt ? tiempoRelativo(alumno.lastActivityAt) : 'Sin respuestas aún' }}</span>
                </th>
                <td class="px-3 py-3 text-leo-texto">{{ resumenActividadPeriodo(alumno) }}</td>
                <td class="px-3 py-3 text-leo-texto">{{ progresoRuta(alumno, 1) }}</td>
                <td class="px-3 py-3 text-leo-texto">{{ progresoRuta(alumno, 2) }}</td>
                <td class="px-3 py-3 font-bold text-leo-texto">{{ alumno.currentStreakDays }} días <span class="block text-xs font-normal text-leo-suave">{{ alumno.activeDays }} días activos total</span></td>
                <td class="px-3 py-3 text-leo-texto">{{ cantidadLogros(alumno) }} desbloqueados</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">No hay estudiantes registrados.</p>
      </section>
    </section>

    <section v-else class="space-y-4" aria-labelledby="aula-titulo">
      <article class="flex flex-col justify-between gap-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div class="flex items-start gap-4">
          <span class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-900" aria-hidden="true">✦</span>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 id="aula-titulo" class="text-xl font-black text-leo-tinta">Leo Ideas</h2>
              <span class="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-950">Control de aula</span>
            </div>
            <p class="mt-1 max-w-2xl text-sm leading-relaxed text-leo-texto">
              Controla una sesión en vivo desde tu celular: abre el lobby, lanza la pregunta y muestra las respuestas.
            </p>
          </div>
        </div>
        <button
          type="button"
          class="leo-dash__button-primary rounded-xl px-6 py-3 font-extrabold"
          data-test="btn-control-leo-ideas"
          @click="$emit('abrir-control-leo-ideas')"
        >Abrir control</button>
      </article>
      <p class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950">
        Abre Leo Aula en la pantalla conectada al proyector y usa este control para manejar las etapas de la actividad.
      </p>
    </section>
  </div>
</template>

<script>
import unidad1 from '@/data/ruta/unidad1'
import unidad2 from '@/data/ruta/unidad2'
import { cargarDatosDashboardDocente, escucharCambiosDashboardDocente } from '@/utils/docenteDashboard'

const ETIQUETAS_HABILIDAD = {
  'reading.identificar_idea_principal': 'Idea principal',
  'reading.identificar_causa_efecto': 'Causa y efecto',
  'reading.hacer_inferencias': 'Inferencias',
  'reading.identificar_detalles_especificos': 'Detalles específicos',
  'reading.identificar_proposito_intencion': 'Propósito e intención',
  'reading.comparar_fuentes': 'Comparar fuentes',
  'reading.reconocer_tono': 'Tono',
  'language.noun': 'Sustantivos',
  'language.verb': 'Verbos',
  'language.adjective': 'Adjetivos',
  'language.adverb': 'Adverbios',
  'language.connector': 'Conectores',
  'language.keyword_concepts': 'Conceptos clave',
  'language.word_classification': 'Clasificación de palabras',
  sin_clasificar: 'Sin habilidad clasificada'
}

function actividadesUnicas(lista) {
  return new Set((lista || []).map(item => Number(item.gameId) + ':' + item.contentId))
}

export default {
  name: 'LeoDash',
  emits: ['abrir-control-leo-ideas', 'volver'],
  data() {
    return {
      vistaActiva: 'rendimiento',
      periodo: 7,
      unidadFiltro: 'todas',
      estudianteFiltro: 'todos',
      datos: null,
      cargando: false,
      errorCarga: '',
      estadoRealtime: 'CONNECTING',
      detenerRealtime: null,
      temporizadorActualizacion: null,
      solicitud: 0
    }
  },
  watch: {
    periodo() {
      this.cargarDatos()
    }
  },
  mounted() {
    this.cargarDatos()
    try {
      this.detenerRealtime = escucharCambiosDashboardDocente(
        () => {
          clearTimeout(this.temporizadorActualizacion)
          this.temporizadorActualizacion = setTimeout(() => this.cargarDatos(), 450)
        },
        estado => { this.estadoRealtime = estado }
      )
    } catch (error) {
      console.error('No se pudo iniciar la actualización en vivo de Leo Dash:', error)
      this.estadoRealtime = 'CHANNEL_ERROR'
    }
  },
  beforeUnmount() {
    clearTimeout(this.temporizadorActualizacion)
    if (this.detenerRealtime) this.detenerRealtime()
  },
  computed: {
    estudiantes() {
      return this.datos ? this.datos.students : []
    },
    estudiantesFiltrados() {
      if (this.estudianteFiltro === 'todos') return this.estudiantes
      return this.estudiantes.filter(alumno => alumno.id === this.estudianteFiltro)
    },
    habilidadesFiltradas() {
      return this.estudiantesFiltrados.flatMap(alumno =>
        (alumno.periodSkills || []).filter(habilidad =>
          this.unidadFiltro === 'todas' || String(habilidad.unitId) === this.unidadFiltro
        ).map(habilidad => ({ ...habilidad, userId: alumno.id }))
      )
    },
    resumenesUnidades() {
      return [1, 2].map(id => {
        const alumnos = this.estudiantesFiltrados
        const habilidades = alumnos.flatMap(alumno =>
          (alumno.periodSkills || []).filter(habilidad => Number(habilidad.unitId) === id)
        )
        const sesiones = alumnos.flatMap(alumno =>
          (alumno.periodSessions || []).filter(sesion => Number(sesion.unitId) === id)
        )
        const primeras = habilidades.reduce((total, habilidad) => total + Number(habilidad.firstAttempts || 0), 0)
        const correctas = habilidades.reduce((total, habilidad) => total + Number(habilidad.firstCorrect || 0), 0)
        const totalSesiones = sesiones.reduce((total, sesion) => total + Number(sesion.total || 0), 0)
        const sesionesCompletadas = sesiones.reduce((total, sesion) => total + Number(sesion.completed || 0), 0)
        const sesionesAbandonadas = sesiones.reduce((total, sesion) => total + Number(sesion.abandoned || 0), 0)
        const sesionesEnCurso = sesiones.reduce((total, sesion) => total + Number(sesion.inProgress || 0), 0)
        return {
          id,
          titulo: id === 1 ? 'Lenguaje' : 'Comprensión lectora',
          respuestas: primeras,
          correctas,
          precision: primeras ? Math.round((correctas / primeras) * 100) : null,
          sesiones: totalSesiones,
          sesionesCompletadas,
          sesionesAbandonadas,
          sesionesEnCurso
        }
      })
    },
    sesionesFiltradas() {
      return this.estudiantesFiltrados.flatMap(alumno =>
        (alumno.periodSessions || []).filter(sesion =>
          this.unidadFiltro === 'todas' || String(sesion.unitId) === this.unidadFiltro
        )
      )
    },
    respuestasTotales() {
      return this.habilidadesFiltradas.reduce((total, item) => total + Number(item.attempts || 0), 0)
    },
    errores() {
      return this.habilidadesFiltradas.reduce((total, item) =>
        total + Number(item.attempts || 0) - Number(item.correctAttempts || 0), 0
      )
    },
    primerosIntentos() {
      return this.habilidadesFiltradas.reduce((total, item) => total + Number(item.firstAttempts || 0), 0)
    },
    correctasPrimerIntento() {
      return this.habilidadesFiltradas.reduce((total, item) => total + Number(item.firstCorrect || 0), 0)
    },
    precisionInicial() {
      return this.primerosIntentos
        ? Math.round((this.correctasPrimerIntento / this.primerosIntentos) * 100)
        : 0
    },
    estudiantesActivos() {
      return new Set(this.habilidadesFiltradas.filter(item => Number(item.attempts) > 0).map(item => item.userId)).size
    },
    totalSesiones() {
      return this.sesionesFiltradas.reduce((total, item) => total + Number(item.total || 0), 0)
    },
    completadas() {
      return this.sesionesFiltradas.reduce((total, item) => total + Number(item.completed || 0), 0)
    },
    porcentajeCompletadas() {
      return this.totalSesiones ? Math.round((this.completadas / this.totalSesiones) * 100) : 0
    },
    nombreUnidadFiltro() {
      return this.unidadFiltro === 'todas' ? 'Todas las unidades' : 'Unidad ' + this.unidadFiltro
    },
    habilidades() {
      const agrupadas = new Map()
      this.habilidadesFiltradas.forEach(item => {
        const clave = item.unitId + ':' + item.code
        const previa = agrupadas.get(clave) || {
          clave,
          unitId: item.unitId,
          nombre: this.nombreHabilidad(item.code),
          intentos: 0,
          correctos: 0,
          primerosIntentos: 0,
          primerosCorrectos: 0
        }
        previa.intentos += Number(item.attempts || 0)
        previa.correctos += Number(item.correctAttempts || 0)
        previa.primerosIntentos += Number(item.firstAttempts || 0)
        previa.primerosCorrectos += Number(item.firstCorrect || 0)
        agrupadas.set(clave, previa)
      })
      return [...agrupadas.values()]
        .map(item => ({
          ...item,
          errores: item.intentos - item.correctos,
          precisionInicial: item.primerosIntentos
            ? Math.round((item.primerosCorrectos / item.primerosIntentos) * 100)
            : 0
        }))
        .sort((a, b) => a.unitId - b.unitId || a.nombre.localeCompare(b.nombre, 'es'))
    },
    respuestasRecientes() {
      if (!this.datos) return []
      return this.datos.recentResponses.filter(respuesta =>
        (this.unidadFiltro === 'todas' || String(respuesta.unitId) === this.unidadFiltro) &&
        (this.estudianteFiltro === 'todos' || respuesta.userId === this.estudianteFiltro)
      ).slice(0, 12)
    },
    fechaActualizacion() {
      if (!this.datos || !this.datos.generatedAt) return '—'
      return new Date(this.datos.generatedAt).toLocaleString('es-CL')
    }
  },
  methods: {
    async cargarDatos() {
      const solicitud = ++this.solicitud
      this.cargando = true
      this.errorCarga = ''
      try {
        const datos = await cargarDatosDashboardDocente(this.periodo)
        if (solicitud === this.solicitud) this.datos = datos
      } catch (error) {
        console.error('No se pudo cargar Leo Dash desde Supabase:', error)
        if (solicitud === this.solicitud) {
          this.errorCarga = error && error.code === '42501'
            ? 'Tu cuenta no tiene permiso para ver el dashboard. Confirma que el perfil tenga rol docente y que se haya aplicado la migración 005.'
            : 'No se pudieron cargar las métricas. Confirma que la migración 005 esté aplicada y vuelve a intentar.'
        }
      } finally {
        if (solicitud === this.solicitud) this.cargando = false
      }
    },
    nombreCuenta(cuenta) {
      return cuenta.isTeacher ? `Tu cuenta docente · ${cuenta.name}` : cuenta.name
    },
    nombreHabilidad(codigo) {
      return ETIQUETAS_HABILIDAD[codigo] || String(codigo || 'Sin habilidad clasificada')
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, letra => letra.toLocaleUpperCase('es'))
    },
    tiempoRelativo(fecha) {
      if (!fecha) return 'Sin actividad'
      const minutos = Math.max(0, Math.floor((Date.now() - new Date(fecha).getTime()) / 60000))
      if (minutos < 1) return 'Ahora'
      if (minutos < 60) return `Hace ${minutos} min`
      const horas = Math.floor(minutos / 60)
      if (horas < 24) return `Hace ${horas} h`
      const dias = Math.floor(horas / 24)
      if (dias < 30) return `Hace ${dias} d`
      return new Date(fecha).toLocaleDateString('es-CL')
    },
    formatearRespuesta(respuesta) {
      if (typeof respuesta === 'string') return respuesta
      if (typeof respuesta === 'number' || typeof respuesta === 'boolean') return String(respuesta)
      if (Array.isArray(respuesta)) return respuesta.map(item => this.formatearRespuesta(item)).filter(Boolean).join(', ')
      if (!respuesta || typeof respuesta !== 'object') return ''

      const priorizados = ['respuesta', 'text', 'selected', 'word', 'alternativeId', 'wordType']
      const campo = priorizados.find(clave => respuesta[clave] !== null && respuesta[clave] !== undefined)
      if (campo) {
        const valor = this.formatearRespuesta(respuesta[campo])
        if (campo === 'word' && respuesta.wordType) {
          return `${valor} · ${this.formatearRespuesta(respuesta.wordType)}`
        }
        return valor
      }

      return Object.values(respuesta)
        .map(valor => this.formatearRespuesta(valor))
        .filter(Boolean)
        .join(' · ')
    },
    nombreActividad(respuesta) {
      const itemId = String(respuesta.itemId || '')
      if (Number(respuesta.unitId) === 2) {
        const tareaId = itemId.replace(/-pregunta$/, '')
        return unidad2.tareas[tareaId]?.titulo || 'Actividad de comprensión'
      }
      const tareaId = Object.keys(unidad1.tareas).find(id => itemId.startsWith(id + '-'))
      return tareaId ? unidad1.tareas[tareaId].titulo : 'Actividad de lenguaje'
    },
    resumenActividadPeriodo(alumno) {
      const skills = (alumno.periodSkills || []).filter(item =>
        this.unidadFiltro === 'todas' || String(item.unitId) === this.unidadFiltro
      )
      const respuestas = skills.reduce((total, item) => total + Number(item.attempts || 0), 0)
      const sesiones = (alumno.periodSessions || []).filter(item =>
        this.unidadFiltro === 'todas' || String(item.unitId) === this.unidadFiltro
      ).reduce((total, item) => total + Number(item.total || 0), 0)
      return `${sesiones} sesiones · ${respuestas} respuestas`
    },
    progresoRuta(alumno, numeroUnidad) {
      const ids = actividadesUnicas(numeroUnidad === 1 ? alumno.completedActivities : alumno.passedActivities)
      if (numeroUnidad === 1) {
        const hechos = unidad1.nodos.filter(nodo => ids.has(unidad1.gameId + ':' + nodo.tareaId)).length
        return `${hechos} de ${unidad1.nodos.length} pasos`
      }
      const total = unidad2.habilidades.reduce((suma, habilidad) => suma + habilidad.retos.length, 0)
      const hechos = Object.keys(unidad2.tareas).filter(id => ids.has(unidad2.gameId + ':' + id)).length
      return `${hechos} de ${total} retos`
    },
    cantidadLogros(alumno) {
      const actividades = actividadesUnicas(alumno.completedActivities).size
      const aprobadas = actividadesUnicas(alumno.passedActivities).size
      const precision = alumno.totalAnswers
        ? Number(alumno.correctAnswers) / Number(alumno.totalAnswers)
        : 0
      return [
        actividades >= 1,
        actividades >= 3,
        actividades >= 5,
        actividades >= 10,
        precision >= 0.8,
        precision >= 0.95,
        Number(alumno.currentStreakDays) >= 3,
        Number(alumno.currentStreakDays) >= 7,
        aprobadas > 0
      ].filter(Boolean).length
    }
  }
}
</script>

<style scoped>
.leo-dash {
  color: #3a4960;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}

.leo-dash h1,
.leo-dash h2,
.leo-dash h3,
.leo-dash button {
  font-family: 'Lexend', system-ui, sans-serif;
}

.leo-dash__button-primary,
.leo-dash__button-secondary {
  min-height: 3rem;
  transition: transform 120ms ease, filter 150ms ease, background-color 150ms ease;
}

.leo-dash__button-primary {
  border: 0;
  border-bottom: 4px solid #1b4f9e;
  background: #2568c4;
  color: #fff;
}

.leo-dash__button-primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.leo-dash__button-secondary {
  border: 2px solid #2568c4;
  border-bottom-width: 4px;
  background: #fff;
  color: #1b4f9e;
}

.leo-dash__button-secondary:hover {
  background: #f3f8fd;
}

.leo-dash__button-primary:active,
.leo-dash__button-secondary:active {
  border-bottom-width: 1px;
  transform: translateY(3px);
}

.leo-dash__button-primary:focus-visible,
.leo-dash__button-secondary:focus-visible,
.leo-dash__tab:focus-visible,
.leo-dash__select:focus-visible {
  outline: 3px solid #14233b;
  outline-offset: 3px;
}

.leo-dash__tab {
  border-bottom: 3px solid transparent;
  color: #52627a;
}

.leo-dash__tab:hover {
  color: #1b4f9e;
}

.leo-dash__tab--activa {
  border-bottom-color: #2568c4;
  color: #1b4f9e;
}

.leo-dash__select {
  min-height: 2.75rem;
  border: 1px solid #bfd0e2;
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  color: #14233b;
  font-size: 0.875rem;
}

.leo-dash__metric {
  box-shadow: 0 4px 14px rgba(27, 79, 158, 0.06);
}

.leo-dash__logo {
  animation: leo-dash-entra 700ms cubic-bezier(.2, .8, .2, 1) both;
  transform-origin: center bottom;
}

.leo-dash__unidad {
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.leo-dash__unidad:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(27, 79, 158, 0.08);
}

.leo-dash__unidad--azul {
  border-color: #bfdbfe;
  background: linear-gradient(135deg, #eff6ff, #f8fbff);
}

.leo-dash__unidad--verde {
  border-color: #99f6e4;
  background: linear-gradient(135deg, #f0fdfa, #fbfffe);
}

.leo-dash__barra--azul {
  background: linear-gradient(90deg, #1d4ed8, #38bdf8);
}

.leo-dash__barra--verde {
  background: linear-gradient(90deg, #0f766e, #2dd4bf);
}

@keyframes leo-dash-entra {
  from { opacity: 0; transform: translateY(5px) scale(.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .leo-dash__button-primary,
  .leo-dash__button-secondary,
  .leo-dash__logo,
  .leo-dash__unidad,
  .leo-dash__barra {
    transition: none;
    animation: none;
  }
}

html[data-animaciones="off"] .leo-dash__button-primary,
html[data-animaciones="off"] .leo-dash__button-secondary,
html[data-animaciones="off"] .leo-dash__logo,
html[data-animaciones="off"] .leo-dash__unidad,
html[data-animaciones="off"] .leo-dash__barra {
  transition: none;
  animation: none;
}
</style>
