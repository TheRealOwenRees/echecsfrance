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
      colors: {
        'primary': {
          DEFAULT: '#0086C7',
          50: '#A8E3FF',
          100: '#94DCFF',
          200: '#6BCFFF',
          300: '#42C1FF',
          400: '#1AB4FF',
          500: '#00A1F0',
          600: '#0086C7',
          700: '#00608F',
          800: '#003A57',
          900: '#00151F',
          950: '#000203'
        },
      },
      minHeight: {
        // We use 100svh, falling back to vh for old browsers
        // The 144px is for the header and footer
        content: ["calc(100vh - 144px)", "calc(100svh - 144px)"],
      },
      height: {
        content: ["calc(100vh - 144px)", "calc(100svh - 144px)"],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
