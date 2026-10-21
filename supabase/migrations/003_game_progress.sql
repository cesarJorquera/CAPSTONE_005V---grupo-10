-- Shared progress model: one session per activity and one row per answered
-- item/attempt. Static game content remains in the frontend for now.

create table if not exists public.games (
  id smallint primary key,
  code text not null unique,
  name text not null,
  unit_id smallint not null check (unit_id > 0)
);

insert into public.games (id, code, name, unit_id)
values
  (1, 'keyword_identification', 'Identificacion de conceptos clave', 1),
  (2, 'word_classification', 'Clasificacion de palabras', 1),
  (3, 'reading_comprehension', 'Comprension lectora', 2),
  (4, 'reading_foundations_trivia', 'Trivia de fundamentos', 1)
on conflict (id) do update
set code = excluded.code,
    name = excluded.name,
    unit_id = excluded.unit_id;

alter table public.game_sessions
  add column if not exists status text not null default 'completed',
  add column if not exists started_at timestamptz not null default now(),
  add column if not exists ended_at timestamptz,
  add column if not exists answered_count integer not null default 0,
  alter column status set default 'in_progress',
  alter column correct_answers set default 0,
  alter column score set default 0;

alter table public.game_sessions
  alter column completed_at drop default,
  alter column completed_at drop not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'game_sessions_status_check'
      and conrelid = 'public.game_sessions'::regclass
  ) then
    alter table public.game_sessions
      add constraint game_sessions_status_check
      check (status in ('in_progress', 'completed', 'abandoned'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'game_sessions_game_id_fkey'
      and conrelid = 'public.game_sessions'::regclass
  ) then
    alter table public.game_sessions
      add constraint game_sessions_game_id_fkey
      foreign key (game_id) references public.games (id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'game_sessions_answered_count_check'
      and conrelid = 'public.game_sessions'::regclass
  ) then
    alter table public.game_sessions
      add constraint game_sessions_answered_count_check
      check (answered_count >= 0 and answered_count <= total_questions);
  end if;
end;
$$;

create table if not exists public.game_responses (
  id bigint generated always as identity primary key,
  session_id bigint not null
    references public.game_sessions (id) on delete cascade,
  item_id text not null,
  attempt_number integer not null default 1 check (attempt_number > 0),
  assessment_type text not null
    check (assessment_type in ('basic_concept', 'reading_skill', 'text_type', 'other')),
  assessment_code text,
  answer jsonb not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (session_id, item_id, attempt_number)
);

create index if not exists game_responses_session_idx
  on public.game_responses (session_id, answered_at);

create index if not exists game_responses_assessment_idx
  on public.game_responses (assessment_type, assessment_code, answered_at);

create or replace function public.actualizar_resumen_sesion_juego()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  respuestas_respondidas integer;
  respuestas_correctas integer;
begin
  with ultima_respuesta_por_item as (
    select distinct on (r.item_id) r.is_correct
    from public.game_responses r
    where r.session_id = new.session_id
    order by r.item_id, r.attempt_number desc, r.answered_at desc, r.id desc
  )
  select
    count(*)::integer,
    count(*) filter (where is_correct)::integer
  into respuestas_respondidas, respuestas_correctas
  from ultima_respuesta_por_item;

  update public.game_sessions s
  set answered_count = respuestas_respondidas,
      correct_answers = respuestas_correctas,
      score = case
        when s.total_questions > 0
          then round((respuestas_correctas::numeric / s.total_questions) * 100)::smallint
        else 0
      end
  where s.id = new.session_id;

  return new;
end;
$$;

revoke all on function public.actualizar_resumen_sesion_juego() from public, anon, authenticated;

drop trigger if exists al_guardar_respuesta_actualizar_resumen on public.game_responses;
create trigger al_guardar_respuesta_actualizar_resumen
  after insert on public.game_responses
  for each row execute function public.actualizar_resumen_sesion_juego();

alter table public.games enable row level security;
alter table public.game_responses enable row level security;

drop policy if exists "juegos: leer catalogo" on public.games;
create policy "juegos: leer catalogo"
  on public.games for select
  to authenticated
  using (true);

drop policy if exists "alumno: leer respuestas propias" on public.game_responses;
create policy "alumno: leer respuestas propias"
  on public.game_responses for select
  to authenticated
  using (
    exists (
      select 1
      from public.game_sessions s
      where s.id = session_id
        and s.user_id = (select auth.uid())
    )
  );

drop policy if exists "alumno: guardar respuestas en partida activa" on public.game_responses;
create policy "alumno: guardar respuestas en partida activa"
  on public.game_responses for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.game_sessions s
      where s.id = session_id
        and s.user_id = (select auth.uid())
        and s.status = 'in_progress'
    )
  );

drop policy if exists "alumno: cerrar partida propia" on public.game_sessions;
create policy "alumno: cerrar partida propia"
  on public.game_sessions for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and status = 'in_progress'
  )
  with check (
    (select auth.uid()) = user_id
    and status in ('completed', 'abandoned')
  );

revoke all on public.games from anon, authenticated;
grant select on public.games to authenticated;

revoke insert on public.game_sessions from anon, authenticated;
grant insert (user_id, game_id, content_id, total_questions, details)
  on public.game_sessions to authenticated;

revoke all on public.game_responses from anon, authenticated;
grant select, insert on public.game_responses to authenticated;
grant usage, select on sequence public.game_responses_id_seq to authenticated;

revoke update on public.game_sessions from anon, authenticated;
grant update (
  status,
  ended_at,
  completed_at
) on public.game_sessions to authenticated;
