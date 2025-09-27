/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // scan all files in /app
    "./pages/**/*.{js,ts,jsx,tsx}", // (if you have /pages)
    "./components/**/*.{js,ts,jsx,tsx}", // for your components folder
  ],
  // plugins: [require("daisyui")],
};
