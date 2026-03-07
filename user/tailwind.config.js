/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          coral: '#113e2f',
        },
        neutral: {
          charcoal: '#222222',
          'dark-gray': '#484848',
          'medium-gray': '#717171',
          'light-gray': '#e8d8c3',
          'border-gray': '#d4c4b3',
          white: '#FFFFFF',
        },
        beige: '#e8d8c3',
        'beige-light': '#f5efe6',
        accent: {
          teal: '#2d6b5a',
        },
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body': ['15px', { lineHeight: '22px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
      },
    },
  },
  plugins: [],
}
