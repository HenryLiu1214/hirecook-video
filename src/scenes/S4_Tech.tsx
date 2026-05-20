import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { momentAnim, rotXSettle, rotZIn, breathe } from "../anim";

const Beat: React.FC<{ text: string; sub?: string; start?: number; size?: number; scheme?: React.ComponentProps<typeof TypewriterText>["colorScheme"] }> = ({ text, sub, start = 10, size = 128, scheme = "white-to-blue" }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, start, 28, -8)}deg) rotateX(${rotXSettle(frame, start, 30)}deg)` }}>
      <TypewriterText text={text} startFrame={start} charStagger={3} fontSize={size} fontWeight={850} letterSpacing="-0.05em" colorScheme={scheme} />
    </div>
    {sub && <div style={{ color: colors.dimWhite, fontSize: 38, fontWeight: 600 }}>{sub}</div>}
  </AbsoluteFill>;
};

const Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  const left = ["履歷印象", "主管直覺", "靜態測驗"];
  const right = ["環境建模", "行為指紋", "TAT Playbook"];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 1120, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      {[{ title: "傳統方式", color: colors.hcRisk, items: left }, { title: "HireCook", color: colors.hcBlue, items: right }].map((col, ci) => <div key={col.title} style={{ padding: "34px 40px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: ci ? "rgba(33,81,245,0.08)" : "rgba(255,255,255,0.025)" }}>
        <div style={{ fontSize: 34, fontWeight: 750, color: col.color, marginBottom: 22 }}>{col.title}</div>
        {col.items.map((x, i) => <div key={x} style={{ opacity: interpolate(frame, [60 + i * 14, 72 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none" }}><span style={{ width: 7, height: 7, borderRadius: 999, background: col.color }} /><span style={{ color: colors.softWhite, fontSize: 30 }}>{x}</span></div>)}
      </div>)}
    </div>
  </AbsoluteFill>;
};

export const S4_Tech: React.FC = () => <AbsoluteFill>
  <BgCalm theme="dark" tint="blue" />
  <Sequence from={0} durationInFrames={180} layout="none"><Beat text="不是取代 HR" size={130} /></Sequence>
  <Sequence from={180} durationInFrames={180} layout="none"><Beat text="而是升級決策" size={130} /></Sequence>
  <Sequence from={360} durationInFrames={180} layout="none"><Beat text="From Gut Feeling" size={118} /></Sequence>
  <Sequence from={540} durationInFrames={180} layout="none"><Beat text="To Behavioral Intelligence" size={92} /></Sequence>
  <Sequence from={720} durationInFrames={240} layout="none"><Compare /></Sequence>
</AbsoluteFill>;
