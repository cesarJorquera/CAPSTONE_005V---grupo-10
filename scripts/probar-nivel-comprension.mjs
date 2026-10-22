// ============================================
// Pruebas de src/utils/nivelComprension.js (PR-05)
// El proyecto no tiene framework de test: se usa node:assert.
// Ejecutar desde la raíz:  node scripts/probar-nivel-comprension.mjs
// ============================================
import assert from 'node:assert/strict'
import {
  catalogoHabilidades,
  calcularNivelComprension,
  minimoCompetente
} from '../src/utils/nivelComprension.js'

const catalogo = catalogoHabilidades()
const habilidadPorCodigo = new Map(catalogo.map(h => [h.codigo, h]))
const codigoPorItem = new Map()
catalogo.forEach(h => h.items.forEach(item => codigoPorItem.set(item, h.codigo)))

// Habilidades ordenadas por cantidad de ítems (la primera es la más corta)
const porTamano = [...catalogo].sort((a, b) => a.items.length - b.items.length)

// ---- Ayudantes para armar historiales con la forma de cargarProgresoNube() ----
function respuesta(itemId, isCorrect, codigo = codigoPorItem.get(itemId)) {
  return { item_id: itemId, assessment_code: codigo, is_correct: isCorrect }
}

function sesion(respuestas, { gameId = 3, status = 'completed' } = {}) {
  return { gameId, status, completed: status === 'completed', respuestas }
}

// Una sesión con los primeros `n` ítems de la habilidad respondidos bien
function resolver(habilidad, n, opciones) {
  return sesion(habilidad.items.slice(0, n).map(item => respuesta(item, true)), opciones)
}

function habilidadDe(resultado, codigo) {
  return resultado.habilidades.find(h => h.codigo === codigo)
}

let pruebas = 0
function prueba(nombre, fn) {
  fn()
  pruebas++
  console.log(`  ✔ ${nombre}`)
}

console.log('Nivel de comprensión lectora (PR-05)')

prueba('el catálogo sale de game3_texts.js: 5 habilidades reading.* con 5, 6, 6, 6 y 7 ítems', () => {
  assert.equal(catalogo.length, 5)
  assert.deepEqual(porTamano.map(h => h.items.length), [5, 6, 6, 6, 7])
  catalogo.forEach(h => assert.match(h.codigo, /^reading\./))
})

prueba('sin datos (lista vacía, null, undefined): Explorador y todo en Descubriendo', () => {
  const sinDatos = [[], null, undefined]
  sinDatos.forEach(progreso => {
    const r = calcularNivelComprension(progreso, catalogo)
    assert.equal(r.nivel.id, 'explorador')
    assert.equal(r.habilidadesQueSuman, 0)
    r.habilidades.forEach(h => {
      assert.equal(h.resueltos, 0)
      assert.equal(h.estado.id, 'descubriendo')
    })
    assert.deepEqual(r.siguienteNivel, { id: 'aprendiz', nombre: 'Aprendiz', faltanHabilidades: 1 })
    assert.equal(r.mensaje, 'Te falta 1 habilidad para llegar a Aprendiz.')
  })
})

prueba('umbral de Competente usa Math.ceil(total * 0.8)', () => {
  assert.equal(minimoCompetente(5), 4)
  assert.equal(minimoCompetente(6), 5)
  assert.equal(minimoCompetente(7), 6)
})

prueba('justo en cada umbral (habilidad de 5 ítems): 2→Descubriendo, 3→Practicando, 4→Competente, 5→Dominado', () => {
  const corta = porTamano[0]
  const esperado = { 2: 'descubriendo', 3: 'practicando', 4: 'competente', 5: 'dominado' }
  Object.entries(esperado).forEach(([n, estado]) => {
    const h = habilidadDe(calcularNivelComprension([resolver(corta, Number(n))], catalogo), corta.codigo)
    assert.equal(h.resueltos, Number(n))
    assert.equal(h.estado.id, estado, `${n} resueltos`)
  })
})

prueba('justo en el umbral (habilidad de 7 ítems): 5→Practicando, 6→Competente', () => {
  const larga = porTamano[4]
  assert.equal(habilidadDe(calcularNivelComprension([resolver(larga, 5)], catalogo), larga.codigo).estado.id, 'practicando')
  assert.equal(habilidadDe(calcularNivelComprension([resolver(larga, 6)], catalogo), larga.codigo).estado.id, 'competente')
})

prueba('lo que falta para el siguiente estado se informa en positivo', () => {
  const corta = porTamano[0]
  const h = habilidadDe(calcularNivelComprension([resolver(corta, 1)], catalogo), corta.codigo)
  assert.deepEqual(h.siguienteEstado, { id: 'practicando', nombre: 'Practicando', faltan: 2 })
  assert.equal(h.mensaje, 'Resuelve 2 textos más para llegar a Practicando.')
  const dominada = habilidadDe(calcularNivelComprension([resolver(corta, 5)], catalogo), corta.codigo)
  assert.equal(dominada.siguienteEstado, null)
  assert.equal(dominada.mensaje, '¡Resolviste todos los textos de esta habilidad!')
})

prueba('reintento correcto de un ítem fallado lo cuenta como resuelto (otra sesión y misma sesión)', () => {
  const item = porTamano[0].items[0]
  const enOtraSesion = calcularNivelComprension([
    sesion([respuesta(item, false)]),
    sesion([respuesta(item, true)])
  ], catalogo)
  assert.equal(habilidadDe(enOtraSesion, porTamano[0].codigo).resueltos, 1)

  const enMismaSesion = calcularNivelComprension([
    sesion([respuesta(item, false), respuesta(item, true)])
  ], catalogo)
  assert.equal(habilidadDe(enMismaSesion, porTamano[0].codigo).resueltos, 1)
})

prueba('un fallo posterior no quita un ítem ya resuelto', () => {
  const item = porTamano[0].items[0]
  const r = calcularNivelComprension([
    sesion([respuesta(item, true)]),
    sesion([respuesta(item, false)])
  ], catalogo)
  assert.equal(habilidadDe(r, porTamano[0].codigo).resueltos, 1)
})

prueba('respuestas repetidas del mismo ítem no se cuentan dos veces', () => {
  const item = porTamano[0].items[0]
  const r = calcularNivelComprension([
    sesion([respuesta(item, true), respuesta(item, true)]),
    sesion([respuesta(item, true)]),
    sesion([respuesta(item, true)], { status: 'abandoned' })
  ], catalogo)
  assert.equal(habilidadDe(r, porTamano[0].codigo).resueltos, 1)
})

prueba('las respuestas correctas de una sesión abandonada cuentan', () => {
  const corta = porTamano[0]
  const r = calcularNivelComprension([resolver(corta, 4, { status: 'abandoned' })], catalogo)
  assert.equal(habilidadDe(r, corta.codigo).estado.id, 'competente')
  assert.equal(r.nivel.id, 'aprendiz')
})

prueba('códigos desconocidos, otros juegos e ítems inexistentes no entran al nivel', () => {
  const item = porTamano[0].items[0]
  const r = calcularNivelComprension([
    sesion([respuesta(item, true, 'reading.inventado')]),
    sesion([respuesta(item, true, 'language.noun')]),
    sesion([respuesta(item, true, 'foundation.habilidades_lectoras')]),
    sesion([respuesta(item, true, null)]),
    sesion([respuesta('comp999', true, porTamano[0].codigo)]),
    sesion([{ item_id: item, assessment_code: porTamano[0].codigo, is_correct: 'true' }]),
    sesion([respuesta(item, true)], { gameId: 4 }),
    sesion([respuesta(item, true)], { gameId: 1 }),
    { gameId: 3 },
    null
  ], catalogo)
  assert.equal(r.habilidades.reduce((suma, h) => suma + h.resueltos, 0), 0)
  assert.equal(r.nivel.id, 'explorador')
})

prueba('niveles: 1 Competente→Aprendiz, 3→Lector, 5→Maestro, con lo que falta', () => {
  const competentes = n => porTamano.slice(0, n).map(h => resolver(h, minimoCompetente(h.items.length)))

  const aprendiz = calcularNivelComprension(competentes(1), catalogo)
  assert.equal(aprendiz.nivel.id, 'aprendiz')
  assert.equal(aprendiz.mensaje, 'Te faltan 2 habilidades para llegar a Lector.')

  const casiLector = calcularNivelComprension(competentes(2), catalogo)
  assert.equal(casiLector.nivel.id, 'aprendiz')
  assert.equal(casiLector.mensaje, 'Te falta 1 habilidad para llegar a Lector.')

  const lector = calcularNivelComprension(competentes(3), catalogo)
  assert.equal(lector.nivel.id, 'lector')
  assert.equal(lector.siguienteNivel.faltanHabilidades, 2)

  const maestro = calcularNivelComprension(competentes(5), catalogo)
  assert.equal(maestro.nivel.id, 'maestro')
  assert.equal(maestro.siguienteNivel, null)
  assert.match(maestro.mensaje, /^¡Llegaste a Maestro!/)
})

prueba('Practicando no suma para el nivel; Dominado sí', () => {
  const practicando = calcularNivelComprension(porTamano.map(h => resolver(h, 3)), catalogo)
  assert.equal(practicando.habilidadesQueSuman, 0)
  assert.equal(practicando.nivel.id, 'explorador')

  const todo = calcularNivelComprension(porTamano.map(h => resolver(h, h.items.length)), catalogo)
  assert.equal(todo.habilidadesQueSuman, 5)
  assert.equal(todo.nivel.id, 'maestro')
  assert.equal(todo.mensaje, '¡Dominaste todas las habilidades! Eres Maestro de la lectura.')
})

// ---- Propiedades con historiales aleatorios (semilla fija = repetible) ----
function generador(semilla) {
  let s = semilla
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

function historialAleatorio(azar, sesiones) {
  const todosLosItems = [...codigoPorItem.keys()]
  return Array.from({ length: sesiones }, () => sesion(
    Array.from({ length: 1 + Math.floor(azar() * 6) }, () =>
      respuesta(todosLosItems[Math.floor(azar() * todosLosItems.length)], azar() < 0.5)
    ),
    {
      gameId: azar() < 0.8 ? 3 : 1 + Math.floor(azar() * 4),
      status: ['completed', 'abandoned', 'in_progress'][Math.floor(azar() * 3)]
    }
  ))
}

prueba('mismo historial → mismo resultado, sin importar el orden de las sesiones', () => {
  const azar = generador(42)
  for (let i = 0; i < 200; i++) {
    const historial = historialAleatorio(azar, 12)
    const invertido = [...historial].reverse()
    assert.deepEqual(calcularNivelComprension(invertido, catalogo), calcularNivelComprension(historial, catalogo))
  }
})

prueba('el nivel y los resueltos nunca disminuyen al agregar sesiones', () => {
  const azar = generador(7)
  for (let i = 0; i < 100; i++) {
    const historial = historialAleatorio(azar, 40)
    let anterior = calcularNivelComprension([], catalogo)
    for (let k = 1; k <= historial.length; k++) {
      const actual = calcularNivelComprension(historial.slice(0, k), catalogo)
      assert.ok(actual.nivel.indice >= anterior.nivel.indice, 'el nivel bajó')
      actual.habilidades.forEach((h, j) => assert.ok(h.resueltos >= anterior.habilidades[j].resueltos, 'resueltos bajó'))
      anterior = actual
    }
  }
})

prueba('ningún mensaje habla de bajar o perder', () => {
  const azar = generador(99)
  const prohibido = /baj|perd|retroced|peor|mal\b/i
  for (let i = 0; i < 300; i++) {
    const r = calcularNivelComprension(historialAleatorio(azar, Math.floor(azar() * 60)), catalogo)
    assert.doesNotMatch(r.mensaje, prohibido)
    r.habilidades.forEach(h => assert.doesNotMatch(h.mensaje, prohibido))
  }
})

assert.equal(habilidadPorCodigo.size, catalogo.length, 'códigos de habilidad repetidos')
console.log(`\n${pruebas} pruebas OK`)
