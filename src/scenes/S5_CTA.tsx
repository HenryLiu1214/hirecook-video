import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence, Img, staticFile, Audio } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { scalePunch, cameraPush, circleWipe } from "../anim";

const Vision: React.FC = () => {
  const frame = useCurrentFrame();

  // Exit fade out
  const opacity = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Big SDG 8 text scale punch
  const textScale = scalePunch(frame, 10, 40);

  // Image sliding out from under text
  const imgY = interpolate(frame, [40, 70], [0, 180], { easing: Easing.out(Easing.back(1.5)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imgOp = interpolate(frame, [40, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display, opacity, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: fonts.display, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>

        {/* The SDG Image scaling up */}
        <div style={{
          fontFamily: fonts.display,
          transform: `scale(${interpolate(frame, [10, 40], [0, 1], { easing: Easing.out(Easing.back(1.5)), extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          boxShadow: "0 24px 80px rgba(8,16,40,0.15)",
          borderRadius: 12,
          overflow: "hidden",
          background: "#FFF",
        }}>
          <Img src={staticFile("sdg8.png")} style={{ fontFamily: fonts.display, width: 360, height: 360, objectFit: "cover" }} />
        </div>

      </div>

      <div style={{
        marginTop: 60,
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [80, 100], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        color: colors.hcBlue, // Adjusted for light mode 
        fontSize: 42,
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontFamily: fonts.display
      }}>
        落實尊嚴勞動，降低就業摩擦
      </div>
    </AbsoluteFill>
  );
};

const BrandCore: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [220, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Camera push that slowly zooms in
  const camScale = cameraPush(frame, 0, 240, 1.2);

  // Transition from "能力決定錄取" to "性格決定留任"
  const text1Op = interpolate(frame, [20, 40, 100, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const text2Op = interpolate(frame, [110, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display, opacity, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${camScale})` }}>
      <div style={{
        position: "absolute",
        fontFamily: fonts.display,
        fontSize: 100,
        fontWeight: 850,
        color: colors.hcFgPrimary, // Dark ink 
        opacity: text1Op
      }}>
        能力決定錄取
      </div>
      <div style={{
        position: "absolute",
        fontFamily: fonts.display,
        fontSize: 110,
        fontWeight: 900,
        color: colors.hcBlue, // Dark blue for contrast
        opacity: text2Op,
        textShadow: `0 10px 40px rgba(33,81,245,0.2)`
      }}>
        性格決定留任
      </div>
    </AbsoluteFill>
  );
};

const CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Wipe metrics sequentially
  const m1Clip = circleWipe(frame, 10, 40);
  const m1Op = interpolate(frame, [140, 160], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const m2Clip = circleWipe(frame, 150, 40);
  const m2Op = interpolate(frame, [260, 280], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Final Logo and CTA
  const finalScale = scalePunch(frame, 270, 40);
  const ripple = interpolate(frame, [310, 400], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleOp = interpolate(frame, [310, 400], [0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>

      {/* Metric 1 */}
      {frame >= 10 && frame < 170 && (
        <div style={{ fontFamily: fonts.display, position: "absolute", clipPath: m1Clip, opacity: m1Op, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700, color: colors.hcFgMuted, marginBottom: 10 }}>防堵錯配</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 130, fontWeight: 800, color: colors.hcBlueDark, fontVariantNumeric: "tabular-nums" }}>回本 6 倍</div>
        </div>
      )}

      {/* Metric 2 */}
      {frame >= 150 && frame < 290 && (
        <div style={{ fontFamily: fonts.display, position: "absolute", clipPath: m2Clip, opacity: m2Op, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700, color: colors.hcFgMuted, marginBottom: 10 }}>政府專案補助</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 130, fontWeight: 800, color: colors.hcBlue, fontVariantNumeric: "tabular-nums" }}>首年 0 成本</div>
        </div>
      )}

      {/* Final Logo and Button */}
      {frame >= 270 && (
        <div style={{ fontFamily: fonts.display, position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${finalScale})` }}>
          <div style={{ fontFamily: fonts.display, display: "flex", alignItems: "center", gap: 30, marginBottom: 60 }}>
            <HcLogoMark size={110} />
            <div style={{ fontFamily: fonts.display, fontSize: 140, fontWeight: 900, color: colors.hcBlueDark, letterSpacing: "-0.04em" }}>HireCook</div>
          </div>

          <div style={{ fontFamily: fonts.display, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: fonts.display, position: "absolute", width: ripple, height: ripple, borderRadius: "50%", border: `2px solid ${colors.hcCyan}`, opacity: rippleOp }} />
            <div style={{
              padding: "24px 60px",
              borderRadius: 999,
              background: `linear-gradient(135deg, ${colors.hcBlue}, ${colors.hcCyan})`,
              color: colors.pureWhite,
              fontSize: 36,
              fontWeight: 800,
              boxShadow: `0 18px 40px rgba(33,81,245,0.3), inset 0 1px 0 rgba(255,255,255,0.3)`,
              fontFamily: fonts.display,
              zIndex: 2
            }}>
              加入企業種子驗證計畫 →
            </div>
          </div>

          <div style={{
            opacity: interpolate(frame, [300, 320], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            color: colors.hcFgMuted,
            fontFamily: fonts.mono,
            fontSize: 16,
            letterSpacing: "0.15em",
            marginTop: 40
          }}>
            讓他煮 · 國立臺灣科技大學 · 2026
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};

export const S5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="blue" />

      {/* ── Audio ── */}
      {/* Vision Swell */}
      <Sequence from={0} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNEthr_GHOSTS Swell Riser Vaporous_ASD.wav")} volume={(f) => interpolate(f, [0, 80], [0, 0.35], cl)} /></Sequence>
      {/* SDG8 image bounce-in */}
      <Sequence from={10} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic Generic Building Block, Aura, Glyph, Activation, Shimmer, Metal Ring, Short, Medium 03_ASD.wav")} volume={0.25} /></Sequence>

      {/* Brand Core Impact */}
      <Sequence from={240} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic Generic Building Block, Aura, Glyph, Activation, Shimmer, Metal Ring, Short, Medium 03_ASD.wav")} volume={0.35} /></Sequence>

      {/* CTA final Logo & Button appear (480 + 270 = 750) */}
      <Sequence from={750} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic White Fairy Dust, Chime, Shimmer, Cliche, Short, Appear 05_ASD.wav")} volume={0.4} />
      </Sequence>

      {/* ── Additional Micro-Interactions ── */}
      <Sequence from={490} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/GAMEMisc_Dice On Metal, Throw And Roll, Standard, 1 One Dice, x3 Variations_ASD.wav")} volume={0.3} /></Sequence>
      <Sequence from={630} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/GAMEMisc_Dice On Metal, Throw And Roll, Standard, 1 One Dice, x3 Variations_ASD.wav")} volume={0.3} /></Sequence>
      <Sequence from={517} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNRise_Magic Energy Spell, Electricity, Large, Cast, Charge, Projectile 02_ASD.wav")} volume={0.25} /></Sequence>

      <Sequence from={0} durationInFrames={240} layout="none"><Vision /></Sequence>
      <Sequence from={240} durationInFrames={240} layout="none"><BrandCore /></Sequence>
      <Sequence from={480} durationInFrames={552} layout="none"><CTA /></Sequence>
    </AbsoluteFill>
  );
};
