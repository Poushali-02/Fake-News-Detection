/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      zIndex: {
        '-10': '-10',
      },
    },
  },
  plugins: [],
};
