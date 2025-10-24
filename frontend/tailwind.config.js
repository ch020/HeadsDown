/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#f3f6ff", 100:"#e6edff", 200:"#c7d7ff", 300:"#a8c1ff",
          400:"#7da0ff", 500:"#4f7bff", 600:"#2b5dff", 700:"#1f48cc",
          800:"#173699", 900:"#102566"
        }
      }
    }
  },
  plugins: []
}
