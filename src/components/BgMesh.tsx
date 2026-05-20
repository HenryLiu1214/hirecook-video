import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../tokens";

interface BgMeshProps {
  accentColor?: string;
  accentColor2?: string;
  gridOpacity?: number;
}

export const BgMesh: React.FC<BgMeshProps> = ({
  accentColor = colors.electricBlue,
  accentColor2 = colors.vividPurple,
  gridOpacity = 0.025,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t = frame / fps;

  // Slow breathing orbs
  const orb1x = 280 + 100 * Math.sin(t * 0.18);
  const orb1y = 180 + 80 * Math.cos(t * 0.14);
  const orb1r = 780 + 60 * Math.sin(t * 0.22);

  const orb2x = 1640 + 100 * Math.cos(t * 0.16);
  const orb2y = 860 + 80 * Math.sin(t * 0.12);
  const orb2r = 700 + 70 * Math.cos(t * 0.19);

  const orb3x = 960 + 140 * Math.sin(t * 0.09 + 1);
  const orb3y = 540 + 100 * Math.cos(t * 0.11 + 2);
  const orb3r = 560 + 50 * Math.sin(t * 0.25);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${colors.darkSlate} 0%, ${colors.void} 70%)`,
        }}
      />

      {/* Orb 1 */}
      <div
        style={{
          position: "absolute",
          left: orb1x - orb1r / 2,
          top: orb1y - orb1r / 2,
          width: orb1r,
          height: orb1r,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}44 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Orb 2 */}
      <div
        style={{
          position: "absolute",
          left: orb2x - orb2r / 2,
          top: orb2y - orb2r / 2,
          width: orb2r,
          height: orb2r,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor2}3A 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: "absolute",
          left: orb3x - orb3r / 2,
          top: orb3y - orb3r / 2,
          width: orb3r,
          height: orb3r,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}2E 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,${gridOpacity}) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
};
