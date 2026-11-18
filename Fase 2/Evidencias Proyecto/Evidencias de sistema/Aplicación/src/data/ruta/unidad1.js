// src/data/ruta/unidad1.js
// Unidad 1 de la ruta "Lector Experto": Las palabras.
// Solo datos (sin imports ni funciones). Los ids NO se cambian una vez que haya progreso guardado en Supabase.

// Texto del desafío: se usa en varios pasos, por eso va una sola vez aquí.
const TEXTO_DESAFIO = [
  'Camila', 'trabaja', 'en', 'una', 'panadería', '.', //  0-5
  'Todos', 'los', 'días', 'llega', 'temprano', 'y', 'prepara', 'el', 'pan', '.', //  6-15
  'El', 'horno', 'es', 'grande', 'y', 'muy', 'caliente', '.', // 16-23
  'Hoy', 'está', 'cansada', ',', 'pero', 'contenta', ',', 'porque', 'vendió', 'todo', '.', // 24-34
]

export default {
  id: 'u1',
  gameId: 5, // fila en public.games (migración 004)
  titulo: 'Las palabras',
  descripcion: 'Descubre qué hace cada palabra en una frase.',

  // El orden del array es el orden del camino.
  // Bloquean al siguiente: aprende, practica y desafio. El opcional no bloquea.
  nodos: [
    { id: 'u1-n1', tipo: 'aprende', titulo: '¿Quién es? Los sustantivos', tareaId: 'u1-sustantivos' },
    { id: 'u1-n2', tipo: 'aprende', titulo: '¿Qué hace? Los verbos', tareaId: 'u1-verbos' },
    { id: 'u1-n3', tipo: 'practica', titulo: '¿Quién y qué hace?', tareaId: 'u1-practica1' },
    { id: 'u1-n4', tipo: 'aprende', titulo: '¿Cómo es? Los adjetivos', tareaId: 'u1-adjetivos' },
    { id: 'u1-n5', tipo: 'opcional', titulo: 'Detective de palabras', tareaId: 'u1-detective' },
    { id: 'u1-n6', tipo: 'aprende', titulo: 'Palabras que unen: y, pero, porque', tareaId: 'u1-conectores' },
    { id: 'u1-n7', tipo: 'practica', titulo: '¿Qué palabra falta?', tareaId: 'u1-practica2' },
    { id: 'u1-n8', tipo: 'desafio', titulo: 'Desafío: Las palabras', tareaId: 'u1-desafio' },
  ],

  tareas: {
    // ===================== SUSTANTIVOS =====================
    'u1-sustantivos': {
      id: 'u1-sustantivos',
      titulo: '¿Quién es? Los sustantivos',
      codigo: 'language.noun',
      minutos: 4,
      pasos: [
        {
          id: 'u1-sustantivos-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Un sustantivo es una palabra que sirve para nombrar: personas, animales, cosas y lugares. Por ejemplo: profesora, perro, celular, estadio. Los nombres propios, como Javiera o Melipilla, también son sustantivos.',
          },
        },
        {
          id: 'u1-sustantivos-p2',
          tipo: 'explica',
          ejercicio: {
            texto: 'En esta oración hay tres sustantivos: una persona, una cosa y un lugar.',
            palabras: ['Mi', 'amiga', 'dejó', 'la', 'mochila', 'en', 'el', 'casino', '.'],
            evidencia: [1, 4, 7], // 'amiga', 'mochila', 'casino'
          },
        },
        {
          id: 'u1-sustantivos-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca los 2 sustantivos.',
            palabras: ['Javiera', 'compró', 'audífonos', 'nuevos', '.'],
            correctas: [0, 2], // 'Javiera', 'audífonos'
            pista: 'Pregúntate: ¿quién compró? ¿Qué compró?',
          },
        },
        {
          id: 'u1-sustantivos-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuál es el sustantivo en esta oración?',
            palabras: ['Hoy', 'llueve', 'mucho', 'en', 'Melipilla', '.'],
            opciones: ['llueve', 'mucho', 'Melipilla', 'Hoy'],
            correcta: 2, // 'Melipilla' (índice en opciones)
            evidencia: [4], // 'Melipilla' (índice en palabras)
            pista: 'Busca la palabra que nombra un lugar.',
          },
        },
        {
          id: 'u1-sustantivos-p5',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            afirmacion: '"Corre" es un sustantivo.',
            correcta: false,
            pista: '¿"Corre" nombra a alguien o algo, o dice lo que alguien hace?',
          },
        },
        {
          id: 'u1-sustantivos-p6',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuáles de estas palabras son sustantivos?',
            cajas: [
              { id: 'sustantivo', titulo: 'Es sustantivo' },
              { id: 'otro', titulo: 'No es sustantivo' },
            ],
            fichas: [
              { texto: 'profesor', caja: 'sustantivo' },
              { texto: 'escribe', caja: 'otro' },
              { texto: 'computador', caja: 'sustantivo' },
              { texto: 'feliz', caja: 'otro' },
              { texto: 'Valparaíso', caja: 'sustantivo' },
              { texto: 'nunca', caja: 'otro' },
            ],
            pista: 'Por cada palabra pregúntate: ¿nombra una persona, un animal, una cosa o un lugar?',
          },
        },
        {
          id: 'u1-sustantivos-p7',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe el sustantivo que nombra un LUGAR.',
            palabras: ['Mañana', 'vamos', 'al', 'estadio', 'con', 'mi', 'primo', '.'],
            correcta: 3, // 'estadio'
            evidencia: [3],
          },
        },
        {
          id: 'u1-sustantivos-p8',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              'Los sustantivos nombran personas, animales, cosas y lugares.',
              'Para encontrarlos, pregunta: ¿quién? o ¿qué?',
              'Los nombres propios (Javiera, Melipilla) también son sustantivos y van con mayúscula.',
            ],
          },
        },
      ],
    },

    // ======================= VERBOS =======================
    'u1-verbos': {
      id: 'u1-verbos',
      titulo: '¿Qué hace? Los verbos',
      codigo: 'language.verb',
      minutos: 4,
      pasos: [
        {
          id: 'u1-verbos-recordemos',
          tipo: 'vf',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos los sustantivos.',
            afirmacion: '"Celular" es un sustantivo.',
            correcta: true,
            pista: 'Un sustantivo nombra una persona, un animal, una cosa o un lugar. ¿El celular es una cosa?',
          },
        },
        {
          id: 'u1-verbos-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Un verbo es una palabra que dice lo que alguien HACE o lo que PASA. Por ejemplo: estudiar, comer, llegar, llover.',
          },
        },
        {
          id: 'u1-verbos-p2',
          tipo: 'explica',
          ejercicio: {
            texto: 'Mira esta oración. La palabra resaltada dice lo que hace mi hermana.',
            palabras: ['Mi', 'hermana', 'escucha', 'música', '.'],
            evidencia: [2], // 'escucha'
          },
        },
        {
          id: 'u1-verbos-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca el verbo.',
            palabras: ['El', 'bus', 'llega', 'a', 'las', 'ocho', '.'],
            correctas: [2], // 'llega'
            pista: '¿Qué hace el bus?',
          },
        },
        {
          id: 'u1-verbos-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuál es el verbo en esta oración?',
            palabras: ['Diego', 'juega', 'fútbol', 'los', 'sábados', '.'],
            opciones: ['Diego', 'juega', 'fútbol', 'sábados'],
            correcta: 1, // 'juega' (índice en opciones)
            evidencia: [1], // 'juega' (índice en palabras)
            pista: 'El verbo es lo que Diego HACE.',
          },
        },
        {
          id: 'u1-verbos-p5',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuál es el verbo en esta oración?',
            palabras: ['Camila', 'estudia', 'en', 'la', 'biblioteca', '.'],
            opciones: ['Camila', 'biblioteca', 'estudia', 'en'],
            correcta: 2, // 'estudia' (índice en opciones)
            evidencia: [1], // 'estudia' (índice en palabras)
            pista: 'Pregúntate: ¿qué hace Camila?',
          },
        },
        {
          id: 'u1-verbos-clasificar',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuáles de estas palabras son verbos?',
            cajas: [
              { id: 'verbo', titulo: 'Es verbo' },
              { id: 'otro', titulo: 'No es verbo' },
            ],
            fichas: [
              { texto: 'estudia', caja: 'verbo' },
              { texto: 'micro', caja: 'otro' },
              { texto: 'escucha', caja: 'verbo' },
              { texto: 'rápido', caja: 'otro' },
              { texto: 'trabaja', caja: 'verbo' },
              { texto: 'celular', caja: 'otro' },
            ],
            pista: 'Pregúntate por cada palabra: ¿es algo que alguien hace?',
          },
        },
        {
          id: 'u1-verbos-p6',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe el verbo de esta oración.',
            palabras: ['Mi', 'hermano', 'trabaja', 'en', 'un', 'taller', '.'],
            correcta: 2, // 'trabaja'
            evidencia: [2],
          },
        },
        {
          id: 'u1-verbos-p7',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              'Los verbos dicen lo que alguien hace o lo que pasa.',
              'Para encontrarlo, pregunta: ¿qué hace?',
            ],
          },
        },
      ],
    },
        // ================== PRÁCTICA 1 ==================
    'u1-practica1': {
      id: 'u1-practica1',
      titulo: '¿Quién y qué hace?',
      codigo: 'language.word_classification',
      minutos: 4,
      pasos: [
        {
          id: 'u1-practica1-recordemos',
          tipo: 'vf',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos los verbos.',
            afirmacion: '"Llueve" es un verbo.',
            correcta: true,
            pista: 'Un verbo dice lo que alguien hace o lo que pasa. ¿Llover es algo que pasa?',
          },
        },
        {
          id: 'u1-practica1-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'En una oración, el sustantivo dice QUIÉN y el verbo dice QUÉ HACE. Ahora vas a practicar los dos juntos.',
            palabras: ['Benjamín', 'maneja', 'un', 'camión', '.'],
            evidencia: [0, 1], // 'Benjamín' (quién), 'maneja' (qué hace)
          },
        },
        {
          id: 'u1-practica1-p2',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca el sustantivo que dice QUIÉN hace la acción.',
            palabras: ['La', 'enfermera', 'atiende', 'a', 'los', 'pacientes', '.'],
            correctas: [1], // 'enfermera'
            pista: 'Pregúntate: ¿quién atiende?',
          },
        },
        {
          id: 'u1-practica1-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Ahora toca el verbo.',
            palabras: ['Los', 'vecinos', 'arreglaron', 'la', 'plaza', '.'],
            correctas: [2], // 'arreglaron'
            pista: 'Pregúntate: ¿qué hicieron los vecinos?',
          },
        },
        {
          id: 'u1-practica1-p4',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Ordena las palabras: ¿sustantivo o verbo?',
            cajas: [
              { id: 'sustantivo', titulo: 'Sustantivo (quién o qué)' },
              { id: 'verbo', titulo: 'Verbo (qué hace)' },
            ],
            fichas: [
              { texto: 'guitarra', caja: 'sustantivo' },
              { texto: 'canta', caja: 'verbo' },
              { texto: 'Antofagasta', caja: 'sustantivo' },
              { texto: 'lava', caja: 'verbo' },
              { texto: 'perro', caja: 'sustantivo' },
              { texto: 'duerme', caja: 'verbo' },
            ],
            pista: 'Si nombra a alguien o algo, es sustantivo. Si dice lo que alguien hace, es verbo.',
          },
        },
        {
          id: 'u1-practica1-p5',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué hace Martina?',
            palabras: ['Martina', 'vende', 'empanadas', 'en', 'la', 'feria', '.'],
            opciones: ['vende', 'empanadas', 'feria', 'Martina'],
            correcta: 0, // 'vende' (índice en opciones)
            evidencia: [1], // 'vende' (índice en palabras)
            pista: 'La pregunta es "¿qué hace?": busca el verbo.',
          },
        },
        {
          id: 'u1-practica1-p6',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            afirmacion: 'En "El profesor explica la materia", la palabra "explica" es un sustantivo.',
            correcta: false,
            pista: '"Explica" dice lo que hace el profesor. ¿Eso es un sustantivo o un verbo?',
          },
        },
        {
          id: 'u1-practica1-p7',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe el sustantivo que dice QUIÉN hace la acción.',
            palabras: ['El', 'mecánico', 'revisó', 'los', 'frenos', '.'],
            correcta: 1, // 'mecánico'
            evidencia: [1],
          },
        },
        {
          id: 'u1-practica1-p8',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              'El sustantivo dice QUIÉN (o qué). El verbo dice QUÉ HACE.',
              'Una oración puede tener varios sustantivos: pregúntate cuál hace la acción.',
            ],
          },
        },
      ],
    },

    // ===================== ADJETIVOS =====================
    'u1-adjetivos': {
      id: 'u1-adjetivos',
      titulo: '¿Cómo es? Los adjetivos',
      codigo: 'language.adjective',
      minutos: 4,
      pasos: [
        {
          id: 'u1-adjetivos-recordemos',
          tipo: 'vf',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos.',
            afirmacion: 'En "Mi tío arregla autos", la palabra "tío" es un sustantivo.',
            correcta: true,
            pista: '¿"Tío" nombra a una persona?',
          },
        },
        {
          id: 'u1-adjetivos-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Un adjetivo es una palabra que dice CÓMO ES algo o alguien: su color, tamaño, forma o manera de ser. Por ejemplo: rojo, grande, redondo, simpático.',
          },
        },
        {
          id: 'u1-adjetivos-p2',
          tipo: 'explica',
          ejercicio: {
            texto: 'La palabra resaltada dice cómo es la chaqueta.',
            palabras: ['Me', 'compré', 'una', 'chaqueta', 'negra', '.'],
            evidencia: [4], // 'negra'
          },
        },
        {
          id: 'u1-adjetivos-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca el adjetivo.',
            palabras: ['El', 'examen', 'fue', 'difícil', '.'],
            correctas: [3], // 'difícil'
            pista: 'Pregúntate: ¿cómo fue el examen?',
          },
        },
        {
          id: 'u1-adjetivos-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Cuál es el adjetivo en esta oración?',
            palabras: ['Tengo', 'un', 'perro', 'muy', 'juguetón', '.'],
            opciones: ['perro', 'juguetón', 'Tengo', 'muy'],
            correcta: 1, // 'juguetón' (índice en opciones)
            evidencia: [4], // 'juguetón' (índice en palabras)
            pista: 'Pregúntate: ¿cómo es el perro?',
          },
        },
        {
          id: 'u1-adjetivos-p5',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca los 2 adjetivos.',
            palabras: ['La', 'pieza', 'es', 'pequeña', 'pero', 'luminosa', '.'],
            correctas: [3, 5], // 'pequeña', 'luminosa'
            pista: 'Busca las dos palabras que dicen cómo es la pieza.',
          },
        },
        {
          id: 'u1-adjetivos-p6',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Ordena las palabras en su caja.',
            cajas: [
              { id: 'sustantivo', titulo: 'Sustantivo (quién o qué)' },
              { id: 'verbo', titulo: 'Verbo (qué hace)' },
              { id: 'adjetivo', titulo: 'Adjetivo (cómo es)' },
            ],
            fichas: [
              { texto: 'zapatillas', caja: 'sustantivo' },
              { texto: 'cómodas', caja: 'adjetivo' },
              { texto: 'corre', caja: 'verbo' },
              { texto: 'alto', caja: 'adjetivo' },
              { texto: 'ciudad', caja: 'sustantivo' },
              { texto: 'escribe', caja: 'verbo' },
            ],
            pista: 'Usa las tres preguntas: ¿quién o qué?, ¿qué hace?, ¿cómo es?',
          },
        },
        {
          id: 'u1-adjetivos-p7',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe el adjetivo de esta oración.',
            palabras: ['La', 'micro', 'venía', 'llena', '.'],
            correcta: 3, // 'llena'
            evidencia: [3],
          },
        },
        {
          id: 'u1-adjetivos-p8',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              'Los adjetivos dicen cómo es algo o alguien.',
              'Para encontrarlo, pregunta: ¿cómo es?',
              'Casi siempre acompañan a un sustantivo: chaqueta negra, examen difícil.',
            ],
          },
        },
      ],
    },
        // ============ DETECTIVE (PRÁCTICA OPCIONAL) ============
    'u1-detective': {
      id: 'u1-detective',
      titulo: 'Detective de palabras',
      codigo: 'language.word_classification',
      minutos: 4,
      pasos: [
        {
          id: 'u1-detective-recordemos',
          tipo: 'vf',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos los adjetivos.',
            afirmacion: '"Cansado" es un adjetivo.',
            correcta: true,
            pista: '¿"Cansado" dice cómo está alguien?',
          },
        },
        {
          id: 'u1-detective-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Modo detective: en cada oración hay sustantivos, verbos y adjetivos escondidos. Usa tus tres preguntas: ¿quién o qué?, ¿qué hace?, ¿cómo es?',
          },
        },
        {
          id: 'u1-detective-p2',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Ordena las palabras en su caja.',
            cajas: [
              { id: 'sustantivo', titulo: 'Sustantivo (quién o qué)' },
              { id: 'verbo', titulo: 'Verbo (qué hace)' },
              { id: 'adjetivo', titulo: 'Adjetivo (cómo es)' },
            ],
            fichas: [
              { texto: 'celular', caja: 'sustantivo' },
              { texto: 'nuevo', caja: 'adjetivo' },
              { texto: 'suena', caja: 'verbo' },
              { texto: 'bus', caja: 'sustantivo' },
              { texto: 'lento', caja: 'adjetivo' },
              { texto: 'frena', caja: 'verbo' },
            ],
            pista: 'Usa las tres preguntas: ¿quién o qué?, ¿qué hace?, ¿cómo es?',
          },
        },
        {
          id: 'u1-detective-p3',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué tipo de palabra es "ordenada"?',
            palabras: ['Mi', 'pieza', 'está', 'ordenada', '.'],
            opciones: ['Sustantivo', 'Verbo', 'Adjetivo'],
            correcta: 2, // 'Adjetivo'
            evidencia: [3], // 'ordenada'
            pista: '"Ordenada" dice cómo está la pieza.',
          },
        },
        {
          id: 'u1-detective-p4',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca el verbo.',
            palabras: ['Los', 'estudiantes', 'nuevos', 'llegaron', 'temprano', '.'],
            correctas: [3], // 'llegaron'
            pista: '¿Qué hicieron los estudiantes? Ojo: "nuevos" dice cómo son.',
          },
        },
        {
          id: 'u1-detective-p5',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            afirmacion: 'En "La sopa está caliente", la palabra "caliente" es un verbo.',
            correcta: false,
            pista: '"Caliente" dice cómo está la sopa. ¿Qué tipo de palabra dice cómo es algo?',
          },
        },
        {
          id: 'u1-detective-p6',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué tipo de palabra es "Rancagua"?',
            palabras: ['Viajamos', 'a', 'Rancagua', 'en', 'tren', '.'],
            opciones: ['Sustantivo', 'Verbo', 'Adjetivo'],
            correcta: 0, // 'Sustantivo'
            evidencia: [2], // 'Rancagua'
            pista: 'Es el nombre de un lugar.',
          },
        },
        {
          id: 'u1-detective-p7',
          tipo: 'tocar',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Toca el adjetivo.',
            palabras: ['Ese', 'gato', 'negro', 'duerme', 'en', 'el', 'sillón', '.'],
            correctas: [2], // 'negro'
          },
        },
        {
          id: 'u1-detective-p8',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              '¿Quién o qué? → sustantivo. ¿Qué hace? → verbo. ¿Cómo es? → adjetivo.',
              'Una misma oración suele tener los tres tipos de palabras.',
            ],
          },
        },
      ],
    },

    // ===================== CONECTORES =====================
    'u1-conectores': {
      id: 'u1-conectores',
      titulo: 'Palabras que unen: y, pero, porque',
      codigo: 'language.connector',
      minutos: 5,
      pasos: [
        {
          id: 'u1-conectores-recordemos',
          tipo: 'elegir',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos. ¿Cuál es el adjetivo?',
            palabras: ['El', 'café', 'está', 'frío', '.'],
            opciones: ['café', 'está', 'frío', 'El'],
            correcta: 2, // 'frío' (índice en opciones)
            evidencia: [3], // 'frío' (índice en palabras)
            pista: 'Pregúntate: ¿cómo está el café?',
          },
        },
        {
          id: 'u1-conectores-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Los conectores son palabras que UNEN ideas. Hoy veremos tres: "y" suma ideas, "pero" muestra algo contrario o inesperado, y "porque" explica una causa.',
          },
        },
        {
          id: 'u1-conectores-p2',
          tipo: 'explica',
          ejercicio: {
            texto: 'Mira cómo "pero" une dos ideas que chocan: quería salir, pero algo lo impidió.',
            palabras: ['Quería', 'salir', ',', 'pero', 'estaba', 'lloviendo', '.'],
            evidencia: [3], // 'pero'
          },
        },
        {
          id: 'u1-conectores-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca el conector.',
            palabras: ['Llegué', 'tarde', 'porque', 'perdí', 'la', 'micro', '.'],
            correctas: [2], // 'porque'
            pista: 'Busca la palabra que une las dos ideas.',
          },
        },
        {
          id: 'u1-conectores-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué conector completa la oración?',
            palabras: ['Compré', 'pan', '___', 'queso', '.'],
            opciones: ['y', 'pero', 'porque'],
            correcta: 0, // 'y'
            pista: 'Solo estás sumando cosas a la compra.',
          },
        },
        {
          id: 'u1-conectores-p5',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué conector completa la oración?',
            palabras: ['Estudié', 'mucho', ',', '___', 'me', 'fue', 'mal', 'en', 'la', 'prueba', '.'],
            opciones: ['y', 'pero', 'porque'],
            correcta: 1, // 'pero'
            pista: 'Estudiar mucho y que te vaya mal es algo inesperado.',
          },
        },
        {
          id: 'u1-conectores-p6',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué conector completa la oración?',
            palabras: ['No', 'fui', 'a', 'clases', '___', 'estaba', 'enfermo', '.'],
            opciones: ['y', 'pero', 'porque'],
            correcta: 2, // 'porque'
            pista: 'La segunda parte explica POR QUÉ no fue.',
          },
        },
        {
          id: 'u1-conectores-p7',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            afirmacion: 'En "Corrí, pero igual perdí la micro", la palabra "pero" muestra algo contrario a lo esperado.',
            correcta: true,
            pista: 'Corrí para alcanzarla… ¿y qué pasó al final?',
          },
        },
        {
          id: 'u1-conectores-p8',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe el conector de esta oración.',
            palabras: ['Me', 'quedé', 'en', 'casa', 'porque', 'hacía', 'frío', '.'],
            correcta: 4, // 'porque'
            evidencia: [4],
          },
        },
        {
          id: 'u1-conectores-p9',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              '"y" suma ideas. "pero" muestra algo contrario. "porque" explica una causa.',
              'Ojo: "porque" (junto, sin tilde) explica. "¿Por qué?" (separado y con tilde) pregunta.',
            ],
          },
        },
      ],
    },
        // ================== PRÁCTICA 2 ==================
    'u1-practica2': {
      id: 'u1-practica2',
      titulo: '¿Qué palabra falta?',
      codigo: 'language.word_classification',
      minutos: 4,
      pasos: [
        {
          id: 'u1-practica2-recordemos',
          tipo: 'vf',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos los conectores.',
            afirmacion: 'En "No salí porque llovía", la palabra "porque" explica una causa.',
            correcta: true,
            pista: '¿La segunda parte explica POR QUÉ no salí?',
          },
        },
        {
          id: 'u1-practica2-p1',
          tipo: 'explica',
          ejercicio: {
            texto: 'Cuando falta una palabra, el resto de la oración te da pistas. Aquí falta algo que HACE el perro toda la noche: un verbo, como "ladra".',
            palabras: ['El', 'perro', '___', 'toda', 'la', 'noche', '.'],
          },
        },
        {
          id: 'u1-practica2-p2',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué palabra completa la oración?',
            palabras: ['Mi', 'hermana', '___', 'en', 'un', 'supermercado', '.'],
            opciones: ['trabaja', 'rápida', 'mesa', 'pero'],
            correcta: 0, // 'trabaja'
            pista: 'Falta lo que hace mi hermana: un verbo.',
          },
        },
        {
          id: 'u1-practica2-p3',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué palabra completa la oración?',
            palabras: ['Me', 'compré', 'unas', 'zapatillas', '___', '.'],
            opciones: ['corren', 'blancas', 'Temuco', 'porque'],
            correcta: 1, // 'blancas'
            pista: 'Falta cómo son las zapatillas: un adjetivo.',
          },
        },
        {
          id: 'u1-practica2-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué palabra completa la oración?',
            palabras: ['El', '___', 'llegó', 'lleno', 'y', 'no', 'pude', 'subir', '.'],
            opciones: ['bus', 'rápido', 'camina', 'pero'],
            correcta: 0, // 'bus'
            pista: '¿Quién o qué llegó lleno? Falta un sustantivo.',
          },
        },
        {
          id: 'u1-practica2-p5',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Qué palabra completa la oración?',
            palabras: ['Quería', 'ir', 'al', 'concierto', '___', 'no', 'tenía', 'plata', '.'],
            opciones: ['y', 'pero', 'porque', 'feliz'],
            correcta: 1, // 'pero'
            pista: 'Quería ir… y algo lo impidió. ¿Qué conector muestra algo contrario?',
          },
        },
        {
          id: 'u1-practica2-p6',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            afirmacion: 'En "Tengo hambre ___ no almorcé", la palabra que falta es "porque".',
            correcta: true,
            pista: '"No almorcé" explica por qué tengo hambre.',
          },
        },
        {
          id: 'u1-practica2-p7',
          tipo: 'elegir',
          conAyuda: false,
          ejercicio: {
            enunciado: '¿Qué palabra completa la oración?',
            palabras: ['Los', 'jugadores', '___', 'muy', 'cansados', 'después', 'del', 'partido', '.'],
            opciones: ['terminaron', 'cancha', 'alegre', 'porque'],
            correcta: 0, // 'terminaron'
          },
        },
        {
          id: 'u1-practica2-p8',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              'Para saber qué palabra falta, mira lo que viene antes y después.',
              'Pregúntate qué tipo de palabra necesita la oración: ¿quién?, ¿qué hace?, ¿cómo es? o ¿qué une?',
            ],
          },
        },
      ],
    },

    // ===================== DESAFÍO =====================
    'u1-desafio': {
      id: 'u1-desafio',
      titulo: 'Desafío: Las palabras',
      codigo: 'language.word_classification',
      minutos: 5,
      pasos: [
        {
          id: 'u1-desafio-recordemos',
          tipo: 'elegir',
          recordemos: true,
          conAyuda: true,
          ejercicio: {
            enunciado: 'Antes de empezar, repasemos. ¿Qué palabra completa la oración?',
            palabras: ['Me', 'abrigué', '___', 'hacía', 'frío', '.'],
            opciones: ['y', 'pero', 'porque'],
            correcta: 2, // 'porque'
            pista: '"Hacía frío" explica por qué me abrigué.',
          },
        },
        {
          id: 'u1-desafio-p1',
          tipo: 'explica',
          ejercicio: {
            texto: '¡Llegaste al desafío! Ahora vas a leer un texto más largo y usar todo lo que aprendiste. Léelo con calma: lo vas a ver en cada pregunta.',
            palabras: TEXTO_DESAFIO,
          },
        },
        {
          id: 'u1-desafio-p2',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca los 2 sustantivos de la PRIMERA oración.',
            palabras: TEXTO_DESAFIO,
            correctas: [0, 4], // 'Camila', 'panadería'
            pista: '¿Quién trabaja? ¿Dónde trabaja?',
          },
        },
        {
          id: 'u1-desafio-p3',
          tipo: 'tocar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Toca los 2 verbos de la SEGUNDA oración.',
            palabras: TEXTO_DESAFIO,
            correctas: [9, 12], // 'llega', 'prepara'
            pista: '¿Qué hace Camila todos los días?',
          },
        },
        {
          id: 'u1-desafio-p4',
          tipo: 'elegir',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Según el texto, ¿cómo es el horno?',
            palabras: TEXTO_DESAFIO,
            opciones: ['grande y caliente', 'temprano y cansado', 'pan y panadería', 'llega y prepara'],
            correcta: 0,
            evidencia: [19, 22], // 'grande', 'caliente'
            pista: 'Busca la tercera oración: dice cómo es el horno.',
          },
        },
        {
          id: 'u1-desafio-p5',
          tipo: 'clasificar',
          conAyuda: true,
          ejercicio: {
            enunciado: 'Ordena estas palabras del texto en su caja.',
            cajas: [
              { id: 'sustantivo', titulo: 'Sustantivo' },
              { id: 'verbo', titulo: 'Verbo' },
              { id: 'adjetivo', titulo: 'Adjetivo' },
              { id: 'conector', titulo: 'Conector' },
            ],
            fichas: [
              { texto: 'Camila', caja: 'sustantivo' },
              { texto: 'trabaja', caja: 'verbo' },
              { texto: 'grande', caja: 'adjetivo' },
              { texto: 'pero', caja: 'conector' },
              { texto: 'horno', caja: 'sustantivo' },
              { texto: 'vendió', caja: 'verbo' },
              { texto: 'cansada', caja: 'adjetivo' },
              { texto: 'porque', caja: 'conector' },
            ],
            pista: 'Las cuatro preguntas: ¿quién o qué?, ¿qué hace?, ¿cómo es?, ¿qué une?',
          },
        },
        {
          id: 'u1-desafio-p6',
          tipo: 'vf',
          conAyuda: true,
          ejercicio: {
            enunciado: '¿Verdadero o falso?',
            palabras: TEXTO_DESAFIO,
            afirmacion: 'Según el texto, Camila está contenta porque vendió todo.',
            correcta: true,
            pista: 'Lee la última oración: ¿qué viene después de "porque"?',
          },
        },
        {
          id: 'u1-desafio-p7',
          tipo: 'elegir',
          conAyuda: false,
          ejercicio: {
            enunciado: '¿Qué palabra del texto explica la CAUSA de que Camila esté contenta?',
            palabras: TEXTO_DESAFIO,
            opciones: ['y', 'pero', 'porque', 'muy'],
            correcta: 2, // 'porque'
            evidencia: [31],
          },
        },
        {
          id: 'u1-desafio-p8',
          tipo: 'escribir',
          conAyuda: false,
          ejercicio: {
            enunciado: 'Escribe la palabra que dice cómo está Camila hoy, ANTES del "pero".',
            palabras: TEXTO_DESAFIO,
            correcta: 26, // 'cansada'
            evidencia: [26],
          },
        },
        {
          id: 'u1-desafio-p9',
          tipo: 'resumen',
          ejercicio: {
            puntos: [
              '¡Completaste la Unidad 1! Ya reconoces sustantivos, verbos, adjetivos y conectores.',
              'Usar estas cuatro preguntas te ayuda a entender cualquier texto: ¿quién o qué?, ¿qué hace?, ¿cómo es?, ¿qué une?',
              'En la Unidad 2 vas a juntar estas palabras para entender oraciones completas.',
            ],
          },
        },
      ],
    },
  },
}