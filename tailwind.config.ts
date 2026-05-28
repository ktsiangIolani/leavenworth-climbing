import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#FEF0F2',
          100: '#FCCDD5',
          200: '#F99BAB',
          300: '#F46881',
          400: '#EE4C64',
          500: '#E84A5F',
          600: '#D43A50',
          700: '#BE2B41',
          800: '#9C1E30',
          900: '#7D1325',
        },
        surface: {
          DEFAULT: '#FDF8F5',
          secondary: '#F6EDE4',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover':  '0 4px 12px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.06)',
        'card-press':  '0 1px 2px rgba(0,0,0,0.06)',
        'bottom-nav':  '0 -1px 0 rgba(0,0,0,0.06), 0 -4px 20px rgba(0,0,0,0.04)',
        'modal':       '0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
        'fab':         '0 4px 16px rgba(232,74,95,0.35)',
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl':   '24px',
        '4xl':   '32px',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'shimmer':    'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:  { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config
