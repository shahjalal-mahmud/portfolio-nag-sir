// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        // Optional: define your main background color as a custom color if you want
        pageBg: '#ffffff',  // white background
        textPrimary: '#1f2937', // gray-800 from Tailwind for text
      }
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // disable DaisyUI themes, because you want just one fixed theme
  }
}
