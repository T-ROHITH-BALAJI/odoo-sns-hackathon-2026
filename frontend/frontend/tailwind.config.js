/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#F26C4F",
        "primary-hover": "#E86343",
        "background-light": "#FDFBF7",
        "background-dark": "#18181b",
        "surface-light": "#FFFFFF",
        "surface-dark": "#27272a",
        "text-main-light": "#2D2D2D",
        "text-main-dark": "#F4F4F5",
        "text-muted-light": "#6B7280",
        "text-muted-dark": "#A1A1AA",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
