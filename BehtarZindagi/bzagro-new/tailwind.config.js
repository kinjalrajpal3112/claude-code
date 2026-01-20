/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BZ Brand Colors
        bz: {
          primary: '#059669',      // Main Green
          'primary-dark': '#047857',
          'primary-light': '#d1fae5',
          secondary: '#f59e0b',    // Orange/Accent
          'secondary-dark': '#d97706',
          'secondary-light': '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
