/**
 * ============================================
 * TEST DIAGNÓSTICO PRE-DISEÑADO
 * ============================================
 * 5 preguntas que evalúan las habilidades clave
 * de comprensión lectora
 */

export const testDiagnostico = {
  titulo: "Test Diagnóstico de Comprensión Lectora",
  descripcion: "Responde estas 5 preguntas para conocer tu nivel actual",
  preguntas: [
    {
      id: 1,
      habilidad: "idea_principal",
      texto: "Las redes sociales han transformado la forma en que nos comunicamos. Permiten conectar con personas de todo el mundo al instante, compartir experiencias y mantenerse informado. Sin embargo, su uso excesivo puede afectar la salud mental, reducir la productividad y crear adicción. Es importante encontrar un equilibrio saludable en su uso diario.",
      pregunta: "¿Cuál es la idea principal del texto?",
      alternativas: [
        "Las redes sociales son peligrosas y deberían evitarse",
        "Las redes sociales tienen beneficios pero requieren un uso equilibrado",
        "Las redes sociales solo sirven para compartir fotos"
      ],
      respuesta_correcta: 1
    },
    {
      id: 2,
      habilidad: "inferencia",
      texto: "María llegó a casa después de la escuela con una enorme sonrisa. Dejó su mochila en la entrada, corrió a abrazar a su mamá y le mostró un papel con un gran '7.0' escrito en rojo. Su mamá la felicitó y propuso celebrar con su postre favorito.",
      pregunta: "¿Qué podemos inferir sobre María?",
      alternativas: [
        "María sacó una buena nota en una prueba o trabajo",
        "María encontró dinero en la calle",
        "María ganó la lotería"
      ],
      respuesta_correcta: 0
    },
    {
      id: 3,
      habilidad: "causa_efecto",
      texto: "El cambio climático está provocando el derretimiento de los glaciares en los polos. Como resultado, el nivel del mar está aumentando gradualmente. Esto amenaza a las ciudades costeras con inundaciones y obliga a muchas especies marinas a migrar a aguas más frías.",
      pregunta: "Según el texto, ¿qué provoca el aumento del nivel del mar?",
      alternativas: [
        "Las especies marinas que migran",
        "El derretimiento de los glaciares",
        "Las inundaciones en ciudades costeras"
      ],
      respuesta_correcta: 1
    },
    {
      id: 4,
      habilidad: "detalle_especifico",
      texto: "El próximo sábado 15 de noviembre se realizará la Feria del Libro en la Plaza de Armas, desde las 10:00 hasta las 18:00 horas. Habrá descuentos de hasta 40% en libros de diferentes géneros. Los autores locales firmarán ejemplares entre las 14:00 y las 16:00 horas.",
      pregunta: "¿Hasta qué porcentaje de descuento habrá en la Feria del Libro?",
      alternativas: [
        "30%",
        "40%",
        "50%"
      ],
      respuesta_correcta: 1
    },
    {
      id: 5,
      habilidad: "vocabulario_contextual",
      texto: "El científico era muy perspicaz y podía detectar errores que otros pasaban por alto. Su habilidad para observar detalles mínimos le permitió resolver el misterio que había desconcertado a sus colegas durante meses.",
      pregunta: "En el texto, 'perspicaz' significa:",
      alternativas: [
        "Despistado y distraído",
        "Observador y astuto",
        "Rápido y veloz"
      ],
      respuesta_correcta: 1
    }
  ]
};
