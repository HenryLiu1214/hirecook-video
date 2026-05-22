import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors, fonts } from "../tokens";
import { TypewriterText } from "./TypewriterText";

interface PillBannerProps {
  text: string;
  startFrame: number;
  /** frames between each character (higher = slower typewriter) */
  typeSpeed?: number;
  fontSize?: number;
  accentColor?: string;
  width?: number;
}

export const PillBanner: React.FC<PillBannerProps> = ({
  text,
  startFrame,
  typeSpeed = 3,
  fontSize = 38,
  accentColor = colors.vividPurple,
  width = 1100,
}) => {
  const frame = useCurrentFrame();

  const pillOp = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pillScale = interpolate(frame, [startFrame, startFrame + 18], [0.94, 1], {
    easing: Easing.out(Easing.back(1.2)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient glow leaks out from the bottom of the pill
  const glowPulse = 1 + 0.08 * Math.sin((frame / 60) * Math.PI * 0.6);

  return (
    <div
      style={{ fontFamily: fonts.display,
        opacity: pillOp,
        transform: `scale(${pillScale})`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Pill shape */}
      <div
        style={{ fontFamily: fonts.display,
          width,
          background: "rgba(20, 16, 40, 0.85)",
          border: `1px solid ${accentColor}44`,
          borderRadius: 9999,
          padding: "28px 60px",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 60px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        {/* Inner glow top edge */}
        <div
          style={{ fontFamily: fonts.display,
            position: "absolute",
            top: 0,
            left: "20%",
            width: "60%",
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accentColor}88, transparent)`,
          }}
        />
        <TypewriterText
          text={text}
          startFrame={startFrame + 8}
          charStagger={typeSpeed}
          fontSize={fontSize}
          fontWeight={500}
          colorScheme="white-to-purple"
          letterSpacing="-0.5px"
          subtle
        />
      </div>

      {/* Bottom glow bleed */}
      <div
        style={{ fontFamily: fonts.display,
          width: width * 0.7 * glowPulse,
          height: 80,
          marginTop: -30,
          background: `radial-gradient(ellipse, ${accentColor}2A 0%, transparent 70%)`,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
