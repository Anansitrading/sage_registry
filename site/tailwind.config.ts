import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          deep: "#0a0a0a",
          surface: "#0f0f0f",
          card: "#141414",
          "card-hover": "#1a1a1a",
          terminal: "#0d1117",
          "terminal-bar": "#161b22",
        },
        text: {
          DEFAULT: "#c9d1d9",
          heading: "#f0f6fc",
          muted: "#8b949e",
          faint: "#484f58",
        },
        green: {
          DEFAULT: "#00ff41",
          dim: "#00cc33",
          soft: "#4ade80",
        },
        amber: {
          DEFAULT: "#ffb000",
          dim: "#cc8d00",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          subtle: "rgba(255, 255, 255, 0.04)",
          green: "rgba(0, 255, 65, 0.15)",
          amber: "rgba(255, 176, 0, 0.15)",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        container: "1080px",
        narrow: "800px",
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        "glow-green": "0 0 20px rgba(0, 255, 65, 0.1), 0 0 60px rgba(0, 255, 65, 0.05)",
        "glow-green-strong": "0 0 20px rgba(0, 255, 65, 0.2), 0 0 60px rgba(0, 255, 65, 0.1)",
        "glow-amber": "0 0 20px rgba(255, 176, 0, 0.1), 0 0 60px rgba(255, 176, 0, 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;
