-- =====================================================================
-- 001_profiles.sql — Tabla de perfiles + rol (BD-01 / CU-04)
-- PROPUESTA: Andrés revisa y aprueba antes de ejecutar.
-- Dónde se ejecuta: Supabase → SQL Editor → pegar todo → Run.
-- Se puede ejecutar más de una vez sin romper nada.
-- =====================================================================

-- 1) La tabla. El id es el MISMO uuid que crea Supabase Auth.
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  alias_publico text,                         -- lo que verá el dashboard (anonimato)
  rol           text not null default 'alumno'
                check (rol in ('alumno', 'docente')),
  created_at    timestamptz not null default now()
);

comment on table  public.profiles     is 'Un perfil por usuario de Supabase Auth.';
comment on column public.profiles.rol is 'Solo se cambia por SQL. Nunca desde la app.';

-- 2) RLS: sin políticas, nadie lee nada. Luego abrimos solo lo justo.
alter table public.profiles enable row level security;

drop policy if exists "perfil: leer el propio" on public.profiles;
create policy "perfil: leer el propio"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "perfil: editar el propio" on public.profiles;
create policy "perfil: editar el propio"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 3) Permisos por columna: el usuario puede cambiar su nombre y alias,
--    pero NO su rol. (RLS dice QUÉ filas; GRANT dice QUÉ columnas.)
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, alias_publico) on public.profiles to authenticated;

-- 4) Trigger: cuando alguien entra con Google por primera vez,
--    se crea su perfil automáticamente con rol 'alumno'.
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name',
             new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.crear_perfil_nuevo_usuario() from public, anon, authenticated;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- 5) Usuarios que ya existían antes de este script (si alguien probó el login antes).
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name')
from auth.users u
on conflict (id) do nothing;

-- =====================================================================
-- PARA HACER DOCENTE A ALGUIEN (ejecutar aparte, a mano, en el SQL Editor):
--   update public.profiles set rol = 'docente'
--   where id = (select id from auth.users where email = 'correo@ejemplo.cl');
-- =====================================================================
