<template>
  <!-- UI-09: Leo de cuerpo entero (mismo dibujo del PNG, ahora con brazos y piernas).
       Estados: neutro, saluda, piensa, explica, acierto, animo, celebra y logro (gafas de sol y pulgar arriba).
       UI-10: carga (sonríe, con puntos y nube de pensamiento mientras la app espera), apenado (algo falló en
       la app; nunca por un error del alumno) y piensa con cara de "déjame pensar" (ceja alzada, mano en el mentón).
       Animaciones solo al cambiar de estado, al entrar (si se pide) o al tocarlo, una vez; el único bucle es
       el parpadeo suave y los puntos de "pensando" mientras se espera. Todo se apaga con el interruptor de
       Ajustes (<html data-animaciones="off">) y con "reducir movimiento" del sistema.
       En 48 px o menos se dibuja sin brazos ni piernas, para que se lea bien. -->
  <svg
    class="leo-p"
    :class="{ 'leo-p--quieto': quieto }"
    viewBox="0 0 140 165"
    :width="tamano"
    :height="alto"
    :role="decorativo ? null : 'img'"
    :aria-label="decorativo ? null : etiquetaFinal"
    :aria-hidden="decorativo ? 'true' : null"
    focusable="false"
  >
    <g :class="a.entra">
      <g :class="a.cuerpo">
        <!-- Piernas -->
        <g v-if="conExtremidades" stroke="#404450" stroke-width="5" stroke-linecap="round" fill="none">
          <path d="M58 134 V151" />
          <path d="M82 134 V151" />
          <ellipse cx="54" cy="153" rx="7.5" ry="3.8" fill="#404450" stroke="none" />
          <ellipse cx="86" cy="153" rx="7.5" ry="3.8" fill="#404450" stroke="none" />
        </g>

        <!-- Libro -->
        <rect x="30" y="46" width="80" height="92" rx="11" fill="#3585dd" />
        <rect x="37" y="50" width="69" height="74" rx="5" fill="#82c3fa" />
        <rect x="37" y="50" width="9" height="74" fill="#66abee" />
        <rect x="37" y="125" width="66" height="8" rx="4" fill="#a9d8fd" />
        <path :class="a.marca" d="M45 127 H57 V146 L51 141 L45 146 Z" fill="#f2685c" />

        <!-- Ojos -->
        <g v-if="g.ojos === 'punto'" :class="quieto ? '' : 'lp-parpadeo'" fill="#404450">
          <circle :cx="61 + g.ojoX" :cy="g.ojoY" r="4.6" />
          <ellipse :class="a.ojoDer" :cx="83 + g.ojoX" :cy="g.ojoY + g.ojoDerDy" rx="4.6" ry="4.6" />
        </g>
        <g v-else fill="none" stroke="#404450" stroke-width="3.6" stroke-linecap="round">
          <path d="M55 88 Q61 80 67 88" />
          <path d="M77 88 Q83 80 89 88" />
        </g>

        <!-- UI-10: cejas de "déjame pensar" (una alzada, la otra recta) -->
        <g v-if="g.cejas" fill="none" stroke="#404450" stroke-width="3.2" stroke-linecap="round">
          <path d="M54 74 Q61 67 68 72" />
          <path d="M78 77 Q84 75.5 90 77" />
        </g>

        <!-- Boca -->
        <path
          :d="g.boca"
          :fill="g.bocaRelleno ? '#404450' : 'none'"
          stroke="#404450"
          stroke-width="3.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Gafas de sol (logro) -->
        <g v-if="g.gafas" :class="a.gafas">
          <path d="M47 80 H96" stroke="#1d2533" stroke-width="3.4" stroke-linecap="round" />
          <path d="M49.5 79 H69 Q70.5 79 70 81 L68 89.5 Q67.4 92 64.6 92 H55.4 Q52.6 92 52 89.5 L49 81 Q48.5 79 49.5 79 Z" fill="#26344d" />
          <path d="M74 79 H93.5 Q94.5 79 94 81 L91.5 89.5 Q90.9 92 88.1 92 H78.9 Q76.1 92 75.5 89.5 L73.5 81 Q73 79 74 79 Z" fill="#26344d" />
          <path d="M69.5 81.5 Q71.8 79.4 74 81.5" stroke="#1d2533" stroke-width="2.4" fill="none" stroke-linecap="round" />
          <g :class="a.brillo" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.8" stroke-linecap="round">
            <path d="M54 89 L59.5 81.5" />
            <path d="M58.5 89.5 L61.5 85.5" />
            <path d="M78.5 89 L84 81.5" />
            <path d="M83 89.5 L86 85.5" />
          </g>
        </g>

        <!-- Birrete con borla -->
        <g :class="a.birrete">
          <path d="M46 34 V47 Q70 55 94 47 V34 Z" fill="#3a3e49" />
          <polygon points="70,16 114,30 70,44 26,30" fill="#464b57" />
          <g :class="a.borla">
            <path d="M112 31 V50" stroke="#404450" stroke-width="3" stroke-linecap="round" />
            <circle cx="112" cy="51" r="3.2" fill="#404450" />
            <path d="M108.5 53 L106 66 Q112 69 118 66 L115.5 53 Z" fill="#404450" />
          </g>
        </g>

        <!-- Brazos -->
        <template v-if="conExtremidades">
          <template v-if="estado === 'logro'">
            <path d="M30 96 Q18 104 24 114 Q27 118 31 116" stroke="#404450" stroke-width="5" stroke-linecap="round" fill="none" />
            <g :class="a.brazoDer">
              <path d="M110 96 Q122 94 124 82" stroke="#404450" stroke-width="5" stroke-linecap="round" fill="none" />
              <rect x="117" y="71" width="15" height="13" rx="5" fill="#404450" />
              <rect x="119.5" y="57" width="6.6" height="17" rx="3.3" fill="#404450" />
            </g>
          </template>
          <g v-else stroke="#404450" stroke-width="5" stroke-linecap="round" fill="none">
            <g :class="a.brazoIzq">
              <path :d="g.bi" />
              <circle :cx="g.biX" :cy="g.biY" r="5.2" fill="#404450" stroke="none" />
            </g>
            <g :class="a.brazoDer">
              <path :d="g.bd" />
              <circle :cx="g.bdX" :cy="g.bdY" r="5.2" fill="#404450" stroke="none" />
              <!-- UI-10: dedo índice levantado junto al mentón (piensa) -->
              <path v-if="g.dedo" d="M83 108 L86 101" stroke-width="4" />
            </g>
          </g>
        </template>
      </g>
    </g>

    <!-- Puntos de "pensando" (solo se mueven mientras se espera) -->
    <g v-if="g.puntos" :class="quieto ? '' : 'lp-puntos'" fill="#9db7dd">
      <circle cx="18" cy="52" r="2.6" />
      <circle cx="11" cy="41" r="3.6" />
      <circle cx="6" cy="27" r="4.8" />
    </g>
    <!-- UI-10: nube de pensamiento al final de los puntos (carga) -->
    <path
      v-if="g.nube"
      :class="quieto ? '' : 'lp-nube'"
      d="M-20 17 Q-30 9 -20 2 Q-19 -9 -6 -7 Q1 -16 12 -7 Q24 -6 20 6 Q26 16 12 18 L-14 18 Q-18 18 -20 17 Z"
      fill="#ffffff"
      stroke="#9db7dd"
      stroke-width="2.6"
      stroke-linejoin="round"
    />

    <!-- Estrellas (celebrar, y el logro de una unidad) -->
    <g v-if="g.chispas || chispas" :class="a.chispas" fill="#ffc107" stroke="#d99100" stroke-width="0.8" stroke-linejoin="round">
      <g transform="translate(10 40) scale(1.1)"><path :d="ESTRELLA" /></g>
      <g transform="translate(132 34)"><path :d="ESTRELLA" /></g>
      <g transform="translate(4 100) scale(0.7)"><path :d="ESTRELLA" /></g>
      <g transform="translate(136 104) scale(0.8)"><path :d="ESTRELLA" /></g>
    </g>
  </svg>
</template>

<script>
const ESTADOS = ['neutro', 'saluda', 'piensa', 'explica', 'acierto', 'animo', 'celebra', 'logro', 'carga', 'apenado']

const BASE = {
  bi: 'M30 96 Q22 108 21 118', biX: 21, biY: 120,
  bd: 'M110 96 Q118 108 119 118', bdX: 119, bdY: 120,
  ojos: 'punto', ojoY: 86, boca: 'M64 98 Q72 105 80 98', bocaRelleno: false,
  puntos: false, chispas: false, gafas: false,
  ojoX: 0, ojoDerDy: 0, cejas: false, dedo: false, nube: false
}

const GEOMETRIA = {
  neutro: {},
  saluda: { bd: 'M110 94 Q121 86 123 70', bdX: 123, bdY: 67 },
  // UI-10: "piensa" pasa a la cara de "déjame pensar". La de UI-09 queda abajo, comentada (hoy es "apenado" con puntos):
  // piensa: { bd: 'M110 98 Q120 110 101 113', bdX: 99, bdY: 113, ojoY: 83, boca: 'M66 101 Q72 99 78 101', puntos: true },
  piensa: { bd: 'M110 100 Q104 118 84 112', bdX: 82, bdY: 111, ojoX: 2, ojoY: 82, ojoDerDy: 1, boca: 'M64 101 Q71 101 79 98', cejas: true, dedo: true },
  carga: { bd: 'M110 98 Q120 110 101 113', bdX: 99, bdY: 113, ojoY: 83, boca: 'M63 98 Q72 106 81 98', puntos: true, nube: true },
  apenado: { bd: 'M110 98 Q120 110 101 113', bdX: 99, bdY: 113, ojoY: 83, boca: 'M66 101 Q72 99 78 101' },
  explica: { bd: 'M110 96 Q123 96 131 88', bdX: 133, bdY: 86, boca: 'M64 97 Q72 107 80 97 Z', bocaRelleno: true },
  acierto: { bi: 'M30 94 Q21 84 21 72', biX: 21, biY: 69, bd: 'M110 94 Q119 84 119 72', bdX: 119, bdY: 69, ojos: 'arco', boca: 'M62 96 Q72 110 82 96 Z', bocaRelleno: true },
  animo: { bd: 'M110 98 Q123 102 127 93', bdX: 128, bdY: 91, boca: 'M65 98 Q72 103 79 98' },
  celebra: { bi: 'M30 92 Q17 80 15 64', biX: 15, biY: 61, bd: 'M110 92 Q123 80 125 64', bdX: 125, bdY: 61, ojos: 'arco', boca: 'M62 96 Q72 110 82 96 Z', bocaRelleno: true, chispas: true },
  logro: { ojos: 'arco', boca: 'M61 97 Q72 111 83 97 Z', bocaRelleno: true, gafas: true }
}

// Animación de cada estado (clases que se ponen una vez y se quitan al terminar)
const ANIMACION = {
  neutro: {},
  saluda: { brazoDer: 'lp-saludo', borla: 'lp-borla' },
  piensa: { cuerpo: 'lp-ladea' },
  explica: { brazoDer: 'lp-explica' },
  acierto: { cuerpo: 'lp-salta', borla: 'lp-borla' },
  animo: { cuerpo: 'lp-inclina', brazoDer: 'lp-empuja' },
  celebra: { cuerpo: 'lp-salta2', brazoIzq: 'lp-agita-i', brazoDer: 'lp-agita-d', chispas: 'lp-chispa', borla: 'lp-borla' },
  carga: {},
  apenado: { cuerpo: 'lp-ladea' },
  logro: { entra: 'lp-entra', gafas: 'lp-gafas', brazoDer: 'lp-pulgar', cuerpo: 'lp-salta-tarde', borla: 'lp-borla-tarde', brillo: 'lp-brillo', chispas: 'lp-chispa-tarde' }
}
const DURACION = { neutro: 0, saluda: 1300, piensa: 1100, explica: 1700, acierto: 800, animo: 1000, celebra: 1500, logro: 2300, carga: 0, apenado: 1100 }

// Gestos al tocar a Leo: uno distinto cada vez, en orden
const GESTOS = [
  { ojoDer: 'lp-guino' },
  { birrete: 'lp-birrete' },
  { borla: 'lp-borla' },
  { marca: 'lp-marca' },
  { cuerpo: 'lp-salta' }
]

// Entrada variada (bienvenidas con estado "saluda"): la primera vez en la sesión Leo saluda con
// la mano; las siguientes hace un gesto al azar, sin repetir el último. Vive solo en memoria:
// al recargar la página vuelve a empezar con el saludo.
const entradaSesion = { saludoHecho: false, ultimoGesto: -1 }

const ETIQUETAS = {
  neutro: 'Leo', saluda: 'Leo saludando', piensa: 'Leo pensando', explica: 'Leo explicando',
  acierto: 'Leo feliz por tu respuesta', animo: 'Leo dándote ánimo', celebra: 'Leo celebrando',
  logro: 'Leo con gafas de sol levantando el pulgar',
  carga: 'Leo esperando', apenado: 'Leo apenado'
}

export default {
  name: 'LeoPersonaje',
  props: {
    estado: { type: String, default: 'neutro', validator: v => ESTADOS.includes(v) },
    /** Ancho en px. Desde 60 px se dibuja completo; en 48 px o menos, sin brazos ni piernas. */
    tamano: { type: Number, default: 96 },
    /** Forzar con o sin brazos y piernas (null = según el tamaño) */
    extremidades: { type: Boolean, default: null },
    /** Reproducir la animación del estado al aparecer */
    animarAlEntrar: { type: Boolean, default: false },
    /** Sin ninguna animación (ni parpadeo) */
    quieto: { type: Boolean, default: false },
    /** Solo decorativo: lo ignoran los lectores de pantalla */
    decorativo: { type: Boolean, default: false },
    etiqueta: { type: String, default: '' },
    /** Estrellas extra alrededor (logro de una unidad) */
    chispas: { type: Boolean, default: false }
  },
  data() {
    return {
      ESTRELLA: 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z',
      animando: false,
      gesto: null,
      indiceGesto: 0,
      temporizadores: []
    }
  },
  computed: {
    alto() {
      return Math.round(this.tamano * 165 / 140)
    },
    conExtremidades() {
      return this.extremidades === null ? this.tamano > 48 : this.extremidades
    },
    g() {
      return Object.assign({}, BASE, GEOMETRIA[this.estado] || {})
    },
    etiquetaFinal() {
      return this.etiqueta || ETIQUETAS[this.estado] || 'Leo'
    },
    a() {
      return Object.assign(
        { entra: '', cuerpo: '', brazoIzq: '', brazoDer: '', borla: '', birrete: '', marca: '', ojoDer: '', gafas: '', brillo: '', chispas: '' },
        this.animando ? (ANIMACION[this.estado] || {}) : {},
        this.gesto || {}
      )
    }
  },
  watch: {
    estado(nuevo) {
      // Volver a "saluda" (p. ej. la Ruta al terminar de cargar) cuenta como bienvenida
      if (nuevo === 'saluda' && this.animarAlEntrar) this.entrar()
      else this.reproducir()
    }
  },
  mounted() {
    if (!this.animarAlEntrar) return
    if (this.estado === 'saluda') this.entrar()
    else this.reproducir()
  },
  beforeUnmount() {
    this.temporizadores.forEach(t => clearTimeout(t))
  },
  methods: {
    puedeAnimar() {
      if (this.quieto) return false
      try {
        if (document.documentElement.getAttribute('data-animaciones') === 'off') return false
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      } catch (e) {
        return true
      }
      return true
    },
    despues(ms, fn) {
      this.temporizadores.push(setTimeout(fn, ms))
    },
    /** Reproduce una vez la animación del estado actual */
    reproducir() {
      if (!this.puedeAnimar() || !DURACION[this.estado]) return
      this.animando = false
      this.gesto = null
      const estado = this.estado
      this.$nextTick(() => {
        this.despues(20, () => {
          // Si el estado cambió en estos milisegundos (p. ej. la Ruta termina de cargar), no se reproduce
          if (this.estado !== estado) return
          this.animando = true
          this.despues(DURACION[estado], () => {
            if (this.estado === estado) this.animando = false
          })
        })
      })
    },
    /** Bienvenida: saludo la primera vez en la sesión; después, un gesto al azar distinto al anterior */
    entrar() {
      if (!this.puedeAnimar()) return
      if (!entradaSesion.saludoHecho) {
        entradaSesion.saludoHecho = true
        this.reproducir()
        return
      }
      const opciones = GESTOS.map((g, i) => i).filter(i => i !== entradaSesion.ultimoGesto)
      const elegido = opciones[Math.floor(Math.random() * opciones.length)]
      entradaSesion.ultimoGesto = elegido
      // Al tocarlo después, sigue con el gesto siguiente para no repetir el de la entrada
      this.indiceGesto = elegido
      this.reaccionar()
    },
    /** Gesto al tocar: guiño, birrete, borla, marcapáginas o saltito (uno distinto cada vez) */
    reaccionar() {
      if (!this.puedeAnimar()) return
      const gesto = GESTOS[this.indiceGesto % GESTOS.length]
      this.indiceGesto++
      const turno = this.indiceGesto // se compara el turno (el objeto guardado en data pasa a ser reactivo)
      this.animando = false
      this.gesto = null
      this.despues(20, () => {
        this.gesto = gesto
        this.despues(1000, () => {
          if (this.indiceGesto === turno) this.gesto = null
        })
      })
    }
  }
}
</script>

<style scoped>
.leo-p {
  display: block;
  overflow: visible;
}

/* Animaciones de estado (una vez) */
.lp-saludo { transform-origin: 110px 94px; animation: lp-saludo 1.2s ease-in-out; }
.lp-explica { animation: lp-explica 0.8s ease-in-out 2; }
.lp-empuja { transform-origin: 110px 98px; animation: lp-empuja 0.8s ease-out; }
.lp-agita-i { transform-origin: 30px 92px; animation: lp-agita-i 0.45s ease-in-out 3; }
.lp-agita-d { transform-origin: 110px 92px; animation: lp-agita-d 0.45s ease-in-out 3; }
.lp-salta { transform-origin: 70px 156px; animation: lp-salta 0.7s cubic-bezier(0.3, 0.7, 0.4, 1); }
.lp-salta2 { transform-origin: 70px 156px; animation: lp-salta 0.7s cubic-bezier(0.3, 0.7, 0.4, 1) 2; }
.lp-ladea { transform-origin: 70px 150px; animation: lp-ladea 1s ease-in-out; }
.lp-inclina { transform-origin: 70px 150px; animation: lp-inclina 0.9s ease-in-out; }
.lp-borla { transform-origin: 112px 31px; animation: lp-borla 1s ease-in-out; }
.lp-birrete { transform-origin: 70px 40px; animation: lp-birrete 0.6s ease-out; }
.lp-marca { transform-origin: 51px 127px; animation: lp-marca 0.8s ease-in-out; }
.lp-guino { transform-box: fill-box; transform-origin: center; animation: lp-guino 0.7s ease-in-out; }
.lp-chispa path { transform-box: fill-box; transform-origin: center; animation: lp-chispa 0.9s ease-out; }

/* Logro: entra, caen las gafas, sube el pulgar, saltito */
.lp-entra { animation: lp-entra 0.5s cubic-bezier(0.2, 0.8, 0.3, 1.2) both; }
.lp-gafas { animation: lp-gafas 0.45s cubic-bezier(0.3, 0.7, 0.4, 1.3) 0.55s both; }
.lp-pulgar { transform-origin: 110px 96px; animation: lp-pulgar 0.5s cubic-bezier(0.3, 0.7, 0.4, 1.4) 1s both; }
.lp-salta-tarde { transform-origin: 70px 156px; animation: lp-salta 0.6s cubic-bezier(0.3, 0.7, 0.4, 1) 1.45s; }
.lp-borla-tarde { transform-origin: 112px 31px; animation: lp-borla 1s ease-in-out 1.45s; }
.lp-brillo { animation: lp-brillo 0.8s ease-out 1.1s both; }
.lp-chispa-tarde path { transform-box: fill-box; transform-origin: center; animation: lp-chispa 0.9s ease-out 1.5s both; }

/* Los únicos bucles: parpadeo suave y los puntos mientras Leo piensa */
.lp-parpadeo { transform-box: fill-box; transform-origin: center; animation: lp-parpadeo 5s infinite; }
.lp-puntos circle { animation: lp-puntos 1.2s ease-in-out infinite; }
.lp-puntos circle:nth-child(2) { animation-delay: 0.2s; }
.lp-puntos circle:nth-child(3) { animation-delay: 0.4s; }
.lp-nube { transform-box: fill-box; transform-origin: center; animation: lp-nube 1.2s ease-in-out 0.6s infinite; }

@keyframes lp-saludo { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-22deg); } 45% { transform: rotate(10deg); } 70% { transform: rotate(-22deg); } }
@keyframes lp-explica { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(4px, -3px); } }
@keyframes lp-empuja { 0%, 100% { transform: rotate(0); } 45% { transform: rotate(-14deg); } }
@keyframes lp-agita-i { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(14deg); } }
@keyframes lp-agita-d { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-14deg); } }
@keyframes lp-salta { 0%, 100% { transform: translateY(0); } 15% { transform: translateY(2px) scaleY(0.97); } 45% { transform: translateY(-14px); } 70% { transform: translateY(0); } 82% { transform: translateY(-3px); } }
@keyframes lp-ladea { 0%, 100% { transform: rotate(0); } 40%, 70% { transform: rotate(-5deg); } }
@keyframes lp-inclina { 0%, 100% { transform: rotate(0); } 35%, 65% { transform: rotate(6deg); } }
@keyframes lp-borla { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(22deg); } 55% { transform: rotate(-14deg); } 80% { transform: rotate(7deg); } }
@keyframes lp-birrete { 0%, 100% { transform: translateY(0) rotate(0); } 40% { transform: translateY(-9px) rotate(-6deg); } 70% { transform: translateY(0) rotate(2deg); } }
@keyframes lp-marca { 0%, 100% { transform: rotate(0); } 30% { transform: rotate(16deg); } 65% { transform: rotate(-10deg); } }
@keyframes lp-guino { 0%, 100% { transform: scaleY(1); } 30%, 70% { transform: scaleY(0.12); } }
@keyframes lp-chispa { 0% { transform: scale(0); opacity: 0; } 40% { transform: scale(1.25); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes lp-entra { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lp-gafas { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lp-pulgar { from { transform: rotate(75deg); } to { transform: rotate(0); } }
@keyframes lp-brillo { 0% { opacity: 0; transform: translate(-6px, 6px); } 40% { opacity: 1; } 100% { opacity: 0.45; transform: translate(0, 0); } }
@keyframes lp-parpadeo { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
@keyframes lp-nube { 0%, 100% { opacity: 0.55; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1); } }
@keyframes lp-puntos { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }

/* Accesibilidad: sin movimiento si el sistema lo pide, si se apaga en Ajustes o si se pide "quieto" */
.leo-p--quieto * { animation: none !important; }
@media (prefers-reduced-motion: reduce) {
  .leo-p * { animation: none !important; }
}
html[data-animaciones="off"] .leo-p * { animation: none !important; }
</style>
