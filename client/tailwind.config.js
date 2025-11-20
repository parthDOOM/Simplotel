/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-paper': '#F5F5F0',
        'deep-charcoal': '#333333',
        'slate-grey': '#64748B',
        'intl-orange': '#FF4F00',
        'matcha-green': '#10B981',
        'muted-red': '#EF4444',
        'greige': '#F5F5F0'
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
