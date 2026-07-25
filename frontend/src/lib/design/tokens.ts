export const designTokens = {
  colors: {
    primary: {
      DEFAULT: "#6C5CE7",
      light: "#8B7CF6",
      lighter: "#A29BFE",
      dark: "#5A4CD1",
    },
    background: {
      DEFAULT: "#F8F9FF",
      card: "rgba(255, 255, 255, 0.7)",
      glass: "rgba(255, 255, 255, 0.4)",
      meshPrimary: "#FFF0F7",
      meshSecondary: "#E5E1FF",
      meshTertiary: "#F0E6FF",
    },
    text: {
      primary: "#1B1D35",
      secondary: "#6B7280",
      muted: "#A0AEC0",
    },
    border: {
      glass: "rgba(255, 255, 255, 0.8)",
      glassSoft: "rgba(255, 255, 255, 0.6)",
      divider: "rgba(108, 92, 231, 0.08)",
    }
  },
  radii: {
    pill: "20px",
    card: "32px",
    input: "18px",
    button: "20px",
    sm: "12px",
    md: "16px",
  },
  shadows: {
    glass: "0 20px 40px -15px rgba(108,92,231,0.05), 0 0 20px 0 rgba(108,92,231,0.02)",
    pill: "0 4px 20px -10px rgba(108,92,231,0.1)",
    innerInput: "inset 0 2px 4px rgba(0,0,0,0.015)",
    glowButton: "inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 10px rgba(108,92,231,0.3)",
  },
  animations: {
    spring: {
      stiffness: 400,
      damping: 25,
    },
    transitionDuration: "300ms",
  }
};
