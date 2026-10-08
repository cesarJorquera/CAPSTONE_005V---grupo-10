import { Router } from 'express';

export const healthRouter = Router();

// GET /api/health — sirve para comprobar el deploy y medir el cold-start (ADR-011)
healthRouter.get('/', (req, res) => {
  res.json({ ok: true, servicio: 'leo-perfecto-api', ahora: new Date().toISOString() });
});
