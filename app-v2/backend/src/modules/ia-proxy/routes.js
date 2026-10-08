import { Router } from "express";
import { z } from "zod";
import { sanitizar } from "./dlp.js";
import { claveCache, obtener, guardar } from "./cache.js";
import { pedirPista } from "./gemini.js";
import { requireAuth } from "../../shared/requireAuth.js";

export const iaRouter = Router();

const PistaSchema = z.object({
  nivel: z.enum(["inicial", "basico", "intermedio", "avanzado"]),
  fragmento: z.string().min(1).max(5000),
  consulta: z.string().min(1).max(500),
});

// POST /api/ia/pista — flujo: validar → sanitizar (DLP) → caché → proveedor → responder.
// Si el proveedor falla o supera el timeout: 503 con modoDegradado (P-3),
// la plataforma sigue funcionando sin Leo.
iaRouter.post("/pista", requireAuth, async (req, res) => {
  const parsed = PistaSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Solicitud inválida" });
  }

  const fragmento = sanitizar(parsed.data.fragmento).texto;
  const consulta = sanitizar(parsed.data.consulta).texto;
  const clave = claveCache({ nivel: parsed.data.nivel, fragmento, consulta });

  const cacheada = obtener(clave);
  if (cacheada) return res.json({ pista: cacheada, cache: true });

  try {
    const pista = await pedirPista({
      nivel: parsed.data.nivel,
      fragmento,
      consulta,
    });
    guardar(clave, pista);
    return res.json({ pista, cache: false });
  } catch (err) {
    console.error("ia-proxy: proveedor no disponible:", err.message);
    return res.status(503).json({
      error:
        "Leo no está disponible en este momento. Puedes seguir ejercitando sin la pista.",
      modoDegradado: true,
    });
  }
});
