function toCode(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

const wordTypeCodes = [
  { pattern: /sustantivo/, code: 'language.noun' },
  { pattern: /verbo/, code: 'language.verb' },
  { pattern: /adjetivo/, code: 'language.adjective' },
  { pattern: /adverbio/, code: 'language.adverb' },
  { pattern: /conector/, code: 'language.connector' }
]

export function keywordQuestionAssessment(question) {
  const answer = String(question.correct || '')
  const matchedType = wordTypeCodes.find(({ pattern }) => pattern.test(answer))

  return {
    type: 'basic_concept',
    code: matchedType ? matchedType.code : 'language.keyword_concepts'
  }
}

export function wordSlotAssessment(slot) {
  const type = String(slot.tipoRequerido || '')
  const matchedType = wordTypeCodes.find(({ pattern }) => pattern.test(type))

  return {
    type: 'basic_concept',
    code: matchedType ? matchedType.code : 'language.word_classification'
  }
}

export function readingQuestionAssessment(skill) {
  return {
    type: 'reading_skill',
    code: `reading.${toCode(skill) || 'unspecified'}`
  }
}

export function triviaQuestionAssessment(category) {
  const categoryCode = toCode(category)
  const isReadingSkill = /habilidades_lectoras|estrategias_de_lectura/.test(categoryCode)

  return {
    type: isReadingSkill ? 'reading_skill' : 'basic_concept',
    code: `foundation.${categoryCode || 'unspecified'}`
  }
}
