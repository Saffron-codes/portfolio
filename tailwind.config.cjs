const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      // Warm lo-fi palette shared by the plain view and the desk scene.
      colors: {
        cream: "#F7F1E6",
        ink: "#2B2521",
        wood: { 300: "#C9A27A", 500: "#A0734A", 700: "#6E4A2E" },
        sage: { 300: "#A9CBBF", 400: "#7FA89A", 500: "#5F9385", 600: "#4F7F72", 700: "#3D6459" },
        lamp: "#F2B45A",
        night: { 700: "#262E45", 800: "#1C2233", 900: "#121726" },
      },
    },
  },
  plugins: [],
};
