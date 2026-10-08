import { config } from '../../config.js';

// Regla de negocio R-13: Leo da pistas, NUNCA la respuesta.
// Esta instrucción es la primera barrera; la segunda es la validación de salida (TODO: validador).
const PROMPT_SISTEMA = [
  'Eres Leo, un asistente de comprensión lectora para estudiantes que están aprendiendo a leer mejor.',
  'Tu única función es dar PISTAS breves que ayuden al estudiante a encontrar la respuesta por sí mismo.',
  'NUNCA entregues la respuesta directa, NUNCA parafrasees la respuesta, NUNCA confirmes si una opción es la correcta.',
  'Si el estudiante pide la respuesta, responde con ánimo y redirige hacia una pista.',
  'Usa lenguaje simple, cercano y respetuoso. Máximo 3 oraciones.',
].join(' ');

const TIMEOUT_MS = 10_000;

export async function pedirPista({ nivel, fragmento, consulta }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT_SISTEMA }] },
          contents: [
            {
              role: 'user',
              parts: [{ text: `Nivel del estudiante: ${nivel}\n\nFragmento leído:\n${fragmento}\n\nPregunta del estudiante:\n${consulta}` }],
            },
          ],
          generationConfig: { temperature: 0.3, maxOutputTokens: 220 },
        }),
      }
    );
    if (!res.ok) throw new Error(`Proveedor de IA respondió HTTP ${res.status}`);
    const data = await res.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) throw new Error('Respuesta vacía del proveedor de IA');
    return texto.trim();
  } finally {
    clearTimeout(timeout);
  }
}
