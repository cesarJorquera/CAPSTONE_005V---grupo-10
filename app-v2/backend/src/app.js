import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { healthRouter } from "./modules/health/routes.js";
import { iaRouter } from "./modules/ia-proxy/routes.js";
import { authRouter } from "./modules/auth/routes.js";

// Nuevo módulo de negocio = nueva carpeta en modules/ + una línea aquí.
// Nada de lógica de negocio en app.js: solo montaje y middlewares globales.
export function crearApp() {
  const app = express();

  app.use(cors({ origin: config.CORS_ORIGIN }));
  app.use(express.json({ limit: "100kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/ia", iaRouter);

  // Módulo auth: todo lo definido en authRouter queda bajo /api/auth.
  // Ejemplo: authRouter.get('/me') responde en GET /api/auth/me.
  // Si comentas esta línea, /api/auth/me devuelve 404.
  app.use("/api/auth", authRouter);

  // 404 y manejador de errores: respuestas JSON consistentes, sin filtrar stack traces
  app.use((req, res) =>
    res.status(404).json({ error: "Recurso no encontrado" }),
  );
  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  });

  return app;
}
