import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface BgLightProps {
  color1?: string;
  color2?: string;
}

export const BgLight: React.FC<BgLightProps> = ({
  color1 = "#F9A8D4",
  color2 = "#C4B5FD",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const b1x = 380 + 240 * Math.sin(t * 0.35);
  const b1y = 260 + 180 * Math.cos(t * 0.28);
  const b2x = 1520 + 220 * Math.cos(t * 0.31);
  const b2y = 720 + 200 * Math.sin(t * 0.26);
  const b3x = 880 + 300 * Math.sin(t * 0.22 + 1.5);
  const b3y = 480 + 220 * Math.cos(t * 0.24 + 0.8);

  return (
    <div style={{ position: "absolute", inset: 0, background: "#FAF8FF", overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: b1x - 520, top: b1y - 520, width: 1040, height: 1040,
        borderRadius: "50%", background: `radial-gradient(circle, ${color1}AA 0%, transparent 65%)`, filter: "blur(90px)",
      }} />
      <div style={{
        position: "absolute", left: b2x - 520, top: b2y - 520, width: 1040, height: 1040,
        borderRadius: "50%", background: `radial-gradient(circle, ${color2}99 0%, transparent 65%)`, filter: "blur(100px)",
      }} />
      <div style={{
        position: "absolute", left: b3x - 440, top: b3y - 440, width: 880, height: 880,
        borderRadius: "50%", background: "radial-gradient(circle, #93C5FD77 0%, transparent 65%)", filter: "blur(80px)",
      }} />
    </div>
  );
};
