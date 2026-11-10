import { supabase } from './supabaseClient'

function clienteSupabase() {
  if (!supabase) {
    throw new Error('Supabase no está configurado. No se puede cargar Leo Dash.')
  }
  return supabase
}

export async function cargarDatosDashboardDocente(periodoDias) {
  const { data, error } = await clienteSupabase().rpc('leer_dashboard_docente', {
    p_dias: periodoDias
  })
  if (error) throw error
  if (!data || !Array.isArray(data.students) || !Array.isArray(data.recentResponses)) {
    throw new Error('Supabase devolvió datos incompletos para Leo Dash.')
  }
  return data
}

export function escucharCambiosDashboardDocente(alCambio, alEstado) {
  const channel = clienteSupabase()
    .channel('leo-dash-cambios')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_responses'
    }, alCambio)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'game_sessions'
    }, alCambio)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles'
    }, alCambio)
    .subscribe(alEstado)

  return () => {
    clienteSupabase().removeChannel(channel)
  }
}
