/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#ffffff',
          'bg-secondary': '#f7f9fc',
          'bg-tertiary': '#edf2f7',
          'bg-message': '#f0f4f8',
          border: '#e2e8f0',
          'border-hover': '#cbd5e1',
          text: '#1e293b',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8',
          accent: '#10b981',
          'accent-hover': '#34d399',
          success: '#10b981',
          error: '#ef4444',
          user: '#10b981',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};