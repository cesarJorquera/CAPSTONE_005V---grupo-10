import 'dotenv/config';
import { z } from 'zod';

// La configuración se valida al arrancar: si falta una variable o es inválida,
// el proceso muere aquí con un mensaje claro, no a mitad de una request.
const EnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().default('gemini-2.0-flash'),
  IA_CACHE_TTL_MS: z.coerce.number().int().positive().default(86_400_000),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Configuración inválida. Revisa tu archivo .env:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;
