import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0E12',
        card: '#17171D',
        primary: '#5A31F4',
        accent: '#34D399',
        text: '#F8F9FA',
        border: '#2D2D35',
        muted: '#9CA3AF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 8px 24px rgba(0, 0, 0, 0.35)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse': 'pulse 4s ease-in-out infinite',
        'gradient': 'gradient 8s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

export default config
