/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#1B4332',    // Primary Base (Sage Forest)
          emerald: '#2D6A4F',   // Primary Accent (Deep Emerald)
          mint: '#059669',      // Primary Action (Refined Mint)
          obsidian: '#081C15',  // Deep Anchor (Obsidian Teal)
          amber: '#D97706',     // Warm Accent (Warm Amber)
          card: '#102B21',      // Dark Card Surface
        },
        surface: {
          app: '#FAFBF9',       // Light App Background
          card: '#FFFFFF',      // Pure White Card
          hover: '#F3F6F2',     // Hover state
          border: '#E5E9E2',    // 1px Border
        },
        text: {
          primary: '#0F172A',   // Slate 900
          secondary: '#475569', // Slate 600
          muted: '#94A3B8',     // Slate 400
        },
        primary: {
          DEFAULT: '#1B4332',
          accent: '#2D6A4F',
          action: '#059669',
          dark: '#081C15',
        },
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      transitionTimingFunction: {
        'calm': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'calm': '180ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slide-up 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}