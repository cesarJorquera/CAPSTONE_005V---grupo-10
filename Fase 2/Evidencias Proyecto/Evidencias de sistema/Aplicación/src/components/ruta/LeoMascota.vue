<template>
  <div class="flex items-end gap-3" :class="{ 'leo--quieto': reducirMovimiento }">
    <!-- UI-09: Leo nuevo (mismo dibujo del PNG, con brazos y piernas). Su animación se reproduce
         una vez al cambiar de estado. leoAnterior = true vuelve al dibujo anterior de abajo. -->
    <LeoPersonaje
      v-if="!leoAnterior"
      class="flex-shrink-0"
      :estado="estadoPersonaje"
      :tamano="tamano === 'md' ? 96 : 64"
      :quieto="reducirMovimiento"
      :etiqueta="'Leo está ' + textoEstado"
      animar-al-entrar
    />
    <div v-else :class="['leo', 'leo--' + estado, tamano === 'md' ? 'w-24' : 'w-16']" class="flex-shrink-0">
      <svg viewBox="0 0 130 140" role="img" :aria-label="'Leo está ' + textoEstado">
        <g class="leo-cuerpo">
          <!-- Libro -->
          <rect x="20" y="38" width="80" height="90" rx="10" fill="#3B82F6" />
          <rect x="20" y="38" width="12" height="90" rx="6" fill="#2563EB" />
          <rect x="34" y="120" width="62" height="5" rx="2" fill="#E0E7FF" />

          <!-- Birrete -->
          <rect x="40" y="28" width="40" height="14" rx="2" fill="#1E1B4B" />
          <polygon points="60,12 106,26 60,40 14,26" fill="#1E1B4B" />
          <polyline points="60,26 100,30 100,46" fill="none" stroke="#FBBF24" stroke-width="2" />
          <circle cx="100" cy="49" r="3" fill="#FBBF24" />

          <!-- Mejillas -->
          <circle cx="46" cy="92" r="4" fill="#F9A8D4" opacity="0.7" />
          <circle cx="86" cy="92" r="4" fill="#F9A8D4" opacity="0.7" />

          <!-- Ojos -->
          <g v-if="ojos === 'arcos'" fill="none" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round">
            <path d="M48 82 Q54 74 60 82" />
            <path d="M72 82 Q78 74 84 82" />
          </g>
          <g v-else-if="ojos === 'cerrados'" fill="none" stroke="#1E1B4B" stroke-width="3" stroke-linecap="round">
            <path d="M48 80 Q54 85 60 80" />
            <path d="M72 80 Q78 85 84 80" />
          </g>
          <g v-else fill="#1E1B4B">
            <circle cx="54" :cy="ojos === 'arriba' ? 77 : 80" r="5" />
            <circle cx="78" :cy="ojos === 'arriba' ? 77 : 80" :r="ojos === 'distintos' ? 3 : 5" />
          </g>

          <!-- Boca -->
          <path
            v-if="boca === 'abierta'"
            d="M54 96 Q66 114 78 96 Z"
            fill="#1E1B4B"
          />
          <circle v-else-if="boca === 'o'" cx="66" cy="101" r="2.5" fill="#1E1B4B" />
          <path
            v-else
            :d="trazoBoca"
            fill="none"
            stroke="#1E1B4B"
            stroke-width="3"
            stroke-linecap="round"
          />

          <!-- Mano (saludando y celebrando) -->
          <circle
            v-if="estado === 'saludando' || estado === 'celebrando'"
            class="leo-mano"
            cx="108" cy="86" r="7"
            fill="#3B82F6" stroke="#2563EB" stroke-width="2"
          />
        </g>

        <!-- Extras según el estado -->
        <g v-if="estado === 'pensando'" class="leo-puntos" fill="#6366F1">
          <circle cx="104" cy="14" r="2" />
          <circle cx="112" cy="8" r="3" />
          <circle cx="122" cy="3" r="3.5" />
        </g>
        <text v-if="estado === 'confundido'" x="106" y="22" font-size="22" font-weight="bold" fill="#6366F1">?</text>
        <text v-if="estado === 'durmiendo'" class="leo-zeta" x="104" y="24" font-size="16" font-weight="bold" fill="#6366F1">z</text>
        <g v-if="estado === 'celebrando'" class="leo-chispas" fill="#FBBF24" font-size="14">
          <text x="2" y="36">✦</text>
          <text x="112" y="44">✦</text>
          <text x="8" y="70">✦</text>
        </g>
      </svg>
    </div>

    <p
      v-if="mensaje"
      class="flex-1 p-3 rounded-2xl rounded-bl-none bg-white shadow text-gray-800"
      aria-live="polite"
    >{{ mensaje }}</p>
  </div>
</template>

<script>
import LeoPersonaje from '../base/LeoPersonaje.vue'

const ESTADOS = ['saludando', 'pensando', 'explicando', 'feliz', 'yaCasi', 'celebrando', 'durmiendo', 'confundido']

const TEXTOS = {
  saludando: 'saludando',
  pensando: 'pensando',
  explicando: 'explicando',
  feliz: 'feliz',
  yaCasi: 'animándote',
  celebrando: 'celebrando',
  durmiendo: 'durmiendo',
  confundido: 'confundido'
}

// UI-09: equivalencia entre los estados de la Ruta y los del Leo nuevo
const ESTADO_PERSONAJE = {
  saludando: 'saluda',
  pensando: 'piensa',
  explicando: 'explica',
  feliz: 'acierto',
  yaCasi: 'animo',
  celebrando: 'celebra',
  durmiendo: 'neutro',
  confundido: 'piensa'
}

export default {
  name: 'LeoMascota',
  components: { LeoPersonaje },
  data() {
    // UI-09: leoAnterior = true vuelve al dibujo anterior de Leo en la Ruta
    return { leoAnterior: false }
  },
  props: {
    estado: {
      type: String,
      default: 'saludando',
      validator: valor => ESTADOS.includes(valor)
    },
    mensaje: { type: String, default: '' },
    tamano: { type: String, default: 'md' },
    reducirMovimiento: { type: Boolean, default: false }
  },
  computed: {
    estadoPersonaje() {
      return ESTADO_PERSONAJE[this.estado] || 'neutro'
    },
    textoEstado() {
      return TEXTOS[this.estado]
    },
    ojos() {
      if (this.estado === 'feliz' || this.estado === 'celebrando') return 'arcos'
      if (this.estado === 'durmiendo') return 'cerrados'
      if (this.estado === 'pensando') return 'arriba'
      if (this.estado === 'confundido') return 'distintos'
      return 'normales'
    },
    boca() {
      if (this.estado === 'feliz' || this.estado === 'celebrando') return 'abierta'
      if (this.estado === 'durmiendo') return 'o'
      return 'linea'
    },
    trazoBoca() {
      if (this.estado === 'yaCasi') return 'M58 102 Q66 99 74 102'
      if (this.estado === 'confundido') return 'M56 101 Q61 97 66 101 T76 101'
      if (this.estado === 'pensando') return 'M60 101 L72 101'
      return 'M56 98 Q66 107 76 98' // sonrisa
    }
  }
}
</script>

<style scoped>
.leo-cuerpo,
.leo-mano,
.leo-zeta {
  transform-box: fill-box;
}
.leo-cuerpo { transform-origin: 50% 100%; }
.leo-mano { transform-origin: 0% 100%; }

/* Estados */
.leo--saludando .leo-cuerpo { animation: leo-flotar 3s ease-in-out infinite; }
.leo--saludando .leo-mano { animation: leo-saludar 1s ease-in-out infinite; }
.leo--explicando .leo-cuerpo { animation: leo-flotar 2.5s ease-in-out infinite; }
.leo--pensando .leo-cuerpo { transform: rotate(-4deg); }
.leo--pensando .leo-puntos circle { animation: leo-parpadeo 1.2s ease-in-out infinite; }
.leo--pensando .leo-puntos circle:nth-child(2) { animation-delay: 0.2s; }
.leo--pensando .leo-puntos circle:nth-child(3) { animation-delay: 0.4s; }
.leo--feliz .leo-cuerpo { animation: leo-saltar 0.6s ease-out 2; }
.leo--celebrando .leo-cuerpo { animation: leo-celebrar 0.9s ease-in-out infinite; }
.leo--celebrando .leo-mano { animation: leo-saludar 0.5s ease-in-out infinite; }
.leo--celebrando .leo-chispas { animation: leo-parpadeo 1s ease-in-out infinite; }
.leo--yaCasi .leo-cuerpo { animation: leo-inclinar 0.5s ease-out forwards; }
.leo--durmiendo .leo-cuerpo { animation: leo-respirar 4s ease-in-out infinite; }
.leo--durmiendo .leo-zeta { animation: leo-zeta 2.5s ease-in-out infinite; }
.leo--confundido .leo-cuerpo { transform: rotate(6deg); }

@keyframes leo-flotar {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@keyframes leo-saludar {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes leo-saltar {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-14px); }
}
@keyframes leo-celebrar {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(-6deg); }
  75% { transform: translateY(-10px) rotate(6deg); }
}
@keyframes leo-inclinar {
  to { transform: rotate(-6deg); }
}
@keyframes leo-respirar {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes leo-zeta {
  0% { opacity: 0; transform: translate(0, 0); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translate(6px, -12px); }
}
@keyframes leo-parpadeo {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

/* Accesibilidad: sin movimiento si el sistema lo pide o si se activa el interruptor */
.leo--quieto .leo-cuerpo,
.leo--quieto .leo-cuerpo *,
.leo--quieto svg * {
  animation: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .leo-cuerpo,
  .leo svg * {
    animation: none !important;
  }
}
</style>