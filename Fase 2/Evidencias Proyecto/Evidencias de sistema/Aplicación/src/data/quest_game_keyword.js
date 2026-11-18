/**
 * Preguntas para el Juego 1 - Identificación de Palabras Clave
 * 
 * Cada pregunta está agrupada por textId (debe coincidir con IDs en game1_texts.js)
 * 
 * Estructura de cada pregunta:
 * - question: texto de la pregunta
 * - word: palabra clave sobre la que se pregunta
 * - options: array de 4 opciones
 * - correct: respuesta correcta (debe estar en options)
 * - explanation: explicación de por qué es correcta
 * 
 * Para agregar preguntas a un nuevo texto:
 * 1. Agrega una nueva clave con el textId (ej: 'text3')
 * 2. Crea un array con al menos 3-5 preguntas
 * 3. Asegúrate de que las palabras coincidan con las del texto
 */

export const questionsByText = {
  text1: [
    {
      question: 'En el texto, ¿qué tipo de palabra clave representa "Harry Potter"?',
      word: 'Harry Potter',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos son nombres de personas, lugares o cosas. "Harry Potter" es el nombre de una persona.'
    },
    {
      question: 'En el texto, ¿qué representa la palabra en negrita "aunque"?',
      word: 'aunque',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas o frases. "Aunque" conecta dos partes de la oración.'
    },
    {
      question: 'En el texto, ¿qué representa la palabra en negrita "sabían"?',
      word: 'sabían',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un verbo',
      explanation: 'Los verbos indican acciones o estados. "sabían" expresa la convicción que tenían para completar la misión.'
    },
    {
      question: 'En el texto, ¿qué representa la palabra "pero"?',
      word: 'pero',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Pero" conecta dos ideas contrastantes.'
    },
    {
      question: 'En el texto, ¿qué representa "difícil"?',
      word: 'difícil',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adjetivo',
      explanation: 'Un adjetivo es una palabra que describe o califica a un sustantivo. En este caso, "difícil" describe la tarea.'
    }
  ],
  text2: [
    {
      question: 'En el texto, ¿qué tipo de palabra representa "Sam"?',
      word: 'Sam',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos son nombres de personas, lugares o cosas. "Sam" es el nombre de un personaje, por lo tanto es un sustantivo.'
    },
    {
      question: '¿Qué tipo de palabra es "Anillo"?',
      word: 'Anillo',
      options: ['Un conector', 'Un verbo', 'Un sustantivo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran objetos, seres o conceptos. "Anillo" es un objeto mágico en la historia.'
    },
    {
      question: '¿Qué representa "sintiendo" en el texto?',
      word: 'sintiendo',
      options: ['Un sustantivo', 'Un adjetivo', 'Un conector', 'Un verbo'],
      correct: 'Un verbo',
      explanation: 'Los verbos indican acciones, estados o procesos. "Sintiendo" expresa la acción de percibir o experimentar algo.'
    },
    {
      question: '¿Qué tipo de palabra es "oscuros"?',
      word: 'oscuros',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos describen o califican a los sustantivos. "Oscuros" describe cómo son los caminos de Mordor.'
    },
    {
      question: '¿Qué conecta la palabra "pero" en el texto?',
      word: 'pero',
      options: ['2 sustantivos', '2 verbos', '2 adjetivos', '2 ideas'],
      correct: '2 adjetivos',
      explanation: 'Los conectores unen elementos de la oración. "Pero" conecta dos adjetivos: "agotado" y "firme", que describen el estado de Sam. Es un conector de contraste.'
    }
  ],
  text3: [
    {
      question: '¿Qué tipo de palabra es "rápidamente"?',
      word: 'rápidamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos, adjetivos u otros adverbios. "Rápidamente" indica cómo regresó Neo, modificando el verbo "regresó".'
    },
    {
      question: '¿Qué representa "Resistencia" en el texto?',
      word: 'Resistencia',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran personas, lugares, cosas o conceptos. "Resistencia" es el nombre del grupo que lucha contra las máquinas.'
    },
    {
      question: '¿Qué tipo de palabra es "necesitaba"?',
      word: 'necesitaba',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones, estados o procesos. "Necesitaba" indica el estado de requerir algo urgentemente.'
    },
    {
      question: '¿Qué representa "aunque" en el texto?',
      word: 'aunque',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Aunque" es un conector concesivo que une dos ideas contrastantes.'
    },
    {
      question: '¿Qué tipo de palabra es "descubiertos"?',
      word: 'descubiertos',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican o describen sustantivos. "Descubiertos" describe el estado de los poderes de Neo.'
    }
  ],
  text4: [
    {
      question: '¿Qué tipo de palabra es "cómodamente"?',
      word: 'cómodamente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Cómodamente" indica cómo intentaban sentarse, modificando el verbo "sentarse".'
    },
    {
      question: '¿Qué representa "discutía" en el texto?',
      word: 'discutía',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Discutía" indica la acción de George de argumentar con Jerry.'
    },
    {
      question: '¿Qué tipo de palabra es "boleto"?',
      word: 'boleto',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran cosas u objetos. "Boleto" es un objeto sobre el cual discuten.'
    },
    {
      question: '¿Qué representa "sin embargo" en el texto?',
      word: 'sin embargo',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Sin embargo" es un conector adversativo que introduce un contraste entre quejarse y amar su amistad.'
    },
    {
      question: '¿Qué tipo de palabra es "disfuncional"?',
      word: 'disfuncional',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Disfuncional" describe cómo es la amistad del grupo.'
    }
  ],
  text5: [
    {
      question: '¿Qué tipo de palabra es "lentamente"?',
      word: 'lentamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Lentamente" indica cómo escapó Andy, modificando el verbo "escapó".'
    },
    {
      question: '¿Qué representa "túnel" en el texto?',
      word: 'túnel',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran lugares, cosas u objetos. "Túnel" es el lugar por donde Andy se arrastraba.'
    },
    {
      question: '¿Qué tipo de palabra es "llevaba"?',
      word: 'llevaba',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Llevaba" indica la acción de portar o cargar algo consigo.'
    },
    {
      question: '¿Qué representa "robado" en el texto?',
      word: 'robado',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Robado" describe la procedencia del dinero que llevaba Andy.'
    },
    {
      question: '¿Qué tipo de palabra es "tranquilamente"?',
      word: 'tranquilamente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Tranquilamente" indica cómo podría vivir, modificando el verbo "vivir".'
    }
  ],
  text6: [
    {
      question: '¿Qué tipo de palabra es "lucharon"?',
      word: 'lucharon',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Lucharon" indica la acción de combatir contra el ejército de Thanos.'
    },
    {
      question: '¿Qué representa "ferozmente" en el texto?',
      word: 'ferozmente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Ferozmente" indica cómo lucharon, modificando el verbo "lucharon".'
    },
    {
      question: '¿Qué tipo de palabra es "Tierra"?',
      word: 'Tierra',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran lugares. "Tierra" es el planeta que los Vengadores intentan salvar.'
    },
    {
      question: '¿Qué representa "valiente" en el texto?',
      word: 'valiente',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Valiente" describe la cualidad del Capitán América.'
    },
    {
      question: '¿Qué tipo de palabra es "pues"?',
      word: 'pues',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Pues" es un conector causal que introduce la razón del sacrificio de Iron Man.'
    }
  ],
  text7: [
    {
      question: '¿Qué tipo de palabra es "semanalmente"?',
      word: 'semanalmente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Semanalmente" indica la frecuencia con que organizaba fiestas, modificando el verbo "organizaba".'
    },
    {
      question: '¿Qué representa "mansión" en el texto?',
      word: 'mansión',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran lugares o cosas. "Mansión" es el lugar donde Gatsby organizaba las fiestas.'
    },
    {
      question: '¿Qué tipo de palabra es "buscaba"?',
      word: 'buscaba',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones o estados. "Buscaba" indica la acción intencional de Gatsby de impresionar a Daisy.'
    },
    {
      question: '¿Qué representa "únicamente" en el texto?',
      word: 'únicamente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Únicamente" indica la exclusividad de su búsqueda, modificando el verbo "buscaba".'
    },
    {
      question: '¿Qué tipo de palabra es "pero"?',
      word: 'pero',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Pero" es un conector adversativo que introduce un contraste entre las fiestas grandiosas y su verdadero objetivo.'
    }
  ],
  text8: [
    {
      question: '¿Qué tipo de palabra es "silenciosamente"?',
      word: 'silenciosamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Silenciosamente" indica cómo vigilaba Batman, modificando el verbo "vigilaba".'
    },
    {
      question: '¿Qué representa "creía" en el texto?',
      word: 'creía',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones o estados. "Creía" indica el estado mental de convicción del Comisionado Gordon.'
    },
    {
      question: '¿Qué tipo de palabra es "justicia"?',
      word: 'justicia',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran conceptos abstractos. "Justicia" es un concepto o valor que Batman busca impartir.'
    },
    {
      question: '¿Qué representa "ya que" en el texto?',
      word: 'ya que',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Ya que" es un conector causal que introduce la razón de por qué Batman es necesario.'
    },
    {
      question: '¿Qué tipo de palabra es "pacientemente"?',
      word: 'pacientemente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Pacientemente" indica cómo esperaba el Joker, modificando el verbo "esperaba".'
    }
  ],
  text9: [
    {
      question: '¿Qué tipo de palabra es "nave"?',
      word: 'nave',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran cosas u objetos. "Nave" se refiere a la Enterprise, el vehículo espacial.'
    },
    {
      question: '¿Qué representa "constantemente" en el texto?',
      word: 'constantemente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Constantemente" indica la frecuencia con que viajaba, modificando el verbo "viajaba".'
    },
    {
      question: '¿Qué tipo de palabra es "exploraba"?',
      word: 'exploraba',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Exploraba" indica la acción del Capitán Kirk de descubrir nuevos mundos.'
    },
    {
      question: '¿Qué representa "valientemente" en el texto?',
      word: 'valientemente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Valientemente" indica cómo exploraba Kirk, modificando el verbo "exploraba".'
    },
    {
      question: '¿Qué tipo de palabra es "por lo tanto"?',
      word: 'por lo tanto',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Por lo tanto" es un conector consecutivo que introduce una consecuencia del análisis de Spock.'
    }
  ],
  text10: [
    {
      question: '¿Qué tipo de palabra es "secretamente"?',
      word: 'secretamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Secretamente" indica cómo regresó Bilbo, modificando el verbo "regresó".'
    },
    {
      question: '¿Qué representa "aventura" en el texto?',
      word: 'aventura',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran experiencias o acontecimientos. "Aventura" se refiere al viaje peligroso que completó Bilbo.'
    },
    {
      question: '¿Qué tipo de palabra es "guardó"?',
      word: 'guardó',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Guardó" indica la acción de Bilbo de conservar el Anillo Único.'
    },
    {
      question: '¿Qué representa "celosamente" en el texto?',
      word: 'celosamente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Celosamente" indica cómo guardó el anillo, modificando el verbo "guardó".'
    },
    {
      question: '¿Qué tipo de palabra es "desastrosas"?',
      word: 'desastrosas',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Desastrosas" describe el tipo de consecuencias que traería el anillo.'
    }
  ],
  text11: [
    {
      question: '¿Qué tipo de palabra es "luchaban"?',
      word: 'luchaban',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Luchaban" indica la acción de los sobrevivientes de esforzarse por sobrevivir.'
    },
    {
      question: '¿Qué representa "diariamente" en el texto?',
      word: 'diariamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Diariamente" indica la frecuencia con que luchaban, modificando el verbo "luchaban".'
    },
    {
      question: '¿Qué tipo de palabra es "misteriosa"?',
      word: 'misteriosa',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Misteriosa" describe cómo es la isla donde están atrapados.'
    },
    {
      question: '¿Qué representa "aunque" en el texto?',
      word: 'aunque',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Aunque" es un conector concesivo que introduce un contraste entre el intento de cohesionar y la división.'
    },
    {
      question: '¿Qué tipo de palabra es "profundamente"?',
      word: 'profundamente',
      options: ['Un adjetivo', 'Un adverbio', 'Un sustantivo', 'Un verbo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Profundamente" indica la intensidad de la creencia de Locke, modificando el verbo "creía".'
    }
  ],
  text12: [
    {
      question: '¿Qué tipo de palabra es "criminales"?',
      word: 'criminales',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un sustantivo',
      explanation: 'Los sustantivos nombran personas o grupos. "Criminales" se refiere a las personas que planificaron el asalto.'
    },
    {
      question: '¿Qué representa "meticulosamente" en el texto?',
      word: 'meticulosamente',
      options: ['Un sustantivo', 'Un adverbio', 'Un verbo', 'Un adjetivo'],
      correct: 'Un adverbio',
      explanation: 'Los adverbios modifican verbos. "Meticulosamente" indica cómo planificaron, modificando el verbo "planificó".'
    },
    {
      question: '¿Qué tipo de palabra es "dirigía"?',
      word: 'dirigía',
      options: ['Un sustantivo', 'Un adjetivo', 'Un verbo', 'Un conector'],
      correct: 'Un verbo',
      explanation: 'Los verbos expresan acciones. "Dirigía" indica la acción del Profesor de liderar la operación.'
    },
    {
      question: '¿Qué representa "astutos" en el texto?',
      word: 'astutos',
      options: ['Un verbo', 'Un sustantivo', 'Un adjetivo', 'Un conector'],
      correct: 'Un adjetivo',
      explanation: 'Los adjetivos califican sustantivos. "Astutos" describe la cualidad de inteligencia del grupo de criminales.'
    },
    {
      question: '¿Qué tipo de palabra es "además de"?',
      word: 'además de',
      options: ['Un conector', 'Un sustantivo', 'Un verbo', 'Un adjetivo'],
      correct: 'Un conector',
      explanation: 'Los conectores unen ideas. "Además de" es un conector aditivo que añade información sobre conseguir el dinero.'
    }
  ]
}

/**
 * Obtener preguntas por textId
 * @param {string} textId - ID del texto
 * @returns {array} - Array de preguntas o array vacío si no existe
 */
export function getQuestionsByTextId(textId) {
  return questionsByText[textId] || []
}

/**
 * LEGACY: Export para mantener compatibilidad (text1 por defecto)
 * @deprecated Usa getQuestionsByTextId() en su lugar
 */
export const questions = questionsByText.text1