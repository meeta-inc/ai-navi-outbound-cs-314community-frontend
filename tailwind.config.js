/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navi: {
          orange: {
            main: '#F57C00',
            sub1: '#FFB74D',
            sub2: '#FFE0B2',
          },
          blue: {
            main: '#2563EB',
            sub1: '#60A5FA',
            sub2: '#DBEAFE',
          },
          green: {
            main: '#22C55E',
            sub1: '#68E26B',
            sub2: '#BBF7D0',
          },
          red: {
            main: '#EF4444',
            sub1: '#FB7185',
            sub2: '#FECACA',
          },
          purple: {
            main: '#8B5CF6',
            sub1: '#C4B5FD',
            sub2: '#EDE9FE',
          },
          white: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
