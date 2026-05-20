import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S4: 900 frames (15s)
// Left/Right comparison: 傳統方式 vs HireCook — calm hairline layout
export const S4_Tech: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m1 = momentAnim(frame, 0, 11, 90000, 99999);

  const traditionalItems = [
    "履歷 · 面試印象",
    "主管直覺",
    "靜態人格測驗",
    "一次性錄用決策",
  ] as const;
  const hirecookItems = [
    "環境建模 · 行為指紋",
    "科學化情境測驗",
    "可解釋 AI (XAI)",
    "TAT 人才使用手冊",
  ] as const;

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />

      <div style={{
        position: "absolute", inset: 0, opacity: m1.opacity, transform: m1.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56,
        perspective: "1400px",
      }}>
        {/* title */}
        <div style={{ transform: `rotate(${rotZIn(frame, 22, 26, -8)}deg) skewX(${skewSettle(frame, 22, 24)}deg)` }}>
          <TypewriterText text="告別直覺，擁抱行為智能" startFrame={22} charStagger={3}
            fontSize={56} fontWeight={700} colorScheme="white-to-purple" />
        </div>

        {/* comparison card (hairline only — no glow) */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 0,
          display: "flex",
          width: 1160,
          minHeight: 460,
        }}>
          {/* left column */}
          <div style={{
            flex: 1, padding: "44px 48px",
            display: "flex", flexDirection: "column", gap: 28, boxSizing: "border-box",
          }}>
            <div style={{
              opacity: interpolate(frame, [60, 73], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              fontSize: 32, fontWeight: 700, color: "#B83A2E", fontFamily: fonts.display, letterSpacing: "-0.01em",
            }}>傳統方式</div>
            {traditionalItems.map((item, i) => {
              const itemStart = 80 + i * 20;
              const itemOp = interpolate(frame, [itemStart, itemStart + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const rz = rotZIn(frame, itemStart, 22, -6);
              return (
                <div key={item} style={{ opacity: itemOp, transform: `rotate(${rz}deg)`, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B83A2E", flexShrink: 0 }} />
                  <span style={{ fontSize: 28, color: colors.dimWhite, fontFamily: fonts.display }}>{item}</span>
                </div>
              );
            })}
          </div>

          {/* center divider */}
          <div style={{ width: 1, alignSelf: "stretch", background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

          {/* right column */}
          <div style={{
            flex: 1, padding: "44px 48px",
            display: "flex", flexDirection: "column", gap: 28, boxSizing: "border-box",
          }}>
            <div style={{
              opacity: interpolate(frame, [60, 73], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              fontSize: 32, fontWeight: 700, color: "#2151F5", fontFamily: fonts.display, letterSpacing: "-0.01em",
            }}>HireCook</div>
            {hirecookItems.map((item, i) => {
              const itemStart = 80 + i * 20;
              const itemOp = interpolate(frame, [itemStart, itemStart + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const rz = rotZIn(frame, itemStart, 22, 6);
              return (
                <div key={item} style={{ opacity: itemOp, transform: `rotate(${rz}deg)`, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2151F5", flexShrink: 0 }} />
                  <span style={{ fontSize: 28, color: colors.softWhite, fontFamily: fonts.display }}>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* big closing text */}
        <div style={{
          opacity: interpolate(frame, [500, 513], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 500, 34, -12)}deg) rotateX(${rotXSettle(frame, 500, 36)}deg)`,
        }}>
          <TypewriterText text="Not Just a Score. A Playbook." startFrame={500} charStagger={4}
            fontSize={96} fontWeight={900} letterSpacing="-3px" colorScheme="white-to-blue" />
        </div>
      </div>

      <SubtitleBar />
    </AbsoluteFill>
  );
};
