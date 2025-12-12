import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // 台灣廟宇配色
        temple: {
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          gold: {
            50: '#fefce8',
            100: '#fef9c3',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
          },
          orange: {
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
          },
        },
        // 文青佛系配色 - 減少紅色，使用柔和色調
        zen: {
          beige: {
            50: '#fdfcfb',
            100: '#f8f6f3',
            200: '#f0ebe5',
            300: '#e8e0d7',
            400: '#d4c5b5',
            500: '#c0ab93',
            600: '#a89178',
            700: '#8b7461',
          },
          sage: {
            50: '#f6f8f6',
            100: '#e8ede8',
            200: '#d4ddd4',
            300: '#b8c9b8',
            400: '#95b095',
            500: '#749674',
            600: '#5a7a5a',
            700: '#4a634a',
          },
          lavender: {
            50: '#f9f8fc',
            100: '#f1eef8',
            200: '#e4dff1',
            300: '#cec4e2',
            400: '#b3a3d0',
            500: '#9883bd',
            600: '#7d68a4',
            700: '#655488',
          },
          clay: {
            50: '#faf8f6',
            100: '#f3eeea',
            200: '#e7ddd3',
            300: '#d5c4b3',
            400: '#bfa58e',
            500: '#a8876b',
            600: '#8d6e54',
            700: '#735a44',
          },
          mint: {
            50: '#f3faf8',
            100: '#e0f4ef',
            200: '#c2e9df',
            300: '#9cd9c9',
            400: '#6fc4ae',
            500: '#4daa93',
            600: '#3a8c79',
            700: '#307262',
          },
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
      },
      backgroundImage: {
        'temple-pattern': "url('/images/temple-pattern.png')",
        'lantern-glow': "radial-gradient(circle, rgba(234,179,8,0.6) 0%, rgba(234,179,8,0) 70%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config





