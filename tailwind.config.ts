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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "hsl(214, 100%, 97%)",
          100: "hsl(214, 95%, 93%)",
          500: "hsl(221, 83%, 53%)",
          600: "hsl(221, 83%, 48%)",
          700: "hsl(221, 83%, 43%)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        slate: {
          50: "hsl(210, 40%, 98%)",
          100: "hsl(210, 40%, 96%)",
          200: "hsl(214, 32%, 91%)",
          300: "hsl(213, 27%, 84%)",
          400: "hsl(215, 20%, 65%)",
          500: "hsl(215, 16%, 47%)",
          600: "hsl(215, 19%, 35%)",
          700: "hsl(215, 25%, 27%)",
          800: "hsl(217, 33%, 17%)",
          900: "hsl(222, 84%, 5%)",
        },
        blue: {
          100: "hsl(214, 95%, 93%)",
          600: "hsl(221, 83%, 53%)",
          800: "hsl(221, 83%, 38%)",
        },
        green: {
          100: "hsl(142, 76%, 93%)",
          500: "hsl(142, 76%, 36%)",
          600: "hsl(142, 76%, 31%)",
          800: "hsl(142, 76%, 26%)",
        },
        yellow: {
          100: "hsl(48, 100%, 93%)",
          600: "hsl(48, 100%, 46%)",
          800: "hsl(48, 100%, 31%)",
        },
        orange: {
          100: "hsl(24, 100%, 93%)",
          600: "hsl(24, 100%, 51%)",
        },
        red: {
          100: "hsl(0, 100%, 95%)",
          500: "hsl(0, 84%, 60%)",
          600: "hsl(0, 84%, 55%)",
          800: "hsl(0, 84%, 45%)",
        },
        purple: {
          100: "hsl(270, 100%, 95%)",
          500: "hsl(270, 84%, 60%)",
          600: "hsl(270, 84%, 55%)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Fira Code", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
