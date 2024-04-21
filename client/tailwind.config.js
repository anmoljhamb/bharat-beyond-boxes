/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "rgba(243, 83, 44, 1)",
          light: "rgba(253, 166, 103, 0.6)",
        },
      },
    },
  },
  plugins: [],
};
