/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C94A',
          dark: '#B8960C',
          muted: 'rgba(212, 175, 55, 0.15)',
        },
        bg: {
          primary: '#111111',
          secondary: '#1A1A1A',
          card: '#1E1E1E',
        },
        text: {
          primary: '#FFFFFF',
          muted: '#A0A0A0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #E8C94A, #B8960C)',
        'dark-gradient': 'linear-gradient(135deg, #111111, #1A1A1A, #0D0D0D)',
        'cinematic': 'radial-gradient(ellipse at top, #1a1200 0%, #111111 50%, #0a0a0a 100%)',
      },
      animation: {
        'shine': 'shine 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.8)' },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.4)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.6)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
