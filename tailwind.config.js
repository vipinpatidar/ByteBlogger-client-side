/** @type {import('tailwindcss').Config} */

import { createThemes } from "tw-colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      sm: "12px",
      base: "14px",
      xl: "16px",
      "2xl": "20px",
      "3xl": "28px",
      "4xl": "38px",
      "5xl": "50px",
    },

    extend: {
      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"],
      },
    },
  },
  plugins: [
    createThemes({
      light: {
        white: "#FFFFFF",
        black: "#242424",
        grey: "#F3F3F3",
        gray: "#eee",
        "dark-grey": "#6B6B6B",
        red: "#FF4E4E",
        transparent: "transparent",
        twitter: "#1DA1F2",
        purple: "#8B46FF",
      },
      dark: {
        white: "#101524",
        black: "#f6e7db",
        grey: "#1d2439",
        gray: "#1d2439",
        "dark-grey": "#c1c4cf",
        red: "#FF4E4E",
        transparent: "transparent",
        twitter: "#0E71AB",
        purple: "#582CBE",
      },
    }),
  ],
};
