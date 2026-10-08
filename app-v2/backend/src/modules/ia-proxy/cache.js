import crypto from 'node:crypto';
import { config } from '../../config.js';

// Caché en memoria por (nivel + fragmento + consulta): menos llamadas a Gemini,
// menor costo y menor latencia. En el piloto (1 proceso) un Map alcanza;
// si se escala a varias instancias, mover a una tabla de Supabase (decisión documentada).
const store = new Map();

export function claveCache({ nivel, fragmento, consulta }) {
  return crypto
    .createHash('sha256')
    .update(`${nivel}::${fragmento}::${consulta}`)
    .digest('hex');
}

export function obtener(clave) {
  const hit = store.get(clave);
  if (!hit) return null;
  if (hit.expira < Date.now()) {
    store.delete(clave);
    return null;
  }
  return hit.valor;
}

export function guardar(clave, valor) {
  store.set(clave, { valor, expira: Date.now() + config.IA_CACHE_TTL_MS });
}
