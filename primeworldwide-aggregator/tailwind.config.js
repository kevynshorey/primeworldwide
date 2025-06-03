/**
 * tailwind.config.js
 *
 * Configures Tailwind to scan all page and component files.
 * Extends the color palette for Barbados-themed accents.
 */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          800: "#005f5f",
        },
        darkblue: "#001f3f",
        charcoal: "#264653",
      },
    },
  },
  plugins: [],
};