/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../**/*.html',
    '../static/js/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Anonymous Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 