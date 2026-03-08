/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 境界色系
        'realm-lianqi': '#00D4AA',
        'realm-zhuji': '#4A90E2',
        'realm-jindan': '#FDCB6E',
        'realm-yuanying': '#9B59B6',
        'realm-huashen': '#E74C3C',
        'realm-dujie': '#FFFFFF',
        'realm-dacheng': '#FFD700',
        // 基础色
        'xiuxian-bg': 'rgba(20, 20, 30, 0.90)',
        'xiuxian-border': 'rgba(255, 255, 255, 0.15)',
        'xiuxian-text': '#FFFFFF',
        'xiuxian-muted': 'rgba(255, 255, 255, 0.6)',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glow-spin': 'glow-spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'realm-aura': 'realm-aura 3s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            opacity: '0.8'
          },
          '50%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '1'
          },
        },
        'glow-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'breathing': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
        },
        'realm-aura': {
          '0%, 100%': { 
            filter: 'brightness(1) drop-shadow(0 0 5px currentColor)',
          },
          '50%': { 
            filter: 'brightness(1.2) drop-shadow(0 0 15px currentColor)',
          },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 5px currentColor',
        'glow-md': '0 0 10px currentColor, 0 0 20px currentColor',
        'glow-lg': '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
      },
    },
  },
  plugins: [],
}
