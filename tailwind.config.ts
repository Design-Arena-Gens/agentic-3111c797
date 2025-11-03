import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        skyLight: '#e0f2fe',
        blueSoft: '#90caf9',
        bluePrimary: '#42a5f5',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

export default config;
