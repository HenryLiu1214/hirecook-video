import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence, Img, staticFile } from "remotion";
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
    <AbsoluteFill style={{ opacity, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        
        {/* The SDG Image sliding down */}
        <div style={{ 
          position: "absolute",
          transform: `translateY(${imgY}px) scale(0.6)`,
          opacity: imgOp,
          zIndex: 1,
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          borderRadius: 12,
          overflow: "hidden",
          background: "#FFF",
        }}>
          <Img src={staticFile("sdg8.png")} style={{ width: 220, height: 220, objectFit: "cover" }} />
        </div>

        {/* Giant SDG text over top */}
        <div style={{ 
          zIndex: 2,
          transform: `scale(${textScale})`,
          fontFamily: fonts.display,
          fontSize: 140,
          fontWeight: 900,
          color: colors.pureWhite,
          letterSpacing: "-0.02em",
          textShadow: "0 20px 40px rgba(0,0,0,0.5)"
        }}>
          SDG 8: DECENT WORK
        </div>

      </div>

      <div style={{ 
        marginTop: 220,
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [80, 100], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        color: colors.hcCyanBright, 
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
    <AbsoluteFill style={{ opacity, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${camScale})` }}>
      <div style={{ 
        position: "absolute",
        fontFamily: fonts.display, 
        fontSize: 100, 
        fontWeight: 850, 
        color: colors.pureWhite, 
        opacity: text1Op 
      }}>
        能力決定錄取
      </div>
      <div style={{ 
        position: "absolute",
        fontFamily: fonts.display, 
        fontSize: 110, 
        fontWeight: 900, 
        color: colors.hcCyanBright, 
        opacity: text2Op,
        textShadow: `0 0 40px ${colors.hcBlue}`
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
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      
      {/* Metric 1 */}
      {frame >= 10 && frame < 170 && (
        <div style={{ position: "absolute", clipPath: m1Clip, opacity: m1Op, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700, color: colors.dimWhite, marginBottom: 10 }}>防堵錯配</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 130, fontWeight: 800, color: colors.pureWhite, fontVariantNumeric: "tabular-nums" }}>回本 6 倍</div>
        </div>
      )}

      {/* Metric 2 */}
      {frame >= 150 && frame < 290 && (
        <div style={{ position: "absolute", clipPath: m2Clip, opacity: m2Op, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700, color: colors.dimWhite, marginBottom: 10 }}>政府專案補助</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 130, fontWeight: 800, color: colors.hcCyanBright, fontVariantNumeric: "tabular-nums" }}>首年 0 成本</div>
        </div>
      )}

      {/* Final Logo and Button */}
      {frame >= 270 && (
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${finalScale})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 60 }}>
            <HcLogoMark size={110} />
            <div style={{ fontFamily: fonts.display, fontSize: 140, fontWeight: 900, color: colors.pureWhite, letterSpacing: "-0.04em" }}>HireCook</div>
          </div>

          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: ripple, height: ripple, borderRadius: "50%", border: `2px solid ${colors.hcCyanBright}`, opacity: rippleOp }} />
            <div style={{ 
              padding: "24px 60px", 
              borderRadius: 999, 
              background: colors.hcBlue, 
              border: `1px solid ${colors.hcCyanBright}`,
              color: colors.pureWhite, 
              fontSize: 36, 
              fontWeight: 800, 
              boxShadow: `0 0 30px ${colors.hcBlue}, inset 0 1px 0 rgba(255,255,255,0.2)`,
              fontFamily: fonts.display,
              zIndex: 2
            }}>
              加入企業種子驗證計畫 →
            </div>
          </div>
          
          <div style={{ 
            opacity: interpolate(frame, [300, 320], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            color: colors.dimWhite, 
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
  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <Sequence from={0} durationInFrames={240} layout="none"><Vision /></Sequence>
      <Sequence from={240} durationInFrames={240} layout="none"><BrandCore /></Sequence>
      <Sequence from={480} durationInFrames={372} layout="none"><CTA /></Sequence>
    </AbsoluteFill>
  );
};
