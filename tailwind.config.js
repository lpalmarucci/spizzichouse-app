import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        toastIn: "toastIn .5s both",
        toastOut: "toastOut .5s both",
      },
      keyframes: {
        toastIn: {
          "0%": {
            transform: "translate(2000px) scale(0.7)",
            opacity: 0.7,
          },
          "80%": { transform: "translate(0px) scale(0.7)", opacity: 0.7 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        toastOut: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "20%": { transform: "translate(0px) scale(0.7)", opacity: 0.7 },
          "100%": {
            transform: "translate(2000px) scale(0.7)",
            opacity: 0.7,
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      prefix: "spizzi",
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {}, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            background: "#121212",
            colors: {
              primary: {
                DEFAULT: "#BEF264",
                foreground: "#000000",
              },
              focus: "#BEF264",
            },
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ],
};
