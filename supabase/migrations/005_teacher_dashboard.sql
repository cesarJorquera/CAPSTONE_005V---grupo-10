-- Teacher dashboard for the global pilot. Teachers can inspect all student
-- profiles and learning activity until course membership is implemented.

create or replace function public.usuario_es_docente()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.rol = 'docente'
  );
$$;

revoke all on function public.usuario_es_docente() from public, anon;
grant execute on function public.usuario_es_docente() to authenticated;

drop policy if exists "docente: leer perfiles para dashboard" on public.profiles;
create policy "docente: leer perfiles para dashboard"
  on public.profiles for select
  to authenticated
  using (public.usuario_es_docente());

drop policy if exists "docente: leer sesiones para dashboard" on public.game_sessions;
create policy "docente: leer sesiones para dashboard"
  on public.game_sessions for select
  to authenticated
  using (public.usuario_es_docente());

drop policy if exists "docente: leer respuestas para dashboard" on public.game_responses;
create policy "docente: leer respuestas para dashboard"
  on public.game_responses for select
  to authenticated
  using (public.usuario_es_docente());

create index if not exists game_responses_answered_at_idx
  on public.game_responses (answered_at desc);

create or replace function public.leer_dashboard_docente(p_dias integer default 30)
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
      row_number() over (order by p.created_at, p.id)::integer as numero,
      (p.rol = 'docente') as es_docente
    from public.profiles p
    where p.rol = 'alumno'
       or p.id = (select auth.uid())
  ),
  sesiones as (
    select s.*
    from public.game_sessions s
    join alumnos a on a.id = s.user_id
  ),
  respuestas as (
    select r.*, s.user_id, s.game_id, coalesce(g.unit_id, 0) as unit_id
    from public.game_responses r
    join sesiones s on s.id = r.session_id
    left join public.games g on g.id = s.game_id
  ),
  sesiones_resumen as (
    select
      s.user_id,
      count(*)::integer as total,
      count(*) filter (where s.status = 'completed')::integer as completadas,
      count(*) filter (where s.status = 'abandoned')::integer as abandonadas
    from sesiones s
    group by s.user_id
  ),
  respuestas_resumen as (
    select
      r.user_id,
      count(*)::integer as total,
      count(*) filter (where r.is_correct)::integer as correctas,
      max(r.answered_at) as ultima_actividad,
      count(distinct (r.answered_at at time zone 'America/Santiago')::date)::integer as dias_activos
    from respuestas r
    group by r.user_id
  ),
  dias as (
    select distinct
      r.user_id,
      (r.answered_at at time zone 'America/Santiago')::date as dia
    from respuestas r
  ),
  dias_ordenados as (
    select
      d.user_id,
      d.dia,
      d.dia + row_number() over (partition by d.user_id order by d.dia desc)::integer as grupo
    from dias d
  ),
  rachas as (
    select
      d.user_id,
      count(*)::integer as largo,
      max(d.dia) as ultimo_dia
    from dias_ordenados d
    group by d.user_id, d.grupo
  ),
  actividad_aprobada as (
    select distinct s.user_id, s.game_id, s.content_id
    from sesiones s
    where s.status = 'completed'
      and s.total_questions > 0
      and s.correct_answers = s.total_questions
  ),
  actividad_completada as (
    select distinct s.user_id, s.game_id, s.content_id
    from sesiones s
    where s.status = 'completed'
  ),
  sesiones_periodo as (
    select
      s.user_id,
      coalesce(g.unit_id, 0) as unit_id,
      count(*)::integer as total,
      count(*) filter (where s.status = 'completed')::integer as completadas,
      count(*) filter (where s.status = 'abandoned')::integer as abandonadas,
      count(*) filter (where s.status = 'in_progress')::integer as en_curso
    from sesiones s
    left join public.games g on g.id = s.game_id
    where s.started_at >= now() - make_interval(days => p_dias)
    group by s.user_id, coalesce(g.unit_id, 0)
  ),
  habilidades_periodo as (
    select
      r.user_id,
      r.unit_id,
      coalesce(r.assessment_code, 'sin_clasificar') as codigo,
      count(*)::integer as intentos,
      count(*) filter (where r.is_correct)::integer as correctos,
      count(*) filter (where r.attempt_number = 1)::integer as primeros_intentos,
      count(*) filter (where r.attempt_number = 1 and r.is_correct)::integer as primeros_correctos
    from respuestas r
    where r.answered_at >= now() - make_interval(days => p_dias)
    group by r.user_id, r.unit_id, coalesce(r.assessment_code, 'sin_clasificar')
  ),
  eventos_recientes as (
    select
      r.id,
      r.user_id,
      a.numero,
      a.es_docente,
      r.game_id,
      r.unit_id,
      r.item_id,
      r.assessment_code,
      r.is_correct,
      r.attempt_number,
      r.answered_at,
      case when not r.is_correct then r.answer else null end as respuesta_incorrecta
    from respuestas r
    join alumnos a on a.id = r.user_id
    where r.answered_at >= now() - make_interval(days => p_dias)
    order by r.answered_at desc, r.id desc
    limit 40
  )
  select jsonb_build_object(
    'generatedAt', now(),
    'periodDays', p_dias,
    'students', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.numero,
        'name', 'Jugador ' || a.numero::text,
        'isTeacher', a.es_docente,
        'totalSessions', coalesce(sr.total, 0),
        'completedSessions', coalesce(sr.completadas, 0),
        'abandonedSessions', coalesce(sr.abandonadas, 0),
        'totalAnswers', coalesce(rr.total, 0),
        'correctAnswers', coalesce(rr.correctas, 0),
        'lastActivityAt', rr.ultima_actividad,
        'activeDays', coalesce(rr.dias_activos, 0),
        'currentStreakDays', coalesce((
          select max(st.largo)
          from rachas st
          where st.user_id = a.id
            and st.ultimo_dia between
              (now() at time zone 'America/Santiago')::date - 1
              and (now() at time zone 'America/Santiago')::date
        ), 0),
        'bestStreakDays', coalesce((
          select max(st.largo)
          from rachas st
          where st.user_id = a.id
        ), 0),
        'completedActivities', coalesce((
          select jsonb_agg(jsonb_build_object('gameId', ac.game_id, 'contentId', ac.content_id))
          from actividad_completada ac
          where ac.user_id = a.id
        ), '[]'::jsonb),
        'passedActivities', coalesce((
          select jsonb_agg(jsonb_build_object('gameId', aa.game_id, 'contentId', aa.content_id))
          from actividad_aprobada aa
          where aa.user_id = a.id
        ), '[]'::jsonb),
        'periodSessions', coalesce((
          select jsonb_agg(jsonb_build_object(
            'unitId', sp.unit_id,
            'total', sp.total,
            'completed', sp.completadas,
            'abandoned', sp.abandonadas,
            'inProgress', sp.en_curso
          ))
          from sesiones_periodo sp
          where sp.user_id = a.id
        ), '[]'::jsonb),
        'periodSkills', coalesce((
          select jsonb_agg(jsonb_build_object(
            'unitId', hp.unit_id,
            'code', hp.codigo,
            'attempts', hp.intentos,
            'correctAttempts', hp.correctos,
            'firstAttempts', hp.primeros_intentos,
            'firstCorrect', hp.primeros_correctos
          ))
          from habilidades_periodo hp
          where hp.user_id = a.id
        ), '[]'::jsonb)
      ) order by a.numero)
      from alumnos a
      left join sesiones_resumen sr on sr.user_id = a.id
      left join respuestas_resumen rr on rr.user_id = a.id
    ), '[]'::jsonb),
    'recentResponses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', er.id,
        'userId', er.numero,
        'studentName', 'Jugador ' || er.numero::text,
        'isTeacher', er.es_docente,
        'gameId', er.game_id,
        'unitId', er.unit_id,
        'itemId', er.item_id,
        'assessmentCode', er.assessment_code,
        'correct', er.is_correct,
        'attemptNumber', er.attempt_number,
        'answeredAt', er.answered_at,
        'incorrectAnswer', er.respuesta_incorrecta
      ) order by er.answered_at desc, er.id desc)
      from eventos_recientes er
    ), '[]'::jsonb)
  )
  into resultado;

  return resultado;
end;
$$;

revoke all on function public.leer_dashboard_docente(integer) from public, anon;
grant execute on function public.leer_dashboard_docente(integer) to authenticated;

-- Realtime is optional in local Supabase installations; the dashboard still
-- supports manual refresh if the publication is unavailable.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'game_responses'
    ) then
      alter publication supabase_realtime add table public.game_responses;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'game_sessions'
    ) then
      alter publication supabase_realtime add table public.game_sessions;
    end if;
  end if;
end;
$$;
