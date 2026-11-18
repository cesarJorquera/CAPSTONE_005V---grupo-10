<template>
  <!-- UI-05: Rework de Inicio. Fondo plano (lo pone App.vue), saludo corto,
       tarjeta "Continuar" con Leo y unidades compactas con panel de detalle.
       El contenido de las unidades (qué se practica, próximamente) es el mismo
       de antes; ahora vive en el panel de detalle para que la pantalla respire. -->
  <div class="inicio" :class="{ 'inicio--entrada': conEntrada }">

    <!-- Saludo -->
    <header class="inicio__saludo">
      <h1 class="inicio__hola" data-test="saludo">Hola, {{ nombreCorto || 'lector' }}</h1>
      <p class="inicio__bajada">
        <span v-if="isReturningUser">Sigue con tu ruta cuando quieras.</span>
        <span v-else>Empieza tu ruta cuando quieras. Son pasos cortos.</span>
      </p>
    </header>

    <!-- Continuar donde lo dejaste -->
    <LeoTarjeta como="section" class="continuar" aria-labelledby="continuar-titulo" data-test="tarjeta-continuar">
      <LeoBurbuja
        class="continuar__leo"
        :mensaje="continuar.mensajeLeo"
        :disposicion="esAncho ? 'arriba' : 'lado'"
        :tamano="esAncho ? 150 : 96"
      />
      <div class="continuar__texto">
        <p class="continuar__etiqueta" data-test="continuar-etiqueta">{{ continuar.etiqueta }}</p>
        <h2 id="continuar-titulo" class="continuar__titulo" data-test="continuar-titulo">{{ continuar.titulo }}</h2>

        <div v-if="continuar.unidad || continuar.minutos || continuar.detalle" class="continuar__meta">
          <LeoEtiqueta v-if="continuar.unidad" :tono="continuar.tipo === 'unidad2' ? 'verde' : 'azul'">{{ continuar.unidad }}</LeoEtiqueta>
          <span v-if="continuar.minutos">{{ continuar.minutos }} min</span>
          <span v-if="continuar.detalle">{{ continuar.detalle }}</span>
        </div>

        <div v-if="continuar.total" class="continuar__avance">
          <LeoBarraProgreso
            :valor="continuar.hechos"
            :maximo="continuar.total"
            :alto="10"
            etiqueta="Avance de la Unidad 1"
          />
          <span class="continuar__pasos" data-test="continuar-pasos">{{ continuar.hechos }} de {{ continuar.total }} pasos</span>
        </div>

        <div class="continuar__acciones">
          <LeoBoton data-test="boton-continuar" @click="alContinuar">
            {{ continuar.boton }}
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10 H16 M11 5 L16 10 L11 15" /></svg>
          </LeoBoton>
          <button
            v-if="continuar.tipo !== 'unidad2'"
            type="button"
            class="inicio__enlace"
            data-test="ver-ruta"
            @click="entrarRuta"
          >Ver mi ruta</button>
        </div>
      </div>
    </LeoTarjeta>

    <!-- UI-10: aviso de Leo si no se pudo abrir un juego (antes era un alert del navegador) -->
    <LeoVacio
      v-if="avisoInicio"
      ref="avisoInicio"
      tipo="error"
      :titulo="avisoInicio.titulo"
      :texto="avisoInicio.texto"
      :accion="avisoInicio.reintentar ? 'Intentar de nuevo' : ''"
      cerrable
      data-test="aviso-inicio"
      @accion="reintentarUnidad"
      @cerrar="avisoInicio = null"
    />

    <!-- Unidades -->
    <section class="unidades" aria-labelledby="unidades-titulo">
      <h2 id="unidades-titulo" class="unidades__titulo">Unidades de aprendizaje</h2>

      <!-- Celular: lista compacta; tocar una fila abre su detalle -->
      <ul class="unidades__lista">
        <li v-for="u in unidades" :key="u.id">
          <button
            type="button"
            class="fila"
            :class="{ 'fila--apagada': u.bloqueada }"
            :data-test="`fila-${u.id}`"
            @click="abrirDetalle(u.id)"
          >
            <span class="icono-unidad" :style="{ background: u.fondoIcono }">
              <span class="icono-unidad__svg" v-html="u.icono"></span>
            </span>
            <span class="fila__textos">
              <span class="fila__antetitulo" :style="{ color: u.colorTexto }">{{ u.antetitulo }}</span>
              <span class="fila__nombre">{{ u.nombre }}</span>
              <span class="fila__avance">{{ u.textoAvance }}</span>
            </span>
            <svg class="fila__flecha" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4 L13 10 L7 16" /></svg>
          </button>
        </li>
      </ul>

      <!-- Tablet y escritorio: tarjetas (2 columnas en tablet, 3 en escritorio) -->
      <div class="unidades__grilla">
        <LeoTarjeta
          v-for="u in unidades"
          :key="u.id"
          como="article"
          class="unidad"
          :apagada="u.bloqueada"
          :data-test="`tarjeta-${u.id}`"
        >
          <div class="unidad__cabecera">
            <span class="icono-unidad icono-unidad--grande" :style="{ background: u.fondoIcono }">
              <span class="icono-unidad__svg" v-html="u.icono"></span>
            </span>
            <LeoEtiqueta v-if="u.bloqueada" tono="ambar">
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="9" width="12" height="8" rx="2" /><path d="M7 9 V6.5 a3 3 0 0 1 6 0 V9" /></svg>
              Próximamente
            </LeoEtiqueta>
            <button
              type="button"
              class="unidad__info"
              :aria-label="`Ver el detalle de la ${u.antetitulo.toLowerCase()}`"
              :data-test="`detalle-${u.id}`"
              @click="abrirDetalle(u.id)"
            >
              <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.5" /><path d="M10 9 V14" /><circle cx="10" cy="6.3" r="0.6" fill="currentColor" /></svg>
            </button>
          </div>
          <div>
            <p class="unidad__antetitulo" :style="{ color: u.colorTexto }">{{ u.antetitulo }}</p>
            <h3 class="unidad__nombre">{{ u.nombre }}</h3>
            <p class="unidad__resumen">{{ u.resumen }}</p>
          </div>
          <div class="unidad__avance">
            <LeoBarraProgreso
              :valor="u.valor"
              :maximo="u.maximo"
              :color="u.color"
              :etiqueta="`Avance de la ${u.antetitulo.toLowerCase()}`"
            />
            <span class="unidad__avance-texto">{{ u.textoAvance }}</span>
          </div>
          <LeoBoton
            v-if="!u.bloqueada"
            variante="secundario"
            tamano="compacto"
            ancho
            :data-test="`entrar-${u.id}`"
            @mouseenter="playSound('hover')"
            @click="entrarUnidad(u.id)"
          >{{ u.boton }}</LeoBoton>
        </LeoTarjeta>
      </div>
    </section>

    <!-- Detalle de la unidad (bottom sheet en celular, centrado en pantallas anchas) -->
    <LeoPanelDetalle
      :abierto="!!detalle"
      :titulo="detalle ? detalle.nombre : ''"
      :antetitulo="detalle ? detalle.antetitulo : ''"
      :color-antetitulo="detalle ? detalle.colorTexto : '#1b4f9e'"
      @cerrar="cerrarDetalle"
    >
      <template #icono>
        <span v-if="detalle" class="icono-unidad icono-unidad--grande" :style="{ background: detalle.fondoIcono }">
          <span class="icono-unidad__svg" v-html="detalle.icono"></span>
        </span>
      </template>

      <template v-if="detalle">
        <p class="detalle__para-que">{{ detalle.paraQue }}</p>

        <div v-if="detalle.practicas.length">
          <h3 class="detalle__subtitulo">Qué practicas</h3>
          <ul class="detalle__lista">
            <li v-for="item in detalle.practicas" :key="item">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" :stroke="detalle.colorTexto" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 10.5 L8.5 15 L16 6" /></svg>
              {{ item }}
            </li>
          </ul>
        </div>

        <div v-if="detalle.proximamente.length">
          <h3 class="detalle__subtitulo">Próximamente</h3>
          <ul class="detalle__lista detalle__lista--pronto">
            <li v-for="item in detalle.proximamente" :key="item">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#8a5a00" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6 V10 L12.5 12" /></svg>
              {{ item }}
            </li>
          </ul>
        </div>

        <div v-if="!detalle.bloqueada" class="unidad__avance">
          <LeoBarraProgreso
            :valor="detalle.valor"
            :maximo="detalle.maximo"
            :color="detalle.color"
            :etiqueta="`Avance de la ${detalle.antetitulo.toLowerCase()}`"
          />
          <span class="unidad__avance-texto">{{ detalle.textoAvance }}</span>
        </div>
      </template>

      <template v-if="detalle && !detalle.bloqueada" #pie>
        <LeoBoton ancho data-test="panel-entrar" @click="entrarDesdeDetalle(detalle.id)">{{ detalle.boton }}</LeoBoton>
      </template>
    </LeoPanelDetalle>

    <!-- UI-10: pregunta antes de repetir un juego con 100% (antes era un alert que solo tenía "Aceptar") -->
    <LeoPanelDetalle
      :abierto="!!repetirPendiente"
      titulo="¿Repetir este juego?"
      @cerrar="cancelarRepetir"
    >
      <div v-if="repetirPendiente" class="repetir" data-test="panel-repetir">
        <LeoPersonaje estado="explica" :tamano="76" animar-al-entrar decorativo />
        <p class="repetir__texto">Ya tienes 100% en «{{ repetirPendiente.nombre }}». Puedes repetirlo para practicar cuando quieras.</p>
      </div>
      <template #pie>
        <div class="repetir__acciones">
          <LeoBoton ancho data-test="repetir-si" @click="confirmarRepetir">Repetir</LeoBoton>
          <LeoBoton ancho variante="secundario" data-test="repetir-volver" @click="cancelarRepetir">Volver</LeoBoton>
        </div>
      </template>
    </LeoPanelDetalle>

    <!-- UI-09: logro grande de Leo (Unidad 1, un juego completo o Unidad 2), una sola vez cada uno -->
    <LogroLeo v-if="logroActual" :logro="logroActual" @cerrar="cerrarLogro" />
  </div>
</template>

<script>
// ============================================
// IMPORTACIONES
// ============================================
import { createGameManager } from '../utils/gameManager'
// UI-04: AsistenteIA se movió a la sección LeoIA (PantallaLeoIA.vue)
// import AsistenteIA from './AsistenteIA.vue'
// UI-05: componentes base y lógica de la tarjeta "Continuar"
import LeoBoton from './base/LeoBoton.vue'
import LeoTarjeta from './base/LeoTarjeta.vue'
import LeoEtiqueta from './base/LeoEtiqueta.vue'
import LeoBarraProgreso from './base/LeoBarraProgreso.vue'
import LeoBurbuja from './base/LeoBurbuja.vue'
import LeoPanelDetalle from './base/LeoPanelDetalle.vue'
import LogroLeo from './LogroLeo.vue' // UI-09
import LeoVacio from './base/LeoVacio.vue' // UI-10
import LeoPersonaje from './base/LeoPersonaje.vue' // UI-10
import { siguienteLogro, marcarLogroVisto, textoLogro } from '../utils/logrosLeo' // UI-09
import unidad1 from '../data/ruta/unidad1'
import { estadoDeNodos } from './ruta/progresoRuta'
import { cargarProgresoNube, sesionSigueEnCurso } from '../utils/supabaseProgress'
import { listarAvancesGuardados } from '../utils/avanceJuego'
import { elegirContinuar, contarPasos } from '../utils/continuarInicio'
import { primerNombre } from '../utils/nombre'
import { sonidosActivos, animacionesActivas } from '../utils/preferencias'

// UI-05: íconos de las unidades (los mismos del mockup). Son SVG fijos escritos aquí,
// sin datos del usuario, por eso se pueden insertar con v-html.
const ICONOS = {
  u1: '<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true"><path d="M3 9 Q9.5 6.5 16 10 Q22.5 6.5 29 9 V25 Q22.5 22.5 16 26 Q9.5 22.5 3 25 Z" fill="#2568c4"/><path d="M16 10 V26" stroke="#fff" stroke-width="1.6"/><path d="M6.5 13 Q10.5 12 13 13.5 M6.5 17 Q10.5 16 13 17.5 M19 13.5 Q21.5 12 25.5 13 M19 17.5 Q21.5 16 25.5 17" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
  u2: '<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true"><rect x="4" y="5" width="18" height="22" rx="3" fill="#1f7a47"/><path d="M8 11 H18 M8 15 H18 M8 19 H13" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><circle cx="22" cy="21" r="5.5" fill="#fff" stroke="#1f7a47" stroke-width="2.4"/><path d="M26 25 L29.5 28.5" stroke="#1f7a47" stroke-width="2.8" stroke-linecap="round"/></svg>',
  u3: '<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true"><path d="M16 3 L19 12 L28 16 L19 20 L16 29 L13 20 L4 16 L13 12 Z" fill="#b07a00"/><circle cx="16" cy="16" r="3" fill="#fff"/></svg>'
}

const CLAVE_ENTRADA = 'leo-perfecto-inicio-animado'

export default {
  name: 'MiProgreso',

  components: { LeoBoton, LeoTarjeta, LeoEtiqueta, LeoBarraProgreso, LeoBurbuja, LeoPanelDetalle, LogroLeo, LeoVacio, LeoPersonaje },
  // components: { AsistenteIA }, // UI-04: ya no se usa aquí (ver PantallaLeoIA.vue)
  // ============================================
  // PROPS
  // ============================================
  props: {
    playerName: {
      type: String,
      default: 'Jugador'
    },
    userProgress: {
      type: Array,
      default: () => []
    },
    isReturningUser: {
      type: Boolean,
      default: false
    }
  },
  
  // ============================================
  // ESTADO DEL COMPONENTE
  // ============================================
  data() {
    return {
      // Sistema de audio
      audioContext: null,
      
      // Gestor de juegos
      gameManager: null,

      // --- UI-05 ---
      sesionesNube: null, // progreso recién pedido a Supabase (null = usar el que trae App.vue)
      partida: null, // partida interrumpida en este dispositivo (ya verificada)
      detalleAbierto: null, // 'u1' | 'u2' | 'u3' | null
      esAncho: false, // >= 768px: Leo con la burbuja arriba; si no, al lado
      consultaAncho: null,
      alCambiarAncho: null,
      conEntrada: false, // animación de entrada (una vez por sesión del navegador)
      progresoU2: 0,
      logroActual: null, // UI-09: logro que se está mostrando
      avisoInicio: null, // UI-10: { titulo, texto, reintentar, unidadId } si no se pudo abrir un juego
      repetirPendiente: null // UI-10: juego con 100% que espera la respuesta de "¿Repetir?"
    };
  },
  
  // ============================================
  // UI-05: DATOS QUE MUESTRA INICIO
  // ============================================
  computed: {
    nombreCorto() {
      return primerNombre(this.playerName)
    },
    // Ids de las tareas de la ruta ya completadas (gameId de la ruta = 5)
    completadasRuta() {
      const sesiones = this.sesionesNube || this.userProgress || []
      const ids = sesiones
        .filter(s => s.gameId === unidad1.gameId && s.status === 'completed')
        .map(s => s.textId)
      return [...new Set(ids)]
    },
    nodosRuta() {
      return estadoDeNodos(unidad1.nodos, this.completadasRuta)
    },
    pasosRuta() {
      return contarPasos(this.nodosRuta)
    },
    continuar() {
      return elegirContinuar({ partida: this.partida, unidad: unidad1, nodos: this.nodosRuta })
    },
    unidades() {
      const { hechos, total } = this.pasosRuta
      const u2 = this.progresoU2
      return [
        {
          id: 'u1',
          antetitulo: 'Unidad 1',
          nombre: 'Las palabras',
          resumen: 'Sustantivos, verbos, adjetivos y conectores.',
          paraQue: '8 lecciones cortas de 3 a 5 minutos, con Leo como guía. Descubre qué hace cada palabra en una frase.',
          practicas: unidad1.nodos.map(n => n.titulo),
          proximamente: [],
          valor: hechos,
          maximo: total || 1,
          color: 'azul',
          textoAvance: hechos ? `${hechos} de ${total} pasos` : 'Aún no empiezas',
          boton: hechos ? 'Entrar a mi ruta' : 'Empezar mi ruta',
          bloqueada: false,
          icono: ICONOS.u1,
          fondoIcono: '#e4f0fb',
          colorTexto: '#1b4f9e'
        },
        {
          id: 'u2',
          antetitulo: 'Unidad 2',
          nombre: 'Comprensión lectora',
          resumen: 'Idea principal, causa y efecto, inferencias.',
          // Borrador de texto: validar con el cliente
          paraQue: 'Practicas cómo entender lo que lees: qué dice el texto, por qué pasa algo y qué se puede deducir de él.',
          practicas: [
            'Identificar la idea principal',
            'Identificar causa y efecto',
            'Hacer inferencias',
            'Identificar detalles específicos',
            'Identificar el propósito o la intención'
          ],
          proximamente: [
            'Comparación y contraste de ideas',
            'Interpretación de metáforas',
            'Análisis de estructura textual'
          ],
          valor: u2,
          maximo: 100,
          color: 'verde',
          textoAvance: u2 ? `${u2} % completado` : 'Aún no empiezas',
          boton: u2 ? 'Seguir jugando' : 'Empezar',
          bloqueada: false,
          icono: ICONOS.u2,
          fondoIcono: '#e3f3ea',
          colorTexto: '#1f6b40'
        },
        {
          id: 'u3',
          antetitulo: 'Unidad 3',
          nombre: 'Aplicación y metacognición',
          resumen: 'Textos más largos, síntesis y análisis.',
          paraQue: 'Esta unidad estará disponible más adelante.',
          practicas: [],
          proximamente: [
            'Lectura de textos extensos y complejos',
            'Síntesis y resumen de información',
            'Análisis crítico y formación de opiniones',
            'Estrategias de concentración y retención'
          ],
          valor: 0,
          maximo: 100,
          color: 'ambar',
          textoAvance: 'Disponible más adelante',
          boton: '',
          bloqueada: true,
          icono: ICONOS.u3,
          fondoIcono: '#fff3cf',
          colorTexto: '#8a5a00'
        }
      ]
    },
    detalle() {
      return this.unidades.find(u => u.id === this.detalleAbierto) || null
    }
  },

  // ============================================
  // CICLO DE VIDA: MOUNTED
  // ============================================
  mounted() {
    try {
      // Inicializar GameManager
      this.gameManager = createGameManager(this.playerName)
      
      // (UI-04) Los datos de progreso se cargan ahora en PantallaProgreso.vue

      // UI-05: avance de la Unidad 2 (igual que antes, desde gameManager)
      this.progresoU2 = this.getUnidadProgress(2)
      // UI-05: tarjeta "Continuar", ancho de pantalla y animación de entrada
      this.prepararInicio()
      
      // Inicializar audio
      this.initAudio()
      
      // Sonido de bienvenida
      this.playSound('welcome')
    } catch (error) {
      console.error('❌ Error al inicializar MiProgreso:', error)
    }
  },
  
  beforeUnmount() {
    this.dejarDeMedirAncho()
  },

  // ============================================
  // MÉTODOS DEL COMPONENTE
  // ============================================
  methods: {
    // ============================================
    // UI-05: INICIO
    // ============================================
    prepararInicio() {
      this.medirAncho()
      this.decidirEntrada()
      this.buscarPartida()
      // UI-09: con el progreso ya actualizado, revisar si hay un logro nuevo de Leo
      this.refrescarProgreso().then(() => this.revisarLogros())
    },

    // UI-09: muestra como máximo un logro por visita a Inicio (el siguiente, en la próxima)
    revisarLogros() {
      try {
        if (this.logroActual) return
        const progreso = [
          ...(this.gameManager ? this.gameManager.loadProgress() : []),
          ...(this.sesionesNube || this.userProgress || [])
        ]
        const id = siguienteLogro(this.playerName, { pasosRuta: this.pasosRuta, progreso })
        if (id) this.logroActual = textoLogro(id, { totalPasos: this.pasosRuta.total })
      } catch (error) {
        console.warn('No se pudieron revisar los logros de Leo:', error)
      }
    },
    cerrarLogro() {
      if (this.logroActual) marcarLogroVisto(this.playerName, this.logroActual.id)
      this.logroActual = null
    },

    // Leo va arriba de la burbuja desde 768px; en celular, al lado
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
    dejarDeMedirAncho() {
      try {
        if (!this.consultaAncho || !this.alCambiarAncho) return
        if (this.consultaAncho.removeEventListener) this.consultaAncho.removeEventListener('change', this.alCambiarAncho)
        else this.consultaAncho.removeListener(this.alCambiarAncho)
      } catch (error) {
        // nada que limpiar
      }
    },

    // Las tarjetas aparecen suavemente solo la primera vez que se abre Inicio en la sesión
    decidirEntrada() {
      if (!animacionesActivas()) return
      try {
        if (sessionStorage.getItem(CLAVE_ENTRADA)) return
        sessionStorage.setItem(CLAVE_ENTRADA, '1')
      } catch (error) {
        return
      }
      this.conEntrada = true
    },

    // Partida interrumpida en este dispositivo (menos de 24 horas). Se muestra al tiro y
    // luego se confirma con la base que siga abierta; si se cerró, la tarjeta pasa a la ruta.
    async buscarPartida() {
      const [masReciente] = listarAvancesGuardados()
      if (!masReciente) return
      this.partida = masReciente
      try {
        const abierta = await sesionSigueEnCurso(masReciente.sessionId)
        // Juego 3 retoma su carrera aunque la partida de ese texto ya esté cerrada (ver avanceJuego.js)
        // (se compara por sessionId: this.partida es la versión reactiva del mismo objeto)
        const sigueSiendoLaMisma = this.partida && this.partida.sessionId === masReciente.sessionId
        if (!abierta && masReciente.juego !== 3 && sigueSiendoLaMisma) this.partida = null
      } catch (error) {
        // Sin conexión: se mantiene la propuesta de retomar (el router vuelve a revisar al entrar)
        console.warn('No se pudo comprobar la partida guardada:', error)
      }
    },

    // El progreso que trae App.vue se carga al iniciar sesión; si el alumno avanzó en la
    // ruta después, se vuelve a pedir para que la tarjeta y las unidades estén al día.
    async refrescarProgreso() {
      try {
        this.sesionesNube = await cargarProgresoNube()
      } catch (error) {
        console.warn('No se pudo actualizar el progreso de Inicio; se usa el ya cargado:', error)
      }
    },

    alContinuar() {
      this.playSound('click')
      const { destino, tipo } = this.continuar
      if (tipo === 'unidad2') {
        this.iniciarUnidad(2)
        return
      }
      if (destino) this.$router.push(destino)
    },

    entrarUnidad(id) {
      if (id === 'u1') this.entrarRuta()
      else if (id === 'u2') this.iniciarUnidad(2)
    },
    abrirDetalle(id) {
      this.playSound('click')
      this.detalleAbierto = id
    },
    cerrarDetalle() {
      this.detalleAbierto = null
    },
    entrarDesdeDetalle(id) {
      this.detalleAbierto = null
      this.entrarUnidad(id)
    },

    // UI-04: loadPlayerData, resetearEstadisticas, calcularRachaDias y calcularFortalezasYDebilidades
    // (y los computed de nivel, progreso, emoji y mensaje) se movieron TAL CUAL a PantallaProgreso.vue,
    // porque solo los usa el bloque "Tu Progreso", que ahora vive en la sección Progreso.

    // MÉTODOS PARA GESTIÓN DE UNIDADES Y JUEGOS ALEATORIOS

    /**
     * Obtiene el progreso de una unidad específica
     * @param {number} unidadId - ID de la unidad (1, 2, 3)
     * @returns {number} - Porcentaje de progreso (0-100)
     */
    getUnidadProgress(unidadId) {
      try {
        if (!this.gameManager) return 0
        return this.gameManager.calcularProgresoUnidad(unidadId)
      } catch (error) {
        console.error(`❌ Error al calcular progreso de unidad ${unidadId}:`, error)
        return 0
      }
    },

    /**
    * Abre la ruta de aprendizaje (Unidad 1). App.vue decide qué pantalla mostrar.
     */
    entrarRuta() {
      this.playSound('click')
      this.$emit('abrir-ruta')
    },
    /**
     * Inicia una unidad seleccionando inteligentemente un juego
     * @param {number} unidadId - ID de la unidad a iniciar
     */
    iniciarUnidad(unidadId) {
      this.avisoInicio = null // UI-10
      try {
        this.playSound('click')

        // Verificar GameManager
        if (!this.gameManager) {
          console.error('❌ GameManager no disponible')
          // alert('❌ Error al iniciar juego') // UI-10: ahora es un aviso de Leo en la pantalla
          this.mostrarAvisoInicio(unidadId, 'error')
          return
        }

        // Seleccionar juego inteligente
        const juegoSeleccionado = this.gameManager.seleccionarJuegoInteligente(unidadId)

        if (!juegoSeleccionado) {
          // alert('❌ No hay juegos disponibles en esta unidad') // UI-10: aviso de Leo en la pantalla
          this.mostrarAvisoInicio(unidadId, 'sinJuegos')
          return
        }

        // Mostrar mensaje al jugador
        console.log('🎮 Juego seleccionado:', juegoSeleccionado)
        
        if (juegoSeleccionado.esRepeticion) {
          // alert(juegoSeleccionado.mensaje)
          // UI-10: el alert preguntaba "¿Quieres repetir?" pero solo tenía "Aceptar". Ahora se pregunta
          // de verdad; con "Repetir" se abre el mismo juego que antes (lanzarJuego).
          this.repetirPendiente = juegoSeleccionado
          return
        } else {
          console.log(juegoSeleccionado.mensaje)
        }

        this.lanzarJuego(juegoSeleccionado)
      } catch (error) {
        console.error('❌ Error al iniciar unidad:', error)
        // alert('❌ Error inesperado al iniciar juego') // UI-10: aviso de Leo en la pantalla
        this.mostrarAvisoInicio(unidadId, 'error')
      }
    },
    /**
     * UI-10: abre el juego elegido. Es el mismo código que antes estaba al final de iniciarUnidad,
     * separado para poder llamarlo también después de "Repetir".
     */
    lanzarJuego(juegoSeleccionado) {
      try {
        // Emitir evento según el tipo de juego
        this.$nextTick(() => {
          if (juegoSeleccionado.gameId === 1) {
            // Juego 1 - Identificación de palabras clave
            this.$emit('start-game1', { 
              textId: juegoSeleccionado.textId,
              esRepeticion: juegoSeleccionado.esRepeticion
            })
          } else if (juegoSeleccionado.gameId === 2) {
            // Juego 2 - Clasificar palabras
            this.$emit('start-game2', {
              esRepeticion: juegoSeleccionado.esRepeticion
            })
          } else if (juegoSeleccionado.gameId === 3) {
            // Juego 3 - Comprensión lectora
            this.$emit('start-game3', {
              textId: juegoSeleccionado.textId,
              esRepeticion: juegoSeleccionado.esRepeticion
            })
          }
        })

        console.log(`✅ Iniciando: ${juegoSeleccionado.nombre}`)
      } catch (error) {
        console.error('❌ Error al iniciar unidad:', error)
        // alert('❌ Error inesperado al iniciar juego') // UI-10: aviso de Leo en la pantalla
        this.mostrarAvisoInicio(null, 'error')
      }
    },
    // UI-10: aviso de Leo cuando no se pudo abrir un juego
    mostrarAvisoInicio(unidadId, motivo) {
      this.avisoInicio = motivo === 'sinJuegos'
        ? { titulo: 'Esta unidad aún no tiene juegos disponibles', texto: 'Vuelve a revisar más tarde.', reintentar: false, unidadId }
        : { titulo: 'No pudimos abrir el juego', texto: 'Puede ser la conexión. Tu avance no se pierde: inténtalo de nuevo en un momento.', reintentar: unidadId != null, unidadId }
      this.$nextTick(() => {
        const el = this.$refs.avisoInicio && this.$refs.avisoInicio.$el
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', behavior: animacionesActivas() ? 'smooth' : 'auto' })
      })
    },
    reintentarUnidad() {
      const unidadId = this.avisoInicio && this.avisoInicio.unidadId
      this.avisoInicio = null
      if (unidadId != null) this.iniciarUnidad(unidadId)
    },
    confirmarRepetir() {
      const juego = this.repetirPendiente
      this.repetirPendiente = null
      if (juego) this.lanzarJuego(juego)
    },
    cancelarRepetir() {
      this.repetirPendiente = null
    },

    // UI-04 — SIN USO, se deja comentado (no se borra): respondía a eventos del asistente IA, pero
    // AsistenteIA no emite ninguno y ya no está en esta pantalla.
    // handleIAAction(action) {
    //   this.playSound('click');
    //   // Aquí puedes emitir eventos o mostrar alertas según la acción
    //   switch(action) {
    //     case 'consejo':
    //       alert('💡 Consejo: Lee cada texto dos veces. La primera para entender la idea general, la segunda para los detalles importantes.');
    //       break;
    //     case 'explicacion':
    //       alert('📚 Explicación: Los juegos están diseñados para mejorar tu comprensión lectora paso a paso. Cada ejercicio te ayuda a desarrollar diferentes habilidades.');
    //       break;
    //     case 'pregunta':
    //       alert('❓ ¿Necesitas ayuda? Los módulos están ordenados por dificultad. Empieza por el Módulo 1 si es tu primera vez.');
    //       break;
    //   }
    // },

    initAudio() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    },

    playSound(type) {
      if (!this.audioContext) return;
      // UI-05: respeta el interruptor de sonidos (se podrá cambiar en Ajustes, UI-08)
      if (!sonidosActivos()) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      const now = this.audioContext.currentTime;
      
      switch(type) {
        case 'hover':
          oscillator.frequency.setValueAtTime(400, now);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
          break;
        case 'click':
          oscillator.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;
        case 'welcome':
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523, now);
          oscillator.frequency.setValueAtTime(659, now + 0.1);
          oscillator.frequency.setValueAtTime(784, now + 0.2);
          gainNode.gain.setValueAtTime(0.15, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          oscillator.start(now);
          oscillator.stop(now + 0.4);
          break;
      }
    },
  },
};
</script>

<style scoped>
/* UI-05: el estilo del carrusel de logros que había aquí ya no aplicaba
   (los logros pasaron a Progreso en UI-04). */
/* .overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #a78bfa; border-radius: 10px; }
.overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #8b5cf6; } */

.inicio {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: left;
  font-family: 'Atkinson Hyperlegible', system-ui, sans-serif;
  color: #3a4960;
}

/* Saludo */
.inicio__hola {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.625rem;
  line-height: 1.2;
  color: #14233b;
}
.inicio__bajada { margin: 0.25rem 0 0; font-size: 1rem; color: #52627a; }

.inicio__enlace {
  min-height: 2.75rem;
  padding: 0 0.25rem;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  color: #1b4f9e;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.inicio__enlace:hover { color: #14233b; }
.inicio__enlace:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; border-radius: 4px; }

/* UI-10: pregunta de repetir */
.repetir { display: flex; align-items: center; gap: 0.875rem; padding: 1rem; background: #e4f0fb; border-radius: 1.125rem; }
.repetir > :first-child { flex-shrink: 0; }
.repetir__texto { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #14233b; }
.repetir__acciones { display: flex; flex-direction: column; gap: 0.625rem; width: 100%; }

/* Tarjeta Continuar */
.continuar {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.125rem;
}
.continuar__texto { display: flex; flex-direction: column; gap: 0.625rem; min-width: 0; }
.continuar__etiqueta {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1b4f9e;
}
.continuar__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.3125rem;
  line-height: 1.2;
  color: #14233b;
}
.continuar__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  color: #52627a;
}
.continuar__avance { display: flex; align-items: center; gap: 0.75rem; max-width: 26rem; }
.continuar__pasos { font-size: 0.875rem; font-weight: 700; color: #3a4960; white-space: nowrap; }
.continuar__acciones {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

/* Unidades */
.unidades { display: flex; flex-direction: column; gap: 0.75rem; }
.unidades__titulo {
  margin: 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #14233b;
}
.unidades__lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.625rem; }
.unidades__grilla { display: none; }

.icono-unidad {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icono-unidad--grande { width: 3.5rem; height: 3.5rem; border-radius: 1rem; }
.icono-unidad__svg { display: block; width: 1.75rem; height: 1.75rem; }
.icono-unidad--grande .icono-unidad__svg { width: 2rem; height: 2rem; }

/* Fila (celular) */
.fila {
  width: 100%;
  min-height: 4.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid #d9e4f1;
  border-radius: 1rem;
  background: #ffffff;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  transition: transform 0.1s ease;
}
.fila:active { transform: scale(0.98); }
.fila:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.fila--apagada { background: #f6f8fb; }
.fila__textos { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1875rem; }
.fila__antetitulo { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.fila__nombre { font-family: 'Lexend', system-ui, sans-serif; font-weight: 600; font-size: 1rem; line-height: 1.2; color: #14233b; }
.fila__avance { font-size: 0.8125rem; font-weight: 700; color: #52627a; }
.fila__flecha { flex-shrink: 0; color: #52627a; }

/* Tarjeta de unidad (tablet y escritorio) */
.unidad { display: flex; flex-direction: column; gap: 0.875rem; padding: 1.25rem; }
.unidad__cabecera { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
.unidad__info {
  width: 2.75rem;
  height: 2.75rem;
  margin: -0.375rem -0.375rem 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #d9e4f1;
  border-radius: 50%;
  background: #ffffff;
  color: #52627a;
  cursor: pointer;
}
.unidad__info:hover { border-color: #2568c4; color: #1b4f9e; }
.unidad__info:focus-visible { outline: 3px solid #14233b; outline-offset: 2px; }
.unidad__antetitulo { margin: 0; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
.unidad__nombre {
  margin: 0.25rem 0 0;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.1875rem;
  line-height: 1.25;
  color: #14233b;
}
.unidad__resumen { margin: 0.375rem 0 0; font-size: 0.9375rem; line-height: 1.4; color: #52627a; }
.unidad__avance { display: flex; flex-direction: column; gap: 0.375rem; margin-top: auto; }
.unidad__avance-texto { font-size: 0.875rem; font-weight: 700; color: #3a4960; }

/* Panel de detalle */
.detalle__para-que { margin: 0; font-size: 1.0625rem; line-height: 1.5; color: #3a4960; }
.detalle__subtitulo {
  margin: 0 0 0.5rem;
  font-family: 'Lexend', system-ui, sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #14233b;
}
.detalle__lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.detalle__lista li { display: flex; align-items: flex-start; gap: 0.625rem; font-size: 1rem; line-height: 1.35; color: #3a4960; }
.detalle__lista svg { flex-shrink: 0; margin-top: 0.0625rem; }
.detalle__lista--pronto li { color: #52627a; }

/* Tablet: Leo arriba de la burbuja, unidades en 2 columnas */
@media (min-width: 768px) {
  .inicio { padding: 1.75rem 1.5rem 2.5rem; gap: 1.75rem; }
  .inicio__hola { font-size: 2rem; }
  .inicio__bajada { font-size: 1.125rem; }
  .continuar {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.75rem 2rem;
    border-radius: 1.5rem;
  }
  .continuar__leo { flex-shrink: 0; width: 17rem; }
  .continuar__titulo { font-size: 1.75rem; }
  .continuar__acciones { flex-direction: row; align-items: center; gap: 1.25rem; }
  .unidades__titulo { font-size: 1.375rem; }
  .unidades__lista { display: none; }
  .unidades__grilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; }
}
/* Escritorio: 3 columnas */
@media (min-width: 1024px) {
  .inicio { padding: 1.5rem 2.5rem 2.5rem 1.5rem; }
  .unidades__grilla { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

/* Entrada: las tarjetas aparecen una vez por sesión (se apaga con las preferencias) */
.inicio--entrada .inicio__saludo,
.inicio--entrada .continuar,
.inicio--entrada .unidades {
  animation: inicio-aparece 0.45s ease-out both;
}
.inicio--entrada .continuar { animation-delay: 0.06s; }
.inicio--entrada .unidades { animation-delay: 0.12s; }
@keyframes inicio-aparece {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .inicio--entrada .inicio__saludo,
  .inicio--entrada .continuar,
  .inicio--entrada .unidades { animation: none; }
  .fila { transition: none; }
  .fila:active { transform: none; }
}
html[data-animaciones="off"] .inicio--entrada .inicio__saludo,
html[data-animaciones="off"] .inicio--entrada .continuar,
html[data-animaciones="off"] .inicio--entrada .unidades { animation: none; }
html[data-animaciones="off"] .fila { transition: none; }
</style>
