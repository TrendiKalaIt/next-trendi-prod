/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  [
    // Make sure these paths correctly point to your components and pages
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
     extend: {
      fontFamily: {
        home: ['Libre Baskerville', 'serif'],
        heading: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
        
      },
      colors: {
        luxuryGold: '#C5A880', // optional gold accent
      },
    },
  },
  plugins: [],
}

