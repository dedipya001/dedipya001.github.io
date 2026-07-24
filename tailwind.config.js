/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#050816',
        bgSec: '#0A0816',
        neuralPurple: '#8B5CF6',
        neuralViolet: '#A855F7',
        neuralMagenta: '#EC4899',
        warmLavender: '#C084FC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'neural-glow': '0 0 20px rgba(139, 92, 246, 0.2)',
        'plasma-glow': '0 0 20px rgba(236, 72, 153, 0.2)',
      }
    },
  },
  plugins: [],
}
