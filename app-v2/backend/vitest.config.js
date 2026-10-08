import { defineConfig } from 'vitest/config';

// En tests se inyectan valores ficticios para que config.js (que valida y falla
// rápido en producción) pueda cargarse sin un .env real. Ningún test llama a
// servicios externos.
export default defineConfig({
  test: {
    env: {
      SUPABASE_URL: 'https://placeholder.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'valor-de-prueba',
      GEMINI_API_KEY: 'valor-de-prueba',
    },
  },
});
