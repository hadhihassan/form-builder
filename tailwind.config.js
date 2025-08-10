/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Or 'Inter'
      },
      colors: {
        // Backgrounds
        'primary-bg': '#0f172a', // slate-950
        'glow-pink': 'rgba(255, 0, 182, 0.15)',
        'glow-cyan': 'rgba(0, 255, 255, 0.15)',

        // Text
        'text-main': '#ffffff',
        'text-body': '#e2e8f0', // slate-200
        'text-muted': '#94a3b8', // slate-400
        'text-accent': '#f472b6', // pink-400

        // Buttons
        'btn-primary': '#ec4899', // pink-500
        'btn-primary-hover': '#f472b6', // pink-400
        'btn-secondary': '#1e293b', // slate-800
        'btn-secondary-hover': '#334155', // slate-700
      },
    },
  },
  plugins: [],
}

