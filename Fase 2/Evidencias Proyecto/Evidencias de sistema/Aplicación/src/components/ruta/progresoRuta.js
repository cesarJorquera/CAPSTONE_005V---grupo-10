// Lógica del progreso de la ruta (sin pantalla: recibe datos y devuelve datos).

// Tipos de nodo que hay que completar para desbloquear el siguiente.
// El nodo 'opcional' no está aquí: nunca bloquea.
export const TIPOS_OBLIGATORIOS = ['aprende', 'practica', 'desafio']

// Devuelve los nodos con un campo extra `estado`:
// 'completado' | 'disponible' | 'bloqueado' | 'pronto'
export function estadoDeNodos(nodos, completadas) {
  let obligatorioAnteriorListo = true // el primer nodo siempre está disponible

  return nodos.map(nodo => {
    let estado
    if (nodo.pronto) {
      estado = 'pronto'
    } else if (completadas.includes(nodo.tareaId)) {
      estado = 'completado'
    } else if (obligatorioAnteriorListo) {
      estado = 'disponible'
    } else {
      estado = 'bloqueado'
    }

    // Solo los obligatorios cambian lo que pasa con el siguiente nodo.
    if (TIPOS_OBLIGATORIOS.includes(nodo.tipo)) {
      obligatorioAnteriorListo = estado === 'completado'
    }

    return { ...nodo, estado }
  })
}