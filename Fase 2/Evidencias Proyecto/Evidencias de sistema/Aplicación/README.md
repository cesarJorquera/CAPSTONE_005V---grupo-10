# Aplicación Leo Perfecto

Aplicación web educativa para practicar comprensión lectora y conceptos lingüísticos. La experiencia está pensada para estudiantes y cuenta con un espacio docente para revisar actividad y desempeño.

- [README del repositorio CAPSTONE](../../../../README.md)
- [Aplicación publicada](https://leo-perfecto.netlify.app/)
- [Guía técnica y de defensa](../../Evidencias%20de%20documentaci%C3%B3n/Manual_Tecnico_y_Guia_de_Defensa_Leo_Perfecto.md)
- [Guía detallada del proyecto](./docs/proyecto.md)

## Alcance implementado

- Cuatro juegos de práctica.
- Rutas de aprendizaje de las unidades 1 y 2.
- Guardado de sesiones y respuestas del usuario autenticado en Supabase.
- Espacio docente Leo Aula y dashboard Leo Dash.
- LeoIA utiliza Gemini cuando se configura su integración.

La Unidad 3, la carga de textos por la docente y la administración de cursos no forman parte del alcance implementado actual. El dashboard es un piloto global para docentes; todavía no filtra por cursos o matrículas. Las categorías de evaluación son etiquetas técnicas que deben validarse pedagógicamente.

## Tecnologías

- Vue 3 y Vue Router.
- Tailwind CSS y Vue CLI.
- Supabase Auth y PostgreSQL con RLS.
- Netlify para alojar la aplicación estática.
- Gemini para las funciones opcionales de LeoIA.

## Ejecución local

Requiere Node.js y npm.

```powershell
npm install
Copy-Item .env.example .env.local
```

Completa `.env.local` con las variables de configuración autorizadas:

```text
VUE_APP_SUPABASE_URL=<URL del proyecto>
VUE_APP_SUPABASE_ANON_KEY=<clave pública anon>
VUE_APP_GEMINI_API_KEY=<opcional, solo si se habilita LeoIA>
```

`.env.local` no debe subirse al repositorio. La clave `service_role` de Supabase nunca debe incluirse en el frontend. La clave de Gemini configurada en una aplicación de navegador puede ser visible para sus usuarios; no debe tratarse como un secreto seguro.

```powershell
npm run serve
npm run lint
npm run build
```

El servidor local queda disponible normalmente en `http://localhost:8080`.

## Base de datos y despliegue

Las migraciones canónicas están en `supabase/migrations/` y se mantienen junto al código. Para una base nueva, revisar y ejecutar las migraciones en orden. En el proyecto compartido, verificar cuáles ya se aplicaron antes de ejecutar cambios.

`netlify.toml` configura `npm run build`, publica `dist/` y redirige rutas de la SPA a `index.html`. En Netlify se deben configurar las variables de entorno de producción y autorizar las URL de retorno de Google en Supabase Auth.
