/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#C2410C', dark: '#9A3412' },
        ink: '#1F1F1D',
        muted: '#4A4A46',
        soft: '#5E5E59',
        line: '#CFCFCB',
        canvas: '#F7F7F5',
        ph: '#E6E6E2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(31,31,29,.28)',
      },
    },
  },
  plugins: [],
};
