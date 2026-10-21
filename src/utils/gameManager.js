/**
 * ============================================
 * GAME MANAGER - Sistema Inteligente de Juegos
 * ============================================
 * 
 * Este módulo gestiona la lógica de selección de juegos,
 * actualización de métricas y progreso del jugador.
 */

import { getTextById } from '../data/game1_texts'
import { guardarSesionDeJuego } from './supabaseProgress'

/**
 * Configuración de juegos disponibles por unidad
 * IMPORTANTE: Mantener sincronizado con los textos disponibles
 */
export const UNIDADES_CONFIG = {
  1: {
    nombre: 'Fundamentos Básicos',
    descripcion: 'Identifica palabras clave, clasifica términos y domina conceptos fundamentales',
    juegos: [
      // === JUEGO 1: Palabras Clave (12 textos) ===
      { gameId: 1, textId: 'text1', nombre: 'Palabras Clave - Harry Potter', tipo: 'keywords' },
      { gameId: 1, textId: 'text2', nombre: 'Palabras Clave - Frodo', tipo: 'keywords' },
      { gameId: 1, textId: 'text3', nombre: 'Palabras Clave - Neo (Matrix)', tipo: 'keywords' },
      { gameId: 1, textId: 'text4', nombre: 'Palabras Clave - Seinfeld', tipo: 'keywords' },
      { gameId: 1, textId: 'text5', nombre: 'Palabras Clave - Andy (Cadena Perpetua)', tipo: 'keywords' },
      { gameId: 1, textId: 'text6', nombre: 'Palabras Clave - Los Vengadores', tipo: 'keywords' },
      { gameId: 1, textId: 'text7', nombre: 'Palabras Clave - Gatsby', tipo: 'keywords' },
      { gameId: 1, textId: 'text8', nombre: 'Palabras Clave - Batman', tipo: 'keywords' },
      { gameId: 1, textId: 'text9', nombre: 'Palabras Clave - Star Trek', tipo: 'keywords' },
      { gameId: 1, textId: 'text10', nombre: 'Palabras Clave - El Hobbit', tipo: 'keywords' },
      { gameId: 1, textId: 'text11', nombre: 'Palabras Clave - Lost', tipo: 'keywords' },
      { gameId: 1, textId: 'text12', nombre: 'Palabras Clave - La Casa de Papel', tipo: 'keywords' },
      
      // === JUEGO 2: Clasificar Palabras (10 textos) ===
      { gameId: 2, textId: 'drag1', nombre: 'Clasificar - Harry Potter', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag2', nombre: 'Clasificar - El Señor de los Anillos', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag3', nombre: 'Clasificar - Juego de Tronos', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag4', nombre: 'Clasificar - Los Simpson', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag5', nombre: 'Clasificar - Star Wars', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag6', nombre: 'Clasificar - The Matrix', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag7', nombre: 'Clasificar - Titanic', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag8', nombre: 'Clasificar - Friends', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag9', nombre: 'Clasificar - Breaking Bad', tipo: 'dragdrop' },
      { gameId: 2, textId: 'drag10', nombre: 'Clasificar - The Mandalorian', tipo: 'dragdrop' },
      
      // === JUEGO 4: Trivia de Fundamentos (20 preguntas) ===
      { gameId: 4, textId: 'trivia1', nombre: 'Trivia - Fundamentos de Comprensión Lectora', tipo: 'trivia' }
    ]
  },
  2: {
    nombre: 'Comprensión Lectora',
    descripcion: 'Comprensión, inferencia y análisis de textos',
    juegos: [
      // === JUEGO 3: Comprensión Rápida (30 textos) ===
      { gameId: 3, textId: 'comp1', nombre: 'Comprensión - El Androide 759', tipo: 'comprension' },
      { gameId: 3, textId: 'comp2', nombre: 'Comprensión - El Anillo Único', tipo: 'comprension' },
      { gameId: 3, textId: 'comp3', nombre: 'Comprensión - El Hechicero', tipo: 'comprension' },
      { gameId: 3, textId: 'comp4', nombre: 'Comprensión - El Titán', tipo: 'comprension' },
      { gameId: 3, textId: 'comp5', nombre: 'Comprensión - La Alianza Rebelde', tipo: 'comprension' },
      { gameId: 3, textId: 'comp6', nombre: 'Comprensión - El Detective', tipo: 'comprension' },
      { gameId: 3, textId: 'comp7', nombre: 'Comprensión - El Portal Dimensional', tipo: 'comprension' },
      { gameId: 3, textId: 'comp8', nombre: 'Comprensión - La Chica Telequinética', tipo: 'comprension' },
      { gameId: 3, textId: 'comp9', nombre: 'Comprensión - El Arqueólogo', tipo: 'comprension' },
      { gameId: 3, textId: 'comp10', nombre: 'Comprensión - El Maestro de Artes Marciales', tipo: 'comprension' },
      { gameId: 3, textId: 'comp11', nombre: 'Comprensión - La Espada Legendaria', tipo: 'comprension' },
      { gameId: 3, textId: 'comp12', nombre: 'Comprensión - El Viajero del Tiempo', tipo: 'comprension' },
      { gameId: 3, textId: 'comp13', nombre: 'Comprensión - La Profecía Antigua', tipo: 'comprension' },
      { gameId: 3, textId: 'comp14', nombre: 'Comprensión - El Último Dragón', tipo: 'comprension' },
      { gameId: 3, textId: 'comp15', nombre: 'Comprensión - La Biblioteca Prohibida', tipo: 'comprension' },
      { gameId: 3, textId: 'comp16', nombre: 'Comprensión - El Guardián del Bosque', tipo: 'comprension' },
      { gameId: 3, textId: 'comp17', nombre: 'Comprensión - La Ciudad Sumergida', tipo: 'comprension' },
      { gameId: 3, textId: 'comp18', nombre: 'Comprensión - El Experimento Secreto', tipo: 'comprension' },
      { gameId: 3, textId: 'comp19', nombre: 'Comprensión - La Reina del Hielo', tipo: 'comprension' },
      { gameId: 3, textId: 'comp20', nombre: 'Comprensión - El Código Encriptado', tipo: 'comprension' },
      { gameId: 3, textId: 'comp21', nombre: 'Comprensión - La Nave Espacial', tipo: 'comprension' },
      { gameId: 3, textId: 'comp22', nombre: 'Comprensión - El Samurái Errante', tipo: 'comprension' },
      { gameId: 3, textId: 'comp23', nombre: 'Comprensión - La Máquina del Destino', tipo: 'comprension' },
      { gameId: 3, textId: 'comp24', nombre: 'Comprensión - El Pacto de Sangre', tipo: 'comprension' },
      { gameId: 3, textId: 'comp25', nombre: 'Comprensión - La Isla Misteriosa', tipo: 'comprension' },
      { gameId: 3, textId: 'comp26', nombre: 'Comprensión - El Último Sobreviviente', tipo: 'comprension' },
      { gameId: 3, textId: 'comp27', nombre: 'Comprensión - La Puerta Dimensional', tipo: 'comprension' },
      { gameId: 3, textId: 'comp28', nombre: 'Comprensión - El Cazador de Sombras', tipo: 'comprension' },
      { gameId: 3, textId: 'comp29', nombre: 'Comprensión - La Revolución Digital', tipo: 'comprension' },
      { gameId: 3, textId: 'comp30', nombre: 'Comprensión - El Fin del Mundo', tipo: 'comprension' }
    ]
  },
  3: {
    nombre: 'Análisis Avanzado',
    descripcion: 'Estrategias avanzadas y reflexión (Próximamente)',
    juegos: []
  }
}

/**
 * ============================================
 * CLASE: GameManager
 * ============================================
 * Gestiona todo el sistema de juegos y progreso
 */
export class GameManager {
  constructor(playerName) {
    this.playerName = playerName || 'anonimo'
    this.progressKey = `leo-perfecto-progress-${this.playerName}`
  }

  /**
   * Carga el progreso del jugador desde localStorage
   * @returns {Array} Array de progreso o array vacío
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.progressKey)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('❌ Error al cargar progreso:', error)
      return []
    }
  }

  /**
   * Guarda el progreso del jugador
   * @param {Array} progressArray - Array de progreso
   */
  saveProgress(progressArray) {
    try {
      localStorage.setItem(this.progressKey, JSON.stringify(progressArray))
      return true
    } catch (error) {
      console.error('❌ Error al guardar progreso:', error)
      return false
    }
  }

  /**
   * Obtiene todos los juegos de una unidad
   * @param {number} unidadId - ID de la unidad
   * @returns {Array} Array de juegos
   */
  getJuegosUnidad(unidadId) {
    try {
      const unidad = UNIDADES_CONFIG[unidadId]
      return unidad ? [...unidad.juegos] : []
    } catch (error) {
      console.error('❌ Error al obtener juegos de unidad:', error)
      return []
    }
  }

  /**
   * Obtiene juegos NO jugados O con menos del 100% de una unidad
   * Un juego es "disponible" si:
   * 1. Nunca se ha jugado
   * 2. Se jugó pero no obtuvo 100% (puede mejorar)
   * @param {number} unidadId - ID de la unidad
   * @returns {Array} Array de juegos disponibles
   */
  getJuegosDisponibles(unidadId) {
    try {
      const todosJuegos = this.getJuegosUnidad(unidadId)
      const progreso = this.loadProgress()

      return todosJuegos.filter(juego => {
        // Buscar el mejor intento para este juego
        const intentos = progreso.filter(p => 
          p.textId === juego.textId && p.gameId === juego.gameId
        )
        
        // Si nunca se ha jugado, está disponible
        if (intentos.length === 0) return true
        
        // Si se jugó pero no obtuvo 100%, está disponible para mejorar
        const mejorIntento = intentos.reduce((mejor, actual) => 
          (actual.score > mejor.score) ? actual : mejor
        )
        
        return mejorIntento.score < 100
      })
    } catch (error) {
      console.error('❌ Error al filtrar juegos disponibles:', error)
      return []
    }
  }

  /**
   * Obtiene juegos completados al 100% de una unidad
   * @param {number} unidadId - ID de la unidad
   * @returns {Array} Array de juegos con 100%
   */
  getJuegosPerfectos(unidadId) {
    try {
      const todosJuegos = this.getJuegosUnidad(unidadId)
      const progreso = this.loadProgress()

      return todosJuegos
        .map(juego => {
          const intentos = progreso.filter(p => 
            p.textId === juego.textId && p.gameId === juego.gameId
          )
          
          if (intentos.length === 0) return null

          const mejorIntento = intentos.reduce((mejor, actual) => 
            (actual.score > mejor.score) ? actual : mejor
          )
          
          // Solo devolver si tiene 100%
          if (mejorIntento.score === 100) {
            return {
              ...juego,
              mejorPuntaje: mejorIntento.score,
              intentos: intentos.length,
              ultimoIntento: mejorIntento.date
            }
          }
          
          return null
        })
        .filter(j => j !== null)
    } catch (error) {
      console.error('❌ Error al obtener juegos perfectos:', error)
      return []
    }
  }

  /**
   * Selecciona el mejor juego para mostrar al jugador
   * UNIDAD 1: Alterna obligatoriamente entre Juego 1 y Juego 2
   * OTRAS UNIDADES: Prioridad a juegos no jugados o con menos del 100%
   * @param {number} unidadId - ID de la unidad
   * @returns {Object|null} Juego seleccionado o null
   */
  seleccionarJuegoInteligente(unidadId) {
    // LÓGICA ESPECIAL PARA UNIDAD 1: Alternar entre Juego 1 y Juego 2
    if (unidadId === 1) {
      return this.seleccionarJuegoAlternado()
    }
    
    // LÓGICA NORMAL para otras unidades
    try {
      // 1. Verificar si hay juegos disponibles (no jugados o <100%)
      const disponibles = this.getJuegosDisponibles(unidadId)
      
      if (disponibles.length > 0) {
        // Seleccionar aleatoriamente entre los disponibles
        const indice = Math.floor(Math.random() * disponibles.length)
        const juegoSeleccionado = disponibles[indice]
        
        // Obtener el mejor puntaje previo si existe
        const progreso = this.loadProgress()
        const intentosPrevios = progreso.filter(p => 
          p.textId === juegoSeleccionado.textId && p.gameId === juegoSeleccionado.gameId
        )
        
        const mejorPrevio = intentosPrevios.length > 0 
          ? Math.max(...intentosPrevios.map(i => i.score))
          : 0
        
        return {
          ...juegoSeleccionado,
          esRepeticion: intentosPrevios.length > 0,
          mejorPrevio: mejorPrevio,
          mensaje: intentosPrevios.length > 0 
            ? `🔄 ¡Mejora tu puntaje! Tu mejor: ${mejorPrevio}%`
            : '🎮 ¡Nuevo desafío!'
        }
      }

      // 2. Si todos están al 100%, permitir repetir
      const perfectos = this.getJuegosPerfectos(unidadId)
      
      if (perfectos.length > 0) {
        // Seleccionar aleatoriamente para repetir
        const indice = Math.floor(Math.random() * perfectos.length)
        return {
          ...perfectos[indice],
          esRepeticion: true,
          mejorPrevio: 100,
          mensaje: `✨ ¡Ya tienes 100%! ¿Quieres repetir?`
        }
      }

      // 3. No hay juegos disponibles
      return null
    } catch (error) {
      console.error('❌ Error al seleccionar juego:', error)
      return null
    }
  }

  /**
   * Registra un intento de juego y actualiza métricas
   * @param {Object} intentoData - Datos del intento
   * @returns {Object} Resultado con métricas actualizadas
   */
  saveGameResult(gameData) {
    return this.registrarIntento({
      textId: gameData.textId || 'trivia1',
      gameId: gameData.gameId,
      correctAnswers: gameData.correctAnswers,
      totalQuestions: gameData.totalQuestions,
      score: gameData.score,
      timeSpent: gameData.timeSpent,
      errores: gameData.errores || []
    })
  }

  registrarIntento(intentoData) {
    try {
      const {
        textId,
        gameId,
        correctAnswers,
        totalQuestions,
        score,
        timeSpent = null,
        errores = [] // Array de errores específicos
      } = intentoData

      const progreso = this.loadProgress()
      
      // Crear objeto de intento
      const nuevoIntento = {
        player: this.playerName,
        textId,
        gameId,
        textTitle: this.getGameTitle(textId),
        correctAnswers,
        totalQuestions,
        score,
        timeSpent,
        errores: errores, // Guardar errores específicos
        completed: true,
        date: new Date().toISOString()
      }

      // Buscar intentos previos
      const intentosPrevios = progreso.filter(p => 
        p.textId === textId && p.gameId === gameId
      )
      const mejorPrevio = intentosPrevios.length > 0 
        ? Math.max(...intentosPrevios.map(p => p.score))
        : 0

      // Determinar si mejoró
      const mejoro = score > mejorPrevio
      const empeoro = intentosPrevios.length > 0 && score < mejorPrevio

      // Agregar nuevo intento
      progreso.push(nuevoIntento)

      // Guardar
      this.saveProgress(progreso)

      // Keep local progress available immediately while persisting the same
      // completed attempt for the authenticated student's account.
      void guardarSesionDeJuego(nuevoIntento).catch(error => {
        console.error('❌ No se pudo guardar el progreso en Supabase:', error)
      })

      // Retornar resultado
      return {
        success: true,
        mejoro,
        empeoro,
        mejorPrevio,
        nuevoScore: score,
        diferencia: score - mejorPrevio,
        esPerfecto: score === 100,
        mensaje: this.generarMensajeResultado(score, mejoro, empeoro, mejorPrevio)
      }
    } catch (error) {
      console.error('❌ Error al registrar intento:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Genera mensaje motivacional según resultado
   */
  generarMensajeResultado(score, mejoro, empeoro, mejorPrevio) {
    if (score === 100) {
      return '🎉 ¡PERFECTO! ¡Dominaste completamente este juego!'
    }
    
    if (mejoro) {
      const diferencia = score - mejorPrevio
      return `🚀 ¡MEJORASTE! +${diferencia}% de tu mejor puntaje anterior (${mejorPrevio}%)`
    }
    
    if (empeoro) {
      return `📚 Puedes mejorar. Tu mejor puntaje sigue siendo ${mejorPrevio}%. ¡Sigue practicando!`
    }
    
    if (score >= 80) {
      return '😊 ¡Muy bien! Excelente desempeño.'
    }
    
    if (score >= 60) {
      return '👍 Buen trabajo. Con práctica mejorarás aún más.'
    }
    
    return '💪 ¡Sigue intentando! La práctica hace al maestro.'
  }

  /**
   * Obtiene el título de un juego por textId
   */
  getGameTitle(textId) {
    try {
      // Intentar obtener de game1_texts
      const texto = getTextById(textId)
      if (texto) return texto.title

      // Si es drag and drop
      if (textId === 'drag1') return 'Clasificar Palabras'

      return 'Juego sin título'
    } catch (error) {
      return 'Juego sin título'
    }
  }

  /**
   * NUEVO: Selecciona juego alternando entre Juego 1 y Juego 2
   * Lee el localStorage para saber cuál fue el último jugado
   * @returns {Object|null} Juego seleccionado
   */
  seleccionarJuegoAlternado() {
    try {
      const progreso = this.loadProgress()
      const ultimoJuegoKey = `${this.progressKey}-ultimo-juego`
      
      // Obtener el último juego jugado (1 o 2)
      const ultimoGameId = localStorage.getItem(ultimoJuegoKey)
      
      // Determinar qué juego toca ahora (alternar)
      let gameIdAJugar
      if (ultimoGameId === '1') {
        gameIdAJugar = 2 // Si el último fue 1, ahora toca 2
      } else if (ultimoGameId === '2') {
        gameIdAJugar = 1 // Si el último fue 2, ahora toca 1
      } else {
        // Primera vez o no hay registro: empezar con Juego 1
        gameIdAJugar = 1
      }
      
      // Guardar el juego que se va a jugar para la próxima vez
      localStorage.setItem(ultimoJuegoKey, gameIdAJugar.toString())
      
      // Obtener todos los juegos de ese tipo
      const todosJuegos = this.getJuegosUnidad(1)
      const juegosDelTipo = todosJuegos.filter(j => j.gameId === gameIdAJugar)
      
      if (juegosDelTipo.length === 0) return null
      
      // Filtrar los disponibles (no jugados o < 100%)
      const disponibles = juegosDelTipo.filter(juego => {
        const intentos = progreso.filter(p => 
          p.textId === juego.textId && p.gameId === juego.gameId
        )
        
        if (intentos.length === 0) return true
        
        const mejorIntento = intentos.reduce((mejor, actual) => 
          (actual.score > mejor.score) ? actual : mejor
        )
        
        return mejorIntento.score < 100
      })
      
      // Si hay disponibles, seleccionar uno aleatorio
      if (disponibles.length > 0) {
        const indice = Math.floor(Math.random() * disponibles.length)
        const juegoSeleccionado = disponibles[indice]
        
        const intentosPrevios = progreso.filter(p => 
          p.textId === juegoSeleccionado.textId && p.gameId === juegoSeleccionado.gameId
        )
        
        const mejorPrevio = intentosPrevios.length > 0 
          ? Math.max(...intentosPrevios.map(i => i.score))
          : 0
        
        return {
          ...juegoSeleccionado,
          esRepeticion: intentosPrevios.length > 0,
          mejorPrevio: mejorPrevio,
          mensaje: intentosPrevios.length > 0 
            ? `🔄 ¡Mejora tu puntaje! Tu mejor: ${mejorPrevio}%`
            : `🎮 Turno del Juego ${gameIdAJugar}`
        }
      }
      
      // Si todos están al 100%, permitir repetir cualquiera
      const indice = Math.floor(Math.random() * juegosDelTipo.length)
      return {
        ...juegosDelTipo[indice],
        esRepeticion: true,
        mejorPrevio: 100,
        mensaje: `✨ ¡Ya tienes 100% en Juego ${gameIdAJugar}! ¿Quieres repetir?`
      }
    } catch (error) {
      console.error('❌ Error al seleccionar juego alternado:', error)
      return null
    }
  }

  /**
   * Calcula el progreso de una unidad en porcentaje
   * UNIDAD 2 (Juego 3): Progreso basado en CADA ejercicio individual (30 textos)
   * OTRAS UNIDADES: Considera juegos con al menos 60% como "completados"
   * @param {number} unidadId - ID de la unidad
   * @returns {number} Porcentaje de progreso (0-100)
   */
  calcularProgresoUnidad(unidadId) {
    try {
      const todosJuegos = this.getJuegosUnidad(unidadId)
      if (todosJuegos.length === 0) return 0

      const progreso = this.loadProgress()
      
      // LÓGICA ESPECIAL PARA UNIDAD 2 (Juego 3): Contar CADA ejercicio individualmente
      if (unidadId === 2) {
        // Contar cuántos de los 30 textos han sido completados (al menos 1 intento)
        let textosCompletados = 0
        
        todosJuegos.forEach(juego => {
          const intentos = progreso.filter(p => 
            p.textId === juego.textId && p.gameId === juego.gameId
          )
          
          // Si hay al menos UN intento, cuenta como completado
          if (intentos.length > 0) {
            textosCompletados++
          }
        })
        
        // Progreso = (textos completados / 30) * 100
        return Math.round((textosCompletados / todosJuegos.length) * 100)
      }
      
      // LÓGICA NORMAL para Unidad 1 y otras: considerar 60%+ como completado
      let juegosCompletados = 0
      
      todosJuegos.forEach(juego => {
        const intentos = progreso.filter(p => 
          p.textId === juego.textId && p.gameId === juego.gameId
        )
        
        // Si hay al menos un intento con 60%+, cuenta como completado
        const tieneIntentoBueno = intentos.some(i => i.score >= 60)
        if (tieneIntentoBueno) {
          juegosCompletados++
        }
      })
      
      return Math.round((juegosCompletados / todosJuegos.length) * 100)
    } catch (error) {
      console.error('❌ Error al calcular progreso:', error)
      return 0
    }
  }

  /**
   * Obtiene estadísticas generales del jugador
   * @returns {Object} Estadísticas completas y precisas
   */
  getEstadisticas() {
    try {
      const progreso = this.loadProgress()
      
      // Valores por defecto si no hay progreso
      if (!progreso || progreso.length === 0) {
        return {
          totalJuegos: 0,
          juegosCompletados: 0,
          juegosPerfectos: 0,
          promedioGeneral: 0,
          mejorPuntaje: 0,
          totalIntentos: 0,
          efectividad: 0
        }
      }

      // Obtener juegos únicos jugados (combinación de textId + gameId)
      const juegosUnicos = new Set()
      const juegosPerfectos = new Set()
      
      progreso.forEach(p => {
        // Validar que tenga los campos necesarios
        if (p && p.gameId && p.textId && typeof p.score === 'number') {
          const key = `${p.gameId}-${p.textId}`
          juegosUnicos.add(key)
          
          // Contar perfectos (100%)
          if (p.score === 100) {
            juegosPerfectos.add(key)
          }
        }
      })
      
      // Si no hay juegos válidos después del filtrado
      if (juegosUnicos.size === 0) {
        return {
          totalJuegos: 0,
          juegosCompletados: 0,
          juegosPerfectos: 0,
          promedioGeneral: 0,
          mejorPuntaje: 0,
          totalIntentos: progreso.length,
          efectividad: 0
        }
      }
      
      // Calcular promedio usando el MEJOR intento de cada juego único
      const mejoresPuntajes = []
      juegosUnicos.forEach(key => {
        const [gameId, textId] = key.split('-')
        const intentosJuego = progreso.filter(p => 
          p.gameId === parseInt(gameId) && p.textId === textId && typeof p.score === 'number'
        )
        
        if (intentosJuego.length > 0) {
          const puntajes = intentosJuego.map(i => i.score).filter(s => Number.isFinite(s))
          if (puntajes.length > 0) {
            const mejorPuntaje = Math.max(...puntajes)
            mejoresPuntajes.push(mejorPuntaje)
          }
        }
      })
      
      // Calcular promedio solo si hay puntajes válidos
      const promedioGeneral = mejoresPuntajes.length > 0
        ? mejoresPuntajes.reduce((sum, score) => sum + score, 0) / mejoresPuntajes.length
        : 0

      // Mejor puntaje global (con validación segura)
      const todosLosPuntajes = progreso
        .map(p => p.score)
        .filter(s => typeof s === 'number' && Number.isFinite(s))
      
      const mejorPuntaje = todosLosPuntajes.length > 0 
        ? Math.max(...todosLosPuntajes)
        : 0

      // Asegurar que todos los valores son finitos
      const stats = {
        totalJuegos: juegosUnicos.size || 0,
        juegosCompletados: juegosUnicos.size || 0,
        juegosPerfectos: juegosPerfectos.size || 0,
        promedioGeneral: Number.isFinite(promedioGeneral) ? Math.round(promedioGeneral) : 0,
        mejorPuntaje: Number.isFinite(mejorPuntaje) ? mejorPuntaje : 0,
        totalIntentos: progreso.length || 0,
        efectividad: Number.isFinite(promedioGeneral) ? Math.round(promedioGeneral) : 0
      }

      return stats
    } catch (error) {
      console.error('❌ Error al calcular estadísticas:', error)
      return {
        totalJuegos: 0,
        juegosCompletados: 0,
        juegosPerfectos: 0,
        promedioGeneral: 0,
        mejorPuntaje: 0,
        totalIntentos: 0,
        efectividad: 0
      }
    }
  }
}

/**
 * ============================================
 * FUNCIONES DE UTILIDAD
 * ============================================
 */

/**
 * Crea una instancia de GameManager para un jugador
 * @param {string} playerName - Nombre del jugador
 * @returns {GameManager} Instancia del gestor
 */
export function createGameManager(playerName) {
  return new GameManager(playerName)
}

/**
 * Valida que los datos del juego sean correctos
 * @param {Object} gameData - Datos del juego
 * @returns {boolean} true si es válido
 */
export function validateGameData(gameData) {
  try {
    const required = ['textId', 'gameId', 'correctAnswers', 'totalQuestions', 'score']
    return required.every(field => Object.prototype.hasOwnProperty.call(gameData, field))
  } catch (error) {
    return false
  }
}
