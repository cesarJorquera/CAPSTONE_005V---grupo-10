# 🎮 PRODUCT BACKLOG — Leo Perfecto
### Capstone 2026 · Duoc UC Melipilla · Equipo: César, Cristian, Andrés
**Cliente:** Profesora Jimena Guerrero · **Plazo:** todo funcional primera semana de noviembre
**Última actualización:** 8 de octubre de 2026

> **Cómo se usa este documento:** Este es el Product Backlog = TODAS las tarjetas del proyecto, existan o no en el sprint actual. De aquí se sacan tarjetas al Sprint Backlog en cada planning. Las tarjetas marcadas 🟢 están refinadas (listas para trabajar). Las 🟡 tienen alcance definido pero falta detalle técnico. Las 🔴 están sin definir (dependen de decisiones con la profe o del equipo).

---

## Prioridades (MoSCoW simplificado)

- **P1 = Must:** sin esto el proyecto no cumple lo que pidió la clienta
- **P2 = Should:** importante, entra si el tiempo lo permite
- **P3 = Could:** mejora futura / si sobra tiempo

---

## ÉPICA 1 — Base de Datos (la memoria del sistema)

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| BD-01 | Crear proyecto Supabase (región, contraseña BD, compartir URL y keys al equipo por canal privado) | P1 | 🟢 Refinada |
| BD-02 | Ejecutar esquema SQL ajustado: tablas del esquema de Andrés + parche (profiles: género, edad, rol, mostrar_en_ranking) + cambio clave: tabla `texts` con columna `payload jsonb` que guarda el objeto JS completo de cada texto, cualquiera sea su forma | P1 | 🟢 Refinada |
| BD-03 | Seed: migrar los 52 textos desde `game1_texts.js`, `game2_texts.js`, `game3_texts.js` a la tabla `texts` (script en `scripts/seed.js`) | P1 | 🟢 Refinada |
| BD-04 | Definir el formato exacto de lo que se guarda en `game_sessions` por cada juego terminado (qué va en `answers`, cómo se registra la habilidad evaluada) — esto define qué podrá medir el dashboard después | P1 | 🟢 Refinada |
| BD-05 | ⭐ Tabla/vista de métricas de uso: sesiones de juego ya las tenemos; falta registrar "visitas a la app" (evento simple al abrir la app) para responder "cuántos usan el sistema" | P2 | 🟡 Falta detalle |

## ÉPICA 2 — Cuentas y Acceso

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| CU-01 | Conectar Supabase al frontend (`supabaseClient.js`, variables `VUE_APP_` en .env.local y Netlify) | P1 | 🟢 Refinada |
| CU-02 | Login con Google: pantalla de login (reemplaza a la pantalla actual de "ingresa tu nombre"), botón Google, checkbox de consentimiento | P1 | 🟢 Refinada |
| CU-03 | Sesión persistente: al volver a abrir la app, entrar directo a la bienvenida sin loguearse de nuevo (Supabase mantiene la sesión; hay que conectarla al `currentScreen` de App.vue) + botón cerrar sesión | P1 | 🟢 Refinada |
| CU-04 | Rol docente: columna `rol` en profiles, ascenso manual por SQL (nadie se auto-asigna docente), la app muestra botón "Panel" solo si rol=docente | P1 | 🟢 Refinada |
| CU-05 | QR de acceso para proyectar en clases (apunta a la URL de Netlify) | P1 | 🟢 Refinada |
| CU-06 | ⭐ Perfil del alumno: alias público editable, opción "aparecer anónimo", género y edad opcionales (los KPIs de la profe los necesitan) | P2 | 🟡 Falta detalle |

## ÉPICA 3 — Progreso en la Nube

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| PR-01 | Guardar sesión de juego en Supabase al terminar cada juego (servicio `supabaseProgress.js`, sin tocar la lógica de los juegos; localStorage queda de respaldo con try/catch) | P1 | 🟢 Refinada |
| PR-02 | Cargar progreso desde la nube al iniciar sesión + migración única del progreso localStorage viejo | P1 | 🟢 Refinada |
| PR-03 | Ranking global: vista SQL `ranking_global` + pantalla con podio, usando alias público y respetando la opción anónimo | P1 | 🟢 Refinada |
| PR-04 | Dashboard del alumno con datos reales: MiProgreso.vue alimentado desde la nube (fortalezas/debilidades ya existen en la bienvenida — se mantienen y se alimentan de datos reales) | P2 | 🟡 Falta detalle |
| PR-05 | ⭐ Puntaje compuesto del alumno: nivel de comprensión lectora calculado de múltiples variables (rendimiento por habilidad, dificultad, racha) | P3 | 🔴 Sin definir |

## ÉPICA 4 — Panel de la Profesora (dashboard + administración)

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| PA-01 | Panel docente: estructura base (pantalla con pestañas: "Dashboard" y "Cargar texto"), acceso solo con rol docente | P1 | 🟡 Falta detalle |
| PA-02 | Dashboard curso: cuántos alumnos registrados, cuántos activos esta semana, cuántos han jugado, cuántos juegos han jugado (consultas sobre game_sessions + profiles) | P1 | 🟡 Falta detalle |
| PA-03 | Dashboard rendimiento: promedio por habilidad de comprensión lectora, quién mejora, quién va atrasado, fortalezas/debilidades del curso — vista por alumno (alias, género, edad — anonimizado) y vista de curso completo | P1 | 🟡 Falta detalle |
| PA-04 | Cargar texto: formulario para subir texto (título, contenido, nivel/dificultad, juego destino) → queda guardado en `texts` disponible para jugar | P1 | 🟡 Falta detalle |
| PA-05 | ⭐ Vista detalle por alumno: la profe hace clic en un alumno y ve su historial completo | P2 | 🔴 Sin definir |
| PA-06 | ⭐ Gestión de cursos/secciones: la profe agrupa alumnos por curso y filtra el dashboard por sección | P2 | 🔴 Sin definir (conversar con Jimena: ¿lo necesita ya?) |

## ÉPICA 5 — Juegos

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| JU-01 | **Juego nuevo: Comprensión Auditiva (lectura viva)** — la app lee en voz alta una pregunta/frase/texto breve y el alumno responde jugando (sin leer). Voz fluida y agradable (evaluar Web Speech API en celular; si suena robótica, evaluar alternativa) | P1 | 🔴 Sin definir (diseñar con la profe) |
| JU-02 | **Juego nuevo: nivel difícil con textos de la profe** — usa los textos cargados en PA-04 (textos universitarios Duoc). Tipo trivia/desafío | P1 | 🔴 Sin definir |
| JU-03 | Decidir destino de los 3 juegos actuales (mantener / mejorar / fusionar) y del juego 4 trivia que está en develop | P2 | 🔴 Decisión de equipo + profe |
| JU-04 | Los juegos leen textos desde la BD (dejan de usar los .js) — necesario para que lo que sube la profe aparezca en los juegos | P1 | 🟡 Falta detalle (requiere revisar componentes de juego) |
| JU-05 | ⭐ Diagnóstico inicial con IA: al registrarse, un test que ubica al alumno y le dice por dónde partir | P3 | 🔴 Sin definir |

## ÉPICA 6 — Experiencia e Inclusión

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| EX-01 | Mobile-first: los juegos a pantalla completa en celular, sin distracciones; la mascota Leo se apodera de la pantalla para feedback/ayudas | P2 | 🔴 Sin definir (probar en celular primero) |
| EX-02 | Inclusión TEA: alcance POR DEFINIR con la profe (candidatos: modo calma sin animaciones/sonidos, instrucciones literales, lectura viva ya ayuda) | P2 | 🔴 Sin definir — validar con Jimena |
| EX-03 | Mascota Leo con IA (feedback generado por Gemini con fallback hardcodeado si la API se cae) | P3 | 🔴 Sin definir |
| EX-04 | ⭐ Auditoría visual en celular: recorrer toda la app en móvil y listar lo que se ve mal | P1 | 🟢 Refinada (va en la tarjeta de pruebas) |

## ÉPICA 7 — Infraestructura y Cierre

| ID | Tarjeta | P | Estado |
|---|---|---|---|
| IN-01 | Ordenar repos: mover `supabase/` a leo-perfecto, limpiar copia en CAPSTONE (que quede solo para evidencias) | P1 | 🟢 Refinada |
| IN-02 | AGENTS.md: archivo de contexto del proyecto para que los agentes de IA (Copilot/Gemini) entiendan el código | P2 | 🟢 Refinada |
| IN-03 | ⭐ Documentación del profe guía: evidencias del sprint (capturas, PRs, tablero) organizadas en CAPSTONE según estructura Fase 2 | P1 | 🟢 Refinada |
| IN-04 | ⭐ Capacitación final a Jimena (30 min: cómo entrar a su panel, cargar textos, leer el dashboard) | P1 | 🔴 Al final |
| IN-05 | ⭐ Documentación de entrega: manual de usuario y manual técnico breve | P1 | 🔴 Al final |

---

# SPRINT BACKLOG — Sprint 1 (8–21 oct): "La plataforma recuerda"

**Sprint Goal:** Un alumno entra con Google desde su celular, juega, y su progreso queda guardado en la nube. Se muestra a Jimena la semana del 20 oct.

| Tarjeta | Responsable | Estimado |
|---|---|---|
| IN-01 Ordenar repos | Andrés | 1 h |
| BD-01 Crear proyecto Supabase | Andrés | 2 h |
| BD-02 Ejecutar esquema ajustado | Andrés | 1 h |
| BD-03 Seed de 52 textos | Andrés | 3 h |
| BD-04 Formato de game_sessions | César (diseño) | 1 h |
| CU-01 Conectar Supabase al front | Cristian | 2 h |
| CU-02 Login con Google | Cristian | 4 h |
| CU-03 Sesión persistente + logout | Cristian | 2 h |
| CU-04 Rol docente (la puerta) | Cristian | 1 h |
| PR-01 Guardar progreso en nube | César | 4 h |
| PR-02 Cargar progreso + migración | César | 3 h |
| PR-03 Ranking global | César | 3 h |
| CU-05 QR + EX-04 prueba en celular | todos | 2 h |

**Total: ~29 h** (capacidad del equipo: 30 h — va justo; si algo se corta, se corta PR-03 Ranking)

**Dependencias (el orden importa):**
```
IN-01 → BD-01 → BD-02 → BD-03
              BD-02 → CU-01 → CU-02 → CU-03 → CU-04
              BD-02 → BD-04 → PR-01 → PR-02 → PR-03
Todo → CU-05 + EX-04 (prueba final en celular)
```

---

# CÓMO TRABAJAMOS (guía rápida del equipo)

## Trello

**Listas:** `📥 Product Backlog` → `🎯 Sprint Backlog` → `🔨 En curso` (máx 1 por persona) → `👀 En revisión (PR)` → `✅ Hecho` | y aparte: `❓ Por definir con la profe` y `🐛 Bugs`

**Cada tarjeta lleva:** ID y título · descripción (qué y para qué) · cómo hacerlo (pasos) · checklist · estimado (S/M/L) · responsable · etiqueta de épica · y al cerrarla: evidencia (captura + link al PR)

**DoD (vale para todas):** funciona en mi rama · probado en celular · no rompe nada · PR aprobado por otro · evidencia subida

## Git (lo que cada uno repite SIEMPRE)

```bash
git checkout develop && git pull          # partir del develop actualizado
git checkout feature/tu-nombre && git merge develop
# ... trabajar en la tarjeta ...
git add .
git commit -m "PR-01: guardar sesión de juego en Supabase"
git push origin feature/tu-nombre
# → GitHub: Pull Request hacia develop → otro aprueba → merge → mover tarjeta a Hecho
```

**Reglas:** nadie toca la rama de otro · nadie pushea directo a develop ni main · commits con ID de tarjeta · PR chicos mejor que grandes

## Daily (escrita, todos los días de trabajo)

Comentario en la tarjeta o WhatsApp: **ayer / hoy / bloqueo**. Si llevas 1 día bloqueado → pide ayuda, no esperes.
