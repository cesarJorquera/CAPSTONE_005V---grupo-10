import { supabase } from './supabaseClient'

const assessmentTypes = new Set(['basic_concept', 'reading_skill', 'text_type', 'other'])

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase no está configurado para guardar el progreso.')
  }
  return supabase
}

async function crearSesion({ gameId, contentId, totalQuestions, mode }) {
  const client = requireSupabase()
  const { data: authData, error: authError } = await client.auth.getUser()
  if (authError) throw authError

  const userId = authData.user?.id
  if (!userId) {
    throw new Error('No hay un usuario autenticado para asociar el progreso.')
  }

  const { data, error } = await client
    .from('game_sessions')
    .insert({
      user_id: userId,
      game_id: gameId,
      content_id: contentId,
      total_questions: totalQuestions,
      details: mode ? { mode } : {}
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

async function guardarRespuesta(sessionId, response) {
  const client = requireSupabase()
  const { error } = await client.from('game_responses').insert({
    session_id: sessionId,
    item_id: response.itemId,
    attempt_number: response.attemptNumber || 1,
    assessment_type: assessmentTypes.has(response.assessmentType)
      ? response.assessmentType
      : 'other',
    assessment_code: response.assessmentCode || null,
    answer: response.answer,
    is_correct: response.isCorrect
  })

  if (error) throw error
}

async function cerrarSesion(sessionId, status) {
  const client = requireSupabase()
  const endedAt = new Date().toISOString()

  const { error } = await client
    .from('game_sessions')
    .update({
      status,
      ended_at: endedAt,
      completed_at: status === 'completed' ? endedAt : null
    })
    .eq('id', sessionId)

  if (error) throw error
}

export function createGameProgressTracker({ gameId, contentId, totalQuestions, mode }) {
  const sessionPromise = crearSesion({ gameId, contentId, totalQuestions, mode })
  sessionPromise.catch(error => {
    console.error('❌ No se pudo iniciar la sesión de juego en Supabase:', error)
  })
  let pendingWrites = Promise.resolve()
  let closed = false

  return {
    async record(response) {
      if (closed) throw new Error('La partida ya está cerrada.')
      if (!response.itemId || typeof response.isCorrect !== 'boolean') {
        throw new Error('La respuesta necesita un identificador y un resultado válido.')
      }

      pendingWrites = pendingWrites.then(async () => {
        const sessionId = await sessionPromise
        await guardarRespuesta(sessionId, response)
      })
      return pendingWrites
    },

    async complete() {
      if (closed) return
      await pendingWrites
      const sessionId = await sessionPromise
      await cerrarSesion(sessionId, 'completed')
      closed = true
    },

    async abandon() {
      if (closed) return
      await pendingWrites
      const sessionId = await sessionPromise
      await cerrarSesion(sessionId, 'abandoned')
      closed = true
    }
  }
}

async function cerrarSesionesInterrumpidas(client) {
  const staleBefore = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: sessions, error: sessionsError } = await client
    .from('game_sessions')
    .select('id')
    .eq('status', 'in_progress')
    .lt('started_at', staleBefore)

  if (sessionsError) throw sessionsError
  if (!sessions.length) return

  const endedAt = new Date().toISOString()
  for (const session of sessions) {
    const { error } = await client
      .from('game_sessions')
      .update({
        status: 'abandoned',
        ended_at: endedAt,
        completed_at: null
      })
      .eq('id', session.id)

    if (error) throw error
  }
}

export async function cargarProgresoNube() {
  const client = requireSupabase()
  await cerrarSesionesInterrumpidas(client)

  const { data: sessions, error: sessionsError } = await client
    .from('game_sessions')
    .select('id, game_id, content_id, correct_answers, total_questions, score, answered_count, status, started_at, ended_at')
    .order('started_at', { ascending: true })

  if (sessionsError) throw sessionsError
  if (!sessions.length) return []

  const sessionIds = sessions.map(session => session.id)
  const { data: responses, error: responsesError } = await client
    .from('game_responses')
    .select('session_id, item_id, assessment_type, assessment_code, answer, is_correct, answered_at')
    .in('session_id', sessionIds)
    .order('answered_at', { ascending: true })

  if (responsesError) throw responsesError

  const responsesBySession = new Map()
  responses.forEach(response => {
    const items = responsesBySession.get(response.session_id) || []
    items.push(response)
    responsesBySession.set(response.session_id, items)
  })

  return sessions.map(session => {
    const sessionResponses = responsesBySession.get(session.id) || []
    return {
      gameId: session.game_id,
      textId: session.content_id,
      correctAnswers: session.correct_answers,
      totalQuestions: session.total_questions,
      score: session.score,
      answeredCount: session.answered_count,
      completed: session.status === 'completed',
      status: session.status,
      date: session.ended_at || session.started_at,
      respuestas: sessionResponses,
      errores: sessionResponses
        .filter(response => !response.is_correct)
        .map(response => ({
          itemId: response.item_id,
          assessmentType: response.assessment_type,
          assessmentCode: response.assessment_code,
          answer: response.answer
        }))
    }
  })
}
