import { Router } from "express";
import { requireAuth } from "../../shared/requireAuth.js";
import { supabase } from "../../shared/supabase.js";

export const authRouter = Router();

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("id, nombre, rol")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("[Auth] Error DB:", error.message);
      return res.status(500).json({ error: "Error al recuperar perfil" });
    }

    res.json({
      user: {
        id: userId,
        nombre: perfil?.nombre ?? null,
        rol: perfil?.rol ?? "estudiante",
      },
    });
  } catch (error) {
    console.error("[Auth] Excepción /me:", error);
    res.status(500).json({ error: "Error interno" });
  }
});
