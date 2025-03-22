/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: '#4285f4',
        twitter: '#1DA1F2',
        github: '#24292e',
        microsoft: '#2f2f2f',
      },
    },
  },
  plugins: [],
} 