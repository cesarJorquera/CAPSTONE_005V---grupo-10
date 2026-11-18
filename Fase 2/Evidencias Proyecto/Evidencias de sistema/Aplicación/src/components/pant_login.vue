<template>
  <!-- UI-02: login. Aula de fondo, Leo con gafas y la tarjeta de acceso por encima. Mobile-first. -->
  <div class="lg-raiz fixed inset-0 overflow-y-auto text-left font-cuerpo antialiased">
    <div class="lg-fondo" aria-hidden="true">
      <svg class="lg-aula lg-aula-ancha" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><defs><pattern id="va-pt" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="#14233b"/></pattern></defs><rect width="1600" height="900" fill="#f5f1ea"/>
  <rect y="730" width="1600" height="170" fill="#ece4d6"/><path d="M0 730 H1600" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="140" y="686" width="260" height="44" rx="5" fill="#d9a441" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M156 694 v28 M164 694 v28" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/><rect x="150" y="646" width="230" height="40" rx="5" fill="#ffffff" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M166 654 v24 M174 654 v24" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/><rect x="140" y="600" width="272" height="46" rx="5" fill="#8fae9b" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M156 608 v30 M164 608 v30" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/><rect x="150" y="562" width="222" height="38" rx="5" fill="#c9775b" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M166 570 v22 M174 570 v22" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/><rect x="140" y="520" width="250" height="42" rx="5" fill="#ffffff" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M156 528 v26 M164 528 v26" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".55"/>
  <g stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M170 150 q18 -26 36 0 t36 0 t36 0 t36 0"/><circle cx="470" cy="190" r="9"/><circle cx="110" cy="300" r="6"/></g>
  <g transform="translate(160 320)"><rect width="240" height="120" rx="16" fill="#fff" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 40 h150 M24 62 h190 M24 84 h120" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M60 120 l-10 28 l40 -28" fill="#fff" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>
  <rect x="470" y="470" width="130" height="260" fill="#e7b8a4" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="470" y="470" width="130" height="260" fill="url(#va-pt)" opacity=".5"/>
  <rect x="1400" y="500" width="110" height="230" fill="#ecd08e" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1400" y="500" width="110" height="230" fill="url(#va-pt)" opacity=".5"/>
  <circle cx="1280" cy="250" r="120" fill="#ebe3d3"/><circle cx="1280" cy="250" r="120" fill="none" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <g stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M1100 150 q18 -26 36 0 t36 0 t36 0"/><circle cx="1500" cy="330" r="9"/><circle cx="1130" cy="420" r="6"/></g></svg>
      <svg class="lg-aula lg-aula-alta" viewBox="0 0 600 1000" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><defs><pattern id="vb-pt" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.4" fill="#14233b"/></pattern></defs><rect width="600" height="1000" fill="#f5f1ea"/>
    <circle cx="300" cy="235" r="175" fill="#ebe3d3"/>
    <g stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M44 130 q18 -26 36 0 t36 0 t36 0 t36 0"/><path d="M420 90 q18 -26 36 0 t36 0 t36 0"/><circle cx="500" cy="300" r="9"/><circle cx="84" cy="300" r="6"/><circle cx="470" cy="190" r="5"/></g>
    <rect x="46" y="190" width="56" height="86" fill="#e7b8a4" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="46" y="190" width="56" height="86" fill="url(#vb-pt)" opacity=".5"/>
    <rect x="500" y="205" width="56" height="70" fill="#ecd08e" stroke="#14233b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="500" y="205" width="56" height="70" fill="url(#vb-pt)" opacity=".5"/>
    <rect y="560" width="600" height="440" fill="#f5f1ea"/></svg>
    </div>

    <div class="lg-contenido">
      <!-- Leo: arriba en celular, a la derecha de la tarjeta en escritorio -->
      <div class="lg-leo-col" aria-hidden="true">
        
<svg class="lg-leo" viewBox="140 90 860 945" aria-hidden="true" focusable="false">
  <ellipse cx="505" cy="1016" rx="300" ry="16" fill="#8a6a3a" opacity=".2"/>
  <g class="lg-flota">
    <!-- piernas cortas (detrás del cuerpo) -->
    <path d="M365 862 V952" stroke="#3584dc" stroke-width="58" stroke-linecap="round"/>
    <path d="M650 862 V952" stroke="#3584dc" stroke-width="58" stroke-linecap="round"/>
    <path d="M300 984 Q300 958 340 958 H392 Q430 958 430 986 Q430 1008 400 1008 H330 Q300 1008 300 984Z" fill="#404451"/>
    <path d="M585 986 Q585 958 625 958 H677 Q715 958 715 984 Q715 1008 685 1008 H615 Q585 1008 585 986Z" fill="#404451"/>
    <!-- brazo izquierdo (relajado) -->
    <path d="M250 650 Q176 690 176 746" stroke="#3584dc" stroke-width="42" stroke-linecap="round" fill="none"/>
    <!-- brazo derecho (levantado) -->
    <g class="lg-brazo">
      <path d="M770 650 Q872 656 890 566" stroke="#3584dc" stroke-width="44" stroke-linecap="round" fill="none"/>
    </g>
    <!-- cuerpo -->
    <path d="M273 320 H770 Q800 320 800 350 V870 Q800 898 772 898 H300 Q213 898 213 830 V382 Q213 320 273 320 Z" fill="#3584dc"/>
    <path d="M283 348 H770 V772 H300 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#7fc4fd"/>
    <path d="M283 348 H306 V772 H292 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#559de6"/>
    <path d="M244 772 H780" stroke="#3584dc" stroke-width="16" stroke-linecap="round"/>
    <rect x="246" y="800" width="504" height="68" rx="34" fill="#86c9fd"/>
    <path d="M312 800 H418 V920 L365 888 L312 920 Z" fill="#f96a5f"/>
    <!-- birrete -->
    <path d="M323 262 L323 326 Q515 432 702 326 L702 262 Z" fill="#404451"/>
    <path d="M323 300 Q515 392 702 300 L702 326 Q515 432 323 326 Z" fill="#363a47"/>
    <polygon points="222,214 515,107 806,206 515,338" fill="#404451" stroke="#404451" stroke-width="16" stroke-linejoin="round"/>
    <g class="lg-borla">
      <path d="M772 232 Q792 300 784 346" stroke="#404451" stroke-width="15" fill="none" stroke-linecap="round"/>
      <path d="M764 346 Q792 334 816 346 L824 462 Q790 474 754 466 Z" fill="#404451"/>
      <circle cx="790" cy="352" r="17" fill="#404451"/>
    </g>
    <!-- mejillas -->
    <ellipse cx="352" cy="622" rx="30" ry="17" fill="#f96a5f" opacity=".3"/>
    <ellipse cx="684" cy="622" rx="30" ry="17" fill="#f96a5f" opacity=".3"/>
    <!-- ojo izquierdo: guiño -->
    <path d="M384 556 Q417 520 450 556" stroke="#404451" stroke-width="15" stroke-linecap="round" fill="none"/>
    <!-- ojo derecho -->
    <ellipse class="lg-ojo" cx="612" cy="545" rx="26" ry="29" fill="#404451"/>
    <circle cx="621" cy="533" r="7" fill="#fff" opacity=".9"/>
    <!-- gafas de lectura -->
    <circle cx="417" cy="545" r="52" fill="#fff" fill-opacity=".22" stroke="#2b2f3a" stroke-width="11"/>
    <circle cx="612" cy="545" r="52" fill="#fff" fill-opacity=".22" stroke="#2b2f3a" stroke-width="11"/>
    <path d="M468 536 Q514 516 560 536" stroke="#2b2f3a" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M366 536 L330 524 M663 536 L699 524" stroke="#2b2f3a" stroke-width="10" stroke-linecap="round"/>
    <path d="M382 520 Q392 506 410 502 M577 520 Q587 506 605 502" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none" opacity=".85"/>
    <!-- sonrisa -->
    <path d="M458 616 Q518 674 578 616" stroke="#404451" stroke-width="16" fill="none" stroke-linecap="round"/>
    <!-- mano izquierda -->
    <circle cx="176" cy="764" r="34" fill="#f4f9ff" stroke="#bcd2ea" stroke-width="4"/>
    <!-- mano derecha: pulgar arriba -->
    <g class="lg-brazo">
      <g class="lg-pulgar">
        <rect x="866" y="414" width="38" height="96" rx="19" fill="#f4f9ff" stroke="#bcd2ea" stroke-width="4"/>
        <ellipse cx="896" cy="520" rx="52" ry="46" fill="#f4f9ff" stroke="#bcd2ea" stroke-width="4"/>
        <path d="M866 508 H930 M868 530 H928" stroke="#cfdcec" stroke-width="5" stroke-linecap="round"/>
      </g>
      <g class="lg-chispas" stroke="#ffd23f" stroke-width="9" stroke-linecap="round">
        <path d="M946 424 l24 -18"/><path d="M958 462 l30 -4"/><path d="M918 396 l8 -28"/>
      </g>
    </g>
  </g>
</svg>
      </div>

      <section class="lg-tarjeta" aria-labelledby="lg-titulo">
        <button
          type="button"
          class="lg-volver inline-flex items-center gap-1 text-sm font-semibold text-leo-suave hover:text-leo-tinta py-3 px-3 -ml-3 -mt-3"
          data-test="volver-landing"
          @click="$emit('volver')"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          Volver
        </button>

        <p class="mt-2 font-display font-semibold text-sm tracking-wide text-leo-azul-osc uppercase">Leo Perfecto</p>
        <h1 id="lg-titulo" class="mt-1 font-display font-semibold text-3xl sm:text-4xl leading-tight tracking-tight text-leo-tinta">Inicia sesión</h1>
        <p class="mt-2 text-base sm:text-lg leading-relaxed text-leo-texto">Accede con tu cuenta de Google para continuar con tu práctica de lectura.</p>

        <!-- Falta configurar Supabase: mensaje para el equipo, no para el alumno -->
        <div v-if="!configurado" class="mt-6 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
          <p class="font-semibold mb-1">La aplicación no está conectada a la base de datos.</p>
          <p>Faltan <code>VUE_APP_SUPABASE_URL</code> y <code>VUE_APP_SUPABASE_ANON_KEY</code> en <code>.env.local</code> (local) o en las variables de entorno de Netlify.</p>
        </div>

        <template v-else>
          <label class="lg-consent mt-6 flex items-start gap-3 rounded-2xl p-4 cursor-pointer">
            <input
              v-model="acepta"
              type="checkbox"
              class="mt-0.5 h-6 w-6 flex-none cursor-pointer"
              data-test="consentimiento"
            />
            <span class="text-sm sm:text-base leading-snug text-leo-texto">
              Autorizo que Leo Perfecto use el nombre de mi cuenta de Google y mi progreso de lectura, exclusivamente con fines educativos. La aplicación no accede a mi contraseña.
            </span>
          </label>

          <button
            type="button"
            :disabled="!acepta || cargando"
            class="lg-btn-google mt-4 w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-display font-semibold text-base sm:text-lg text-leo-tinta"
            data-test="entrar-google"
            @click="$emit('entrar-google')"
          >
            <svg class="h-6 w-6 flex-none" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8C3.9 20.6 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7H2.1C1.4 8.5 1 10.2 1 12s.4 3.5 1.1 5l3.7-2.8z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 3.9 3.4 2.1 7l3.7 2.8c.9-2.6 3.3-4.4 6.2-4.4z"/></svg>
            <span>{{ cargando ? 'Abriendo Google…' : 'Continuar con Google' }}</span>
          </button>

          <p v-if="!acepta" class="mt-2 text-sm text-leo-suave">Marca la casilla para poder continuar.</p>
          <p v-if="error" class="mt-3 text-sm font-semibold lg-error" role="alert" data-test="error-login">{{ error }}</p>

          <!-- Acceso con código de curso, para estudiantes sin cuenta -->
          <div class="mt-6 flex items-center gap-3 text-sm text-leo-suave" role="separator">
            <span class="flex-1 h-px bg-leo-linea"></span>
            <span>o con un código de curso</span>
            <span class="flex-1 h-px bg-leo-linea"></span>
          </div>

          <label for="codigo-sesion-login" class="mt-4 block text-sm font-semibold text-leo-tinta">
            Si tu curso te entregó un código de 6 dígitos, ingrésalo aquí
          </label>
          <div class="mt-2 flex gap-2">
            <input
              id="codigo-sesion-login"
              v-model="codigoClase"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              maxlength="6"
              placeholder="000000"
              class="lg-input flex-1 min-w-0 text-center font-mono font-bold tracking-widest text-lg px-3 py-3 rounded-2xl"
              @keydown.enter.prevent="intentarUnirse"
            />
            <button
              type="button"
              class="lg-btn-azul flex-none px-5 py-3 rounded-2xl text-white font-display font-semibold text-base"
              data-test="btn-unirse-codigo"
              @click="intentarUnirse"
            >
              Unirme
            </button>
          </div>
          <p v-if="errorCodigo" class="mt-2 text-sm font-semibold lg-error" role="alert" data-test="error-codigo-sala">
            {{ errorCodigo }}
          </p>
        </template>
      </section>
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
  emits: ['entrar-google', 'unirse-sala', 'volver'],
  data() {
    return {
      acepta: false,
      codigoClase: '',
      errorCodigo: ''
    }
  },
  methods: {
    intentarUnirse() {
      this.errorCodigo = ''
      const limpio = (this.codigoClase || '').trim()
      if (!/^\d{6}$/.test(limpio)) {
        this.errorCodigo = 'El código debe tener 6 números'
        return
      }
      this.$emit('unirse-sala', limpio)
    }
  }
}
</script>

<style scoped>
.lg-raiz { --tinta: #14233b; --azul: #2568c4; --azul-osc: #1b4f9e; color: #3a4960; background: #eaf3fb; }

/* Fondo: dos composiciones del aula (ancha y alta) que se alternan según el tamaño */
.lg-fondo { position: fixed; inset: 0; z-index: 0; }
.lg-aula { position: absolute; inset: 0; width: 100%; height: 100%; }
.lg-aula-ancha { display: none; }
@media (min-width: 1024px) { .lg-aula-ancha { display: block; } .lg-aula-alta { display: none; } }

/* Contenido: celular = Leo arriba y formulario debajo (sin tarjeta); escritorio = tarjeta al centro y Leo a la derecha */
.lg-contenido { position: relative; z-index: 1; min-height: 100%; display: flex; flex-direction: column; align-items: center; padding: 0.75rem 1.25rem 2rem; }
.lg-leo-col { height: min(36vh, 18rem); min-height: 12rem; display: flex; align-items: flex-end; justify-content: center; }
.lg-leo { height: 100%; width: auto; overflow: visible; }
.lg-tarjeta { width: 100%; max-width: 28rem; margin-top: 0.5rem; background: transparent; }

@media (min-width: 1024px) {
  .lg-contenido { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 28rem) minmax(0, 1fr); column-gap: 1.5rem; align-items: center; padding: 2rem; }
  .lg-leo-col { grid-column: 3; grid-row: 1; height: auto; min-height: 0; width: 100%; justify-self: stretch; align-self: center; align-items: center; }
  .lg-leo { height: auto; width: min(100%, 26rem); max-height: 74vh; }
  .lg-tarjeta { grid-column: 2; grid-row: 1; margin-top: 0; padding: 2rem; background: #fff; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(20, 35, 59, 0.28); }
}

/* Consentimiento y campos */
.lg-consent { background: rgba(255, 255, 255, 0.7); border: 1px solid #d9e4f1; }
@media (min-width: 1024px) { .lg-consent { background: #f5f9fe; } }
.lg-input { background: #fff; border: 2px solid #c9d6e6; color: #14233b; min-height: 3rem; }
.lg-input:focus { outline: none; border-color: var(--azul); box-shadow: 0 0 0 3px rgba(37, 104, 196, 0.25); }
.lg-error { color: #a3271d; }
.lg-volver { min-height: 2.75rem; }
.lg-volver:focus-visible { outline: 3px solid var(--tinta); outline-offset: 2px; border-radius: 0.75rem; }

/* Botones con relieve: bajan al presionarlos */
.lg-btn-google, .lg-btn-azul { transition: transform .1s ease, border-bottom-width .1s ease, filter .15s ease; cursor: pointer; min-height: 3.25rem; }
.lg-btn-google { background: #fff; border: 2px solid #c9d6e6; border-bottom-width: 4px; }
.lg-btn-azul { background: var(--azul); border-bottom: 4px solid var(--azul-osc); }
.lg-btn-google:hover:not(:disabled), .lg-btn-azul:hover { filter: brightness(1.04); }
.lg-btn-google:active:not(:disabled), .lg-btn-azul:active { transform: translateY(3px); border-bottom-width: 1px; }
.lg-btn-google:disabled { background: #f1f5fa; border-color: #d5dfec; color: #66758b; cursor: not-allowed; }
.lg-btn-google:focus-visible, .lg-btn-azul:focus-visible { outline: 3px solid var(--tinta); outline-offset: 3px; }

/* Leo: flota, parpadea con el ojo abierto, mueve el brazo y destella el pulgar */
.lg-flota { animation: lg-flota 5s ease-in-out infinite; transform-origin: 505px 1000px; }
.lg-ojo { transform-box: fill-box; transform-origin: center; animation: lg-parpadeo 6s ease-in-out infinite; }
.lg-borla { animation: lg-borla 4s ease-in-out infinite; transform-origin: 772px 238px; }
.lg-brazo { animation: lg-brazo 3.2s ease-in-out infinite; transform-origin: 770px 650px; }
.lg-pulgar { animation: lg-pulgar 3.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center bottom; }
.lg-chispas { animation: lg-chispas 3.2s ease-in-out infinite; }

@keyframes lg-flota { 0%, 100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-9px) rotate(1deg); } }
@keyframes lg-parpadeo { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(.08); } }
@keyframes lg-borla { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(6deg); } }
@keyframes lg-brazo { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(3deg); } }
@keyframes lg-pulgar { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
@keyframes lg-chispas { 0%, 100% { opacity: .15; } 50% { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .lg-flota, .lg-ojo, .lg-borla, .lg-brazo, .lg-pulgar, .lg-chispas, .lg-btn-google, .lg-btn-azul { animation: none !important; transition: none !important; }
  .lg-chispas { opacity: 1; }
}
</style>
