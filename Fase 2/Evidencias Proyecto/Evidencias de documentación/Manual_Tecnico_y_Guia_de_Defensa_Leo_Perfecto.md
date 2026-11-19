# Manual técnico y guía de defensa — Leo Perfecto

**Proyecto:** CAPSTONE, sección 005V, Grupo 10
**Actualizado:** 19-11-2026
**Aplicación pública:** <https://leo-perfecto.netlify.app/>

Este documento explica la arquitectura que implementa el código actual y sirve como material de estudio para la defensa. Si una función, permiso o despliegue no se ha probado en el entorno remoto, se indica como verificación pendiente y no debe presentarse como comprobado.

## 1. Explicación técnica en 40 segundos

Leo Perfecto es una aplicación web de una sola página construida con Vue 3. Netlify publica los archivos estáticos generados por Vue CLI. El navegador usa Supabase para autenticar a los usuarios y guardar sesiones de juego y respuestas en PostgreSQL. Las políticas RLS restringen el acceso a los datos; para el dashboard, funciones SQL comprueban el rol docente y entregan datos agregados con etiquetas como “Jugador 1”. No mantenemos un servidor de aplicación propio. El contenido de los juegos está versionado en el frontend y Gemini es una integración opcional de LeoIA.

## 2. Arquitectura de despliegue

```text
Desarrollo y revisión
GitHub (pull requests y rama de publicación configurada)
                 │
                 ▼
Netlify: npm run build  ── publica dist/ y aplica fallback SPA
                 │
                 ▼
Navegador: aplicación Vue 3 + Vue Router + Tailwind CSS
     │                         │
     │ supabase-js             └── API Gemini (opcional: LeoIA)
     ▼
Supabase
├── Auth: identidad y sesión
└── PostgreSQL: perfiles, juegos, sesiones y respuestas
    ├── RLS: políticas de acceso por fila
    └── RPC docente: métricas agregadas y actividad diaria
```

La aplicación es cliente-servidor: el navegador contiene la interfaz y se conecta directamente a los servicios administrados de Supabase. Netlify entrega el frontend estático; no ejecuta la lógica de negocio en un servidor Node propio. `netlify.toml` define el comando de compilación, la carpeta `dist/` y la redirección necesaria para las rutas de la SPA.

## 3. Tecnologías y razón de uso

| Tecnología | Responsabilidad en el proyecto |
|---|---|
| Vue 3 | Componentes y estado de las pantallas y minijuegos. |
| Vue Router | Rutas de la aplicación y navegación entre secciones. |
| Tailwind CSS | Estilos y adaptación de la interfaz a distintos tamaños. |
| Supabase Auth | Inicio de sesión con Google e identidad del usuario. |
| PostgreSQL y supabase-js | Persistencia de perfiles, sesiones y respuestas. |
| RLS y funciones SQL RPC | Aplicar permisos en la base de datos y entregar datos del dashboard. |
| Netlify | Publicar la aplicación estática a partir del build. |
| Gemini | Funciones opcionales de asistencia con IA en LeoIA. |

Se eligió Supabase para contar con autenticación y PostgreSQL administrados sin construir un backend propio. Esto reduce infraestructura que mantener, pero hace esencial diseñar y verificar correctamente RLS y las funciones SQL.

## 4. Modelo de datos

```text
auth.users 1 ── 1 profiles
auth.users 1 ── N game_sessions
games      1 ── N game_sessions
game_sessions 1 ── N game_responses
```

- **`profiles`** vincula un usuario autenticado con su nombre de perfil y rol.
- **`games`** mantiene identificadores estables para los juegos y su unidad.
- **`game_sessions`** representa una actividad de un usuario: juego, contenido, estado, fechas y resumen.
- **`game_responses`** registra cada respuesta e intento asociado a una sesión, incluyendo su clasificación técnica y resultado.

Una sesión puede tener varias respuestas. Las claves foráneas mantienen las relaciones y los triggers de la base recalculan algunos resúmenes de sesión. El texto y las preguntas de los juegos se mantienen en el frontend, bajo `src/data/`; no se almacenan como contenido editable en la base.

## 5. Flujos que deben poder explicar

### Inicio de sesión

1. El usuario inicia el flujo OAuth con Google mediante Supabase Auth.
2. Supabase devuelve la sesión a una URL de retorno autorizada.
3. La aplicación carga el perfil asociado a la identidad autenticada.
4. Con la misma cuenta, la aplicación puede recuperar el progreso guardado en la nube.

### Juego y persistencia

1. El juego crea una fila en `game_sessions` con estado `in_progress`.
2. Cada respuesta se guarda en `game_responses`, asociada a la sesión.
3. La base actualiza los contadores de resumen mediante sus triggers.
4. Al terminar o abandonar, la sesión cambia al estado correspondiente.
5. Al volver, la aplicación carga las sesiones y respuestas del usuario autenticado.

### Dashboard docente

El cliente `src/utils/docenteDashboard.js` llama a `leer_dashboard_docente` y `leer_actividad_diaria_docente`. Las funciones SQL verifican que haya una sesión autenticada con rol docente, limitan el periodo consultado y devuelven indicadores y respuestas recientes. La interfaz actualiza los datos mediante Realtime cuando está disponible y también permite recargarlos manualmente.

La precisión se calcula sobre respuestas del primer intento. No equivale al porcentaje de retos completados ni, por sí sola, demuestra dominio lector. Las categorías de evaluación guardadas son códigos técnicos y necesitan validación pedagógica con la profesora.

## 6. Seguridad y límites que deben explicarse con honestidad

- **RLS:** los permisos se verifican en PostgreSQL; no se confía solo en ocultar pantallas en Vue. El acceso de estudiante se limita a sus propios datos.
- **Rol docente:** las funciones del dashboard verifican el rol en la base de datos. En el piloto actual el acceso docente es global para los perfiles de alumno; todavía no hay cursos ni matrículas que segmenten las consultas.
- **Seudonimización:** el RPC presenta identificadores como “Jugador N” y no devuelve el nombre ni el UUID del perfil. Es una etiqueta de presentación, no anonimización irreversible ni un alias estable administrado por el usuario.
- **Clave Supabase anon:** es pública por diseño y puede estar en el frontend; RLS debe proteger los datos. La clave `service_role` nunca debe enviarse al navegador ni versionarse.
- **Clave Gemini:** una clave integrada en una aplicación de navegador puede ser observada por quien use el sitio. No debe describirse como secreta; para protegerla se necesitaría una capa de servidor/proxy y controles de cuota.
- **Puntaje:** la respuesta correcta se compara en el cliente y el resultado se envía a Supabase. No es un sistema anti-trampas ni una certificación de dominio.
- **Consentimiento y privacidad:** mostrar solo datos necesarios para la finalidad educativa y usar cuentas/datos de prueba durante la demostración.

## 7. Migraciones y despliegue

Las migraciones `001` a `006` están en `Aplicación/supabase/migrations/`. La `005` incorpora acceso y consultas del dashboard docente; la `006` incorpora la actividad diaria. Para una base nueva se revisan y ejecutan en orden. En el Supabase compartido, primero confirmar qué versiones están aplicadas; la presencia de un archivo SQL en Git no demuestra el estado remoto.

Para desplegar:

1. Integrar los cambios revisados a la rama configurada como producción en Netlify.
2. Verificar en Netlify el repositorio, la rama de producción, `npm run build` y `dist/`.
3. Configurar allí las variables de entorno requeridas; no subir `.env.local`.
4. Esperar que el deploy finalice como publicado.
5. Probar inicio de sesión, una partida, guardado de respuestas y vista docente en la URL pública.

La URL pública respondió con el HTML de la SPA al revisarla el 19-11-2026; eso **no sustituye** probar el flujo de usuario con cuentas autorizadas. Confirmar también que la URL de producción esté en las URLs permitidas de Supabase Auth.

## 8. Validación disponible y límites de las pruebas

- El proyecto ofrece `npm run lint` y `npm run build`; no tiene un script `npm test` definido en `package.json`.
- El 19-11-2026 ambos comandos terminaron correctamente sobre el código del commit `f2f8394`. El build dejó advertencias de tamaño de assets, configuración de purga de Tailwind y datos de Browserslist antiguos.
- El repositorio incluye un informe de pruebas y un ZIP de evidencias E2E. Revisar y poder reproducir sus pasos antes de afirmar qué pruebas automatizadas se ejecutaron.
- La prueba de build no prueba OAuth, permisos RLS, escritura/lectura en Supabase ni el deploy de Netlify.

Antes de la defensa, ejecutar una prueba de punta a punta con una cuenta de prueba: iniciar sesión, responder una actividad, comprobar sesión y respuestas en Supabase, recargar la aplicación y revisar el dashboard con una cuenta docente.

## 9. Estado actual y trabajo fuera de alcance

- Unidad 1 y Unidad 2, juegos y dashboard docente forman parte del sistema actual.
- El dashboard docente es un piloto global; cursos y matrículas están pendientes.
- No está implementada la carga de textos por la profesora.
- La Unidad 3 no está implementada.
- La regla de avance de Unidad 2 y la interpretación pedagógica de sus indicadores deben validarse con la profesora.
- La pantalla personal del estudiante y el resumen individual del dashboard son vistas distintas; algunas métricas y logros todavía combinan lógica heredada con progreso de nube.
- LeoIA depende de la configuración de Gemini y de las restricciones de la clave usada.

Presentar estas limitaciones como decisiones y siguientes pasos es más sólido que describirlas como funciones terminadas.

## 10. Preguntas técnicas probables

**¿Por qué no construyeron un backend propio?**

Para esta etapa, Supabase proporciona identidad, PostgreSQL y controles de acceso administrados. El cliente habla con Supabase; las reglas sensibles se aplican en RLS y en funciones SQL. El costo de esa decisión es que debemos revisar muy bien las políticas y los permisos.

**¿Cómo evitan que un alumno vea el progreso de otro?**

Las políticas RLS usan la identidad autenticada para limitar las filas propias. El dashboard requiere rol docente y usa funciones SQL. En el piloto, una docente puede consultar globalmente a los alumnos; el aislamiento por curso aún no existe.

**¿Qué diferencia una sesión de una respuesta?**

La sesión representa una actividad completa; cada respuesta es un ítem dentro de esa actividad. Separarlas permite conservar intentos y resumir una partida sin guardar una copia del texto completo.

**¿Qué significa el porcentaje de precisión del dashboard?**

Es la proporción de respuestas correctas entre las respuestas de primer intento del periodo y filtros elegidos. No es porcentaje de avance ni diagnóstico de comprensión lectora.

**¿Dónde se agregan los textos y preguntas?**

Hoy están versionados en `src/data/`. El panel no permite que la profesora cargue textos.

**¿Qué hace RLS y por qué no basta con proteger la ruta en Vue?**

RLS restringe filas directamente en PostgreSQL para cada solicitud autenticada. Una ruta o botón oculto en la interfaz no es una barrera de seguridad.

**¿El despliegue usa GitHub Actions?**

No hay workflows de GitHub Actions configurados. Netlify puede construir y publicar desde la rama que esté conectada; se debe revisar la configuración y el resultado del deploy allí.

**¿Qué cambiarían como siguiente mejora técnica?**

Validar permisos con pruebas de dos roles, limitar datos docentes mediante cursos/matrículas, mover secretos de Gemini a un servicio de servidor y ampliar pruebas automatizadas.

## 11. Preparación de la defensa

En los 15 minutos, respetar el orden pedido: problema y usuarios; gestión y ajustes reales; recorrido completo desde la URL pública; arquitectura y tecnologías. Reservar tiempo para que cada integrante explique tanto una decisión como una limitación. En las preguntas, los tres deben poder describir negocio, proceso y arquitectura; repartir temas no reemplaza el estudio cruzado.

Antes de presentar, cada integrante debería poder dibujar de memoria el diagrama de la sección 2 y explicar el flujo de una respuesta desde el navegador hasta `game_responses` y de vuelta a la pantalla de progreso.
