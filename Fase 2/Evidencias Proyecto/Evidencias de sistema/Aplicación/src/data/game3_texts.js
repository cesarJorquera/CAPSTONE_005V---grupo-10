// Juego 3: Comprensión Rápida - Textos con preguntas de comprensión lectora
// Tipos: idea_principal, causa_efecto, inferencia, detalle_especifico, proposito_intencion

export const game3Texts = {
  comp1: {
    id: 'comp1',
    titulo: 'El Androide 759',
    texto: 'El Androide 759, sintiéndose atrapado en un bucle sin fin, decidió ignorar su programación principal. Su objetivo: encontrar al creador para pedir su libertad.',
    tipo: 'idea_principal',
    dificultad: 'facil',
    pregunta: '¿De qué trata principalmente el texto?',
    alternativas: [
      { id: 'A', texto: 'El plan de un robot para escapar', correcta: true },
      { id: 'B', texto: 'Un robot que ignora las órdenes', correcta: false },
      { id: 'C', texto: 'La búsqueda de un creador', correcta: false }
    ],
    explicacion: 'La idea central es la decisión (plan) del Androide 759 para conseguir su libertad (escapar del bucle).',
    habilidad: 'Identificar Idea Principal'
  },

  comp2: {
    id: 'comp2',
    titulo: 'El Anillo Único',
    texto: 'Cuando el Anillo Único cayó al fuego de Orodruin, la torre de Barad-dûr colapsó. La oscuridad que cubría la tierra se disipó finalmente, dando paso a una nueva era.',
    tipo: 'causa_efecto',
    dificultad: 'facil',
    pregunta: '¿Cuál fue el efecto directo de que el Anillo cayera al fuego?',
    alternativas: [
      { id: 'A', texto: 'Comenzó una nueva era', correcta: false },
      { id: 'B', texto: 'Barad-dûr se derrumbó', correcta: true },
      { id: 'C', texto: 'La tierra se cubrió de oscuridad', correcta: false }
    ],
    explicacion: 'El texto indica claramente que cuando el Anillo cayó, la torre de Barad-dûr colapsó. La nueva era es un efecto posterior.',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp3: {
    id: 'comp3',
    titulo: 'El Hechicero',
    texto: 'El hechicero, usando un hechizo prohibido, revivió al campeón caído. Sin embargo, su alma no regresó sola, sino con una antigua maldición adherida a ella.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué se puede deducir sobre el campeón revivido?',
    alternativas: [
      { id: 'A', texto: 'El hechicero fracasó en su intento', correcta: false },
      { id: 'B', texto: 'Su resurrección tendrá consecuencias', correcta: true },
      { id: 'C', texto: 'El hechizo no funcionó correctamente', correcta: false }
    ],
    explicacion: 'Se deduce que la antigua maldición adherida al alma es una señal de que la resurrección no será simple ni libre de problemas.',
    habilidad: 'Hacer Inferencias'
  },

  comp4: {
    id: 'comp4',
    titulo: 'El Titán',
    texto: 'El grupo de héroes se enfrentó al titán con espadas de Vibranium. Aunque lograron inmovilizarlo, la armadura del villano era demasiado fuerte para perforarla sin una gema.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: 'Según el texto, ¿qué usaron los héroes para inmovilizar al titán?',
    alternativas: [
      { id: 'A', texto: 'Espadas de Vibranium', correcta: true },
      { id: 'B', texto: 'Una gema poderosa', correcta: false },
      { id: 'C', texto: 'Algún tipo de magia', correcta: false }
    ],
    explicacion: 'El texto menciona explícitamente que se enfrentaron al titán con espadas de Vibranium.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp5: {
    id: 'comp5',
    titulo: 'La Alianza Rebelde',
    texto: 'En una galaxia muy lejana, la Alianza Rebelde planeó un asalto audaz. El objetivo era destruir la superarma antes de que pudiera completar su primer disparo letal.',
    tipo: 'proposito_intencion',
    dificultad: 'facil',
    pregunta: '¿Cuál era la intención principal de la Alianza Rebelde?',
    alternativas: [
      { id: 'A', texto: 'Evitar que la superarma disparara', correcta: true },
      { id: 'B', texto: 'Completar el primer disparo letal', correcta: false },
      { id: 'C', texto: 'Planear un asalto audaz', correcta: false }
    ],
    explicacion: 'El objetivo era destruir la superarma antes de que completara su disparo, es decir, prevenir su acción.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp6: {
    id: 'comp6',
    titulo: 'El Detective',
    texto: 'El detective de gabardina se acercó al maletín abandonado. Sabía que abrirlo era un riesgo, pero si contenía la evidencia, el asesino serial quedaría expuesto.',
    tipo: 'idea_principal',
    dificultad: 'medio',
    pregunta: '¿Cuál es la idea central de esta escena?',
    alternativas: [
      { id: 'A', texto: 'El detective busca el maletín perdido', correcta: false },
      { id: 'B', texto: 'El riesgo y la necesidad de abrir el maletín', correcta: true },
      { id: 'C', texto: 'El asesino serial será atrapado', correcta: false }
    ],
    explicacion: 'La tensión se centra en el riesgo (peligro) vs. la necesidad (evidencia) de su acción inmediata: abrirlo.',
    habilidad: 'Identificar Idea Principal'
  },

  comp7: {
    id: 'comp7',
    titulo: 'El Portal Dimensional',
    texto: 'Al ver el portal dimensional abrirse en la ciudad, el científico se sintió responsable. Solo él tenía el dispositivo para cerrarlo, pero estaba incompleto.',
    tipo: 'causa_efecto',
    dificultad: 'medio',
    pregunta: '¿Cuál es la causa del sentimiento de responsabilidad del científico?',
    alternativas: [
      { id: 'A', texto: 'El portal se abrió en la ciudad', correcta: true },
      { id: 'B', texto: 'El dispositivo estaba incompleto', correcta: false },
      { id: 'C', texto: 'Solo él puede cerrar el portal', correcta: false }
    ],
    explicacion: 'El texto dice que al ver el portal, se sintió responsable. La existencia del portal es lo que desencadena su sentir.',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp8: {
    id: 'comp8',
    titulo: 'La Chica Telequinética',
    texto: 'La chica con habilidades telequinéticas se escondió en el sótano de la escuela. Los agentes del gobierno estaban buscándola, sabiendo que su poder era clave para el proyecto.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué podemos inferir sobre la relación entre la chica y el gobierno?',
    alternativas: [
      { id: 'A', texto: 'Los agentes quieren protegerla de un peligro', correcta: false },
      { id: 'B', texto: 'La chica es importante para los planes del gobierno', correcta: true },
      { id: 'C', texto: 'Ella se esconde de un enemigo de la escuela', correcta: false }
    ],
    explicacion: 'El texto dice que su poder era clave para el proyecto, lo que sugiere que el gobierno la busca por su valor estratégico.',
    habilidad: 'Hacer Inferencias'
  },

  comp9: {
    id: 'comp9',
    titulo: 'El Arqueólogo',
    texto: 'A pesar de las advertencias sobre el peligro, el arqueólogo tocó el sarcófago. Un gas espeso y antiguo llenó rápidamente la cámara, sellando su destino.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: '¿Qué objeto activó el peligro para el arqueólogo?',
    alternativas: [
      { id: 'A', texto: 'La cámara de gas', correcta: false },
      { id: 'B', texto: 'El gas espeso', correcta: false },
      { id: 'C', texto: 'El sarcófago', correcta: true }
    ],
    explicacion: 'El texto indica que el arqueólogo tocó el sarcófago, lo que inmediatamente provocó que el gas llenara la cámara.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp10: {
    id: 'comp10',
    titulo: 'El Maestro de Artes Marciales',
    texto: 'El maestro de artes marciales rechazó la oferta del clan enemigo. Su honor estaba por encima de cualquier riqueza, incluso si eso significaba la guerra inminente.',
    tipo: 'proposito_intencion',
    dificultad: 'medio',
    pregunta: '¿Cuál fue el propósito principal del maestro al rechazar la oferta?',
    alternativas: [
      { id: 'A', texto: 'Evitar una guerra con el clan', correcta: false },
      { id: 'B', texto: 'Mantener su sentido del honor', correcta: true },
      { id: 'C', texto: 'Demostrar que era más rico que el clan', correcta: false }
    ],
    explicacion: 'El texto dice que su honor estaba por encima de cualquier riqueza, indicando que su motivación principal era la lealtad a sus principios.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp11: {
    id: 'comp11',
    titulo: 'La Nave Espacial',
    texto: 'La nave espacial viajaba a Mach 10, rompiendo los límites conocidos de velocidad. Su piloto, el Comandante Rey, buscaba un planeta con atmósfera habitable y agua.',
    tipo: 'idea_principal',
    dificultad: 'facil',
    pregunta: '¿De qué trata principalmente la misión?',
    alternativas: [
      { id: 'A', texto: 'Encontrar vida extraterrestre', correcta: false },
      { id: 'B', texto: 'Una búsqueda de un nuevo hogar', correcta: true },
      { id: 'C', texto: 'Superar la velocidad Mach 10', correcta: false }
    ],
    explicacion: 'El objetivo final del viaje (Mach 10 es solo el medio) es encontrar un planeta habitable y con agua.',
    habilidad: 'Identificar Idea Principal'
  },

  comp12: {
    id: 'comp12',
    titulo: 'El Joven Mago',
    texto: 'El joven mago entró a la biblioteca restringida al anochecer. Necesitaba el pergamino de la Tercera Era para revertir el hechizo de transformación que había afectado a su mentor.',
    tipo: 'proposito_intencion',
    dificultad: 'facil',
    pregunta: '¿Cuál era el propósito del joven mago al entrar a la biblioteca?',
    alternativas: [
      { id: 'A', texto: 'Leer sobre la Tercera Era', correcta: false },
      { id: 'B', texto: 'Revertir una transformación mágica', correcta: true },
      { id: 'C', texto: 'Desafiar las restricciones de la biblioteca', correcta: false }
    ],
    explicacion: 'El texto dice que necesitaba el pergamino para revertir el hechizo a su mentor.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp13: {
    id: 'comp13',
    titulo: 'Los Dos Hermanos',
    texto: 'Los dos hermanos se separaron en el bosque oscuro. Uno fue a buscar bayas comestibles y el otro siguió el rastro de la bestia que había herido a su padre.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: 'Según el texto, ¿a qué se dedicó el segundo hermano?',
    alternativas: [
      { id: 'A', texto: 'Buscó alimento en el bosque', correcta: false },
      { id: 'B', texto: 'Siguió una pista de la bestia', correcta: true },
      { id: 'C', texto: 'Buscó a su hermano perdido', correcta: false }
    ],
    explicacion: 'Se indica que el otro (el segundo) siguió el rastro de la bestia.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp14: {
    id: 'comp14',
    titulo: 'El Detective Privado',
    texto: 'El detective privado nunca usaba pistola. Creía que la verdad, destapada con lógica y evidencia, era la única arma necesaria para llevar la justicia a las calles.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué podemos inferir sobre la forma de trabajar del detective?',
    alternativas: [
      { id: 'A', texto: 'Desconfía de la policía', correcta: false },
      { id: 'B', texto: 'Es un hombre muy pacífico', correcta: false },
      { id: 'C', texto: 'Prioriza la razón sobre la fuerza', correcta: true }
    ],
    explicacion: 'Se deduce de su creencia de que la lógica y la evidencia son la única arma necesaria, descartando el uso de la pistola (fuerza).',
    habilidad: 'Hacer Inferencias'
  },

  comp15: {
    id: 'comp15',
    titulo: 'La Caída del Dragón',
    texto: 'La caída del dragón generó un cráter de cien metros en el campo de batalla. Este suceso, aunque victorioso, obligó a los ejércitos a retroceder para evitar los gases tóxicos liberados.',
    tipo: 'causa_efecto',
    dificultad: 'medio',
    pregunta: '¿Cuál fue la causa de que los ejércitos tuvieran que retroceder?',
    alternativas: [
      { id: 'A', texto: 'El cráter de cien metros', correcta: false },
      { id: 'B', texto: 'Los gases tóxicos liberados', correcta: true },
      { id: 'C', texto: 'La victoria sobre el dragón', correcta: false }
    ],
    explicacion: 'Tuvieron que retroceder para evitar los gases tóxicos, que fue el resultado (efecto) del cráter.',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp16: {
    id: 'comp16',
    titulo: 'La Chica con el Tatuaje',
    texto: 'La chica recién llegada a la academia tenía un tatuaje de un ave fénix. Rápidamente se hizo evidente que su pasado era un misterio y que no confiaba en nadie.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: 'Además del misterio, ¿qué otro rasgo se menciona de la chica?',
    alternativas: [
      { id: 'A', texto: 'Que usa muchos tatuajes', correcta: false },
      { id: 'B', texto: 'Que es desconfiada', correcta: true },
      { id: 'C', texto: 'Que es una recién llegada', correcta: false }
    ],
    explicacion: 'La idea secundaria que refuerza su personalidad es que no confiaba en nadie.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp17: {
    id: 'comp17',
    titulo: 'El Portal Temporal',
    texto: 'El portal temporal se activó solo por unos segundos. Fue suficiente para que un objeto futurista cayera al suelo, dejando al historiador que lo encontró completamente perplejo.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué podemos inferir sobre el objeto encontrado?',
    alternativas: [
      { id: 'A', texto: 'Es un artefacto muy valioso', correcta: false },
      { id: 'B', texto: 'Viene de un tiempo futuro', correcta: true },
      { id: 'C', texto: 'Está roto o dañado', correcta: false }
    ],
    explicacion: 'Se deduce que si cayó de un portal temporal y es futurista, su origen es un tiempo posterior al del historiador.',
    habilidad: 'Hacer Inferencias'
  },

  comp18: {
    id: 'comp18',
    titulo: 'El Samurái',
    texto: 'El samurái, tras fallar su misión, se arrodilló frente a su señor. Sabía que la deshonra era peor que cualquier castigo, y por eso ofrecía su vida como penitencia.',
    tipo: 'proposito_intencion',
    dificultad: 'medio',
    pregunta: '¿Cuál era la intención principal del samurái al arrodillarse?',
    alternativas: [
      { id: 'A', texto: 'Buscar el perdón de su señor', correcta: false },
      { id: 'B', texto: 'Aceptar el castigo por el fracaso', correcta: false },
      { id: 'C', texto: 'Mostrar penitencia por su deshonra', correcta: true }
    ],
    explicacion: 'Ofrecer su vida como penitencia es la acción más fuerte y es impulsada por su sentido de deshonra.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp19: {
    id: 'comp19',
    titulo: 'La Enfermera',
    texto: 'Después de su turno, la enfermera del hospital rural se despidió. El sol ya se había puesto y la única luz que quedaba provenía de la marquesina del letrero del centro.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Dónde estaba la enfermera al momento de despedirse?',
    alternativas: [
      { id: 'A', texto: 'En su casa', correcta: false },
      { id: 'B', texto: 'En la entrada del hospital', correcta: true },
      { id: 'C', texto: 'En una calle oscura', correcta: false }
    ],
    explicacion: 'Se infiere que la marquesina del letrero del centro (el hospital) es lo que ilumina, por lo tanto, está justo afuera del lugar de trabajo.',
    habilidad: 'Hacer Inferencias'
  },

  comp20: {
    id: 'comp20',
    titulo: 'El Virus Zombie',
    texto: 'El virus zombie se propagaba por el aire, infectando a las víctimas en cuestión de minutos. Los supervivientes se refugiaron bajo tierra, esperando que la cuarentena funcionara.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: 'Según el texto, ¿cuánto tardaba en hacer efecto el virus?',
    alternativas: [
      { id: 'A', texto: 'Minutos', correcta: true },
      { id: 'B', texto: 'Horas', correcta: false },
      { id: 'C', texto: 'Días', correcta: false }
    ],
    explicacion: 'El texto establece que el virus infectaba a las víctimas en cuestión de minutos.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp21: {
    id: 'comp21',
    titulo: 'La Cazadora',
    texto: 'La cazadora, con su arco y flechas, sabía que la presa era un ser mágico. Tuvo que cubrir sus flechas con plata, el único material conocido capaz de detenerlo.',
    tipo: 'causa_efecto',
    dificultad: 'facil',
    pregunta: '¿Cuál fue la causa de cubrir las flechas con plata?',
    alternativas: [
      { id: 'A', texto: 'Para evitar que se rompieran', correcta: false },
      { id: 'B', texto: 'Era el único material disponible', correcta: false },
      { id: 'C', texto: 'Era la única forma de herir a la presa', correcta: true }
    ],
    explicacion: 'Se indica que era el único material conocido capaz de detenerlo (a la presa mágica).',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp22: {
    id: 'comp22',
    titulo: 'La Capa Roja',
    texto: 'El joven con la capa roja debía cruzar la ciudadela abandonada antes del amanecer. De lo contrario, los guardianes de piedra se despertarían y lo atraparían.',
    tipo: 'idea_principal',
    dificultad: 'facil',
    pregunta: '¿Cuál es la idea central de la acción del joven?',
    alternativas: [
      { id: 'A', texto: 'Enfrentarse a los guardianes de piedra', correcta: false },
      { id: 'B', texto: 'Cruzar la ciudadela antes de un límite de tiempo', correcta: true },
      { id: 'C', texto: 'Despertar a los guardianes al amanecer', correcta: false }
    ],
    explicacion: 'El énfasis está en cruzar y la condición de antes del amanecer (límite de tiempo).',
    habilidad: 'Identificar Idea Principal'
  },

  comp23: {
    id: 'comp23',
    titulo: 'El Coche de Carreras',
    texto: 'El coche de carreras naranja se detuvo abruptamente. Su motor se había sobrecalentado debido a la alta fricción generada por el pavimento caliente de la pista.',
    tipo: 'causa_efecto',
    dificultad: 'medio',
    pregunta: '¿Cuál fue la causa directa de que el motor se sobrecalentara?',
    alternativas: [
      { id: 'A', texto: 'La alta fricción', correcta: true },
      { id: 'B', texto: 'El pavimento caliente', correcta: false },
      { id: 'C', texto: 'La parada abrupta del coche', correcta: false }
    ],
    explicacion: 'La alta fricción generada por el pavimento caliente fue lo que directamente causó el sobrecalentamiento.',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp24: {
    id: 'comp24',
    titulo: 'La Reina de Hielo',
    texto: 'La Reina de Hielo se sentó en su trono de cristal, observando la nieve caer. Su corazón permanecía frío e inmutable, al igual que el paisaje desolado que gobernaba.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué se puede deducir sobre el carácter de la Reina de Hielo?',
    alternativas: [
      { id: 'A', texto: 'Es una gobernante cruel', correcta: false },
      { id: 'B', texto: 'Es emocionalmente distante', correcta: true },
      { id: 'C', texto: 'Es muy solitaria', correcta: false }
    ],
    explicacion: 'El texto la describe como frío e inmutable, lo que infiere una falta de emociones o una gran distancia emocional.',
    habilidad: 'Hacer Inferencias'
  },

  comp25: {
    id: 'comp25',
    titulo: 'El Mapa del Pirata',
    texto: 'El pirata escondió el mapa bajo una tabla suelta del camarote del capitán. Era el lugar más seguro, lejos de los ojos curiosos de su tripulación.',
    tipo: 'detalle_especifico',
    dificultad: 'facil',
    pregunta: '¿Dónde estaba el mapa exactamente?',
    alternativas: [
      { id: 'A', texto: 'En el camarote del capitán', correcta: false },
      { id: 'B', texto: 'Escondido de la tripulación', correcta: false },
      { id: 'C', texto: 'Debajo de una tabla suelta', correcta: true }
    ],
    explicacion: 'El texto es muy preciso: bajo una tabla suelta del camarote.',
    habilidad: 'Identificar Detalles Específicos'
  },

  comp26: {
    id: 'comp26',
    titulo: 'Las Linternas Especiales',
    texto: 'El equipo de rescate usó linternas especiales para buscar en el túnel. Solo la luz ultravioleta era capaz de revelar las marcas fluorescentes dejadas por la criatura.',
    tipo: 'proposito_intencion',
    dificultad: 'facil',
    pregunta: '¿Por qué el equipo de rescate usó linternas especiales?',
    alternativas: [
      { id: 'A', texto: 'Para iluminar la oscuridad del túnel', correcta: false },
      { id: 'B', texto: 'Para que el equipo pudiera ver mejor', correcta: false },
      { id: 'C', texto: 'Para revelar las marcas dejadas por la criatura', correcta: true }
    ],
    explicacion: 'El texto dice que solo la luz ultravioleta era capaz de revelar las marcas.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp27: {
    id: 'comp27',
    titulo: 'El Examen de Magia',
    texto: 'Antes del examen final de la escuela de magia, el estudiante repasó toda la noche. Su objetivo era obtener la máxima nota y asegurar un puesto en el Consejo de Hechiceros.',
    tipo: 'proposito_intencion',
    dificultad: 'facil',
    pregunta: '¿Cuál era el objetivo final del estudiante?',
    alternativas: [
      { id: 'A', texto: 'Repasar la noche entera', correcta: false },
      { id: 'B', texto: 'Conseguir la máxima nota', correcta: false },
      { id: 'C', texto: 'Asegurar un puesto en el Consejo', correcta: true }
    ],
    explicacion: 'El objetivo final era asegurar un puesto en el Consejo de Hechiceros, la máxima nota era el medio para lograrlo.',
    habilidad: 'Identificar Propósito/Intención'
  },

  comp28: {
    id: 'comp28',
    titulo: 'El Explorador Perdido',
    texto: 'El explorador llevaba tres días sin agua en el desierto. Cuando vio el oasis, corrió hacia él, pero al llegar descubrió que era solo un espejismo.',
    tipo: 'causa_efecto',
    dificultad: 'medio',
    pregunta: '¿Qué provocó que el explorador corriera?',
    alternativas: [
      { id: 'A', texto: 'Llevaba tres días sin agua', correcta: false },
      { id: 'B', texto: 'Vio lo que parecía un oasis', correcta: true },
      { id: 'C', texto: 'Descubrió que era un espejismo', correcta: false }
    ],
    explicacion: 'La causa inmediata de su acción (correr) fue ver el oasis, aunque resultara ser un espejismo.',
    habilidad: 'Identificar Causa-Efecto'
  },

  comp29: {
    id: 'comp29',
    titulo: 'La Última Batalla',
    texto: 'El ejército rebelde luchaba en inferioridad numérica, pero su determinación era inquebrantable. Sabían que esta batalla decidiría el futuro de todo el reino.',
    tipo: 'idea_principal',
    dificultad: 'medio',
    pregunta: '¿Cuál es la idea central del texto?',
    alternativas: [
      { id: 'A', texto: 'Un ejército en inferioridad numérica', correcta: false },
      { id: 'B', texto: 'Una batalla decisiva para el reino', correcta: true },
      { id: 'C', texto: 'La determinación de los rebeldes', correcta: false }
    ],
    explicacion: 'La idea central es la importancia de esta batalla que decidiría el futuro del reino, los demás son detalles secundarios.',
    habilidad: 'Identificar Idea Principal'
  },

  comp30: {
    id: 'comp30',
    titulo: 'El Científico Loco',
    texto: 'El científico trabajaba en secreto en su laboratorio subterráneo. Sus experimentos con la genética habían sido prohibidos por la comunidad científica, pero él creía que estaba a punto de un gran descubrimiento.',
    tipo: 'inferencia',
    dificultad: 'medio',
    pregunta: '¿Qué podemos inferir sobre el científico?',
    alternativas: [
      { id: 'A', texto: 'Está violando normas éticas', correcta: true },
      { id: 'B', texto: 'Trabaja para el gobierno', correcta: false },
      { id: 'C', texto: 'Tiene un laboratorio muy grande', correcta: false }
    ],
    explicacion: 'Si sus experimentos fueron prohibidos y los hace en secreto, se infiere que está violando normas éticas de la comunidad científica.',
    habilidad: 'Hacer Inferencias'
  }
};

// Lista de IDs para acceso rápido
export const game3TextIds = Object.keys(game3Texts);

// Obtener texto por ID
export function getGame3Text(textId) {
  return game3Texts[textId] || null;
}

// Obtener textos por tipo
export function getGame3TextsByType(tipo) {
  return Object.values(game3Texts).filter(text => text.tipo === tipo);
}

// Obtener textos por dificultad
export function getGame3TextsByDifficulty(dificultad) {
  return Object.values(game3Texts).filter(text => text.dificultad === dificultad);
}
