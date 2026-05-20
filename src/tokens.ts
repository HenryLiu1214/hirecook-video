// Design tokens — Gemini-style × Digital Rationalism

export const FPS = 60;
export const TOTAL_SECONDS = 225; // 3:45
export const DURATION_IN_FRAMES = TOTAL_SECONDS * FPS; // 13500
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  // Background
  void: "#05050F",
  deepNavy: "#080820",
  darkSlate: "#0D0D2B",
  // Primary
  authorityBlue: "#1E4096",
  electricBlue: "#0A84FF",
  neonBlue: "#3B82F6",
  // Secondary
  deepPurple: "#4A00B0",
  vividPurple: "#7C3AED",
  softPurple: "#A78BFA",
  lavender: "#C4B5FD",
  // Functional
  alertOrange: "#FF6B35",
  energyGreen: "#10B981",
  warningYellow: "#FBBF24",
  infoCyan: "#06B6D4",
  // Text
  pureWhite: "#FFFFFF",
  softWhite: "#E2E8F0",
  dimWhite: "#94A3B8",
  midGray: "#64748B",
  // Light mode accents (still used in some panels)
  perspectiveBlue: "#E6F0FF",
  canvasWhite: "#F8FAFC",
  // HireCook Design System
  hcBlue: "#2151F5",
  hcBlueDark: "#1430A0",
  hcBlueFill: "rgba(33,81,245,0.14)",
  hcCyan: "#00B4D8",
  hcCyanBright: "#6FE3F5",
  hcCyanFill: "rgba(0,180,216,0.12)",
  hcFit: "#1B7A4D",
  hcFitBg: "#E6F5EC",
  hcFitFg: "#146F3E",
  hcFitBorder: "rgba(27,122,77,0.22)",
  hcWatch: "#B27800",
  hcRisk: "#B83A2E",
  hcRiskBg: "#FBE7E5",
  hcCanvas: "#FFFFFF",
  hcSubtle: "#F7F8FB",
  hcHairline: "rgba(8,16,40,0.06)",
  hcSoft: "rgba(8,16,40,0.10)",
  hcInk900: "#0E121C",
  hcInk700: "#232A3D",
  hcFgPrimary: "#0B1020",
  hcFgSecondary: "#364159",
  hcFgMuted: "#5C677F",
  hcFgFaint: "#8C95AE",
};

export const fonts = {
  display: "'Inter', 'Noto Sans TC', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// Scene timing (frames @ 60fps)
export const SCENES = {
  s0: { start: 0,     end: 300   }, // 0-5s    Intro
  s1: { start: 300,   end: 4200  }, // 5-70s   Pain points
  s2: { start: 4200,  end: 8400  }, // 70-140s Science
  s3: { start: 8400,  end: 12000 }, // 140-200s DIT
  s4: { start: 12000, end: 12900 }, // 200-215s Compare
  s5: { start: 12900, end: 13500 }, // 215-225s CTA
};
