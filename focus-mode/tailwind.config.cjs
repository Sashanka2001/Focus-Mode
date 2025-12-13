/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
        },
        success: {
          DEFAULT: "#16a34a",
          dark: "#15803d",
        },
        danger: {
          DEFAULT: "#dc2626",
          dark: "#b91c1c",
        },
      },
      boxShadow: {
        card: "0 20px 45px -35px rgba(15, 23, 42, 0.6)",
      },
    },
  },
  plugins: [],
};
