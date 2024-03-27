import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-50": "rgb(var(--color-primary-50) / <alpha-value>)",
        "primary-100": "rgb(var(--color-primary-100) / <alpha-value>)",
        "primary-200": "rgb(var(--color-primary-200) / <alpha-value>)",
        "primary-300": "rgb(var(--color-primary-300) / <alpha-value>)",
        "primary-400": "rgb(var(--color-primary-400) / <alpha-value>)",
        "primary-500": "rgb(var(--color-primary-500) / <alpha-value>)",
        "primary-600": "rgb(var(--color-primary-600) / <alpha-value>)",
        "primary-700": "rgb(var(--color-primary-700) / <alpha-value>)",
        "primary-800": "rgb(var(--color-primary-800) / <alpha-value>)",
        "primary-900": "rgb(var(--color-primary-900) / <alpha-value>)",
        "primary-950": "rgb(var(--color-primary-950) / <alpha-value>)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
export default config;
