/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------------
        // "Wind-tunnel datasheet" — a LIGHT theme. White paper, hairline rules,
        // graphite text, one deep-teal instrument accent.
        //
        // `ink` is the SURFACE ramp (white → slightly-tinted). 900 = pure white,
        // lower numbers = more tint. (Class names read dark→light as before.)
        ink: {
          900: '#ffffff', // page / primary background (white)
          800: '#f7f9fb', // faint panel tint
          700: '#eef1f5', // buttons, table headers
          600: '#e3e7ee', // hairline rules / borders
          500: '#cdd5df', // stronger borders, slider track
          400: '#9aa3b1', // faint placeholder glyphs
        },
        // `slate` is overridden as the TEXT ramp and is INTENTIONALLY INVERTED:
        // 100 = darkest (headings) … 600 = lightest (faint captions). This lets
        // the existing `text-slate-100..600` usage flip to a light theme with no
        // per-component churn — low number = strong text, exactly as before.
        slate: {
          100: '#0e1320', // strongest text / headings
          200: '#1a2130', // primary text
          300: '#2c3543', // body copy
          400: '#586273', // secondary / muted
          500: '#7b8698', // captions
          600: '#98a2b3', // faintest
        },
        accent: {
          DEFAULT: '#0e7490', // deep teal — readable on white (AA)
          dim: '#22a5b8', // lighter teal (gradient start)
          glow: '#0b5e6e', // darkest teal — emphasized numerics
        },
      },
      fontFamily: {
        // Space Grotesk carries the headings (technical, characterful); Inter
        // does the reading; JetBrains Mono is the datasheet through-line.
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        // crisp teal hairline ring + soft drop — reads as "selected instrument"
        glow: '0 0 0 1px rgba(14,116,144,0.30), 0 10px 30px -14px rgba(15,23,42,0.22)',
        card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -16px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
}
