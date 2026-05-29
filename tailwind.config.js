module.exports = {
content: {
  relative: true,
  files: [
    "./apps/web/**/*.{js,jsx,ts,tsx}",
    "./packages/ui/**/*.{js,jsx,ts,tsx}"
  ],
},
  theme: {
    extend: {
      colors: {
        ast_bg_dark: "#14182B",
        ast_bg_blue: "#1A2A6C",
        ast_deep: "#0F1230",

        ast_blue: "#4A69D6",
        ast_periwinkle: "#4A69D6",
        ast_purple: "#5A3A8E",
        ast_lavender: "#B78BFF",
        ast_turquoise: "#2EC4B6",
        ast_cyan: "#00E6FF",
        ast_electric_blue: "#2E64FF",
        ast_pink: "#FF4DB8",
        ast_yellow: "#FFD5A8",
        ast_coral: "#FF7A7A",
        ast_body: "#FFF4D6",
        ast_muted: "#DCC7FF",
        ast_faint: "#9F7FD6",

        ast: {
          turquoise: "#2EC4B6",
          cyan: "#00B7EB",
          purple: "#5B3FD3",
          pink: "#FE5FA7",
          orange: "#FFB85C",
          yellow: "#F4F27A",
          coral: "#FFE0CC",
          bg: {
            primary: "#121A5A",
            secondary: "#1822A8",
          }
        }
      },
      backgroundImage: {
        "ast-gradient-full": "var(--ast-gradient-full)",
        "ast-gradient-cool": "var(--ast-gradient-cool)",
        "ast-gradient-warm": "var(--ast-gradient-warm)",
        "ast-gradient-soft": "var(--ast-gradient-soft)",
      },
      boxShadow: {
        astPurple:   "0 0 28px rgba(90, 58, 142, 0.55)",
        astTurquoise:"0 0 28px rgba(46, 196, 182, 0.45)",
        astCyan:     "0 0 28px rgba(0, 230, 255, 0.35)",
        astLavender: "0 0 28px rgba(183, 139, 255, 0.40)",
        astPink:     "0 0 28px rgba(255, 77, 166, 0.55)",
        astBlue:     "0 0 28px rgba(46, 100, 255, 0.45)",
        astWarm:     "0 0 24px rgba(255, 213, 168, 0.35)"
      }
    }
  },
  plugins: []
};