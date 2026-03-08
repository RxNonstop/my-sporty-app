/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "rgba(0, 122, 255, 0.12)",
        secondary: "rgba(0, 122, 255, 0.25)",
        terniary: "rgba(0, 122, 255, 0.75)",
        fourty: "rgba(0, 122, 255, 0.5)",
        green: "#1f9b26",
        red: "#e60000",
      },
    },
  },
  plugins: [],
  darkMode: "class",
  darkColor: {
    primary: "rgba(0, 122, 255, 0.25)",
    secondary: "rgba(0, 122, 255, 0.75)",
    terniary: "rgba(0, 122, 255, 0.12)",
    fourty: "rgba(0, 122, 255, 0.5)",
  },
};
