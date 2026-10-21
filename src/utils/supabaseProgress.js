import { supabase } from './supabaseClient'

/**
 * Persists a completed game activity using the authenticated user's identity.
 * Skill-level response records will be added after the pedagogical model is
 * agreed with the teacher.
 */
export async function guardarSesionDeJuego(intento) {
  if (!supabase) {
    throw new Error('Supabase no está configurado para guardar el progreso.')
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError

  const userId = authData.user?.id
  if (!userId) {
    throw new Error('No hay un usuario autenticado para asociar el progreso.')
  }

  const { error } = await supabase.from('game_sessions').insert({
    user_id: userId,
    game_id: intento.gameId,
    content_id: intento.textId,
    correct_answers: intento.correctAnswers,
    total_questions: intento.totalQuestions,
    score: intento.score,
    details: {
      errors: intento.errores || []
    }
  })

  if (error) throw error
}
