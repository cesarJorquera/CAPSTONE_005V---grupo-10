<template>
  <!-- Íconos planos y coloridos del menú principal (UI-03). Se dibujan en SVG propio:
       sin librerías ni emojis. La animación solo ocurre cuando el padre pone la
       clase "mp-anim" (es decir, cuando la persona toca la opción). -->
  <svg class="mp-icono" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <!-- Inicio: libro abierto cuya página se voltea -->
    <g v-if="tipo === 'inicio'">
      <path d="M2 11 Q9 8 16 12 Q23 8 30 11 V27 Q23 24 16 28 Q9 24 2 27 Z" fill="#2568c4" />
      <path d="M4 12 Q10 10 16 13 V25.5 Q10 22.5 4 24.5 Z" fill="#ffffff" />
      <path d="M28 12 Q22 10 16 13 V25.5 Q22 22.5 28 24.5 Z" fill="#e4f0fb" />
      <g class="mp-pagina">
        <path d="M28 12 Q22 10 16 13 V25.5 Q22 22.5 28 24.5 Z" fill="#ffffff" stroke="#9db7dd" stroke-width="1" />
        <path d="M19 16 Q22 15 25 16 M19 19 Q22 18 25 19" stroke="#9db7dd" stroke-width="1.2" fill="none" stroke-linecap="round" />
      </g>
    </g>

    <!-- Progreso: trofeo con un destello que lo cruza y chispas -->
    <g v-else-if="tipo === 'progreso'">
      <defs>
        <clipPath id="mp-clip-copa"><path d="M10 5 H22 V12 A6 6 0 0 1 10 12 Z" /></clipPath>
      </defs>
      <path d="M10 7 H6 V9 A4 4 0 0 0 10 13" stroke="#d99100" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M22 7 H26 V9 A4 4 0 0 1 22 13" stroke="#d99100" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M10 5 H22 V12 A6 6 0 0 1 10 12 Z" fill="#ffc107" />
      <rect class="mp-brillo" x="-8" y="2" width="5" height="18" fill="#ffffff" opacity="0.85" clip-path="url(#mp-clip-copa)" transform="skewX(-20)" />
      <rect x="14.5" y="18" width="3" height="4" fill="#d99100" />
      <rect x="10" y="22" width="12" height="5" rx="1.5" fill="#2568c4" />
      <g transform="translate(26 5)"><path class="mp-chispa" d="M0 -3.5 L1 -1 L3.5 0 L1 1 L0 3.5 L-1 1 L-3.5 0 L-1 -1 Z" fill="#ffc107" /></g>
      <g transform="translate(5 4)"><path class="mp-chispa mp-chispa-2" d="M0 -3 L0.9 -0.9 L3 0 L0.9 0.9 L0 3 L-0.9 0.9 L-3 0 L-0.9 -0.9 Z" fill="#ffc107" /></g>
    </g>

    <!-- LeoIA: la mascota Leo Perfecto con la estrella de cuatro puntas (símbolo universal de IA) -->
    <g v-else-if="tipo === 'leoia'">
      <!-- UI-09: Leo nuevo (sin brazos ni piernas en este tamaño). leoAnterior = true vuelve a la imagen PNG -->
      <image v-if="leoAnterior" :href="imagenLeo" x="-2" y="3" width="30" height="30" />
      <svg v-else x="1" y="2" width="22" height="30" viewBox="24 12 98 136">
        <rect x="30" y="46" width="80" height="92" rx="11" fill="#3585dd" />
        <rect x="37" y="50" width="69" height="74" rx="5" fill="#82c3fa" />
        <rect x="37" y="50" width="9" height="74" fill="#66abee" />
        <rect x="37" y="125" width="66" height="8" rx="4" fill="#a9d8fd" />
        <path d="M45 127 H57 V146 L51 141 L45 146 Z" fill="#f2685c" />
        <circle cx="61" cy="86" r="5.5" fill="#404450" />
        <circle cx="83" cy="86" r="5.5" fill="#404450" />
        <path d="M63 98 Q72 106 81 98" fill="none" stroke="#404450" stroke-width="4.5" stroke-linecap="round" />
        <path d="M46 34 V47 Q70 55 94 47 V34 Z" fill="#3a3e49" />
        <polygon points="70,16 114,30 70,44 26,30" fill="#464b57" />
        <path d="M112 31 V52" stroke="#404450" stroke-width="4" stroke-linecap="round" />
        <path d="M108 53 L106 66 Q112 69 118 66 L116 53 Z" fill="#404450" />
      </svg>
      <g transform="translate(26.5 7)">
        <!-- Brillo y estrella comparten centro y se mueven juntos -->
        <g class="mp-destello">
          <circle r="6.5" fill="#ffc107" opacity="0" class="mp-halo" />
          <path class="mp-estrella" d="M0 -5.5 L1.5 -1.5 L5.5 0 L1.5 1.5 L0 5.5 L-1.5 1.5 L-5.5 0 L-1.5 -1.5 Z" fill="#ffc107" stroke="#d99100" stroke-width="0.6" stroke-linejoin="round" />
        </g>
      </g>
    </g>

    <!-- Ajustes: engranaje que gira -->
    <g v-else-if="tipo === 'ajustes'">
      <g class="mp-rueda">
        <rect v-for="k in 8" :key="k" x="14" y="2.5" width="4" height="6" rx="1" fill="#6b7a90" :transform="'rotate(' + (k - 1) * 45 + ' 16 16)'" />
        <circle cx="16" cy="16" r="9" fill="#8a99ad" />
        <circle cx="16" cy="16" r="4" fill="#fbfcfe" />
      </g>
    </g>

    <!-- Salir: puerta con flecha que se desliza hacia afuera -->
    <g v-else-if="tipo === 'salir'">
      <path d="M13 5 H7 a2 2 0 0 0 -2 2 V25 a2 2 0 0 0 2 2 H13" stroke="#c2382d" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <g class="mp-flecha">
        <path d="M12 16 H27 M22 10.5 L27.5 16 L22 21.5" stroke="#c2382d" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </g>

    <!-- Docente: barras que suben -->
    <g v-else-if="tipo === 'docente'">
      <rect class="mp-barra" x="6" y="16" width="5" height="11" rx="1.2" fill="#2568c4" />
      <rect class="mp-barra mp-barra-2" x="13.5" y="7" width="5" height="20" rx="1.2" fill="#1f7a47" />
      <rect class="mp-barra mp-barra-3" x="21" y="12" width="5" height="15" rx="1.2" fill="#ffc107" />
      <rect x="4" y="27" width="24" height="2" rx="1" fill="#52627a" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconoMenu',
  props: {
    tipo: { type: String, required: true }
  },
  data() {
    // UI-09: leoAnterior = true vuelve a la imagen PNG de Leo
    return { imagenLeo: require('@/assets/icons/libro-sin-fondo-feliz.png'), leoAnterior: false }
  }
}
</script>

<style>
/* Animaciones ligeras: solo transform y opacity, una vez, 0,7 s o menos. */
.mp-icono { display: block; overflow: visible; }

/* Inicio: la página gira sobre el lomo y vuelve */
.mp-icono .mp-pagina { transform-box: view-box; transform-origin: 16px 16px; }
.mp-anim .mp-pagina { animation: mp-voltear 0.7s ease-in-out; }
@keyframes mp-voltear {
  0% { transform: scaleX(1); }
  35% { transform: scaleX(-1); }
  55% { transform: scaleX(-1); }
  90%, 100% { transform: scaleX(1); }
}

/* Progreso: brillo que cruza la copa + chispas */
.mp-icono .mp-brillo { transform-box: view-box; }
.mp-anim .mp-brillo { animation: mp-brillo 0.7s ease-in-out; }
@keyframes mp-brillo {
  from { transform: skewX(-20deg) translateX(0); }
  to { transform: skewX(-20deg) translateX(34px); }
}
.mp-icono .mp-chispa { transform: scale(0); transform-box: fill-box; transform-origin: center; }
.mp-anim .mp-chispa { animation: mp-chispa 0.7s ease-out; }
.mp-anim .mp-chispa-2 { animation-delay: 0.12s; }
@keyframes mp-chispa {
  0% { transform: scale(0); opacity: 0; }
  40% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

/* LeoIA: la estrella se eleva y brilla (brillo y estrella siempre centrados entre sí) */
.mp-icono .mp-destello, .mp-icono .mp-estrella { transform-box: fill-box; transform-origin: center; }
.mp-anim .mp-destello { animation: mp-elevar 0.8s ease-in-out; }
.mp-anim .mp-estrella { animation: mp-girar-estrella 0.8s ease-in-out; }
.mp-anim .mp-halo { animation: mp-halo 0.8s ease-in-out; }
@keyframes mp-elevar {
  0%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-2px) scale(1.25); }
}
@keyframes mp-girar-estrella {
  0%, 100% { transform: rotate(0); }
  40%, 70% { transform: rotate(45deg); }
}
@keyframes mp-halo {
  0%, 100% { opacity: 0; }
  40% { opacity: 0.55; }
}

/* Salir: la flecha sale hacia la derecha y regresa */
.mp-anim .mp-flecha { animation: mp-salir 0.6s ease-in-out; }
@keyframes mp-salir {
  0%, 100% { transform: translateX(0); opacity: 1; }
  45% { transform: translateX(5px); opacity: 0.2; }
  55% { transform: translateX(-5px); opacity: 0.2; }
}

/* Ajustes: el engranaje da media vuelta */
.mp-icono .mp-rueda { transform-box: view-box; transform-origin: 16px 16px; }
.mp-anim .mp-rueda { animation: mp-girar 0.7s ease-in-out; }
@keyframes mp-girar { from { transform: rotate(0); } to { transform: rotate(180deg); } }

/* Docente: las barras suben una tras otra */
.mp-icono .mp-barra { transform-box: fill-box; transform-origin: bottom center; }
.mp-anim .mp-barra { animation: mp-subir 0.6s ease-out backwards; }
.mp-anim .mp-barra-2 { animation-delay: 0.08s; }
.mp-anim .mp-barra-3 { animation-delay: 0.16s; }
@keyframes mp-subir { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }

/* Sin movimiento si el sistema lo pide o si la preferencia "animaciones" (UI-08)
   la apaga con <html data-animaciones="off">. */
@media (prefers-reduced-motion: reduce) {
  .mp-anim .mp-icono *, .mp-anim.mp-icono * { animation: none !important; }
}
:root[data-animaciones="off"] .mp-anim .mp-icono * { animation: none !important; }
</style>
