<template>
  <div class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
    <!-- Mientras se revisa si hay una sesión guardada (evita mostrar el login un instante) -->
    <!-- Con el nombre ya conocido, saluda mientras llega el progreso (sustituye a la pantalla
         de bienvenida, que aparecía unos instantes al entrar y tenía un botón "continuar") -->
    <!-- UI-10: solo quien ya tiene la sesión guardada ve esta espera (sin sesión no se muestra nada
         antes de la landing o el login), y solo si dura más de 300 ms. El saludo anterior queda abajo:
    <div v-if="!$route.name" class="text-center text-gray-500 py-20" role="status" aria-live="polite">
      <template v-if="playerName">
        <p class="text-2xl font-bold text-gray-700 mb-2">¡Hola, {{ playerName }}! 👋</p>
        <p class="animate-pulse">Cargando tu progreso…</p>
      </template>
      <p v-else class="animate-pulse">Cargando…</p>
    </div>
    -->
    <div v-if="!$route.name" class="bg-leo-fondo min-h-screen" data-test="arranque">
      <LeoCarga
        v-if="usuario"
        variante="pantalla"
        :titulo="primerNombre ? 'Hola, ' + primerNombre : ''"
        mensaje="Estamos cargando tu avance…"
      />
    </div>

    <router-view v-else v-slot="{ Component, route }">
      <!-- Pantalla completa, sin navbar: landing, login, sala de ideas y proyector -->
      <component
        :is="Component"
        v-if="route.meta.layout === 'bare'"
        :key="claveDe(route)"
        v-bind="propsDe(route)"
        v-on="eventosDe(route)"
      />

      <!-- Con navbar. UI-05: fondo celeste plano (leo-fondo) en las pantallas con menú;
           la landing y el login (layout bare) no cambian. -->
      <div v-else class="bg-leo-fondo min-h-screen">
        <!-- UI-03: con el menú principal visible, "Menú Principal" y "Panel docente" ya están en
             el menú, igual que "Salir" (ahora debajo de Ajustes); solo se muestran aquí en las
             pantallas sin menú (los juegos). -->
        <AppNavbar
          :show-progress-button="sesionIniciada && !!route.meta.sinMenu"
          :sesion-iniciada="sesionIniciada && !!route.meta.sinMenu"
          :mostrar-panel-docente="esDocente && !!route.meta.sinMenu"
          :nombre="playerName"
          :titulo="route.meta.titulo || ''"
          :atras="route.meta.atras ? { name: route.meta.atras } : null"
          :en-juego="!!route.meta.sinMenu"
          @go-progreso="goToProgreso"
          @go-panel-docente="irAlPanelDocente"
          @cerrar-sesion="salir"
        />
        <!-- Escritorio: menú lateral + contenido. Celular: el menú es una barra inferior fija. -->
        <div :class="{ 'lg:flex lg:items-start': !route.meta.sinMenu }">
          <MenuPrincipal v-if="!route.meta.sinMenu" :es-docente="esDocente" @salir="salir" />
          <div class="flex-1 min-w-0" :class="{ 'pb-24 lg:pb-0': !route.meta.sinMenu }">
            <div v-if="errorProgreso" class="max-w-4xl mx-auto px-4 pt-4">
              <!-- UI-10: mismo mensaje, con Leo apenado. El aviso anterior:
              <p class="rounded-xl border border-red-300 bg-red-50 p-4 text-red-800" role="alert">
                No se pudo cargar tu progreso desde la nube. Tus datos no se han reemplazado.
                Revisa tu conexión e intenta iniciar sesión nuevamente.
              </p>
              -->
              <LeoVacio
                tipo="error"
                compacto
                titulo="No se pudo cargar tu progreso"
                texto="Tus datos no se han reemplazado. Revisa tu conexión e intenta iniciar sesión nuevamente."
                data-test="error-progreso"
              />
            </div>

            <!-- Menú principal: ocupa todo el ancho -->
            <component
              :is="Component"
              v-if="route.meta.ancho"
              :key="claveDe(route)"
              v-bind="propsDe(route)"
              v-on="eventosDe(route)"
            />

            <!-- UI-05: el espacio de 150px arriba se deja solo en los juegos (ahí está Leo, la mascota);
                 en la ruta, las reglas y el panel docente dejaba un hueco bajo la barra nueva -->
            <div v-else class="container mx-auto px-4 py-6 max-w-4xl" :style="route.meta.sinMenu ? 'margin-top: 150px;' : ''">
              <component
                :is="Component"
                :key="claveDe(route)"
                v-bind="propsDe(route)"
                v-on="eventosDe(route)"
              />
              <mascota
                v-if="route.meta.mascota"
                current-screen="questions"
              />
            </div>
          </div>
        </div>
      </div>
    </router-view>

    <!-- UI-10: al abrir un juego, mientras se prepara la partida guardada (solo si tarda más de 300 ms) -->
    <LeoCarga v-if="abriendoJuego" variante="superpuesta" mensaje="Preparando tu juego…" data-test="abriendo-juego" />

    <!-- MEJ-03: aviso de confirmación al salir de algo en curso (juego, actividad) -->
    <ModalConfirmacion />
  </div>
</template>

<script>
import AppNavbar from './components/Navbar.vue'
import MenuPrincipal from './components/menu/MenuPrincipal.vue'
// MEJ-03 — pant_bienvenida queda SIN USO y se deja comentado (no se borra):
// antes se veía unos instantes al iniciar sesión (currentScreen = 'welcome') mientras
// se descargaba el progreso, y su botón "continuar" abría las reglas del Juego 1.
// Con el router, mientras se carga se muestra el saludo "¡Hola, {nombre}!" (ver el
// <template> de arriba) y el menú se abre solo al terminar. El archivo
// src/components/pant_bienvenida.vue sigue intacto por si se quiere reutilizar
// (por ejemplo como ruta /bienvenida).
// import pant_bienvenida from './components/pant_bienvenida.vue'
// UI-09: la mascota de los juegos usa el Leo nuevo (MascotaJuego.vue, misma lógica y métodos).
// Para volver a la mascota anterior, usar la línea comentada de abajo en lugar de la nueva.
// import mascota from './components/mascota.vue'
import mascota from './components/MascotaJuego.vue'
import { supabaseConfigurado } from './utils/supabaseClient'
import {
  entrarConGoogle,
  cerrarSesion,
  obtenerSesion,
  escucharCambiosDeSesion,
  cargarPerfil,
  nombreVisible,
  esDocente
} from './utils/authService'
import { getAllTextIds, getNextText } from './data/game1_texts'
import { createGameManager } from './utils/gameManager'
import { cargarProgresoNube } from './utils/supabaseProgress'
import ModalConfirmacion from './components/ModalConfirmacion.vue'
import LeoCarga from './components/base/LeoCarga.vue'
import LeoVacio from './components/base/LeoVacio.vue'
import { confirmarSiHayAvance, omitirConfirmacion } from './utils/confirmarSalida'
import { TEXTOS_JUEGO2, rutaInicio, recordarDestino } from './router'
import { estadoSesion, marcarSesionLista } from './router/estadoSesion'

export default {
  name: 'App',
  components: {
    AppNavbar,
    MenuPrincipal,
    mascota,
    ModalConfirmacion,
    LeoCarga,
    LeoVacio
  },
  data() {
    return {
      playerName: '', // Ahora viene del perfil de Google, ya no se escribe a mano
      completedTexts: [], // IDs de textos completados
      userProgress: null, // Progreso cargado desde Supabase
      isReturningUser: false, // Flag para usuarios que regresan
      errorProgreso: false,
      // --- Cuentas y acceso (CU-01 a CU-04) ---
      supabaseConfigurado,
      usuario: null, // usuario de Supabase Auth (null = sin sesión)
      perfil: null, // fila de la tabla profiles (incluye rol)
      cargandoLogin: false,
      errorLogin: '',
      dejarDeEscucharSesion: null,
      promesaEntrada: null, // carga de perfil y progreso en curso (evita cargarlos dos veces)
      abriendoJuego: false, // UI-10: se está preparando la partida de un juego
      quitarAvisosRuta: [] // UI-10: para dejar de escuchar al router al cerrar
    }
  },
  computed: {
    sesionIniciada() {
      return this.usuario !== null
    },
    esDocente() {
      return esDocente(this.perfil)
    },
    availableTextIds() {
      return getAllTextIds()
    },
    hasMoreTexts() {
      return getNextText(this.textIdRuta) !== null
    },
    // Texto que indica la URL (/juego/1/:textId, /juego/2/:textId)
    textIdRuta() {
      return this.$route.params.textId || ''
    },
    // UI-10: "Hola, Ana" en la espera del arranque. Mientras llega el perfil se usa el nombre de la
    // cuenta (el mismo que muestra nombreVisible sin perfil), para no cambiar el saludo a mitad de la espera.
    primerNombre() {
      const nombre = this.playerName || (this.usuario ? nombreVisible(null, this.usuario) : '')
      return String(nombre || '').trim().split(/\s+/)[0]
    }
  },
  mounted() {
    this.iniciarAutenticacion()
    // UI-10: solo muestra la espera al abrir un juego; no cambia cómo se navega ni qué se carga
    if (this.$router) {
      this.quitarAvisosRuta = [
        // beforeEach (no beforeResolve): así se marca antes de que el router espere la partida guardada
        this.$router.beforeEach(to => {
          if (typeof to.meta.avance === 'function') this.abriendoJuego = true
        }),
        this.$router.afterEach(() => { this.abriendoJuego = false }),
        this.$router.onError(() => { this.abriendoJuego = false })
      ]
    }
  },
  beforeUnmount() {
    if (this.dejarDeEscucharSesion) this.dejarDeEscucharSesion()
    this.quitarAvisosRuta.forEach(quitar => quitar())
  },
  methods: {
    // ============================================
    // PANTALLAS: qué recibe y qué escucha cada ruta (MEJ-03)
    // ============================================
    // El router decide QUÉ pantalla se muestra; estas funciones le pasan
    // a cada pantalla los datos y los eventos que ya usaba antes.
    claveDe(route) {
      // Cambiar de texto dentro de un juego vuelve a crear la pantalla
      return route.name + (route.params.textId ? `:${route.params.textId}` : '')
    },
    propsDe(route) {
      switch (route.name) {
        case 'login':
          return {
            configurado: this.supabaseConfigurado,
            cargando: this.cargandoLogin,
            error: this.errorLogin
          }
        case 'sala':
          return { codigoSalaInicial: String(route.query.sala || '').trim() }
        case 'inicio':
          return {
            playerName: this.playerName,
            userProgress: this.userProgress || [],
            isReturningUser: this.isReturningUser
          }
        case 'progreso':
          return { playerName: this.playerName, userProgress: this.userProgress || [] }
        case 'leoia':
          // UI-07: el nombre es solo para el saludo de Leo
          return { playerName: this.playerName }
        case 'ajustes':
          // UI-08: datos del perfil (solo lectura)
          return {
            playerName: this.playerName,
            correo: this.usuario ? this.usuario.email || '' : '',
            esDocente: this.esDocente
          }
        case 'docente':
          return { nombreDocente: this.playerName }
        case 'docente-proyector':
        case 'docente-control':
          return { docenteId: this.usuario ? this.usuario.id : '' }
        case 'juego1':
          return { playerName: this.playerName, textId: route.params.textId }
        case 'juego2-reglas':
          return { textId: route.params.textId }
        case 'juego2':
          return { currentScreen: 'dragdrop', playerName: this.playerName, textId: route.params.textId }
        case 'juego3':
        case 'juego4':
          return { playerName: this.playerName }
        default:
          return {}
      }
    },
    eventosDe(route) {
      switch (route.name) {
        case 'landing':
          return { entrar: () => this.$router.push({ name: 'login' }) }
        case 'login':
          return {
            'entrar-google': this.entrar,
            'unirse-sala': this.handleUnirseSala,
            volver: () => this.$router.push({ name: 'landing' })
          }
        case 'sala':
          return { 'volver-inicio': this.volverAlInicioDesdeSala }
        case 'inicio':
          return {
            'start-game1': this.handleStartGame1,
            'start-game2': this.handleStartGame2,
            'start-game3': this.handleStartGame3,
            'start-game4': this.handleStartGame4,
            'abrir-ruta': this.irARuta
          }
        case 'ruta':
          return { salir: this.goToProgreso }
        case 'docente':
          return {
            'elegir-aula': () => this.$router.push({ name: 'docente-aula' }),
            'elegir-dash': () => this.$router.push({ name: 'docente-panel' }),
            volver: this.goToProgreso
          }
        case 'docente-aula':
          return {
            'abrir-leo-ideas': () => this.$router.push({ name: 'docente-proyector' }),
            volver: () => this.$router.push({ name: 'docente' })
          }
        case 'docente-proyector':
          return { salir: () => this.$router.push({ name: 'docente-aula' }) }
        case 'docente-panel':
          return {
            'abrir-control-leo-ideas': () => this.$router.push({ name: 'docente-control' }),
            volver: () => this.$router.push({ name: 'docente' })
          }
        case 'docente-control':
          return { volver: () => this.$router.push({ name: 'docente-panel' }) }
        case 'juego1-reglas':
          return { start: this.startGame }
        case 'juego1':
          return {
            continue: this.handleGame1Continue,
            restart: this.goToInstructions,
            'try-next-text': this.handleTryNextText,
            'go-to-progreso': this.goToProgreso
          }
        case 'juego2-reglas':
          return { continue: this.goToDragDrop }
        case 'juego2':
          return {
            continue: this.goToProgreso,
            'restart-game2': this.goToDragDropRules,
            'try-next-text': this.handleTryNextGame2Text
          }
        case 'juego3':
          return { 'volver-menu': this.goToProgreso }
        case 'juego4-reglas':
          return {
            'start-game': () => this.$router.push({ name: 'juego4' }),
            'volver-menu': this.goToProgreso
          }
        case 'juego4':
          return {
            'volver-menu': this.goToProgreso,
            reintentar: () => this.$router.push({ name: 'juego4-reglas' })
          }
        default:
          return {}
      }
    },

    // ============================================
    // CUENTAS Y ACCESO (CU-02, CU-03, CU-04)
    // ============================================
    async iniciarAutenticacion() {
      if (!this.supabaseConfigurado) {
        marcarSesionLista() // sin sesión: el login explica qué falta
        return
      }
      // 1) Escuchar entradas y salidas (login con Google, logout, otra pestaña)
      this.dejarDeEscucharSesion = escucharCambiosDeSesion({
        alEntrar: (sesion) => this.entrarConSesion(sesion),
        alSalir: () => this.volverAlLogin()
      })
      // 2) CU-03: si ya había sesión guardada, entrar directo sin login
      try {
        const sesion = await obtenerSesion()
        if (sesion) await this.entrarConSesion(sesion)
      } catch (error) {
        console.error('No se pudo revisar la sesión:', error)
      } finally {
        // Con o sin sesión, el router ya puede decidir a qué pantalla ir
        marcarSesionLista()
      }
    },
    async entrar() {
      this.errorLogin = ''
      this.cargandoLogin = true
      // Google saca al navegador de la app: se recuerda a dónde quería ir
      recordarDestino(this.$route.query.redirect)
      try {
        await entrarConGoogle() // el navegador se va a Google y vuelve
      } catch (error) {
        console.error('Error al entrar con Google:', error)
        this.errorLogin = 'No se pudo abrir el inicio de sesión con Google. Intenta de nuevo.'
        this.cargandoLogin = false
      }
    },
    entrarConSesion(sesion) {
      // Supabase puede avisar SIGNED_IN más de una vez (al volver a la pestaña,
      // o junto con la sesión guardada): si ya entró este usuario, no cargar de nuevo.
      // Se devuelve la misma promesa para que quien llegó segundo espere a que
      // el perfil y el progreso estén listos. Sin esto, un alumno a mitad de juego
      // volvería al menú.
      if (this.usuario && this.usuario.id === sesion.user.id) return this.promesaEntrada
      this.usuario = sesion.user
      estadoSesion.usuario = sesion.user
      this.promesaEntrada = this.cargarDatosDeSesion(sesion)
      return this.promesaEntrada
    },
    async cargarDatosDeSesion(sesion) {
      this.perfil = await cargarPerfil(sesion.user.id)
      estadoSesion.esDocente = this.esDocente
      // El nombre ya no se escribe: sale del perfil / cuenta de Google.
      // Se usa para mostrar el nombre; el progreso se identifica por el UUID de Auth.
      this.playerName = nombreVisible(this.perfil, sesion.user)
      try {
        localStorage.setItem('leo-perfecto-player', this.playerName) // los juegos lo leen como respaldo
      } catch (error) {
        console.warn('No se pudo guardar el nombre en localStorage:', error)
      }
      this.cargandoLogin = false
      if (!this.esDocente) {
        await this.cargarProgresoDelAlumno() // carga el progreso asociado a la cuenta
      }
      // Si la sesión llegó estando en la landing o el login (p. ej. desde otra pestaña), ir al inicio
      if (this.$route.meta.soloInvitado) {
        this.$router.replace(rutaInicio())
      }
    },
    async salir() {
      // MEJ-03: si hay una partida o actividad en curso, preguntar ANTES de cerrar la sesión
      if (!(await confirmarSiHayAvance('cerrar-sesion'))) return
      try {
        await cerrarSesion()
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
      this.volverAlLogin() // no esperar al aviso de Supabase para cambiar de pantalla
    },
    // Navega sin preguntar: la salida ya se confirmó, o no es voluntaria (la sesión se cerró en otra pestaña)
    async irSinConfirmar(destino) {
      omitirConfirmacion(true)
      try {
        await this.$router.push(destino)
      } finally {
        omitirConfirmacion(false)
      }
    },
    volverAlLogin() {
      this.usuario = null
      this.perfil = null
      this.promesaEntrada = null
      estadoSesion.usuario = null
      estadoSesion.esDocente = false
      this.playerName = ''
      this.userProgress = null
      this.errorProgreso = false
      this.completedTexts = []
      this.isReturningUser = false
      this.cargandoLogin = false
      // La sala de ideas y las pantallas públicas siguen donde están
      if (this.$route.meta.publica) return
      return this.irSinConfirmar({ name: 'landing' })
    },
    irAlPanelDocente() {
      if (!this.esDocente) return
      this.$router.push({ name: 'docente' })
    },
    // RUTA (5/5): abre la ruta de aprendizaje (desde la tarjeta Unidad 1 de MiProgreso)
    irARuta() {
      this.$router.push({ name: 'ruta' })
    },
    handleUnirseSala(codigo) {
      const limpio = String(codigo || '').trim()
      if (!/^\d{6}$/.test(limpio)) return
      this.$router.push({ name: 'sala', query: { sala: limpio } })
    },
    volverAlInicioDesdeSala() {
      this.$router.push(this.usuario ? rutaInicio() : { name: 'landing' })
    },
    async loadUserProgress(playerName) {
      const progress = await cargarProgresoNube()
      const gameManager = createGameManager(playerName)
      const completedProgress = progress.filter(item => item.status === 'completed')
      if (!gameManager.saveProgress(completedProgress)) {
        throw new Error('No se pudo actualizar la copia local del progreso descargado.')
      }

      this.userProgress = progress
      this.completedTexts = completedProgress
        .filter(item => item.gameId === 1)
        .map(item => item.textId)
      this.isReturningUser = completedProgress.length > 0

      return this.isReturningUser
    },
    getNextAvailableText() {
      // Buscar el primer texto no completado
      const nextText = this.availableTextIds.find(textId => !this.completedTexts.includes(textId))
      return nextText || 'text1' // Si todos están completados, volver al primero
    },
    async cargarProgresoDelAlumno() {
      if (!this.playerName.trim()) return
      this.errorProgreso = false
      try {
        await this.loadUserProgress(this.playerName.trim())
      } catch (error) {
        console.error('No se pudo cargar el progreso desde Supabase:', error)
        this.errorProgreso = true
        this.userProgress = []
        this.completedTexts = []
        this.isReturningUser = false
      }
    },

    // ============================================
    // FUNCIONES SIN USO (comentadas, no borradas) — MEJ-03
    // ============================================
    // Ninguna de estas cuatro se llamaba desde App.vue ni desde otro componente
    // (se buscó en todo src/). Además dependían de `currentScreen` y `showProgreso`,
    // que con el router ya no existen: la pantalla la decide la URL. Se dejan
    // comentadas como referencia; si se necesitan de nuevo, hay que reescribirlas
    // con `this.$router.push({ name: '...' })`.
    //
    // showReturningUserWelcome() {
    //   // Cambiar a pantalla de bienvenida con información del progreso
    //   this.currentScreen = 'welcome'
    // },
    // goToQuestions() {
    //   this.currentScreen = 'questions'
    // },
    // restartGame() {
    //   this.currentScreen = 'login'
    //   this.playerName = ''
    //   this.currentTextId = 'text1'
    //   this.completedTexts = []
    // },
    // closeProgreso() {
    //   this.showProgreso = false;
    // },

    // ============================================
    // NAVEGACIÓN ENTRE PANTALLAS DEL ALUMNO
    // ============================================
    goToProgreso() {
      this.$router.push({ name: 'inicio' })
    },
    // Juego 1
    goToInstructions() {
      this.$router.push({ name: 'juego1-reglas', params: { textId: this.textIdRuta } })
    },
    startGame() {
      this.$router.push({ name: 'juego1', params: { textId: this.textIdRuta } })
    },
    handleGame1Continue() {
      // Marcar texto como completado
      if (!this.completedTexts.includes(this.textIdRuta)) {
        this.completedTexts.push(this.textIdRuta)
      }
      // Regresar a MiProgreso después de completar un texto
      this.goToProgreso()
    },
    handleTryNextText(nextTextId) {
      // Cambiar al siguiente texto disponible
      this.$router.push({ name: 'juego1-reglas', params: { textId: nextTextId } })
    },
    handleStartGame1(gameInfo) {
      const textId = (gameInfo && gameInfo.textId) || this.getNextAvailableText()
      this.$router.push({ name: 'juego1-reglas', params: { textId } })
    },
    // Juego 2
    goToDragDropRules() {
      this.$router.push({ name: 'juego2-reglas', params: { textId: this.textIdRuta } })
    },
    goToDragDrop() {
      this.$router.push({ name: 'juego2', params: { textId: this.textIdRuta } })
    },
    handleStartGame2(gameInfo) {
      // Si se especifica un textId, usarlo; si no, obtener el siguiente no completado
      const textId = (gameInfo && gameInfo.textId) || this.getNextGame2Text()
      this.$router.push({ name: 'juego2-reglas', params: { textId } })
    },
    getNextGame2Text() {
      // Obtener progreso del jugador para juego 2
      const playerName = this.playerName || localStorage.getItem('leo-perfecto-player') || 'anonimo';
      const progressKey = `leo-perfecto-progress-${playerName}`;
      const savedProgress = localStorage.getItem(progressKey);

      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          // Filtrar solo progreso del juego 2
          const game2Progress = progress.filter(p => p.gameId === 2);
          const completedTexts = game2Progress.map(p => p.textId);

          // Buscar el primer texto no completado
          const nextText = TEXTOS_JUEGO2.find(textId => !completedTexts.includes(textId));
          return nextText || 'drag1'; // Si todos están completados, volver al primero
        } catch (error) {
          console.error('Error al obtener progreso:', error);
        }
      }

      return 'drag1'; // Por defecto, el primer texto
    },
    handleTryNextGame2Text(nextTextId) {
      // Cambiar al siguiente texto y volver a las reglas
      this.$router.push({ name: 'juego2-reglas', params: { textId: nextTextId } })
    },
    // Juego 3 (maneja su propia selección de textos internamente)
    // eslint-disable-next-line no-unused-vars
    handleStartGame3(gameInfo) {
      this.$router.push({ name: 'juego3' })
    },
    // Juego 4 (Trivia)
    // eslint-disable-next-line no-unused-vars
    handleStartGame4(gameInfo) {
      this.$router.push({ name: 'juego4-reglas' })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
</style>