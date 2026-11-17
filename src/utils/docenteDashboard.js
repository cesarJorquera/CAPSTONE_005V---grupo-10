import { supabase } from './supabaseClient'

function clienteSupabase() {
  if (!supabase) {
    throw new Error('Supabase no está configurado. No se puede cargar Leo Dash.')
  }
  return supabase
}

export async function cargarDatosDashboardDocente(periodoDias) {
  const cliente = clienteSupabase()
  const [resumen, actividad] = await Promise.all([
    cliente.rpc('leer_dashboard_docente', { p_dias: periodoDias }),
    cliente.rpc('leer_actividad_diaria_docente', { p_dias: periodoDias })
  ])
  if (resumen.error) throw resumen.error
  if (actividad.error) throw actividad.error
  if (
    !resumen.data ||
    !Array.isArray(resumen.data.students) ||
    !Array.isArray(resumen.data.recentResponses) ||
    !actividad.data ||
    !Array.isArray(actividad.data.dailyActivity)
  ) {
    throw new Error('Supabase devolvió datos incompletos para Leo Dash.')
  }
  return { ...resumen.data, dailyActivity: actividad.data.dailyActivity }
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
