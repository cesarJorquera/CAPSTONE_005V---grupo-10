/**
 * Textos para el Juego 1 - Identificación de Palabras Clave
 * 
 * Cada texto tiene:
 * - id: identificador único
 * - title: título descriptivo
 * - content: contenido HTML con palabras clave en <strong>
 * - difficulty: 'facil', 'medio', 'dificil'
 * - keywords: array de palabras destacadas (para referencia)
 * 
 * Para agregar un nuevo texto:
 * 1. Copia la estructura de un texto existente
 * 2. Asigna un nuevo id único (ej: 'text3', 'text4')
 * 3. Escribe el contenido con palabras clave en <strong>
 * 4. Agrega las preguntas correspondientes en game1_questions.js
 */

export const game1Texts = [
  {
    id: 'text1',
    title: 'Harry Potter y la Misión',
    difficulty: 'facil',
    content: `
      <strong>Harry Potter</strong> caminaba por el pasillo de <strong>Hogwarts</strong>, mirando con asombro los retratos que hablaban. 
      <strong>Hermione y Ron</strong> lo seguían, y <strong>aunque</strong> tenían miedo de lo que pudieran encontrar, <strong>sabían</strong> que no podían <strong>dejar</strong>
      la <strong>misión</strong> a medio hacer. El <strong>director</strong> les había dado una tarea muy <strong>difícil</strong>, <strong>pero</strong> estaban decididos a <strong>cumplirla</strong>.
    `,
    keywords: ['Harry Potter', 'Hogwarts', 'Hermione y Ron', 'aunque', 'sabían', 'dejar', 'misión', 'director', 'difícil', 'pero', 'cumplirla']
  },
  {
    id: 'text2',
    title: 'Frodo y el Anillo',
    difficulty: 'medio',
    content: `
      Frodo avanzaba con paso incierto por los <strong>oscuros</strong> caminos de Mordor, <strong>sintiendo</strong> el peso del <strong>Anillo</strong> colgando de su cuello. 
      A su lado, <strong>Sam</strong> lo seguía, agotado <strong>pero</strong> firme, decidido a no abandonar a su amigo. 
      A lo lejos, el Monte del Destino brillaba con un fuego que parecía devorar el cielo. 
      Sabían que el final estaba cerca, y aunque el miedo los acompañaba, también lo hacía la esperanza de liberar a la Tierra Media del mal.
    `,
    keywords: ['oscuros', 'Anillo', 'Sam', 'pero', 'sintiendo']
  },
  {
    id: 'text3',
    title: 'El Viaje de Neo (The Matrix)',
    difficulty: 'medio',
    content: `
      Neo, aturdido por la verdad, regresó <strong>rápidamente</strong> a la Matrix para buscar a Morfeo. 
      La <strong>Resistencia</strong> <strong>necesitaba</strong> desesperadamente que él fuera el Elegido. 
      Ahora, Neo debía aprender a controlar sus poderes recién <strong>descubiertos</strong>, <strong>aunque</strong> el Agente Smith lo perseguía constantemente.
    `,
    keywords: ['rápidamente', 'Resistencia', 'necesitaba', 'aunque', 'descubiertos']
  },
  {
    id: 'text4',
    title: 'La Cena de Seinfeld',
    difficulty: 'facil',
    content: `
      Jerry, George y Elaine intentaban sentarse <strong>cómodamente</strong> en su restaurante habitual. 
      George <strong>discutía</strong> acaloradamente con Jerry sobre un <strong>boleto</strong> de cine perdido. 
      Los tres se quejaban de problemas absurdos, <strong>sin embargo</strong>, amaban profundamente su amistad <strong>disfuncional</strong>.
    `,
    keywords: ['cómodamente', 'discutía', 'boleto', 'sin embargo', 'disfuncional']
  },
  {
    id: 'text5',
    title: 'La Fuga de Andy (Cadena Perpetua)',
    difficulty: 'medio',
    content: `
      Andy Dufresne escapó <strong>lentamente</strong> de Shawshank, arrastrándose a través de un <strong>túnel</strong> maloliente. 
      Él <strong>llevaba</strong> consigo el dinero <strong>robado</strong> por el alcaide corrupto. 
      La libertad significaba que por fin podría dedicarse a vivir <strong>tranquilamente</strong>.
    `,
    keywords: ['lentamente', 'túnel', 'llevaba', 'robado', 'tranquilamente']
  },
  {
    id: 'text6',
    title: 'La Batalla de los Vengadores (Marvel)',
    difficulty: 'medio',
    content: `
      Los Vengadores <strong>lucharon</strong> <strong>ferozmente</strong> contra el ejército de Thanos para salvar la <strong>Tierra</strong>, que estaba en peligro inminente. 
      Capitán América demostró que era <strong>valiente</strong> y fuerte. 
      Al final, Iron Man se sacrificó, <strong>pues</strong> sabía que no había otra forma de ganar.
    `,
    keywords: ['ferozmente', 'Tierra', 'lucharon', 'valiente', 'pues']
  },
  {
    id: 'text7',
    title: 'La Fiesta de Gatsby (El Gran Gatsby)',
    difficulty: 'medio',
    content: `
      Jay Gatsby organizaba grandiosas fiestas <strong>semanalmente</strong> en su <strong>mansión</strong> lujosa, <strong>pero</strong> él <strong>buscaba</strong> <strong>únicamente</strong> impresionar a Daisy. 
      Los invitados llegaban alegremente para beber y bailar. 
      La tristeza de Gatsby crecía inmensamente, aunque nadie lo notaba.
    `,
    keywords: ['semanalmente', 'mansión', 'buscaba', 'únicamente', 'pero']
  },
  {
    id: 'text8',
    title: 'La Ciudad de Gotham (Batman)',
    difficulty: 'medio',
    content: `
      Batman vigilaba <strong>silenciosamente</strong> la peligrosa ciudad de Gotham. 
      El Comisionado Gordon <strong>creía</strong> firmemente que el Caballero Oscuro era necesario para impartir <strong>justicia</strong>, <strong>ya que</strong> las pandillas criminales dominaban las calles. 
      El Joker esperaba <strong>pacientemente</strong> su oportunidad.
    `,
    keywords: ['silenciosamente', 'justicia', 'creía', 'pacientemente', 'ya que']
  },
  {
    id: 'text9',
    title: 'El Viaje de la Enterprise (Star Trek)',
    difficulty: 'medio',
    content: `
      La <strong>nave</strong> Enterprise viajaba <strong>constantemente</strong> a velocidades sorprendentes hacia regiones desconocidas. 
      El Capitán Kirk <strong>exploraba</strong> <strong>valientemente</strong> nuevos mundos y civilizaciones extrañas. 
      Spock analizaba lógicamente las amenazas, <strong>por lo tanto</strong>, la misión progresaba exitosamente.
    `,
    keywords: ['constantemente', 'nave', 'exploraba', 'valientemente', 'por lo tanto']
  },
  {
    id: 'text10',
    title: 'La Caza de Sauron (El Hobbit)',
    difficulty: 'medio',
    content: `
      Bilbo Bolsón regresó <strong>secretamente</strong> a la Comarca después de haber completado su peligrosa <strong>aventura</strong>. 
      Él <strong>guardó</strong> <strong>celosamente</strong> el Anillo Único durante muchos años. 
      El mago Gandalf siempre sospechó que el objeto era malvado y que traería consecuencias <strong>desastrosas</strong>.
    `,
    keywords: ['secretamente', 'aventura', 'guardó', 'celosamente', 'desastrosas']
  },
  {
    id: 'text11',
    title: 'La Isla de los Perdidos (Lost)',
    difficulty: 'medio',
    content: `
      Los sobrevivientes del vuelo 815 <strong>luchaban</strong> <strong>diariamente</strong> por sobrevivir en una isla <strong>misteriosa</strong>. 
      Jack Shephard, el líder, intentó cohesionar al grupo rápidamente, <strong>aunque</strong> el miedo y los secretos los dividían. 
      Locke creía <strong>profundamente</strong> en el poder de la isla.
    `,
    keywords: ['diariamente', 'luchaban', 'misteriosa', 'aunque', 'profundamente']
  },
  {
    id: 'text12',
    title: 'La Casa de Papel (Money Heist)',
    difficulty: 'medio',
    content: `
      Un grupo de <strong>criminales</strong> altamente calificados planificó <strong>meticulosamente</strong> el asalto a la Fábrica de Moneda. 
      El Profesor <strong>dirigía</strong> cuidadosamente la operación desde fuera. 
      Ellos querían demostrar que eran <strong>astutos</strong> e imparables, <strong>además de</strong> conseguir el dinero.
    `,
    keywords: ['meticulosamente', 'criminales', 'dirigía', 'astutos', 'además de']
  }
]

/**
 * Obtener texto por ID
 * @param {string} textId - ID del texto
 * @returns {object|null} - Objeto del texto o null si no existe
 */
export function getTextById(textId) {
  return game1Texts.find(t => t.id === textId) || null
}

/**
 * Obtener todos los IDs de textos disponibles
 * @returns {string[]} - Array de IDs
 */
export function getAllTextIds() {
  return game1Texts.map(t => t.id)
}

/**
 * Obtener el siguiente texto después del ID dado
 * @param {string} currentTextId - ID del texto actual
 * @returns {object|null} - Siguiente texto o null si es el último
 */
export function getNextText(currentTextId) {
  const currentIndex = game1Texts.findIndex(t => t.id === currentTextId)
  if (currentIndex === -1 || currentIndex === game1Texts.length - 1) {
    return null
  }
  return game1Texts[currentIndex + 1]
}
