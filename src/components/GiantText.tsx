import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors, fonts } from "../tokens";

interface GiantTextProps {
  text: string;
  startFrame: number;
  /** frames duration for appear animation */
  animDuration?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  align?: "center" | "left";
  letterSpacing?: string;
  subtitle?: string;
  subtitleColor?: string;
  lightMode?: boolean;
}

export const GiantText: React.FC<GiantTextProps> = ({
  text,
  startFrame,
  animDuration = 22,
  fontSize = 220,
  fontWeight = 900,
  color,
  gradientFrom,
  gradientTo,
  glowColor,
  align = "center",
  letterSpacing = "-6px",
  subtitle,
  subtitleColor,
  lightMode = false,
}) => {
  const frame = useCurrentFrame();

  const op = interpolate(frame, [startFrame, startFrame + animDuration], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [startFrame, startFrame + animDuration], [0.88, 1], {
    easing: Easing.out(Easing.back(1.1)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const subtitleOp = interpolate(
    frame,
    [startFrame + animDuration, startFrame + animDuration + 18],
    [0, 1],
    { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const hasGradient = gradientFrom && gradientTo;
  const textStyle: React.CSSProperties = hasGradient
    ? {
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }
    : { color: color ?? (lightMode ? colors.void : colors.pureWhite) };

  return (
    <div
      style={{ fontFamily: fonts.display,
        opacity: op,
        transform: `scale(${scale})`,
        textAlign: align,
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 20,
      }}
    >
      {/* Glow bloom behind text */}
      {glowColor && (
        <div
          style={{ fontFamily: fonts.display,
            position: "absolute",
            inset: "-20%",
            background: `radial-gradient(ellipse, ${glowColor}33 0%, transparent 70%)`,
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          fontFamily: fonts.display,
          fontSize,
          fontWeight,
          letterSpacing,
          lineHeight: 0.95,
          position: "relative",
          ...textStyle,
        }}
      >
        {text}
      </div>
      {subtitle && (
        <div
          style={{
            opacity: subtitleOp,
            fontFamily: fonts.display,
            fontSize: Math.round(fontSize * 0.15),
            fontWeight: 400,
            color: subtitleColor ?? colors.dimWhite,
            letterSpacing: "0.5px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};
