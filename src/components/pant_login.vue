<template>
  <!-- CU-02: reemplaza a la pantalla "escribe tu nombre". Mobile-first. -->
  <div class="text-center">
    <div class="bg-white rounded-3xl shadow-xl p-6 sm:p-10 max-w-md mx-auto">
      <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="Leo, el libro feliz" class="h-28 mx-auto mb-2" />
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Leo Perfecto</h1>
      <p class="text-lg text-gray-600 mb-8">Aprende comprensión lectora jugando</p>

      <!-- Falta configurar Supabase: mensaje para el equipo, no para el alumno -->
      <div v-if="!configurado" class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-left text-sm text-yellow-800">
        <p class="font-semibold mb-1">⚠️ La app no está conectada a la base de datos.</p>
        <p>Faltan <code>VUE_APP_SUPABASE_URL</code> y <code>VUE_APP_SUPABASE_ANON_KEY</code> en <code>.env.local</code> (local) o en las variables de entorno de Netlify.</p>
      </div>

      <template v-else>
        <label class="flex items-start gap-3 text-left bg-blue-50 rounded-xl p-4 mb-6 cursor-pointer">
          <input
            v-model="acepta"
            type="checkbox"
            class="mt-1 h-6 w-6 flex-shrink-0"
            data-test="consentimiento"
          />
          <span class="text-base text-gray-700">
            Acepto que mis datos de juego se guarden con fines educativos.
          </span>
        </label>

        <button
          :disabled="!acepta || cargando"
          class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-800 px-6 py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-test="entrar-google"
          @click="$emit('entrar-google')"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z" />
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8C3.9 20.6 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.8z" />
            <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.4 2.1 7l3.7 2.8c.9-2.6 3.3-4.4 6.2-4.4z" />
          </svg>
          <span>{{ cargando ? 'Abriendo Google…' : 'Entrar con Google' }}</span>
        </button>

        <p v-if="!acepta" class="text-sm text-gray-500 mt-3">Marca la casilla para poder entrar.</p>
        <p v-if="error" class="text-sm text-red-600 mt-4" role="alert" data-test="error-login">{{ error }}</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PantLogin',
  props: {
    configurado: { type: Boolean, default: true },
    cargando: { type: Boolean, default: false },
    error: { type: String, default: '' }
  },
  emits: ['entrar-google'],
  data() {
    return { acepta: false }
  }
}
</script>
