/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#4F46E5',
        secondary: '#06B6D4',
        accent: '#22C55E',
        surface: '#F8FAFC',
        text: {
          primary: '#0F172A',
          secondary: '#64748B',
        }
      },
    },
  },
  plugins: [],
}
