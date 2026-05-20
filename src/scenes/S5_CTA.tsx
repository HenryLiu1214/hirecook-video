import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S5: 600 frames (10s)
// M1  0–300:  DARK — SDG 8 vision
// M2  300–600: DARK — HireCook finale + CTA

export const S5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const m1 = momentAnim(frame, 0, 11, 280, 290);
  const m2 = momentAnim(frame, 300, 311, 90000, 99999);

  // CTA button scale
  const ctaScale = interpolate(frame, [460, 472], [0.6, 1], {
    easing: Easing.out(Easing.back(1.4)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Ripple
  const rippleSize = interpolate(frame, [490, 590], [0, 300], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const rippleOp = interpolate(frame, [490, 590], [0.6, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: colors.void }}>

      {/* M1 — DARK: SDG 8 vision */}
      <div style={{
        position: "absolute", inset: 0, opacity: m1.opacity, transform: m1.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40,
        perspective: "1400px",
      }}>
        <BgCalm theme="dark" tint="green" />

        {/* SDG 8 badge */}
        <div style={{
          opacity: interpolate(frame, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(frame, [22, 36], [0.7, 1], {
            easing: Easing.out(Easing.back(1.3)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
          })})`,
          padding: "10px 32px", borderRadius: 9999,
          background: `${colors.hcFit}18`, border: `1.5px solid ${colors.hcFit}66`,
          fontSize: 24, fontWeight: 700, color: colors.hcFit,
          fontFamily: fonts.mono, letterSpacing: "2px",
        }}>UN SDG 8</div>

        {/* Big text */}
        <div style={{
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 44, 34, -14)}deg) rotateX(${rotXSettle(frame, 44, 36)}deg)`,
        }}>
          <TypewriterText text="精準適配" startFrame={44} charStagger={5} fontSize={280} fontWeight={900}
            letterSpacing="-8px" colorScheme="white-to-cyan" />
        </div>

        {/* Sub */}
        <div style={{ transform: `rotate(${rotZIn(frame, 180, 26, 8)}deg) skewX(${skewSettle(frame, 180, 24)}deg)` }}>
          <TypewriterText text="降低就業摩擦 · 尊嚴就業" startFrame={180} charStagger={3}
            fontSize={44} fontWeight={600} colorScheme="white-to-cyan" />
        </div>
      </div>

      {/* M2 — DARK: HireCook finale + CTA */}
      <div style={{
        position: "absolute", inset: 0, opacity: m2.opacity, transform: m2.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
        perspective: "1400px",
      }}>
        <BgCalm theme="dark" tint="blue" />

        {/* hairline frame */}
        <div style={{
          position: "absolute",
          width: 900, height: 440, left: "50%", top: "46%",
          transform: "translate(-50%, -50%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 52,
          pointerEvents: "none",
        }} />

        {/* Logo + name */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 322, 36, -12)}deg) rotateX(${rotXSettle(frame, 322, 38)}deg)`,
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <HcLogoMark size={100} />
          </div>
          <TypewriterText text="HireCook" startFrame={322} charStagger={5} fontSize={200} fontWeight={900}
            letterSpacing="-8px" colorScheme="white-to-purple" />
        </div>

        {/* tagline */}
        <div style={{
          transform: `rotate(${rotZIn(frame, 420, 22, 8)}deg) skewX(${skewSettle(frame, 420, 20)}deg)`,
          opacity: interpolate(frame, [420, 433], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          <TypewriterText text="正確烹煮人才，讓他煮。" startFrame={422} charStagger={3}
            fontSize={52} fontWeight={600} colorScheme="white" />
        </div>

        {/* CTA button + ripple */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* ripple */}
          <div style={{
            position: "absolute",
            width: rippleSize, height: rippleSize,
            borderRadius: "50%",
            border: "2px solid #2151F588",
            opacity: rippleOp,
            pointerEvents: "none",
          }} />
          {/* button */}
          <div style={{
            opacity: interpolate(frame, [460, 472], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `scale(${ctaScale})`,
            padding: "20px 52px", borderRadius: 9999,
            background: "#2151F5",
            boxShadow: "0 0 60px rgba(33,81,245,0.50), 0 0 120px rgba(33,81,245,0.20)",
            fontSize: 32, fontWeight: 700, color: colors.pureWhite,
            fontFamily: fonts.display, letterSpacing: "0.5px",
            cursor: "default",
          }}>加入企業種子驗證計畫 →</div>
        </div>
      </div>

      {/* footer */}
      <div style={{
        position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
        opacity: interpolate(frame, [540, 553], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        fontFamily: fonts.mono, fontSize: 13, color: colors.midGray,
        letterSpacing: "1px", whiteSpace: "nowrap",
      }}>讓他煮 · 國立臺灣科技大學 · 資管系 × 資工系 × 企管系 · 2026</div>

      <SubtitleBar />
    </AbsoluteFill>
  );
};
