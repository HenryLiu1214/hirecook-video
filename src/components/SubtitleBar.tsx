import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { SUBTITLES } from "../subtitles";
import { colors, fonts } from "../tokens";

export const SubtitleBar: React.FC = () => {
  const frame = useCurrentFrame();

  const current = SUBTITLES.find((s) => frame >= s.from && frame <= s.to);
  const prev = SUBTITLES.filter((s) => frame > s.to).slice(-1)[0];

  if (!current && !prev) return null;

  const entry = current ?? prev;
  if (!entry) return null;

  // Fade in at start, fade out near end
  const fadeIn = current
    ? interpolate(frame, [entry.from, entry.from + 8], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const fadeOut = current
    ? interpolate(frame, [entry.to - 8, entry.to], [1, 0], {
        easing: Easing.in(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 1200,
        width: "90%",
        zIndex: 100,
        opacity,
      }}
    >
      {/* Frosted pill */}
      <div
        style={{
          background: "rgba(8, 8, 32, 0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 9999,
          padding: "14px 36px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: fonts.display,
            fontSize: 20,
            fontWeight: 400,
            color: colors.softWhite,
            lineHeight: 1.5,
            letterSpacing: "0.2px",
          }}
        >
          {entry.text}
        </span>
      </div>
    </div>
  );
};
