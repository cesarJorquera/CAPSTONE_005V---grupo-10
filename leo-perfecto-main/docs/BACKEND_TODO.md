# 🚀 Backend TODO - Leo Perfecto

Este documento detalla **todo lo que falta implementar** para el backend de Leo Perfecto, desde la configuración inicial hasta features avanzadas.

---

## 📊 Estado Actual vs. Objetivo

### ✅ Implementado (Frontend)

- 3 juegos completos y funcionales
- Sistema de progreso en localStorage
- GameManager para gestión inteligente
- Dashboard con métricas avanzadas
- UI/UX profesional

### 🚧 Pendiente (Backend)

- Base de datos persistente
- API REST para juegos y progreso
- Sistema de autenticación multi-usuario
- Rankings globales en tiempo real
- Integración con IA (OpenAI/Gemini)
- Panel de administración

---

## 🗄️ Diseño de Base de Datos

### Esquema Propuesto (PostgreSQL)

```sql
-- Tabla: users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  avatar_url VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student', -- 'student' | 'teacher' | 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Tabla: user_progress
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER NOT NULL, -- 1=Juego1, 2=Juego2, 3=Juego3
  text_id VARCHAR(50) NOT NULL, -- 'text1', 'drag1', etc.
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_spent INTEGER, -- Segundos
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, game_id, text_id) -- Solo mejor score por juego
);

-- Tabla: achievements
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  achievement_key VARCHAR(50) UNIQUE NOT NULL, -- 'primer_paso', 'experto', etc.
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- emoji o URL
  criteria JSONB NOT NULL -- { "type": "games_completed", "value": 5 }
);

-- Tabla: user_achievements
CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Tabla: daily_streak
CREATE TABLE daily_streak (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE
);

-- Tabla: game_sessions
CREATE TABLE game_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_id INTEGER NOT NULL,
  text_id VARCHAR(50),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  score INTEGER,
  answers JSONB -- Array de respuestas con timestamps
);

-- Tabla: texts (opcional - si quieres editar desde backend)
CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  text_key VARCHAR(50) UNIQUE NOT NULL, -- 'text1', 'drag1'
  game_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  difficulty VARCHAR(20), -- 'basico', 'intermedio', 'avanzado'
  questions JSONB, -- Array de preguntas
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_game_id ON user_progress(game_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_completed ON game_sessions(completed);
```

### Relaciones

```
users (1) ----< (N) user_progress
users (1) ----< (N) user_achievements
users (1) ----  (1) daily_streak
users (1) ----< (N) game_sessions

achievements (1) ----< (N) user_achievements
```

---

## 🛠️ Stack Tecnológico Recomendado

### Backend

```
Node.js + Express.js
├── PostgreSQL          # Base de datos principal
├── Sequelize/Prisma    # ORM para fácil manejo de BD
├── JWT                 # Autenticación sin sesiones
├── bcrypt              # Hash de contraseñas
├── express-validator   # Validación de inputs
└── cors                # Manejo de CORS
```

### Hosting Recomendado

```
Backend:
├── Railway / Render    # Hosting gratuito/barato
└── Heroku (pago)       # Alternativa robusta

Base de Datos:
├── Railway Postgres    # Incluido con hosting
├── Supabase            # Postgres + APIs gratis
└── ElephantSQL         # Postgres gratuito
```

### Opcional (Avanzado)

```
Redis           # Cache de sesiones y rankings
Socket.io       # Rankings en tiempo real
Cloudinary      # Almacenamiento de avatares
SendGrid        # Emails (recuperación contraseña)
```

---

## 📡 Diseño de API REST

### Endpoints Propuestos

#### 🔐 Autenticación

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me
```

#### 👤 Usuarios

```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/users/:id/progress
GET    /api/users/:id/achievements
GET    /api/users/:id/stats
```

#### 🎮 Progreso de Juegos

```
GET    /api/progress                    # Progreso del usuario autenticado
POST   /api/progress                    # Guardar progreso de un juego
GET    /api/progress/game/:gameId       # Progreso por juego específico
GET    /api/progress/stats              # Estadísticas calculadas
DELETE /api/progress/:id                # Eliminar progreso específico
```

#### 🏆 Logros

```
GET    /api/achievements                # Todos los logros disponibles
GET    /api/achievements/user           # Logros del usuario autenticado
POST   /api/achievements/unlock         # Desbloquear logro (automático)
```

#### 📊 Rankings

```
GET    /api/rankings/global             # Ranking global
GET    /api/rankings/game/:gameId       # Ranking por juego
GET    /api/rankings/weekly             # Ranking semanal
```

#### 📚 Textos y Contenido

```
GET    /api/texts                       # Todos los textos
GET    /api/texts/:id                   # Texto específico
GET    /api/texts/game/:gameId          # Textos de un juego
```

#### 🤖 IA (Futuro)

```
POST   /api/ai/analyze-text             # Analizar texto con IA
POST   /api/ai/generate-questions       # Generar preguntas
POST   /api/ai/personalized-feedback    # Feedback personalizado
```

---

## 📝 Ejemplos de Requests/Responses

### 1. Registro de Usuario

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "juan123",
  "email": "juan@example.com",
  "password": "MiPassword123!",
  "full_name": "Juan Pérez"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "juan123",
      "email": "juan@example.com",
      "full_name": "Juan Pérez",
      "role": "student",
      "created_at": "2024-11-21T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "juan123",
      "email": "juan@example.com",
      "full_name": "Juan Pérez",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Guardar Progreso

**Request:**
```http
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "game_id": 1,
  "text_id": "text1",
  "score": 85,
  "total_questions": 5,
  "correct_answers": 4,
  "time_spent": 120
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Progreso guardado exitosamente",
  "data": {
    "progress": {
      "id": 1,
      "user_id": 1,
      "game_id": 1,
      "text_id": "text1",
      "score": 85,
      "total_questions": 5,
      "correct_answers": 4,
      "time_spent": 120,
      "completed_at": "2024-11-21T10:30:00Z"
    },
    "new_achievements": [
      {
        "id": 1,
        "name": "Primer Paso",
        "description": "Completa tu primer juego",
        "icon": "🎯"
      }
    ]
  }
}
```

### 4. Obtener Estadísticas

**Request:**
```http
GET /api/progress/stats
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "juegosCompletados": 12,
    "efectividad": 87.5,
    "juegosPerfectos": 3,
    "rachaActual": 7,
    "nivel": 4,
    "nivelTexto": "🎓 Experto",
    "progresoTotal": 37.5,
    "fortalezas": [
      {
        "titulo": "Excelencia en Comprensión",
        "descripcion": "Mantienes un rendimiento excepcional",
        "porcentaje": 90
      }
    ],
    "debilidades": [
      {
        "titulo": "Práctica Espaciada",
        "descripcion": "La práctica regular mejora la retención",
        "porcentaje": 50,
        "consejo": "Practica un poco cada día"
      }
    ]
  }
}
```

### 5. Ranking Global

**Request:**
```http
GET /api/rankings/global?limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "user": {
          "id": 5,
          "username": "maria_lectora",
          "avatar_url": "https://..."
        },
        "total_score": 2850,
        "games_completed": 32,
        "effectiveness": 95.2
      },
      {
        "rank": 2,
        "user": {
          "id": 1,
          "username": "juan123",
          "avatar_url": null
        },
        "total_score": 2420,
        "games_completed": 28,
        "effectiveness": 89.5
      }
    ],
    "user_rank": {
      "rank": 15,
      "total_score": 1580
    }
  }
}
```

---

## 🔒 Sistema de Autenticación JWT

### Flujo de Autenticación

```
1. Usuario hace login
   └─> Backend valida credenciales
       └─> Genera JWT con payload:
           {
             userId: 1,
             username: "juan123",
             role: "student",
             iat: timestamp,
             exp: timestamp + 24h
           }
       └─> Retorna token al frontend

2. Frontend guarda token en localStorage

3. Cada request incluye token en header:
   Authorization: Bearer <token>

4. Backend middleware valida token:
   ├─> Token válido → permite acceso
   └─> Token inválido/expirado → retorna 401
```

### Middleware de Autenticación (Ejemplo)

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Extraer token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar usuario al request
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

module.exports = { authenticate };
```

---

## 📦 Estructura del Proyecto Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # Configuración de BD
│   │   └── jwt.js            # Config JWT
│   │
│   ├── models/               # Modelos Sequelize/Prisma
│   │   ├── User.js
│   │   ├── Progress.js
│   │   ├── Achievement.js
│   │   └── index.js
│   │
│   ├── routes/               # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   ├── progress.routes.js
│   │   ├── achievements.routes.js
│   │   └── rankings.routes.js
│   │
│   ├── controllers/          # Lógica de negocio
│   │   ├── authController.js
│   │   ├── progressController.js
│   │   └── rankingsController.js
│   │
│   ├── middleware/           # Middlewares
│   │   ├── auth.js           # Autenticación
│   │   ├── validate.js       # Validación
│   │   └── errorHandler.js   # Manejo errores
│   │
│   ├── services/             # Servicios auxiliares
│   │   ├── achievementService.js
│   │   ├── statsService.js
│   │   └── emailService.js
│   │
│   ├── utils/                # Utilidades
│   │   ├── logger.js
│   │   └── helpers.js
│   │
│   └── app.js                # Configuración Express
│
├── tests/                    # Tests
├── .env.example              # Variables de entorno ejemplo
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Plan de Implementación (Fases)

### Fase 1: Setup Básico (Semana 1)

**Tareas:**
- [ ] Crear proyecto Node.js + Express
- [ ] Configurar PostgreSQL (local o Railway)
- [ ] Instalar dependencias (express, pg, sequelize, jwt, bcrypt, cors)
- [ ] Configurar variables de entorno (.env)
- [ ] Crear estructura de carpetas
- [ ] Setup Sequelize/Prisma
- [ ] Crear modelos básicos (User, Progress)
- [ ] Migraciones de base de datos

**Tiempo estimado:** 3-5 días

---

### Fase 2: Autenticación (Semana 2)

**Tareas:**
- [ ] Endpoint: POST /api/auth/register
  - Validación de datos
  - Hash de contraseña con bcrypt
  - Generar JWT
- [ ] Endpoint: POST /api/auth/login
  - Validar credenciales
  - Generar JWT
- [ ] Middleware de autenticación
- [ ] Endpoint: GET /api/auth/me (usuario autenticado)
- [ ] Manejo de errores consistente
- [ ] Testing con Postman/Thunder Client

**Tiempo estimado:** 4-6 días

---

### Fase 3: Sistema de Progreso (Semana 3)

**Tareas:**
- [ ] Endpoint: POST /api/progress (guardar progreso)
  - Validación de score
  - Actualizar si mejora score anterior
  - Actualizar racha de días
- [ ] Endpoint: GET /api/progress (obtener progreso del usuario)
- [ ] Endpoint: GET /api/progress/stats (estadísticas calculadas)
  - Juegos completados
  - Efectividad
  - Nivel
  - Fortalezas/debilidades
- [ ] Migrar lógica de GameManager a backend
- [ ] Testing de endpoints

**Tiempo estimado:** 5-7 días

---

### Fase 4: Logros y Rankings (Semana 4)

**Tareas:**
- [ ] Seeders para tabla achievements
- [ ] Lógica de desbloqueo automático de logros
- [ ] Endpoint: GET /api/achievements
- [ ] Endpoint: GET /api/achievements/user
- [ ] Endpoint: GET /api/rankings/global
- [ ] Endpoint: GET /api/rankings/game/:gameId
- [ ] Cache de rankings (Redis opcional)
- [ ] Testing

**Tiempo estimado:** 5-7 días

---

### Fase 5: Integración Frontend (Semana 5)

**Tareas:**
- [ ] Crear servicio API en frontend (`src/services/api.js`)
- [ ] Implementar interceptor para JWT
- [ ] Migrar de localStorage a API calls
- [ ] Manejar tokens expirados (refresh)
- [ ] Actualizar GameManager para usar API
- [ ] Actualizar MiProgreso.vue para cargar desde API
- [ ] Testing end-to-end
- [ ] Fix de bugs

**Tiempo estimado:** 7-10 días

---

### Fase 6: Deploy (Semana 6)

**Tareas:**
- [ ] Deploy backend en Railway/Render
- [ ] Configurar PostgreSQL en producción
- [ ] Variables de entorno en hosting
- [ ] CORS configurado correctamente
- [ ] HTTPS habilitado
- [ ] Frontend actualizado con URL de API
- [ ] Testing en producción
- [ ] Monitoreo básico

**Tiempo estimado:** 3-5 días

---

### Fase 7: Features Avanzadas (Futuro)

**Opcionales:**
- [ ] Integración con OpenAI/Gemini
- [ ] Panel de administración
- [ ] Sistema de roles (teacher, admin)
- [ ] Estadísticas avanzadas
- [ ] Notificaciones (email, push)
- [ ] Rankings en tiempo real (Socket.io)
- [ ] Exportar progreso (PDF, CSV)
- [ ] Soporte multi-idioma

---

## 🔧 Configuración Inicial (Ejemplo)

### 1. Crear Proyecto Node.js

```bash
mkdir leo-perfecto-backend
cd leo-perfecto-backend
npm init -y
```

### 2. Instalar Dependencias

```bash
# Producción
npm install express pg sequelize bcryptjs jsonwebtoken cors dotenv express-validator

# Desarrollo
npm install --save-dev nodemon
```

### 3. Crear archivo .env

```env
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/leo_perfecto
DB_HOST=localhost
DB_PORT=5432
DB_NAME=leo_perfecto
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=otro_secreto_diferente
JWT_REFRESH_EXPIRE=7d

# Servidor
PORT=3000
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:8080

# OpenAI (futuro)
OPENAI_API_KEY=sk-...
```

### 4. Estructura Básica de Express

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const progressRoutes = require('./routes/progress.routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
```

---

## 📚 Recursos y Referencias

### Tutoriales Recomendados

- **Node.js + Express:** [expressjs.com/guide](https://expressjs.com/en/guide/routing.html)
- **Sequelize ORM:** [sequelize.org/docs](https://sequelize.org/docs/v6/)
- **JWT Auth:** [jwt.io/introduction](https://jwt.io/introduction)
- **PostgreSQL:** [postgresql.org/docs](https://www.postgresql.org/docs/)
- **Railway Deploy:** [docs.railway.app](https://docs.railway.app/)

### Librerías Útiles

```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "sequelize": "^6.35.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express-validator": "^7.0.1",
  "helmet": "^7.1.0",
  "morgan": "^1.10.0"
}
```

---

## ✅ Checklist Completo

### Setup
- [ ] Proyecto Node.js creado
- [ ] Dependencias instaladas
- [ ] PostgreSQL configurado
- [ ] Variables de entorno definidas
- [ ] Git inicializado

### Base de Datos
- [ ] Esquema diseñado
- [ ] Modelos creados
- [ ] Migraciones ejecutadas
- [ ] Seeders de datos iniciales

### Autenticación
- [ ] Registro de usuarios
- [ ] Login funcional
- [ ] JWT implementado
- [ ] Middleware de auth
- [ ] Validaciones de seguridad

### Progreso
- [ ] Guardar progreso
- [ ] Obtener progreso
- [ ] Calcular estadísticas
- [ ] Lógica de mejora de scores

### Logros
- [ ] Tabla de logros poblada
- [ ] Desbloqueo automático
- [ ] Endpoints funcionales

### Rankings
- [ ] Ranking global
- [ ] Ranking por juego
- [ ] Cache (opcional)

### Integración
- [ ] API service en frontend
- [ ] Llamadas a backend
- [ ] Manejo de errores
- [ ] Loading states

### Deploy
- [ ] Backend en hosting
- [ ] BD en producción
- [ ] HTTPS habilitado
- [ ] CORS configurado
- [ ] Frontend conectado

---

## 🆘 Soporte y Dudas

Para implementar el backend:
1. Seguir este documento paso a paso
2. Consultar [GUIA_DESARROLLO.md](./GUIA_DESARROLLO.md) para convenciones
3. Crear issues en GitHub para dudas específicas
4. Contactar a César Jorquera: ces.jorquera@duocuc.cl

---

**Última actualización:** 21 de Noviembre de 2025  
**Versión:** 1.0.0
