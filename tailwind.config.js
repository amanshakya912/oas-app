/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'lora-bold': ['Lora-Bold', 'serif'],
        'lora-medium': ['Lora-Medium', 'serif'],
        'lora-semibold': ['Lora-SemiBold', 'serif']
      },
      colors: {
        'brown': '#A27B5C',
        'light-dark': '#242628'
      }
    },
  },
  plugins: [],
}