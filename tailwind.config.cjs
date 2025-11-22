/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graphite: '#0b0d10',
        charcoal: '#12151a',
        slate: '#1b1f27',
        accent: '#7ae582',
        accentMuted: '#5ecf6b',
        muted: '#6b7280',
      },
      boxShadow: {
        glass: '0 12px 40px rgba(0,0,0,0.25)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
