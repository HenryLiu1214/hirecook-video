import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

interface Point { x: number; y: number; }

interface HandCursorProps {
  startFrame: number;
  /** array of waypoints; cursor lerps between each consecutive pair */
  path: Point[];
  /** total frames to traverse all waypoints (evenly distributed) */
  duration: number;
  /** frames (relative to startFrame) at which to trigger a tap animation */
  clickAt?: number[];
  size?: number;
  /** fade-in duration */
  fadeIn?: number;
  /** fade-out duration starting from end */
  fadeOut?: number;
}

export const HandCursor: React.FC<HandCursorProps> = ({
  startFrame,
  path,
  duration,
  clickAt = [],
  size = 38,
  fadeIn = 14,
  fadeOut = 14,
}) => {
  const frame = useCurrentFrame();
  const e = frame - startFrame;

  // Position interpolation across waypoints
  let x = path[0].x, y = path[0].y;
  if (path.length > 1) {
    const segs = path.length - 1;
    const segDur = duration / segs;
    const i = Math.min(segs - 1, Math.max(0, Math.floor(e / segDur)));
    const local = (e - i * segDur) / segDur;
    const a = path[i], b = path[i + 1];
    const t = Math.max(0, Math.min(1, local));
    const eased = Easing.inOut(Easing.cubic)(t);
    x = a.x + (b.x - a.x) * eased;
    y = a.y + (b.y - a.y) * eased;
  }

  const opIn = interpolate(e, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opOut = interpolate(e, [duration - fadeOut, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(opIn, opOut);

  // tap scale: nearest clickAt
  let tap = 1;
  let ringOp = 0;
  for (const ct of clickAt) {
    const d = e - ct;
    if (d >= -4 && d <= 18) {
      tap = Math.min(tap, interpolate(d, [-4, 0, 6, 18], [1, 0.78, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      ringOp = Math.max(ringOp, interpolate(d, [0, 4, 18], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
  }

  return (
    <>
      {/* Click ripple */}
      <div style={{
        position: "absolute",
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid #2151F5",
        opacity: ringOp,
        pointerEvents: "none",
      }} />
      {/* Cursor */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          opacity: op,
          transform: `scale(${tap})`,
          transformOrigin: "20% 20%",
          pointerEvents: "none",
          filter: "drop-shadow(0 4px 12px rgba(8,16,40,0.35))",
        }}
      >
        <svg width={size} height={size * 1.2} viewBox="0 0 28 34">
          <path
            d="M5 3 L5 23 L10 18 L13 27 L17 25 L14 16 L21 16 Z"
            fill="#FFFFFF"
            stroke="#0B1020"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};
