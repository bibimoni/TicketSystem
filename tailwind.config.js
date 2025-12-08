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
        secondary: "#5d5c5c"
      },
      fontFamily: {
        montserrat: ['"Montserrat"', "sans-serif"],
        playwrite: ['"Playwrite US Trad"', "cursive"],
        monoto: ['"Monoton"', 'Helvetica', 'sans-serif'], 
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],

}
