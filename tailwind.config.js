/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // ✅ DaisyUI plugin
  daisyui: {
    themes: ["light", "dark"], // চাইলে customize করতে পারো
  },
}
