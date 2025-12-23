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
      // HydraSkript-inspired Color Palette
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary brand colors from HydraSkript design
        primary: {
          DEFAULT: "#a8c5ff", // Light blue/periwinkle
          foreground: "#0a0e1a", // Dark navy text
          dark: "#7da8ff", // Darker blue variant
        },
        secondary: {
          DEFAULT: "#5ce1e6", // Cyan/turquoise
          foreground: "#0a0e1a", // Dark text
          dark: "#00d9ff", // Bright cyan
        },
        accent: {
          DEFAULT: "#c8b6ff", // Purple/lavender
          foreground: "#0a0e1a", // Dark text
          dark: "#d4c5ff", // Light lavender
        },
        
        // Background colors
        navy: {
          DEFAULT: "#0a0e1a", // Very dark navy
          light: "#1a1f2e", // Medium dark
          card: "#1e2433", // Card background
        },
        
        // Status colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "#5ce1e6", // Cyan for success
          foreground: "#0a0e1a",
        },
        warning: {
          DEFAULT: "#ffd700", // Gold for warnings
          foreground: "#0a0e1a",
        },
        
        // Neutral colors
        neutral: {
          DEFAULT: "#DCDFD5", // Off-White/Grey
          foreground: "#0a0e1a",
        },
      },
      
      // Modern border radius (less brutalist, more refined)
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
        xs: "4px",
        none: "0px",
      },
      
      // Custom Fonts
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        display: ["var(--font-display)", "Inter", ...fontFamily.sans],
      },
      
      // Refined shadows (less brutalist, more subtle)
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(168, 197, 255, 0.3)",
        "glow-cyan": "0 0 20px rgba(92, 225, 230, 0.3)",
      },
      
      // Custom Animation
      animation: {
        "fade-in": "fade-in 0.5s ease-in-out",
        "slide-up": "slide-up 0.5s ease-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 197, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 197, 255, 0.5)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
