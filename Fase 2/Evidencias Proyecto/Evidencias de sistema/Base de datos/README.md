# Base de datos

La base de datos se implementa en Supabase sobre PostgreSQL. Las migraciones canónicas se mantienen junto al código de la aplicación en [`Aplicación/supabase/migrations/`](../Aplicaci%C3%B3n/supabase/migrations/); no duplicar aquí los archivos SQL.

## Modelo principal

```text
auth.users 1 ── 1 profiles
auth.users 1 ── N game_sessions
games      1 ── N game_sessions
game_sessions 1 ── N game_responses
```

- `profiles`: identidad de aplicación y rol asociado a una cuenta Auth.
- `games`: catálogo técnico estable de juegos y unidades.
- `game_sessions`: actividad de una cuenta, estado, fechas y resumen calculado.
- `game_responses`: respuestas por ítem e intento, vinculadas a una sesión.

Las migraciones `001` a `006` describen perfiles, sesiones, respuestas, ruta de aprendizaje y funciones de consulta del dashboard docente. Las políticas RLS restringen el acceso y las funciones del dashboard verifican el rol docente. El piloto docente todavía tiene alcance global: no existen cursos ni matrículas para limitar la vista por sección.

El diagrama entidad-relación disponible está en [Documentación Histórica](../../Evidencias%20de%20documentaci%C3%B3n/Documentaci%C3%B3n%20Hist%C3%B3rica/Diagrama%204%20-%20Entidad%20Relacion%20%28ER%29.png). Verificarlo contra las migraciones actuales antes de presentarlo como modelo vigente.

Para una base nueva, revisar y ejecutar las migraciones en orden. En el proyecto Supabase compartido, comprobar el estado existente antes de ejecutar SQL; los archivos del repositorio por sí solos no prueban qué quedó aplicado en remoto.
