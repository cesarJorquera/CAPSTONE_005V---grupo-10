-- ============================================
-- FASE 1: Juegos, textos, sesiones y caché IA
-- Leo Perfecto - Sprint 2
-- Requiere: public.perfiles ya existente (Sprint 1)
-- ============================================

-- 1) JUEGOS (catálogo de juegos disponibles)
CREATE TABLE IF NOT EXISTS public.juegos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,          -- ej: 'keywords', 'dragdrop', 'comprension'
    nombre TEXT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.juegos ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios logueados pueden VER el catálogo
DROP POLICY IF EXISTS "Ver juegos activos" ON public.juegos;
CREATE POLICY "Ver juegos activos" ON public.juegos
    FOR SELECT TO authenticated
    USING (true);

-- (Sin política de INSERT/UPDATE/DELETE para authenticated:
--  solo el backend con service_role administra el catálogo)

-- 2) TEXTOS (contenido de cada juego: texto + preguntas)
CREATE TABLE IF NOT EXISTS public.textos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    juego_id INT REFERENCES public.juegos(id) ON DELETE CASCADE NOT NULL,
    text_key TEXT UNIQUE NOT NULL,        -- ej: 'text1', 'drag3', 'comp12'
    titulo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    dificultad TEXT DEFAULT 'basica'::text NOT NULL,
    preguntas JSONB,                      -- array de preguntas/respuestas del juego
    activo BOOLEAN DEFAULT true NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.textos ENABLE ROW LEVEL SECURITY;

-- Todos los logueados pueden LEER textos (el contenido se sirve vía backend igual)
DROP POLICY IF EXISTS "Ver textos" ON public.textos;
CREATE POLICY "Ver textos" ON public.textos
    FOR SELECT TO authenticated
    USING (true);

-- 3) SESIONES_JUEGO (cada partida de un estudiante)
CREATE TABLE IF NOT EXISTS public.sesiones_juego (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES public.perfiles(id) ON DELETE CASCADE NOT NULL,
    juego_id INT REFERENCES public.juegos(id) ON DELETE CASCADE NOT NULL,
    texto_id INT REFERENCES public.textos(id) ON DELETE SET NULL,
    tipo_intento TEXT DEFAULT 'practica'::text NOT NULL,  -- 'practica' | 'desafio'
    iniciado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    terminado_en TIMESTAMP WITH TIME ZONE,
    completado BOOLEAN DEFAULT false NOT NULL,
    puntaje INT DEFAULT 0 NOT NULL,
    respuestas JSONB                      -- detalle de lo que respondió (para reportes)
);

ALTER TABLE public.sesiones_juego ENABLE ROW LEVEL SECURITY;

-- Un estudiante solo VE sus propias sesiones
DROP POLICY IF EXISTS "Ver propias sesiones" ON public.sesiones_juego;
CREATE POLICY "Ver propias sesiones" ON public.sesiones_juego
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Un estudiante solo CREA sesiones a su nombre (WITH CHECK: no puede mentir el user_id)
DROP POLICY IF EXISTS "Crear propias sesiones" ON public.sesiones_juego;
CREATE POLICY "Crear propias sesiones" ON public.sesiones_juego
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Un estudiante solo ACTUALIZA sus propias sesiones (para cerrar la partida)
DROP POLICY IF EXISTS "Actualizar propias sesiones" ON public.sesiones_juego;
CREATE POLICY "Actualizar propias sesiones" ON public.sesiones_juego
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Nadie puede cambiar el dueño de una sesión (anti-trampa, igual que REVOKE en perfiles)
REVOKE UPDATE (user_id) ON public.sesiones_juego FROM authenticated;

-- 4) AI_SIMPLIFICACIONES (caché de textos simplificados por la IA)
CREATE TABLE IF NOT EXISTS public.ai_simplificaciones (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto_id INT REFERENCES public.textos(id) ON DELETE CASCADE NOT NULL,
    texto_simplificado TEXT NOT NULL,
    modelo_ia TEXT NOT NULL,              -- ej: 'gemini-2.5-flash'
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_simplificaciones ENABLE ROW LEVEL SECURITY;

-- Todos los logueados pueden LEER el caché
DROP POLICY IF EXISTS "Ver simplificaciones" ON public.ai_simplificaciones;
CREATE POLICY "Ver simplificaciones" ON public.ai_simplificaciones
    FOR SELECT TO authenticated
    USING (true);

-- (Sin política de escritura para authenticated:
--  solo el backend guarda en el caché. Nadie puede envenenarlo desde el navegador)

-- 5) ÍNDICES (para que las consultas frecuentes sean rápidas)
CREATE INDEX IF NOT EXISTS idx_textos_juego ON public.textos (juego_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_user ON public.sesiones_juego (user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_texto ON public.sesiones_juego (texto_id);
CREATE INDEX IF NOT EXISTS idx_simplificaciones_texto ON public.ai_simplificaciones (texto_id);

-- 6) GRANTS (service_role bypasea RLS, pero igual necesita permiso de tabla:
--  esta fue la lección del error "permission denied for table perfiles")
GRANT SELECT, INSERT, UPDATE ON TABLE public.juegos TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.textos TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.sesiones_juego TO service_role;
GRANT SELECT, INSERT ON TABLE public.ai_simplificaciones TO service_role;

-- Recargar caché de PostgREST para que la API vea las tablas nuevas
NOTIFY pgrst, 'reload schema';