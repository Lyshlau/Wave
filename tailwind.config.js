/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F0E8",
          dark: "#EBE4D8",
        },
        sage: {
          DEFAULT: "#7A8B6E",
          light: "#9AAD8C",
          dark: "#5E6D54",
        },
        olive: {
          DEFAULT: "#4A5240",
          deep: "#2C3228",
          muted: "#5C6554",
        },
        sand: {
          DEFAULT: "#D4C4A8",
          light: "#E8DCC8",
          dark: "#B8A88C",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Cormorant Garamond",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};
