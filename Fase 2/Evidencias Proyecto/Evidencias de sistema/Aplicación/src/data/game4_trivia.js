// ================================================================
// JUEGO 4: TRIVIA DE FUNDAMENTOS DE COMPRENSIÓN LECTORA
// ================================================================
// Base de datos de preguntas teóricas sobre conceptos fundamentales
// de comprensión lectora para la Unidad 1
// ================================================================

export const triviaPreguntas = [
  {
    id: 1,
    pregunta: "¿Qué es la idea principal de un texto?",
    alternativas: [
      { id: "a", texto: "El tema general del que trata el texto" },
      { id: "b", texto: "El mensaje central que el autor quiere transmitir" },
      { id: "c", texto: "El primer párrafo del texto" },
      { id: "d", texto: "Un detalle secundario del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "La idea principal es el mensaje central o la información más importante que el autor desea comunicar. No es solo el tema general, sino el punto clave que se desarrolla a lo largo del texto.",
    categoria: "Conceptos Básicos"
  },
  {
    id: 2,
    pregunta: "¿Qué es una idea secundaria?",
    alternativas: [
      { id: "a", texto: "Ideas que no son importantes en el texto" },
      { id: "b", texto: "Ideas que complementan y apoyan la idea principal" },
      { id: "c", texto: "Ideas que contradicen la idea principal" },
      { id: "d", texto: "Ideas que aparecen al final del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Las ideas secundarias son aquellas que apoyan, explican, ejemplifican o complementan la idea principal. Son importantes porque desarrollan y sustentan el mensaje central del texto.",
    categoria: "Conceptos Básicos"
  },
  {
    id: 3,
    pregunta: "¿Qué significa hacer una inferencia al leer?",
    alternativas: [
      { id: "a", texto: "Copiar exactamente lo que dice el texto" },
      { id: "b", texto: "Deducir información que no está explícita usando pistas del texto" },
      { id: "c", texto: "Inventar ideas que no tienen relación con el texto" },
      { id: "d", texto: "Memorizar todo el contenido del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Inferir es llegar a conclusiones o deducir información que no está directamente escrita en el texto, pero que se puede descubrir usando pistas contextuales, experiencias previas y razonamiento lógico.",
    categoria: "Habilidades Lectoras"
  },
  {
    id: 4,
    pregunta: "¿Qué es un párrafo?",
    alternativas: [
      { id: "a", texto: "Una oración larga" },
      { id: "b", texto: "Un conjunto de oraciones que desarrollan una idea común" },
      { id: "c", texto: "La primera línea de un texto" },
      { id: "d", texto: "Un título del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Un párrafo es una unidad de texto formada por varias oraciones que desarrollan una idea central o temática. Generalmente comienza con sangría y termina con punto y aparte.",
    categoria: "Estructura Textual"
  },
  {
    id: 5,
    pregunta: "¿Cuál es el propósito de los conectores en un texto?",
    alternativas: [
      { id: "a", texto: "Hacer el texto más largo" },
      { id: "b", texto: "Relacionar ideas y dar coherencia al texto" },
      { id: "c", texto: "Decorar el texto" },
      { id: "d", texto: "Confundir al lector" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Los conectores (como 'sin embargo', 'además', 'por lo tanto') son palabras o expresiones que unen ideas y dan coherencia al texto, mostrando relaciones de causa, contraste, adición, secuencia, etc.",
    categoria: "Elementos del Lenguaje"
  },
  {
    id: 6,
    pregunta: "¿Qué son los sustantivos?",
    alternativas: [
      { id: "a", texto: "Palabras que expresan acciones" },
      { id: "b", texto: "Palabras que nombran personas, lugares, cosas o ideas" },
      { id: "c", texto: "Palabras que describen cualidades" },
      { id: "d", texto: "Palabras que unen oraciones" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Los sustantivos son palabras que nombran seres, objetos, lugares o conceptos abstractos. Por ejemplo: 'perro', 'casa', 'felicidad', 'Pedro'. Son fundamentales para identificar de qué o quién se habla en un texto.",
    categoria: "Gramática Básica"
  },
  {
    id: 7,
    pregunta: "¿Qué es el vocabulario contextual?",
    alternativas: [
      { id: "a", texto: "Palabras difíciles que no se entienden" },
      { id: "b", texto: "El significado de palabras que se deduce por el contexto" },
      { id: "c", texto: "Un diccionario especial" },
      { id: "d", texto: "Palabras inventadas por el autor" }
    ],
    respuestaCorrecta: "b",
    explicacion: "El vocabulario contextual se refiere a deducir el significado de palabras desconocidas usando pistas del contexto (palabras cercanas, estructura de la oración, tema del texto) sin necesidad de consultar un diccionario.",
    categoria: "Estrategias de Lectura"
  },
  {
    id: 8,
    pregunta: "¿Qué son los adjetivos?",
    alternativas: [
      { id: "a", texto: "Palabras que describen o califican sustantivos" },
      { id: "b", texto: "Palabras que indican acciones" },
      { id: "c", texto: "Palabras que reemplazan nombres" },
      { id: "d", texto: "Palabras que conectan ideas" }
    ],
    respuestaCorrecta: "a",
    explicacion: "Los adjetivos son palabras que describen o califican a los sustantivos, indicando características, cualidades o estados. Por ejemplo: 'grande', 'hermoso', 'rápido'. Enriquecen el texto con detalles descriptivos.",
    categoria: "Gramática Básica"
  },
  {
    id: 9,
    pregunta: "¿Qué es una relación de causa-efecto?",
    alternativas: [
      { id: "a", texto: "Cuando dos cosas ocurren al mismo tiempo" },
      { id: "b", texto: "Cuando un evento produce o provoca otro evento" },
      { id: "c", texto: "Cuando dos ideas son opuestas" },
      { id: "d", texto: "Cuando se comparan dos elementos" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Una relación de causa-efecto muestra cómo un evento (causa) produce o provoca otro evento (efecto). Por ejemplo: 'Llovió mucho (causa), por lo tanto las calles se inundaron (efecto)'.",
    categoria: "Relaciones Lógicas"
  },
  {
    id: 10,
    pregunta: "¿Qué significa 'sintetizar' un texto?",
    alternativas: [
      { id: "a", texto: "Leerlo muy rápido" },
      { id: "b", texto: "Resumir las ideas principales en pocas palabras" },
      { id: "c", texto: "Copiarlo textualmente" },
      { id: "d", texto: "Agregarle más información" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Sintetizar es resumir o condensar un texto expresando sus ideas principales de manera breve y clara, omitiendo detalles secundarios pero conservando el mensaje esencial.",
    categoria: "Habilidades Lectoras"
  },
  {
    id: 11,
    pregunta: "¿Qué son los verbos?",
    alternativas: [
      { id: "a", texto: "Palabras que expresan acciones, estados o procesos" },
      { id: "b", texto: "Palabras que describen cualidades" },
      { id: "c", texto: "Palabras que nombran objetos" },
      { id: "d", texto: "Palabras que conectan oraciones" }
    ],
    respuestaCorrecta: "a",
    explicacion: "Los verbos son palabras que expresan acciones (correr, escribir), estados (ser, estar) o procesos (crecer, envejecer). Son el núcleo de la oración y nos dicen qué hace o cómo está el sujeto.",
    categoria: "Gramática Básica"
  },
  {
    id: 12,
    pregunta: "¿Qué es el propósito del autor?",
    alternativas: [
      { id: "a", texto: "La edad del autor" },
      { id: "b", texto: "La intención o razón por la que el autor escribió el texto" },
      { id: "c", texto: "El lugar donde vive el autor" },
      { id: "d", texto: "El título del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "El propósito del autor es la intención que tiene al escribir: informar, persuadir, entretener, enseñar, criticar, etc. Identificar el propósito ayuda a comprender mejor el mensaje y el tono del texto.",
    categoria: "Análisis Textual"
  },
  {
    id: 13,
    pregunta: "¿Qué es comparar en un texto?",
    alternativas: [
      { id: "a", texto: "Encontrar solo las diferencias entre dos elementos" },
      { id: "b", texto: "Identificar semejanzas y diferencias entre dos o más elementos" },
      { id: "c", texto: "Copiar información de dos textos" },
      { id: "d", texto: "Elegir cuál texto es mejor" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Comparar es analizar dos o más elementos para identificar tanto sus semejanzas como sus diferencias. Esta habilidad permite comprender mejor las características de cada elemento y sus relaciones.",
    categoria: "Habilidades Lectoras"
  },
  {
    id: 14,
    pregunta: "¿Qué son los detalles específicos en un texto?",
    alternativas: [
      { id: "a", texto: "Ideas generales del texto" },
      { id: "b", texto: "Información concreta que apoya o ejemplifica ideas principales" },
      { id: "c", texto: "El título y subtítulos" },
      { id: "d", texto: "La opinión del lector" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Los detalles específicos son datos concretos, ejemplos, cifras, nombres o descripciones particulares que apoyan, ilustran o desarrollan las ideas principales del texto.",
    categoria: "Estructura Textual"
  },
  {
    id: 15,
    pregunta: "¿Qué es la coherencia en un texto?",
    alternativas: [
      { id: "a", texto: "Que el texto tenga muchas páginas" },
      { id: "b", texto: "Que las ideas estén relacionadas lógicamente y tengan sentido juntas" },
      { id: "c", texto: "Que el texto tenga muchas palabras difíciles" },
      { id: "d", texto: "Que todas las oraciones sean cortas" }
    ],
    respuestaCorrecta: "b",
    explicacion: "La coherencia es la relación lógica entre las ideas de un texto, donde cada parte se conecta con las demás de forma ordenada y comprensible. Un texto coherente tiene unidad temática y progresión lógica.",
    categoria: "Propiedades Textuales"
  },
  {
    id: 16,
    pregunta: "¿Qué es el tema de un texto?",
    alternativas: [
      { id: "a", texto: "El primer párrafo" },
      { id: "b", texto: "El asunto general del que trata el texto" },
      { id: "c", texto: "La opinión del autor" },
      { id: "d", texto: "El final del texto" }
    ],
    respuestaCorrecta: "b",
    explicacion: "El tema es el asunto general o materia de la que trata el texto. Se puede expresar en pocas palabras o una frase nominal. Por ejemplo: 'la contaminación', 'los animales marinos', 'la tecnología'.",
    categoria: "Conceptos Básicos"
  },
  {
    id: 17,
    pregunta: "¿Qué son los antónimos?",
    alternativas: [
      { id: "a", texto: "Palabras con significado similar" },
      { id: "b", texto: "Palabras con significado opuesto" },
      { id: "c", texto: "Palabras que riman" },
      { id: "d", texto: "Palabras inventadas" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Los antónimos son palabras que tienen significados opuestos. Por ejemplo: 'grande' y 'pequeño', 'feliz' y 'triste', 'rápido' y 'lento'. Conocerlos enriquece el vocabulario y ayuda a comprender contrastes.",
    categoria: "Vocabulario"
  },
  {
    id: 18,
    pregunta: "¿Qué son los sinónimos?",
    alternativas: [
      { id: "a", texto: "Palabras con significado opuesto" },
      { id: "b", texto: "Palabras con significado similar o igual" },
      { id: "c", texto: "Palabras que se escriben igual" },
      { id: "d", texto: "Palabras que se pronuncian igual" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Los sinónimos son palabras que tienen un significado similar o prácticamente igual. Por ejemplo: 'bonito' y 'hermoso', 'rápido' y 'veloz', 'casa' y 'vivienda'. Permiten variar el lenguaje sin repetir palabras.",
    categoria: "Vocabulario"
  },
  {
    id: 19,
    pregunta: "¿Qué es una conclusión en un texto?",
    alternativas: [
      { id: "a", texto: "El inicio del texto" },
      { id: "b", texto: "Una idea en el medio del texto" },
      { id: "c", texto: "El cierre o síntesis final que resume lo expuesto" },
      { id: "d", texto: "Una pregunta sin respuesta" }
    ],
    respuestaCorrecta: "c",
    explicacion: "La conclusión es la parte final del texto donde se resumen las ideas principales, se presentan reflexiones finales o se cierra el argumento. Ayuda al lector a consolidar lo aprendido.",
    categoria: "Estructura Textual"
  },
  {
    id: 20,
    pregunta: "¿Qué significa 'analizar críticamente' un texto?",
    alternativas: [
      { id: "a", texto: "Criticar negativamente al autor" },
      { id: "b", texto: "Evaluar, cuestionar y reflexionar sobre el contenido con criterio" },
      { id: "c", texto: "Leer el texto muy rápido" },
      { id: "d", texto: "Estar de acuerdo con todo lo que dice" }
    ],
    respuestaCorrecta: "b",
    explicacion: "Analizar críticamente es examinar el texto de forma reflexiva, evaluando la validez de los argumentos, identificando sesgos, cuestionando afirmaciones y formando una opinión fundamentada. No significa simplemente criticar.",
    categoria: "Pensamiento Crítico"
  }
];

// Función auxiliar para obtener todas las preguntas
export function getAllTriviaPreguntas() {
  return triviaPreguntas;
}

// Función para obtener una pregunta específica por ID
export function getPreguntaById(id) {
  return triviaPreguntas.find(p => p.id === id);
}

// Función para obtener preguntas por categoría
export function getPreguntasPorCategoria(categoria) {
  return triviaPreguntas.filter(p => p.categoria === categoria);
}

// Función para obtener un subconjunto aleatorio de preguntas
export function getPreguntasAleatorias(cantidad = 10) {
  const shuffled = [...triviaPreguntas].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, cantidad);
}
