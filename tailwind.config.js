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
      height: {
        // We use 100svh, falling back to vh for old browsers
        // The 144px is for the header and footer
        content: ['calc(100vh - 144px)', 'calc(100svh - 144px)'],
      }
    }
  },
  plugins: [],
};
