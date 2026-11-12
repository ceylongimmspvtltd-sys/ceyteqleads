import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff7ff",
          100: "#dceeff",
          200: "#b9ddff",
          500: "#2680d9",
          600: "#1565c0",
          700: "#104f99",
          900: "#102a43",
        },
      },
      boxShadow: {
        soft: "0 24px 70px rgba(16, 42, 67, .09)",
      },
    },
  },
  plugins: [],
};

export default config;
