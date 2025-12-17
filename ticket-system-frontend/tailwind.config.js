// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f94f2f",
        secondary: "#5D5D5D",
        myred: "#BE300A",
      },
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
        playwrite: ['"Playwrite US Trad"', "cursive"],
        monoto: ['"Monoton"', 'Helvetica', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],

}
