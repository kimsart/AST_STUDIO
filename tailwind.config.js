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
        ast_lavender: "#8D7CEB",
        ast_turquoise: "#2EC4B6",
        ast_pink: "#FF4DA6",
        ast_yellow: "#FFD5A8",
        ast_coral: "#FF7A7A"
      },
      boxShadow: {
        astPurple: "0 0 28px rgba(90, 58, 142, 0.55)",
        astTurquoise: "0 0 28px rgba(46, 196, 182, 0.45)",
        astPink: "0 0 28px rgba(255, 77, 166, 0.55)",
        astBlue: "0 0 28px rgba(74, 105, 214, 0.45)",
        astWarm: "0 0 24px rgba(255, 213, 168, 0.35)"
      }
    }
  },
  plugins: []
};