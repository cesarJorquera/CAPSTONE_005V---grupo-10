<template>
  <!-- UI-07: Rework de LeoIA. Misma familia visual que Inicio (UI-05) y Progreso (UI-06):
       fondo plano, tarjetas blancas, íconos SVG (sin emojis ni degradados) y componentes base.
       Las llamadas a Gemini, los prompts y el test (data/test_diagnostico.js) no cambian;
       no se toca la base de datos. Lo nuevo es solo de pantalla: el test muestra una pregunta
       por vez, los errores se muestran dentro de la app (antes eran alert) y sin API key
       se ve un aviso neutro para el alumno. -->
  <div class="leoia" :class="{ 'leoia--con-chat': chatAbierto && esAncho }">

    <div class="leoia__columna">
      <header>
        <h1 class="leoia__titulo">LeoIA</h1>
        <p class="leoia__bajada">Tu asistente para practicar lectura.</p>
      </header>

      <!-- Bienvenida de Leo -->
      <LeoTarjeta como="section" class="bienvenida" aria-label="Bienvenida de Leo" data-test="bienvenida">
        <!-- UI-09: Leo piensa mientras Leo IA prepara una respuesta -->
        <LeoBurbuja :mensaje="saludo" disposicion="lado" :tamano="esAncho ? 84 : 72" :estado="leoEsperando ? 'piensa' : 'saluda'" />
      </LeoTarjeta>

      <!-- Sin API key: aviso neutro para el alumno. La instrucción técnica (.env.local)
           queda en la consola y en el comentario de verificarAPIKey, para quien desarrolla. -->
      <div v-if="!apiKeyValida" class="aviso aviso--ambar aviso--leo" role="status" data-test="aviso-ia">
        <!-- UI-10: Leo apenado en vez del ícono. Ícono anterior:
        <svg viewBox="0 0 24 24" fill="none" stroke="#8a5a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M12 7.5 V12.5 M12 16 h0.01" /></svg> -->
        <LeoPersonaje estado="apenado" :tamano="56" decorativo />
        <div>
          <p class="aviso__titulo">Leo IA no está disponible por ahora</p>
          <p class="aviso__texto">Mientras tanto, puedes seguir practicando desde Inicio.</p>
        </div>
      </div>

      <!-- Tres opciones, con la misma forma que las unidades de Inicio -->
      <section class="opciones" aria-label="Qué puedes hacer con Leo">
        <button
          ref="opcionChat"
          type="button"
          class="opcion"
          :class="{ 'opcion--activa': chatAbierto }"
          :disabled="!apiKeyValida"
          :aria-pressed="chatAbierto ? 'true' : 'false'"
          data-test="opcion-chat"
          @click="abrirChat"
        >
          <span class="icono" style="background: #e4f0fb">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.chat" /></svg>
          </span>
          <span class="opcion__textos">
            <span class="opcion__nombre">Chat con Leo</span>
            <span class="opcion__desc">Pregunta lo que quieras sobre lectura.</span>
          </span>
          <LeoEtiqueta v-if="chatAbierto && esAncho" tono="azul">Abierto</LeoEtiqueta>
          <svg v-else class="opcion__flecha" viewBox="0 0 24 24" fill="none" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 L15 12 L9 18" /></svg>
        </button>

        <button
          type="button"
          class="opcion"
          :disabled="!apiKeyValida"
          data-test="opcion-test"
          @click="generarTest"
        >
          <span class="icono" style="background: #e3f3ea">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.test" /></svg>
          </span>
          <span class="opcion__textos">
            <span class="opcion__nombre">Test diagnóstico</span>
            <span class="opcion__desc">{{ cantidadPreguntasTest }} preguntas para conocer tu nivel.</span>
          </span>
          <svg class="opcion__flecha" viewBox="0 0 24 24" fill="none" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 L15 12 L9 18" /></svg>
        </button>

        <button
          type="button"
          class="opcion"
          :disabled="!apiKeyValida || cargandoIA"
          :aria-busy="cargandoIA && !modalEjercicioVisible ? 'true' : 'false'"
          data-test="opcion-ejercicio"
          @click="generarEjercicio"
        >
          <span class="icono" style="background: #fff3cf">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b07a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.dado" /></svg>
          </span>
          <span class="opcion__textos">
            <span class="opcion__nombre">Ejercicio aleatorio</span>
            <span class="opcion__desc">{{ cargandoIA && !modalEjercicioVisible ? 'Leo está preparando tu ejercicio…' : 'Una práctica nueva, creada para ti.' }}</span>
          </span>
          <svg v-if="cargandoIA && !modalEjercicioVisible" class="opcion__flecha giro" viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 3 a9 9 0 1 1 -9 9" /></svg>
          <svg v-else class="opcion__flecha" viewBox="0 0 24 24" fill="none" stroke="#52627a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6 L15 12 L9 18" /></svg>
        </button>
      </section>

      <p v-if="errorEjercicio" class="aviso aviso--ambar aviso--corto" role="alert" data-test="ejercicio-error">
        {{ errorEjercicio }}
      </p>

      <p class="leoia__nota">Leo usa inteligencia artificial (Google Gemini) y puede equivocarse. Si algo no te cuadra, revísalo.</p>
    </div>

    <!-- Chat. Escritorio: columna a la derecha. Celular y tablet: pantalla completa,
         sobre el menú inferior, con flecha para volver. -->
    <transition name="chat">
      <section
        v-if="chatAbierto"
        ref="chat"
        class="chat"
        :class="{ 'chat--completo': !esAncho }"
        :role="esAncho ? null : 'dialog'"
        :aria-modal="esAncho ? null : 'true'"
        aria-labelledby="chat-titulo"
        data-test="chat"
      >
        <header class="chat__cabecera">
          <button
            v-if="!esAncho"
            ref="chatVolver"
            type="button"
            class="chat__boton-icono"
            aria-label="Volver a LeoIA"
            data-test="chat-cerrar"
            @click="cerrarChat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#14233b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6 L9 12 L15 18" /></svg>
          </button>
          <span class="chat__avatar" aria-hidden="true">
            <!-- UI-09: Leo nuevo, sin brazos ni piernas en este tamaño -->
            <LeoPersonaje :tamano="30" decorativo />
            <!-- UI-09: imagen anterior, se conserva comentada para poder volver a ella
            <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="" />
            -->
          </span>
          <div class="chat__titulos">
            <h2 id="chat-titulo" class="chat__titulo">Chat con Leo</h2>
            <p class="chat__subtitulo">Pregunta lo que quieras sobre lectura.</p>
          </div>
          <button
            v-if="esAncho"
            type="button"
            class="chat__boton-icono"
            aria-label="Cerrar el chat"
            data-test="chat-cerrar"
            @click="cerrarChat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#3a4960" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18" /></svg>
          </button>
        </header>

        <div ref="chatContainer" class="chat__mensajes" aria-live="polite" data-test="chat-mensajes">
          <p v-if="!esAncho" class="chat__aviso-ia">Leo usa IA (Google Gemini) y puede equivocarse.</p>
          <div
            v-for="(mensaje, index) in historialChat"
            :key="index"
            class="mensaje"
            :class="mensaje.rol === 'usuario' ? 'mensaje--mio' : 'mensaje--leo'"
            data-test="chat-mensaje"
          >
            <!-- UI-10: si Leo no pudo responder, aparece apenado junto a ese mensaje -->
            <LeoPersonaje v-if="mensaje.error" class="mensaje__leo" estado="apenado" :tamano="34" decorativo data-test="chat-leo-apenado" />
            <div class="mensaje__globo">
              <p class="mensaje__texto">{{ mensaje.texto }}</p>
              <p class="mensaje__hora">{{ mensaje.hora }}</p>
            </div>
          </div>

          <!-- Leo escribiendo: los puntos quedan quietos si las animaciones están apagadas -->
          <div v-if="cargandoChat" class="mensaje mensaje--leo" data-test="chat-escribiendo">
            <div class="mensaje__globo escribiendo" role="status" aria-label="Leo está escribiendo">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <form class="chat__formulario" @submit.prevent="enviarMensaje">
          <label for="chat-entrada" class="solo-lector">Escribe tu pregunta</label>
          <input
            id="chat-entrada"
            ref="chatEntrada"
            v-model="mensajeChat"
            :disabled="cargandoChat"
            type="text"
            autocomplete="off"
            placeholder="Escribe tu pregunta…"
            class="chat__entrada"
            data-test="chat-entrada"
          />
          <button
            type="submit"
            class="chat__enviar"
            :disabled="!mensajeChat.trim() || cargandoChat"
            :aria-label="esAncho ? null : 'Enviar'"
            data-test="chat-enviar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12 L20 4 L14 20 L11 13 Z" /></svg>
            <span v-if="esAncho">Enviar</span>
          </button>
        </form>
      </section>
    </transition>

    <!-- Test diagnóstico: una pregunta por vez -->
    <LeoPanelDetalle :abierto="modalTestVisible" titulo="Test diagnóstico" @cerrar="cerrarModalTest">
      <template #icono>
        <span class="icono" style="background: #e3f3ea">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.test" /></svg>
        </span>
      </template>

      <template v-if="preguntaVisible">
        <div class="avance-test">
          <div class="avance-test__fila">
            <span class="avance-test__actual" data-test="test-contador">Pregunta {{ preguntaActual + 1 }} de {{ totalPreguntas }}</span>
            <span class="avance-test__respondidas">{{ respondidas }} {{ respondidas === 1 ? 'respondida' : 'respondidas' }}</span>
          </div>
          <LeoBarraProgreso :valor="respondidas" :maximo="totalPreguntas" color="verde" :alto="10" etiqueta="Avance del test" />
        </div>

        <div class="pregunta" data-test="test-pregunta">
          <LeoEtiqueta tono="azul" class="pregunta__habilidad">{{ textoHabilidad(preguntaVisible.habilidad) }}</LeoEtiqueta>
          <p class="pregunta__texto">{{ preguntaVisible.texto }}</p>
          <p :id="`pregunta-${preguntaActual}`" class="pregunta__enunciado">{{ preguntaVisible.pregunta }}</p>
          <div class="alternativas" role="radiogroup" :aria-labelledby="`pregunta-${preguntaActual}`">
            <button
              v-for="(alternativa, altIndex) in preguntaVisible.alternativas"
              :key="altIndex"
              type="button"
              role="radio"
              class="alternativa"
              :class="{ 'alternativa--marcada': respuestasTest[preguntaActual] === altIndex }"
              :aria-checked="respuestasTest[preguntaActual] === altIndex ? 'true' : 'false'"
              data-test="test-alternativa"
              @click="seleccionarRespuestaTest(preguntaActual, altIndex)"
            >
              <span class="alternativa__letra">{{ String.fromCharCode(65 + altIndex) }}</span>
              <span class="alternativa__texto">{{ alternativa }}</span>
            </button>
          </div>
        </div>
      </template>

      <template #pie>
        <div class="pie-doble pie-doble--asimetrico">
          <LeoBoton variante="secundario" :disabled="preguntaActual === 0" data-test="test-anterior" @click="irPregunta(-1)">Anterior</LeoBoton>
          <LeoBoton
            v-if="!esUltimaPregunta"
            :disabled="respuestasTest[preguntaActual] === undefined"
            data-test="test-siguiente"
            @click="irPregunta(1)"
          >Siguiente</LeoBoton>
          <LeoBoton
            v-else
            :disabled="!testCompleto"
            data-test="test-diagnostico"
            @click="evaluarTest"
          >Ver mi diagnóstico</LeoBoton>
        </div>
        <p v-if="esUltimaPregunta && !testCompleto" class="pie-nota">Te falta responder {{ totalPreguntas - respondidas }} {{ totalPreguntas - respondidas === 1 ? 'pregunta' : 'preguntas' }}.</p>
      </template>
    </LeoPanelDetalle>

    <!-- Resultado del diagnóstico -->
    <LeoPanelDetalle :abierto="modalDiagnosticoVisible" titulo="Tu diagnóstico" @cerrar="cerrarModalDiagnostico">
      <!-- UI-10: Leo esperando (con nube) en vez del círculo que gira. La carga anterior:
      <div v-if="cargandoDiagnostico" class="estado-carga" role="status" data-test="diagnostico-cargando">
        <svg class="estado-carga__giro giro" viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 3 a9 9 0 1 1 -9 9" /></svg>
        <p>Leo está revisando tus respuestas…</p>
      </div>
      -->
      <LeoCarga v-if="cargandoDiagnostico" mensaje="Leo está revisando tus respuestas…" data-test="diagnostico-cargando" />

      <div v-else-if="errorDiagnostico" class="aviso aviso--ambar aviso--leo" role="alert" data-test="diagnostico-error">
        <!-- UI-10: Leo apenado en vez del ícono. Ícono anterior:
        <svg viewBox="0 0 24 24" fill="none" stroke="#8a5a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M12 7.5 V12.5 M12 16 h0.01" /></svg> -->
        <LeoPersonaje estado="apenado" :tamano="56" decorativo />
        <div>
          <p class="aviso__titulo">No pude preparar tu diagnóstico</p>
          <p class="aviso__texto">Puede ser la conexión o que Leo esté muy ocupado. Tus respuestas siguen guardadas: inténtalo de nuevo en un momento.</p>
        </div>
      </div>

      <template v-else-if="diagnosticoIA">
        <p class="diagnostico__bajada">Preparado por Leo según tus respuestas.</p>

        <section class="bloque" aria-labelledby="diag-nivel" data-test="diagnostico">
          <div class="bloque__cabecera">
            <span class="icono" style="background: #e4f0fb">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.libro" /></svg>
            </span>
            <div>
              <p class="antetitulo" style="color: #1b4f9e">Tu nivel</p>
              <h3 id="diag-nivel" class="bloque__nivel" data-test="diagnostico-nivel">{{ nombreNivel(diagnosticoIA.nivel) }}</h3>
            </div>
          </div>
          <LeoBurbuja v-if="diagnosticoIA.mensaje_motivacional" :mensaje="diagnosticoIA.mensaje_motivacional" disposicion="lado" :tamano="60" estado="acierto" />
        </section>

        <section v-if="lista(diagnosticoIA.fortalezas).length" class="bloque bloque--verde" aria-labelledby="diag-fortalezas">
          <div class="bloque__cabecera">
            <svg class="bloque__icono" viewBox="0 0 24 24" fill="none" stroke="#1f7a47" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.check" /></svg>
            <h3 id="diag-fortalezas" class="bloque__titulo">Tus fortalezas</h3>
          </div>
          <ul class="bloque__lista" style="color: #1f4d33">
            <li v-for="(fortaleza, index) in lista(diagnosticoIA.fortalezas)" :key="index">{{ fortaleza }}</li>
          </ul>
        </section>

        <!-- Antes "Áreas a mejorar": mismo contenido, con el tono de "Para seguir creciendo" de Progreso -->
        <section v-if="lista(diagnosticoIA.areas_mejorar).length" class="bloque bloque--ambar" aria-labelledby="diag-crecer" data-test="diagnostico-crecer">
          <div class="bloque__cabecera">
            <svg class="bloque__icono" viewBox="0 0 24 24" fill="none" stroke="#b07a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.brote" /></svg>
            <h3 id="diag-crecer" class="bloque__titulo">Para seguir creciendo</h3>
          </div>
          <ul class="bloque__lista" style="color: #5c3d00">
            <li v-for="(area, index) in lista(diagnosticoIA.areas_mejorar)" :key="index">{{ area }}</li>
          </ul>
        </section>

        <section v-if="diagnosticoIA.recomendacion_inicio || diagnosticoIA.consejo_principal" class="bloque bloque--azul" aria-labelledby="diag-empezar">
          <div class="bloque__cabecera">
            <svg class="bloque__icono" viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.bandera" /></svg>
            <h3 id="diag-empezar" class="bloque__titulo">Por dónde empezar</h3>
          </div>
          <p v-if="diagnosticoIA.recomendacion_inicio" class="bloque__texto">{{ diagnosticoIA.recomendacion_inicio }}</p>
          <p v-if="diagnosticoIA.consejo_principal" class="bloque__consejo"><strong>Consejo:</strong> {{ diagnosticoIA.consejo_principal }}</p>
        </section>
      </template>

      <template #pie>
        <div v-if="errorDiagnostico" class="pie-doble">
          <LeoBoton variante="secundario" @click="cerrarModalDiagnostico">Cerrar</LeoBoton>
          <LeoBoton data-test="diagnostico-reintentar" @click="evaluarTest">Intentar de nuevo</LeoBoton>
        </div>
        <div v-else-if="!cargandoDiagnostico" class="pie-doble">
          <LeoBoton variante="secundario" data-test="diagnostico-repetir" @click="repetirTest">Repetir test</LeoBoton>
          <LeoBoton data-test="diagnostico-volver" @click="cerrarModalDiagnostico">Volver a LeoIA</LeoBoton>
        </div>
      </template>
    </LeoPanelDetalle>

    <!-- Ejercicio aleatorio: mismo panel que el test -->
    <LeoPanelDetalle :abierto="modalEjercicioVisible" titulo="Ejercicio aleatorio" @cerrar="cerrarModalEjercicio">
      <template #icono>
        <span class="icono" style="background: #fff3cf">
          <svg viewBox="0 0 24 24" fill="none" stroke="#b07a00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="ICONOS.dado" /></svg>
        </span>
      </template>

      <!-- UI-10: Leo esperando (con nube) en vez del círculo que gira. La carga anterior:
      <div v-if="cargandoIA" class="estado-carga" role="status">
        <svg class="estado-carga__giro giro" viewBox="0 0 24 24" fill="none" stroke="#2568c4" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 3 a9 9 0 1 1 -9 9" /></svg>
        <p>Leo está preparando otro ejercicio…</p>
      </div>
      -->
      <LeoCarga v-if="cargandoIA" mensaje="Leo está preparando otro ejercicio…" data-test="ejercicio-cargando" />

      <div v-else-if="ejercicioAleatorio" class="pregunta" data-test="ejercicio">
        <LeoEtiqueta tono="ambar" class="pregunta__habilidad">{{ textoHabilidad(ejercicioAleatorio.habilidad) }}</LeoEtiqueta>
        <p class="pregunta__texto">{{ ejercicioAleatorio.texto }}</p>
        <p id="ejercicio-enunciado" class="pregunta__enunciado">{{ ejercicioAleatorio.pregunta }}</p>
        <div class="alternativas" role="radiogroup" aria-labelledby="ejercicio-enunciado">
          <button
            v-for="(alternativa, index) in ejercicioAleatorio.alternativas"
            :key="index"
            type="button"
            role="radio"
            class="alternativa"
            :class="claseAlternativaEjercicio(index)"
            :aria-checked="respuestaEjercicio === index ? 'true' : 'false'"
            :aria-disabled="feedbackEjercicio ? 'true' : null"
            data-test="ejercicio-alternativa"
            @click="seleccionarRespuestaEjercicio(index)"
          >
            <span class="alternativa__letra">{{ String.fromCharCode(65 + index) }}</span>
            <span class="alternativa__texto">{{ alternativa }}</span>
          </button>
        </div>

        <div
          v-if="feedbackEjercicio"
          class="aviso"
          :class="feedbackEjercicio.correcto ? 'aviso--verde' : 'aviso--ambar'"
          role="status"
          data-test="ejercicio-feedback"
        >
          <svg viewBox="0 0 24 24" fill="none" :stroke="feedbackEjercicio.correcto ? '#1f7a47' : '#8a5a00'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="feedbackEjercicio.correcto ? ICONOS.check : ICONOS.brote" /></svg>
          <div>
            <p class="aviso__titulo">{{ feedbackEjercicio.correcto ? '¡Bien hecho!' : 'Esta vez no, pero vas aprendiendo' }}</p>
            <p class="aviso__texto">{{ feedbackEjercicio.mensaje }}</p>
            <!-- UI-07: Gemini ya enviaba una explicación breve que antes no se mostraba -->
            <p v-if="ejercicioAleatorio.explicacion" class="aviso__texto" data-test="ejercicio-explicacion">{{ ejercicioAleatorio.explicacion }}</p>
          </div>
        </div>
      </div>

      <p v-if="errorEjercicio && modalEjercicioVisible" class="aviso aviso--ambar aviso--corto" role="alert">{{ errorEjercicio }}</p>

      <template #pie>
        <div v-if="!feedbackEjercicio" class="pie-uno">
          <LeoBoton ancho :disabled="respuestaEjercicio === null || cargandoIA" data-test="ejercicio-revisar" @click="verificarRespuestaEjercicio">Revisar respuesta</LeoBoton>
        </div>
        <div v-else class="pie-doble">
          <LeoBoton variante="secundario" @click="cerrarModalEjercicio">Cerrar</LeoBoton>
          <LeoBoton :disabled="cargandoIA" data-test="ejercicio-otro" @click="otroEjercicio">Otro ejercicio</LeoBoton>
        </div>
      </template>
    </LeoPanelDetalle>
  </div>
</template>

<script>
import { esAPIKeyValida, generarDiagnosticoPersonalizado, generarEjercicioAleatorio, chatConversacional } from '../utils/geminiClient'
import { testDiagnostico } from '../data/test_diagnostico'
import LeoTarjeta from './base/LeoTarjeta.vue'
import LeoBurbuja from './base/LeoBurbuja.vue'
import LeoBoton from './base/LeoBoton.vue'
import LeoEtiqueta from './base/LeoEtiqueta.vue'
import LeoBarraProgreso from './base/LeoBarraProgreso.vue'
import LeoPanelDetalle from './base/LeoPanelDetalle.vue'
import LeoPersonaje from './base/LeoPersonaje.vue'
import LeoCarga from './base/LeoCarga.vue' // UI-10
import { primerNombre } from '../utils/nombre'

// UI-07: íconos de trazo (mismo estilo que Inicio y Progreso)
const ICONOS = {
  chat: 'M4 5 H20 V16 H10 L5 20 V16 H4 Z M8 9.5 H16 M8 12.5 H13',
  test: 'M9 3 H15 V6 H9 Z M7 4.5 H5 V21 H19 V4.5 H17 M9 14 L11 16 L15 11.5',
  dado: 'M4 4 H20 V20 H4 Z M8.5 8.5 h0.01 M15.5 8.5 h0.01 M12 12 h0.01 M8.5 15.5 h0.01 M15.5 15.5 h0.01',
  libro: 'M3 6 C6 5 9 5 12 7 C15 5 18 5 21 6 V19 C18 18 15 18 12 20 C9 18 6 18 3 19 Z M12 7 V20',
  check: 'M3 12 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0 M8 12 L11 15 L16 9',
  brote: 'M12 20 V11 M12 11 C12 7 9 5 5 5 C5 9 8 11 12 11 M12 13 C12 10 14.5 8 19 8 C19 11.5 16 13 12 13',
  bandera: 'M5 21 V4 M5 4 H16 L14 8 L16 12 H5'
}

// Gemini responde el nivel en minúsculas y sin tilde ("basico/intermedio/avanzado")
const NOMBRES_NIVEL = { basico: 'Básico', básico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }

const ANCHO_ESCRITORIO = '(min-width: 1024px)'

export default {
  name: 'AsistenteIA',
  components: { LeoTarjeta, LeoBurbuja, LeoBoton, LeoEtiqueta, LeoBarraProgreso, LeoPanelDetalle, LeoPersonaje, LeoCarga },
  props: {
    // UI-07: nombre del alumno para el saludo de Leo (lo entrega PantallaLeoIA)
    nombre: { type: String, default: '' }
  },
  data() {
    return {
      ICONOS,
      apiKeyValida: false,
      cargandoIA: false,

      // Chat
      chatAbierto: false,
      mensajeChat: '',
      historialChat: [],
      cargandoChat: false,

      // Test Diagnóstico
      modalTestVisible: false,
      testDiagnostico: null,
      respuestasTest: {},
      diagnosticoIA: null,
      modalDiagnosticoVisible: false,
      cargandoDiagnostico: false,

      // Ejercicio Aleatorio
      modalEjercicioVisible: false,
      ejercicioAleatorio: null,
      respuestaEjercicio: null,
      feedbackEjercicio: null,

      // UI-07: solo de pantalla
      preguntaActual: 0, // el test se muestra de a una pregunta
      errorDiagnostico: false, // reemplaza el alert() cuando falla Gemini
      errorEjercicio: '', // reemplaza el alert() del ejercicio
      esAncho: false, // escritorio (menú lateral): el chat va al lado
      consultaAncho: null
    }
  },
  computed: {
    // UI-09: Leo pone cara de "pensando" mientras Leo IA responde
    leoEsperando() {
      return this.cargandoIA || this.cargandoChat || this.cargandoDiagnostico
    },
    saludo() {
      const nombre = primerNombre(this.nombre)
      const hola = nombre ? `Hola, ${nombre}.` : 'Hola.'
      if (!this.apiKeyValida) return `${hola} Ahora no puedo conectarme, pero vuelve pronto.`
      return `${hola} Puedo conversar contigo, medir tu nivel o darte un ejercicio nuevo.`
    },
    cantidadPreguntasTest() {
      return (testDiagnostico.preguntas || []).length
    },
    totalPreguntas() {
      return this.testDiagnostico ? this.testDiagnostico.preguntas.length : 0
    },
    preguntaVisible() {
      return this.testDiagnostico ? this.testDiagnostico.preguntas[this.preguntaActual] || null : null
    },
    respondidas() {
      return Object.keys(this.respuestasTest).length
    },
    esUltimaPregunta() {
      return this.preguntaActual >= this.totalPreguntas - 1
    },
    testCompleto() {
      return this.totalPreguntas > 0 && this.respondidas === this.totalPreguntas
    }
  },
  watch: {
    // En celular el chat ocupa toda la pantalla: el fondo no se desplaza mientras está abierto
    chatAbierto() { this.bloquearFondo() },
    esAncho() { this.bloquearFondo() }
  },
  mounted() {
    this.verificarAPIKey()
    try {
      this.consultaAncho = window.matchMedia(ANCHO_ESCRITORIO)
      this.esAncho = this.consultaAncho.matches
      this.consultaAncho.addEventListener('change', this.alCambiarAncho)
    } catch (error) {
      console.warn('No se pudo medir el ancho de la pantalla:', error)
    }
  },
  beforeUnmount() {
    if (this.consultaAncho) this.consultaAncho.removeEventListener('change', this.alCambiarAncho)
    document.body.style.overflow = ''
    document.removeEventListener('keydown', this.alTeclearChat)
  },
  methods: {
    verificarAPIKey() {
      this.apiKeyValida = esAPIKeyValida()
      console.log('🔑 API Key válida:', this.apiKeyValida)
      console.log('🔑 API Key value:', process.env.VUE_APP_GEMINI_API_KEY ? 'Configurada' : 'NO configurada')
      // UI-07: antes esta instrucción se mostraba en pantalla a todos los alumnos.
      // Ahora el alumno ve un aviso neutro y la instrucción queda aquí, para quien desarrolla.
      if (!this.apiKeyValida) {
        console.info('[LeoIA] Para activar Leo IA, agrega VUE_APP_GEMINI_API_KEY en .env.local y reinicia el servidor. La clave se crea en Google AI Studio.')
      }
    },

    // ========== UI-07: pantalla ==========
    alCambiarAncho(evento) {
      this.esAncho = evento.matches
    },
    bloquearFondo() {
      const completo = this.chatAbierto && !this.esAncho
      try {
        document.body.style.overflow = completo ? 'hidden' : ''
      } catch (error) {
        console.warn('No se pudo bloquear el scroll del fondo:', error)
      }
      // Con el chat abierto, Esc lo cierra (aunque el foco haya quedado fuera del campo)
      document.removeEventListener('keydown', this.alTeclearChat)
      if (this.chatAbierto) document.addEventListener('keydown', this.alTeclearChat)
    },
    alTeclearChat(evento) {
      // Si hay un panel abierto encima, Esc lo cierra a él primero (LeoPanelDetalle)
      if (evento.key !== 'Escape' || this.modalTestVisible || this.modalDiagnosticoVisible || this.modalEjercicioVisible) return
      this.cerrarChat()
    },
    abrirChat() {
      if (!this.chatAbierto) this.toggleChat()
      this.$nextTick(() => {
        // En celular no se abre el teclado solo: el foco va a la flecha de volver
        const destino = this.esAncho ? this.$refs.chatEntrada : this.$refs.chatVolver
        if (destino) destino.focus()
      })
    },
    cerrarChat() {
      this.chatAbierto = false
      this.$nextTick(() => this.$refs.opcionChat && this.$refs.opcionChat.focus())
    },
    textoHabilidad(habilidad) {
      return String(habilidad || '').replace(/_/g, ' ')
    },
    nombreNivel(nivel) {
      const clave = String(nivel || '').trim().toLowerCase()
      if (NOMBRES_NIVEL[clave]) return NOMBRES_NIVEL[clave]
      return clave ? clave.charAt(0).toUpperCase() + clave.slice(1) : 'Sin nivel'
    },
    lista(valor) {
      return Array.isArray(valor) ? valor.filter(Boolean) : []
    },
    irPregunta(paso) {
      const destino = this.preguntaActual + paso
      if (destino < 0 || destino >= this.totalPreguntas) return
      this.preguntaActual = destino
    },
    repetirTest() {
      this.cerrarModalDiagnostico()
      this.generarTest()
    },
    otroEjercicio() {
      this.generarEjercicio()
    },
    claseAlternativaEjercicio(index) {
      const elegida = this.respuestaEjercicio === index
      if (!this.feedbackEjercicio) return { 'alternativa--marcada': elegida }
      const correcta = this.ejercicioAleatorio && this.ejercicioAleatorio.respuesta_correcta === index
      return {
        'alternativa--correcta': correcta,
        'alternativa--revisar': elegida && !correcta,
        'alternativa--apagada': !correcta && !elegida
      }
    },

    // ========== CHAT ==========
    toggleChat() {
      this.chatAbierto = !this.chatAbierto
      if (this.chatAbierto && this.historialChat.length === 0) {
        this.historialChat.push({
          rol: 'asistente',
          texto: '¡Hola! Soy Leo, tu asistente de comprensión lectora. ¿En qué puedo ayudarte hoy?',
          hora: this.obtenerHora()
        })
      }
    },

    async enviarMensaje() {
      if (!this.mensajeChat.trim()) return

      const mensajeUsuario = this.mensajeChat
      this.mensajeChat = ''

      this.historialChat.push({
        rol: 'usuario',
        texto: mensajeUsuario,
        hora: this.obtenerHora()
      })

      this.cargandoChat = true
      this.scrollToBottom()

      try {
        console.log('💬 Enviando mensaje a Gemini...')
        const respuesta = await chatConversacional(mensajeUsuario, this.historialChat.map(msg => ({ rol: msg.rol, mensaje: msg.texto })))

        this.historialChat.push({
          rol: 'asistente',
          texto: respuesta,
          hora: this.obtenerHora()
        })
      } catch (error) {
        console.error('Error al enviar mensaje:', error)
        this.historialChat.push({
          rol: 'asistente',
          // UI-07: mismo mensaje, sin emoji
          texto: 'Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentarlo de nuevo?',
          hora: this.obtenerHora(),
          error: true // UI-10: solo cambia cómo se ve (Leo apenado); no se envía a Gemini

        })
      } finally {
        this.cargandoChat = false
        this.scrollToBottom()
        // UI-07: el foco vuelve al campo para seguir escribiendo
        this.$nextTick(() => this.$refs.chatEntrada && this.$refs.chatEntrada.focus())
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    obtenerHora() {
      const ahora = new Date()
      return ahora.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    },

    // ========== TEST DIAGNÓSTICO ==========
    generarTest() {
      console.log('🎯 Cargando test diagnóstico pre-diseñado...');
      this.testDiagnostico = testDiagnostico;
      this.respuestasTest = {};
      this.diagnosticoIA = null;
      this.preguntaActual = 0; // UI-07: el test parte en la primera pregunta
      this.modalTestVisible = true;
      console.log('✅ Test cargado:', this.testDiagnostico);
    },

    seleccionarRespuestaTest(preguntaIndex, alternativaIndex) {
      this.respuestasTest = {
        ...this.respuestasTest,
        [preguntaIndex]: alternativaIndex
      }
    },

    async evaluarTest() {
      if (!this.apiKeyValida) {
        // UI-07: sin API key las opciones quedan desactivadas, así que aquí no se llega
        // desde la pantalla. Se mantiene la guarda, sin el alert.
        // alert('⚠️ Configura tu API Key de Gemini para obtener un diagnóstico personalizado');
        console.warn('[LeoIA] Diagnóstico sin API key de Gemini.');
        return;
      }

      // Calcular resultados
      let correctas = 0;
      const habilidadesEvaluadas = [];

      this.testDiagnostico.preguntas.forEach((pregunta, index) => {
        const esCorrecta = this.respuestasTest[index] === pregunta.respuesta_correcta;
        if (esCorrecta) correctas++;

        habilidadesEvaluadas.push({
          nombre: pregunta.habilidad.replace('_', ' '),
          correcta: esCorrecta
        });
      });

      const incorrectas = this.testDiagnostico.preguntas.length - correctas;

      // Cerrar modal del test
      this.modalTestVisible = false;

      // Generar diagnóstico con IA
      this.errorDiagnostico = false;
      this.cargandoDiagnostico = true;
      this.modalDiagnosticoVisible = true;

      try {
        console.log('🤖 Generando diagnóstico personalizado con IA...');
        this.diagnosticoIA = await generarDiagnosticoPersonalizado({
          correctas,
          incorrectas,
          habilidadesEvaluadas
        });
        console.log('✅ Diagnóstico generado:', this.diagnosticoIA);
      } catch (error) {
        console.error('❌ Error al generar diagnóstico:', error);
        // UI-07: el error se muestra dentro del panel, con "Intentar de nuevo"
        // (las respuestas del test se conservan para reintentar).
        // alert(`❌ Error al generar el diagnóstico: ${error.message}`);
        // this.modalDiagnosticoVisible = false;
        this.errorDiagnostico = true;
      } finally {
        this.cargandoDiagnostico = false;
      }
    },

    cerrarModalTest() {
      this.modalTestVisible = false
      this.testDiagnostico = null
      this.respuestasTest = {}
    },

    cerrarModalDiagnostico() {
      this.modalDiagnosticoVisible = false;
      this.diagnosticoIA = null;
      this.errorDiagnostico = false;
    },

    // ========== EJERCICIO ALEATORIO ==========
    async generarEjercicio() {
      if (!this.apiKeyValida) {
        // UI-07: el botón está desactivado sin API key; se deja la guarda sin el alert.
        // alert('⚠️ Configura tu API Key de Gemini primero')
        console.warn('[LeoIA] Ejercicio sin API key de Gemini.')
        return
      }

      this.errorEjercicio = ''
      this.cargandoIA = true
      try {
        const habilidades = ['idea_principal', 'inferencia', 'causa_efecto', 'secuencia', 'detalle_especifico']
        const habilidadAleatoria = habilidades[Math.floor(Math.random() * habilidades.length)]

        console.log('🎲 Generando ejercicio con Gemini de:', habilidadAleatoria)
        this.ejercicioAleatorio = await generarEjercicioAleatorio(habilidadAleatoria)
        console.log('✅ Ejercicio generado:', this.ejercicioAleatorio)
        this.respuestaEjercicio = null
        this.feedbackEjercicio = null
        this.modalEjercicioVisible = true
      } catch (error) {
        console.error('❌ Error al generar ejercicio:', error)
        // UI-07: mensaje dentro de la app en vez del alert con instrucciones técnicas
        // alert(`❌ Error: ${error.message}\n\nVerifica:\n1. API Key válida\n2. Acceso a Gemini habilitado`)
        this.errorEjercicio = 'No pude crear el ejercicio. Inténtalo de nuevo en un momento.'
      } finally {
        this.cargandoIA = false
      }
    },

    seleccionarRespuestaEjercicio(index) {
      if (!this.feedbackEjercicio) {
        this.respuestaEjercicio = index
      }
    },

    verificarRespuestaEjercicio() {
      const esCorrecta = this.respuestaEjercicio === this.ejercicioAleatorio.respuesta_correcta
      this.feedbackEjercicio = {
        correcto: esCorrecta,
        mensaje: esCorrecta
          ? '¡Excelente! Has identificado correctamente la respuesta.'
          : `La respuesta correcta es: ${this.ejercicioAleatorio.alternativas[this.ejercicioAleatorio.respuesta_correcta]}`
      }
    },

    cerrarModalEjercicio() {
      this.modalEjercicioVisible = false
      this.ejercicioAleatorio = null
      this.respuestaEjercicio = null
      this.feedbackEjercicio = null
      this.errorEjercicio = ''
    }
  }
}
</script>

<style scoped>
/* UI-07: estilos anteriores (degradados y animaciones de los modales), sin uso desde el rework.
   Se dejan comentados como referencia.
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
.slide-up-leave-to { transform: translateY(20px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
*/

.leoia {
  max-width: 44rem;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
}
.leoia__columna { display: flex; flex-direction: column; gap: 1rem; }
.leoia__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.625rem;
  line-height: 1.2;
  color: #14233b;
}
.leoia__bajada { margin: 0.25rem 0 0; font-size: 1rem; color: #52627a; }
.leoia__nota { margin: 0; font-size: 0.8125rem; line-height: 1.4; color: #52627a; }

.bienvenida { padding: 1rem; }

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

.antetitulo {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Opciones */
.opciones { display: flex; flex-direction: column; gap: 0.625rem; }
.opcion {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 4.5rem;
  box-sizing: border-box;
  padding: 0.75rem 0.875rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.125rem;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(20, 35, 59, 0.05);
}
.opcion:hover:not(:disabled) { border-color: #9db7dd; }
.opcion:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.opcion--activa { border: 2px solid #2568c4; padding: calc(0.75rem - 1px) calc(0.875rem - 1px); }
.opcion:disabled { cursor: not-allowed; background: #f6f8fb; opacity: 0.6; box-shadow: none; }
.opcion__textos { flex: 1; min-width: 0; }
.opcion__nombre {
  display: block;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.0625rem;
  color: #14233b;
}
.opcion__desc { display: block; margin-top: 0.125rem; font-size: 0.875rem; color: #52627a; }
.opcion__flecha { width: 1.375rem; height: 1.375rem; flex-shrink: 0; }

/* Avisos */
.aviso {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 0;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  font-size: 0.9375rem;
  line-height: 1.4;
}
.aviso svg { width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
/* UI-10: aviso con Leo apenado en lugar del ícono */
.aviso--leo { align-items: center; }
.aviso--leo > svg.leo-p { width: auto; height: auto; }
.aviso--ambar { background: #fff3cf; border: 1px solid #ecd28a; color: #3a4960; }
.aviso--verde { background: #e3f3ea; border: 1px solid #b9dcc7; color: #1f4d33; }
.aviso--corto { color: #5c3d00; }
.aviso__titulo { margin: 0; font-weight: 700; font-size: 1rem; color: #14233b; }
.aviso__texto { margin: 0.125rem 0 0; }

/* Chat */
.chat {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(20, 35, 59, 0.05);
}
.chat--completo {
  position: fixed;
  inset: 0;
  z-index: 45; /* sobre la barra superior (30) y el menú inferior (40) */
  border: 0;
  border-radius: 0;
  background: #fbfcfe;
}
.chat__cabecera {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem 0.75rem 1.25rem;
  border-bottom: 1px solid #d9e4f1;
  background: #ffffff;
}
.chat--completo .chat__cabecera { min-height: 3.5rem; box-sizing: border-box; padding: 0.375rem 0.75rem 0.375rem 0.5rem; }
.chat__avatar {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e4f0fb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat__avatar img { width: 2.125rem; height: 2.125rem; object-fit: contain; }
.chat--completo .chat__avatar { width: 2.25rem; height: 2.25rem; background: transparent; }
.chat__titulos { flex: 1; min-width: 0; }
.chat__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
}
.chat__subtitulo { margin: 0.0625rem 0 0; font-size: 0.875rem; color: #52627a; }
.chat--completo .chat__subtitulo { display: none; }
.chat__boton-icono {
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 0.75rem;
  background: transparent;
  cursor: pointer;
}
.chat__boton-icono svg { width: 1.5rem; height: 1.5rem; }
.chat__boton-icono:hover { background: #eef3f9; }
.chat__boton-icono:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }

.chat__mensajes {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #fbfcfe;
}
.chat__aviso-ia { margin: 0 0 0.25rem; text-align: center; font-size: 0.8125rem; color: #52627a; }
.mensaje { display: flex; }
.mensaje--mio { justify-content: flex-end; }
.mensaje--leo { justify-content: flex-start; }
.mensaje__leo { align-self: flex-end; flex-shrink: 0; margin-right: 0.375rem; } /* UI-10 */
.mensaje__globo { max-width: 85%; padding: 0.6875rem 0.8125rem; }
.mensaje--leo .mensaje__globo { background: #ffffff; border: 1px solid #d9e4f1; border-radius: 1rem 1rem 1rem 0.25rem; }
.mensaje--mio .mensaje__globo { background: #2568c4; border-radius: 1rem 1rem 0.25rem 1rem; }
.mensaje__texto { margin: 0; font-size: 1rem; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; color: #14233b; }
.mensaje--mio .mensaje__texto { color: #ffffff; }
.mensaje__hora { margin: 0.375rem 0 0; font-size: 0.75rem; color: #52627a; }
.mensaje--mio .mensaje__hora { color: #dbe8f8; }

.escribiendo { display: flex; gap: 0.375rem; padding: 0.875rem 1rem; }
.escribiendo span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #8a99ad;
  animation: escribiendo 1.2s ease-in-out infinite;
}
.escribiendo span:nth-child(2) { animation-delay: 0.15s; }
.escribiendo span:nth-child(3) { animation-delay: 0.3s; }
@keyframes escribiendo {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.chat__formulario {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 0.75rem 1rem;
  border-top: 1px solid #d9e4f1;
  background: #ffffff;
}
.chat__entrada {
  flex: 1;
  min-width: 0;
  height: 3rem;
  box-sizing: border-box;
  padding: 0 0.875rem;
  border: 1px solid #b9c9dd;
  border-radius: 0.875rem;
  font-family: inherit;
  font-size: 1rem; /* 16px: evita el zoom automático en iPhone */
  color: #14233b;
  background: #ffffff;
}
.chat__entrada::placeholder { color: #6b7a90; }
.chat__entrada:focus { outline: 3px solid #2568c4; outline-offset: 1px; border-color: #2568c4; }
.chat__entrada:disabled { background: #f6f8fb; }
.chat__enviar {
  height: 3rem;
  min-width: 3rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 0.75rem;
  border: 0;
  border-radius: 0.875rem;
  background: #2568c4;
  color: #ffffff;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}
.chat__enviar svg { width: 1.375rem; height: 1.375rem; }
.chat__enviar:hover:not(:disabled) { background: #1b4f9e; }
.chat__enviar:disabled { background: #8aa9d2; cursor: not-allowed; }
.chat__enviar:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }

.chat-enter-active, .chat-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.chat-enter-from, .chat-leave-to { opacity: 0; transform: translateY(12px); }

/* Test y ejercicio */
.avance-test { display: flex; flex-direction: column; gap: 0.4375rem; }
.avance-test__fila { display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem; }
.avance-test__actual { font-size: 0.9375rem; font-weight: 700; color: #14233b; }
.avance-test__respondidas { font-size: 0.875rem; color: #52627a; }

.pregunta { display: flex; flex-direction: column; gap: 0.875rem; }
.pregunta__habilidad { align-self: flex-start; text-transform: uppercase; }
.pregunta__texto {
  margin: 0;
  padding: 0.75rem 0.875rem;
  background: #f3f8fd;
  border: 1px solid #d9e4f1;
  border-radius: 0.875rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #14233b;
}
.pregunta__enunciado {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.0625rem;
  line-height: 1.35;
  color: #14233b;
}
.alternativas { display: flex; flex-direction: column; gap: 0.5rem; }
.alternativa {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  min-height: 3.25rem;
  box-sizing: border-box;
  padding: 0.75rem 0.875rem;
  border: 2px solid #d9e4f1;
  border-radius: 0.875rem;
  background: #ffffff;
  text-align: left;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.35;
  color: #14233b;
  cursor: pointer;
}
.alternativa:hover { border-color: #9db7dd; }
.alternativa:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.alternativa__letra {
  width: 1.625rem;
  height: 1.625rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #eef2f7;
  color: #3a4960;
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.alternativa__texto { padding-top: 0.125rem; }
.alternativa--marcada { border-color: #2568c4; background: #e4f0fb; }
.alternativa--marcada .alternativa__letra { background: #2568c4; color: #ffffff; }
.alternativa--correcta { border-color: #1f7a47; background: #e3f3ea; cursor: default; }
.alternativa--correcta .alternativa__letra { background: #1f7a47; color: #ffffff; }
.alternativa--revisar { border-color: #b07a00; background: #fffaeb; cursor: default; }
.alternativa--revisar .alternativa__letra { background: #8a5a00; color: #ffffff; }
.alternativa--apagada { cursor: default; color: #52627a; }
.alternativa--correcta:hover, .alternativa--revisar:hover, .alternativa--apagada:hover { border-color: inherit; }
.alternativa--apagada:hover { border-color: #d9e4f1; }

.pie-doble { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.625rem; }
.pie-doble > * { width: 100%; padding-left: 0.75rem; padding-right: 0.75rem; }
.pie-doble--asimetrico { grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr); }
.pie-uno { display: flex; }
.pie-nota { margin: 0.5rem 0 0; text-align: center; font-size: 0.875rem; color: #52627a; }

/* Carga */
.estado-carga {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  text-align: center;
  color: #3a4960;
}
.estado-carga p { margin: 0; font-size: 1rem; }
.estado-carga__giro { width: 2.5rem; height: 2.5rem; }
.giro { animation: giro 0.9s linear infinite; }
@keyframes giro { to { transform: rotate(360deg); } }

/* Diagnóstico */
.diagnostico__bajada { margin: -0.5rem 0 0; font-size: 0.875rem; color: #52627a; }
.bloque {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
  border: 1px solid #d9e4f1;
  border-radius: 1.125rem;
}
.bloque--verde { background: #f1f8f4; border-color: #cfe7d9; }
.bloque--ambar { background: #fffaeb; border-color: #f0dfa8; }
.bloque--azul { background: #f3f8fd; }
.bloque__cabecera { display: flex; align-items: center; gap: 0.625rem; }
.bloque__icono { width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
.bloque__nivel {
  margin: 0.125rem 0 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.1875rem;
  color: #14233b;
}
.bloque__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.0625rem;
  color: #14233b;
}
.bloque__lista { margin: 0; padding: 0 0 0 1.25rem; display: flex; flex-direction: column; gap: 0.375rem; font-size: 0.9375rem; line-height: 1.4; }
.bloque__texto { margin: 0; font-size: 0.9375rem; line-height: 1.45; color: #14233b; }
.bloque__consejo {
  margin: 0;
  padding: 0.625rem 0.75rem;
  background: #ffffff;
  border: 1px solid #d9e4f1;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.45;
  color: #3a4960;
}
.bloque__consejo strong { color: #14233b; }

.solo-lector {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* Escritorio: opciones a la izquierda y chat a la derecha */
@media (min-width: 768px) {
  .leoia { padding: 1.5rem 1.5rem 2rem; }
  .leoia__titulo { font-size: 2rem; }
  .leoia__bajada { font-size: 1.125rem; }
  .bienvenida { padding: 1.25rem 1.375rem; }
  .icono { width: 3rem; height: 3rem; border-radius: 0.875rem; }
  .icono svg { width: 1.625rem; height: 1.625rem; }
  .opcion { min-height: 4.75rem; padding: 0.75rem 1rem; gap: 0.875rem; }
  .opcion--activa { padding: calc(0.75rem - 1px) calc(1rem - 1px); }
  .opcion__nombre { font-size: 1.125rem; }
  .opcion__desc { font-size: 0.9375rem; }
  .leoia__nota { font-size: 0.875rem; }
}
@media (min-width: 1024px) {
  .leoia { padding: 1.25rem 2.5rem 2rem 1.5rem; }
  .leoia--con-chat {
    max-width: 72rem;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
  .leoia--con-chat .chat {
    position: sticky;
    top: 1rem;
    height: min(48rem, calc(100vh - 6.5rem));
  }
  .mensaje__globo { max-width: 82%; }
  .chat__formulario { padding: 0.875rem 1rem; gap: 0.625rem; }
  .chat__enviar { padding: 0 1.125rem; }
}

/* Animaciones: se apagan con "reducir movimiento" y con la preferencia de la app */
@media (prefers-reduced-motion: reduce) {
  .escribiendo span, .giro { animation: none; }
  .chat-enter-active, .chat-leave-active { transition: none; }
}
html[data-animaciones="off"] .escribiendo span,
html[data-animaciones="off"] .giro { animation: none; }
html[data-animaciones="off"] .chat-enter-active,
html[data-animaciones="off"] .chat-leave-active { transition: none; }
</style>
