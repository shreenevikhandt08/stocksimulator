/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070b12",
          900: "#0c121c",
          800: "#121a28",
          700: "#1a2436",
          600: "#243044",
        },
        line: "#1e2c40",
        mist: "#8b9bb4",
        paper: "#e8eef7",
        gain: "#3ddeb3",
        loss: "#f07178",
        gold: "#d4a84b",
        sky: "#6aa6d6",
        lilac: "#9b8cff",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};
