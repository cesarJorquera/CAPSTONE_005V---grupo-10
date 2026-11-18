<template>
  <!-- UI-01: Landing Page. Primera pantalla para quien no tiene sesión. -->
  <div class="lp-raiz fixed inset-0 overflow-y-auto text-left font-cuerpo antialiased" :style="{ backgroundImage: fondo }">
    <main class="flex items-center justify-center md:p-6">
      <div class="lp-tarjeta w-full max-w-6xl bg-leo-papel md:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        <!-- Escena (arriba en celular, a la derecha en escritorio) -->
        <div class="relative order-first lg:order-last h-80 sm:h-96 lg:h-auto lg:m-3 lg:rounded-2xl overflow-hidden">
          
          <svg viewBox="0 0 600 760" preserveAspectRatio="xMidYMax slice" class="absolute inset-0 w-full h-full" role="img"
               aria-label="Ilustración de un libro sonriente con birrete de graduación, sentado en un prado con árboles, nubes y cielo azul">
            <defs>
              <linearGradient id="lp-cielo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#6fc3f0"/><stop offset=".55" stop-color="#bfe6f8"/><stop offset="1" stop-color="#e6f6ef"/>
              </linearGradient>
              <radialGradient id="lp-sol"><stop offset="0" stop-color="#fff8d6" stop-opacity=".95"/><stop offset="1" stop-color="#fff8d6" stop-opacity="0"/></radialGradient>
              <pattern id="lp-puntos" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#0b3a5a" opacity=".05"/></pattern>
              <g id="lp-arbol">
            <rect x="-5" y="-44" width="10" height="46" rx="3" fill="#7a5a3a"/>
            <circle cx="-21" cy="-50" r="23" fill="#2a8f52"/><circle cx="21" cy="-50" r="23" fill="#2a8f52"/>
            <circle cx="0" cy="-66" r="31" fill="#2f9e5b"/><circle cx="-9" cy="-76" r="14" fill="#52c07c" opacity=".85"/></g>
              <g id="lp-pino">
            <rect x="-4" y="-18" width="8" height="20" rx="2" fill="#7a5a3a"/>
            <polygon points="0,-78 -40,-16 40,-16" fill="#1f7a47"/>
            <polygon points="0,-102 -33,-50 33,-50" fill="#248a50"/>
            <polygon points="0,-124 -26,-80 26,-80" fill="#2a9a58"/></g>
              <g id="lp-nube">
            <g transform="translate(0 6)" fill="#cfe9f6"><rect x="-92" y="0" width="190" height="38" rx="19"/></g>
            <g fill="#ffffff"><rect x="-92" y="-2" width="190" height="38" rx="19"/>
            <circle cx="-48" cy="2" r="32"/><circle cx="2" cy="-16" r="44"/><circle cx="52" cy="-2" r="34"/></g></g>
            </defs>
          
            <rect width="600" height="760" fill="url(#lp-cielo)"/>
            <circle cx="480" cy="140" r="120" fill="url(#lp-sol)"/>
            <circle cx="480" cy="140" r="38" fill="#fff6c4"/>
          
            <g transform="translate(120 130) scale(.8)"><g class="nube" style="--dx:70px;--t:70s;--d:-10s"><use href="#lp-nube"/></g></g>
            <g transform="translate(430 250) scale(1.15)"><g class="nube" style="--dx:50px;--t:58s;--d:-30s"><use href="#lp-nube"/></g></g>
            <g transform="translate(150 330) scale(.65)"><g class="nube" style="--dx:60px;--t:80s;--d:-5s"><use href="#lp-nube"/></g></g>
            <g transform="translate(300 60) scale(.55)" opacity=".9"><g class="nube" style="--dx:40px;--t:90s;--d:-45s"><use href="#lp-nube"/></g></g>
          
            <path d="M0 470 C80 430 160 440 240 465 C320 490 400 430 480 440 C540 448 575 460 600 455 L600 760 L0 760 Z" fill="#9bd8a6"/>
            <g><g transform="translate(14 495.3) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:3.4s"/></g><g transform="translate(66.7 495.5) scale(0.5)"><use href="#lp-pino" class="copa" style="--d:1.4s"/></g><g transform="translate(110.9 494.2) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:1.3s"/></g><g transform="translate(150 495.5) scale(0.5)"><use href="#lp-pino" class="copa" style="--d:0.9s"/></g><g transform="translate(196 493.8) scale(0.6)"><use href="#lp-arbol" class="copa" style="--d:3.7s"/></g><g transform="translate(235.8 498) scale(0.6)"><use href="#lp-arbol" class="copa" style="--d:2.2s"/></g><g transform="translate(277 496.2) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:3.2s"/></g><g transform="translate(324.2 496.8) scale(0.6)"><use href="#lp-arbol" class="copa" style="--d:1.8s"/></g><g transform="translate(363.5 496.7) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:0.8s"/></g><g transform="translate(416.8 498.7) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:2.8s"/></g><g transform="translate(470.6 496.9) scale(0.6)"><use href="#lp-pino" class="copa" style="--d:2.2s"/></g><g transform="translate(527.6 496.4) scale(0.5)"><use href="#lp-arbol" class="copa" style="--d:1.2s"/></g><g transform="translate(570.7 498) scale(0.6)"><use href="#lp-pino" class="copa" style="--d:2.5s"/></g><g transform="translate(20 548.9) scale(0.8)"><use href="#lp-arbol" class="copa" style="--d:0.6s"/></g><g transform="translate(81.2 561.1) scale(1)"><use href="#lp-arbol" class="copa" style="--d:3.2s"/></g><g transform="translate(149.6 561.7) scale(0.9)"><use href="#lp-pino" class="copa" style="--d:1.7s"/></g><g transform="translate(426.2 554) scale(0.8)"><use href="#lp-pino" class="copa" style="--d:2.4s"/></g><g transform="translate(500 563.5) scale(0.9)"><use href="#lp-arbol" class="copa" style="--d:2.8s"/></g><g transform="translate(578.9 549.9) scale(1)"><use href="#lp-pino" class="copa" style="--d:0.6s"/></g></g>
            <path d="M0 524 C90 494 170 504 260 528 C350 550 440 504 520 508 C560 511 585 522 600 526 L600 760 L0 760 Z" fill="#6fc27d"/>
            <path d="M0 592 C120 572 240 582 330 602 C430 622 520 592 600 588 L600 760 L0 760 Z" fill="#4fae5b"/>
            <path d="M0 684 C100 664 220 674 320 689 C420 704 520 679 600 674 L600 760 L0 760 Z" fill="#3d9a4d"/>
            <rect width="600" height="760" fill="url(#lp-puntos)"/>
          
            <g><g transform="translate(96 604) scale(1.25)"><use href="#lp-pino" class="copa" style="--d:0.6s"/></g><g transform="translate(44 646) scale(1.55)"><use href="#lp-arbol" class="copa" style="--d:0s"/></g><g transform="translate(512 612) scale(1.35)"><use href="#lp-pino" class="copa" style="--d:1.4s"/></g><g transform="translate(560 640) scale(1.7)"><use href="#lp-arbol" class="copa" style="--d:2.2s"/></g></g>
            <ellipse cx="140" cy="704" rx="34" ry="18" fill="#97a5b3"/><ellipse cx="132" cy="698" rx="18" ry="8" fill="#b9c5d0"/>
            <ellipse cx="474" cy="716" rx="28" ry="15" fill="#97a5b3"/><ellipse cx="468" cy="711" rx="14" ry="6" fill="#b9c5d0"/>
            <g><path d="M173.2 659.2 v-20.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="173.2" cy="638.4" r="3.5" fill="#ffd23f"/><path d="M155.3 660.2 v-11.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="155.3" cy="649" r="4.6" fill="#ffe27a"/><path d="M194.9 746.9 v-13.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="194.9" cy="733.8" r="3.6" fill="#ffffff"/><path d="M478.1 718.9 v-17" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="478.1" cy="702" r="2.8" fill="#ff8fa3"/><path d="M525.3 637.8 v-22.9" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="525.3" cy="614.9" r="3.6" fill="#ffd23f"/><path d="M481.6 708.7 v-15" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="481.6" cy="693.7" r="4.7" fill="#ff8fa3"/><path d="M13.5 734.3 v-13.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="13.5" cy="721.2" r="2.7" fill="#ffe27a"/><path d="M264.9 724.9 v-14.6" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="264.9" cy="710.3" r="4.4" fill="#ffffff"/><path d="M585.6 711.3 v-13.5" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="585.6" cy="697.8" r="3.2" fill="#ffd23f"/><path d="M127.7 649 v-13.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="127.7" cy="635.2" r="4.8" fill="#ffd23f"/><path d="M216 719.9 v-20.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="216" cy="699.1" r="3.6" fill="#ffd23f"/><path d="M18.8 684.2 v-10.7" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="18.8" cy="673.5" r="4.6" fill="#ffffff"/><path d="M143.1 640 v-11" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="143.1" cy="629" r="3.6" fill="#ffd23f"/><path d="M125.9 746.2 v-13" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="125.9" cy="733.1" r="2.8" fill="#ffe27a"/><path d="M365.9 747.9 v-23.9" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="365.9" cy="724.1" r="4" fill="#ffffff"/><path d="M513 619.4 v-16.9" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="513" cy="602.6" r="3.1" fill="#ffffff"/><path d="M14.9 683.4 v-15.9" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="14.9" cy="667.6" r="3.7" fill="#ffffff"/><path d="M458.9 711.5 v-23.5" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="458.9" cy="688" r="4.6" fill="#ffd23f"/><path d="M360.4 727.9 v-15.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="360.4" cy="712.2" r="3.9" fill="#ffd23f"/><path d="M522.8 744.2 v-20.4" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="522.8" cy="723.8" r="3.1" fill="#ffe27a"/><path d="M456.8 673.4 v-15" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="456.8" cy="658.4" r="4.3" fill="#ffd23f"/><path d="M170.6 667.4 v-19.6" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="170.6" cy="647.9" r="2.7" fill="#ffe27a"/><path d="M115.5 684.3 v-13.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="115.5" cy="671.2" r="4.1" fill="#ffffff"/><path d="M269.5 745.1 v-19.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="269.5" cy="725.3" r="4" fill="#ffffff"/><path d="M151.7 693.8 v-18.3" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="151.7" cy="675.5" r="2.7" fill="#ff8fa3"/><path d="M493.6 715.5 v-11.6" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="493.6" cy="703.9" r="3.3" fill="#ffe27a"/><path d="M501.3 740.4 v-10.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="501.3" cy="730.2" r="4.2" fill="#ff8fa3"/><path d="M380.5 734.6 v-10.3" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="380.5" cy="724.3" r="4.2" fill="#ffd23f"/><path d="M461.7 751.3 v-10.8" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="461.7" cy="740.5" r="3.8" fill="#ffe27a"/><path d="M483.5 665.8 v-22.2" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="483.5" cy="643.6" r="2.7" fill="#ffe27a"/><path d="M428.7 656.6 v-11.7" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="428.7" cy="644.9" r="2.8" fill="#ffd23f"/><path d="M537.2 654.8 v-15" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="537.2" cy="639.8" r="3.5" fill="#ffd23f"/><path d="M21.3 629 v-12.6" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="21.3" cy="616.4" r="3" fill="#ffd23f"/><path d="M378.6 727.4 v-20.1" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="378.6" cy="707.3" r="3.4" fill="#ffd23f"/><path d="M411.2 694.4 v-12.6" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="411.2" cy="681.8" r="2.8" fill="#ffd23f"/><path d="M167.8 636.1 v-10.2" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="167.8" cy="625.9" r="3.6" fill="#ffffff"/><path d="M484.3 704.9 v-17.9" stroke="#2f8a45" stroke-width="2" stroke-linecap="round"/><circle cx="484.3" cy="687" r="4.2" fill="#ffffff"/><path d="M174.9 657.9 q-4 -14 -9 -22 M174.9 657.9 q0 -16 2 -26 M174.9 657.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M503.3 724.4 q-4 -14 -9 -22 M503.3 724.4 q0 -16 2 -26 M503.3 724.4 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M423.3 656.6 q-4 -14 -9 -22 M423.3 656.6 q0 -16 2 -26 M423.3 656.6 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M80.9 680.9 q-4 -14 -9 -22 M80.9 680.9 q0 -16 2 -26 M80.9 680.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M516.1 648 q-4 -14 -9 -22 M516.1 648 q0 -16 2 -26 M516.1 648 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M99.4 714 q-4 -14 -9 -22 M99.4 714 q0 -16 2 -26 M99.4 714 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M312.6 734.8 q-4 -14 -9 -22 M312.6 734.8 q0 -16 2 -26 M312.6 734.8 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M334.3 751.2 q-4 -14 -9 -22 M334.3 751.2 q0 -16 2 -26 M334.3 751.2 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M188.8 732.3 q-4 -14 -9 -22 M188.8 732.3 q0 -16 2 -26 M188.8 732.3 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M33.7 691.1 q-4 -14 -9 -22 M33.7 691.1 q0 -16 2 -26 M33.7 691.1 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M54.9 727.9 q-4 -14 -9 -22 M54.9 727.9 q0 -16 2 -26 M54.9 727.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M245 733.5 q-4 -14 -9 -22 M245 733.5 q0 -16 2 -26 M245 733.5 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M264 728.9 q-4 -14 -9 -22 M264 728.9 q0 -16 2 -26 M264 728.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M187.7 725.4 q-4 -14 -9 -22 M187.7 725.4 q0 -16 2 -26 M187.7 725.4 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M497.5 665.5 q-4 -14 -9 -22 M497.5 665.5 q0 -16 2 -26 M497.5 665.5 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M148.8 746.8 q-4 -14 -9 -22 M148.8 746.8 q0 -16 2 -26 M148.8 746.8 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M423.2 741.2 q-4 -14 -9 -22 M423.2 741.2 q0 -16 2 -26 M423.2 741.2 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M144 677.9 q-4 -14 -9 -22 M144 677.9 q0 -16 2 -26 M144 677.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M475.4 655.4 q-4 -14 -9 -22 M475.4 655.4 q0 -16 2 -26 M475.4 655.4 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M395.3 725.2 q-4 -14 -9 -22 M395.3 725.2 q0 -16 2 -26 M395.3 725.2 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M552.4 737.6 q-4 -14 -9 -22 M552.4 737.6 q0 -16 2 -26 M552.4 737.6 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M350.3 720.7 q-4 -14 -9 -22 M350.3 720.7 q0 -16 2 -26 M350.3 720.7 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M277.6 734 q-4 -14 -9 -22 M277.6 734 q0 -16 2 -26 M277.6 734 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M582.2 729.4 q-4 -14 -9 -22 M582.2 729.4 q0 -16 2 -26 M582.2 729.4 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M133.6 711.8 q-4 -14 -9 -22 M133.6 711.8 q0 -16 2 -26 M133.6 711.8 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M78.6 681.5 q-4 -14 -9 -22 M78.6 681.5 q0 -16 2 -26 M78.6 681.5 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M105 732.9 q-4 -14 -9 -22 M105 732.9 q0 -16 2 -26 M105 732.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M349.4 747.1 q-4 -14 -9 -22 M349.4 747.1 q0 -16 2 -26 M349.4 747.1 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M343.1 721.7 q-4 -14 -9 -22 M343.1 721.7 q0 -16 2 -26 M343.1 721.7 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M421.1 693.9 q-4 -14 -9 -22 M421.1 693.9 q0 -16 2 -26 M421.1 693.9 q5 -12 10 -20" stroke="#2f8a45" stroke-width="3" stroke-linecap="round" fill="none"/></g>
          
            <ellipse class="sombra" cx="300" cy="704" rx="122" ry="16" fill="#1f5a35"/>
            <g class="flota">
              <g transform="translate(79.8 303) scale(.43)">
            <path d="M273 320 H770 Q800 320 800 350 V870 Q800 898 772 898 H300 Q213 898 213 830 V382 Q213 320 273 320 Z" fill="#3584dc"/>
            <path d="M283 348 H770 V772 H300 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#7fc4fd"/>
            <path d="M283 348 H306 V772 H292 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#559de6"/>
            <path d="M244 772 H780" stroke="#3584dc" stroke-width="16" stroke-linecap="round"/>
            <rect x="246" y="800" width="504" height="68" rx="34" fill="#86c9fd"/>
            <path d="M312 800 H418 V920 L365 888 L312 920 Z" fill="#f96a5f"/>
            <path d="M323 262 L323 326 Q515 432 702 326 L702 262 Z" fill="#404451"/>
            <path d="M323 262 Q515 345 702 262 L702 302 Q515 386 323 302 Z" fill="#33372f" opacity=".0"/>
            <path d="M323 300 Q515 392 702 300 L702 326 Q515 432 323 326 Z" fill="#363a47"/>
            <polygon points="222,214 515,107 806,206 515,338" fill="#404451" stroke="#404451" stroke-width="16" stroke-linejoin="round"/>
            <g class="borla">
              <path d="M772 232 Q792 300 784 346" stroke="#404451" stroke-width="15" fill="none" stroke-linecap="round"/>
              <path d="M764 346 Q792 334 816 346 L824 462 Q790 474 754 466 Z" fill="#404451"/>
              <circle cx="790" cy="352" r="17" fill="#404451"/>
            </g>
            <ellipse class="ojo" cx="417" cy="542" rx="26" ry="29" fill="#404451"/>
            <ellipse class="ojo" cx="612" cy="541" rx="26" ry="29" fill="#404451"/>
            <path d="M458 604 Q518 664 578 604" stroke="#404451" stroke-width="16" fill="none" stroke-linecap="round"/></g>
            </g>
          </svg>
        </div>

        <!-- Contenido -->
        <section class="flex flex-col px-5 py-8 sm:px-10 lg:px-14 lg:py-9">
          <div class="flex items-center gap-3">
            <svg class="flex-none" width="40" height="40" viewBox="200 90 640 850" aria-hidden="true" focusable="false">
  <path d="M273 320 H770 Q800 320 800 350 V870 Q800 898 772 898 H300 Q213 898 213 830 V382 Q213 320 273 320 Z" fill="#3584dc"/>
  <path d="M283 348 H770 V772 H300 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#7fc4fd"/>
  <path d="M283 348 H306 V772 H292 Q242 772 242 725 V390 Q242 348 283 348 Z" fill="#559de6"/>
  <path d="M244 772 H780" stroke="#3584dc" stroke-width="16" stroke-linecap="round"/>
  <rect x="246" y="800" width="504" height="68" rx="34" fill="#86c9fd"/>
  <path d="M312 800 H418 V920 L365 888 L312 920 Z" fill="#f96a5f"/>
  <path d="M323 262 L323 326 Q515 432 702 326 L702 262 Z" fill="#404451"/>
  <path d="M323 262 Q515 345 702 262 L702 302 Q515 386 323 302 Z" fill="#33372f" opacity=".0"/>
  <path d="M323 300 Q515 392 702 300 L702 326 Q515 432 323 326 Z" fill="#363a47"/>
  <polygon points="222,214 515,107 806,206 515,338" fill="#404451" stroke="#404451" stroke-width="16" stroke-linejoin="round"/>
  <g class="">
    <path d="M772 232 Q792 300 784 346" stroke="#404451" stroke-width="15" fill="none" stroke-linecap="round"/>
    <path d="M764 346 Q792 334 816 346 L824 462 Q790 474 754 466 Z" fill="#404451"/>
    <circle cx="790" cy="352" r="17" fill="#404451"/>
  </g>
  <ellipse class="" cx="417" cy="542" rx="26" ry="29" fill="#404451"/>
  <ellipse class="" cx="612" cy="541" rx="26" ry="29" fill="#404451"/>
  <path d="M458 604 Q518 664 578 604" stroke="#404451" stroke-width="16" fill="none" stroke-linecap="round"/></svg>
            <span class="font-display font-semibold text-xl text-leo-tinta">Leo Perfecto</span>
          </div>

          <div class="my-auto py-5 max-w-xl">
            <h1 class="font-display font-semibold text-4xl sm:text-5xl leading-tight tracking-tight text-leo-tinta">
              Lee con calma. Entiende mejor.
            </h1>
            <p class="mt-4 text-lg leading-relaxed">
              Leo Perfecto es una aplicación para practicar la comprensión lectora, a tu ritmo y con un libro que te acompaña.
            </p>

            <ul class="mt-6 grid gap-2.5">
          <li class="lp-carta rounded-2xl p-3.5 flex items-start gap-4">
            <span class="flex-none w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-leo-azul"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5V5a2 2 0 012-2h13v15H6a2 2 0 00-2 2zm0 0A2 2 0 006 21h13v-3"/></svg></span>
            <div>
              <h2 class="font-display font-semibold text-lg text-leo-tinta">Para qué sirve</h2>
              <p class="mt-1 leading-snug">Practicar la comprensión lectora de forma tranquila y entretenida.</p>
            </div>
          </li>
          <li class="lp-carta rounded-2xl p-3.5 flex items-start gap-4">
            <span class="flex-none w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 text-leo-coral"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg></span>
            <div>
              <h2 class="font-display font-semibold text-lg text-leo-tinta">Nuestro objetivo</h2>
              <p class="mt-1 leading-snug">Que leer y entender lo leído sea más fácil para cada estudiante, a su propio ritmo.</p>
            </div>
          </li>
          <li class="lp-carta rounded-2xl p-3.5 flex items-start gap-4">
            <span class="flex-none w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-leo-hoja"><svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5a5 5 0 015 5"/></svg></span>
            <div>
              <h2 class="font-display font-semibold text-lg text-leo-tinta">Para quién es</h2>
              <p class="mt-1 leading-snug">Para estudiantes, por estudiantes.</p>
            </div>
          </li>
            </ul>

            <div class="mt-6 flex flex-col items-start gap-3">
              <button type="button" class="lp-btn w-full sm:w-auto whitespace-nowrap inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-display font-semibold text-lg" @click="$emit('entrar')">
                Entrar con mi cuenta
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <p class="text-sm text-leo-suave">Ingresas con tu cuenta de Google.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
// Fondo A (cielo continuo): se arma como imagen SVG para no depender de archivos externos.
const FONDO = "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201600%20900%22%20preserveAspectRatio%3D%22xMidYMax%20slice%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%220%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%22%20stop-color%3D%22%237cc9f3%22%2F%3E%3Cstop%20offset%3D%22.6%22%20stop-color%3D%22%23c6e9f9%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e9f7ee%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%221600%22%20height%3D%22900%22%20fill%3D%22url(%23g)%22%2F%3E%3Cg%20transform%3D%22translate(180%20150)%20scale(1.3)%22%20opacity%3D%220.9%22%3E%3Cg%20fill%3D%22%23ffffff%22%3E%3Crect%20x%3D%22-92%22%20y%3D%22-2%22%20width%3D%22190%22%20height%3D%2238%22%20rx%3D%2219%22%2F%3E%3Ccircle%20cx%3D%22-48%22%20cy%3D%222%22%20r%3D%2232%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%22-16%22%20r%3D%2244%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%22-2%22%20r%3D%2234%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(1330%20110)%20scale(1.1)%22%20opacity%3D%220.9%22%3E%3Cg%20fill%3D%22%23ffffff%22%3E%3Crect%20x%3D%22-92%22%20y%3D%22-2%22%20width%3D%22190%22%20height%3D%2238%22%20rx%3D%2219%22%2F%3E%3Ccircle%20cx%3D%22-48%22%20cy%3D%222%22%20r%3D%2232%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%22-16%22%20r%3D%2244%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%22-2%22%20r%3D%2234%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(1450%20420)%20scale(1.6)%22%20opacity%3D%220.8%22%3E%3Cg%20fill%3D%22%23ffffff%22%3E%3Crect%20x%3D%22-92%22%20y%3D%22-2%22%20width%3D%22190%22%20height%3D%2238%22%20rx%3D%2219%22%2F%3E%3Ccircle%20cx%3D%22-48%22%20cy%3D%222%22%20r%3D%2232%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%22-16%22%20r%3D%2244%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%22-2%22%20r%3D%2234%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(90%20520)%20scale(1.2)%22%20opacity%3D%220.8%22%3E%3Cg%20fill%3D%22%23ffffff%22%3E%3Crect%20x%3D%22-92%22%20y%3D%22-2%22%20width%3D%22190%22%20height%3D%2238%22%20rx%3D%2219%22%2F%3E%3Ccircle%20cx%3D%22-48%22%20cy%3D%222%22%20r%3D%2232%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%22-16%22%20r%3D%2244%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%22-2%22%20r%3D%2234%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(780%2060)%20scale(0.8)%22%20opacity%3D%220.7%22%3E%3Cg%20fill%3D%22%23ffffff%22%3E%3Crect%20x%3D%22-92%22%20y%3D%22-2%22%20width%3D%22190%22%20height%3D%2238%22%20rx%3D%2219%22%2F%3E%3Ccircle%20cx%3D%22-48%22%20cy%3D%222%22%20r%3D%2232%22%2F%3E%3Ccircle%20cx%3D%222%22%20cy%3D%22-16%22%20r%3D%2244%22%2F%3E%3Ccircle%20cx%3D%2252%22%20cy%3D%22-2%22%20r%3D%2234%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cpath%20d%3D%22M0%20760%20C250%20690%20480%20700%20700%20740%20C950%20785%201200%20690%201600%20730%20L1600%20900%20L0%20900Z%22%20fill%3D%22%23a8dcae%22%2F%3E%3Cpath%20d%3D%22M0%20820%20C300%20770%20620%20800%20900%20830%20C1180%20855%201400%20800%201600%20815%20L1600%20900%20L0%20900Z%22%20fill%3D%22%237ccb86%22%2F%3E%3C%2Fsvg%3E\")"

export default {
  name: 'PantallaLanding',
  emits: ['entrar'],
  data() {
    return { fondo: FONDO }
  }
}
</script>

<style scoped>
.lp-raiz {
  --tinta: #14233b;
  --azul: #2568c4;
  --azul-osc: #1b4f9e;
  color: #3a4960;
  background-color: #bfe6f8;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
}
h1, h2, h3 { text-wrap: balance; }

.lp-tarjeta { min-height: min(720px, calc(100vh - 3rem)); }
@media (max-width: 767px) { .lp-tarjeta { min-height: 100vh; min-height: 100dvh; } }

.lp-carta { border: 1px solid #d9e4f1; background: #fff; }

/* Botón con relieve: baja al presionarlo */
.lp-btn {
  background: var(--azul);
  border-bottom: 4px solid var(--azul-osc);
  transition: transform .1s ease, border-bottom-width .1s ease, filter .15s ease;
  cursor: pointer;
}
.lp-btn:hover { filter: brightness(1.08); }
.lp-btn:active { transform: translateY(3px); border-bottom-width: 1px; }
.lp-btn:focus, .lp-btn:focus-visible { outline: 3px solid var(--tinta); outline-offset: 3px; }

/* Escena: solo el libro se mueve con intención; el resto es ambiente y muy lento */
.flota { animation: flota 5s ease-in-out infinite; transform-origin: 300px 690px; }
.sombra { animation: sombra 5s ease-in-out infinite; transform-origin: 300px 704px; }
.ojo { transform-box: fill-box; transform-origin: center; animation: parpadeo 6s ease-in-out infinite; }
.borla { animation: borla 4s ease-in-out infinite; transform-origin: 772px 238px; }
.nube { animation: deriva var(--t, 60s) ease-in-out infinite alternate; animation-delay: var(--d, 0s); }
.copa { animation: brisa 7s ease-in-out infinite; transform-origin: 0 0; animation-delay: var(--d, 0s); }

@keyframes flota {
  0%, 100% { transform: translateY(0) rotate(-1.2deg); }
  50% { transform: translateY(-12px) rotate(1.2deg); }
}
@keyframes sombra {
  0%, 100% { transform: scaleX(1); opacity: .30; }
  50% { transform: scaleX(.88); opacity: .20; }
}
@keyframes parpadeo {
  0%, 94%, 100% { transform: scaleY(1); }
  97% { transform: scaleY(.08); }
}
@keyframes borla {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(6deg); }
}
@keyframes deriva {
  from { transform: translateX(calc(var(--dx, 60px) * -1)); }
  to { transform: translateX(var(--dx, 60px)); }
}
@keyframes brisa {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1.2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .flota, .sombra, .ojo, .borla, .nube, .copa, .lp-btn { animation: none !important; transition: none !important; }
}
</style>
