# 📘 MANUAL COMPLETO DE TAREAS — Leo Perfecto

### Todas las épicas, todas las tarjetas, paso a paso

**Equipo:** César, Cristian, Andrés · **Proyecto:** Leo Perfecto · **Plazo:** inicios de noviembre 2026

> **Cómo usar este manual:** busca tu tarjeta por ID. Cada una tiene: **Objetivo** (para qué) → **Conceptos** (lo que necesitas entender) → **Qué revisar en el código** (antes de tocar nada) → **Pasos** (numerados, ejecutables) → **Prompt para la IA** (qué pedirle a Copilot/Gemini) → **Verificación** (cómo saber que quedó listo) → **Errores comunes**.
> Las tarjetas 🔴 son decisiones pendientes: su sección explica qué hay que decidir y cómo abordarlas una vez decididas.

---

# PARTE 0 — GUÍA DE EQUIPO (léanla los 3, una sola vez)

## 0.1 Glosario en lenguaje humano

| Término | Qué es en realidad |
| --- | --- |
| **commit** | Guardar tu trabajo en tu PC con un mensaje ("Ctrl+S con descripción"). No sale de tu computador. |
| **push** | Subir tus commits a GitHub (tu rama en la nube). |
| **pull** | Bajar de GitHub lo que otros subieron. |
| **rama (branch)** | Tu cuaderno personal de trabajo. `develop` = cuaderno compartido. `main` = lo que está en producción (Netlify), no se toca. |
| **merge** | Copiar cambios de un cuaderno a otro. |
| **PR (Pull Request)** | Pedir que tus cambios pasen de tu rama a develop. Otro compañero revisa y aprueba. |
| **Supabase** | Servicio que da base de datos PostgreSQL en la nube + login (incluye Google) + API automática. Es "el backend listo para usar". Gratis para nuestro volumen. |
| **Contraseña de la BD** | La pide Supabase al crear el proyecto. Es de la Postgres interna; casi no la usaremos. Guardarla en una nota privada. NUNCA en git. |
| **Project URL** | Dirección web de nuestra BD (`https://xxxx.supabase.co`). La usa el front para conectarse. Se comparte solo entre el equipo. |
| **anon key** | Llave pública del frontend. Es seguro que viaje al navegador porque la seguridad real la dan las políticas RLS. Va en `.env.local`, no en git. |
| **service_role key** | Llave MAESTRA que salta todas las reglas. Solo para el script de seed, en local. Jamás en el front ni en git. |
| **game_sessions** | Tabla donde cada fila = un juego terminado por un alumno (quién, qué texto, puntaje, cuándo, detalle de respuestas). Materia prima del dashboard de la profe. |
| **RLS** | Row Level Security: reglas en la BD de quién puede leer/escribir qué filas. Ya vienen escritas en el esquema. |
| **payload (jsonb)** | Columna de la tabla `texts` que guarda el objeto JavaScript completo del texto tal cual está hoy en los .js. La BD se adapta a nuestro código. |
| **DoD** | Definition of Done: checklist que toda tarjeta cumple para cerrarse (funciona en mi rama · probado en celular · no rompe nada · PR aprobado · evidencia en Trello). |
| **Product Backlog** | TODAS las tarjetas del proyecto (30). De ahí se sacan las del Sprint en cada planning. |
| **Sprint Backlog** | Las tarjetas comprometidas para este sprint. |

## 0.2 Setup inicial (una sola vez por persona)

```bash
# 1. Clonar el repo (SOLO este — CAPSTONE es solo documentos/evidencias)
git clone https://github.com/cesarJorquera/leo-perfecto.git
cd leo-perfecto

# 2. Entrar a TU rama (cada uno la suya, NUNCA la de otro)
git checkout feature/cristian      # o feature/andres / feature/cesar

# 3. Instalar y probar que corre
npm install
npm run serve                      # → http://localhost:8080

# 4. Tu identidad para los commits (nombre real + tu correo de GitHub)
git config user.name "Cristian Matus"
git config user.email "tu-correo@ejemplo.com"

# 5. COMPROBAR que quedó (responde tu nombre y correo):
git config user.name
git config user.email
```

**En VS Code:** extensiones → GitHub Copilot (o Gemini Code Assist), GitHub Pull Requests, Tailwind CSS IntelliSense. Abajo a la izquierda se ve la rama actual — **mírenla siempre antes de programar**. Para cambiar de rama: clic ahí → elegir.

**Copilot con cuenta Duoc + commits con cuenta personal:** son independientes. En VS Code inicias sesión en Copilot con la cuenta que tenga el beneficio; git usa su propia configuración (punto 4). No se mezclan.

## 0.3 El ciclo diario 

```bash
# AL EMPEZAR (10 segundos):
git checkout develop        # voy al cuaderno compartido
git pull origin develop     # bajo lo que mis compañeros mergearon
git checkout feature/mia    # vuelvo a MI cuaderno (NUNCA trabajo en develop)
git merge develop           # copio lo nuevo a mi cuaderno → evita conflictos grandes después

# TRABAJAR (commits frecuentes con ID de tarjeta):
git add .
git commit -m "BD-01: crear proyecto supabase"

# AL TERMINAR (respaldar en la nube):
git push origin feature/mia
```

**¿Por qué cada día?** Porque si Andrés mergea su tarjeta el lunes y tú no sincronizas hasta el viernes, tu rama quedó 4 días atrás y el merge final duele. Sincronizando a diario, los conflictos son chicos o nulos. **Regla de oro: cada día empieza con pull/merge y termina con push.**

## 0.4 Pull Requests: crear, revisar, aprobar

**Crear (autor):**

1. `git push` de tu rama → GitHub muestra aviso amarillo → **"Compare & pull request"**
2. Verificar que diga `base: develop ← feature/tu-nombre` (NUNCA hacia main)
3. Título: `BD-01 · Crear proyecto Supabase` → Create → avisar en el grupo

**Revisar y aprobar (otro compañero):**

1. Abrir el PR → pestaña **"Files changed"** (verde = agregado, rojo = borrado)
2. Preguntarse: ¿entiendo qué hace? ¿hay keys o contraseñas pegadas? ¿borra algo que no debería?
3. Si está bien: **"Review changes" → "Approve" → Submit** → **"Merge pull request"**
4. Si hay algo raro: comentar en la línea exacta → **"Request changes"** → el autor corrige y se re-revisa
5. Después del merge, todos: `git checkout develop && git pull`

## 0.5 Trabajar con la IA sin que nos haga daño

1. La IA es un junior rápido: **tú le das la tarea bien explicada, tú revisas el resultado**
2. Tareas chicas: "haz X en este archivo" — NO "hazme toda la feature"
3. **Siempre revisar el diff** (verde/rojo) antes de aceptar
4. Si toca archivos que no pediste → rechazar y dar instrucción más acotada
5. Nunca pegar keys/contraseñas en el chat de la IA
6. Si la IA falla 2 veces seguidas en lo mismo → pedir ayuda al equipo/asesor en vez de iterar a ciegas

**Modo de uso:** panel de chat de Copilot → modo **Agent** → pegar el "Prompt para la IA" de la tarjeta → revisar cambios → aceptar/rechazar → probar con `npm run serve`.

---

---

# ÉPICA 1 — BASE DE DATOS 

## BD-01 · Crear proyecto Supabase 🟢 (2 h)

**Objetivo:** tener la base de datos real en la nube, con las llaves compartidas al equipo.

**Conceptos:** leer glosario — Project URL, anon key, service_role key, contraseña de BD.

**Pasos:**

1. Entrar a supabase.com → "Start your project" → iniciar sesión con GitHub
2. "New project" → Name: `leo-perfecto` → **Database Password: clic "Generate" y guardarla YA en una nota privada** (no se puede recuperar después, solo resetear) → Region: la más cercana a Chile disponible → Plan Free
3. Esperar ~2 min a que se cree
4. Menú → **Settings → API**: copiar y enviar al WhatsApp del equipo (NO git): Project URL, anon public key, service_role key (etiquetada "SOLO SEED — NUNCA EN EL FRONT")
5. Settings → Team → Invite: agregar a los otros 2 con sus correos

**Verificación:** los 3 entran al dashboard de Supabase y ven el proyecto.
**Errores comunes:** no guardar la contraseña (→ se resetea en Settings → Database); compartir keys por git (→ nunca).

## BD-02 · Ejecutar esquema SQL ajustado 🟢 (1 h · depende de IN-01)

**Objetivo:** crear las 12 tablas, con 2 ajustes al esquema original.

**Conceptos:** el ajuste clave — nuestros 3 juegos tienen estructuras distintas (keywords / drag&drop / alternativas), así que `texts` guarda el objeto completo en una columna `payload jsonb` en vez de columnas rígidas. La BD se adapta al código.

**Pasos:**

1. En VS Code abrir `supabase/migrations/initial_schema.sql`
2. Buscar el bloque `create table texts` y reemplazarlo completo por:

```sql
create table texts (
  id bigint primary key generated always as identity,
  game_id bigint not null references games (id),
  text_key text unique not null,
  title text not null,
  difficulty text,
  payload jsonb not null,
  is_active boolean default true,
  created_at timestamp default now()
);
```

3. Commit: `BD-02: ajustar tabla texts a payload jsonb` → push → PR → merge
4. Supabase → **SQL Editor** → "New query" → pegar TODO el archivo → **Run**
5. Ejecutar el parche (columnas que la profe necesita para sus KPIs):

```sql
alter table profiles
  add column genero text check (genero in ('masculino','femenino','otro','prefiero_no_decir')),
  add column edad int check (edad between 10 and 100),
  add column rol text not null default 'estudiante' check (rol in ('estudiante','docente')),
  add column mostrar_en_ranking boolean not null default true;
```

6. **Table Editor** → verificar las 12 tablas: instituciones, carreras, cursos, profiles, inscripciones, games, texts, game_sessions, achievements, user_achievements, daily_streak, ai_simplificaciones

**Verificación:** captura del Table Editor → tarjeta Trello.
**Errores comunes:** ejecutar el script 2 veces (da "already exists" → borrar las tablas y re-ejecutar, o ejecutar solo lo que falta); error de sintaxis → leer el mensaje, dice la línea.

## BD-03 · Seed: migrar los 52 textos a la BD 🟢 (3 h · depende de BD-02)

**Objetivo:** que `texts` contenga los textos que hoy viven hardcodeados en `src/data/`.

**Qué revisar en el código (15 min, solo mirar):**

- `src/data/game1_texts.js` → array `[{ id:'text1', title, difficulty, content, keywords[] }, ...]`
- `src/data/game2_texts.js` → objeto `{ drag1: {...}, drag2: {...} }`
- `src/data/game3_texts.js` → objeto `{ comp1: {...} }` (con `titulo` y `dificultad`, sin tilde en el nombre de las claves de juego 1)

**Pasos:**

1. SQL Editor → insertar los tipos de juego:

```sql
insert into games (codigo, nombre, descripcion) values
  ('keywords', 'Palabras Clave', 'Identifica sustantivos, verbos, adjetivos y conectores'),
  ('dragdrop', 'Clasificar Palabras', 'Arrastra cada palabra a su categoría'),
  ('comprension', 'Comprensión Lectora', 'Preguntas de comprensión por habilidad');
```

2. Repo, tu rama: `npm install @supabase/supabase-js` → crear `scripts/seed.mjs`:

```js
import { createClient } from '@supabase/supabase-js'
import { game1Texts } from '../src/data/game1_texts.js'
import { game2Texts } from '../src/data/game2_texts.js'
import { game3Texts } from '../src/data/game3_texts.js'

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY   // llave maestra — SOLO local
)

// Verificar los IDs reales con: select * from games
const filas = [
  ...game1Texts.map(t => ({ game_id: 1, text_key: t.id, title: t.title, difficulty: t.difficulty, payload: t })),
  ...Object.values(game2Texts).map(t => ({ game_id: 2, text_key: t.id, title: t.title, difficulty: t.difficulty ?? null, payload: t })),
  ...Object.values(game3Texts).map(t => ({ game_id: 3, text_key: t.id, title: t.titulo, difficulty: t.dificultad, payload: t }))
]

const { error } = await supabase.from('texts').upsert(filas, { onConflict: 'text_key' })
console.log(error ? `❌ ${error.message}` : `✅ ${filas.length} textos cargados`)
```

3. Exportar las variables de entorno en la terminal (o .env temporal) → `node scripts/seed.mjs`
4. Verificar en SQL Editor:

```sql
select g.codigo, count(*) from texts t join games g on g.id = t.game_id group by g.codigo;
-- esperado: keywords 12 · dragdrop 10 · comprension 30
```

**Verificación:** la consulta da 12/10/30 + abrir un texto y comprobar que `payload` tiene el objeto completo.
**Prompt IA (si falla):** *"Tengo este script Node .mjs que importa 3 archivos de datos ESM de un proyecto Vue CLI e inserta en Supabase. Error: [pegar]. ¿Cómo lo corrijo sin cambiar la estructura de datos?"*

## BD-04 · Formato de game_sessions 🟢 (1 h de diseño · César)

**Objetivo:** definir QUÉ se guarda cada vez que un alumno termina un juego — es el contrato entre quien guarda (PR-01) y quien lee (el dashboard futuro).

**Regla de negocio (decidida):** se guarda SOLO al terminar (`completed=true`). Abandonos no se registran este sprint (mejora futura).

**Pasos:**

1. Revisar `gameManager.js`: qué datos hay disponibles al terminar un juego (puntaje, correctas, tiempo, textId, gameId)
2. Documentar el formato en la tarjeta Trello y como comentario en `supabase/migrations/`:

```js
{
  user_id: '<uuid del logueado>',
  game_id: 1,                  // 1=keywords 2=dragdrop 3=comprension
  text_id: 7,                  // id numérico de texts
  tipo_intento: 'practica',
  completed: true,
  score: 85,                   // 0-100
  ended_at: 'ahora',
  answers: {                   // jsonb — el detalle para el dashboard
    correctas: 4, total: 5, tiempo_segundos: 120,
    habilidad: 'Identificar Idea Principal',  // solo juego 3 la trae; 1 y 2: null
    detalle: [ /* respuestas individuales si el juego las tiene */ ]
  }
}
```

3. Revisarlo juntos en la daily: los 3 deben entenderlo

**Verificación:** el formato está escrito y los 3 lo entienden.

## BD-05 · Métricas de uso: visitas a la app 🟡 (2 h · Sprint 2)

**Objetivo:** responder "cuántos usan el sistema" (registrados vs. visitantes).

**Pasos (cuando entre al sprint):**

1. Crear tabla simple:

```sql
create table app_events (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id),   -- null si no logueado
  evento text not null,                     -- 'abrir_app'
  created_at timestamp default now()
);
```

2. En `App.vue` al cargar: un insert silencioso `{ evento: 'abrir_app' }` (con try/catch)
3. El dashboard contará: usuarios registrados (profiles), usuarios que jugaron al menos 1 vez (game_sessions), visitas totales (app_events)

**Verificación:** abrir la app 3 veces → 3 filas en app_events.

---

# ÉPICA 2 — CUENTAS Y ACCESO (dueño: Cristian)

## CU-01 · Conectar Supabase al frontend 🟢 (2 h · depende de BD-01)

**Objetivo:** que la app pueda hablar con Supabase.

**Conceptos:** `.env.local` = archivo de secretos locales (NO se sube a git). Vue CLI exige que las variables empiecen con `VUE_APP_`.

**Pasos:**

1. Tu rama actualizada → `npm install @supabase/supabase-js`
2. Crear/editar `.env.local` en la raíz:

```javascript
VUE_APP_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VUE_APP_SUPABASE_ANON_KEY=eyJ...anon-key...
```

3. Verificar que `.env.local` está en `.gitignore` (abrir el archivo y buscar la línea)
4. Crear `src/utils/supabaseClient.js`:

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.VUE_APP_SUPABASE_ANON_KEY
)
```

5. Prueba de humo temporal en `App.vue` (`created()`):

```js
import { supabase } from '@/utils/supabaseClient'
// ...
const { data, error } = await supabase.from('games').select()
console.log('Juegos desde Supabase:', data, error)
```

→ F12 en el navegador: deben llegar los 3 juegos. Luego borrar la prueba.

6. Netlify → Site settings → Environment variables → agregar las mismas 2 (si no, el deploy queda sin conexión)

**Verificación:** consola muestra los 3 juegos; `git status` NO lista `.env.local`.

## CU-02 · Login con Google 🟢 (4 h · depende de CU-01)

**Objetivo:** reemplazar la pantalla de "ingresa tu nombre" por login Google. La mitad del tiempo es configuración en Google Cloud, no código.

**Parte A — Google Cloud + Supabase (1-1,5 h, seguir tutorial oficial de Supabase):**

1. Supabase → **Authentication → Providers → Google** → activar → copiar la **Callback URL** que muestra
2. console.cloud.google.com → crear proyecto "leo-perfecto" → **APIs & Services → OAuth consent screen** → External → nombre de app y correo
3. **Credentials → Create Credentials → OAuth client ID** → tipo "Web application" → Authorized redirect URIs: pegar la Callback URL de Supabase
4. Copiar Client ID y Client Secret → pegarlos en Supabase → Save

**Parte B — Código (2-3 h):**

1. Crear `src/components/pant_login.vue`: mobile-first, nombre/logo Leo Perfecto, frase ("Aprende comprensión lectora jugando"), checkbox "Acepto que mis datos de juego se guarden con fines educativos" (obligatorio), botón "Entrar con Google" (deshabilitado hasta marcar checkbox)
2. En `App.vue`: nuevo estado `currentScreen = 'login'` cuando NO hay sesión:

```js
import { supabase } from '@/utils/supabaseClient'

async created() {
  const { data: { session } } = await supabase.auth.getSession()
  this.currentScreen = session ? 'welcome' : 'login'
  supabase.auth.onAuthStateChange((event, session) => {
    this.currentScreen = session ? 'welcome' : 'login'
    if (session) this.cargarPerfil(session.user.id)
  })
}
```

3. Botón:

```js
async entrarConGoogle() {
  await supabase.auth.signInWithOAuth({ provider: 'google' })
}
```

4. **El nombre del jugador:** hoy `playerName` viene de localStorage. Ahora sale del perfil (`alias_publico` o nombre de Google). Buscar en `App.vue` dónde se guarda/lee el nombre actual y reemplazarlo por el del perfil.
5. Tras el primer login, el trigger de la BD crea el perfil solo → verificar en Table Editor → `profiles`

**Verificación:** flujo completo en PC y celular: login → bienvenida con tu nombre → perfil existe en la tabla. Capturas de ambos.
**Errores comunes:** "redirect_uri_mismatch" → la URI de Google no calza exacta con la de Supabase; funciona en local pero no en Netlify → agregar la URL de Netlify a las URIs autorizadas en Google Cloud.

## CU-03 · Sesión persistente + logout 🟢 (1-2 h · depende de CU-02)

**Objetivo:** que el alumno no se loguee cada vez.

**Conceptos:** Supabase persiste la sesión en el navegador automáticamente — si CU-02 usa `getSession()` al cargar, esto ya casi está hecho.

**Pasos:**

1. Verificar: cerrar el navegador completo → reabrir la URL → entra directo a bienvenida (sin login)
2. Botón "Cerrar sesión" en la bienvenida:

```js
async cerrarSesion() {
  await supabase.auth.signOut()
  // onAuthStateChange detecta el cambio y vuelve a 'login' solo
}
```

3. Probar en celular también (cerrar la app del navegador y volver)

**Verificación:** reabrir tras cerrar → entra directo; logout → vuelve a login.

## CU-04 · Rol docente: la puerta 🟢 (1 h · depende de CU-02)

**Objetivo:** que la app distinga docente de estudiante. **Solo la puerta** — el panel es Sprint 2.

**Conceptos (importante, seguridad):** TODO registro con Google crea perfil `rol='estudiante'`. Nadie elige ser docente al registrarse (si no, cualquier alumno se daría el rol y vería datos de otros). El ascenso lo hace un admin por SQL, una vez por profesora.

**Pasos:**

1. Entrar con una cuenta Google de prueba → anotar su `alias_publico` de la tabla `profiles`
2. Ascenderla (SQL Editor):

```sql
update profiles set rol = 'docente' where alias_publico = 'el-alias-de-prueba';
```

3. En `App.vue`, la función `cargarPerfil`:

```js
async cargarPerfil(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  this.perfil = data
}
```

4. En la bienvenida: `<button v-if="perfil?.rol === 'docente'">Panel docente</button>` → lleva a pantalla simple "Próximamente: tu panel"

**Verificación:** cuenta docente ve el botón; cuenta alumno no ve nada nuevo.

## CU-05 · QR de acceso 🟢 (1 h · todos, al final del sprint)

**Pasos:**

1. Generar QR hacia la URL de Netlify (cualquier generador online gratuito) → descargar PNG
2. Guardar en `docs/qr-acceso.png` + agregarlo al README
3. Probarlo escaneándolo con 2 celulares distintos

## CU-06 · Perfil del alumno: alias y privacidad 🟡 (3 h · Sprint 2)

**Objetivo:** el alumno controla su identidad pública.

**Conceptos:** Google entrega nombre y correo REALES (eso queda privado, solo lo ve el sistema). El **alias público** es lo que se muestra en el ranking y en el dashboard de la profe — nadie ve datos reales de otros. Género y edad son opcionales y solo alimentan los KPIs anonimizados de la profe.

**Pasos (cuando entre al sprint):**

1. Pantalla "Mi perfil": muestra nombre real (solo visible para uno mismo), y permite editar: alias público, avatar (emoji de una lista, simple), género (select), edad (número), toggle "Aparecer en el ranking"
2. Guardar: `supabase.from('profiles').update({ alias_publico, genero, edad, mostrar_en_ranking }).eq('id', userId)`
3. Validar alias único (la BD ya lo exige con `unique` → mostrar mensaje amigable si está tomado)
4. Entrada: ícono de perfil en la bienvenida

**Verificación:** cambiar alias → se refleja en ranking y dashboard; alias repetido → mensaje amigable.

---

# ÉPICA 3 — PROGRESO EN LA NUBE (dueño: César)

## PR-01 · Guardar sesión de juego en Supabase 🟢 (4 h · depende de BD-02, CU-02, BD-04)

**Objetivo:** cada juego terminado = una fila en `game_sessions` con el formato BD-04. **Sin romper nada:** localStorage sigue igual (respaldo).

**Qué revisar en el código (30 min):**

1. `src/utils/gameManager.js` → buscar `saveProgress` / `localStorage.setItem` → ¿qué datos hay al terminar un juego?
2. `pant_game_1.vue`, `pant_game_2.vue`, `pant_game_3.vue` → ¿cada juego llama a gameManager o guardan por su cuenta? (define si hay 1 punto de escritura o 3)

**Pasos:**

1. Crear `src/utils/supabaseProgress.js`:

```js
import { supabase } from './supabaseClient'

let mapaJuegos = null    // { 'keywords': 1, 'dragdrop': 2, ... }
let mapaTextos = null    // { 'text1': 7, 'drag1': 12, ... }

async function cargarMapas() {
  if (!mapaJuegos) {
    const { data } = await supabase.from('games').select('id, codigo')
    mapaJuegos = Object.fromEntries(data.map(g => [g.codigo, g.id]))
  }
  if (!mapaTextos) {
    const { data } = await supabase.from('texts').select('id, text_key')
    mapaTextos = Object.fromEntries(data.map(t => [t.text_key, t.id]))
  }
}

export async function guardarSesion({ gameCodigo, textKey, score, answers }) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return                       // sin login → solo localStorage, no pasa nada
    await cargarMapas()
    const { error } = await supabase.from('game_sessions').insert({
      user_id: session.user.id,
      game_id: mapaJuegos[gameCodigo],
      text_id: mapaTextos[textKey],
      tipo_intento: 'practica',
      completed: true,
      score,
      ended_at: new Date().toISOString(),
      answers
    })
    if (error) console.warn('No se pudo guardar en la nube:', error.message)
  } catch (e) {
    console.warn('Supabase no disponible, progreso solo local:', e)
  }
}
```

2. En `gameManager.js`: justo después del guardado en localStorage al terminar un juego → llamar `guardarSesion({...})` con el formato BD-04
3. Si los 3 juegos guardan por su cuenta → interceptar los 3 puntos o centralizar en un solo método
4. Probar: con sesión iniciada, jugar un texto completo → Table Editor → `game_sessions` → debe aparecer la fila

**Verificación:** 3 filas de prueba (una por juego) + modo avión: el juego NO se cae (try/catch absorbe).
**Prompt IA:** *"Tengo este método de gameManager.js que guarda progreso en localStorage: [pegar]. Quiero que DESPUÉS llame a esta función: [pegar guardarSesion]. Cambio mínimo, explícame cada línea."*

## PR-02 · Cargar progreso + migración única 🟢 (3 h · depende de PR-01)

**Objetivo:** el progreso viejo en localStorage no se pierde al crear cuenta.

**Pasos:**

1. En `supabaseProgress.js` agregar:

```js
export async function cargarProgresoNube() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  const { data } = await supabase.from('user_progress').select('*')
  return data
}

export async function migrarProgresoLocal() {
  if (localStorage.getItem('leo-perfecto-migrated')) return
  // 1. buscar claves 'leo-perfecto-progress-*' en localStorage
  // 2. por cada entrada → guardarSesion() con sus datos
  // 3. si todo OK → localStorage.setItem('leo-perfecto-migrated', 'true')
}
```

2. En `App.vue`, tras login exitoso: `await migrarProgresoLocal()` y luego `await cargarProgresoNube()`
3. **Decisión (mantener simple):** este sprint las pantallas siguen leyendo localStorage; la nube se usa para guardar y para el ranking. "La nube manda" llega en Sprint 2 con el dashboard. Lo visible hoy: el progreso viejo migra y no se pierde.

**Verificación:** usuario con progreso local → primer login → sesiones en Supabase → segundo login → no se duplica (flag).

## PR-03 · Ranking global 🟢 (3 h · depende de PR-01)

**Objetivo:** ranking con datos reales, respetando anonimato.

**Pasos:**

1. Vista (SQL Editor):

```sql
create view ranking_global as
select p.alias_publico,
       coalesce(sum(gs.score), 0) as puntaje_total,
       count(gs.id) as textos_completados
from profiles p
left join game_sessions gs
  on gs.user_id = p.id and gs.completed = true and gs.tipo_intento = 'practica'
where p.mostrar_en_ranking = true
group by p.id, p.alias_publico
order by puntaje_total desc;
```

2. Crear `src/components/pant_ranking.vue`: podio top 3 (🥇🥈🥉), lista del resto, tu posición destacada. Mobile-first (columna simple, números grandes)
3. Botón "Ranking" en la bienvenida
4. Toggle "Aparecer en el ranking" → `update profiles set mostrar_en_ranking`
5. Estado vacío: "¡Sé el primero en el ranking! — Leo"

**Verificación:** 2 cuentas con puntajes distintos → orden correcto; apagar toggle → desaparece.

## PR-04 · Dashboard alumno con datos reales 🟡 (4 h · Sprint 2)

**Objetivo:** MiProgreso.vue y las fortalezas/debilidades de la bienvenida se alimentan de la nube.

**Qué revisar:** `MiProgreso.vue` → qué consulta hace hoy a gameManager/localStorage; qué formato esperan las tarjetas de fortalezas/debilidades.

**Pasos:**

1. En `supabaseProgress.js`, función `cargarMiProgreso()` que traiga de `user_progress` + `game_sessions` del usuario
2. Reemplazar las lecturas locales por las de la nube, con fallback a local si no hay sesión
3. Fortalezas/debilidades: agrupar por `habilidad` (juego 3) y por juego (1 y 2) → promedio por grupo → las 2 más altas = fortalezas, las 2 más bajas = a trabajar

**Verificación:** jugar desde 2 dispositivos con la misma cuenta → el progreso se ve igual en ambos.

## PR-05 · Puntaje compuesto del alumno 🔴 (diseño pendiente)

**Qué decidir primero (equipo + profe):** qué variables componen el "nivel de comprensión lectora" (rendimiento por habilidad, dificultad de textos superados, racha de días). Una vez decidida la fórmula, es una consulta SQL + mostrarlo como nivel/nombre ("Aprendiz → Lector → Maestro").

---

# ÉPICA 4 — PANEL DE LA PROFESORA (Sprint 2)

## PA-01 · Panel docente: estructura base 🟡 (3 h)

**Objetivo:** la pantalla donde vivirá todo lo de la profe.

**Pasos:**

1. Nuevo estado en App.vue: `currentScreen = 'panelDocente'` (solo accesible si `perfil.rol === 'docente'`, ver CU-04)
2. Componente `pant_panel_docente.vue`: barra superior con pestañas "📊 Dashboard" y "📝 Cargar texto", contenido cambia según pestaña
3. Mobile-first: la profe también puede entrar desde el celular

**Verificación:** docente entra y navega entre pestañas (vacías por ahora); estudiante no puede llegar a esa pantalla aunque escriba.

## PA-02 · Dashboard: métricas de uso 🟡 (3 h)

**Objetivo:** responder cuántos usan el sistema.

**Pasos:**

1. Tarjetas de números grandes (KPIs): registrados (`select count(*) from profiles`), activos esta semana (`game_sessions` con `started_at` últimos 7 días, distinct user_id), que han jugado ≥1 juego, total de juegos jugados, visitas (app_events, si BD-05 está)
2. Cada KPI = una consulta desde el front al cargar la pestaña Dashboard
3. Mostrar como tarjetas simples con el número grande + etiqueta

**Verificación:** los números calzan con lo que se ve en el Table Editor.

## PA-03 · Dashboard: rendimiento por habilidad 🟡 (5 h)

**Objetivo:** lo que la profe más quiere: en qué les va bien y mal a sus alumnos.

**Pasos:**

1. Consulta principal (SQL, guardarla como vista `rendimiento_habilidades`):

```sql
select t.payload->>'habilidad' as habilidad,
       avg(gs.score) as promedio,
       count(*) as intentos,
       count(distinct gs.user_id) as alumnos
from game_sessions gs join texts t on t.id = gs.text_id
where gs.completed = true
group by 1 order by promedio desc;
```

2. Gráfico de barras simple (CSS puro o librería liviana) + tabla de alumnos: alias, género, edad, promedio general, textos completados, última actividad (anonimizada: NO correo ni nombre real)
3. Sección "alertas": alumnos sin actividad en 7 días; habilidades con promedio < 60

**Verificación:** con datos de prueba, el gráfico muestra las habilidades del juego 3 con promedios correctos.

## PA-04 · Cargar texto (panel de administración) 🟡 (4 h · depende de JU-04)

**Objetivo:** la profe sube un texto y queda disponible para jugar.

**Qué revisar:** cómo es el `payload` del juego destino (cada juego tiene su formato — ver los .js de data).

**Pasos:**

1. Pestaña "Cargar texto": formulario con → selector de juego destino, título, dificultad, contenido del texto (textarea grande)
2. Según el juego elegido, campos extra: para comprensión → pregunta + 3-4 alternativas + cuál es la correcta + explicación + habilidad
3. Al guardar: insert en `texts` con el `payload` armado en el formato exacto del juego
4. Vista previa antes de publicar + opción `is_active` (desactivar sin borrar)

**Verificación:** la profe sube un texto → aparece jugable en el juego correspondiente.

## PA-05 · Vista detalle por alumno 🔴 (3 h)

Alumno clickeable en el dashboard → su historial: sesiones por fecha, puntajes, habilidades fuertes/débiles. Refinar cuando PA-03 exista.

## PA-06 · Cursos y secciones 🔴 (4 h)

Las tablas ya existen (`cursos`, `inscripciones`). Falta: la profe crea su curso, los alumnos se inscriben (¿con código de curso?), y el dashboard se filtra por curso. **Preguntar a Jimena si lo necesita ya** o si con ver "todos sus alumnos" basta para el piloto.

---

# ÉPICA 5 — JUEGOS (Sprint 2, se diseñan con la profe)

## JU-01 · Juego nuevo: Comprensión Auditiva 🔴 (6 h)

**La visión:** en vez de leer, el alumno ESCUCHA — la app lee en voz alta una pregunta/frase/texto breve y el alumno responde jugando. Siempre lúdico.

**Qué decidir con la profe primero:** ¿qué se escucha exactamente? (¿el texto completo y luego preguntas? ¿solo preguntas sobre un texto leído? ¿frases sueltas con trivia?) y para qué nivel.

**Cómo abordarla una vez decidido:**

1. Prototipo técnico primero (1 h): un botón que lea un texto con Web Speech API (`speechSynthesis`) EN UN CELULAR — probar voces disponibles, velocidad (`rate`), que suene fluido y no robótico. Si la voz del navegador no convence → evaluar alternativa (grabaciones o TTS de pago) — decisión que se escala al equipo
2. Componente `pant_game_auditivo.vue`: texto oculto, botón grande ▶️ escuchar (con repetir), luego la pregunta + alternativas como el juego 3
3. Contenido: reutilizar textos cortos de la BD o crear un set propio

**Verificación:** un alumno puede completar el juego con la pantalla apagada (todo por audio + tocar alternativas).

## JU-02 · Juego nuevo: nivel difícil con textos de la profe 🔴 (6 h · depende de PA-04 y JU-04)

**La visión:** trivia/desafío con textos universitarios reales que carga la profe — el nivel difícil.

**Cómo abordarla:** es el juego 3 (comprensión con alternativas) apuntando a los textos que la profe subió (`texts` donde `game_id` = el nuevo juego). Si el formato de preguntas lo genera la profe al cargar (PA-04 ya pide pregunta/alternativas), este juego es casi solo una pantalla nueva que consume esos textos. Refinar cuando PA-04 esté definida.

## JU-03 · Decidir destino de juegos actuales y juego 4 🔴 (1 h de reunión)

**Decisión de equipo + profe, no de código:** ¿mantener/mejorar/fusionar los 3 juegos? ¿el juego 4 trivia (que está en develop) entra al producto o se congela? Anotar la decisión en Trello y transformarla en tarjetas si implica trabajo.

## JU-04 · Los juegos leen textos desde la BD 🟡 (4 h)

**Objetivo:** que lo que sube la profe (PA-04) aparezca en los juegos.

**Qué revisar:** `pant_game_1/2/3.vue` → cómo importan y usan hoy `game1_texts.js` etc. (buscar `import ... from '../data/...'` y `getTextById`).

**Pasos:**

1. Crear `src/utils/textosService.js`: funciones `getTextosPorJuego(codigo)` y `getTextoPorKey(textKey)` que consultan `texts` y devuelven el `payload` (mismo formato que los .js)
2. En cada pantalla de juego: reemplazar el import estático por la llamada al servicio (con loading + fallback a los .js si la nube falla)
3. Probar los 3 juegos con textos desde la nube

**Verificación:** desactivar un texto en la BD (`is_active=false`) → desaparece del juego; agregar uno nuevo → aparece.

## JU-05 · Diagnóstico inicial con IA 🔴 (5 h · opcional)

Al registrarse, test que ubica al alumno y le dice por dónde partir. Puede generar preguntas con Gemini (con banco de respaldo fijo si la API falla). Es P3: solo si sobra tiempo.

---

# ÉPICA 6 — EXPERIENCIA E INCLUSIÓN

## EX-01 · Mobile-first inmersivo 🔴 (5 h)

**La visión:** al jugar, el juego se apodera de toda la pantalla del celular (sin menús ni distracciones); la mascota Leo ocupa la pantalla para dar feedback/ayudas.

**Cómo abordarla:** primero EX-04 (la auditoría dice qué está roto). Luego por cada juego: layout fullscreen (ocultar navbar al jugar), botones grandes (mín. 44px), textos legibles sin zoom. Probar todo en celular real, no solo emulador.

## EX-02 · Inclusión TEA 🔴 (alcance por definir con la profe)

**Qué presentar a Jimena para que decida (no decidirlo solos):**

- Modo calma: toggle que reduce animaciones y sonidos
- Instrucciones literales y consistentes (mismo botón, mismo lugar, siempre)
- La lectura viva (JU-01) ya es inclusión en sí misma

Una vez que ella elija, cada medida se transforma en tarjeta propia.

## EX-03 · Mascota Leo con IA 🔴 (5 h · próximo sprint)

**Concepto clave:** la app NUNCA depende de la IA para funcionar. Leo sigue con respuestas hardcodeadas como base; la IA solo mejora donde aporta (feedback personalizado), con fallback automático si la API se cae o se satura (30 alumnos en paralelo pueden agotar el plan gratis).

**Cómo abordarla:** 1 mini-función (Supabase Edge Function) que esconde la API key → el front le pide a esa función, no a Google directo → si falla, respuesta hardcodeada de Leo.

## EX-04 · Auditoría visual en celular 🟢 (1 h · va con CU-05 al cierre del Sprint 1)

Recorrer TODA la app en celular (cada uno el suyo): anotar en Trello todo lo que se ve mal (botones chicos, textos cortados, drag&drop incómodo). Esa lista es el insumo de EX-01.

---

# ÉPICA 7 — INFRAESTRUCTURA Y CIERRE

## IN-01 · Ordenar repos 🟢 (1 h · Andrés)

**Pasos:**

1. Repo CAPSTONE (web) → carpeta `leo-perfecto-main/supabase/migraciones/` → descargar `initial_schema.sql`
2. Repo leo-perfecto, tu rama: crear `supabase/migrations/` en la raíz → pegar el archivo
3. Commit `IN-01: mover esquema SQL a leo-perfecto` → push → PR a develop
4. En CAPSTONE: eliminar la carpeta `leo-perfecto-main` (commit: "limpieza: el código vive en leo-perfecto")
5. CAPSTONE queda solo con Fase 1 / Fase 2 / documentos

**Regla permanente:** código solo en leo-perfecto · CAPSTONE solo evidencias.

## IN-02 · AGENTS.md 🟢 (1 h · César)

**Objetivo:** que Copilot/Gemini entiendan el proyecto al abrirlo (contexto automático).

**Pasos:** crear `AGENTS.md` en la raíz del repo con: qué es la app (1 párrafo), stack (Vue 3 CLI + Tailwind + Supabase), estructura de carpetas, convenciones (ramas feature/, commits con ID de tarjeta, nunca tocar main/develop directo), reglas (mobile-first, no romper localStorage, la IA nunca es obligatoria). *(El asesor tiene el contenido listo — pedírselo y pegarlo.)*

## IN-03 · Evidencias Fase 2 en CAPSTONE 🟢 (2 h · todos, al cierre del sprint)

Capturas del flujo funcionando, lista de PRs mergeados, foto del tablero Trello, este planning — organizados según la estructura de carpetas que pide el profe (Fase 2).

## IN-04 · Capacitación final a Jimena 🔴 (2 h · al final)

30 min en vivo: cómo entra a su panel, cómo carga un texto, cómo lee su dashboard, qué hacer si algo falla. Grabarla o dejar mini-guía escrita.

## IN-05 · Manuales de entrega 🔴 (4 h · al final)

Manual de usuario (alumno: entrar, jugar, ver progreso / profe: panel, cargar textos, dashboard) + manual técnico breve (arquitectura, tablas, cómo desplegar). Con capturas.

---

# CIERRE — CEREMONIAS

- **Daily escrita** (cada día de trabajo): comentario en la tarjeta o WhatsApp → *ayer / hoy / bloqueo*
- **Planning** (inicio de sprint, 45 min): sacar tarjetas del backlog al sprint, confirmar responsables
- **Review con Jimena** (fin de cada sprint, 30 min): mostrar funcionando EN CELULAR, ella prioriza lo siguiente
- **Retro** (10 min tras la review): qué nos costó, qué cambiamos