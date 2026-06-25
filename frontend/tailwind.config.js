/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#1DB954',
            light: '#1ed760',
            dark: '#1aa34a',
          },
          black: '#000000',
          surface: '#121212',
          surfaceCard: '#181818',
          surfaceHover: '#282828',
          border: '#2a2a2a',
          textMuted: '#b3b3b3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(29, 185, 84, 0.35)',
        'glow-green-lg': '0 0 25px rgba(29, 185, 84, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
