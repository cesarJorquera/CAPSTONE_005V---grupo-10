// Utilidades de texto compartidas por los componentes de la ruta.

export function esPuntuacion(palabra) {
  return /^[.,;:!?]$/.test(palabra)
}