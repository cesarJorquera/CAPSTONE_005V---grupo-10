-- 1. Crear tabla perfiles
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nombre TEXT,
    rol TEXT DEFAULT 'estudiante'::text NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas RLS (Corregido con WITH CHECK)
DROP POLICY IF EXISTS "Ver propio perfil" ON public.perfiles;
CREATE POLICY "Ver propio perfil" ON public.perfiles 
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Actualizar propio perfil" ON public.perfiles;
CREATE POLICY "Actualizar propio perfil" ON public.perfiles 
FOR UPDATE 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 4. Protección estricta de columnas (Defensa en profundidad)
-- El frontend no edita rol ni id. Si más adelante se edita "nombre",
-- se hará por endpoint backend controlado, no exponiendo UPDATE sensible.
REVOKE UPDATE (id, rol) ON public.perfiles FROM authenticated;

-- 5. Trigger para nuevos usuarios (Seguro contra secuestro de search_path)
CREATE OR REPLACE FUNCTION public.crear_perfil_nuevo_usuario()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, rol)
  VALUES (new.id, new.raw_user_meta_data->>'nombre', 'estudiante');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.crear_perfil_nuevo_usuario();

-- 6. Backfill: Crear perfil para usuarios que ya existían
INSERT INTO public.perfiles (id, rol)
SELECT u.id, 'estudiante'
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.perfiles p WHERE p.id = u.id
);
-- El backend consulta perfiles con service_role; RLS no aplica, pero el GRANT sí.
GRANT SELECT ON TABLE public.perfiles TO service_role;