/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tj: {
          canvas: '#F7F5F0',
          canvasDark: '#141413',
          card: '#FFFFFF',
          cardDark: '#1E1E1D',
          charcoal: '#141413',
          slate: '#5C5A55',
          grey: '#7A7A7A',
          muted: '#9E9B95',
          hairline: '#E4E0D8',
          hairlineDark: 'rgba(255, 255, 255, 0.12)',
          purple: '#A459FF',
          purpleTint: '#F1E8FF',
          emerald: '#2D8A78',
          emeraldTint: '#E3F2EE',
          terracotta: '#D8753D',
          blue: '#365F7C',
          blueFog: '#F1F3F6'
        }
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Arial', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        xl: '8px'
      }
    },
  },
  plugins: [],
};
