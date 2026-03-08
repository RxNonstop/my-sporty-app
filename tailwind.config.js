/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgba(0, 122, 255, 0.12)",
        secondary: "rgba(0, 122, 255, 0.25)",
      },
    },
  },
  plugins: [],
  darkMode: "class",
  darkColor: {
    primary: "rgba(0, 122, 255, 0.25)",
    secondary: "rgba(0, 122, 255, 0.75)",
  },
};
