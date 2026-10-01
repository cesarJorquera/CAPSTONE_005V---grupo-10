-- Migrations will appear here

create table instituciones (
  id bigint primary key generated always as identity,
  nombre text not null,
  tipo text not null default 'universidad' check (tipo in ('universidad', 'instituto', 'otro')),
  created_at timestamp default now()
);

create table carreras (
  id bigint primary key generated always as identity,
  institucion_id bigint not null references instituciones (id),
  nombre text not null,
  created_at timestamp default now()
);

create table cursos (
  id bigint primary key generated always as identity,
  carrera_id bigint not null references carreras (id),
  nombre text not null,
  periodo text not null,
  created_at timestamp default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text not null,
  alias_publico text unique not null,
  avatar_url text,
  created_at timestamp default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name, alias_publico)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'username', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'alias_publico', ''),
      'leo-' || replace(new.id::text, '-', '')
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

create table inscripciones (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users (id) on delete cascade,
  curso_id bigint not null references cursos (id) on delete cascade,
  rol_en_curso text not null check (rol_en_curso in ('estudiante', 'docente')),
  fecha_inscripcion timestamp default now(),
  unique (user_id, curso_id, rol_en_curso)
);

create table games (
  id bigint primary key generated always as identity,
  codigo text unique not null,
  nombre text not null,
  descripcion text,
  is_active boolean default true
);

create table texts (
  id bigint primary key generated always as identity,
  game_id bigint not null references games (id),
  text_key text unique not null,
  title text not null,
  content text not null,
  difficulty text,
  questions jsonb,
  is_active boolean default true,
  created_at timestamp default now()
);

create table game_sessions (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users (id) on delete cascade,
  game_id bigint not null references games (id),
  text_id bigint not null references texts (id),
  tipo_intento text not null default 'practica' check (
    tipo_intento in (
      'practica',
      'diagnostico_inicial',
      'diagnostico_final'
    )
  ),
  started_at timestamp default now(),
  ended_at timestamp,
  completed boolean default false,
  score int,
  answers jsonb
);

create index idx_sessions_user on game_sessions using btree (user_id);

create index idx_sessions_tipo on game_sessions using btree (tipo_intento);

create index idx_sessions_game_completed on game_sessions using btree (game_id, completed);

create view user_progress with (security_invoker = true) as
select
  user_id,
  game_id,
  text_id,
  max(score) as mejor_score,
  count(*) as intentos,
  max(ended_at) as ultimo_intento
from
  game_sessions
where
  completed = true
  and tipo_intento = 'practica'
group by
  user_id,
  game_id,
  text_id;

create table achievements (
  id bigint primary key generated always as identity,
  achievement_key text unique not null,
  name text not null,
  description text,
  icon text,
  criteria jsonb
);

create table user_achievements (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id bigint not null references achievements (id),
  unlocked_at timestamp default now(),
  unique (user_id, achievement_id)
);

create table daily_streak (
  id bigint primary key generated always as identity,
  user_id uuid unique not null references auth.users (id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_activity_date date
);

create table ai_simplificaciones (
  id bigint primary key generated always as identity,
  text_id bigint not null references texts (id),
  texto_simplificado text not null,
  modelo_ia text not null default 'gemini-1.5-flash',
  created_at timestamp default now(),
  unique (text_id, modelo_ia)
);

create index idx_game_sessions_score on game_sessions using btree (score);

create index idx_game_sessions_started_at on game_sessions using btree (started_at);

alter table public.instituciones enable row level security;
alter table public.carreras enable row level security;
alter table public.cursos enable row level security;
alter table public.profiles enable row level security;
alter table public.inscripciones enable row level security;
alter table public.games enable row level security;
alter table public.texts enable row level security;
alter table public.game_sessions enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;
alter table public.daily_streak enable row level security;
alter table public.ai_simplificaciones enable row level security;

create policy "Catalogs are readable"
  on public.instituciones for select to anon, authenticated using (true);
create policy "Careers are readable"
  on public.carreras for select to anon, authenticated using (true);
create policy "Courses are readable"
  on public.cursos for select to anon, authenticated using (true);
create policy "Active games are readable"
  on public.games for select to anon, authenticated using (is_active = true);
create policy "Active texts are readable"
  on public.texts for select to anon, authenticated using (is_active = true);
create policy "Achievements are readable"
  on public.achievements for select to anon, authenticated using (true);

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can read their own enrollments"
  on public.inscripciones for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can enroll themselves as students"
  on public.inscripciones for insert to authenticated
  with check ((select auth.uid()) = user_id and rol_en_curso = 'estudiante');
create policy "Users can update their own student enrollments"
  on public.inscripciones for update to authenticated
  using ((select auth.uid()) = user_id and rol_en_curso = 'estudiante')
  with check ((select auth.uid()) = user_id and rol_en_curso = 'estudiante');
create policy "Users can delete their own enrollments"
  on public.inscripciones for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own game sessions"
  on public.game_sessions for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can create their own game sessions"
  on public.game_sessions for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update their own game sessions"
  on public.game_sessions for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete their own game sessions"
  on public.game_sessions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own achievements"
  on public.user_achievements for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can read their own streak"
  on public.daily_streak for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Authenticated users can read text simplifications"
  on public.ai_simplificaciones for select to authenticated using (true);

revoke all on table
  public.instituciones,
  public.carreras,
  public.cursos,
  public.profiles,
  public.inscripciones,
  public.games,
  public.texts,
  public.game_sessions,
  public.achievements,
  public.user_achievements,
  public.daily_streak,
  public.ai_simplificaciones,
  public.user_progress
from anon, authenticated;

grant select on table
  public.instituciones,
  public.carreras,
  public.cursos,
  public.games,
  public.texts,
  public.achievements
to anon, authenticated;

grant select on table
  public.profiles,
  public.user_achievements,
  public.daily_streak,
  public.ai_simplificaciones,
  public.user_progress
to authenticated;
grant update (username, full_name, alias_publico, avatar_url)
  on table public.profiles to authenticated;
grant select, insert, update, delete on table
  public.inscripciones,
  public.game_sessions
to authenticated;

grant all on table
  public.instituciones,
  public.carreras,
  public.cursos,
  public.profiles,
  public.inscripciones,
  public.games,
  public.texts,
  public.game_sessions,
  public.achievements,
  public.user_achievements,
  public.daily_streak,
  public.ai_simplificaciones
to service_role;
