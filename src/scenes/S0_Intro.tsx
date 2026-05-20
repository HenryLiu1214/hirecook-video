import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Img, staticFile } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { rotZIn, rotXSettle, breathe } from "../anim";

// S0: 300 frames (5s) — HireCook brand + 讓他煮 team intro

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

  const separatorW = interpolate(frame, [210, 240], [0, 480], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0E121C" }}>
      <BgCalm theme="dark" tint="blue" />

      {/* Main content — centered column */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        perspective: "1400px",
      }}>
        {/* Logo mark */}
        <div style={{ opacity: logoOp, transform: `scale(${logoSc})`, marginBottom: 16 }}>
          <Img src={staticFile("logo-mark.svg")} style={{ width: 160, height: 160 }} />
        </div>

        {/* HireCook wordmark */}
        <div style={{
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 20, 34, -10)}deg) rotateX(${rotXSettle(frame, 20, 36)}deg)`,
        }}>
          <TypewriterText
            text="HireCook"
            startFrame={20}
            charStagger={5}
            fontSize={260}
            fontWeight={900}
            letterSpacing="-8px"
            colorScheme="white"
          />
        </div>

        {/* Tagline */}
        <div style={{
          transform: `rotate(${rotZIn(frame, 170, 26, 8)}deg)`,
          opacity: interpolate(frame, [168, 182], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}>
          <TypewriterText
            text="AI 行為智能 · 精準人才適配"
            startFrame={170}
            charStagger={3}
            fontSize={52}
            fontWeight={600}
            colorScheme="white-to-cyan"
          />
        </div>

        {/* Team section */}
        <div style={{
          opacity: interpolate(frame, [210, 223], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          marginTop: 32,
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
            startFrame={230}
            charStagger={4}
            fontSize={120}
            fontWeight={900}
            letterSpacing="-3px"
            colorScheme="white-to-blue"
          />

          {/* University */}
          <div style={{
            opacity: interpolate(frame, [255, 268], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            fontSize: 20,
            fontFamily: fonts.mono,
            color: colors.dimWhite,
            letterSpacing: "1.5px",
          }}>
            國立臺灣科技大學 · 資管系 × 資工系 × 企管系 · 2026
          </div>
        </div>
      </div>

      <SubtitleBar />
    </AbsoluteFill>
  );
};
