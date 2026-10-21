-- Completed activity summaries. Skill-level answers will be added after the
-- pedagogical model is agreed with the teacher.
create table if not exists public.game_sessions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  game_id smallint not null check (game_id > 0),
  content_id text not null,
  correct_answers integer not null check (correct_answers >= 0),
  total_questions integer not null check (total_questions > 0),
  score smallint not null check (score between 0 and 100),
  details jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  constraint game_sessions_correct_answers_lte_total
    check (correct_answers <= total_questions)
);

create index if not exists game_sessions_user_completed_idx
  on public.game_sessions (user_id, completed_at desc);

create index if not exists game_sessions_game_completed_idx
  on public.game_sessions (game_id, completed_at desc);

alter table public.game_sessions enable row level security;

drop policy if exists "alumno: guardar su propio progreso" on public.game_sessions;
create policy "alumno: guardar su propio progreso"
  on public.game_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "alumno: leer su propio progreso" on public.game_sessions;
create policy "alumno: leer su propio progreso"
  on public.game_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.game_sessions from anon, authenticated;
grant select, insert on public.game_sessions to authenticated;
grant usage, select on sequence public.game_sessions_id_seq to authenticated;
