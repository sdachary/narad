/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          border: '#30363d',
          text: '#e6edf3',
          'text-secondary': '#8b949e',
          'text-muted': '#6e7681',
          accent: '#58a6ff',
          'accent-hover': '#79c0ff',
          success: '#3fb950',
          error: '#f85149',
          user: '#238636',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};