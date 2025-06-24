module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#d1d5db',
        primary: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(355.7, 100%, 97.3%)',
        },
      },
      ringColor: {
        primary: 'hsl(142, 76%, 36%)',
      },
    },
  },
  plugins: [],
};
