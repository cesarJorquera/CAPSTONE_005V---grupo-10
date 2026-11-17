-- Daily response counts for the teacher dashboard activity chart.
-- Returns anonymized player numbers, never profile UUIDs or names.

create or replace function public.leer_actividad_diaria_docente(p_dias integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  resultado jsonb;
begin
  if auth.uid() is null or not public.usuario_es_docente() then
    raise exception 'Se requiere una cuenta docente para consultar el dashboard.'
      using errcode = '42501';
  end if;

  if p_dias is null or p_dias not between 1 and 90 then
    raise exception 'El periodo debe estar entre 1 y 90 días.'
      using errcode = '22023';
  end if;

  with alumnos as (
    select
      p.id,
      row_number() over (order by p.created_at, p.id)::integer as numero
    from public.profiles p
    where p.rol = 'alumno'
       or p.id = (select auth.uid())
  ),
  actividad as (
    select
      a.numero as jugador,
      coalesce(g.unit_id, 0) as unidad,
      (r.answered_at at time zone 'America/Santiago')::date as dia,
      count(*)::integer as respuestas
    from public.game_responses r
    join public.game_sessions s on s.id = r.session_id
    join alumnos a on a.id = s.user_id
    left join public.games g on g.id = s.game_id
    where r.answered_at >= now() - make_interval(days => p_dias)
    group by
      a.numero,
      coalesce(g.unit_id, 0),
      (r.answered_at at time zone 'America/Santiago')::date
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'playerId', a.jugador,
    'unitId', a.unidad,
    'day', a.dia,
    'responses', a.respuestas
  ) order by a.dia, a.jugador, a.unidad), '[]'::jsonb)
  into resultado
  from actividad a;

  return jsonb_build_object('dailyActivity', resultado);
end;
$$;

revoke all on function public.leer_actividad_diaria_docente(integer) from public, anon;
grant execute on function public.leer_actividad_diaria_docente(integer) to authenticated;
