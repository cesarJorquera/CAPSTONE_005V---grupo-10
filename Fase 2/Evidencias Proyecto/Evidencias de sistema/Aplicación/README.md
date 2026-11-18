# 📚 Leo Perfecto - Plataforma Educativa de Comprensión Lectora

<div align="center">

**Aplicación educativa interactiva para mejorar la comprensión lectora mediante juegos gamificados**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.2.13-brightgreen.svg)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-2.2.17-blue.svg)](https://tailwindcss.com/)
[![Netlify Status](https://img.shields.io/badge/Deployed%20on-Netlify-00c7b7.svg)](https://netlify.com/)
[![License](https://img.shields.io/badge/License-Academic-blue.svg)](LICENSE)

[Demo en Vivo](https://frabjous-mooncake-af96b6.netlify.app/) | [Documentación](./docs/proyecto.md) | [Reportar Bug](https://github.com/cesarJorquera/leo-perfecto/issues)

</div>

---

## 🎯 ¿Qué es Leo Perfecto?

Leo Perfecto es una **plataforma educativa moderna** diseñada para mejorar la **comprensión lectora** de estudiantes mediante *** juegos interactivos progresivos** con sistema de progreso inteligente:

### 🎮 Juegos actuales

#### 1️⃣ Juego 1 - Identificación de Palabras Clave
- Preguntas de opción múltiple sobre sustantivos, verbos, adjetivos y conectores
- Feedback inmediato con explicaciones educativas detalladas
- **12 textos literarios** de dificultad progresiva

#### 2️⃣ Juego 2 - Clasificación y Contexto
- Drag & drop para completar textos con palabras categorizadas
- Sistema de vidas (2 errores máximo) y sistema de pistas
- **10 ejercicios** con validación exacta y feedback visual

#### 3️⃣ Juego 3 - Comprensión Lectora Integral ✨ **NUEVO**
- **30 textos** con preguntas de comprensión profunda
- **5 habilidades cognitivas:** Idea Principal, Causa-Efecto, Inferencias, Detalles Específicos, Propósito del Autor
- **2 modos de juego:**
  - 🎓 **Práctica:** Sin límite de tiempo, ideal para aprender
  - ⚡ **Desafío:** 1:30 min por pregunta con timer visual
- Pantalla de instrucciones interactiva con Leo
- Explicaciones detalladas por cada respuesta

#### 4️⃣ Juego 4 - Trivia de Fundamentos
- Preguntas de selección múltiple sobre conceptos y estrategias lectoras
- Clasificación técnica de preguntas para análisis posterior

### ✨ Características Principales

- 🧠 **Sistema de progreso inteligente** - Selección automática de juegos según rendimiento
- 🤖 **Mascota interactiva "Leo"** - Feedback contextual y sistema de ayuda progresiva
- 📊 **Progreso del alumno** - Vista de progreso existente; su alineación completa con datos de nube sigue pendiente
- 📈 **Registro de actividad** - Supabase guarda partidas y respuestas asociadas a la cuenta
- 🎯 **Sistema de niveles** - De Aprendiz a Maestro de la Lectura
- 🔥 **Rachas de práctica** - Motivación mediante streaks diarios
- 🎨 **Diseño profesional** - UI minimalista y moderna con Tailwind CSS
- 🔊 **Feedback auditivo** - Sonidos con Web Audio API (sin librerías)
- 📱 **100% Responsive** - Optimizado para móvil, tablet y desktop
- 💾 **Persistencia en la nube** - Supabase guarda sesiones y respuestas; parte de las métricas heredadas sigue usando localStorage

---

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js >= 14.x
- npm >= 6.x

### Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/cesarJorquera/leo-perfecto.git
cd leo-perfecto

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run serve
```

La aplicación estará disponible en `http://localhost:8080`

### Build de Producción

```bash
npm run build
```

Genera carpeta `dist/` lista para desplegar en Netlify.

---

## 📁 Estructura del Proyecto

```
leo-perfecto/
├── docs/
│   └── proyecto.md             # Guía canónica de producto, código y datos
│
├── public/                     # Archivos estáticos
├── src/
│   ├── assets/                # Imágenes, estilos, animaciones
│   │   ├── icons/            # Iconos de la mascota (feliz/triste)
│   │   ├── img/              # Imágenes de contenido
│   │   ├── animations.css    # Animaciones personalizadas
│   │   └── main.css          # Estilos globales
│   ├── components/            # Componentes Vue
│   │   ├── MiProgreso.vue    # Dashboard de progreso y métricas
│   │   ├── mascota.vue       # Asistente virtual Leo
│   │   ├── pant_bienvenida.vue    # Pantalla inicial
│   │   ├── pant_game_1.vue   # Juego 1: Identificación
│   │   ├── pant_game_2.vue   # Juego 2: Clasificación
│   │   ├── pant_game_3.vue   # Juego 3: Comprensión ✨
│   │   ├── pant_instrucciones_game3.vue  # Instrucciones J3 ✨
│   │   ├── pant_reglas_game1.vue   # Reglas del juego 1
│   │   ├── pant_reglas_game2.vue   # Reglas del juego 2
│   ├── data/                 # Datos estáticos (JSON)
│   │   ├── game1_texts.js    # 12 textos literarios
│   │   ├── game2_texts.js    # 10 ejercicios clasificación ✨
│   │   ├── game3_texts.js    # 30 textos comprensión ✨
│   │   ├── quest_game_keyword.js  # Preguntas J1
│   │   └── game4_trivia.js   # Preguntas de trivia
│   ├── utils/                # Utilidades
│   │   ├── authService.js    # Autenticación Google
│   │   ├── supabaseProgress.js # Persistencia de partidas/respuestas
│   │   └── gameManager.js    # Métricas heredadas y selección de juegos
│   ├── App.vue               # Componente raíz
│   └── main.js               # Punto de entrada
│
├── netlify.toml              # Configuración de deploy
├── package.json
└── README.md
```

---

## 🎮 Características Actuales

### ✅ Funcionalidades actuales

#### 🎯 Sistema de Juegos Completo
- **Juego 1:** 12 textos literarios con preguntas de identificación y feedback educativo
- **Juego 2:** 10 ejercicios drag & drop con validación exacta y sistema de vidas
- **Juego 3:** 30 textos de comprensión lectora con 5 habilidades cognitivas
  - Modos: Práctica (sin límite) y Desafío (1:30 min con timer visual)
  - Pantalla de instrucciones interactiva con Leo
  - Explicaciones detalladas por cada respuesta
- **Juego 4:** Trivia de fundamentos con preguntas clasificadas por categoría

#### 📊 Sistema de Progreso Inteligente
- **GameManager:** Selección inteligente de juegos (prioriza no completados)
- **Persistencia:** sesiones y respuestas en Supabase asociadas a la cuenta autenticada
- **Autenticación:** OAuth con Google mediante Supabase; la sesión puede restaurarse en el mismo navegador
- **Estados de partida:** en curso, completada o abandonada
- **Dashboard Completo:**
  - La vista de progreso del alumno mantiene métricas heredadas y está pendiente de alinearse completamente con la nube
  - Las habilidades/categorías almacenadas son etiquetas técnicas preliminares, no un modelo pedagógico validado

#### 🤖 Mascota Interactiva "Leo"
- Feedback contextual según rendimiento
- Sistema de ayuda progresiva (3 niveles)
- Animaciones de estado (feliz/triste/neutro)
- Asistente de IA con 3 funciones: Consejo, Explicación, Pregunta Práctica

#### 🎨 Diseño y UX
- Colores suaves y minimalistas (escala 300-400)
- Interfaz 100% responsive (móvil, tablet, desktop)
- Animaciones CSS personalizadas (scale, float, pulse)
- Sistema de sonidos con Web Audio API (hover, click, acierto/error)
- Iconos SVG profesionales (sin emojis en producción)

#### 🏗️ Arquitectura
- **3 Unidades de Aprendizaje:** Fundamentos Básicos, Comprensión Lectora, Aplicación (próximamente)
- **Sistema modular:** Componentes reutilizables y separación de responsabilidades
- **Event Bus (mitt):** Comunicación entre componentes sin props drilling
- **Código limpio:** Comentarios técnicos, estructura clara, manejo de errores

### 📌 Pendiente / siguiente trabajo

- **Dashboard docente:** cursos, acceso seguro a estudiantes e indicadores por definir con la profesora
- **Modelo pedagógico de medición:** acordar habilidades y KPIs antes de presentar resultados como dominio
- **Alineación de MiProgreso:** retirar dependencias heredadas de localStorage donde corresponda
- **Contenido administrable:** decidir en una etapa posterior si textos deben cargarse desde un panel
- **Vue Router:** Navegación SPA profesional con rutas protegidas
- **Pinia Store:** Gestión centralizada de estado
- **Testing:** 
- **Unidad 3:** Textos extensos, síntesis, análisis crítico y metacognición

---

## 🛠️ Stack Tecnológico

- **Framework:** Vue.js 3.2.13 (Options API)
- **Estilos:** Tailwind CSS 2.2.17 + PostCSS
- **Build Tool:** Vue CLI 5.0.0
- **Event Bus:** Mitt 3.0.1 (comunicación entre componentes)
- **Audio:** Web Audio API nativa (sin librerías externas)
- **Persistencia:** Supabase (sesiones y respuestas); localStorage aún participa en funcionalidades heredadas
- **Deploy:** Netlify (CI/CD automático desde GitHub)

---

## 📚 Documentación Completa

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [proyecto.md](./docs/proyecto.md) | Objetivos, estado actual, arquitectura, datos, archivos y guía de desarrollo | Equipo e IA de apoyo |

---

## 🤝 Cómo Contribuir

### 📝 Para Agregar Contenido Educativo

1. Lee la [guía del proyecto](./docs/proyecto.md)
2. Agrega textos en:
   - `src/data/game1_texts.js` (Juego 1: Identificación)
   - `src/data/game2_texts.js` (Juego 2: Clasificación)
   - `src/data/game3_texts.js` (Juego 3: Comprensión)
3. Agrega preguntas en `src/data/quest_game_keyword.js`
4. Prueba localmente: `npm run serve`
5. Verifica que no haya errores en consola

### 💻 Para Desarrolladores

1. **Fork** el repositorio
2. Lee [docs/proyecto.md](./docs/proyecto.md) para entender la arquitectura y el estado actual
3. Confirma las decisiones pendientes en Trello antes de ampliar el esquema o las métricas
4. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
5. Commit siguiendo convenciones: `git commit -m "feat: descripción"`
6. Push: `git push origin feature/nueva-funcionalidad`
7. Abre un **Pull Request** con descripción detallada

### 🎨 Convenciones de Commit

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de estilo (formato, CSS)
- `refactor:` Refactorización sin cambio funcional
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento
---

## 📞 Contacto y Soporte

- **Email:** ces.jorquera@duocuc.cl
- **Repositorio:** [github.com/cesarJorquera/leo-perfecto](https://github.com/cesarJorquera/leo-perfecto)
- **Demo en vivo:** [Leo Perfecto en Netlify](https://frabjous-mooncake-af96b6.netlify.app/)

### 🐛 Reportar Bugs

Si encuentras un error:
1. Verifica que no esté ya reportado en [Issues](https://github.com/cesarJorquera/leo-perfecto/issues)
2. Crea un nuevo Issue con:
   - Descripción clara del problema
   - Pasos para reproducirlo
   - Capturas de pantalla (si aplica)
   - Información del navegador/dispositivo

---

## 📜 Licencia

Este proyecto es parte de un trabajo académico de **DuocUC**.  
Todos los derechos reservados © 2024-2025

---

<div align="center">

**🎓 Desarrollado con ❤️ para mejorar la comprensión lectora en estudiantes**

[![Made with Vue.js](https://img.shields.io/badge/Made%20with-Vue.js-42b883.svg)](https://vuejs.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind-38bdf8.svg)](https://tailwindcss.com/)
[![Deployed on Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00c7b7.svg)](https://netlify.com/)

</div>
