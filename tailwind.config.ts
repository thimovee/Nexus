import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        "7xl": "1480px"
      },
      colors: {
        border: "#e5e7eb",
        background: "#f3f4f6",
        primary: "#030711",
        secondary: "#03071180",
        greenbackground: "#d1fae5",
        greentext: "#065f46",
        greenborder: "#0596691a",
        redbackground: "#fee2e2",
        redtext: "#991b1b",
        redborder: "#dc28281a",
        cta: "#0074c2",
        card: "#ffffff",
      }
    },
  },
  plugins: [],
};
export default config;
