/**
 * ============================================
 * GEMINI AI CLIENT
 * ============================================
 * Cliente para interactuar con Google Gemini AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar cliente con API key
const API_KEY = process.env.VUE_APP_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

// Usar gemini-2.5-flash (el modelo que tienes habilitado)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

/**
 * Consultar a Gemini con un prompt
 * @param {string} prompt - Prompt a enviar
 * @returns {Promise<string>} - Respuesta de la IA
 */
export async function consultarIA(prompt) {
  // Validar API Key primero
  if (!API_KEY || API_KEY === 'tu-api-key-aqui') {
    throw new Error('🔑 API Key no configurada. Agrega VUE_APP_GEMINI_API_KEY en .env.local y reinicia el servidor.');
  }
  
  try {
    console.log('🤖 Consultando Gemini...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const texto = response.text();
    console.log('✅ Respuesta de Gemini recibida:', texto.substring(0, 100) + '...');
    
    // Validar que la respuesta no esté vacía
    if (!texto || texto.trim().length === 0) {
      throw new Error('La IA devolvió una respuesta vacía. Intenta de nuevo.');
    }
    
    return texto;
  } catch (error) {
    console.error('❌ Error al consultar Gemini:', error);
    
    // Manejo de errores específicos
    if (error.message?.includes('API') || error.message?.includes('key') || error.status === 400) {
      throw new Error('🔑 Error de API Key. Verifica que sea válida en Google AI Studio.');
    }
    
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error('⚠️ Límite de solicitudes alcanzado. Espera 1 minuto e intenta de nuevo.');
    }
    
    if (error.status === 404) {
      throw new Error('❌ Modelo no encontrado. Verifica el nombre del modelo en Google AI Studio.');
    }
    
    if (error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('rate limit')) {
      throw new Error('⚠️ Has alcanzado el límite de tokens por minuto. Espera 60 segundos.');
    }
    
    throw error;
  }
}

/**
 * Función auxiliar para limpiar y parsear respuestas JSON de Gemini
 * @param {string} respuesta - Respuesta cruda de Gemini
 * @returns {object} - Objeto JSON parseado
 */
function limpiarJSON(respuesta) {
  try {
    // Validar que la respuesta no esté vacía
    if (!respuesta || respuesta.trim().length === 0) {
      throw new Error('Respuesta vacía de la IA');
    }
    
    // Remover markdown code blocks si existen
    let textoLimpio = respuesta.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    // Buscar el JSON en la respuesta (con búsqueda más flexible)
    const jsonMatch = textoLimpio.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonString = jsonMatch[0];
      return JSON.parse(jsonString);
    }
    
    // Si no hay match, intentar parsear directo
    return JSON.parse(textoLimpio);
  } catch (error) {
    console.error('❌ Error al parsear JSON de Gemini:', error);
    console.error('📄 Respuesta recibida:', respuesta);
    
    // Intentar extraer y mostrar la posición del error
    if (error.message.includes('position')) {
      const posMatch = error.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const inicio = Math.max(0, pos - 50);
        const fin = Math.min(respuesta.length, pos + 50);
        console.error('🔍 Contexto del error:', respuesta.substring(inicio, fin));
      }
    }
    
    throw new Error('La IA generó una respuesta mal formada. Por favor, intenta de nuevo.');
  }
}

/**
 * Generar diagnóstico personalizado basado en respuestas del test
 * @param {object} resultados - {correctas, incorrectas, habilidadesEvaluadas}
 * @returns {Promise<object>} - Diagnóstico generado por IA
 */
export async function generarDiagnosticoPersonalizado(resultados) {
  const { correctas, incorrectas, habilidadesEvaluadas } = resultados;
  const total = correctas + incorrectas;
  const porcentaje = Math.round((correctas / total) * 100);
  
  // Construir resumen de habilidades
  const resumenHabilidades = habilidadesEvaluadas.map(h => 
    `- ${h.nombre}: ${h.correcta ? 'CORRECTA ✓' : 'INCORRECTA ✗'}`
  ).join('\n');
  
  const prompt = `Eres un experto pedagogo en comprensión lectora especializado en diagnósticos precisos. Analiza estos resultados de un test diagnóstico avanzado de 10 preguntas:

RESULTADOS DEL ESTUDIANTE:
- Preguntas correctas: ${correctas}/${total}
- Porcentaje de acierto: ${porcentaje}%
- Análisis por habilidad:
${resumenHabilidades}

GENERA un diagnóstico completo, honesto y motivador en formato JSON:
{
  "nivel": "basico/intermedio/avanzado/experto",
  "mensaje_motivacional": "Mensaje realista que reconozca el nivel actual y motive a seguir mejorando (máximo 2 líneas)",
  "fortalezas": ["2-3 fortalezas específicas detectadas basadas en respuestas correctas"],
  "areas_mejorar": ["2-3 áreas concretas donde debe enfocarse basadas en errores"],
  "recomendacion_inicio": "Estrategia específica: con qué unidad empezar y por qué",
  "consejo_principal": "Consejo práctico y accionable para mejorar la comprensión lectora"
}

CRITERIOS DE EVALUACIÓN ESTRICTOS:
- BÁSICO: 0-40% (4 o menos correctas) - Necesita refuerzo en habilidades fundamentales
- INTERMEDIO: 41-65% (5-6 correctas) - Comprensión general pero áreas específicas a fortalecer
- AVANZADO: 66-85% (7-8 correctas) - Buen nivel, pulir habilidades complejas
- EXPERTO: 86-100% (9-10 correctas) - Dominio sólido de comprensión lectora

SÉ HONESTO: Si el estudiante tiene nivel básico, dilo claramente pero con motivación. Si es experto, reconócelo pero sugiere desafíos mayores.

Responde SOLO con el JSON válido, sin texto adicional ni markdown.`;
  
  try {
    const respuesta = await consultarIA(prompt);
    return limpiarJSON(respuesta);
  } catch (error) {
    console.error('❌ Error al generar diagnóstico:', error);
    throw new Error('No se pudo generar el diagnóstico. Intenta de nuevo.');
  }
}

/**
 * Generar ejercicio aleatorio
 * @param {string} habilidad - Habilidad a practicar
 * @returns {Promise<object>} - Ejercicio generado
 */
export async function generarEjercicioAleatorio(habilidad = 'comprension_general') {
  const habilidadDescripcion = {
    'idea_principal': 'identificar la idea principal',
    'inferencia': 'hacer inferencias',
    'causa_efecto': 'reconocer causa y efecto',
    'detalle_especifico': 'identificar detalles especificos',
    'secuencia': 'ordenar secuencias',
    'comprension_general': 'comprension general'
  };
  
  const prompt = `Genera un ejercicio de comprension lectora sobre ${habilidadDescripcion[habilidad]} en formato JSON.

Formato:
{
  "titulo": "Titulo del ejercicio",
  "texto": "Un parrafo de 60 palabras sobre un tema interesante",
  "pregunta": "Pregunta clara",
  "alternativas": ["Opcion A", "Opcion B", "Opcion C"],
  "respuesta_correcta": 1,
  "explicacion": "Explicacion breve",
  "habilidad": "${habilidad}"
}

Responde solo con el JSON, sin texto extra.`;
  
  try {
    const respuesta = await consultarIA(prompt);
    return limpiarJSON(respuesta);
  } catch (error) {
    console.error('❌ Error al generar ejercicio aleatorio:', error);
    throw new Error('No se pudo generar el ejercicio. Intenta de nuevo.');
  }
}

/**
 * Chat conversacional
 * @param {string} mensajeUsuario - Mensaje del usuario
 * @param {array} historial - Historial de conversación
 * @returns {Promise<string>} - Respuesta de la IA
 */
export async function chatConversacional(mensajeUsuario, historial = []) {
  try {
    // Construir contexto con historial
    let contexto = `Eres Leo, un asistente virtual amigable de comprensión lectora para adolescentes.
  
  Características:
  - Tono: amigable, motivador, cercano
  - Usa emojis ocasionalmente
  - Respuestas cortas (máximo 100 palabras)
  - Si preguntan sobre comprensión lectora, da consejos prácticos
  - Si es fuera de tema, redirige amablemente al aprendizaje
  - IMPORTANTE: Responde SOLO con texto plano, sin formato markdown ni asteriscos
  
  Historial de conversación:
  ${historial.map(h => `${h.rol}: ${h.mensaje}`).join('\n')}
  
  Usuario: ${mensajeUsuario}
  
  Leo:`;
    
    const respuesta = await consultarIA(contexto);
    // Limpiar cualquier formato markdown que pueda venir
    return respuesta.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  } catch (error) {
    console.error('[chatConversacional] Error:', error);
    throw new Error('Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentarlo de nuevo?');
  }
}

/**
 * Verificar si la API key está configurada
 * @returns {boolean}
 */
export function esAPIKeyValida() {
  const apiKey = process.env.VUE_APP_GEMINI_API_KEY;
  return apiKey && apiKey !== 'tu-api-key-aqui' && apiKey.length > 20;
}
