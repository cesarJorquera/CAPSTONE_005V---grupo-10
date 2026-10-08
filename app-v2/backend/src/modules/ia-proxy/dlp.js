// DLP bidireccional (RF-H5): antes de que cualquier texto salga hacia el proveedor
// de IA, se eliminan identificadores personales. Al proveedor solo llega
// "fragmento + consulta", nunca identidad del estudiante.
const PATRONES = [
  { nombre: 'correo', re: /[\w.+-]+@[\w-]+\.[\w.]+/gi },
  { nombre: 'rut', re: /\b\d{1,2}\.?\d{3}\.?\d{3}-?[\dkK]\b/g },
  { nombre: 'telefono', re: /\b(\+?56[\s-]?)?9[\s-]?\d{4}[\s-]?\d{4}\b/g },
];

// Devuelve { texto, remociones } — remociones queda para log interno (sin PII, solo conteo)
export function sanitizar(entrada) {
  let texto = entrada;
  let remociones = 0;
  for (const { re } of PATRONES) {
    texto = texto.replace(re, () => {
      remociones += 1;
      return '[dato-omitido]';
    });
  }
  return { texto: texto.trim(), remociones };
}
