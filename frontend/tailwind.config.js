/** @type {import('tailwindcss').Config} */

import scrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1da1f2',
      },
    },
  },
  plugins: [
    scrollbarHide
  ],
}
