/**
 * UI-05: nombre corto para saludar y para la barra superior.
 * Google suele entregar el nombre completo, a veces en MAYÚSCULAS
 * ("ANDRÉS PABLO QUIROZ ..."). Para saludar basta el primer nombre,
 * escrito con mayúscula inicial: "Andrés".
 */
export function primerNombre(nombreCompleto) {
  const limpio = String(nombreCompleto || '').trim()
  if (!limpio) return ''
  const primero = limpio.split(/\s+/)[0]
  // Un correo sin nombre ("aquiroz") también queda con mayúscula inicial
  // Nombres compuestos con guion ("MARÍA-JOSÉ") quedan "María-José"
  return primero
    .toLocaleLowerCase('es')
    .split('-')
    .map(parte => parte.charAt(0).toLocaleUpperCase('es') + parte.slice(1))
    .join('-')
}

/** Inicial para el círculo del usuario ("A"). */
export function inicial(nombreCompleto) {
  const nombre = primerNombre(nombreCompleto)
  return nombre ? nombre.charAt(0) : ''
}
