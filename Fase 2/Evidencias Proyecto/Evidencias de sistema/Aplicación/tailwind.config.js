/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leo: {
          tinta: '#14233b',
          texto: '#3a4960',
          suave: '#52627a',
          azul: '#2568c4',
          'azul-osc': '#1b4f9e',
          cielo: '#e4f0fb',
          papel: '#fbfcfe',
          linea: '#d9e4f1',
          coral: '#c2382d',
          hoja: '#1f7a47',
          // UI-05: fondo de las pantallas con menú (celeste plano, elegido en el mockup).
          // Contraste: texto suave #52627a sobre este fondo = 5,39:1 (cumple AA).
          fondo: '#e7f0fa',
        },
      },
      fontFamily: {
        display: ['Lexend', 'system-ui', 'sans-serif'],
        cuerpo: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
