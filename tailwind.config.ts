import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Sephirot badge colors
        sephirot: {
          purple: {
            light: "#C294F6",
            DEFAULT: "#905AD5",
            dark: "#653C9A",
          },
          divine: {
            light: "#E9D8FD",
            DEFAULT: "#B794F6",
            dark: "#805AD5",
          },
          gold: {
            light: "#F6E05E",
            DEFAULT: "#D69E2E",
            dark: "#B7791F",
          },
          keter: {
            light: "#FEFCBF",
            DEFAULT: "#ECC94B", 
            dark: "#B7791F"
          },
          binah: {
            light: "#C4F1F9",
            DEFAULT: "#76E4F7",
            dark: "#0BC5EA"
          },
          chokhmah: {
            light: "#BEE3F8",
            DEFAULT: "#63B3ED",
            dark: "#3182CE"
          },
          tiferet: { 
            light: "#FEB2B2",
            DEFAULT: "#FC8181",
            dark: "#E53E3E"
          },
          chesed: {
            light: "#C6F6D5",
            DEFAULT: "#68D391",
            dark: "#38A169"
          }
        },
        skyglow: {
          light: "#e0f7ff",
          DEFAULT: "#bae6fd",
          glow: "#a5f3fc",
          dark: "#38bdf8",
        },
      }, // ⬅️ end of colors
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "pulse-fast": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "subtle-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.98)" },
        },
        "orbit": {
          "0%": { transform: "rotate(0deg) translateX(25px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(25px) rotate(-360deg)" },
        },
        "shimmer": {
          "0%": { left: "-100%" },
          "100%": { left: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse-fast 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "subtle-pulse": "subtle-pulse 4s ease-in-out infinite",
        "orbit": "orbit 15s linear infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
