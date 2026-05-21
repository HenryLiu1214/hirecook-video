// Design tokens — HireCook Digital Rationalism

export const FPS = 60;
export const TOTAL_SECONDS = 222.56; // 3:42 extended cut
export const DURATION_IN_FRAMES = 13354; // Total frames
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  // Legacy aliases kept for existing shared components
  void: "#05070C",
  deepNavy: "#090C13",
  darkSlate: "#0E121C",
  authorityBlue: "#1430A0",
  electricBlue: "#2151F5",
  neonBlue: "#436BFB",
  deepPurple: "#0A1850",
  vividPurple: "#2151F5",
  softPurple: "#6A8FFF",
  lavender: "#9CB6FF",
  alertOrange: "#B83A2E",
  energyGreen: "#1B7A4D",
  warningYellow: "#B27800",
  infoCyan: "#00B4D8",
  pureWhite: "#FFFFFF",
  softWhite: "#ECEFF6",
  dimWhite: "#B4BCD0",
  midGray: "#8C95AE",
  perspectiveBlue: "#EAF0FF",
  canvasWhite: "#FFFFFF",

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
  hcWatchBg: "#FBF2DD",
  hcRisk: "#B83A2E",
  hcRiskBg: "#FBE7E5",
  hcCanvas: "#FFFFFF",
  hcSubtle: "#F7F8FB",
  hcSubtle2: "#F2F4F9",
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

// Scene timing (frames @ 60fps) — 3:42 extended cut
export const SCENES = {
  s0: { start: 0,     end: 360   }, // 6s    Intro
  s1: { start: 360,   end: 2460  }, // 35s   Pain points
  s2: { start: 2460,  end: 5880  }, // 57s   Science
  s3: { start: 5880,  end: 11362 }, // 91.3s DIT demo (5482f)
  s4: { start: 11362, end: 12322 }, // 16s   Difference
  s5: { start: 12322, end: 13354 }, // 17.2s CTA
};
