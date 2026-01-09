import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: ["Tahoma", "Verdana", "Arial", "sans-serif"],
      },
      colors: {
        retroGray: "#C0C0C0",
        retroDarkGray: "#808080",
        retroLightGray: "#E0E0E0",
        retroWhite: "#FFFFFF",
        retroBlue: "#000080",
      },
    },
  },
  plugins: [],
};

export default config;
