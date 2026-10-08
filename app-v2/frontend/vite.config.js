import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  // host: true → escucha en 0.0.0.0, necesario para acceder desde Windows
  // cuando el servidor corre dentro de un contenedor Docker
  server: { port: 5173, host: true },
});
