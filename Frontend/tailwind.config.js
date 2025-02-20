/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "2xl": "1536px", // Custom breakpoint
        "3xl": "1800px", // Another custom breakpoint
      },
      colors: {
        pr: "#3B82F6",
        sec: "#AAB99A",
        ter: "#D0DDD0",
        delta: "#FBFBFB",
        btnPrimaryClr: "#3B82F6", // HEX code 'blue-500'
        btnHoverClr: "#2563EB", // Slightly darker, complementary
        btnSecClr: "#37AFE1", // Softer tone between base and dark
        btnSecHoverClr: "#267A9D", // 
        btnTerClr: "#FFF7F1", // light orange 
        btnTerHoverClr: "#FFE4C9", //more light orange
        textPrimaryClr: "#1E40AF", //blue-800
      },
      fontFamily: {
        sans: ["sans-serif", "system-ui"], // Primary font
        poppins: ["Poppins", "sans-serif"], // Add Poppins
      },
    },
  },
  plugins: [],
};
