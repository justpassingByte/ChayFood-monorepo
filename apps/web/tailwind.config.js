/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#1B4332',
          emerald: '#2D6A4F',
          mint: '#059669',
          obsidian: '#081C15',
          amber: '#D97706',
          card: '#102B21',
        },
        surface: {
          app: '#FAFBF9',
          card: '#FFFFFF',
          hover: '#F3F6F2',
          border: '#E5E9E2',
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
    },
  },
  plugins: [],
}