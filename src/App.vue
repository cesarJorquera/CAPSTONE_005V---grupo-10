<template>
  <div class="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
    <AppNavbar 
      :show-progress-button="sesionIniciada && !showProgreso" 
      :sesion-iniciada="sesionIniciada"
      :mostrar-panel-docente="esDocente"
      @go-progreso="goToProgreso" 
      @go-panel-docente="irAlPanelDocente"
      @cerrar-sesion="salir"
    />
    <div v-if="showProgreso">
      <MiProgreso 
        ref="miProgresoComponent"
        :player-name="playerName"
        :user-progress="userProgress || []"
        :is-returning-user="isReturningUser"
        @start-game1="handleStartGame1"
        @start-game2="handleStartGame2"
        @start-game3="handleStartGame3"
        @start-game4="handleStartGame4"
      />
    </div>
    <div v-else class="container mx-auto px-4 py-6 max-w-4xl" style="margin-top: 150px;">
      <!-- Mientras se revisa si hay una sesión guardada (evita mostrar el login un instante) -->
      <div v-if="currentScreen === 'cargando'" class="text-center text-gray-500 py-20 animate-pulse">
        Cargando…
      </div>

      <!-- CU-02: login con Google (reemplaza la pantalla "escribe tu nombre") -->
      <pant_login
        v-if="currentScreen === 'login'"
        :configurado="supabaseConfigurado"
        :cargando="cargandoLogin"
        :error="errorLogin"
        @entrar-google="entrar"
      />

      <!-- CU-04: la puerta del panel docente. El panel real es Sprint 2 (PA-01) -->
      <div v-if="currentScreen === 'panelDocente' && esDocente" class="bg-white rounded-3xl shadow-xl p-8 text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">📊 Panel docente</h2>
        <p class="text-gray-600 mb-6">Próximamente: aquí verás el avance de tus estudiantes.</p>
        <button class="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl" @click="goToProgreso">
          Volver
        </button>
      </div>

      <pant_bienvenida 
        v-if="currentScreen === 'welcome'"
        :player-name="playerName"
        :user-progress="userProgress || []"
        :is-returning-user="isReturningUser"
        :completed-texts="completedTexts"
        :next-text-id="currentTextId"
        @continue="goToInstructions"
      />

      <pant_reglas_game1 
        v-if="currentScreen === 'instructions'"
        @start="startGame"
      />

      <pant_game_1 
        v-if="currentScreen === 'questions'"
        :key="currentTextId"
        :player-name="playerName"
        :text-id="currentTextId"
        @continue="handleGame1Continue"
        @restart="goToInstructions"
        @try-next-text="handleTryNextText"
        @go-to-progreso="goToProgreso"
      />

      <pant_reglas_game2
        v-if="currentScreen === 'dragdropRules'"
        :text-id="currentGame2TextId"
        @continue="goToDragDrop"
      />

      <pant_game_2
        v-if="currentScreen === 'dragdrop'"
        :key="currentGame2TextId"
        :current-screen="currentScreen"
        :player-name="playerName"
        :text-id="currentGame2TextId"
        @continue="goToProgreso"
        @restart-game2="goToDragDropRules"
        @try-next-text="handleTryNextGame2Text"
      />

      <pant_game_3
        v-if="currentScreen === 'game3'"
        :key="currentGame3TextId"
        :player-name="playerName"
        @volver-menu="goToProgreso"
      />

      <!-- Juego 4: Trivia -->
      <pant_reglas_game4
        v-if="currentScreen === 'instructions_game4'"
        @start-game="currentScreen = 'game4'"
        @volver-menu="goToProgreso"
      />

      <pant_game_4
        v-if="currentScreen === 'game4'"
        :player-name="playerName"
        @volver-menu="goToProgreso"
        @reintentar="currentScreen = 'instructions_game4'"
      />

      <mascota 
        v-if="currentScreen === 'questions'"
        :current-screen="currentScreen"
      />
    </div>
  </div>
</template>

<script>
import AppNavbar from './components/Navbar.vue'
import MiProgreso from './components/MiProgreso.vue'
import pant_bienvenida from './components/pant_bienvenida.vue'
import pant_reglas_game1 from './components/pant_reglas_game1.vue'
import pant_game_1 from './components/pant_game_1.vue'
import pant_game_2 from './components/pant_game_2.vue'
import pant_game_3 from './components/pant_game_3.vue'
import pant_reglas_game2 from './components/pant_reglas_game2.vue'
import pant_reglas_game4 from './components/pant_reglas_game4.vue'
import pant_game_4 from './components/pant_game_4.vue'
import mascota from './components/mascota.vue'
import pant_login from './components/pant_login.vue'
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

export default {
  name: 'App',
  components: {
    AppNavbar,
    MiProgreso,
    pant_bienvenida,
    pant_reglas_game1,
    pant_game_1,
    pant_game_2,
    pant_game_3,
    pant_reglas_game2,
    pant_reglas_game4,
    pant_game_4,
    mascota,
    pant_login
  },
  data() {
    return {
      currentScreen: 'cargando', // 'cargando' → 'login' o directo al menú si hay sesión (CU-03)
      playerName: '', // Ahora viene del perfil de Google, ya no se escribe a mano
      currentTextId: 'text1', // ID del texto actual en juego 1
      currentGame2TextId: 'drag1', // ID del texto actual en juego 2
      currentGame3TextId: 'comp1', // ID del texto actual en juego 3
      completedTexts: [], // IDs de textos completados
      showProgreso: false,
      userProgress: null, // Progreso cargado desde localStorage
      isReturningUser: false, // Flag para usuarios que regresan
      // --- Cuentas y acceso (CU-01 a CU-04) ---
      supabaseConfigurado,
      usuario: null, // usuario de Supabase Auth (null = sin sesión)
      perfil: null, // fila de la tabla profiles (incluye rol)
      cargandoLogin: false,
      errorLogin: '',
      dejarDeEscucharSesion: null
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
      return getNextText(this.currentTextId) !== null
    }
  },
  mounted() {
    this.iniciarAutenticacion()
  },
  beforeUnmount() {
    if (this.dejarDeEscucharSesion) this.dejarDeEscucharSesion()
  },
  methods: {
    // ============================================
    // CUENTAS Y ACCESO (CU-02, CU-03, CU-04)
    // ============================================
    async iniciarAutenticacion() {
      if (!this.supabaseConfigurado) {
        this.currentScreen = 'login' // la pantalla de login explica qué falta
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
        else if (!this.usuario) this.currentScreen = 'login'
      } catch (error) {
        console.error('No se pudo revisar la sesión:', error)
        this.currentScreen = 'login'
      }
    },
    async entrar() {
      this.errorLogin = ''
      this.cargandoLogin = true
      try {
        await entrarConGoogle() // el navegador se va a Google y vuelve
      } catch (error) {
        console.error('Error al entrar con Google:', error)
        this.errorLogin = 'No se pudo abrir el inicio de sesión con Google. Intenta de nuevo.'
        this.cargandoLogin = false
      }
    },
    async entrarConSesion(sesion) {
      // Supabase puede avisar SIGNED_IN más de una vez (al volver a la pestaña,
      // o junto con la sesión guardada): si ya entró este usuario, no hacer nada.
      // Sin esto, un alumno a mitad de juego volvería al menú.
      if (this.usuario && this.usuario.id === sesion.user.id) return
      this.usuario = sesion.user
      this.perfil = await cargarPerfil(sesion.user.id)
      // El nombre ya no se escribe: sale del perfil / cuenta de Google.
      // Se sigue usando como llave del progreso en localStorage (PR-01/PR-02 lo llevan a la nube).
      this.playerName = nombreVisible(this.perfil, sesion.user)
      try {
        localStorage.setItem('leo-perfecto-player', this.playerName) // los juegos lo leen como respaldo
      } catch (error) {
        console.warn('No se pudo guardar el nombre en localStorage:', error)
      }
      this.cargandoLogin = false
      this.currentScreen = 'welcome'
      this.goToWelcome() // mismo camino que antes tras "Comenzar": carga progreso y abre el menú
    },
    async salir() {
      try {
        await cerrarSesion()
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
      this.volverAlLogin() // no esperar al aviso de Supabase para cambiar de pantalla
    },
    volverAlLogin() {
      this.usuario = null
      this.perfil = null
      this.playerName = ''
      this.userProgress = null
      this.completedTexts = []
      this.isReturningUser = false
      this.showProgreso = false
      this.cargandoLogin = false
      this.currentScreen = 'login'
    },
    irAlPanelDocente() {
      if (!this.esDocente) return
      this.showProgreso = false
      this.currentScreen = 'panelDocente'
    },
    loadUserProgress(playerName) {
      // Cargar progreso del usuario desde localStorage
      const progressKey = `leo-perfecto-progress-${playerName}`
      const savedProgress = localStorage.getItem(progressKey)
      
      if (savedProgress) {
        try {
          this.userProgress = JSON.parse(savedProgress)
          this.completedTexts = this.userProgress.map(p => p.textId)
          this.isReturningUser = true
          
          // Determinar el siguiente texto disponible
          const nextTextId = this.getNextAvailableText()
          if (nextTextId) {
            this.currentTextId = nextTextId
          }
          
          return true // Usuario con progreso encontrado
        } catch (error) {
          console.error('Error loading user progress:', error)
          this.userProgress = null
          this.completedTexts = []
          this.isReturningUser = false
        }
      }
      
      return false // Usuario nuevo o sin progreso
    },
    getNextAvailableText() {
      // Buscar el primer texto no completado
      const allTexts = this.availableTextIds
      const nextText = allTexts.find(textId => !this.completedTexts.includes(textId))
      return nextText || 'text1' // Si todos están completados, volver al primero
    },
    goToWelcome() {
      if (this.playerName.trim()) {
        // Cargar progreso del usuario
        const hasProgress = this.loadUserProgress(this.playerName.trim())
        
        if (hasProgress && this.userProgress.length > 0) {
          this.isReturningUser = true
        } else {
          this.isReturningUser = false
        }
        
        // Ir directamente a MiProgreso en lugar de pant_bienvenida
        this.goToProgreso()
      }
    },
    showReturningUserWelcome() {
      // Cambiar a pantalla de bienvenida con información del progreso
      this.currentScreen = 'welcome'
    },
    goToInstructions() {
      this.currentScreen = 'instructions'
      // No resetear currentTextId aquí - ya está configurado correctamente por loadUserProgress
    },
    startGame() {
      this.currentScreen = 'questions'
    },
    goToQuestions() {
      this.currentScreen = 'questions'
    },
    handleGame1Continue() {
      // Marcar texto como completado
      if (!this.completedTexts.includes(this.currentTextId)) {
        this.completedTexts.push(this.currentTextId)
      }

      // Regresar a MiProgreso después de completar un texto
      this.goToProgreso()
    },
    goToDragDropRules() {
      this.currentScreen = 'dragdropRules'
    },
    goToDragDrop() {
      this.currentScreen = 'dragdrop'
    },
    handleTryNextText(nextTextId) {
      // Cambiar al siguiente texto disponible
      this.currentTextId = nextTextId
      this.goToInstructions()
    },
    restartGame() {
      this.currentScreen = 'login'
      this.playerName = ''
      this.currentTextId = 'text1'
      this.completedTexts = []
    },
    goToProgreso() {
      this.showProgreso = true;
      // Refrescar los datos del progreso después de que el componente se muestre
      this.$nextTick(() => {
        if (this.$refs.miProgresoComponent) {
          this.$refs.miProgresoComponent.loadPlayerData();
        }
      });
    },
    closeProgreso() {
      this.showProgreso = false;
    },
    handleStartGame1(gameInfo) {
      // Cerrar el progreso y establecer el texto
      this.showProgreso = false;
      this.currentTextId = gameInfo.textId;
      this.currentScreen = 'instructions'; // Ir a las reglas del juego 1
    },
    handleStartGame2(gameInfo) {
      // Cerrar el progreso y ir al juego 2
      this.showProgreso = false;
      
      // Si se especifica un textId, usarlo; si no, obtener el siguiente no completado
      if (gameInfo && gameInfo.textId) {
        this.currentGame2TextId = gameInfo.textId;
      } else {
        // Obtener el primer texto no completado del juego 2
        this.currentGame2TextId = this.getNextGame2Text();
      }
      
      this.currentScreen = 'dragdropRules'; // Ir a las reglas del juego 2
    },
    getNextGame2Text() {
      // Obtener progreso del jugador para juego 2
      const playerName = this.playerName || localStorage.getItem('leo-perfecto-player') || 'anonimo';
      const progressKey = `leo-perfecto-progress-${playerName}`;
      const savedProgress = localStorage.getItem(progressKey);
      
      // IDs disponibles del juego 2
      const availableGame2Texts = ['drag1', 'drag2', 'drag3'];
      
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          // Filtrar solo progreso del juego 2
          const game2Progress = progress.filter(p => p.gameId === 2);
          const completedTexts = game2Progress.map(p => p.textId);
          
          // Buscar el primer texto no completado
          const nextText = availableGame2Texts.find(textId => !completedTexts.includes(textId));
          return nextText || 'drag1'; // Si todos están completados, volver al primero
        } catch (error) {
          console.error('Error al obtener progreso:', error);
        }
      }
      
      return 'drag1'; // Por defecto, el primer texto
    },
    handleTryNextGame2Text(nextTextId) {
      // Cambiar al siguiente texto y volver a las reglas
      this.currentGame2TextId = nextTextId;
      this.goToDragDropRules();
    },
    handleStartGame3(gameInfo) {
      // Cerrar el progreso y ir al juego 3
      this.showProgreso = false;
      
      // El juego 3 maneja su propia selección de textos internamente
      // pero podemos establecer un textId inicial si se proporciona
      if (gameInfo && gameInfo.textId) {
        this.currentGame3TextId = gameInfo.textId;
      }
      
      this.currentScreen = 'game3'; // Ir directamente al juego 3 (sin pantalla de reglas)
    },
    
    // eslint-disable-next-line no-unused-vars
    handleStartGame4(gameInfo) {
      // Cerrar el progreso y ir al juego 4 (Trivia)
      this.showProgreso = false;
      this.currentScreen = 'instructions_game4'; // Ir a las reglas del juego 4
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
