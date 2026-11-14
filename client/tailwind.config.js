/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tj: {
          canvas: '#F7F5F0',
          card: '#FFFFFF',
          hover: '#EFECE6',
          sidebar: '#F2EFE9',
          charcoal: '#141413',
          slate: '#5C5A55',
          grey: '#7A7A7A',
          muted: '#9E9B95',
          hairline: '#E4E0D8',
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
        DEFAULT: '2px',
        sm: '2px',
        md: '3px',
        lg: '4px'
      }
    },
  },
  plugins: [],
};
