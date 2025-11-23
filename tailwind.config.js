/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./*.{html,js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        "highcharts-core-vikafjell-colors-general-axistitles":
          "var(--highcharts-core-vikafjell-colors-general-axistitles)",
        "highcharts-core-vikafjell-colors-general-background":
          "var(--highcharts-core-vikafjell-colors-general-background)",
        "highcharts-core-vikafjell-colors-general-grid":
          "var(--highcharts-core-vikafjell-colors-general-grid)",
        "highcharts-core-vikafjell-colors-general-labels":
          "var(--highcharts-core-vikafjell-colors-general-labels)",
        "highcharts-core-vikafjell-colors-general-pane":
          "var(--highcharts-core-vikafjell-colors-general-pane)",
        "highcharts-core-vikafjell-colors-general-subtitle":
          "var(--highcharts-core-vikafjell-colors-general-subtitle)",
        "highcharts-core-vikafjell-colors-general-title":
          "var(--highcharts-core-vikafjell-colors-general-title)",
        "highcharts-core-vikafjell-colors-series-0":
          "var(--highcharts-core-vikafjell-colors-series-0)",
        "highcharts-core-vikafjell-colors-series-1":
          "var(--highcharts-core-vikafjell-colors-series-1)",
        "highcharts-core-vikafjell-colors-series-2":
          "var(--highcharts-core-vikafjell-colors-series-2)",
        "highcharts-core-vikafjell-colors-series-3":
          "var(--highcharts-core-vikafjell-colors-series-3)",
        "highcharts-core-vikafjell-colors-series-4":
          "var(--highcharts-core-vikafjell-colors-series-4)",
        "highcharts-core-vikafjell-colors-series-5":
          "var(--highcharts-core-vikafjell-colors-series-5)",
        "highcharts-core-vikafjell-colors-series-6":
          "var(--highcharts-core-vikafjell-colors-series-6)",
        "highcharts-core-vikafjell-colors-series-7":
          "var(--highcharts-core-vikafjell-colors-series-7)",
        "highcharts-core-vikafjell-colors-series-8":
          "var(--highcharts-core-vikafjell-colors-series-8)",
        "highcharts-core-vikafjell-colors-series-9":
          "var(--highcharts-core-vikafjell-colors-series-9)",
      },
      fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
