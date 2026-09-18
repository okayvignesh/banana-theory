import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "var(--banana-cream)",
          dark: "var(--banana-cream-dark)",
        },
        banana: {
          DEFAULT: "var(--banana-yellow)",
          dark: "var(--banana-yellow-dark)",
        },
        chocolate: {
          DEFAULT: "var(--chocolate)",
          dark: "var(--chocolate-dark)",
          soft: "var(--chocolate-soft)",
        },
        cocoa: "var(--cocoa-muted)",
        border: "var(--border-soft)",
        success: "var(--success-green)",
        danger: "var(--danger-red)",
        star: "var(--star-gold)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(58,31,22,0.04), 0 8px 24px rgba(58,31,22,0.06)",
        soft: "0 2px 12px rgba(58,31,22,0.08)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
