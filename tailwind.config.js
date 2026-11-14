/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf3',
          100: '#d7fae2',
          200: '#b2f4c6',
          300: '#7deb9f',
          400: '#41d973',
          500: '#16e66b', // Primary Electric Green
          600: '#0ebd55',
          700: '#0b9444',
          800: '#0e7438',
          900: '#0e5f31',
          950: '#023518',
        },
        surface: {
          light: '#ffffff',
          'light-subtle': '#f9fafb',
          'light-card': '#ffffff',
          'light-border': '#e5e7eb',
          dark: '#0e1511',
          'dark-subtle': '#141a15',
          'dark-card': '#1a211d',
          'dark-border': '#242c27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'electric': '0 0 20px -2px rgba(22, 230, 107, 0.4)',
        'electric-lg': '0 0 35px -5px rgba(22, 230, 107, 0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
