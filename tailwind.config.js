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
        pageBg: '#ffffff',  // white background
        textPrimary: '#1f2937', // gray-800
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2563EB",           // Tailwind blue-600
          "primary-content": "#ffffff",   // Text color on primary backgrounds
        },
      },
    ],
  },
}
