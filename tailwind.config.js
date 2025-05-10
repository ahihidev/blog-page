/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F00',
        primary_10: '#FF5480',
        primary_15: '#4A4A4A',
        primary_20: '#9B9B9B',
        primary_25: '#111210',
        bg_primary: '#f9f9fb',
        btn_primary: '#9283E0',
        bd_primary: '#e0e0e0'
      }
    },
  },
  plugins: [],
}

