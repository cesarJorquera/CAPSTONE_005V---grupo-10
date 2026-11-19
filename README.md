# Leo Perfecto — Proyecto CAPSTONE, Grupo 10

Este repositorio reúne las evidencias del proyecto APT desarrollado para CAPSTONE. **Leo Perfecto** es una aplicación educativa para que estudiantes practiquen comprensión lectora y para que docentes revisen el avance y desempeño lector.

## Repositorios y organización

- Este repositorio contiene las evidencias académicas organizadas por fase.
- El código fuente del sistema está en [`Fase 2/Evidencias Proyecto/Evidencias de sistema/Aplicación`](Fase%202/Evidencias%20Proyecto/Evidencias%20de%20sistema/Aplicaci%C3%B3n).
- El repositorio de desarrollo es [cesarJorquera/leo-perfecto](https://github.com/cesarJorquera/leo-perfecto). La aplicación se integró aquí con `git subtree`, conservando el historial y la autoría de sus commits.
- Las carpetas de Fase 1 se conservan como evidencia histórica del proyecto.


## Ejecución local

Requiere Node.js y npm. En PowerShell:

Configura en `.env.local` las variables `VUE_APP_SUPABASE_URL` y `VUE_APP_SUPABASE_ANON_KEY` con los valores autorizados del proyecto. No agregues credenciales al repositorio.

```powershell
npm run serve
```

## Equipo 

- **César Jorquera:** 
- **Andrés Quiroz:** 
- **Cristian Matus:** 

## Metodología

Se trabajó de forma iterativa con prácticas de Scrum: planificación del trabajo, desarrollo por tareas, revisión de avances y ajustes según retroalimentación.

## Arquitectura

La aplicación Vue.js se ejecuta en el navegador y se despliega en Netlify. Se conecta a Supabase para autenticación y almacenamiento en PostgreSQL; las políticas de acceso y las suscripciones de tiempo real permiten consultar y actualizar la actividad. El código y las migraciones versionadas están dentro de la carpeta **Aplicación**.
