-- Ruta de aprendizaje: una fila en games por cada unidad de la ruta.
-- Cada tarea de la unidad se guarda como una sesión con content_id = id de la tarea
-- (por ejemplo, 'u1-verbos'), y cada paso evaluable como una fila en game_responses.

insert into public.games (id, code, name, unit_id)
values
  (5, 'learning_path_words', 'Ruta de aprendizaje: Las palabras', 1)
on conflict (id) do update
set code = excluded.code,
    name = excluded.name,
    unit_id = excluded.unit_id;