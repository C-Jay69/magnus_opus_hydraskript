const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Neo-Brutalist Color Palette
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0000FF", // Electric Blue
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#FFBF00", // Amber
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "#BEF754", // Acid Green
          foreground: "hsl(var(--success-foreground))",
        },
        magic: {
          DEFAULT: "#FF00FF", // Magenta
          foreground: "hsl(var(--magic-foreground))",
        },
        info: {
          DEFAULT: "#00FFFF", // Cyan
          foreground: "hsl(var(--info-foreground))",
        },
        neutral: {
          DEFAULT: "#DCDFD5", // Off-White/Grey
          foreground: "hsl(var(--neutral-foreground))",
        },
        // Gradient colors for progress bars
        gradient: {
          start: "#FF00FF", // Magenta
          end: "#00FFFF",   // Cyan
        }
      },
      // Neo-Brutalist Border Radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        none: "0px",
        xs: "2px",
      },
      // Custom Fonts
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        display: ["var(--font-display)", ...fontFamily.sans],
      },
      // Neo-Brutalist Shadows
      boxShadow: {
        brutal: "4px 4px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-sm": "2px 2px 0px 0px rgba(0, 0, 0, 1)",
        "brutal-lg": "6px 6px 0px 0px rgba(0, 0, 0, 1)",
      },
      // Custom Animation for Progress Bars
      animation: {
        "progress-gradient": "progress-gradient 2s linear infinite",
        "skeleton-pulse": "skeleton-pulse 1.5s ease-in-out infinite",
      },
      keyframes: {
        "progress-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: 0.6 },
          "50%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}