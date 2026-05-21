import { interpolate, Easing } from "remotion";

export interface MomentStyle {
  opacity: number;
  transform: string;
}

// Punchy moment transition: scale-up entrance with spring overshoot + rise,
// scale-past + lift exit. Pass huge outStart/outEnd for the last moment.
export const momentAnim = (
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
): MomentStyle => {
  const opacity = interpolate(frame, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sIn = interpolate(frame, [inStart, inStart + 16], [0.72, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sOut = interpolate(frame, [outStart, outEnd], [1, 1.16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yIn = interpolate(frame, [inStart, inEnd], [90, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yOut = interpolate(frame, [outStart, outEnd], [0, -90], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `scale(${sIn * sOut}) translateY(${yIn + yOut}px)` };
};

// Continuous gentle float for UI CARDS only (not text).
export const floatY = (t: number, speed = 0.85, amp = 12, phase = 0): number =>
  Math.sin(t * speed + phase) * amp;

// Subtle breathing scale for hero text.
export const breathe = (t: number, speed = 1.1, amp = 0.012): number =>
  1 + amp * Math.sin(t * speed);

// ── Cinematic text entrance helpers (all settle to 0 — text is still after landing) ──

// Perspective rotateX entrance settle (returns degrees: tilted → 0).
// Wrap text parent with perspective: 1200px.
export const rotXSettle = (frame: number, startFrame: number, duration = 30): number =>
  interpolate(frame, [startFrame, startFrame + duration], [16, 0], {
    easing: Easing.out(Easing.back(1.05)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 2D Z-rotation entrance — text spins into place then sits perfectly upright.
export const rotZIn = (frame: number, startFrame: number, duration = 26, fromDeg = -10): number =>
  interpolate(frame, [startFrame, startFrame + duration], [fromDeg, 0], {
    easing: Easing.out(Easing.back(1.15)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// SkewX settle on entrance (text arrives slightly skewed then straightens).
export const skewSettle = (frame: number, startFrame: number, duration = 24): number =>
  interpolate(frame, [startFrame, startFrame + duration], [-7, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Glowing pulse brightness for glow-frame boxes (0–1 oscillating).
export const glowPulse = (t: number, speed = 1.3, base = 0.55, amp = 0.25): number =>
  base + amp * Math.sin(t * speed);

// ── Zelios Style Cinematic Effects ──

// Sharp impact scale-up with heavy spring overshoot
export const scalePunch = (frame: number, startFrame: number, duration = 20): number =>
  interpolate(frame, [startFrame, startFrame + duration], [0.3, 1], {
    easing: Easing.out(Easing.back(2.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Smooth, continuous forward camera movement (scale up slowly after entrance)
export const cameraPush = (frame: number, startFrame: number, duration = 120, maxScale = 1.15): number =>
  interpolate(frame, [startFrame, startFrame + duration], [1, maxScale], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Circle mask reveal from center (returns a clip-path string)
export const circleWipe = (frame: number, startFrame: number, duration = 30): string => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 150], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return `circle(${progress}% at 50% 50%)`;
};

// A sharp, dynamic 45-degree diagonal wipe
export const slashWipe = (frame: number, startFrame: number, duration = 28): string => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [-50, 150], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // A polygon that starts top-left and sweeps to bottom-right
  return `polygon(-50% -50%, ${progress}% -50%, ${progress - 50}% 150%, -50% 150%)`;
};

// An extremely aggressive, massive ripple burst that scales up fast with a spring feel
export const rippleBurst = (frame: number, startFrame: number, duration = 34): string => {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 150], {
    easing: Easing.out(Easing.back(1.8)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return `circle(${progress}% at 50% 50%)`;
};
