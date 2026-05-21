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
    const eased = Easing.out(Easing.cubic)(t);
    x = a.x + (b.x - a.x) * eased;
    y = a.y + (b.y - a.y) * eased;
  }

  const opIn = interpolate(e, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opOut = interpolate(e, [duration - fadeOut, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(opIn, opOut);

  let ringOp = 0;
  let ringScale = 1;
  for (const ct of clickAt) {
    const d = e - ct;
    if (d >= -4 && d <= 18) {
      ringOp = Math.max(ringOp, interpolate(d, [0, 4, 18], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      ringScale = Math.max(ringScale, interpolate(d, [0, 18], [0.55, 1.45], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
    }
  }

  return (
    <div style={{ opacity: op, pointerEvents: "none" }}>
      <div style={{
        position: "absolute",
        left: x - 24,
        top: y - 24,
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "2px solid #2151F5",
        opacity: ringOp,
        transform: `scale(${ringScale})`,
        boxShadow: "0 0 0 8px rgba(33,81,245,0.10)",
        pointerEvents: "none",
      }} />
    </div>
  );
};
