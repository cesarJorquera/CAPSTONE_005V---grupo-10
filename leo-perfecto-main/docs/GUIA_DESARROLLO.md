# 💻 Guía de Desarrollo - Leo Perfecto

Esta guía te ayudará a empezar a desarrollar en el proyecto Leo Perfecto, entender su estructura y seguir las mejores prácticas.

---

## 🚀 Setup Inicial

### 1. Requisitos Previos

```bash
Node.js >= 14.x
npm >= 6.x
Git
Editor: VS Code (recomendado)
```

### 2. Clonar e Instalar

```bash
# Clonar repositorio
git clone https://github.com/cesarJorquera/leo-perfecto.git
cd leo-perfecto

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run serve
```

La aplicación estará en `http://localhost:8080`

### 3. Extensiones VS Code Recomendadas

```json
{
  "recommendations": [
    "octref.vetur",              // Vue.js support
    "dbaeumer.vscode-eslint",    // ESLint
    "bradlc.vscode-tailwindcss", // Tailwind CSS IntelliSense
    "esbenp.prettier-vscode"     // Prettier
  ]
}
```

---

## 📂 Estructura del Proyecto

### Componentes Principales

```
src/components/
├── MiProgreso.vue          # Dashboard con métricas y logros
├── mascota.vue             # Asistente Leo con feedback
├── Navbar.vue              # Barra de navegación
│
├── Juegos
│   ├── pant_game_1.vue     # Juego 1: Identificación
│   ├── pant_game_2.vue     # Juego 2: Clasificación
│   └── pant_game_3.vue     # Juego 3: Comprensión
│
└── Pantallas
    ├── pant_bienvenida.vue
    ├── pant_reglas_game1.vue
    └── pant_reglas_game2.vue
```

### Datos y Lógica

```
src/
├── data/                   # Datos estáticos
│   ├── game1_texts.js      # 12 textos literarios
│   ├── game2_texts.js      # 10 ejercicios clasificación
│   ├── game3_texts.js      # 30 textos comprensión
│   └── quest_game_keyword.js  # Preguntas Juego 1
│
└── utils/                  # Utilidades
    ├── eventBus.js         # Comunicación entre componentes
    └── gameManager.js      # Gestión de progreso
```

---

## 🎯 Convenciones de Código

### Nomenclatura

#### Componentes Vue
```
PascalCase para archivos:
- MiProgreso.vue
- Navbar.vue

Prefijo pant_ para pantallas completas:
- pant_game_1.vue
- pant_bienvenida.vue
```

#### Variables y Métodos
```javascript
// camelCase para variables
const playerName = 'Juan';
const currentScreen = 'game1';

// camelCase para métodos
function selectAnswer() { ... }
function goToNextScreen() { ... }
```

#### Props y Emits
```vue
<!-- Props: camelCase en JS, kebab-case en template -->
<script>
export default {
  props: {
    playerName: String,
    textId: String
  }
}
</script>

<template>
  <component :player-name="playerName" :text-id="textId" />
</template>

<!-- Emits: kebab-case -->
<script>
this.$emit('game-completed');
this.$emit('back-to-progress');
</script>
```

---

## 🧩 Creación de Componentes

### Estructura Estándar

```vue
<template>
  <!-- HTML del componente -->
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Acción</button>
  </div>
</template>

<script>
/**
 * @component NombreComponente
 * @description Descripción breve del componente
 */
export default {
  name: 'NombreComponente',
  
  // Props recibidas
  props: {
    title: {
      type: String,
      required: true,
      validator: (value) => value.length > 0
    }
  },
  
  // Estado local
  data() {
    return {
      isActive: false,
      counter: 0
    }
  },
  
  // Propiedades computadas (se recalculan solo cuando cambian dependencias)
  computed: {
    displayTitle() {
      return this.title.toUpperCase();
    }
  },
  
  // Métodos
  methods: {
    handleClick() {
      this.counter++;
      this.$emit('action-performed', this.counter);
    }
  },
  
  // Lifecycle hooks
  mounted() {
    console.log('Componente montado');
  },
  
  beforeUnmount() {
    console.log('Limpieza antes de desmontar');
  }
}
</script>

<style scoped>
/* Estilos específicos del componente */
.container {
  padding: 1rem;
}
</style>
```

---

## 📡 Sistema de Comunicación

### 1. Props y Emits (Parent-Child)

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent 
    :data="myData"
    @child-event="handleChildEvent"
  />
</template>

<script>
export default {
  data() {
    return {
      myData: 'valor'
    }
  },
  methods: {
    handleChildEvent(payload) {
      console.log('Evento recibido:', payload);
    }
  }
}
</script>

<!-- Child.vue -->
<script>
export default {
  props: {
    data: String
  },
  methods: {
    triggerEvent() {
      this.$emit('child-event', { result: 'success' });
    }
  }
}
</script>
```

### 2. Event Bus (Components Siblings)

```javascript
// Paso 1: Import del event bus
import { emitter } from '@/utils/eventBus';

// Paso 2: Emisor (Component A)
export default {
  methods: {
    sendData() {
      emitter.emit('data-updated', {
        value: 100,
        timestamp: Date.now()
      });
    }
  }
}

// Paso 3: Receptor (Component B)
export default {
  mounted() {
    // Registrar listener
    emitter.on('data-updated', this.handleDataUpdate);
  },
  
  methods: {
    handleDataUpdate(payload) {
      console.log('Datos actualizados:', payload);
    }
  },
  
  beforeUnmount() {
    // ⚠️ IMPORTANTE: Limpiar listener
    emitter.off('data-updated', this.handleDataUpdate);
  }
}
```

---

## 💾 Sistema de Progreso (GameManager)

### Uso Básico

```javascript
// 1. Importar y crear instancia
import { createGameManager } from '@/utils/gameManager';

export default {
  data() {
    return {
      gameManager: null
    }
  },
  
  mounted() {
    // Crear con nombre del jugador
    this.gameManager = createGameManager(this.playerName);
  },
  
  methods: {
    // 2. Guardar progreso al completar juego
    saveGameProgress() {
      this.gameManager.saveProgress(
        1,              // gameId: 1=Juego1, 2=Juego2, 3=Juego3
        'text1',        // textId: identificador del texto
        85,             // score: puntaje (0-100)
        5,              // totalQuestions: total de preguntas
        4               // correctAnswers: respuestas correctas
      );
    },
    
    // 3. Cargar progreso
    loadPlayerProgress() {
      const progressArray = this.gameManager.loadProgress();
      console.log('Historial:', progressArray);
    },
    
    // 4. Obtener estadísticas calculadas
    getStats() {
      const stats = this.gameManager.getEstadisticas();
      console.log('Juegos completados:', stats.juegosCompletados);
      console.log('Efectividad:', stats.efectividad);
      console.log('Juegos perfectos:', stats.juegosPerfectos);
    },
    
    // 5. Seleccionar juego inteligente
    selectNextGame() {
      const unidadId = 2; // Unidad 2: Comprensión Lectora
      const juego = this.gameManager.seleccionarJuegoInteligente(unidadId);
      
      console.log('Juego seleccionado:', juego);
      // {
      //   gameId: 1,
      //   textId: 'text5',
      //   nombre: 'Juego 1 - Texto 5',
      //   esRepeticion: false,
      //   mensaje: '🎮 Texto nuevo: ...'
      // }
    }
  }
}
```

### Formato de Datos en localStorage

```javascript
// Key: 'leo-perfecto-progress'
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
  {
    date: "2024-11-21T11:00:00.000Z",
    playerName: "Juan",
    gameId: 2,
    textId: "drag1",
    score: 100,
    totalQuestions: 8,
    correctAnswers: 8
  }
]
```

---

## 🎨 Estilos con Tailwind CSS

### Clases Comunes

```vue
<template>
  <!-- Contenedores -->
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    
    <!-- Tarjetas -->
    <div class="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-200">
      
      <!-- Títulos -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        Título Principal
      </h1>
      
      <!-- Botones -->
      <button class="bg-blue-500 hover:bg-blue-600 text-white 
                     px-6 py-3 rounded-xl font-semibold 
                     transition-all hover:scale-105">
        Acción
      </button>
      
      <!-- Gradientes -->
      <div class="bg-gradient-to-br from-blue-400 to-purple-500 p-6">
        Contenido
      </div>
      
      <!-- Grid responsive -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </div>
      
    </div>
  </div>
</template>
```

### Animaciones Personalizadas

```vue
<template>
  <div class="mascota animate-bounce-gentle">
    <img src="..." />
  </div>
</template>

<style scoped>
/* Usando animaciones de animations.css */
@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce-gentle {
  animation: bounce-gentle 2s ease-in-out infinite;
}
</style>
```

---

## 🔊 Sistema de Sonidos

### Uso del Audio Context

```javascript
export default {
  data() {
    return {
      audioContext: null
    }
  },
  
  mounted() {
    this.initAudio();
  },
  
  methods: {
    initAudio() {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    },
    
    playSound(type) {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      const now = this.audioContext.currentTime;
      
      switch(type) {
        case 'success':
          oscillator.frequency.setValueAtTime(523, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          oscillator.start(now);
          oscillator.stop(now + 0.5);
          break;
          
        case 'error':
          oscillator.frequency.setValueAtTime(200, now);
          gainNode.gain.setValueAtTime(0.3, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;
          
        case 'click':
          oscillator.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;
      }
    }
  }
}
```

---

## 📝 Agregar un Nuevo Juego

### Paso 1: Crear Componente del Juego

```vue
<!-- src/components/pant_game_4.vue -->
<template>
  <div class="game-container">
    <h1>{{ playerName }}, Juego 4</h1>
    
    <!-- Lógica del juego aquí -->
    
    <button @click="finishGame">Terminar</button>
  </div>
</template>

<script>
import { createGameManager } from '@/utils/gameManager';

export default {
  name: 'PantGame4',
  
  props: {
    playerName: String,
    textId: String
  },
  
  data() {
    return {
      score: 0,
      gameManager: null
    }
  },
  
  mounted() {
    this.gameManager = createGameManager(this.playerName);
  },
  
  methods: {
    finishGame() {
      // Guardar progreso
      this.gameManager.saveProgress(
        4,              // gameId: 4 (nuevo juego)
        this.textId,
        this.score,
        10,             // total preguntas
        8               // respuestas correctas
      );
      
      // Emitir evento al padre
      this.$emit('game-completed', {
        gameId: 4,
        textId: this.textId,
        score: this.score
      });
    }
  }
}
</script>
```

### Paso 2: Agregar en App.vue

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- ... otros componentes ... -->
    
    <pant_game_4 
      v-if="currentScreen === 'game4'"
      :player-name="playerName"
      :text-id="currentTextId"
      @game-completed="handleGameCompleted"
    />
  </div>
</template>

<script>
import PantGame4 from './components/pant_game_4.vue';

export default {
  components: {
    PantGame4
  },
  
  methods: {
    startGame4(textId) {
      this.currentTextId = textId;
      this.currentScreen = 'game4';
    }
  }
}
</script>
```

### Paso 3: Actualizar GameManager

```javascript
// src/utils/gameManager.js

// Agregar configuración del nuevo juego
const JUEGOS_CONFIG = {
  // ... juegos existentes ...
  4: {
    nombre: 'Juego 4',
    unidad: 3,
    textos: ['text4_1', 'text4_2', 'text4_3']
  }
};
```

---

## 🐛 Debugging

### Console Logs Útiles

```javascript
// Progreso del jugador
console.log('Progress:', this.gameManager.loadProgress());

// Estadísticas
console.log('Stats:', this.gameManager.getEstadisticas());

// Props recibidas
console.log('Props:', this.$props);

// Estado actual
console.log('Data:', this.$data);

// Referencia al DOM
console.log('Element:', this.$refs.miElemento);
```

### Vue DevTools

1. Instalar extensión [Vue DevTools](https://devtools.vuejs.org/)
2. Abrir en navegador (F12 → pestaña Vue)
3. Inspeccionar componentes, estado y eventos

---

## ✅ Checklist para Nueva Funcionalidad

- [ ] Componente creado con estructura estándar
- [ ] Props validadas con tipos
- [ ] Métodos documentados con comentarios
- [ ] Event listeners limpiados en `beforeUnmount`
- [ ] Estilos con Tailwind (evitar CSS custom innecesario)
- [ ] Probado en móvil, tablet y desktop
- [ ] Sin errores en consola
- [ ] Código comentado en secciones complejas
- [ ] Guardado de progreso implementado (si aplica)
- [ ] Emits documentados

---

## 🚨 Errores Comunes

### 1. "Cannot read property of undefined"

```javascript
// ❌ Mal
computed: {
  displayName() {
    return this.user.name; // Si user es null, error
  }
}

// ✅ Bien
computed: {
  displayName() {
    return this.user?.name || 'Invitado'; // Optional chaining
  }
}
```

### 2. Event Listener sin remover

```javascript
// ❌ Mal (memory leak)
mounted() {
  emitter.on('event', this.handler);
}

// ✅ Bien
mounted() {
  emitter.on('event', this.handler);
},
beforeUnmount() {
  emitter.off('event', this.handler);
}
```

### 3. Modificar prop directamente

```javascript
// ❌ Mal (Vue warning)
props: {
  count: Number
},
methods: {
  increment() {
    this.count++; // ¡No modificar props!
  }
}

// ✅ Bien
data() {
  return {
    localCount: this.count // Copiar a data local
  }
},
methods: {
  increment() {
    this.localCount++;
    this.$emit('update:count', this.localCount);
  }
}
```

---

## 📚 Recursos Adicionales

- **Vue.js 3 Docs:** [vuejs.org/guide](https://vuejs.org/guide)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Event Bus (mitt):** [github.com/developit/mitt](https://github.com/developit/mitt)
- **Web Audio API:** [MDN Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🤝 Workflow de Desarrollo

### Git Flow

```bash
# 1. Crear rama para nueva feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits frecuentes
git add .
git commit -m "feat: agregar funcionalidad X"

# 3. Push a GitHub
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# 5. Review y merge a main
```

### Convenciones de Commits

```bash
feat: Nueva funcionalidad
fix: Corrección de bug
docs: Cambios en documentación
style: Formato, CSS
refactor: Refactorización sin cambio funcional
test: Agregar tests
chore: Tareas de mantenimiento
```

---

## 📞 Soporte

¿Dudas? Contacta a:
- **César Jorquera** - ces.jorquera@duocuc.cl
- **GitHub Issues:** [github.com/cesarJorquera/leo-perfecto/issues](https://github.com/cesarJorquera/leo-perfecto/issues)

---

**Última actualización:** 21 de Noviembre de 2025
