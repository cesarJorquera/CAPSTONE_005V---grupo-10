// Casos técnicos para ejercicios de comprensión lectora
// Cada caso tiene: título, carrera, texto (fragmento), preguntas guía

export const casos = [
  {
    id: 'informatica-hospital',
    titulo: 'Plataforma de Gestión Hospitalaria',
    carrera: 'Ingeniería Informática',
    color: 'teal',
    fragmento: `La red hospitalaria del Servicio de Salud del Biobío enfrenta desde hace varios años un aumento sostenido en la demanda de atención médica. Según los informes internos del servicio, durante la última década la cantidad de consultas médicas ha aumentado cerca de un 35%, mientras que el número de especialistas disponibles solo ha crecido un 8%.

En la región operan tres hospitales de alta complejidad que concentran gran parte de la atención especializada. En conjunto, estos establecimientos atienden aproximadamente a 1,2 millones de personas cada año. Sin embargo, gran parte de sus procesos administrativos continúan dependiendo de sistemas informáticos fragmentados o procedimientos manuales.

Uno de los mayores problemas se encuentra en la gestión de agendas médicas. Cada hospital utiliza sistemas distintos para registrar citas y administrar horarios de especialistas. Algunos de estos sistemas fueron desarrollados hace más de quince años y no cuentan con actualizaciones recientes.

María Torres, jefa de admisión de uno de los hospitales, comentó durante una entrevista interna: "Tenemos tres sistemas distintos para registrar citas. Uno para consultas médicas, otro para exámenes y otro para procedimientos. Ninguno se comunica con el otro. Muchas veces tenemos que revisar manualmente varias plataformas para confirmar una hora."

Esta fragmentación provoca duplicidad de registros, pérdida de información y dificultades para coordinar la atención de pacientes entre distintos servicios clínicos. En algunos casos, pacientes han llegado a un hospital para una consulta solo para descubrir que su cita no aparece en el sistema.

Para enfrentar esta situación, el Servicio de Salud del Biobío decide impulsar un proyecto de transformación digital que permita centralizar la gestión de citas médicas. El presupuesto asignado al proyecto asciende a 620 millones de pesos chilenos y el contrato establece un plazo de desarrollo de 10 meses. La plataforma deberá soportar al menos 12.000 usuarios concurrentes durante periodos de alta demanda.`,
    preguntasGuia: [
      '¿Cuál es el problema principal que enfrenta la red hospitalaria?',
      '¿Por qué los sistemas actuales generan problemas?',
      '¿Qué solución se propone?',
      '¿Cuáles son los desafíos técnicos mencionados?',
    ],
  },
  {
    id: 'gestion-personas-retail',
    titulo: 'Rotación Masiva en Empresa Retail',
    carrera: 'Ingeniería en Administración Mención Gestión de Personas',
    color: 'purple',
    fragmento: `La cadena de retail "Comercial Andina" enfrenta una crisis de rotación de personal que amenaza su operación en la Región Metropolitana. Durante el último año, la empresa registró una tasa de rotación del 42%, muy por encima del promedio del sector que se sitúa en 25%. Esto significa que de cada 10 trabajadores contratados, más de 4 abandonan la empresa antes de cumplir un año.

Los costos asociados son significativos. Según el departamento de finanzas, cada proceso de reclutamiento, selección y capacitación de un nuevo vendedor cuesta aproximadamente $800.000 pesos. Con una planta de 350 trabajadores y la rotación actual, la empresa está gastando cerca de $120 millones anuales solo en reemplazar personal que se va.

Carolina Méndez, gerente de operaciones, señaló en una reunión de directorio: "No es solo el costo. La rotación constante afecta la atención al cliente. Los clientes se quejan de que siempre hay personal nuevo que no conoce los productos ni los procesos."

Un estudio interno reveló las causas principales de la rotación. El 38% de los ex trabajadores mencionó horarios inflexibles como razón principal. El 27% señaló falta de oportunidades de crecimiento. El 21% mencionó trato inadecuado de parte de jefaturas. El resto citó razones varias como distancia al trabajo y salario percibido como bajo.

La empresa actualmente utiliza un sistema de turnos rígido donde los trabajadores no pueden intercambiar horarios entre sí sin autorización de su jefe directo. Además, no existe un programa formal de desarrollo de carrera. Los ascensos se otorgan de manera discrecional y muchas veces por cercanía con la jefatura más que por mérito.

El directorio ha exigido una solución urgente. Se ha asignado un presupuesto de $45 millones para implementar un plan de retención durante los próximos 8 meses. La meta es reducir la rotación al 28% para fin de año.

Entre las acciones evaluadas están: implementar un sistema de turnos flexibles, crear un programa de capacitación con certificación interna, establecer evaluaciones de desempeño transparentes, y capacitar a jefaturas en habilidades de liderazgo y comunicación.`,
    preguntasGuia: [
      '¿Cuál es la tasa de rotación actual y cuál es la meta?',
      '¿Cuáles son las tres causas principales de rotación?',
      '¿Qué problemas genera la rotación además del costo?',
      '¿Qué acciones se proponen para reducir la rotación?',
    ],
  },
  {
    id: 'finanzas-erp',
    titulo: 'Implementación de ERP Financiero',
    carrera: 'Ingeniería en Administración Mención Finanzas',
    color: 'blue',
    fragmento: `La empresa manufacturera "Metalúrgica del Sur" ha decidido implementar un sistema ERP (Enterprise Resource Planning) para integrar sus procesos financieros, de producción y de inventario. Actualmente, la empresa utiliza planillas de Excel separadas para cada área, lo que genera inconsistencias y retrabajos constantes.

El proyecto tiene un presupuesto asignado de $180 millones de pesos y un plazo de 12 meses. La empresa contrató a la consultora "TechFinance Consulting" para liderar la implementación. El equipo del proyecto está compuesto por 1 project manager, 2 consultores funcionales, 1 consultor técnico y 1 especialista en datos.

Durante la fase de diagnóstico, el equipo descubrió varios problemas. El área de finanzas maneja 14 planillas de Excel diferentes para registrar gastos, ingresos y presupuestos. No existe un código único de cuentas contables. Cada área usa su propia clasificación de gastos, lo que dificulta consolidar información para el directorio.

Roberto Silva, jefe de finanzas, expresó su preocupación: "Llevamos 6 meses cerrando la contabilidad de cada mes. Con el ERP esperamos reducir ese tiempo a 10 días, pero me preocupa que el personal no esté preparado para el cambio."

El área de producción registra su inventario en un sistema separado del área de compras. Esto ha causado situaciones donde producción dice que no hay materia prima, pero compras tiene registrado un pedido que aún no ha llegado. La falta de visibilidad en tiempo real genera paradas de producción innecesarias.

Otro desafío es la calidad de los datos históricos. Se encontraron registros duplicados de proveedores, códigos de productos inconsistentes y montos en planillas que no coinciden con los registros bancarios. El equipo estima que limpiar los datos históricos tomará al menos 3 meses de trabajo.

La gerencia general ha comunicado que el ERP es una prioridad estratégica y que todas las áreas deben colaborar. Sin embargo, algunos jefes de área han expresado resistencia al cambio, argumentando que los sistemas actuales "funcionan bien" y que el ERP solo agregará burocracia.

El éxito del proyecto dependerá de la capacidad del equipo para gestionar el cambio organizacional, limpiar los datos existentes y capacitar al personal en el uso del nuevo sistema.`,
    preguntasGuia: [
      '¿Por qué la empresa decidió implementar un ERP?',
      '¿Qué problemas encontró el equipo durante el diagnóstico?',
      '¿Cuál es la preocupación del jefe de finanzas?',
      '¿Qué resistencias al cambio existen?',
    ],
  },
];

export function obtenerCasoPorId(id) {
  return casos.find((c) => c.id === id) || casos[0];
}