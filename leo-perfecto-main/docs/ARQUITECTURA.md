# 🏗️ Arquitectura de Leo Perfecto

## 📋 Información General

- **Nombre:** Leo Perfecto
- **Versión:** 1.2.0
- **Framework:** Vue.js 3.2.13
- **Tipo:** SPA (Single Page Application) educativa
- **Estado:** En producción (frontend) - Backend pendiente

---

## 🎯 Visión General

Leo Perfecto es una aplicación educativa que ayuda a estudiantes a mejorar su comprensión lectora mediante **3 juegos progresivos**:

1. **Juego 1:** Identificación de palabras clave (12 textos)
2. **Juego 2:** Clasificación drag & drop (10 ejercicios)
3. **Juego 3:** Comprensión lectora profunda (30 textos)

### Características Principales

- 📊 **Sistema de progreso inteligente** - Selección automática de juegos
- 🤖 **Mascota interactiva** - Feedback contextual y ayuda
- 🎯 **3 Unidades progresivas** - Del básico al avanzado
- 📈 **Dashboard completo** - Métricas, logros, fortalezas/debilidades
- 💾 **Persistencia local** - localStorage (preparado para backend)

---

## 🛠️ Stack Tecnológico

### Frontend Actual

```
Vue.js 3.2.13 (Options API)
├── Tailwind CSS 2.2.17    # Estilos utility-first
├── Mitt 3.0.1             # Event Bus ligero
├── Web Audio API          # Sonidos (sin librerías)
└── localStorage           # Persistencia temporal
```

### Build Tools

```
Vue CLI 5.0.0
├── Webpack 5              # Bundler
├── Babel 7                # Transpilación ES6+
├── PostCSS 7              # Procesador CSS
└── ESLint 7               # Linting
```

### Deploy

```
Netlify
├── CI/CD automático       # Deploy desde GitHub
├── Optimización assets    # Minificación
└── HTTPS automático       # Certificados SSL
```

---

## 📁 Estructura de Archivos Detallada

```
leo-perfecto/
│
├── 📄 Configuración Raíz
│   ├── package.json              # Dependencias y scripts
│   ├── babel.config.js           # Config Babel
│   ├── vue.config.js             # Config Vue CLI
│   ├── tailwind.config.js        # Config Tailwind
│   ├── postcss.config.js         # Config PostCSS
│   ├── jsconfig.json             # Config VS Code
│   ├── netlify.toml              # Config deploy Netlify
│   └── .gitignore                # Archivos ignorados
│
├── 📂 public/                    # Assets estáticos
│   ├── index.html                # HTML base
│   └── favicon.ico               # Favicon
│
├── 📂 src/                       # Código fuente
│   │
│   ├── 📂 assets/                # Recursos (imágenes, estilos)
│   │   ├── main.css              # Estilos globales + Tailwind
│   │   ├── animations.css        # Animaciones personalizadas
│   │   ├── 📂 icons/             # Iconos de Leo (SVG/PNG)
│   │   │   ├── libro-sin-fondo-feliz.png
│   │   │   └── libro-sin-fondo-triste.png
│   │   └── 📂 img/               # Imágenes de contenido
│   │
│   ├── 📂 components/            # Componentes Vue
│   │   │
│   │   ├── 🧭 Navegación y Layout
│   │   │   ├── Navbar.vue        # Barra superior
│   │   │   └── MiProgreso.vue    # Dashboard completo
│   │   │
│   │   ├── 🎮 Pantallas de Juegos
│   │   │   ├── pant_bienvenida.vue      # Pantalla inicial
│   │   │   ├── pant_game_1.vue          # Juego 1: Identificación
│   │   │   ├── pant_game_2.vue          # Juego 2: Clasificación
│   │   │   ├── pant_game_3.vue          # Juego 3: Comprensión
│   │   │   └── pant_instrucciones_game3.vue  # Instrucciones J3
│   │   │
│   │   ├── 📖 Pantallas de Reglas
│   │   │   ├── pant_reglas_game1.vue    # Reglas Juego 1
│   │   │   └── pant_reglas_game2.vue    # Reglas Juego 2
│   │   │
│   │   └── 🤖 Asistente
│   │       └── mascota.vue              # Leo - Mascota interactiva
│   │
│   ├── 📂 data/                  # Datos estáticos (JSON)
│   │   ├── game1_texts.js        # 12 textos literarios
│   │   ├── game2_texts.js        # 10 ejercicios clasificación
│   │   ├── game3_texts.js        # 30 textos comprensión
│   │   └── quest_game_keyword.js # Preguntas Juego 1
│   │
│   ├── 📂 utils/                 # Utilidades
│   │   ├── eventBus.js           # Event Bus (mitt)
│   │   └── gameManager.js        # Gestor inteligente de progreso
│   │
│   ├── App.vue                   # Componente raíz
│   └── main.js                   # Punto de entrada
│
└── 📂 docs/                      # Documentación
    ├── README.md                 # Índice de docs
    ├── ARQUITECTURA.md           # Este archivo
    ├── GUIA_DESARROLLO.md        # Guía para devs
    ├── BACKEND_TODO.md           # Roadmap backend
    ├── DISEÑO_UI.md              # Sistema de diseño
    └── AGREGAR_CONTENIDO.md      # Guía para contenido
```

---

## 🔄 Flujo de Datos

### 1. Inicialización de la Aplicación

```
main.js
  └─> Crea instancia Vue
  └─> Monta App.vue en #app

App.vue (mounted)
  └─> Carga playerName de localStorage
  └─> Inicializa GameManager
  └─> Carga historial de progreso
```

### 2. Flujo de un Juego

```
Usuario en Dashboard (MiProgreso.vue)
  │
  ├─> Click "Jugar Unidad X"
  │     └─> gameManager.seleccionarJuegoInteligente(unidadId)
  │           └─> Retorna: { gameId, textId, esRepeticion, mensaje }
  │
  ├─> Emit 'start-gameX' hacia App.vue
  │     └─> App.vue cambia currentScreen
  │           └─> Renderiza componente del juego
  │
  ├─> Usuario completa juego
  │     └─> Componente emite 'game-completed' con score
  │           └─> gameManager.saveProgress(gameId, textId, score)
  │                 └─> Guarda en localStorage
  │
  └─> Usuario vuelve a Dashboard
        └─> MiProgreso recalcula métricas automáticamente
```

### 3. Sistema de Progreso

```
localStorage: 'leo-perfecto-progress'
  └─> Array de registros:
      [
        {
          date: "2024-11-21T10:30:00.000Z",
          playerName: "Juan",
          gameId: 1,
          textId: "text1",
          score: 85,
          totalQuestions: 5,
          correctAnswers: 4
        },
        // ... más registros
      ]

GameManager.getEstadisticas()
  └─> Procesa el array:
      ├─> juegosCompletados (count de mejores scores)
      ├─> efectividad (promedio ponderado)
      ├─> juegosPerfectos (scores de 100%)
      └─> progresos por juego individual
```

---

## 🧩 Componentes Principales

### App.vue (Componente Raíz)

**Responsabilidad:** Gestión de navegación y estado global

```javascript
data() {
  return {
    currentScreen: 'bienvenida',  // Control de navegación
    playerName: '',               // Nombre del jugador
    showProgreso: false,          // Modal dashboard
    gameManager: null             // Instancia GameManager
  }
}
```

**Métodos clave:**
- `startGame1(textId)` - Inicia Juego 1
- `startGame2()` - Inicia Juego 2
- `startGame3(textId, modo)` - Inicia Juego 3
- `handleGameCompleted(data)` - Guarda progreso al terminar

---

### MiProgreso.vue (Dashboard)

**Responsabilidad:** Mostrar progreso, métricas y logros

**Datos calculados:**
```javascript
computed: {
  nivel() { ... },                    // 1-5 según progreso
  nivelJugador() { ... },             // Texto del nivel
  progresoTotal() { ... },            // % del curso (0-100)
  efectividadSegura() { ... },        // Efectividad validada
  emojiMotivacional() { ... },        // Emoji según rendimiento
  mensajeMotivacional() { ... }       // Mensaje personalizado
}
```

**Métricas mostradas:**
- Juegos completados
- Efectividad general
- Racha de días
- 10 logros desbloqueables
- Fortalezas y debilidades

---

### pant_game_1.vue (Juego 1)

**Responsabilidad:** Quiz de identificación de palabras clave

**Estado:**
```javascript
data() {
  return {
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    questionAnswered: false,
    selectedAnswer: null,
    currentExplanation: '',
    gameCompleted: false
  }
}
```

**Flujo:**
1. Muestra pregunta actual
2. Usuario selecciona respuesta
3. Valida y muestra feedback
4. Emite evento a Event Bus para Leo
5. Avanza a siguiente pregunta
6. Al terminar: muestra resultados y guarda progreso

---

### pant_game_2.vue (Juego 2)

**Responsabilidad:** Drag & drop para clasificar palabras

**Estado:**
```javascript
data() {
  return {
    palabrasPorTipo: { verbos: [], sustantivos: [], conectores: [], adjetivos: [] },
    espaciosTexto: [],
    vidas: 2,
    aciertos: 0,
    errores: 0,
    palabraActual: null,
    pistaUsada: false
  }
}
```

**Características:**
- Sistema de vidas (máximo 2 errores)
- Validación exacta (palabra específica por espacio)
- Pistas disponibles (1 uso por partida)
- Feedback visual inmediato

---

### pant_game_3.vue (Juego 3)

**Responsabilidad:** Comprensión lectora con 5 habilidades

**Estado:**
```javascript
data() {
  return {
    modo: 'practica',      // 'practica' | 'desafio'
    timeLeft: 90,          // Segundos restantes (desafío)
    timerInterval: null,
    respuestaSeleccionada: null,
    preguntaRespondida: false,
    esCorrecta: false,
    explicacion: ''
  }
}
```

**Habilidades evaluadas:**
- Idea Principal
- Causa y Efecto
- Hacer Inferencias
- Detalles Específicos
- Propósito del Autor

---

### mascota.vue (Leo - Asistente)

**Responsabilidad:** Feedback contextual y ayuda

**Estado:**
```javascript
data() {
  return {
    currentMessageIndex: 0,
    isHappy: true,
    showMessage: false,
    feedbackMessage: '',
    helpMessages: [...]
  }
}
```

**Tipos de feedback:**
- Respuesta correcta: Animación feliz + mensaje positivo
- Respuesta incorrecta: Animación triste + mensaje de ánimo
- Ayuda progresiva: 3 niveles de pistas

---

## 📡 Comunicación entre Componentes

### Event Bus (mitt)

**Ubicación:** `src/utils/eventBus.js`

```javascript
import mitt from 'mitt';
export const emitter = mitt();

// Uso:
// Emisor (pant_game_1.vue)
emitter.emit('answer-selected', {
  correct: true,
  explanation: 'Los verbos indican acciones.',
  gameCompleted: false
});

// Receptor (mascota.vue)
mounted() {
  emitter.on('answer-selected', this.handleAnswerFeedback);
}
```

**Eventos disponibles:**
- `answer-selected` - Respuesta seleccionada en Juego 1
- Más eventos según necesidad futura

---

### Props y Emits (Parent-Child)

```vue
<!-- Parent (App.vue) -->
<pant_game_1 
  :player-name="playerName"
  :text-id="currentTextId"
  @game-completed="handleGameCompleted"
  @back-to-progress="showProgreso = true"
/>

<!-- Child (pant_game_1.vue) -->
<script>
export default {
  props: {
    playerName: { type: String, required: true },
    textId: { type: String, required: true }
  },
  methods: {
    finishGame() {
      this.$emit('game-completed', {
        gameId: 1,
        textId: this.textId,
        score: this.score
      });
    }
  }
}
</script>
```

---

## 💾 Sistema de Persistencia

### GameManager (utils/gameManager.js)

**Responsabilidad:** Abstracción para guardar/cargar progreso

```javascript
export class GameManager {
  constructor(playerName) {
    this.playerName = playerName;
    this.storageKey = 'leo-perfecto-progress';
  }

  // Guardar progreso de un juego
  saveProgress(gameId, textId, score, totalQuestions, correctAnswers) {
    const progressArray = this.loadProgress();
    
    // Solo guarda si mejora el score anterior
    const existingIndex = progressArray.findIndex(
      p => p.gameId === gameId && p.textId === textId
    );
    
    if (existingIndex >= 0) {
      if (score > progressArray[existingIndex].score) {
        progressArray[existingIndex] = newRecord;
      }
    } else {
      progressArray.push(newRecord);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(progressArray));
  }

  // Cargar todo el progreso
  loadProgress() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  // Obtener estadísticas calculadas
  getEstadisticas() {
    const progressArray = this.loadProgress();
    
    return {
      juegosCompletados: this.contarJuegosUnicos(progressArray),
      efectividad: this.calcularEfectividad(progressArray),
      juegosPerfectos: this.contarPerfectos(progressArray),
      progresosPorJuego: this.agruparPorJuego(progressArray)
    };
  }

  // Seleccionar juego inteligentemente
  seleccionarJuegoInteligente(unidadId) {
    // Lógica: prioriza juegos no completados
    // Si todos completados, sugiere repetir el de menor score
  }
}
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Tailwind)

```css
/* Colores principales (tonos 400-500) */
blue-400, blue-500, blue-600       /* Primarios */
green-400, green-500               /* Aciertos, positivo */
red-400, red-500                   /* Errores, negativo */
purple-400, purple-500             /* Accentos */
yellow-400, yellow-500             /* Logros, destacados */

/* Neutrales */
gray-100 a gray-900                /* Backgrounds, textos */
white, black                       /* Puros */
```

### Animaciones Personalizadas

**Ubicación:** `src/assets/animations.css`

```css
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 🔐 Seguridad (Consideraciones)

### Actual (Frontend Solo)

✅ **Implementado:**
- Validación básica de inputs
- Sanitización de localStorage
- Sin `v-html` con contenido no confiable

⚠️ **Limitaciones:**
- Sin autenticación
- Datos en localStorage (modificables)
- Sin encriptación

### Futuro (Con Backend)

🔒 **Necesario:**
- JWT para autenticación
- HTTPS obligatorio
- Rate limiting en API
- Validación server-side
- Encriptación de datos sensibles
- CORS configurado correctamente

---

## 📊 Métricas y Análisis

### Métricas Calculadas

```javascript
// En MiProgreso.vue
juegosCompletados: number       // Total de juegos únicos completados
efectividad: number             // % promedio de aciertos (0-100)
rachaActual: number            // Días consecutivos jugando
juegosPerfectos: number        // Juegos con 100% de score
nivel: number                  // Nivel del jugador (1-5)
progresoTotal: number          // % del curso completo (0-100)
```

### Logros Desbloqueables

1. **Primer Paso** - Completa 1 juego
2. **En Camino** - Completa 3 juegos
3. **Persistente** - Completa 5 juegos
4. **Maestro** - Completa 10 juegos
5. **Experto** - 80% de efectividad
6. **Perfección** - 95% de efectividad
7. **Racha de Fuego** - 3 días seguidos
8. **Velocista** - Respuestas rápidas
9. **Sin Errores** - 100% en un juego
10. **Dedicado** - 7 días de racha

---

## 🚀 Performance

### Optimizaciones Implementadas

✅ **Lazy Loading de Imágenes**
```vue
<img :src="imagen" loading="lazy" />
```

✅ **Computed Properties Cacheadas**
```javascript
computed: {
  // Se recalcula solo cuando cambian sus dependencias
  progresoTotal() { ... }
}
```

✅ **Event Cleanup**
```javascript
beforeUnmount() {
  emitter.off('answer-selected', this.handleAnswerFeedback);
}
```

### Áreas de Mejora Futura

🔄 **Code Splitting**
```javascript
// Lazy load de componentes pesados
components: {
  MiProgreso: () => import('@/components/MiProgreso.vue')
}
```

🔄 **Memoization**
```javascript
// Evitar recálculos innecesarios
import { computed, ref } from 'vue';
```

---

## 📦 Build y Deploy

### Build de Producción

```bash
npm run build
```

**Output:** Carpeta `dist/` con:
- HTML minificado
- CSS/JS con hash para cache busting
- Assets optimizados
- Sourcemaps (opcional)

### Deploy en Netlify

**Archivo:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**CI/CD automático:**
1. Push a `main` en GitHub
2. Netlify detecta cambio
3. Build automático
4. Deploy en producción

---

## 🔄 Ciclo de Vida de un Componente

```javascript
// 1. Creación
beforeCreate() { /* instancia creada, data no disponible */ }
created() { /* data disponible, DOM no montado */ }

// 2. Montaje
beforeMount() { /* antes de renderizar */ }
mounted() { 
  // DOM disponible
  // Aquí cargar datos, inicializar listeners
}

// 3. Actualización
beforeUpdate() { /* antes de re-render por cambio de data */ }
updated() { /* después de re-render */ }

// 4. Desmontaje
beforeUnmount() { 
  // Limpieza: remover listeners, cancelar timers
  emitter.off('event', this.handler);
}
unmounted() { /* componente destruido */ }
```

---

## 🧪 Testing (Pendiente)

### Setup Recomendado

```bash
npm install --save-dev @vue/test-utils vitest @vitest/ui
```

### Estructura de Tests

```
tests/
├── unit/
│   ├── components/
│   │   ├── MiProgreso.spec.js
│   │   ├── pant_game_1.spec.js
│   │   └── mascota.spec.js
│   └── utils/
│       └── gameManager.spec.js
└── e2e/
    ├── game1-flow.spec.js
    └── game2-flow.spec.js
```

---

## 📞 Soporte y Contacto

- **Desarrollador Principal:** César Jorquera
- **Email:** ces.jorquera@duocuc.cl
- **Repositorio:** [github.com/cesarJorquera/leo-perfecto](https://github.com/cesarJorquera/leo-perfecto)

---

**Última actualización:** 21 de Noviembre de 2025  
**Versión:** 1.2.0
