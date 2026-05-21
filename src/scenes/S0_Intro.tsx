import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { rotZIn, rotXSettle, breathe } from "../anim";

// S0: 360 frames (6s) — HireCook brand + 讓他煮 team intro

export const S0_Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const logoOp = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoSc = interpolate(frame, [0, 40], [0.4, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const separatorW = interpolate(frame, [154, 184], [0, 520], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.hcCanvas }}>
      <BgCalm theme="light" tint="blue" />

      {/* Main content — centered column */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        perspective: "1400px",
      }}>
        {/* Logo mark */}
        <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, marginBottom: 8 }}>
          <Img src={staticFile("logo-mark.svg")} style={{ width: 136, height: 136 }} />
        </div>

        {/* HireCook wordmark */}
        <div style={{
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 20, 34, -10)}deg) rotateX(${rotXSettle(frame, 20, 36)}deg)`,
        }}>
          <TypewriterText
            text="HireCook"
            startFrame={16}
            charStagger={4}
            fontSize={226}
            fontWeight={900}
            letterSpacing="-8px"
            colorScheme="plum-to-pink"
          />
        </div>

        {/* Tagline */}
        <div style={{
          transform: `rotate(${rotZIn(frame, 170, 26, 8)}deg)`,
          opacity: interpolate(frame, [118, 132], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}>
          <TypewriterText
            text="AI 行為智能 · 精準人才適配"
            startFrame={120}
            charStagger={2}
            fontSize={46}
            fontWeight={600}
            colorScheme="plum-to-pink"
          />
        </div>

        {/* Team section */}
        <div style={{
          opacity: interpolate(frame, [150, 164], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          marginTop: 22,
        }}>
          {/* Separator */}
          <div style={{
            height: 1,
            background: colors.hcBlue,
            opacity: 0.6,
            width: separatorW,
          }} />

          {/* Team name */}
          <TypewriterText
            text="讓他煮"
            startFrame={168}
            charStagger={3}
            fontSize={98}
            fontWeight={900}
            letterSpacing="-3px"
            colorScheme="plum-to-pink"
          />

          {/* University */}
          <div style={{
            opacity: interpolate(frame, [196, 210], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontSize: 19,
            fontFamily: fonts.mono,
            color: colors.hcFgMuted,
            letterSpacing: "1.5px",
          }}>
            國立臺灣科技大學 · 資管系 × 資工系 × 企管系 · 2026
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
