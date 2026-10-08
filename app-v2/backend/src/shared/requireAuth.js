import { supabase } from "./supabase.js";

// Middleware común para rutas que exigen usuario autenticado.
// Vive en shared/ porque lo usan varios módulos sin cruzar imports entre módulos.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ")
      ? header.slice("Bearer ".length).trim()
      : "";

    if (!token) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    req.user = { id: data.user.id };
    next();
  } catch {
    res.status(500).json({ error: "No se pudo validar la sesión" });
  }
}
