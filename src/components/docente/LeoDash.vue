<template>
  <div class="leo-dash mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
    <header class="leo-dash__hero mb-6">
      <div class="leo-dash__hero-main">
        <div>
          <p class="text-sm font-extrabold uppercase tracking-[0.14em] text-leo-azul-osc">Espacio docente</p>
          <h1 class="mt-1 text-3xl font-black text-leo-tinta sm:text-4xl">Leo Dash</h1>
          <p class="mt-1 text-base text-leo-texto">Actividad y desempeño del curso.</p>
        </div>
        <div class="leo-dash__mascota-stage" aria-hidden="true">
          <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="" class="leo-dash__mascota">
        </div>
      </div>
      <div class="leo-dash__hero-actions">
        <span class="rounded-full border px-3 py-1.5 text-sm font-extrabold" :class="estadoRealtime === 'SUBSCRIBED' ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-amber-300 bg-amber-50 text-amber-950'">
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

    <section v-if="vistaActiva === 'rendimiento'" aria-label="Rendimiento lector">
      <div class="mb-5 flex justify-end">
        <div class="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3">
          <label class="text-sm font-bold text-leo-texto">
            Periodo
            <select v-model.number="periodo" class="leo-dash__select mt-1 block w-full">
              <option :value="7">Últimos 7 días</option>
              <option :value="30">Últimos 30 días</option>
            </select>
          </label>
          <label class="text-sm font-bold text-leo-texto">
            Unidad
            <select v-model="unidadFiltro" class="leo-dash__select mt-1 block w-full">
              <option value="todas">Todas</option>
              <option value="1">Unidad 1</option>
              <option value="2">Unidad 2</option>
            </select>
          </label>
          <label class="col-span-2 text-sm font-bold text-leo-texto sm:col-span-1">
            Jugador
            <select v-model="estudianteFiltro" class="leo-dash__select mt-1 block w-full">
              <option value="todos">Todos los jugadores</option>
              <option v-for="alumno in estudiantes" :key="alumno.id" :value="alumno.id">{{ nombreCuenta(alumno) }}</option>
            </select>
          </label>
        </div>
      </div>

      <p v-if="errorCarga" class="mb-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold leading-relaxed text-rose-950" role="alert">
        {{ errorCarga }}
      </p>
      <p v-else-if="cargando && !datos" class="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950" role="status">Cargando actividad real desde Supabase…</p>
      <div v-else class="leo-dash__status mb-4 rounded-2xl px-4 py-3">
        <span>Vista global · Jugadores anonimizados · Incluye tu cuenta de prueba · {{ fechaActualizacion }}</span>
        <span v-if="estadoRealtime !== 'SUBSCRIBED'" class="leo-dash__status-warning">Sin conexión en vivo. Pulsa “Actualizar”.</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article class="leo-dash__metric leo-dash__metric--blue rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-base font-bold text-leo-texto">Jugadores activos</p>
          <p class="mt-2 text-3xl font-black text-leo-tinta">{{ estudiantesActivos }}</p>
          <p class="mt-1 text-sm text-leo-suave">En el periodo</p>
        </article>
        <article class="leo-dash__metric leo-dash__metric--cyan rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-base font-bold text-leo-texto">Respuestas</p>
          <p class="mt-2 text-3xl font-black text-leo-tinta">{{ respuestasTotales }}</p>
          <p class="mt-1 text-sm text-leo-suave">{{ respuestasTotales - primerosIntentos }} reintentos</p>
        </article>
        <article class="leo-dash__metric leo-dash__metric--violet rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-base font-bold text-leo-texto">Precisión inicial</p>
          <p class="mt-2 text-3xl font-black text-leo-azul-osc">{{ primerosIntentos ? `${precisionInicial}%` : '—' }}</p>
          <p class="mt-1 text-sm text-leo-suave">{{ primerosIntentos ? `${correctasPrimerIntento} de ${primerosIntentos} aciertos` : 'Sin respuestas' }}</p>
        </article>
        <article class="leo-dash__metric leo-dash__metric--green rounded-2xl border border-leo-linea bg-white p-4 shadow-sm">
          <p class="text-base font-bold text-leo-texto">Retos terminados</p>
          <p class="mt-2 text-3xl font-black text-emerald-800">{{ totalSesiones ? `${porcentajeCompletadas}%` : '—' }}</p>
          <p class="mt-1 text-sm text-leo-suave">{{ totalSesiones ? `${completadas} de ${totalSesiones} iniciados` : 'Sin retos iniciados' }}</p>
        </article>
      </div>

      <section class="leo-dash__panel leo-dash__panel--chart mt-4 rounded-3xl border border-leo-linea bg-white p-5 sm:p-6" aria-labelledby="actividad-diaria-titulo">
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="actividad-diaria-titulo" class="leo-dash__section-title text-xl font-black text-leo-tinta">Actividad diaria</h3>
            <p class="mt-1 text-base text-leo-texto">Respuestas registradas por día</p>
          </div>
          <span class="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-950">{{ periodo }} días</span>
        </div>
        <div class="leo-dash__chart-wrap" role="group" :aria-label="`Respuestas por día, últimos ${periodo} días`">
          <div class="leo-dash__chart-axis" aria-hidden="true">
            <span v-for="(tick, indice) in actividadDiaria.ticks" :key="indice">{{ tick }}</span>
          </div>
          <ol class="leo-dash__chart-bars" :style="{ gridTemplateColumns: `repeat(${actividadDiaria.barras.length}, minmax(0, 1fr))` }">
            <li v-for="dia in actividadDiaria.barras" :key="dia.fecha" class="leo-dash__chart-column" :aria-label="`${dia.fechaTexto}: ${dia.respuestas} respuestas`">
              <span v-if="dia.respuestas && (periodo === 7 || dia.indice % 5 === 0)" class="leo-dash__chart-count">{{ dia.respuestas }}</span>
              <div class="leo-dash__chart-track">
                <span class="leo-dash__chart-bar" :style="{ height: dia.porcentaje + '%' }"></span>
              </div>
              <span v-if="dia.mostrarFecha" class="leo-dash__chart-date">{{ dia.etiqueta }}</span>
            </li>
          </ol>
        </div>
        <p v-if="!actividadDiaria.total" class="mt-2 text-base font-semibold text-leo-suave">Sin respuestas en este periodo.</p>
      </section>

      <section class="leo-dash__panel mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="comparacion-unidades-titulo">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="comparacion-unidades-titulo" class="leo-dash__section-title text-xl font-black text-leo-tinta">Desempeño por unidad</h3>
            <p class="mt-1 text-base text-leo-texto">Precisión inicial y estado de los retos</p>
          </div>
          <span class="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-900">{{ periodo }} días</span>
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
                <p class="text-sm font-extrabold uppercase tracking-wide" :class="unidad.id === 1 ? 'text-blue-800' : 'text-teal-800'">Unidad {{ unidad.id }}</p>
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
            <div class="mt-3 flex flex-wrap justify-between gap-2 text-sm font-semibold text-slate-700">
              <span>{{ unidad.correctas }} correctas de {{ unidad.respuestas }} primeras respuestas</span>
              <span>{{ unidad.sesionesCompletadas }} de {{ unidad.sesiones }} actividades terminadas</span>
            </div>
            <div class="mt-4">
              <div class="mb-1.5 flex justify-between text-sm font-bold text-slate-700">
                <span>Retos iniciados</span>
                <span>{{ unidad.sesiones }}</span>
              </div>
              <div class="flex h-2.5 overflow-hidden rounded-full bg-white/80" role="img" :aria-label="`Unidad ${unidad.id}: ${unidad.sesionesCompletadas} completadas, ${unidad.sesionesAbandonadas} abandonadas y ${unidad.sesionesEnCurso} en curso`">
                <span class="bg-emerald-500 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesCompletadas / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesCompletadas} completadas`"></span>
                <span class="bg-rose-400 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesAbandonadas / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesAbandonadas} abandonadas`"></span>
                <span class="bg-amber-400 transition-all duration-700" :style="{ width: `${unidad.sesiones ? unidad.sesionesEnCurso / unidad.sesiones * 100 : 0}%` }" :title="`${unidad.sesionesEnCurso} en curso`"></span>
              </div>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-slate-700">
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500"></i>{{ unidad.sesionesCompletadas }} completadas</span>
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-rose-400"></i>{{ unidad.sesionesAbandonadas }} abandonadas</span>
                <span><i class="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400"></i>{{ unidad.sesionesEnCurso }} en curso</span>
              </div>
            </div>
            <p v-if="!unidad.respuestas" class="mt-3 text-sm font-medium text-slate-700">Sin respuestas en este periodo.</p>
          </article>
        </div>
        <p class="mt-4 text-sm leading-relaxed text-leo-suave">
          La comparación sigue los filtros de periodo y jugador.
        </p>
      </section>

      <details class="leo-dash__help mt-3 rounded-2xl border border-leo-linea bg-white px-4 py-3 text-base text-leo-texto">
        <summary class="cursor-pointer font-extrabold text-leo-azul-osc">¿Qué significan las métricas?</summary>
        <dl class="mt-3 grid gap-3 sm:grid-cols-2">
          <div><dt class="font-bold text-leo-tinta">Jugadores activos</dt><dd>Con respuestas en el periodo y filtros elegidos.</dd></div>
          <div><dt class="font-bold text-leo-tinta">Precisión inicial</dt><dd>Aciertos en el primer intento; no cuenta reintentos.</dd></div>
          <div><dt class="font-bold text-leo-tinta">Reintentos</dt><dd>Respuestas adicionales después del primer intento.</dd></div>
          <div><dt class="font-bold text-leo-tinta">Retos terminados</dt><dd>Retos completados respecto de los iniciados.</dd></div>
        </dl>
      </details>

      <section class="leo-dash__panel leo-dash__panel--skills mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="habilidades-titulo">
        <div class="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 id="habilidades-titulo" class="leo-dash__section-title text-xl font-black text-leo-tinta">Habilidades lectoras</h3>
            <p class="mt-1 text-base text-leo-texto">Aciertos en el primer intento</p>
          </div>
          <span class="rounded-full bg-leo-cielo px-3 py-1.5 text-sm font-extrabold text-leo-azul-osc">{{ nombreUnidadFiltro }}</span>
        </div>
        <div v-if="habilidades.length" class="space-y-4">
          <div v-for="habilidad in habilidades" :key="habilidad.clave" class="leo-dash__skill">
            <div class="mb-1.5 flex items-center justify-between gap-3 text-base">
              <span class="font-bold text-leo-tinta">{{ habilidad.nombre }}</span>
              <span class="font-extrabold text-leo-azul-osc">{{ habilidad.precisionInicial === null ? '—' : `${habilidad.precisionInicial}%` }}</span>
            </div>
            <div v-if="habilidad.precisionInicial !== null" class="leo-dash__skill-track" role="progressbar" :aria-valuenow="habilidad.precisionInicial" aria-valuemin="0" aria-valuemax="100" :aria-label="habilidad.nombre + ': ' + habilidad.precisionInicial + '% de precisión inicial'">
              <div class="leo-dash__skill-fill" :style="{ width: habilidad.precisionInicial + '%' }"></div>
            </div>
            <p v-if="habilidad.precisionInicial !== null" class="mt-2 text-sm text-leo-texto">{{ habilidad.primerosCorrectos }}/{{ habilidad.primerosIntentos }} correctas · {{ habilidad.erroresIniciales }} incorrectas · {{ habilidad.reintentos }} reintentos</p>
            <p v-else class="mt-2 text-sm text-leo-texto">Sin respuestas para calcular precisión.</p>
          </div>
        </div>
        <p v-else class="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">No hay respuestas para los filtros seleccionados.</p>
      </section>

      <section class="leo-dash__panel mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="estudiantes-titulo">
        <div class="mb-4">
          <h3 id="estudiantes-titulo" class="leo-dash__section-title text-xl font-black text-leo-tinta">Progreso personal</h3>
          <p class="mt-1 text-base text-leo-texto">Actividad del periodo · avance acumulado de ruta y rachas</p>
        </div>
        <template v-if="estudiantesFiltrados.length">
          <div class="grid gap-3 lg:hidden">
            <article v-for="alumno in estudiantesFiltrados" :key="alumno.id" class="leo-dash__player-card">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 class="text-lg font-extrabold text-leo-tinta">{{ nombreCuenta(alumno) }}</h4>
                  <p class="text-sm text-leo-suave">{{ alumno.lastActivityAt ? tiempoRelativo(alumno.lastActivityAt) : 'Sin actividad' }}</p>
                </div>
                <span class="leo-dash__streak">Racha {{ alumno.currentStreakDays }} días · récord {{ alumno.bestStreakDays }}</span>
              </div>
              <dl class="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <dt class="text-sm font-bold text-leo-suave">Actividad</dt>
                  <dd class="mt-0.5 text-base font-semibold text-leo-texto">{{ resumenActividadPeriodo(alumno) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-bold text-leo-suave">Días activos total</dt>
                  <dd class="mt-0.5 text-base font-semibold text-leo-texto">{{ alumno.activeDays }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-bold text-leo-suave">Ruta U1</dt>
                  <dd class="mt-0.5 text-base font-semibold text-leo-texto">{{ progresoRuta(alumno, 1) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-bold text-leo-suave">Ruta U2</dt>
                  <dd class="mt-0.5 text-base font-semibold text-leo-texto">{{ progresoRuta(alumno, 2) }}</dd>
                </div>
              </dl>
            </article>
          </div>
          <div class="hidden overflow-x-auto lg:block">
            <table class="w-full min-w-[900px] text-left text-base">
              <thead class="border-b border-leo-linea text-sm uppercase text-leo-suave">
                <tr>
                  <th scope="col" class="px-3 py-3">Jugador</th>
                  <th scope="col" class="px-3 py-3">Actividad</th>
                  <th scope="col" class="px-3 py-3">Ruta U1</th>
                  <th scope="col" class="px-3 py-3">Ruta U2</th>
                  <th scope="col" class="px-3 py-3">Racha actual</th>
                  <th scope="col" class="px-3 py-3">Récord</th>
                  <th scope="col" class="px-3 py-3">Días activos total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-leo-linea">
                <tr v-for="alumno in estudiantesFiltrados" :key="alumno.id">
                  <th scope="row" class="px-3 py-3 font-extrabold text-leo-tinta">
                    {{ nombreCuenta(alumno) }}
                    <span class="block text-sm font-normal text-leo-suave">{{ alumno.lastActivityAt ? tiempoRelativo(alumno.lastActivityAt) : 'Sin actividad' }}</span>
                  </th>
                  <td class="px-3 py-3 text-leo-texto">{{ resumenActividadPeriodo(alumno) }}</td>
                  <td class="px-3 py-3 text-leo-texto">{{ progresoRuta(alumno, 1) }}</td>
                  <td class="px-3 py-3 text-leo-texto">{{ progresoRuta(alumno, 2) }}</td>
                  <td class="px-3 py-3 font-bold text-leo-texto">{{ alumno.currentStreakDays }} días</td>
                  <td class="px-3 py-3 font-semibold text-leo-texto">{{ alumno.bestStreakDays }} días</td>
                  <td class="px-3 py-3 text-leo-texto">{{ alumno.activeDays }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <p v-else class="rounded-xl bg-slate-50 p-4 text-base font-semibold text-slate-600">No hay jugadores para estos filtros.</p>
      </section>

      <section class="leo-dash__panel leo-dash__panel--recent mt-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:p-6" aria-labelledby="actividad-titulo">
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 id="actividad-titulo" class="leo-dash__section-title text-xl font-black text-leo-tinta">Respuestas recientes</h3>
            <p class="mt-1 text-base text-leo-texto">Últimos aciertos y errores</p>
          </div>
          <div class="flex flex-wrap gap-2 text-sm font-extrabold" aria-label="Leyenda de respuestas">
            <span class="leo-dash__legend leo-dash__legend--correct">✓ Correcta</span>
            <span class="leo-dash__legend leo-dash__legend--incorrect">! Incorrecta</span>
          </div>
        </div>
        <ul v-if="respuestasRecientes.length" class="leo-dash__recent-list">
          <li v-for="respuesta in respuestasRecientes" :key="respuesta.id" class="leo-dash__response" :class="respuesta.correct ? 'leo-dash__response--correct' : 'leo-dash__response--incorrect'">
            <div class="flex items-center gap-3">
              <span role="img" class="leo-dash__response-icon flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-black" :class="respuesta.correct ? 'leo-dash__response-icon--correct' : 'leo-dash__response-icon--incorrect'" :aria-label="respuesta.correct ? 'Respuesta correcta' : 'Respuesta incorrecta'">
                {{ respuesta.correct ? '✓' : '!' }}
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-base font-extrabold text-leo-tinta">{{ respuesta.isTeacher ? 'Prueba docente · ' : '' }}{{ respuesta.studentName }}</span>
                <span class="block truncate text-sm text-leo-suave">U{{ respuesta.unitId }} · {{ nombreHabilidad(respuesta.assessmentCode) }} · {{ nombreActividad(respuesta) }}</span>
              </span>
              <span class="text-right">
                <span class="leo-dash__response-status block text-sm font-black" :class="respuesta.correct ? 'leo-dash__response-status--correct' : 'leo-dash__response-status--incorrect'">{{ respuesta.correct ? 'Correcta' : 'Incorrecta' }}</span>
                <span class="block text-sm text-leo-suave">{{ tiempoRelativo(respuesta.answeredAt) }}</span>
              </span>
            </div>
            <p v-if="!respuesta.correct && respuesta.incorrectAnswer" class="leo-dash__wrong-answer ml-[3.25rem] mt-2 break-words rounded-xl px-3 py-2 text-sm">Respuesta enviada: {{ formatearRespuesta(respuesta.incorrectAnswer) }}</p>
          </li>
        </ul>
        <p v-else class="rounded-xl bg-slate-50 p-4 text-base font-semibold text-slate-600">No hay respuestas recientes.</p>
      </section>
    </section>

    <section v-else class="space-y-4" aria-labelledby="aula-titulo">
      <article class="flex flex-col justify-between gap-4 rounded-3xl border border-leo-linea bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div class="flex items-start gap-4">
          <span class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-900" aria-hidden="true">✦</span>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 id="aula-titulo" class="text-xl font-black text-leo-tinta">Leo Ideas</h2>
              <span class="rounded-full bg-blue-100 px-2.5 py-1 text-sm font-bold text-blue-950">Control de aula</span>
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
          erroresIniciales: item.primerosIntentos - item.primerosCorrectos,
          reintentos: item.intentos - item.primerosIntentos,
          precisionInicial: item.primerosIntentos
            ? Math.round((item.primerosCorrectos / item.primerosIntentos) * 100)
            : null
        }))
        .sort((a, b) => a.unitId - b.unitId || a.nombre.localeCompare(b.nombre, 'es'))
    },
    actividadDiaria() {
      const partesFecha = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(new Date())
      const valoresFecha = Object.fromEntries(partesFecha.map(parte => [parte.type, parte.value]))
      const hoy = new Date(Date.UTC(
        Number(valoresFecha.year),
        Number(valoresFecha.month) - 1,
        Number(valoresFecha.day)
      ))
      const conteoPorDia = new Map()

      const registros = this.datos ? this.datos.dailyActivity : []
      registros.forEach(registro => {
        if (this.unidadFiltro !== 'todas' && String(registro.unitId) !== this.unidadFiltro) return
        if (this.estudianteFiltro !== 'todos' && String(registro.playerId) !== String(this.estudianteFiltro)) return
        const dia = String(registro.day).slice(0, 10)
        conteoPorDia.set(dia, (conteoPorDia.get(dia) || 0) + Number(registro.responses || 0))
      })

      const cantidadDias = this.periodo + 1
      const dias = Array.from({ length: cantidadDias }, (_, indice) => {
        const fecha = new Date(hoy)
        fecha.setUTCDate(fecha.getUTCDate() - (cantidadDias - indice - 1))
        const clave = fecha.toISOString().slice(0, 10)
        return {
          clave,
          fecha,
          respuestas: conteoPorDia.get(clave) || 0
        }
      })
      const maximo = Math.max(1, ...dias.map(dia => dia.respuestas))
      const barras = dias.map((dia, indice) => {
        return {
          indice,
          fecha: dia.clave,
          fechaTexto: dia.fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', timeZone: 'UTC' }),
          etiqueta: dia.fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
          respuestas: dia.respuestas,
          porcentaje: dia.respuestas ? dia.respuestas / maximo * 100 : 0,
          mostrarFecha: this.periodo === 7 || indice === 0 || indice % 5 === 0 || indice === dias.length - 1
        }
      })
      return {
        total: dias.reduce((total, dia) => total + dia.respuestas, 0),
        barras,
        ticks: [maximo, Math.ceil(maximo / 2), 0]
      }
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
            ? 'Tu cuenta no tiene permiso para ver el dashboard. Confirma el rol docente y las migraciones 005 y 006.'
            : 'No se pudieron cargar las métricas. Confirma que las migraciones 005 y 006 estén aplicadas y vuelve a intentar.'
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
  }
}
</script>

<style scoped>
.leo-dash {
  color: #3a4960;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
}

.leo-dash__hero {
  padding: 1.25rem;
  border: 1px solid #bfdbfe;
  border-radius: 1.5rem;
  background: linear-gradient(125deg, #eff8ff 0%, #f6f7ff 55%, #f0fdfa 100%);
  box-shadow: 0 12px 30px rgba(27, 79, 158, 0.1);
}

.leo-dash__hero-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.leo-dash__hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.leo-dash__mascota-stage {
  display: flex;
  width: 4.75rem;
  height: 4.75rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(37, 104, 196, 0.16);
  border-radius: 50%;
  background: radial-gradient(circle at 34% 28%, #fff 0%, #e0efff 56%, #c9e6f4 100%);
  box-shadow: 0 8px 18px rgba(27, 79, 158, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.leo-dash__mascota {
  width: 4.25rem;
  height: 4.25rem;
  object-fit: contain;
  filter: drop-shadow(0 5px 5px rgba(27, 79, 158, 0.18));
  animation: leo-dash-mascota-flota 3.2s ease-in-out infinite;
}

.leo-dash__heading {
  letter-spacing: -0.025em;
}

.leo-dash__section-title {
  letter-spacing: -0.02em;
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
  background: #eaf3ff;
  color: #1b4f9e;
  box-shadow: 0 3px 8px rgba(27, 79, 158, 0.1);
}

.leo-dash__button-secondary:hover {
  background: #d7eaff;
  box-shadow: 0 6px 14px rgba(27, 79, 158, 0.16);
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
  border-radius: 0.75rem 0.75rem 0 0;
  color: #52627a;
}

.leo-dash__tab:hover {
  color: #1b4f9e;
}

.leo-dash__tab--activa {
  border-bottom-color: #2568c4;
  background: #eaf3ff;
  color: #1b4f9e;
}

.leo-dash__select {
  min-height: 2.75rem;
  border: 1px solid #bfd0e2;
  border-radius: 0.75rem;
  background: #fff;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  color: #14233b;
  font-size: 1rem;
}

.leo-dash__status {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  border: 1px solid #f1d27a;
  background: #fff8e5;
  color: #624600;
  font-size: 0.9375rem;
  font-weight: 600;
}

.leo-dash__status-warning {
  font-weight: 800;
}

.leo-dash__chart-wrap {
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr);
  gap: 0.5rem;
  min-height: 12.5rem;
}

.leo-dash__chart-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem 0 1.5rem;
  color: #52627a;
  font-size: 0.875rem;
  font-weight: 700;
  text-align: right;
}

.leo-dash__chart-bars {
  display: grid;
  align-items: end;
  gap: 0.25rem;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.leo-dash__chart-column {
  position: relative;
  display: flex;
  min-width: 0;
  height: 12rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
}

.leo-dash__chart-track {
  display: flex;
  width: min(78%, 1.5rem);
  height: 8rem;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 0.5rem 0.5rem 0.125rem 0.125rem;
  background: repeating-linear-gradient(to top, #e8eef5 0, #e8eef5 1px, transparent 1px, transparent 50%);
}

.leo-dash__chart-bar {
  display: block;
  width: 100%;
  border-radius: 0.5rem 0.5rem 0.125rem 0.125rem;
  background: #2568c4;
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.2);
}

.leo-dash__chart-count {
  max-width: 100%;
  color: #1b4f9e;
  font-size: 0.8125rem;
  font-weight: 800;
  line-height: 1;
}

.leo-dash__chart-date {
  min-height: 1rem;
  color: #52627a;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1rem;
}

.leo-dash__chart-bar {
  transition: height 450ms ease;
}

.leo-dash__player-card {
  padding: 1rem;
  border: 1px solid #c9dce8;
  border-radius: 1rem;
  background: linear-gradient(145deg, #fff, #f5faff);
  box-shadow: 0 4px 12px rgba(27, 79, 158, 0.07);
}

.leo-dash__streak {
  display: inline-flex;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  background: #fff0bd;
  color: #755000;
  font-size: 0.875rem;
  font-weight: 800;
}

.leo-dash__metric {
  border-top-width: 4px;
  box-shadow: 0 6px 18px rgba(27, 79, 158, 0.09);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.leo-dash__metric:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(27, 79, 158, 0.14);
}

.leo-dash__metric--blue { border-top-color: #2568c4; }
.leo-dash__metric--cyan { border-top-color: #0891b2; }
.leo-dash__metric--violet { border-top-color: #7c3aed; }
.leo-dash__metric--green { border-top-color: #16834a; }

.leo-dash__panel {
  box-shadow: 0 8px 24px rgba(27, 79, 158, 0.08);
  transition: box-shadow 180ms ease, transform 180ms ease;
}

.leo-dash__panel:hover {
  box-shadow: 0 12px 30px rgba(27, 79, 158, 0.12);
}

.leo-dash__panel--skills {
  border-color: #b7dce9;
  background: linear-gradient(145deg, #ffffff 0%, #f5fbff 100%);
}

.leo-dash__panel--recent {
  border-color: #c6d9f0;
  background: linear-gradient(145deg, #ffffff 0%, #f7faff 100%);
}

.leo-dash__help {
  box-shadow: 0 4px 14px rgba(27, 79, 158, 0.05);
}

.leo-dash__skill {
  padding: 1rem;
  border: 1px solid #c9dce8;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 3px 10px rgba(27, 79, 158, 0.06);
}

.leo-dash__skill-track {
  height: 0.9rem;
  overflow: hidden;
  border: 1px solid #93c5d8;
  border-radius: 999px;
  background-color: #d9edf5;
  box-shadow: inset 0 1px 2px rgba(20, 35, 59, 0.12);
}

.leo-dash__skill-fill {
  height: 100%;
  border-radius: inherit;
  background-color: #075985;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: width 500ms ease;
}

.leo-dash__recent-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.leo-dash__response {
  padding: 0.875rem;
  border: 1px solid #d6e2ee;
  border-left-width: 5px;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(27, 79, 158, 0.06);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.leo-dash__response:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(27, 79, 158, 0.12);
}

.leo-dash__response--correct {
  border-left-color: #16834a;
  background: linear-gradient(100deg, #f0fbf4, #fff 60%);
}

.leo-dash__response--incorrect {
  border-left-color: #d99a00;
  background: linear-gradient(100deg, #fff9e8, #fff 60%);
}

.leo-dash__response-icon--correct,
.leo-dash__legend--correct {
  background: #dcf5e5;
  color: #116437;
}

.leo-dash__response-icon--incorrect,
.leo-dash__legend--incorrect {
  background: #fff0bd;
  color: #755000;
}

.leo-dash__response-status--correct { color: #116437; }
.leo-dash__response-status--incorrect { color: #755000; }

.leo-dash__legend {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
}

.leo-dash__wrong-answer {
  border: 1px solid #f1d27a;
  background: #fff5d6;
  color: #624600;
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

@keyframes leo-dash-mascota-flota {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-5px) rotate(2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .leo-dash__button-primary,
  .leo-dash__button-secondary,
  .leo-dash__mascota,
  .leo-dash__unidad,
  .leo-dash__barra,
  .leo-dash__metric,
  .leo-dash__panel,
  .leo-dash__skill-fill,
  .leo-dash__response,
  .leo-dash__chart-bar {
    transition: none;
    animation: none;
  }
}

html[data-animaciones="off"] .leo-dash__button-primary,
html[data-animaciones="off"] .leo-dash__button-secondary,
html[data-animaciones="off"] .leo-dash__mascota,
html[data-animaciones="off"] .leo-dash__unidad,
html[data-animaciones="off"] .leo-dash__barra,
html[data-animaciones="off"] .leo-dash__metric,
html[data-animaciones="off"] .leo-dash__panel,
html[data-animaciones="off"] .leo-dash__skill-fill,
html[data-animaciones="off"] .leo-dash__response,
html[data-animaciones="off"] .leo-dash__chart-bar {
  transition: none;
  animation: none;
}

@media (min-width: 640px) {
  .leo-dash__hero {
    padding: 1.5rem 1.75rem;
  }

  .leo-dash__mascota-stage {
    width: 7rem;
    height: 7rem;
  }

  .leo-dash__mascota {
    width: 6.25rem;
    height: 6.25rem;
  }

  .leo-dash__skill {
    padding: 1.125rem 1.25rem;
  }

  .leo-dash__response {
    padding: 1rem 1.125rem;
  }
}
</style>
