import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { TypewriterText } from "../components/TypewriterText";
import { momentAnim, breathe, rotXSettle, rotZIn } from "../anim";

const Vision: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
    <div style={{ padding: "9px 22px", borderRadius: 999, background: colors.hcFitBg, border: `1px solid ${colors.hcFitBorder}`, color: colors.hcFit, fontFamily: fonts.mono, fontSize: 20, fontWeight: 700, letterSpacing: "0.12em" }}>UN SDG 8</div>
    <TypewriterText text="降低就業摩擦" startFrame={24} charStagger={4} fontSize={128} fontWeight={850} colorScheme="white-to-cyan" />
  </AbsoluteFill>;
};

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 258, 270);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, 12, 30, -8)}deg) rotateX(${rotXSettle(frame, 12, 32)}deg)`, display: "flex", alignItems: "center", gap: 26 }}>
      <HcLogoMark size={96} />
      <TypewriterText text="HireCook" startFrame={18} charStagger={5} fontSize={150} fontWeight={850} colorScheme="white-to-blue" />
    </div>
    <TypewriterText text="正確烹煮人才，讓他煮。" startFrame={120} charStagger={3} fontSize={44} fontWeight={600} colorScheme="white" />
  </AbsoluteFill>;
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 378, 390);
  const scale = interpolate(frame, [64, 78], [0.78, 1], { easing: Easing.out(Easing.back(1.18)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = interpolate(frame, [120, 260], [0, 280], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleOp = interpolate(frame, [120, 260], [0.38, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: ripple, height: ripple, borderRadius: "50%", border: `1px solid ${colors.hcBlue}`, opacity: rippleOp }} />
      <div style={{ transform: `scale(${scale})`, padding: "18px 44px", borderRadius: 999, background: colors.hcBlue, color: "#FFFFFF", fontSize: 30, fontWeight: 700, boxShadow: "0 1px 0 rgba(8,16,40,0.04)" }}>加入企業種子驗證計畫 →</div>
    </div>
    <div style={{ color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 14, letterSpacing: "0.08em" }}>讓他煮 · 國立臺灣科技大學 · 2026</div>
  </AbsoluteFill>;
};

export const S5_CTA: React.FC = () => <AbsoluteFill>
  <BgCalm theme="dark" tint="blue" />
  <Sequence from={0} durationInFrames={180} layout="none"><Vision /></Sequence>
  <Sequence from={180} durationInFrames={270} layout="none"><Brand /></Sequence>
  <Sequence from={450} durationInFrames={390} layout="none"><CTA /></Sequence>
</AbsoluteFill>;
