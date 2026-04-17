/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          base: '#002B36',
          slate: '#4A5459',
          light: '#FDF6E3',
          cyan: '#21B8CC',
          green: '#4ECC21',
          gold: '#CC9B21',
          burgundy: '#A63D40',
        }
      },
      fontFamily: {
        sans: ['"Segoe UI Semilight"', '"Segoe UI"', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: { '3xl': '1.5rem', '4xl': '2rem' }
    }
  },
  plugins: [],
}
