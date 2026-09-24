/**
 * ============================================
 * TEST DIAGNÓSTICO COMPLETO Y DESAFIANTE
 * ============================================
 * 10 preguntas que evalúan comprensión lectora
 * en profundidad con textos más complejos
 */

export const testDiagnostico = {
  titulo: "Test Diagnóstico Avanzado de Comprensión Lectora",
  descripcion: "Responde estas 10 preguntas para obtener un diagnóstico preciso de tu nivel de comprensión",
  preguntas: [
    {
      id: 1,
      habilidad: "idea_principal",
      texto: "La inteligencia artificial ha revolucionado múltiples sectores, desde la medicina hasta la educación. Los algoritmos de aprendizaje automático pueden analizar grandes cantidades de datos para detectar patrones que los humanos no perciben. Sin embargo, esta tecnología plantea dilemas éticos importantes: ¿quién es responsable cuando una IA comete un error? ¿Cómo garantizamos que no reproduzca sesgos humanos? Estos cuestionamientos exigen que la sociedad establezca marcos regulatorios claros antes de que la IA se vuelva omnipresente en nuestras vidas.",
      pregunta: "¿Cuál es la idea principal que el autor intenta transmitir?",
      alternativas: [
        "La inteligencia artificial es una tecnología peligrosa que debe prohibirse",
        "La IA ofrece beneficios significativos pero requiere regulación ética urgente",
        "Los algoritmos de aprendizaje automático son superiores al pensamiento humano",
        "La medicina y la educación son los únicos sectores beneficiados por la IA"
      ],
      respuesta_correcta: 1
    },
    {
      id: 2,
      habilidad: "inferencia",
      texto: "Lucía revisó su reloj por quinta vez en diez minutos. Sus manos temblaban ligeramente mientras hojeaba sin leer el folleto informativo. Cuando finalmente llamaron su nombre, respiró profundo, se puso de pie con determinación y caminó hacia la puerta con paso firme, aunque su corazón latía aceleradamente.",
      pregunta: "¿Qué situación está viviendo Lucía?",
      alternativas: [
        "Está esperando para una entrevista de trabajo o examen importante",
        "Está en una sala de espera del médico por una enfermedad grave",
        "Está esperando a una amiga que llega tarde",
        "Está nerviosa porque perdió algo importante"
      ],
      respuesta_correcta: 0
    },
    {
      id: 3,
      habilidad: "causa_efecto",
      texto: "Durante la década de 1930, una severa sequía azotó las Grandes Llanuras de Estados Unidos. Los agricultores, buscando maximizar sus ganancias, habían eliminado la vegetación nativa y arado profundamente la tierra. Cuando llegaron los vientos, no había raíces que sujetaran el suelo. Se formaron gigantescas tormentas de polvo que oscurecieron el cielo, destruyeron cosechas y obligaron a miles de familias a abandonar sus hogares, migrando hacia California en busca de oportunidades.",
      pregunta: "Según el texto, ¿cuál fue la causa principal de las tormentas de polvo?",
      alternativas: [
        "La sequía natural que afectó la región",
        "La eliminación de vegetación nativa que dejó el suelo sin protección",
        "La migración de familias hacia California",
        "Los vientos fuertes que soplaban en la región"
      ],
      respuesta_correcta: 1
    },
    {
      id: 4,
      habilidad: "secuencia",
      texto: "Para preparar pan casero, primero debes mezclar la harina con la levadura y la sal. Luego, añade agua tibia y amasa durante 10 minutos hasta obtener una masa elástica. Después, cubre la masa y déjala reposar en un lugar cálido durante una hora hasta que duplique su tamaño. Finalmente, dale forma, colócala en un molde engrasado y hornea a 200°C por 30 minutos.",
      pregunta: "¿Qué paso viene inmediatamente después de amasar la masa?",
      alternativas: [
        "Hornear a 200°C por 30 minutos",
        "Cubrir y dejar reposar en lugar cálido durante una hora",
        "Mezclar la harina con la levadura",
        "Dar forma y colocar en un molde engrasado"
      ],
      respuesta_correcta: 1
    },
    {
      id: 5,
      habilidad: "detalle_especifico",
      texto: "El Museo de Historia Natural anuncia una exposición especial sobre dinosaurios del Jurásico. La muestra incluye 15 réplicas a escala real, fósiles auténticos de más de 150 millones de años y proyecciones holográficas interactivas. El evento se realizará del 5 al 28 de febrero en el ala norte del museo. Las entradas tienen un valor de $5.000 para adultos, $3.000 para estudiantes y niños menores de 5 años entran gratis. Los grupos escolares de más de 20 estudiantes obtienen 25% de descuento.",
      pregunta: "¿Cuánto pagaría un grupo escolar de 25 estudiantes por las entradas?",
      alternativas: [
        "$75.000",
        "$56.250",
        "$62.500",
        "$50.000"
      ],
      respuesta_correcta: 1
    },
    {
      id: 6,
      habilidad: "vocabulario_contextual",
      texto: "El nuevo medicamento demostró ser eficaz en el tratamiento de la enfermedad, pero su naturaleza efímera preocupaba a los investigadores. Los efectos beneficiosos desaparecían completamente después de solo 48 horas, lo que obligaba a los pacientes a tomar dosis diarias para mantener la mejoría.",
      pregunta: "En el contexto, 'efímera' significa:",
      alternativas: [
        "Duradera y permanente",
        "Breve y pasajera",
        "Intensa y poderosa",
        "Costosa y exclusiva"
      ],
      respuesta_correcta: 1
    },
    {
      id: 7,
      habilidad: "proposito_autor",
      texto: "Cada año, millones de toneladas de plástico terminan en nuestros océanos, creando islas de basura del tamaño de países enteros. Las tortugas marinas confunden las bolsas plásticas con medusas y mueren al ingerirlas. Los microplásticos contaminan la cadena alimenticia y llegan hasta nuestros platos. ¿Seguiremos siendo indiferentes mientras destruimos el hogar de miles de especies? El cambio debe comenzar hoy, con decisiones simples: rechazar plásticos de un solo uso, reciclar correctamente y exigir a las empresas que adopten envases biodegradables.",
      pregunta: "¿Cuál es el propósito principal del autor al escribir este texto?",
      alternativas: [
        "Informar objetivamente sobre la contaminación oceánica",
        "Persuadir al lector para que tome acción contra el uso de plásticos",
        "Entretener con historias sobre tortugas marinas",
        "Describir el proceso de fabricación del plástico"
      ],
      respuesta_correcta: 1
    },
    {
      id: 8,
      habilidad: "comparacion_contraste",
      texto: "Mientras que la energía solar aprovecha directamente la radiación del sol mediante paneles fotovoltaicos, la energía eólica transforma la fuerza del viento en electricidad a través de turbinas. Ambas son fuentes renovables y limpias, pero difieren en su disponibilidad: la solar depende de la luz diurna y las condiciones climáticas, mientras que la eólica puede generar energía día y noche si hay viento suficiente. Los costos de instalación de paneles solares son menores para uso residencial, pero los parques eólicos generan mayor cantidad de energía a escala industrial.",
      pregunta: "¿En qué se diferencian principalmente la energía solar y eólica según el texto?",
      alternativas: [
        "Una es renovable y la otra no",
        "En sus fuentes de energía (sol vs viento) y disponibilidad temporal",
        "En que solo la solar sirve para uso residencial",
        "En que la eólica contamina más que la solar"
      ],
      respuesta_correcta: 1
    },
    {
      id: 9,
      habilidad: "inferencia_compleja",
      texto: "La biblioteca del pueblo permanecía abierta hasta las 22:00 horas todos los días, incluso festivos. Elena, la bibliotecaria, conocía por nombre a cada visitante habitual y recordaba sus géneros literarios favoritos. Cuando alguien devolvía un libro con las esquinas dobladas o páginas manchadas, Elena suspiraba con tristeza pero jamás hacía comentarios negativos. En cambio, dedicaba sus fines de semana a restaurar cuidadosamente esos ejemplares dañados.",
      pregunta: "¿Qué se puede inferir sobre la relación de Elena con su trabajo?",
      alternativas: [
        "Lo considera solo un empleo temporal sin importancia",
        "Siente pasión genuina por los libros y valora su labor educativa",
        "Está frustrada con los usuarios descuidados",
        "Trabaja solo por necesidad económica"
      ],
      respuesta_correcta: 1
    },
    {
      id: 10,
      habilidad: "analisis_critico",
      texto: "Un estudio reciente afirma que las personas que duermen menos de 6 horas diarias tienen 30% más probabilidades de desarrollar enfermedades cardíacas. Sin embargo, el estudio fue financiado por una empresa fabricante de colchones y solo incluyó 150 participantes durante 6 meses. Además, no consideró otros factores como dieta, ejercicio o niveles de estrés que podrían influir en los resultados.",
      pregunta: "¿Qué aspecto debilita la credibilidad de este estudio?",
      alternativas: [
        "El porcentaje del 30% es demasiado bajo",
        "El financiamiento por empresa interesada, muestra pequeña y falta de control de variables",
        "La duración de 6 meses es demasiado larga",
        "Que solo se enfoque en enfermedades cardíacas"
      ],
      respuesta_correcta: 1
    }
  ]
};
