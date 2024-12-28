/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{html,js}", "./components/**/*.{html,js}"],
  safelist: [
    "text-2xl",
    "text-3xl",
    {
      pattern: /bg-(red|green|blue)-(100|200|300)/,
    },
  ],
  // ...
};
