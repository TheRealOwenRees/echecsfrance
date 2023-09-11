/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
      },
      minHeight: {
        // We use 100svh, falling back to the the --1svh var that we add as a polyfill for older browsers.
        // The 9rem is for the header and footer.
        // In the event that the polyfill fails, we fall back to 0.9vh as a guess of how much 1svh is.
        content: [
          "calc(var(--1svh, 0.9vh) * 100 - 9rem)",
          "calc(100svh - 9rem)",
        ],
      },
      height: {
        content: [
          "calc(var(--1svh, 0.9vh) * 100 - 9rem)",
          "calc(100svh - 9rem)",
        ],
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss"), require("@tailwindcss/forms")],
};
