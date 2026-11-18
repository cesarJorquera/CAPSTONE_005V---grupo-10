# Leo Perfecto — Proyecto CAPSTONE, Grupo 10

Este repositorio reúne las evidencias del proyecto APT desarrollado para CAPSTONE. **Leo Perfecto** es una aplicación educativa para que estudiantes practiquen comprensión lectora y para que docentes revisen el avance y desempeño lector.

## Repositorios y organización

- Este repositorio contiene las evidencias académicas organizadas por fase.
- El código fuente del sistema está en [`Fase 2/Evidencias Proyecto/Evidencias de sistema/Aplicación`](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20sistema/Aplicaci%C3%B3n).
- El repositorio de desarrollo es [cesarJorquera/leo-perfecto](https://github.com/cesarJorquera/leo-perfecto). La aplicación se integró aquí con `git subtree`, conservando el historial y la autoría de sus commits.
- Las carpetas de Fase 1 se conservan como evidencia histórica del proyecto.

## Tecnologías

- Vue.js 3, JavaScript y Vue Router
- Tailwind CSS
- Supabase: autenticación, PostgreSQL y actualizaciones en tiempo real
- Netlify para el despliegue de la aplicación

## Ejecución local

Requiere Node.js y npm. En PowerShell:

```powershell
cd "Fase 2\Evidencias Proyecto\Evidencias de sistema\Aplicación"
npm ci
Copy-Item .env.example .env.local
```

Configura en `.env.local` las variables `VUE_APP_SUPABASE_URL` y `VUE_APP_SUPABASE_ANON_KEY` con los valores autorizados del proyecto. No agregues credenciales al repositorio.

```powershell
npm run serve
npm run lint
npm run build
```

El servidor local queda disponible en `http://localhost:8080`.

## Equipo y responsabilidades

- **César Jorquera:** integración del sistema, Unidad 2 y dashboard docente.
- **Andrés Quiroz:** interfaz y experiencia de usuario, incluidos estados de carga y componentes de Leo.
- **Cristian Matus:** arquitectura de datos, autenticación e integración de servicios de IA.

## Metodología

Se trabajó de forma iterativa con prácticas de Scrum: planificación del trabajo, desarrollo por tareas, revisión de avances y ajustes según retroalimentación.

## Arquitectura

La aplicación Vue.js se ejecuta en el navegador y se despliega en Netlify. Se conecta a Supabase para autenticación y almacenamiento en PostgreSQL; las políticas de acceso y las suscripciones de tiempo real permiten consultar y actualizar la actividad. El código y las migraciones versionadas están dentro de la carpeta **Aplicación**.
