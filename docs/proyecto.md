# Leo Perfecto — guía del proyecto y contexto técnico

> Documento canónico de producto y código. Describe el estado del repositorio al
> 22 de octubre de 2026. Si el código cambia, actualizar esta guía en el mismo
> trabajo. No contiene credenciales ni datos reales de estudiantes.

## 1. Qué es el proyecto

Leo Perfecto es una aplicación web educativa hecha con Vue 3 para practicar
comprensión lectora y conceptos lingüísticos mediante juegos. Está pensada para
usarse principalmente desde teléfonos. La aplicación se publica como SPA en
Netlify y usa Supabase para autenticación Google y persistencia del progreso.

### Propósito actual

- El alumno ingresa con su cuenta Google.
- Cada cuenta tiene un UUID de Supabase Auth que identifica su progreso en la
  nube. El nombre visible proviene del perfil o de los metadatos de Google.
- El alumno acepta el aviso de almacenamiento educativo antes de entrar.
- Los juegos registran partidas, respuestas contestadas y si la partida se
  completó o se abandonó.
- Al recuperar una sesión o iniciar sesión, la aplicación carga el progreso de
  esa cuenta desde Supabase.
- El contenido actual de los juegos es estático y está en `src/data/`; no se
  migra a la base de datos en este alcance.

La intención pedagógica conversada es que la Unidad 1 practique conceptos
básicos que preparan para habilidades más complejas. La Unidad 2 contiene
ejercicios de comprensión lectora. Las categorías de evaluación que hoy asigna
el código son etiquetas técnicas preliminares: todavía no constituyen un modelo
pedagógico validado con la profesora.

## 2. Funcionalidades y estado

### Implementado

- Autenticación OAuth con Google vía Supabase.
- Restauración de la sesión guardada por Supabase en el navegador; no se pide
  volver a autorizar Google cada vez que se abre la app si la sesión sigue
  vigente.
- Perfil vinculado a `auth.users`, con nombre, alias público y rol.
- Cuatro experiencias de juego, reglas/instrucciones y selección de contenido.
- Persistencia en la nube de sesiones y respuestas.
- Estados de sesión `in_progress`, `completed` y `abandoned`.
- Carga de progreso del usuario al entrar/restaurar su sesión.
- RLS para aislar las partidas/respuestas del alumno.
- Prueba manual reportada por el equipo el 22-10-2026: iniciar sesión con
  Google, jugar y comprobar el registro en Supabase; abandonar una partida y
  comprobar su sesión y respuesta.

### Parcial o pendiente; no presentarlo como terminado

- El panel docente visible en la navegación es solo una pantalla provisional.
  Aún no consulta alumnos ni tiene dashboard real.
- No existen cursos, matrículas, relación docente-curso ni políticas para que
  una docente consulte a sus estudiantes.
- La vista de progreso del alumno (`MiProgreso.vue`) contiene métricas y lógica
  heredadas de `localStorage`; aunque `App.vue` descarga datos de la nube,
  todavía no se ha completado la migración de todas las métricas para que la
  nube sea la única fuente de verdad.
- Los logros mostrados por `MiProgreso.vue` se calculan/renderizan desde la
  lógica local existente; no se guardan como filas independientes en Supabase.
  Algunas métricas de uso pueden derivarse de sesiones y respuestas, pero la
  persistencia de logros y su definición como indicadores de adopción no están
  implementadas.
- No se importa automáticamente el historial antiguo guardado en
  `localStorage`. El progreso nuevo se asocia a la cuenta autenticada.
- No se ha definido el dashboard de la profesora ni el modelo pedagógico final
  de KPIs.
- El catálogo actual etiqueta ítems como `basic_concept`, `reading_skill`,
  `text_type` u `other`; no es una validación académica de dominio.
- No hay ranking global implementado como requisito de esta etapa.
- No hay registro separado de visitas a la aplicación.
- El contenido administrable por la profesora pertenece a una etapa posterior.
- No se ha implementado el nuevo juego de comprensión auditiva.
- La respuesta correcta se compara en el frontend. La base de datos conserva
  el resultado informado por el cliente; no es un sistema anti-trampas.

## 3. Inicio de sesión y persistencia entre usos

1. `pant_login.vue` muestra el consentimiento y el botón de Google.
2. `authService.js` inicia OAuth. Supabase devuelve al navegador a la URL de la
   aplicación, que debe estar permitida en la configuración de redirect URLs.
3. El trigger de `profiles` crea el perfil inicial asociado al usuario Auth.
4. `App.vue` carga el perfil, define el nombre visible y pide el progreso a
   `cargarProgresoNube()`.
5. Supabase Auth guarda la sesión en el almacenamiento del navegador. Al volver
   a abrir la app en ese mismo navegador/dispositivo, `getSession()` puede
   restaurarla sin repetir el flujo Google. Al cerrar sesión o expirar la
   sesión, se vuelve a pedir autenticación.
6. En otro dispositivo, el alumno tendrá que iniciar sesión allí también. Al
   usar la misma cuenta Google, Auth identifica el mismo usuario y la app carga
   sus datos de nube.

El nombre mostrado actualmente se resuelve en este orden: `profiles.full_name`,
metadatos de Google y parte anterior a `@` del correo. Aunque `alias_publico`
está en `profiles`, el nombre visible de la aplicación no se ha cambiado para
usar el alias como identidad pública.

## 4. Datos guardados y relaciones

### `profiles`

Una fila por usuario de Supabase Auth. Columnas actuales:

| Columna | Uso |
| --- | --- |
| `id` | UUID, PK y FK a `auth.users.id`. |
| `full_name` | Nombre recibido inicialmente desde Google/perfil. |
| `alias_publico` | Alias reservado para uso público; la UI de alias aún requiere trabajo. |
| `rol` | `alumno` o `docente`; el valor predeterminado es `alumno`. |
| `created_at` | Fecha de creación del perfil. |

El usuario autenticado puede leer su fila y actualizar `full_name` y
`alias_publico`. El rol no se asigna desde el frontend.

### `games`

Catálogo técnico de los juegos; su `id` lo usa `game_sessions.game_id`.

| id | code | Juego | unidad |
| --- | --- | --- | --- |
| 1 | `keyword_identification` | Identificación de conceptos clave | 1 |
| 2 | `word_classification` | Clasificación de palabras | 1 |
| 3 | `reading_comprehension` | Comprensión lectora | 2 |
| 4 | `reading_foundations_trivia` | Trivia de fundamentos | 1 |

Estos IDs son identificadores persistentes: si se agrega o renombra un juego,
mantenerlos estables o crear una migración compatible. No usar el nombre visible
como identificador.

### `game_sessions`

Una fila representa una actividad o partida de un usuario.

| Columna | Uso |
| --- | --- |
| `id` | Identificador de la sesión (bigint identity). |
| `user_id` | Usuario Auth propietario. |
| `game_id` | FK al catálogo `games`. |
| `content_id` | ID del texto, trivia o contenido, como `comp1` o `trivia1`. |
| `status` | `in_progress`, `completed` o `abandoned`. |
| `started_at`, `ended_at` | Inicio y cierre de la partida. |
| `total_questions` | Cantidad de ítems de la actividad. |
| `answered_count` | Cantidad de ítems con respuesta, calculada por trigger. |
| `correct_answers`, `score` | Resumen derivado de las respuestas registradas. |
| `details` | JSONB opcional, hoy puede guardar modo de juego. |
| `completed_at` | Fecha de cierre exitoso; nula si no se completó. |

### `game_responses`

Una fila representa una respuesta registrada a un ítem de una sesión. Si un
juego tiene varios ítems, habrá varias filas relacionadas con la misma sesión.

| Columna | Uso |
| --- | --- |
| `id` | Identificador de la respuesta. |
| `session_id` | FK a `game_sessions.id`, con borrado en cascada. |
| `item_id` | Identificador estable del ítem/pregunta dentro del contenido. |
| `attempt_number` | Número del intento para ese ítem; por defecto `1`. |
| `assessment_type` | Tipo: `basic_concept`, `reading_skill`, `text_type` u `other`. |
| `assessment_code` | Código normalizado para agrupar respuestas. |
| `answer` | Respuesta del estudiante en JSONB. |
| `is_correct` | Resultado que informa la aplicación. |
| `answered_at` | Momento en que se registró la respuesta. |

La combinación `(session_id, item_id, attempt_number)` es única. El trigger
`actualizar_resumen_sesion_juego` vuelve a calcular el resumen contando la
última respuesta por ítem. Por eso, al diseñar reintentos dentro de una misma
partida, la aplicación debe enviar un `attempt_number` creciente; actualmente
el tracker usa `response.attemptNumber || 1`, así que repetir un mismo ítem en
la misma partida sin incrementar ese número puede chocar con la restricción
única.

### Relación en breve

```text
auth.users 1 ── 1 profiles
auth.users 1 ── N game_sessions
games      1 ── N game_sessions
game_sessions 1 ── N game_responses
```

No se guardan los textos completos del juego en estas tablas. `content_id`
apunta al contenido que reside en el frontend.

## 5. Seguridad y límites de acceso

- Las tablas nuevas tienen RLS habilitado.
- El catálogo `games` puede ser leído por usuarios autenticados.
- Un alumno solo puede crear/leer sus partidas; solo puede cerrar una sesión
  propia que esté `in_progress`.
- Las respuestas solo se pueden insertar en una partida activa del mismo
  usuario. Su lectura se limita al propietario de la sesión.
- No hay permiso para que un alumno vea datos de otro alumno.
- No hay una política docente que habilite lectura de cursos/estudiantes.
- `VUE_APP_SUPABASE_ANON_KEY` es una clave pública de cliente; RLS es la
  frontera de acceso. Nunca incluir `service_role` en el frontend.
- La conexión se configura en `.env.local` durante el desarrollo y en variables
  de entorno de Netlify para producción. `.env.local` no se documenta ni se
  versiona.
- El resultado correcto lo calcula el cliente web; usarlo para analítica
  formativa es posible, pero no asumir que es inviolable.

## 6. Flujo de guardado del progreso

1. Cada componente de juego crea `createGameProgressTracker({ gameId,
   contentId, totalQuestions, mode })`.
2. El tracker inserta una fila `game_sessions` con el usuario Auth actual y
   estado inicial `in_progress`.
3. Al responder, el juego llama `record(response)`. Se inserta una fila
   `game_responses` con `itemId`, respuesta, clasificación e indicador de
   acierto.
4. Un trigger SQL recalcula `answered_count`, `correct_answers` y `score` en
   `game_sessions`.
5. Al completar, el componente llama `complete()`. Al abandonar normalmente,
   el desmontaje del juego llama `abandon()`.
6. En el siguiente ingreso/restauración de sesión, `App.vue` consulta sesiones
   y respuestas propias y arma los objetos que usa el frontend.

Si la app se cierra de forma inesperada, puede quedar una partida
`in_progress`. `cargarProgresoNube()` reconcilia sesiones del propio usuario
con más de 24 horas de antigüedad marcándolas `abandoned`; no cierra partidas
recientes, que pueden corresponder a otra pestaña o dispositivo activo.

### Qué se prueba y qué no

La prueba manual reportada verificó guardado de juego y abandono en Supabase.
Eso confirma el flujo básico en la cuenta usada, no reemplaza pruebas de RLS
entre dos cuentas, escenarios sin conexión, reintentos duplicados, volumen ni
validación de permisos docente.

## 7. Clasificación de conceptos/habilidades

`assessment.js` traduce datos que ya vienen en los ejercicios a pares
`assessment_type` y `assessment_code`:

- Preguntas de conceptos: `basic_concept`, por ejemplo
  `language.noun`, `language.verb`, `language.adjective`,
  `language.adverb`, `language.connector`.
- Comprensión lectora: `reading_skill`, código con prefijo `reading.` derivado
  de la habilidad que proporciona el contenido.
- Trivia: categorías de fundamentos se guardan como `basic_concept`; las
  categorías que contienen habilidades/estrategias lectoras se guardan como
  `reading_skill`.
- Valores no reconocidos de tipo de evaluación se guardan como `other`.

Estos códigos permiten agrupar respuestas para análisis futuro, pero no
definen por sí solos un KPI, una escala de dominio ni una interpretación
diagnóstica. Antes del dashboard docente hay que acordar con la profesora qué
habilidades medir, el significado de cada indicador, ventanas de tiempo y cómo
presentar evidencia suficiente.

## 8. Mapa del código fuente

### Arranque y coordinación

- `src/main.js`: crea la app Vue, importa CSS global y monta `App.vue` en
  `#app`.
- `src/App.vue`: router de pantallas manual y coordinador de autenticación,
  perfil, progreso y navegación. Estado principal: `currentScreen`,
  `playerName`, IDs actuales de contenido, `completedTexts`, `showProgreso`,
  `userProgress`, `usuario`, `perfil`, indicadores y errores de carga.
  Métodos de autenticación: `iniciarAutenticacion`, `entrar`, `entrarConSesion`,
  `salir`, `volverAlLogin`, `irAlPanelDocente`. Métodos de progreso y
  navegación: `loadUserProgress`, `getNextAvailableText`, `goToWelcome`,
  `goToInstructions`, `startGame`, `goToQuestions`, `handleGame1Continue`,
  `goToDragDropRules`, `goToDragDrop`, `handleTryNextText`, `restartGame`,
  `goToProgreso`, `closeProgreso`, `handleStartGame1` a `handleStartGame4`,
  `getNextGame2Text` y `handleTryNextGame2Text`. La pantalla docente es una
  vista provisional.
- `src/components/Navbar.vue`: navegación superior; emite acciones de progreso,
  panel docente y cierre de sesión según props.
- `src/components/pant_login.vue`: vista de login; `acepta` guarda el
  consentimiento local del componente y emite `entrar-google`.
- `src/components/pant_bienvenida.vue`: bienvenida, cuenta de textos y mejor
  puntaje calculados desde sus props (`playerName`, `userProgress`,
  `completedTexts`, `nextTextId`).

### Servicios y lógica compartida

- `src/utils/supabaseClient.js`: lee `VUE_APP_SUPABASE_URL` y
  `VUE_APP_SUPABASE_ANON_KEY`; exporta `supabaseConfigurado` y `supabase`.
- `src/utils/authService.js`:
  - `entrarConGoogle()` abre OAuth.
  - `cerrarSesion()` termina la sesión.
  - `obtenerSesion()` recupera la sesión guardada.
  - `escucharCambiosDeSesion({ alEntrar, alSalir })` escucha cambios y devuelve
    función de cancelación.
  - `cargarPerfil(userId)` busca el perfil.
  - `nombreVisible(perfil, usuario)` resuelve el nombre a mostrar.
  - `esDocente(perfil)` comprueba el rol para la interfaz, no sustituye RLS.
- `src/utils/supabaseProgress.js`:
  - `requireSupabase()` verifica que el cliente exista.
  - `crearSesion({ gameId, contentId, totalQuestions, mode })` inserta una
    sesión de usuario.
  - `guardarRespuesta(sessionId, response)` inserta una respuesta.
  - `cerrarSesion(sessionId, status)` actualiza estado y fechas.
  - `createGameProgressTracker(options)` crea el objeto con `record`,
    `complete` y `abandon`; serializa escrituras pendientes.
  - `cerrarSesionesInterrumpidas(client)` marca abandonadas las sesiones
    propias abiertas por más de 24 horas.
  - `cargarProgresoNube()` descarga sesiones y respuestas y las adapta al
    formato usado por el frontend, incluyendo lista de errores.
- `src/utils/assessment.js`:
  - `toCode(value)` normaliza texto para formar códigos.
  - `keywordQuestionAssessment(question)` clasifica conceptos de Juego 1.
  - `wordSlotAssessment(slot)` clasifica espacios del Juego 2.
  - `readingQuestionAssessment(skill)` asigna código de habilidad lectora.
  - `triviaQuestionAssessment(category)` clasifica preguntas de trivia.
- `src/utils/gameManager.js`: mantiene el sistema de progreso legado y la
  selección/estadísticas del dashboard local. `UNIDADES_CONFIG` define juegos
  disponibles por unidad. `GameManager` usa `playerName` para construir
  `progressKey` de `localStorage`. Métodos: `loadProgress`,
  `saveProgress`, `getJuegosUnidad`, `getJuegosDisponibles`,
  `getJuegosPerfectos`, `seleccionarJuegoInteligente`, `saveGameResult`,
  `registrarIntento`, `generarMensajeResultado`, `getGameTitle`,
  `seleccionarJuegoAlternado`, `calcularProgresoUnidad` y `getEstadisticas`.
  `createGameManager(playerName)` crea la instancia; `validateGameData` valida
  datos de juego. No confundir este almacenamiento/local KPI legado con la
  persistencia canónica nueva de Supabase.
- `src/utils/eventBus.js`: crea y exporta `emitter` de `mitt` para eventos
  entre componentes (respuesta, feedback y fin de juego).
- `src/utils/geminiClient.js`: cliente de Google Gemini.
  `consultarIA(prompt)` llama al modelo y normaliza errores; `limpiarJSON`
  convierte respuestas JSON; `generarDiagnosticoPersonalizado(resultados)`,
  `generarEjercicioAleatorio(habilidad)` y
  `chatConversacional(mensajeUsuario, historial)` construyen funciones de
  diagnóstico, ejercicios y chat; `esAPIKeyValida()` revisa configuración.
  La clave de Gemini debe tratarse como secreta; una clave incluida en el
  bundle frontend no es un secreto seguro para producción.

### Juegos y pantallas relacionadas

- `src/components/pant_game_1.vue`: preguntas de conceptos clave. Computed:
  texto, preguntas, pregunta actual, avance y puntaje. Métodos:
  `selectAnswer`, `nextQuestion`, `checkNextText`, `saveProgress`,
  `saveProgressLegacy`, `getOptionClass`, `getOptionBg`, `goToProgreso`,
  `irASiguienteTexto`, `savePlayerName` y `playSound`. Registra respuestas con
  evaluación de conceptos y crea/cierra una sesión.
- `src/components/pant_game_2.vue`: clasificación drag-and-drop. Mantiene
  datos del texto, espacios, palabras, intentos/vidas, progreso y tracker.
  Métodos principales: `loadTextData`, `iniciarArrastre`, `soltarPalabra`,
  `mostrarRetroalimentacion`, `verificarFinJuego`, `guardarProgresoGame2`,
  `mostrarPista`, `reiniciarJuego`, `irAMiProgreso`, `irASiguienteTexto` y
  `continuarJuego`; también gestiona sonidos, clases y animaciones.
- `src/components/pant_game_3.vue`: comprensión lectora con modos y temporizador.
  Métodos: `iniciarConModo`, `iniciarTimer`, `abandonarSesionActual`,
  `formatearTiempo`, `cargarTexto`, `seleccionarRespuesta`, `siguienteTexto`,
  `guardarProgreso`, textos/emoji de resultado, `reintentar` y `volverMenu`.
  Las respuestas se clasifican con la habilidad definida en el contenido.
- `src/components/pant_game_4.vue`: trivia de fundamentos. Estado clave:
  pregunta actual, selección, respuestas por pregunta, cantidad correcta,
  tracker y estado de resultados. Métodos: `iniciarRegistroSesion`,
  `seleccionarRespuesta`, clases de alternativas, `siguientePregunta`,
  `anteriorPregunta`, `finalizarTrivia`, mensajes/recomendaciones,
  `volverAProgreso`, `reiniciarTrivia`, `cerrarJuego` y `elegirJuego`.
- `src/components/pant_reglas_game1.vue`, `pant_reglas_game2.vue` y
  `pant_reglas_game4.vue`: instrucciones previas; emiten inicio y navegación.
- `src/components/pant_instrucciones_game3.vue`: instrucciones y selección de
  modo; métodos `seleccionarModo` e `iniciarJuego`.
- `src/components/mascota.vue`: mascota/ayuda contextual; `helpMessages`,
  `handleMascotClick`, `showHelp`, `closeHelp`, `closeInitialHelp`,
  `showFeedback`, `closeFeedback`, `animateMascot` y watcher
  `currentScreen`.
- `src/components/AsistenteIA.vue`: interfaz del asistente IA; controla
  apertura del chat, clave/configuración, generación de test, selección de
  respuestas y modales. Métodos:
  `verificarAPIKey`, `toggleChat`, `scrollToBottom`, `obtenerHora`,
  `generarTest`, `seleccionarRespuestaTest`, `cerrarModalTest`,
  `cerrarModalDiagnostico`, `seleccionarRespuestaEjercicio`,
  `verificarRespuestaEjercicio`, `cerrarModalEjercicio`.
- `src/components/MiProgreso.vue`: dashboard del alumno existente, con props
  `playerName`, `userProgress`, `isReturningUser`; mantiene estadísticas
  locales, racha, fortalezas/debilidades y `gameManager`. Computed:
  `nivel`, `nivelJugador`, `progresoTotal`, `emojiMotivacional`,
  `efectividadSegura`, `mensajeMotivacional`. Métodos:
  `loadPlayerData`, `resetearEstadisticas`, `calcularRachaDias`,
  `calcularFortalezasYDebilidades`, `getUnidadProgress`, `iniciarUnidad`,
  `handleIAAction`, `initAudio`, `playSound`. Es un dashboard de alumno, no el
  panel de profesora, y requiere revisión para depender completamente de nube.

### Contenido de `src/data/`

- `game1_texts.js`: `game1Texts`, `getTextById`, `getAllTextIds`,
  `getNextText`; textos/títulos del Juego 1.
- `quest_game_keyword.js`: `questionsByText`, `getQuestionsByTextId` y
  `questions`; banco de preguntas del Juego 1.
- `game2_texts.js`: `game2Texts`, `getGame2TextById`, `getAllGame2Texts`,
  `getNextGame2Text`, `validateGame2Text`; ejercicios, espacios y respuestas
  esperadas del drag-and-drop.
- `game3_texts.js`: `game3Texts`, `game3TextIds`, `getGame3Text`,
  `getGame3TextsByType`, `getGame3TextsByDifficulty`; textos, preguntas,
  alternativas y metadatos de evaluación.
- `game4_trivia.js`: `triviaPreguntas`, `getAllTriviaPreguntas`,
  `getPreguntaById`, `getPreguntasPorCategoria`,
  `getPreguntasAleatorias`; banco de trivia.
- `test_diagnostico.js`: objeto `testDiagnostico` para preguntas diagnósticas.

### Assets y configuración

- `src/assets/main.css`: importación/configuración CSS global y Tailwind.
- `src/assets/animations.css`: animaciones compartidas.
- `src/assets/icons/` y `src/assets/img/`: imágenes visuales de la app/juegos.
- `public/`: HTML base y recursos públicos estáticos.
- `package.json`: Vue 3, Supabase JS, Gemini, Mitt, Vue CLI y scripts.
- `netlify.toml`: build `npm run build`, publicación `dist`, servidor local y
  fallback SPA a `index.html`.
- `.env.example`: plantilla sin secretos; conservarla.
- `.env.local`: variables locales; no publicar ni copiar valores en tickets,
  documentación o chats.

## 9. Desarrollo local y validación

Requisitos prácticos: Node.js y npm compatibles con Vue CLI 5.

```powershell
npm install
Copy-Item .env.example .env.local
# Completar .env.local con la URL y anon key del proyecto Supabase.
npm run serve
```

Scripts disponibles:

```powershell
npm run lint
npm run build
```

Para producción, configurar en Netlify las variables `VUE_APP_SUPABASE_URL`,
`VUE_APP_SUPABASE_ANON_KEY` y, solo si se usa el asistente IA,
`VUE_APP_GEMINI_API_KEY`. No poner claves privadas en Vue. OAuth requiere que
la URL de publicación esté configurada en Supabase Auth, tanto como Site URL
como en Redirect URLs cuando corresponda.

La URL de producción reportada por el equipo es
<https://frabjous-mooncake-af96b6.netlify.app/>. Si se cambia el nombre del
sitio en Netlify, actualizar esta referencia, los enlaces compartidos/QR y las
URLs autorizadas de Supabase Auth.

## 10. Historial de persistencia y migraciones Supabase

El repositorio incluye:

- `supabase/migrations/001_profiles.sql`: perfil enlazado con Auth, políticas
  propias, actualización de alias/nombre y trigger de creación de perfil.
- `supabase/migrations/002_game_sessions.sql`: esquema inicial de sesiones,
  índices, RLS y permisos de propietario.
- `supabase/migrations/003_game_progress.sql`: catálogo, estado de sesión,
  respuestas individuales, clasificación, trigger de resumen y políticas.

Según confirmación del equipo el 22-10-2026, se ejecutaron `002_game_sessions`
y `003_game_progress` en Supabase; se crearon tablas/columnas y la prueba manual
de juego y abandono guardó datos correctamente. `profiles` ya existía antes;
que `001_profiles.sql` esté en el repositorio no prueba que se haya ejecutado
esa migración en el proyecto compartido. Antes de modificar el esquema,
comparar el estado remoto con los archivos y crear una migración nueva; no
volver a ejecutar a ciegas scripts sobre un proyecto compartido.

Commits de trabajo publicados en `feature/cesar`:

- `5e0ab67` — propuesta inicial de persistencia de intentos.
- `265c18d` — esquema/flujo de sesiones y respuestas por ítem.

El estado de rama y cualquier cambio local deben comprobarse con `git status`;
esta guía no registra ni publica commits.

## 11. Refinamiento actual de las tarjetas BD y PR

Estas son decisiones de alcance; ajustar los estados en Trello sin atribuir
trabajo que no se implementó:

| Tarjeta | Resultado/definición | Estado recomendado |
| --- | --- | --- |
| BD-01 | Proyecto Supabase compartido y funcional; publicar URL y clave publishable/anon por canal seguro. Nunca compartir `service_role`. | Hecha al confirmar acceso del equipo. Sin commit específico. |
| BD-02 | Aplicar perfiles existentes y migraciones `002` (sesiones) y `003` (catálogo, respuestas, estados, trigger y RLS). No incluye migrar textos ni añadir campos personales/ranking. | Hecha según aplicación y prueba manual reportadas. Commits `5e0ab67`, `265c18d`. |
| BD-03 | Seed de textos estáticos. No se hizo ni se requiere para la persistencia actual; reevaluar si se necesita contenido editable por docente. | Cancelada/fuera del sprint, no marcar como hecha. |
| BD-04 | Contrato técnico: una partida en `game_sessions`, respuestas individuales en `game_responses`, estados completada/abandonada y clasificación preliminar. No equivale a modelo pedagógico validado. | Hecha para los juegos actuales. Commit `265c18d`. |
| BD-05 | Definir cómo medir uso/aceptación con sesiones completadas/abandonadas y respuestas; acordar si los logros locales de `MiProgreso.vue` deben persistirse o bastan métricas derivadas. Agregar eventos de apertura u otra tabla solo si una pregunta del dashboard lo requiere. | Pendiente para el siguiente sprint; no migrada. |
| PR-01 | Los juegos crean sesiones y registran respuestas en Supabase; completar o abandonar conserva el estado y respuestas existentes. | Hecha según prueba manual reportada. Commits `5e0ab67`, `265c18d`. |
| PR-02 | El progreso nuevo se descarga al restaurar/iniciar la sesión de la cuenta. El historial antiguo de `localStorage` no se importó. | Hecha para descarga nueva; migración histórica excluida. Commit `265c18d`. |
| PR-03 | Ranking global eliminado del alcance. | Cancelada; sin commit. |
| PR-04 | Alinear `MiProgreso.vue`, incluyendo sus métricas/logros/racha, con los datos persistidos en nube. Hoy parte de esa lógica sigue local. | Pendiente; no confundir con PR-02 ni con el dashboard docente. |
| PR-05 | Puntaje compuesto originalmente asociado al ranking global. | Cancelada; sin commit. |

No se migraron los logros como registros independientes a Supabase. La UI
existente muestra logros derivados de la lógica local. Las partidas sí permiten
contar actividad de juego y abandonos; no registran un ingreso sin actividad.

### Texto de evidencia sugerido para BD-02 / BD-04 / PR-01

> Se aplicaron `002_game_sessions.sql` y `003_game_progress.sql` al proyecto
> Supabase compartido. Se probó con Google una partida con respuestas y una
> partida abandonada; ambas se reflejaron en `game_sessions` y las respuestas
> contestadas en `game_responses`. El progreso se identifica por la cuenta
> autenticada. Esta validación es manual y no reemplaza una prueba de aislamiento
> entre dos cuentas. No se migraron textos estáticos ni logros independientes.

## 12. Trazabilidad y sprint review

Para cada tarjeta terminada, mantener el hilo de evidencia:

1. Trello: objetivo, criterios de aceptación, estado y bloqueos.
2. Git: commit y PR que cambiaron el código, cuando corresponda.
3. Funcionalidad: demostración en la aplicación o consulta técnica verificable.

En el review, mostrar login, registrar una partida, mostrar las respuestas y
demostrar el abandono. Distinguir lo terminado (persistencia de sesiones y
respuestas) de lo pendiente (alinear `MiProgreso`, definir KPIs pedagógicos,
dashboard docente, cursos/inscripciones y permisos). Una tarjeta configurada o
un commit por sí solos no prueban que una función esté terminada.

## 13. Guía de contexto para otra IA

Al pedir cambios, indicar:

1. Leer primero este documento y luego inspeccionar el código actual involucrado;
   este documento es contexto, no reemplaza la fuente real del código.
2. No imprimir ni solicitar valores de `.env.local`, tokens, correos reales ni
   datos de estudiantes.
3. Mantener estables `games.id`, `assessment_type` y códigos ya persistidos, o
   proponer migración explícita si cambian.
4. No afirmar que existe dashboard docente, acceso por cursos, KPIs
   pedagógicos definitivos, migración del progreso local o validación segura
   del puntaje: no están terminados.
5. Preservar RLS; validar acceso con cuenta propia y ajena antes de abrir
   permisos. La anon key es pública; `service_role` nunca va al frontend.
6. Mantener contenido estático en `src/data/` salvo que una historia aprobada
   cambie el alcance.
7. Al cambiar código, actualizar esta guía solo en secciones afectadas y
   ejecutar lint/build o la validación específica.
