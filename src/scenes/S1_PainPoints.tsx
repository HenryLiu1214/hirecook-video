import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { LucideIcon } from "../components/LucideIcon";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

const card = {
  background: "#FFFFFF",
  border: "1px solid rgba(8,16,40,0.06)",
  boxShadow: "0 1px 0 rgba(8,16,40,0.04)",
  borderRadius: 12,
} satisfies React.CSSProperties;

const Counter: React.FC<{ value: number; suffix?: string; decimals?: number; start?: number; fontSize?: number; color?: string }> = ({
  value, suffix = "", decimals = 0, start = 18, fontSize = 220, color = colors.hcFgPrimary,
}) => {
  const frame = useCurrentFrame();
  const n = interpolate(frame, [start, start + 36], [0, value], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sc = interpolate(frame, [start, start + 12], [0.78, 1], { easing: Easing.out(Easing.back(1.15)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (decimals > 0) {
    const intPart = Math.floor(n);
    const decPart = Math.round((n - intPart) * 10);
    return (
      <div style={{ transform: `scale(${sc})`, display: "flex", alignItems: "baseline", justifyContent: "center", fontFamily: fonts.mono, color, lineHeight: 0.9, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ fontSize, fontWeight: 800, letterSpacing: "-0.04em" }}>{intPart}</span>
        <span style={{ fontSize: fontSize * 0.62, fontWeight: 800, margin: "0 2px" }}>.</span>
        <span style={{ fontSize: fontSize * 0.72, fontWeight: 800, letterSpacing: "-0.02em" }}>{decPart}</span>
        <span style={{ fontSize: fontSize * 0.42, fontWeight: 800, marginLeft: 10 }}>{suffix}</span>
      </div>
    );
  }
  const text = Math.round(n).toString();
  return <div style={{ transform: `scale(${sc})`, fontSize, lineHeight: 0.9, fontWeight: 800, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums", fontFamily: fonts.mono, color }}>{text}<span style={{ fontSize: fontSize * 0.42, color, marginLeft: 10 }}>{suffix}</span></div>;
};

const Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, perspective: "1400px" }}>
    <div style={{ fontFamily: fonts.mono, color: colors.hcFgMuted, fontSize: 24, letterSpacing: "0.14em", textTransform: "uppercase" }}>for growing SMBs</div>
    <div style={{ transform: `rotate(${rotZIn(frame, 18, 26, -7)}deg) rotateX(${rotXSettle(frame, 18, 30)}deg)` }}>
      <TypewriterText text="30–150 人" startFrame={18} charStagger={4} fontSize={230} fontWeight={800} letterSpacing="-0.05em" colorScheme="plum-to-pink" />
    </div>
    <div style={{ opacity: interpolate(frame, [110, 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), color: colors.hcFgSecondary, fontSize: 52, fontWeight: 600 }}>成長型中小企業的招募現場</div>
  </AbsoluteFill>;
};

const GutFeeling: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34, perspective: "1400px" }}>
    <div style={{ color: colors.hcFgMuted, fontFamily: fonts.mono, fontSize: 24, letterSpacing: "0.14em" }}>THE DECISION OFTEN STARTS WITH</div>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, 14, 28, -8)}deg) rotateX(${rotXSettle(frame, 14, 34)}deg)` }}>
      <TypewriterText text="這個人感覺很適合。" startFrame={14} charStagger={4} fontSize={142} fontWeight={800} letterSpacing="-0.04em" colorScheme="plum-to-pink" />
    </div>
  </AbsoluteFill>;
};

const Pills: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  const pills = [
    { label: "履歷包裝", color: colors.hcRisk },
    { label: "靜態測驗", color: colors.hcWatch },
    { label: "主管直覺", color: colors.hcBlue },
  ];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
    <div style={{ color: colors.hcFgPrimary, fontSize: 86, fontWeight: 750, letterSpacing: "-0.04em" }}>但現場看到的，通常只是——</div>
    <div style={{ display: "flex", gap: 20 }}>
      {pills.map((p, i) => {
        const op = interpolate(frame, [80 + i * 18, 92 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [80 + i * 18, 96 + i * 18], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={p.label} style={{ opacity: op, transform: `translateY(${y}px) rotate(${rotZIn(frame, 80 + i * 18, 20, i % 2 ? 5 : -5)}deg)`, padding: "18px 34px", borderRadius: 999, border: `1px solid ${p.color}55`, background: "#FFFFFF", color: p.color, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, letterSpacing: "0.04em" }}>{p.label}</div>;
      })}
    </div>
  </AbsoluteFill>;
};

const Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 108, 120);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <TypewriterText text="代價，正在發生。" startFrame={10} charStagger={4} fontSize={158} fontWeight={800} colorScheme="white-to-blue" />
  </AbsoluteFill>;
};

const StatCard: React.FC<{ icon: React.ComponentProps<typeof LucideIcon>["name"]; eyebrow: string; value: number; decimals?: number; suffix: string; caption: string; color: string }> = ({ icon, eyebrow, value, decimals = 0, suffix, caption, color }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ ...card, width: 980, minHeight: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
      <div style={{ width: 72, height: 72, borderRadius: 16, background: `${color}12`, border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", color }}><LucideIcon name={icon} size={38} /></div>
      <div style={{ color: colors.hcFgMuted, fontFamily: fonts.mono, fontSize: 22, letterSpacing: "0.14em" }}>{eyebrow}</div>
      <Counter value={value} decimals={decimals} suffix={suffix} color={color} />
      <div style={{ color: colors.hcFgSecondary, fontSize: 36, fontWeight: 600 }}>{caption}</div>
    </div>
  </AbsoluteFill>;
};

const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ ...card, width: 980, minHeight: 470, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ width: 72, height: 72, borderRadius: 16, background: `${colors.hcRisk}12`, border: `1px solid ${colors.hcRisk}33`, display: "flex", alignItems: "center", justifyContent: "center", color: colors.hcRisk }}><LucideIcon name="coins" size={38} /></div>
      <div style={{ color: colors.hcFgMuted, fontFamily: fonts.mono, fontSize: 22, letterSpacing: "0.14em" }}>代價高</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 62, fontWeight: 700, color: colors.hcRisk }}>NT$</span>
        <Counter value={30} fontSize={210} color={colors.hcRisk} />
        <span style={{ fontFamily: fonts.display, fontSize: 82, fontWeight: 800, color: colors.hcRisk }}>萬</span>
      </div>
      <div style={{ color: colors.hcFgSecondary, fontSize: 36, fontWeight: 600 }}>單次錯配成本</div>
    </div>
  </AbsoluteFill>;
};

const Combine: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 108, 120);
  const items = ["60.3 天", "65.4%", "NT$ 20–30 萬"];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
    <TypewriterText text="三個數字，一個系統性問題" startFrame={8} charStagger={2} fontSize={54} fontWeight={700} colorScheme="white" />
    <div style={{ display: "flex", gap: 18 }}>{items.map((it, i) => <div key={it} style={{ padding: "26px 34px", minWidth: 330, borderRadius: 10, border: "1px solid rgba(255,255,255,0.10)", color: "#FFFFFF", fontFamily: fonts.mono, fontSize: 40, textAlign: "center", opacity: interpolate(frame, [48 + i * 10, 58 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{it}</div>)}</div>
  </AbsoluteFill>;
};

const Hidden: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 108, 120);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", gap: 42 }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: 1120 }}>
      {[{ title: "看得到", icon: "eye", items: ["履歷", "面試表達", "測驗標籤"] }, { title: "看不到", icon: "eye-off", items: ["壓力反應", "決策邏輯", "協作適應"] }].map((col, idx) => <div key={col.title} style={{ ...card, padding: "34px 38px", background: idx ? "#F7F8FB" : "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, color: idx ? colors.hcBlue : colors.hcFgMuted }}><LucideIcon name={col.icon as any} size={28} /><span style={{ fontSize: 34, fontWeight: 750 }}>{col.title}</span></div>
        {col.items.map((x, i) => <div key={x} style={{ fontSize: 30, color: colors.hcFgSecondary, padding: "11px 0", borderTop: i ? `1px solid ${colors.hcHairline}` : "none" }}>{x}</div>)}
      </div>)}
    </div>
    <div style={{ position: "absolute", bottom: 100 }}><TypewriterText text="看不見的，才是關鍵。" startFrame={70} charStagger={3} fontSize={58} fontWeight={800} colorScheme="white-to-cyan" /></div>
  </AbsoluteFill>;
};

export const S1_PainPoints: React.FC = () => <AbsoluteFill>
  <Sequence from={0} durationInFrames={720} layout="none"><AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill></Sequence>
  <Sequence from={720} durationInFrames={1080} layout="none"><AbsoluteFill><BgCalm theme="dark" tint="blue" /></AbsoluteFill></Sequence>
  <Sequence from={0} durationInFrames={240} layout="none"><Audience /></Sequence>
  <Sequence from={240} durationInFrames={240} layout="none"><GutFeeling /></Sequence>
  <Sequence from={480} durationInFrames={240} layout="none"><Pills /></Sequence>
  <Sequence from={720} durationInFrames={120} layout="none"><Transition /></Sequence>
  <Sequence from={840} durationInFrames={240} layout="none"><StatCard icon="clock" eyebrow="找人難" value={60.3} decimals={1} suffix="天" caption="招募空窗期" color={colors.hcWatch} /></Sequence>
  <Sequence from={1080} durationInFrames={240} layout="none"><StatCard icon="trending-down" eyebrow="留不住" value={65.4} decimals={1} suffix="%" caption="六個月新人留任率" color={colors.hcRisk} /></Sequence>
  <Sequence from={1320} durationInFrames={240} layout="none"><Cost /></Sequence>
  <Sequence from={1560} durationInFrames={120} layout="none"><Combine /></Sequence>
  <Sequence from={1680} durationInFrames={120} layout="none"><Hidden /></Sequence>
</AbsoluteFill>;
