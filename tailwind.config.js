/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        title: ["var(--font-title)"],
      },
      colors: {
        primary: {
          DEFAULT: "#0086C7",
          50: "#A8E3FF",
          100: "#94DCFF",
          200: "#6BCFFF",
          300: "#42C1FF",
          400: "#1AB4FF",
          500: "#00A1F0",
          600: "#0086C7",
          700: "#00608F",
          800: "#003A57",
          900: "#00151F",
          950: "#000203",
        },
        success: "#00ac39",
        error: "#ea5f17",

        classic: "#00ac39",
        rapid: "#0086c7",
        blitz: "#ddce20",
        other: "#ea5f17",
      },
      minHeight: {
        // We use 100svh, falling back to the the --1svh var that we add as a polyfill for older browsers.
        // The 7rem is for the header and footer.
        // In the event that the polyfill fails, we fall back to 0.9vh as a guess of how much 1svh is.
        content: [
          "calc(var(--1svh, 0.9vh) * 100 - 7rem)",
          "calc(100svh - 7rem)",
        ],
      },
      height: {
        content: [
          "calc(var(--1svh, 0.9vh) * 100 - 7rem)",
          "calc(100svh - 7rem)",
        ],
      },
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
