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
      // Modern Gradient Color Palette (from PDF design)
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Gradient brand colors from PDF design
        primary: {
          DEFAULT: "#A78BFA", // Purple
          light: "#C4B5FD", // Light purple
          foreground: "#0F172A", // Dark slate text
        },
        secondary: {
          DEFAULT: "#22D3EE", // Cyan
          light: "#67E8F9", // Light cyan
          foreground: "#0F172A", // Dark text
        },
        accent: {
          DEFAULT: "#60A5FA", // Blue
          light: "#93C5FD", // Light blue
          foreground: "#0F172A", // Dark text
        },
        
        // Background colors (slate palette)
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        
        // Status colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "#22D3EE", // Cyan for success
          foreground: "#0F172A",
        },
        warning: {
          DEFAULT: "#fbbf24", // Amber for warnings
          foreground: "#0F172A",
        },
      },
      
      // Modern border radius
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
        xs: "0.25rem",
      },
      
      // Custom Fonts
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
        display: ["var(--font-display)", "Inter", ...fontFamily.sans],
      },
      
      // Modern shadows with gradient glows
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px rgba(167, 139, 250, 0.3)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.3)",
        "glow-gradient": "0 0 30px rgba(167, 139, 250, 0.4), 0 0 60px rgba(34, 211, 238, 0.2)",
      },
      
      // Gradient backgrounds
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #A78BFA, #22D3EE)",
        "gradient-primary-vertical": "linear-gradient(to bottom, #A78BFA, #22D3EE)",
        "gradient-purple-blue": "linear-gradient(to right, #A78BFA, #60A5FA)",
        "gradient-blue-cyan": "linear-gradient(to right, #60A5FA, #22D3EE)",
        "gradient-radial": "radial-gradient(circle, #A78BFA, #22D3EE)",
        "gradient-dark": "linear-gradient(to bottom, #0F172A, #1E293B)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(167, 139, 250, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(167, 139, 250, 0.5)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}
