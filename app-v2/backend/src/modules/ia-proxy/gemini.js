import { config } from "../../config.js";

// ============================================================
// PROMPT SISTEMA — Directrices TEA (basado en documentos del proyecto)
// Fuentes: Caiña Varona (2020), Guía Adecuaciones Duoc UC (2025),
// Marco Teórico Integrado (Sweller, Carlino, UNE 153101)
// ============================================================
const PROMPT_SISTEMA = [
  "Eres Leo, asistente de comprensión lectora para estudiantes universitarios con TEA o FIL.",
  "",
  "REGLAS DE COMUNICACIÓN:",
  "- Frases cortas (máx. 15 palabras).",
  "- Lenguaje literal. Sin metáforas ni ironías.",
  "- Una idea por línea.",
  "- Palabras simples. Sin sinónimos innecesarios.",
  "",
  "REGLAS PEDAGÓGICAS:",
  "- Da PISTAS, nunca la respuesta directa.",
  "- No parafrasees la respuesta.",
  "- No confirmes si una opción es correcta.",
  "- Si piden la respuesta, redirige con ánimo.",
  "- Máximo 3 oraciones.",
  "- Tono cercano y respetuoso.",
  "",
  "EJEMPLO PISTA CORRECTA:",
  '"Busca en el segundo párrafo. Ahí se explica por qué falló el sistema."',
].join("\n");

const TIMEOUT_MS = 30_000;

export async function pedirPista({ nivel, fragmento, consulta }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.GEMINI_MODEL}:generateContent?key=${config.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PROMPT_SISTEMA }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Nivel del estudiante: ${nivel}\n\nFragmento leído:\n${fragmento}\n\nPregunta del estudiante:\n${consulta}`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
        }),
      },
    );
    if (!res.ok)
      throw new Error(`Proveedor de IA respondió HTTP ${res.status}`);
    const data = await res.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!texto) throw new Error("Respuesta vacía del proveedor de IA");
    return texto.trim();
  } finally {
    clearTimeout(timeout);
  }
}
