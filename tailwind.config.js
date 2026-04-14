/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bauhaus-red': '#D02020',
        'bauhaus-blue': '#1040C0',
        'bauhaus-yellow': '#F0C020',
        'bauhaus-white': '#F0F0F0',
        'bauhaus-black': '#121212',
        // Functional mappings
        'background-day': '#F0F0F0',
        'background-night': '#121212',
        'foreground-day': '#121212',
        'foreground-night': '#F0F0F0',
      },
      fontFamily: {
        headline: ['Outfit', 'sans-serif'],
        body: ['Outfit', 'sans-serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      borderWidth: {
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      boxShadow: {
        'bauhaus-sm': '4px 4px 0px 0px #121212',
        'bauhaus-md': '6px 6px 0px 0px #121212',
        'bauhaus-lg': '8px 8px 0px 0px #121212',
        // Night shadows
        'bauhaus-night-sm': '4px 4px 0px 0px #F0F0F0',
        'bauhaus-night-md': '6px 6px 0px 0px #F0F0F0',
        'bauhaus-night-lg': '8px 8px 0px 0px #F0F0F0',
      },
      animation: {
        'bauhaus-snappy': 'snappy 0.2s ease-out forwards',
      },
      keyframes: {
        snappy: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};