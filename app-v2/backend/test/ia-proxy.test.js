import { describe, it, expect } from 'vitest';
import { sanitizar } from '../src/modules/ia-proxy/dlp.js';
import { claveCache, obtener, guardar } from '../src/modules/ia-proxy/cache.js';

describe('DLP (RF-H5)', () => {
  it('elimina correos, RUT y teléfonos antes de enviar al proveedor', () => {
    const { texto, remociones } = sanitizar(
      'Soy juan.perez@correo.cl, RUT 12.345.678-9, fono +56 9 1234 5678'
    );
    expect(texto).not.toContain('juan.perez@correo.cl');
    expect(texto).not.toContain('12.345.678-9');
    expect(texto).not.toContain('1234 5678');
    expect(remociones).toBe(3);
  });
});

describe('caché por nivel', () => {
  it('guarda y recupera una pista con la misma clave', () => {
    const clave = claveCache({ nivel: 'basico', fragmento: 'El sol salía', consulta: '¿qué pasó?' });
    guardar(clave, 'Fíjate en la primera oración.');
    expect(obtener(clave)).toBe('Fíjate en la primera oración.');
  });

  it('claves distintas para niveles distintos', () => {
    const a = claveCache({ nivel: 'basico', fragmento: 'X', consulta: 'Y' });
    const b = claveCache({ nivel: 'avanzado', fragmento: 'X', consulta: 'Y' });
    expect(a).not.toBe(b);
  });
});
