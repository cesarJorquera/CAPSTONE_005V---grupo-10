/**
 * Textos para el Juego 2 - Clasificar Palabras (Drag & Drop)
 * 
 * Cada texto contiene:
 * - id: identificador único
 * - title: título del texto
 * - palabrasPorTipo: palabras clasificadas por tipo (verbos, sustantivos, conectores, adjetivos)
 * - espaciosTexto: estructura del texto con espacios para completar
 * 
 * IMPORTANTE: 
 * - palabraCorrectaId en espaciosTexto debe coincidir con el id en palabrasPorTipo
 * - Mantener balance: mínimo 2-3 palabras por tipo
 */

export const game2Texts = {
  drag1: {
    id: 'drag1',
    title: 'Harry Potter y el Espejo de Oesed',
    palabrasPorTipo: {
      verbos: [
        { id: 1, texto: "entregaron", tipo: "verbo", colocada: false },
        { id: 2, texto: "advirtió", tipo: "verbo", colocada: false },
        { id: 3, texto: "debían", tipo: "verbo", colocada: false },
        { id: 4, texto: "felicitó", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 5, texto: "Harry", tipo: "sustantivo", colocada: false },
        { id: 6, texto: "Espejo de Oesed", tipo: "sustantivo", colocada: false },
        { id: 7, texto: "deseos", tipo: "sustantivo", colocada: false },
        { id: 8, texto: "juicio", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 9, texto: "Después", tipo: "conector", colocada: false },
        { id: 10, texto: "ya que", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 11, texto: "equivocadas", tipo: "adjetivo", colocada: false },
        { id: 12, texto: "graves", tipo: "adjetivo", colocada: false },
        { id: 13, texto: "profundos", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 9 },
      { tipo: 'texto', texto: ' de que ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 5 },
      { tipo: 'texto', texto: ', Ron y Hermione ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 1 },
      { tipo: 'texto', texto: ' el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 6 },
      { tipo: 'texto', texto: ' a Dumbledore, el director los ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 4 },
      { tipo: 'texto', texto: ' por su valentía y les explicó que el objeto en manos ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 11 },
      { tipo: 'texto', texto: ' podría haber tenido consecuencias ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 12 },
      { tipo: 'texto', texto: ' para todos en Hogwarts. Sin embargo, les ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 2 },
      { tipo: 'texto', texto: ' que no ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 3 },
      { tipo: 'texto', texto: ' confiar nunca en sus ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 7 },
      { tipo: 'texto', texto: ' más ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 13 },
      { tipo: 'texto', texto: ', ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 10 },
      { tipo: 'texto', texto: ' a veces podían nublar el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 8 },
      { tipo: 'texto', texto: '.' }
    ]
  },
  
  drag2: {
    id: 'drag2',
    title: 'El Señor de los Anillos - La Misión de Frodo',
    palabrasPorTipo: {
      verbos: [
        { id: 14, texto: "partió", tipo: "verbo", colocada: false },
        { id: 15, texto: "advirtió", tipo: "verbo", colocada: false },
        { id: 16, texto: "salvar", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 17, texto: "Bolsón", tipo: "sustantivo", colocada: false },
        { id: 18, texto: "espíritu", tipo: "sustantivo", colocada: false },
        { id: 19, texto: "Anillo", tipo: "sustantivo", colocada: false },
        { id: 20, texto: "fuego", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 21, texto: "ya que", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 22, texto: "peligrosa", tipo: "adjetivo", colocada: false },
        { id: 23, texto: "maligno", tipo: "adjetivo", colocada: false },
        { id: 24, texto: "ardiente", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Frodo ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 17 },
      { tipo: 'texto', texto: ', un hobbit de la Comarca, ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 14 },
      { tipo: 'texto', texto: ' en una ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 22 },
      { tipo: 'texto', texto: ' misión para destruir el Anillo Único en el Monte del Destino, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 21 },
      { tipo: 'texto', texto: ' este objeto ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 23 },
      { tipo: 'texto', texto: ' corrompía su ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 18 },
      { tipo: 'texto', texto: '. El mago Gandalf siempre ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 15 },
      { tipo: 'texto', texto: ' a la Compañía del ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 19 },
      { tipo: 'texto', texto: ' que la única manera de ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 16 },
      { tipo: 'texto', texto: ' a la Tierra Media era arrojar la joya a las grietas de ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 20 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 24 },
      { tipo: 'texto', texto: '.' }
    ]
  },
  
  drag3: {
    id: 'drag3',
    title: 'Juego de Tronos - La Lucha por el Poder',
    palabrasPorTipo: {
      verbos: [
        { id: 25, texto: "luchaban", tipo: "verbo", colocada: false },
        { id: 26, texto: "gobernar", tipo: "verbo", colocada: false },
        { id: 27, texto: "advirtió", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 28, texto: "Trono", tipo: "sustantivo", colocada: false },
        { id: 29, texto: "Caminantes", tipo: "sustantivo", colocada: false },
        { id: 30, texto: "miedo", tipo: "sustantivo", colocada: false },
        { id: 31, texto: "guerra", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 32, texto: "ya que", tipo: "conector", colocada: false },
        { id: 33, texto: "Además", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 34, texto: "nobles", tipo: "adjetivo", colocada: false },
        { id: 35, texto: "honorable", tipo: "adjetivo", colocada: false },
        { id: 36, texto: "invernal", tipo: "adjetivo", colocada: false },
        { id: 37, texto: "mortal", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'En Poniente, las casas ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 34 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 25 },
      { tipo: 'texto', texto: ' constantemente por el poder y el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 28 },
      { tipo: 'texto', texto: ' de Hierro, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 32 },
      { tipo: 'texto', texto: ' deseaban ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 26 },
      { tipo: 'texto', texto: ' los Siete Reinos. ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 33 },
      { tipo: 'texto', texto: ' Ned Stark, un hombre ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 35 },
      { tipo: 'texto', texto: ', siempre ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 27 },
      { tipo: 'texto', texto: ' sobre la amenaza ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 36 },
      { tipo: 'texto', texto: '. La llegada de los ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 29 },
      { tipo: 'texto', texto: ' Blancos significaba que el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 30 },
      { tipo: 'texto', texto: ' y la ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 31 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 37 },
      { tipo: 'texto', texto: ' eran inevitables.' }
    ]
  },
  
  drag4: {
    id: 'drag4',
    title: 'Los Simpson: Homer el Misionero',
    palabrasPorTipo: {
      verbos: [
        { id: 70, texto: "huyó", tipo: "verbo", colocada: false },
        { id: 71, texto: "evitar", tipo: "verbo", colocada: false },
        { id: 72, texto: "consideraba", tipo: "verbo", colocada: false },
        { id: 73, texto: "regresarlo", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 74, texto: "deuda", tipo: "sustantivo", colocada: false },
        { id: 75, texto: "misionero", tipo: "sustantivo", colocada: false },
        { id: 76, texto: "tribu", tipo: "sustantivo", colocada: false },
        { id: 77, texto: "dios", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 78, texto: "por", tipo: "conector", colocada: false },
        { id: 79, texto: "pero", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 80, texto: "desesperado", tipo: "adjetivo", colocada: false },
        { id: 81, texto: "primitiva", tipo: "adjetivo", colocada: false },
        { id: 82, texto: "demente", tipo: "adjetivo", colocada: false },
        { id: 83, texto: "feliz", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Homer Simpson, en un intento ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 80 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 78 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 71 },
      { tipo: 'texto', texto: ' una ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 74 },
      { tipo: 'texto', texto: ', ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 70 },
      { tipo: 'texto', texto: ' de Springfield para convertirse en ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 75 },
      { tipo: 'texto', texto: ' en Micronesia. La ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 81 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 76 },
      { tipo: 'texto', texto: ' que lo conoció allí lo ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 72 },
      { tipo: 'texto', texto: ' un ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 77 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 82 },
      { tipo: 'texto', texto: '. El Padre Lovejoy intentó ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 73 },
      { tipo: 'texto', texto: ', ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 79 },
      { tipo: 'texto', texto: ' Marge le advirtió que su familia estaba ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 83 },
      { tipo: 'texto', texto: ' sin él.' }
    ]
  },
  
  drag5: {
    id: 'drag5',
    title: 'Star Wars: La Fuerza y el Lado Oscuro',
    palabrasPorTipo: {
      verbos: [
        { id: 56, texto: "descubrió", tipo: "verbo", colocada: false },
        { id: 57, texto: "debía", tipo: "verbo", colocada: false },
        { id: 58, texto: "intentaba", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 60, texto: "Luke Skywalker", tipo: "sustantivo", colocada: false },
        { id: 61, texto: "Imperio Galáctico", tipo: "sustantivo", colocada: false },
        { id: 62, texto: "Darth Vader", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 64, texto: "que", tipo: "conector", colocada: false },
        { id: 65, texto: "para", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 66, texto: "joven", tipo: "adjetivo", colocada: false },
        { id: 67, texto: "maligno", tipo: "adjetivo", colocada: false },
        { id: 68, texto: "constante", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 60 },
      { tipo: 'texto', texto: ', un ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 66 },
      { tipo: 'texto', texto: ' granjero, ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 56 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 64 },
      { tipo: 'texto', texto: ' podía sentir la Fuerza y ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 57 },
      { tipo: 'texto', texto: ' unirse a los Rebeldes ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 65 },
      { tipo: 'texto', texto: ' combatir al ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 61 },
      { tipo: 'texto', texto: '. ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 62 },
      { tipo: 'texto', texto: ', su ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 67 },
      { tipo: 'texto', texto: ' padre, ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 58 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 68 },
      { tipo: 'texto', texto: 'mente que Luke cayera en el Lado Oscuro.' }
    ]
  },
  
  drag6: {
    id: 'drag6',
    title: 'The Matrix: La Píldora Roja',
    palabrasPorTipo: {
      verbos: [
        { id: 84, texto: "descubrió", tipo: "verbo", colocada: false },
        { id: 85, texto: "ofreció", tipo: "verbo", colocada: false },
        { id: 86, texto: "permitiría", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 88, texto: "programador", tipo: "sustantivo", colocada: false },
        { id: 89, texto: "ilusión", tipo: "sustantivo", colocada: false },
        { id: 90, texto: "líder", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 92, texto: "que", tipo: "conector", colocada: false },
        { id: 93, texto: "o", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 94, texto: "solitario", tipo: "adjetivo", colocada: false },
        { id: 95, texto: "enigmático", tipo: "adjetivo", colocada: false },
        { id: 97, texto: "falsa", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Neo, un ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 88 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 94 },
      { tipo: 'texto', texto: ', ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 84 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 92 },
      { tipo: 'texto', texto: ' el mundo era una ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 89 },
      { tipo: 'texto', texto: ' controlada por máquinas. Morfeo, su ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 95 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 90 },
      { tipo: 'texto', texto: ', le ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 85 },
      { tipo: 'texto', texto: ' una píldora roja que le ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 86 },
      { tipo: 'texto', texto: ' despertar de la Matrix ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 93 },
      { tipo: 'texto', texto: ' seguir viviendo una vida ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 97 },
      { tipo: 'texto', texto: '.' }
    ]
  },
  
  drag7: {
    id: 'drag7',
    title: 'Titanic: El Amor y el Hielo',
    palabrasPorTipo: {
      verbos: [
        { id: 98, texto: "enamoró", tipo: "verbo", colocada: false },
        { id: 99, texto: "buscaba", tipo: "verbo", colocada: false },
        { id: 100, texto: "intentó", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 102, texto: "artista", tipo: "sustantivo", colocada: false },
        { id: 103, texto: "destino", tipo: "sustantivo", colocada: false },
        { id: 104, texto: "nave", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 106, texto: "ya que", tipo: "conector", colocada: false },
        { id: 107, texto: "pero", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 108, texto: "humilde", tipo: "adjetivo", colocada: false },
        { id: 109, texto: "lujoso", tipo: "adjetivo", colocada: false },
        { id: 111, texto: "inevitable", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Jack Dawson, un ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 102 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 108 },
      { tipo: 'texto', texto: ', se ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 98 },
      { tipo: 'texto', texto: ' de Rose a bordo del ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 109 },
      { tipo: 'texto', texto: ' Titanic, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 106 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 99 },
      { tipo: 'texto', texto: ' una nueva vida en América. El ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 103 },
      { tipo: 'texto', texto: ', sin embargo, tenía otros planes para la colosal ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 104 },
      { tipo: 'texto', texto: '. El capitán ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 100 },
      { tipo: 'texto', texto: ' evitar el hielo flotante, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 107 },
      { tipo: 'texto', texto: ' la catástrofe fue completamente ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 111 },
      { tipo: 'texto', texto: '.' }
    ]
  },
  
  drag8: {
    id: 'drag8',
    title: 'Friends: La Amistad en Manhattan',
    palabrasPorTipo: {
      verbos: [
        { id: 112, texto: "compartían", tipo: "verbo", colocada: false },
        { id: 113, texto: "intentaban", tipo: "verbo", colocada: false },
        { id: 114, texto: "tuvieron", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 116, texto: "alegrías", tipo: "sustantivo", colocada: false },
        { id: 117, texto: "carreras", tipo: "sustantivo", colocada: false },
        { id: 118, texto: "relación", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 120, texto: "mientras", tipo: "conector", colocada: false },
        { id: 121, texto: "donde", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 122, texto: "inseparables", tipo: "adjetivo", colocada: false },
        { id: 123, texto: "complicadas", tipo: "adjetivo", colocada: false },
        { id: 124, texto: "romántica", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'En Manhattan, seis amigos ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 122 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 112 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 116 },
      { tipo: 'texto', texto: ' y penas ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 120 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 113 },
      { tipo: 'texto', texto: ' avanzar en sus diversas y ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 123 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 117 },
      { tipo: 'texto', texto: '. Rachel y Ross ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 114 },
      { tipo: 'texto', texto: ' una ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 118 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 124 },
      { tipo: 'texto', texto: ' caótica en el Central Perk, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 121 },
      { tipo: 'texto', texto: ' todos se reunían diariamente.' }
    ]
  },
  
  drag9: {
    id: 'drag9',
    title: 'Breaking Bad: El Profesor y el Químico',
    palabrasPorTipo: {
      verbos: [
        { id: 126, texto: "decidió", tipo: "verbo", colocada: false },
        { id: 127, texto: "fabricar", tipo: "verbo", colocada: false },
        { id: 128, texto: "diagnosticaron", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 130, texto: "profesor", tipo: "sustantivo", colocada: false },
        { id: 131, texto: "ambición", tipo: "sustantivo", colocada: false },
        { id: 132, texto: "negocio", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 134, texto: "cuando", tipo: "conector", colocada: false },
        { id: 135, texto: "aunque", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 137, texto: "grave", tipo: "adjetivo", colocada: false },
        { id: 138, texto: "metódico", tipo: "adjetivo", colocada: false },
        { id: 139, texto: "clandestino", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Walter White, un ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 130 },
      { tipo: 'texto', texto: ' de química, ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 126 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 127 },
      { tipo: 'texto', texto: ' drogas ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 134 },
      { tipo: 'texto', texto: ' le ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 128 },
      { tipo: 'texto', texto: ' una ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 137 },
      { tipo: 'texto', texto: ' enfermedad. Su ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 131 },
      { tipo: 'texto', texto: ' lo hizo un criminal ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 138 },
      { tipo: 'texto', texto: '. Jesse Pinkman lo ayudó constantemente en el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 132 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 139 },
      { tipo: 'texto', texto: ', ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 135 },
      { tipo: 'texto', texto: ' sabían que su destino era fatal.' }
    ]
  },
  
  drag10: {
    id: 'drag10',
    title: 'The Mandalorian: Din Djarin y Grogu',
    palabrasPorTipo: {
      verbos: [
        { id: 140, texto: "contratado", tipo: "verbo", colocada: false },
        { id: 141, texto: "entregar", tipo: "verbo", colocada: false },
        { id: 142, texto: "convirtió", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 144, texto: "cazarrecompensas", tipo: "sustantivo", colocada: false },
        { id: 145, texto: "especie", tipo: "sustantivo", colocada: false },
        { id: 146, texto: "protector", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 148, texto: "para", tipo: "conector", colocada: false },
        { id: 149, texto: "por lo tanto", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 150, texto: "solitario", tipo: "adjetivo", colocada: false },
        { id: 151, texto: "especiales", tipo: "adjetivo", colocada: false },
        { id: 152, texto: "antiguos", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Din Djarin, un ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 144 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 150 },
      { tipo: 'texto', texto: ', fue ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 140 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 148 },
      { tipo: 'texto', texto: ' ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 141 },
      { tipo: 'texto', texto: ' a un niño, Grogu, ya que su ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 145 },
      { tipo: 'texto', texto: ' tenía poderes ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 151 },
      { tipo: 'texto', texto: '. El Mandaloriano se ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 142 },
      { tipo: 'texto', texto: ' en el ' },
      { tipo: 'espacio', tipoRequerido: 'sustantivo', palabraColocada: null, palabraCorrectaId: 146 },
      { tipo: 'texto', texto: ' del pequeño. Los ' },
      { tipo: 'espacio', tipoRequerido: 'adjetivo', palabraColocada: null, palabraCorrectaId: 152 },
      { tipo: 'texto', texto: ' enemigos de Grogu querían usar su fuerza, ' },
      { tipo: 'espacio', tipoRequerido: 'conector', palabraColocada: null, palabraCorrectaId: 149 },
      { tipo: 'texto', texto: ' el dúo siempre viajaba secretamente.' }
    ]
  },
  
  // PLANTILLA para agregar más textos:
  /*
  drag2: {
    id: 'drag2',
    title: 'Título del nuevo texto',
    palabrasPorTipo: {
      verbos: [
        { id: 20, texto: "verbo1", tipo: "verbo", colocada: false },
        { id: 21, texto: "verbo2", tipo: "verbo", colocada: false }
      ],
      sustantivos: [
        { id: 22, texto: "sustantivo1", tipo: "sustantivo", colocada: false },
        { id: 23, texto: "sustantivo2", tipo: "sustantivo", colocada: false }
      ],
      conectores: [
        { id: 24, texto: "conector1", tipo: "conector", colocada: false }
      ],
      adjetivos: [
        { id: 25, texto: "adjetivo1", tipo: "adjetivo", colocada: false }
      ]
    },
    espaciosTexto: [
      { tipo: 'texto', texto: 'Comienza el texto ' },
      { tipo: 'espacio', tipoRequerido: 'verbo', palabraColocada: null, palabraCorrectaId: 20 },
      { tipo: 'texto', texto: ' continúa...' }
    ]
  }
  */
}

/**
 * Obtener texto por ID
 * @param {string} textId - ID del texto (ej: 'drag1')
 * @returns {object|null} - Objeto del texto o null si no existe
 */
export function getGame2TextById(textId) {
  return game2Texts[textId] || null
}

/**
 * Obtener lista de todos los textos disponibles
 * @returns {array} - Array de textos con id y title
 */
export function getAllGame2Texts() {
  return Object.values(game2Texts).map(text => ({
    id: text.id,
    title: text.title
  }))
}

/**
 * Obtener el siguiente texto disponible
 * @param {string} currentTextId - ID del texto actual
 * @returns {object|null} - Siguiente texto o null si es el último
 */
export function getNextGame2Text(currentTextId) {
  const textIds = Object.keys(game2Texts)
  const currentIndex = textIds.indexOf(currentTextId)
  
  if (currentIndex === -1 || currentIndex === textIds.length - 1) {
    return null
  }
  
  return game2Texts[textIds[currentIndex + 1]]
}

/**
 * Validar que un texto tenga la estructura correcta
 * @param {object} texto - Objeto del texto a validar
 * @returns {object} - { valid: boolean, errors: array }
 */
export function validateGame2Text(texto) {
  const errors = []
  
  if (!texto.id) errors.push('Falta el ID del texto')
  if (!texto.title) errors.push('Falta el título del texto')
  if (!texto.palabrasPorTipo) errors.push('Falta palabrasPorTipo')
  if (!texto.espaciosTexto) errors.push('Falta espaciosTexto')
  
  // Validar que todos los IDs de palabras correctas existan
  if (texto.palabrasPorTipo && texto.espaciosTexto) {
    const allPalabraIds = []
    Object.values(texto.palabrasPorTipo).forEach(palabras => {
      palabras.forEach(p => allPalabraIds.push(p.id))
    })
    
    texto.espaciosTexto.forEach((espacio, index) => {
      if (espacio.tipo === 'espacio' && espacio.palabraCorrectaId) {
        if (!allPalabraIds.includes(espacio.palabraCorrectaId)) {
          errors.push(`Espacio ${index}: palabraCorrectaId ${espacio.palabraCorrectaId} no existe en palabrasPorTipo`)
        }
      }
    })
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
