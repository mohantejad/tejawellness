/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./zustand/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:                 "hsl(var(--bg))",
        fg:                 "hsl(var(--fg))",
        card:               "hsl(var(--card))",
        border:             "hsl(var(--border))",
        primary:            "hsl(var(--primary))",
        primaryForeground:  "hsl(var(--primary-foreground))",
        accent:             "hsl(var(--accent))",
        accentForeground:   "hsl(var(--accent-foreground))",
        muted:              "hsl(var(--muted))",
        mutedForeground:    "hsl(var(--muted-foreground))",
        surface:            "hsl(var(--surface))",
        ring:               "hsl(var(--ring))",
      },
      borderRadius: {
        xl: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 32px hsl(var(--primary) / 0.08)",
        rose: "0 4px 20px hsl(340 45% 42% / 0.18)",
      },
      fontFamily: {
        sans:  ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
    },
  },
  plugins: [],
};
