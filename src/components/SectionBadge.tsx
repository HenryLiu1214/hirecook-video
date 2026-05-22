import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors, fonts } from "../tokens";

interface SectionBadgeProps {
  number: string;
  label: string;
  color?: string;
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({
  number,
  label,
  color = colors.electricBlue,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, 18], [-24, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{ fontFamily: fonts.display,
        position: "absolute",
        top: 52,
        left: 72,
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 10,
      }}
    >
      {/* Number pip */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          color: colors.pureWhite,
          fontFamily: fonts.mono,
        }}
      >
        {number}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 12,
          fontWeight: 500,
          color: color,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
};
