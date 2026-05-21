// Design tokens — HireCook Digital Rationalism

export const FPS = 60;
export const TOTAL_SECONDS = 185.57; // 3:05.6 adjusted
export const DURATION_IN_FRAMES = 11134; // Total frames
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
  mono: "'JetBrains Mono', 'Courier New', 'Noto Sans TC', monospace",
};

// Scene timing (frames @ 60fps) — 3:09.4 trimmed cut
export const SCENES = {
  s0: { start: 0,     end: 270   }, // 4.5s  Intro
  s1: { start: 270,   end: 2280  }, // 33.5s Pain points (2010f)
  s2: { start: 2244,  end: 5124  }, // 48s   Science (2880f)
  s3: { start: 5124,  end: 9142  }, // 67s   DIT demo (4018f)
  s4: { start: 9142,  end: 10102 }, // 16s   Difference (960f)
  s5: { start: 10102, end: 11134 }, // 17.2s CTA (1032f)
};
