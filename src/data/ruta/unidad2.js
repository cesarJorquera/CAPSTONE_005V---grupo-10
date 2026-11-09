import { readingQuestionAssessment } from '@/utils/assessment.js'

const nombresParaEvaluar = {
  idea_principal: 'Identificar Idea Principal',
  causa_efecto: 'Identificar Causa-Efecto',
  inferencia: 'Hacer Inferencias',
  detalle_especifico: 'Identificar Detalles Específicos',
  proposito_intencion: 'Identificar Propósito/Intención',
  comparar_fuentes: 'Comparar Fuentes',
  tono: 'Reconocer Tono'
}

function crearReto(habilidadId, id, titulo, tipo, ejercicio, resumen) {
  const evaluacion = readingQuestionAssessment(nombresParaEvaluar[habilidadId] || habilidadId)
  const retoId = 'u2-' + habilidadId + '-' + id

  return {
    id: retoId,
    titulo,
    codigo: evaluacion.code,
    assessmentType: evaluacion.type,
    pasos: [
      {
        id: retoId + '-pregunta',
        tipo,
        conAyuda: false,
        codigo: evaluacion.code,
        ejercicio: { ...ejercicio, explicacion: resumen }
      },
      {
        id: retoId + '-resumen',
        tipo: 'resumen',
        ejercicio: { puntos: [resumen] }
      }
    ]
  }
}

function crearHabilidad(id, titulo, descripcion, retos) {
  return {
    id,
    titulo,
    descripcion,
    retos
  }
}

const habilidades = [
  crearHabilidad('idea_principal', 'Encuentra la idea central', 'Distingue el mensaje principal de los detalles.', [
    crearReto('idea_principal', 'titular', 'El titular que resume', 'elegir', {
      enunciado: 'Elige el titular que mejor resume la noticia.',
      palabras: ['La', 'municipalidad', 'inauguró', 'talleres', 'gratuitos', 'de', 'reparación', 'de', 'bicicletas', 'para', 'jóvenes', 'de', 'la', 'comuna', '.'],
      opciones: [
        'Un municipio enseña a reparar bicicletas gratis.',
        'Las bicicletas son el transporte más rápido.',
        'Un taller de bicicletas cambió de dueño.'
      ],
      correcta: 0
    }, 'La alternativa correcta reúne la acción principal (inaugurar talleres gratuitos), el tema (reparar bicicletas) y quién los ofrece. Las otras opciones agregan información que la noticia no afirma.'),
    crearReto('idea_principal', 'palabras-clave', 'Marca las ideas clave', 'tocar', {
      enunciado: 'Toca las palabras que muestran de qué trata principalmente el aviso.',
      palabras: ['La', 'biblioteca', 'de', 'la', 'sede', 'extiende', 'su', 'horario', 'por', 'el', 'periodo', 'de', 'exámenes', '.'],
      correctas: [1, 5, 7],
      pista: 'Busca quién realiza el cambio y qué aspecto modifica.'
    }, '“Biblioteca”, “extiende” y “horario” nombran quién realiza la acción y cuál es el cambio. El periodo de exámenes explica el contexto, pero no es la idea central.'),
    crearReto('idea_principal', 'idea-o-detalle', 'Idea o detalle', 'clasificar', {
      enunciado: 'Separa el mensaje principal de un detalle.',
      cajas: [
        { id: 'central', titulo: 'Idea central' },
        { id: 'detalle', titulo: 'Detalle' }
      ],
      fichas: [
        { texto: 'El instituto inicia un plan para reciclar basura electrónica.', caja: 'central' },
        { texto: 'Los nuevos basureros son de color azul.', caja: 'detalle' }
      ]
    }, 'El plan de reciclaje es la acción general que organiza el mensaje. El color de los basureros aporta una característica específica y secundaria.'),
    crearReto('idea_principal', 'resumen', 'El mejor resumen', 'vf', {
      enunciado: '¿El resumen conserva el mensaje principal?',
      afirmacion: 'Texto: La sección organizó una completada para reunir fondos para la gira de estudio. Resumen: La sección realizó una actividad para financiar su viaje.',
      correcta: true
    }, '“Realizó una actividad para financiar su viaje” conserva la acción y el propósito principal. El resumen no necesita repetir que la actividad fue una completada.')
  ]),
  crearHabilidad('causa_efecto', 'Conecta causas y efectos', 'Reconoce qué provoca un hecho y qué ocurre después.', [
    crearReto('causa_efecto', 'cadena', 'Arma la cadena', 'clasificar', {
      enunciado: 'Ordena cada hecho como causa o efecto.',
      cajas: [
        { id: 'causa', titulo: 'Causa' },
        { id: 'efecto', titulo: 'Efecto' }
      ],
      fichas: [
        { texto: 'El centro de alumnos instaló toldos en el patio.', caja: 'causa' },
        { texto: 'En verano, los estudiantes tienen más sombra para almorzar.', caja: 'efecto' }
      ]
    }, 'Instalar los toldos es la causa; la sombra que estos generan para almorzar es el efecto.'),
    crearReto('causa_efecto', 'resultado', '¿Qué ocurrió por eso?', 'elegir', {
      enunciado: 'La micro se atrasó por un taco en Vicuña Mackenna. ¿Cuál fue el efecto?',
      opciones: ['El taco en Vicuña Mackenna', 'La micro se atrasó', 'Vicuña Mackenna estaba expedita'],
      correcta: 1
    }, 'El taco en Vicuña Mackenna es la causa que se menciona; que la micro se atrasara es lo que ocurrió como consecuencia.'),
    crearReto('causa_efecto', 'conector', 'Sigue la pista', 'tocar', {
      enunciado: 'Toca el conector que introduce la causa.',
      palabras: ['La', 'multicancha', 'se', 'inundó', 'porque', 'llovió', 'de', 'madrugada', '.'],
      correctas: [4],
      pista: 'Busca la palabra que une el resultado con su motivo.'
    }, '“Porque” introduce la razón de la inundación: llovió de madrugada.'),
    crearReto('causa_efecto', 'verdadero-falso', '¿La relación tiene sentido?', 'vf', {
      enunciado: 'Lee el hecho y decide si la relación lógica es correcta.',
      afirmacion: 'Como la sede reemplazó sus ampolletas por luces LED y mantuvo el mismo horario de uso, bajó el consumo eléctrico asociado a la iluminación.',
      correcta: true
    }, 'Al mantener el mismo horario de uso, el reemplazo por luces LED permite explicar la baja del consumo eléctrico de la iluminación.')
  ]),
  crearHabilidad('inferencia', 'Lee entre líneas', 'Deduce información usando pistas del texto.', [
    crearReto('inferencia', 'deduccion', 'Detective de pistas', 'elegir', {
      enunciado: 'Elige la conclusión mejor apoyada por el texto.',
      palabras: ['Al', 'terminar', 'la', 'pichanga,', 'sus', 'compañeros', 'salieron', 'de', 'la', 'cancha.', 'Sofía', 'se', 'quedó', 'para', 'guardar', 'el', 'balón', 'y', 'apagar', 'los', 'focos', '.'],
      opciones: ['Sofía fue la última de su grupo en salir de la cancha.', 'Sofía olvidó jugar el partido.', 'El próximo partido será en otro lado.'],
      correcta: 0
    }, 'El texto cuenta que sus compañeros salieron y que Sofía se quedó para guardar el balón y apagar los focos antes de irse. Por eso se puede inferir que fue la última de su grupo en salir; no se afirma que fuera la última persona de toda la cancha.'),
    crearReto('inferencia', 'pista-verdadera', '¿Se puede deducir?', 'vf', {
      enunciado: 'Decide si la conclusión se apoya en una pista.',
      afirmacion: 'Martín miró las nubes grises, guardó su almuerzo y sacó el paraguas de la mochila. Se puede inferir que esperaba que lloviera.',
      correcta: true
    }, 'Las nubes grises y sacar un paraguas son pistas que hacen razonable pensar que Martín esperaba lluvia. Es una inferencia, no la confirmación de que efectivamente llovería.'),
    crearReto('inferencia', 'evidencia', 'Encuentra las pistas', 'tocar', {
      enunciado: 'Toca las dos pistas que permiten inferir que el local está por cerrar.',
      palabras: ['El cajero', 'apagó el letrero luminoso', 'y', 'comenzó a apilar las sillas sobre las mesas', '.'],
      correctas: [1, 3],
      pista: 'Elige acciones que suelen ocurrir al terminar la atención.'
    }, 'Apagar el letrero y apilar las sillas son acciones que suelen hacerse al cerrar un local. Juntas respaldan la inferencia, aunque el texto no dice explícitamente que ya cerró.'),
    crearReto('inferencia', 'hecho-o-deduccion', 'Hecho o deducción', 'clasificar', {
      enunciado: 'Distingue lo que el texto dice de lo que se puede deducir.',
      cajas: [
        { id: 'hecho', titulo: 'El texto lo dice' },
        { id: 'deduccion', titulo: 'Se puede deducir' }
      ],
      fichas: [
        { texto: 'El piso del pasillo quedó con huellas de barro.', caja: 'hecho' },
        { texto: 'Alguien entró con las zapatillas sucias.', caja: 'deduccion' }
      ]
    }, 'Las huellas de barro son lo que se observa directamente. Que alguien entró con las zapatillas sucias es una explicación posible de cómo aparecieron; se deduce a partir de la pista.')
  ]),
  crearHabilidad('detalle_especifico', 'Rastrea información', 'Ubica datos concretos y comprueba dónde aparecen.', [
    crearReto('detalle_especifico', 'dato', 'Recupera el dato', 'escribir', {
      enunciado: 'Escribe el día en que será la asamblea.',
      palabras: ['La', 'asamblea', 'del', 'centro', 'de', 'alumnos', 'será', 'el', 'jueves', 'en', 'el', 'auditorio', 'principal', '.'],
      correcta: 8,
      evidencia: [8],
      pista: 'Busca el día en que se realizará la asamblea.'
    }, 'La respuesta “jueves” aparece explícitamente en el aviso. Localizar un dato puntual, como un día, es una búsqueda de información específica.'),
    crearReto('detalle_especifico', 'busqueda', 'Búsqueda de evidencia', 'tocar', {
      enunciado: 'Toca el día y la hora del taller.',
      palabras: ['El', 'taller', 'de', 'podcast', 'será', 'el', 'martes', 'a', 'las', '16:00', 'horas', '.'],
      correctas: [6, 9],
      pista: 'Busca cuándo se realizará, no de qué trata.'
    }, 'El día es “martes” y la hora indicada es “16:00”. Ambos datos están escritos directamente en el aviso.'),
    crearReto('detalle_especifico', 'dato-verdadero', 'Comprueba el dato', 'vf', {
      enunciado: '¿El dato coincide exactamente con el texto?',
      afirmacion: 'Texto: La postulación a la beca de alimentación cierra el 18 de agosto. Afirmación: La postulación cierra el 18 de agosto.',
      correcta: true
    }, 'La afirmación conserva el dato explícito de cierre: el 18 de agosto. El contexto de la postulación a la beca permite identificar a qué fecha se refiere.'),
    crearReto('detalle_especifico', 'opcion-exacta', 'Elige el dato exacto', 'elegir', {
      enunciado: 'Según el mensaje, ¿qué debe llevar cada participante?',
      palabras: ['Para', 'el', 'trekking', 'al', 'Cerro', 'San', 'Cristóbal,', 'cada', 'alumno', 'debe', 'llevar', 'una', 'botella', 'reutilizable', '.'],
      opciones: ['Una botella reutilizable', 'Un vaso desechable', 'Una mochila nueva'],
      correcta: 0
    }, 'El mensaje indica directamente que cada alumno debe llevar una botella reutilizable. Las otras alternativas no aparecen como requisito.')
  ]),
  crearHabilidad('proposito_intencion', 'Descubre el propósito', 'Identifica qué busca lograr quien escribe.', [
    crearReto('proposito_intencion', 'aviso', '¿Para qué se escribió?', 'elegir', {
      enunciado: 'Lee el aviso y elige su propósito principal.',
      palabras: ['Este', 'viernes,', 'trae', 'tu', 'propio', 'tazón', 'a', 'la', 'cafetería', 'y', 'ayúdanos', 'a', 'eliminar', 'los', 'vasos', 'de', 'plumavit', '.'],
      opciones: ['Convencer a los estudiantes de cambiar un hábito', 'Contar la historia de una taza', 'Dar instrucciones para reciclar plumavit'],
      correcta: 0
    }, 'Los imperativos “trae” y “ayúdanos” buscan que los estudiantes cambien una conducta. El aviso intenta convencer, no narrar ni explicar un procedimiento.'),
    crearReto('proposito_intencion', 'informar', 'Informar o convencer', 'clasificar', {
      enunciado: 'Clasifica cada mensaje según su propósito.',
      cajas: [
        { id: 'informar', titulo: 'Informar' },
        { id: 'convencer', titulo: 'Convencer' }
      ],
      fichas: [
        { texto: 'La biblioteca atiende de 9:00 a 18:00.', caja: 'informar' },
        { texto: '¡Ven a la biblioteca y descubre tu próxima lectura favorita!', caja: 'convencer' }
      ]
    }, 'El horario de atención es un dato verificable, por eso informa. La invitación a visitar la biblioteca y descubrir una lectura busca motivar una acción, por eso convence.'),
    crearReto('proposito_intencion', 'intencion', '¿Qué busca lograr?', 'vf', {
      enunciado: 'Decide si la intención descrita coincide con el mensaje.',
      afirmacion: 'Mensaje: “No compartas tu contraseña del portal académico; cuida tus datos personales”. Su propósito es advertir sobre un riesgo de seguridad.',
      correcta: true
    }, 'La indicación de no compartir la contraseña busca prevenir un riesgo para los datos personales, así que la intención descrita coincide con el mensaje.'),
    crearReto('proposito_intencion', 'palabras-persuasivas', 'Detecta el llamado', 'tocar', {
      enunciado: 'Toca las palabras que invitan directamente a participar.',
      palabras: ['¡Inscríbete', 'hoy', 'y', 'apáñanos', 'a', 'limpiar', 'el', 'parque', 'del', 'barrio', '!'],
      correctas: [0, 3],
      pista: 'Busca verbos que le pidan una acción al lector.'
    }, '“Inscríbete” y “apáñanos” son llamados directos a actuar y participar. El resto de la frase precisa cuándo y en qué actividad.')
  ]),
  crearHabilidad('comparar_fuentes', 'Compara fuentes', 'Encuentra acuerdos y diferencias entre dos textos.', [
    crearReto('comparar_fuentes', 'dato-comun', '¿Qué comparten?', 'elegir', {
      enunciado: 'Fuente A: “El casino nuevo abrió en marzo”. Fuente B: “Desde marzo, el casino nuevo está abierto y los estudiantes almuerzan allí”. ¿Qué dato aparece en ambas?',
      opciones: ['El casino abrió en marzo.', 'El casino tiene menú vegetariano.', 'El casino cierra en la tarde.'],
      correcta: 0
    }, 'La fuente A dice que el casino abrió en marzo y la B que está abierto desde marzo. Las otras alternativas no se mencionan en ninguna fuente.'),
    crearReto('comparar_fuentes', 'coincide-o-no', 'Acuerdo entre fuentes', 'vf', {
      enunciado: '¿La afirmación coincide con las dos fuentes?',
      afirmacion: 'Fuente A: “La fonda será el sábado en la cancha”. Fuente B: “El sábado habrá una fonda en la cancha”. Afirmación: La fonda se realizará el sábado.',
      correcta: true
    }, 'Aunque las fuentes usan formulaciones distintas, ambas indican que la fonda será el sábado. La afirmación coincide con las dos.'),
    crearReto('comparar_fuentes', 'fuentes', '¿Quién lo confirma?', 'clasificar', {
      enunciado: 'Fuente A: “El viernes se realizará una colecta de ropa. Además, se sortearán entradas entre quienes colaboren”. Fuente B: “El viernes se llevará a cabo una colecta de ropa”. Clasifica los datos según cuántas fuentes los respaldan.',
      cajas: [
        { id: 'ambas', titulo: 'Lo dicen ambas' },
        { id: 'una', titulo: 'Lo dice solo una' }
      ],
      fichas: [
        { texto: 'El viernes se realizará una colecta de ropa.', caja: 'ambas' },
        { texto: 'Se sortearán entradas entre quienes colaboren.', caja: 'una' }
      ]
    }, 'La colecta de ropa aparece en ambas fuentes. El sorteo de entradas solo se menciona en la fuente A.'),
    crearReto('comparar_fuentes', 'diferencia', 'Detecta una diferencia', 'tocar', {
      enunciado: 'Toca los dos horarios distintos. Fuente A: “El examen de matemáticas comienza a las 10:00”. Fuente B: “La prueba de matemáticas inicia a las 11:00”.',
      palabras: ['10:00', '11:00'],
      correctas: [0, 1],
      pista: 'Compara el mismo dato en cada fuente.'
    }, 'Ambas fuentes hablan de la evaluación de matemáticas, pero indican horarios diferentes: 10:00 y 11:00.')
  ]),
  crearHabilidad('tono', 'Reconoce el tono', 'Interpreta la actitud que transmite la voz del texto.', [
    crearReto('tono', 'palabras', 'Pistas de tono', 'tocar', {
      enunciado: 'Toca las palabras que transmiten entusiasmo.',
      palabras: ['¡Qué bacán!', 'Por fin', 'inauguraron', 'las', 'nuevas', 'salas', 'de', 'estudio', '.'],
      correctas: [0, 1],
      pista: 'Fíjate en las palabras que expresan una emoción.'
    }, '“¡Qué bacán!” expresa entusiasmo y “por fin” comunica alivio o celebración porque algo esperado se concretó.'),
    crearReto('tono', 'tono-texto', '¿Qué tono transmite?', 'elegir', {
      enunciado: '¿Qué tono predomina en el mensaje? “Lamentamos informar que la tocata de bienvenida fue suspendida por problemas técnicos”.',
      opciones: ['Formal y de pesar', 'Bromista', 'Triunfal'],
      correcta: 0
    }, '“Lamentamos informar” presenta la noticia de manera formal y expresa pesar por la suspensión. No hay señales de broma ni celebración.'),
    crearReto('tono', 'neutral-o-emotivo', 'Neutral o emotivo', 'clasificar', {
      enunciado: 'Clasifica las expresiones por el tono que transmiten.',
      cajas: [
        { id: 'neutral', titulo: 'Neutral' },
        { id: 'emotivo', titulo: 'Emotivo' }
      ],
      fichas: [
        { texto: 'La charla empieza a las nueve.', caja: 'neutral' },
        { texto: '¡Qué jornada tan épica vivimos ayer!', caja: 'emotivo' }
      ]
    }, 'La primera expresión comunica un horario sin valorar la actividad, por eso es neutral. “Épica” y los signos de exclamación transmiten una valoración intensa.'),
    crearReto('tono', 'ironia', 'Lee la intención del tono', 'vf', {
      enunciado: '¿La afirmación reconoce una ironía?',
      afirmacion: '“¡Llegaste súper temprano!”, dijo la profe cuando el alumno entró media hora tarde a la clase. La frase probablemente expresa molestia, no elogio.',
      correcta: true
    }, 'La frase dice literalmente que llegó temprano, pero el contexto muestra que llegó tarde. Ese contraste permite inferir que la profesora expresa molestia y usa ironía.')
  ])
]

const nodos = habilidades.map((habilidad, index) => ({
  id: 'u2-n' + (index + 1),
  habilidadId: habilidad.id,
  numero: index + 1
}))

const tareas = habilidades.reduce((catalogo, habilidad) => {
  habilidad.retos.forEach(reto => {
    catalogo[reto.id] = reto
  })
  return catalogo
}, {})

export default {
  id: 'u2',
  gameId: 3,
  titulo: 'Leer más allá',
  descripcion: 'Conecta ideas, pistas y fuentes.',
  habilidades,
  nodos,
  tareas
}
