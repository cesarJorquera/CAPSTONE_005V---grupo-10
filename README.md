# Leo Perfecto — Proyecto CAPSTONE, Grupo 10

Este repositorio reúne las evidencias del proyecto APT desarrollado para CAPSTONE (PTY4614, sección 005V). **Leo Perfecto** es una aplicación educativa para que estudiantes practiquen comprensión lectora y para que docentes revisen el avance y desempeño lector.

Aplicación publicada: [leo-perfecto.netlify.app](https://leo-perfecto.netlify.app/)

## Repositorios y organización

- Este repositorio contiene las evidencias académicas organizadas por fase.
- El código fuente del sistema está en [`Fase 2/Evidencias Proyecto/Evidencias de sistema/Aplicación`](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20sistema/Aplicaci%C3%B3n).
- El repositorio de desarrollo es [cesarJorquera/leo-perfecto](https://github.com/cesarJorquera/leo-perfecto). La aplicación se integró aquí con `git subtree`, conservando el historial y la autoría de sus commits.
- La [guía técnica y de defensa](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20documentaci%C3%B3n/Manual_Tecnico_y_Guia_de_Defensa_Leo_Perfecto.md) resume arquitectura, datos, seguridad, despliegue y preguntas para la presentación.
- Las carpetas de Fase 1 se conservan como evidencia histórica del proyecto.

## Descripción

**Qué hace.** Leo Perfecto es una aplicación web, pensada principalmente para el celular, en la que el estudiante practica comprensión lectora y conceptos lingüísticos mediante juegos, acompañado por la mascota Leo. Incluye:

- Cuatro juegos: identificación de conceptos clave, clasificación de palabras, comprensión lectora y trivia.
- Rutas de aprendizaje: Unidad 1 “Las palabras” y Unidad 2 “Leer más allá” (siete habilidades lectoras).
- Leo Ideas: dinámica en vivo en la sala, con preguntas proyectadas, código QR y nube de palabras.
- Registro del progreso en la nube asociado a la cuenta del estudiante.
- Espacio docente: Leo Aula (proyección en clases) y Leo Dash (actividad diaria, precisión por habilidad y progreso por estudiante, con datos anonimizados).
- LeoIA: asistente con inteligencia artificial (Gemini); su continuidad depende de la decisión de la clienta.

**A quién va dirigido.** A estudiantes que necesitan practicar y reforzar la comprensión lectora, y a la docente que acompaña su avance.

**Qué problema resuelve.** La práctica de comprensión lectora suele ser poco atractiva y difícil de seguir para la docente. Leo Perfecto ofrece práctica breve y motivadora desde el celular y le entrega a la docente información sobre la actividad y el desempeño por habilidad, para que pueda orientar el trabajo en clases.

## Innovación y valor agregado

La propuesta combina práctica lectora gamificada, una ruta progresiva por habilidades y un panel docente que resume actividad y precisión. Su valor no depende de una tecnología aislada: busca que el estudiante practique con retroalimentación y que la docente pueda usar evidencia de actividad para orientar el trabajo en clases. Las métricas actuales son técnicas y deben validarse pedagógicamente con la profesora antes de interpretarlas como dominio lector.

## Tecnologías utilizadas

| Área | Tecnología |
|---|---|
| Frontend | Vue.js 3 (Options API) con Vue CLI 5 |
| Navegación | Vue Router 4.5 |
| Estilos | Tailwind CSS 2.2 + PostCSS |
| Backend como servicio | Supabase: autenticación con Google (OAuth), PostgreSQL con seguridad por fila (RLS), funciones SQL (RPC) y Realtime |
| Cliente de datos | supabase-js |
| Inteligencia artificial | API de Gemini (`@google/generative-ai`) |
| Otras librerías | mitt (eventos entre componentes), qrcode (QR de Leo Ideas), Web Audio API (sonidos) |
| Despliegue | Netlify |
| Calidad | ESLint, build de producción y pruebas manuales en celular |
| Gestión | Trello y GitHub (ramas y pull requests) |

## Ejecución local

Requiere Node.js y npm (se probó con Node.js 22). En PowerShell:

Configura en `.env.local` las variables `VUE_APP_SUPABASE_URL` y `VUE_APP_SUPABASE_ANON_KEY` con los valores autorizados del proyecto. No agregues credenciales al repositorio.

```powershell
npm run serve
```

Pasos completos:

1. Clona este repositorio y entra a la carpeta de la aplicación:

   ```powershell
   git clone https://github.com/cesarJorquera/CAPSTONE_005V---grupo-10.git
   cd "CAPSTONE_005V---grupo-10/Fase 2/Evidencias Proyecto/Evidencias de sistema/Aplicación"
   ```

2. Instala las dependencias:

   ```powershell
   npm install
   ```

3. Crea el archivo `.env.local` en esa misma carpeta:

   ```
   VUE_APP_SUPABASE_URL=<url del proyecto Supabase>
   VUE_APP_SUPABASE_ANON_KEY=<clave pública (anon) del proyecto>
   VUE_APP_GEMINI_API_KEY=<clave de Gemini, solo si se usará LeoIA>
   ```

   Usa solo la clave pública (anon); la clave `service_role` nunca debe ir en el frontend.

4. Inicia el servidor de desarrollo con `npm run serve` y abre `http://localhost:8080`.

5. Opcional: `npm run lint` revisa el código y `npm run build` genera la carpeta `dist/` para producción.

Para reconstruir la base de datos en un proyecto Supabase nuevo, ejecuta en orden las migraciones de `supabase/migrations` (001 a 006) desde el SQL Editor. El inicio de sesión requiere habilitar el proveedor Google en Supabase Auth.

## Equipo 

Los roles son fluidos: los tres integrantes desarrollan e integran código.

- **César Jorquera:** Líder técnico. Configuración del repositorio y del entorno, persistencia del progreso en Supabase, ruta de la Unidad 2 y panel docente Leo Dash.
- **Andrés Quiroz:** Product Owner. Diseño e implementación de la interfaz y de la mascota Leo, navegación con Vue Router y Lectura Viva.
- **Cristian Matus:** Scrum Master. Conexión con Supabase, inicio de sesión con Google y rol docente, Leo Ideas, espacio docente y ruta de la Unidad 1.

Docente guía: Carlos Quintanilla.

## Metodología

Se trabajó de forma iterativa con prácticas de Scrum: planificación del trabajo, desarrollo por tareas, revisión de avances y ajustes según retroalimentación.

- **Justificación:** los sprints permiten entregar incrementos pequeños y revisar pronto con la docente un producto cuyo contenido, métricas y experiencia de uso se refinan con retroalimentación.
- **Enfoque:** la Fase 1 propuso una metodología híbrida (análisis y diseño tradicionales, con EDT y carta Gantt). En la Fase 2 el equipo trabaja con Scrum en sprints de dos semanas.
- **Ceremonias:** Sprint Planning con los tres integrantes y un Sprint Goal expresado en valor para el usuario, Daily con cuatro preguntas (avance hacia la meta, bloqueos, decisiones y plan), Sprint Review y registro de impedimentos con su impacto y la decisión tomada.
- **Tablero Trello:** tarjetas con código por épica (CU cuentas, BD base de datos, PR progreso, JU juegos, U2 Unidad 2, PA panel docente, UI interfaz, EX inclusión, BUG, MEJ), con responsable, criterios de aceptación y evidencia.
- **Definición de terminado:** funciona en la rama, probado en celular, lint y build correctos, integrado a `develop` mediante pull request y con evidencia en la tarjeta.
- **Control de versiones:** `main` como respaldo, `develop` para integración y ramas personales `feature/<nombre>`; los cambios llegan a `develop` mediante pull request.

## Arquitectura

La aplicación Vue.js se ejecuta en el navegador y se despliega en Netlify. Se conecta a Supabase para autenticación y almacenamiento en PostgreSQL; las políticas de acceso y las suscripciones de tiempo real permiten consultar y actualizar la actividad. El código y las migraciones versionadas están dentro de la carpeta **Aplicación**.

```
 Navegador (celular o escritorio)
 └── SPA Vue 3 + Vue Router + Tailwind  ── publicada en Netlify
        │ supabase-js                      │ @google/generative-ai
        ▼                                  ▼
 Supabase                               API de Gemini (LeoIA)
 ├── Auth: inicio de sesión con Google
 ├── PostgreSQL: profiles, games, game_sessions, game_responses (con RLS)
 ├── Funciones RPC del panel docente (datos anonimizados)
 └── Realtime: actualización en vivo de Leo Ideas y del panel
```

- **Sin servidor propio:** la seguridad se aplica en la base de datos con RLS. Un estudiante solo crea y lee sus propias partidas y respuestas, y el rol docente se asigna solo por SQL.
- **Modelo de datos:** cada actividad es una sesión (`game_sessions`) y cada respuesta una fila (`game_responses`) con intento, código de habilidad y si fue correcta. El contenido de los juegos vive en el frontend (`src/data`) y la base guarda solo su referencia.
- **Panel docente:** consulta datos mediante funciones SQL que verifican el rol y devuelven etiquetas “Jugador N”, sin nombres ni identificadores.
- **Migraciones:** `supabase/migrations` (001 a 006) permite reconstruir el esquema completo.
- **Documentación técnica detallada:** `docs/proyecto.md` dentro de la carpeta **Aplicación**.
