/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark slate UI palette with a single cyan accent.
        ink: {
          900: '#0b0f17',
          800: '#0f1623',
          700: '#161f30',
          600: '#1e293b',
          500: '#334155',
          400: '#475569',
        },
        accent: {
          DEFAULT: '#22d3ee', // cyan-400
          dim: '#0e7490',
          glow: '#67e8f9',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(34,211,238,0.4), 0 0 24px -4px rgba(34,211,238,0.45)',
      },
    },
  },
  plugins: [],
}
