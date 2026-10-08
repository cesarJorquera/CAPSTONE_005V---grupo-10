// Límites de arquitectura del monolito modular.
// Estas reglas se ejecutan en CI: un import prohibido rompe el build.
// "La modularidad la fuerza la herramienta, no la buena voluntad." (Propuesta 4)
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'Ninguna dependencia circular en el backend',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'modulos-no-se-importan-entre-si',
      comment: 'Un módulo no puede importar otro módulo; lo común va en shared/',
      severity: 'error',
      from: { path: '^src/modules/([^/]+)/' },
      to: { path: '^src/modules/', pathNot: '^src/modules/$1/' },
    },
    {
      name: 'shared-no-importa-modulos',
      comment: 'shared/ es código común; no puede depender de módulos de negocio',
      severity: 'error',
      from: { path: '^src/shared' },
      to: { path: '^src/modules' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: false,
  },
};
