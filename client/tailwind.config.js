/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "rgba(243, 83, 44, 1)",
          light: "rgba(253, 166, 103, 0.6)",
          secondary: "rgba(237, 94, 59, 1)",
        },
      },
      backgroundImage: {
        grad1:
          "linear-gradient(45deg, rgba(241, 72, 0, 0.6), rgba(253, 166, 103, 0.6))",
      },
    },
  },
  plugins: [],
};
