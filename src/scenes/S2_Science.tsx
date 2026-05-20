import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { TypewriterText } from "../components/TypewriterText";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

const BigBeat: React.FC<{ text: string; sub?: string; start?: number; colorScheme?: React.ComponentProps<typeof TypewriterText>["colorScheme"]; size?: number; dark?: boolean }> = ({ text, sub, start = 14, colorScheme = "plum-to-pink", size = 190, dark = false }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, perspective: "1400px" }}>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, start, 28, -8)}deg) rotateX(${rotXSettle(frame, start, 32)}deg)` }}>
      <TypewriterText text={text} startFrame={start} charStagger={4} fontSize={size} fontWeight={850} letterSpacing="-0.055em" colorScheme={colorScheme} />
    </div>
    {sub && <div style={{ opacity: interpolate(frame, [130, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 42, color: dark ? colors.dimWhite : colors.hcFgSecondary, fontWeight: 600 }}>{sub}</div>}
  </AbsoluteFill>;
};

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
    <div style={{ color: colors.hcFgMuted, fontSize: 44, fontWeight: 650 }}>別再憑直覺用人</div>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 32px", borderRadius: 999, background: "#FFFFFF", border: `1px solid ${colors.hcHairline}`, boxShadow: "0 1px 0 rgba(8,16,40,0.04)" }}>
      <HcLogoMark size={54} />
      <TypewriterText text="HireCook 真才實測" startFrame={60} charStagger={3} fontSize={48} fontWeight={750} colorScheme="plum-to-pink" />
    </div>
  </AbsoluteFill>;
};

const Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const chips = [{ k: "P", v: "人格特質", c: colors.hcCyan }, { k: "E", v: "職位環境", c: colors.hcBlue }, { k: "B", v: "真實行為", c: "#FFFFFF" }];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
    <div style={{ color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 25, letterSpacing: "0.16em" }}>LEWIN FORMULA</div>
    <TypewriterText text="B = f(P, E)" startFrame={20} charStagger={5} fontSize={360} fontWeight={850} letterSpacing="-0.07em" colorScheme="white-to-cyan" />
    <div style={{ display: "flex", gap: 16 }}>{chips.map((x, i) => <div key={x.k} style={{ opacity: interpolate(frame, [170 + i * 18, 183 + i * 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), padding: "14px 22px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.10)", color: x.c, fontFamily: fonts.mono, fontSize: 24 }}><b>{x.k}</b> · {x.v}</div>)}</div>
    <TypewriterText text="傳統工具只算 P，HireCook 同時測 E" startFrame={250} charStagger={2} fontSize={42} fontWeight={650} colorScheme="white" />
  </AbsoluteFill>;
};

const PE: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const overlap = interpolate(frame, [80, 180], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const px = -270 + overlap * 170;
  const ex = 270 - overlap * 170;
  const circle = (label: string, sub: string, color: string): React.CSSProperties => ({ width: 320, height: 320, borderRadius: "50%", border: `2px solid ${color}77`, background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", color });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26 }}>
    <div style={{ position: "relative", width: 900, height: 360 }}>
      <div style={{ position: "absolute", left: `calc(50% + ${px}px - 160px)`, top: 20, ...circle("P", "人格", colors.hcCyan) }}><div style={{ fontSize: 96, fontWeight: 850, fontFamily: fonts.mono }}>P</div><div style={{ fontSize: 24 }}>Personality</div></div>
      <div style={{ position: "absolute", left: `calc(50% + ${ex}px - 160px)`, top: 20, ...circle("E", "環境", colors.hcBlue) }}><div style={{ fontSize: 96, fontWeight: 850, fontFamily: fonts.mono }}>E</div><div style={{ fontSize: 24 }}>Environment</div></div>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: overlap * overlap, color: "#FFFFFF", fontFamily: fonts.mono, fontSize: 34, letterSpacing: "0.16em" }}>FIT</div>
    </div>
    <TypewriterText text="適配度越高，留任越穩" startFrame={210} charStagger={3} fontSize={86} fontWeight={800} colorScheme="white-to-cyan" />
  </AbsoluteFill>;
};

const Env: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  const items = ["團隊節奏", "壓力變動", "協作密度"];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28 }}>
    <TypewriterText text="E 不是感覺" startFrame={8} charStagger={4} fontSize={118} fontWeight={800} colorScheme="white-to-blue" />
    <div style={{ display: "flex", gap: 14 }}>{items.map((x, i) => <div key={x} style={{ opacity: interpolate(frame, [86 + i * 12, 98 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), padding: "16px 26px", borderRadius: 999, color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.10)", fontSize: 30, fontWeight: 650 }}>{x}</div>)}</div>
  </AbsoluteFill>;
};

const Scenarios: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  const tags = ["客戶突然退單", "主管同時催報表", "同事任務延遲", "時間倒數壓力"];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
    <TypewriterText text="Simulate the Pressure" startFrame={8} charStagger={3} fontSize={124} fontWeight={850} colorScheme="white-to-cyan" />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, width: 920 }}>{tags.map((x, i) => <div key={x} style={{ opacity: interpolate(frame, [90 + i * 12, 102 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), padding: "22px 28px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#FFFFFF", fontSize: 30, fontWeight: 650, textAlign: "center" }}>{x}</div>)}</div>
  </AbsoluteFill>;
};

export const S2_Science: React.FC = () => <AbsoluteFill>
  <Sequence from={0} durationInFrames={720} layout="none"><AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill></Sequence>
  <Sequence from={720} durationInFrames={1440} layout="none"><AbsoluteFill><BgCalm theme="dark" tint="blue" /></AbsoluteFill></Sequence>
  <Sequence from={0} durationInFrames={240} layout="none"><BigBeat text="Personality" sub="is not performance" size={210} /></Sequence>
  <Sequence from={240} durationInFrames={240} layout="none"><BigBeat text="Stop Hiring" sub="by Gut Feeling" size={205} /></Sequence>
  <Sequence from={480} durationInFrames={240} layout="none"><Brand /></Sequence>
  <Sequence from={720} durationInFrames={360} layout="none"><Formula /></Sequence>
  <Sequence from={1080} durationInFrames={360} layout="none"><PE /></Sequence>
  <Sequence from={1440} durationInFrames={180} layout="none"><Env /></Sequence>
  <Sequence from={1620} durationInFrames={240} layout="none"><Scenarios /></Sequence>
  <Sequence from={1860} durationInFrames={300} layout="none"><BigBeat text="讓對的人，進入對的環境。" size={104} colorScheme="white-to-cyan" dark /></Sequence>
</AbsoluteFill>;
