/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        cream: '#F5F0E8',
        ink: '#1A1A1A',
        orange: '#FF6B35',
        teal: '#00D4AA',
        yellow: '#FFD60A',
      },
    },
  },
  plugins: [],
};
