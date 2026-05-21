import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence, Video, staticFile } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { TypewriterText } from "../components/TypewriterText";
import { momentAnim, breathe, rotXSettle, rotZIn, rippleBurst, slashWipe } from "../anim";

const BigBeat: React.FC<{ text: string; sub?: string; start?: number; colorScheme?: React.ComponentProps<typeof TypewriterText>["colorScheme"]; size?: number; dark?: boolean; wipe?: "ripple" | "slash" }> = ({ text, sub, start = 14, colorScheme = "plum-to-pink", size = 190, dark = false, wipe }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  const cp = wipe === "ripple" ? rippleBurst(frame, 0, 34) : wipe === "slash" ? slashWipe(frame, 0, 24) : undefined;
  return <AbsoluteFill style={{ opacity: m.opacity, clipPath: cp, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, perspective: "1400px" }}>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, start, 28, -8)}deg) rotateX(${rotXSettle(frame, start, 32)}deg)` }}>
      <TypewriterText text={text} startFrame={start} charStagger={4} fontSize={size} fontWeight={850} letterSpacing="-0.055em" colorScheme={colorScheme} />
    </div>
    {sub && <div style={{ opacity: interpolate(frame, [112, 126], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), fontSize: 38, color: dark ? colors.dimWhite : colors.hcFgSecondary, fontWeight: 650 }}>{sub}</div>}
  </AbsoluteFill>;
};

const Brand: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  return <AbsoluteFill style={{ opacity: m.opacity, clipPath: slashWipe(frame, 0, 24), transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24 }}>
    <div style={{ color: colors.hcFgMuted, fontSize: 38, fontWeight: 650 }}>不再測「你像什麼人格」，而是模擬「你在這個環境下會怎麼工作」</div>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 32px", borderRadius: 999, background: "#FFFFFF", border: `1px solid ${colors.hcHairline}`, boxShadow: "0 1px 0 rgba(8,16,40,0.04)" }}>
      <HcLogoMark size={54} />
      <TypewriterText text="HireCook 真才實測" startFrame={60} charStagger={3} fontSize={48} fontWeight={750} colorScheme="plum-to-pink" />
    </div>
  </AbsoluteFill>;
};

const Formula: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const chips = [{ k: "P", v: "Personality", c: colors.hcCyan }, { k: "E", v: "Environment", c: colors.hcBlue }, { k: "B", v: "Behavior", c: "#FFFFFF" }];
  const formulaChars = "B = f(P, E)".split("");
  const settle = interpolate(frame, [142, 196], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const formulaY = interpolate(settle, [0, 1], [0, -98]);
  const formulaScale = interpolate(settle, [0, 1], [1, 0.78]);
  const formulaOpacity = interpolate(frame, [316, 356], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(111,227,245,0.18), transparent 40%), radial-gradient(circle at 50% 70%, rgba(33,81,245,0.20), transparent 45%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.20, backgroundImage: "radial-gradient(circle, rgba(111,227,245,0.38) 1px, transparent 1px)", backgroundSize: "34px 34px", transform: `scale(${1 + settle * 0.03})` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 108, opacity: interpolate(frame, [8, 28, 120, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textAlign: "center", color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 25, letterSpacing: "0.16em" }}>LEWIN FORMULA</div>

    <div style={{ position: "absolute", left: "50%", top: "50%", width: 1680, opacity: formulaOpacity, transform: `translate(-50%, -50%) translateY(${formulaY}px) scale(${formulaScale})`, transformOrigin: "center center", textAlign: "center", whiteSpace: "nowrap", fontFamily: fonts.display, fontSize: 300, fontWeight: 850, lineHeight: 0.92, letterSpacing: "-0.07em" }}>
      {formulaChars.map((char, i) => {
        const ce = frame - 20 - i * 5;
        const op = interpolate(ce, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ty = interpolate(ce, [0, 13], [0.32, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sc = interpolate(ce, [0, 15], [0.56, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ratio = formulaChars.length > 1 ? i / (formulaChars.length - 1) : 0;
        const color = ratio < 0.45 ? "#FFFFFF" : ratio < 0.72 ? colors.hcCyanBright : colors.hcCyan;
        return <span key={i} style={{ display: "inline-block", opacity: op, transform: `translateY(${ty}em) scale(${sc})`, color }}>{char === " " ? "\u00A0" : char}</span>;
      })}
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 648, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: interpolate(frame, [156, 190, 324, 356], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {chips.map((x, i) => {
        const y = interpolate(frame, [156 + i * 10, 188 + i * 10], [18, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={x.k} style={{ transform: `translateY(${y}px)`, padding: "12px 18px", borderRadius: 999, background: "rgba(5,7,12,0.54)", border: `1px solid ${x.c}44`, boxShadow: `0 18px 60px ${x.c}14`, display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ color: x.c, fontFamily: fonts.mono, fontSize: 24, fontWeight: 900, textShadow: `0 0 22px ${x.c}55` }}>{x.k}</span>
          <span style={{ color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 19, fontWeight: 850 }}>·</span>
          <span style={{ color: "#FFFFFF", fontFamily: fonts.mono, fontSize: 21, fontWeight: 850 }}>{x.v}</span>
        </div>;
      })}
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 728, opacity: interpolate(frame, [198, 234, 324, 356], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [198, 234], [26, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, textAlign: "center", color: "#FFFFFF", fontSize: 36, fontWeight: 760, letterSpacing: "-0.025em" }}>
      行為，是人格與環境交互作用的結果
    </div>
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
      <div style={{ position: "absolute", left: `calc(50% + ${px}px - 160px)`, top: 20, ...circle("P", "Personality", colors.hcCyan) }}><div style={{ fontSize: 96, fontWeight: 850, fontFamily: fonts.mono }}>P</div><div style={{ fontSize: 24 }}>Personality</div></div>
      <div style={{ position: "absolute", left: `calc(50% + ${ex}px - 160px)`, top: 20, ...circle("E", "Environment", colors.hcBlue) }}><div style={{ fontSize: 96, fontWeight: 850, fontFamily: fonts.mono }}>E</div><div style={{ fontSize: 24 }}>Environment</div></div>
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: overlap * overlap, color: "#FFFFFF", fontFamily: fonts.mono, fontSize: 64, fontWeight: 850, letterSpacing: "0.08em" }}>FIT</div>
    </div>
    <TypewriterText text="P-E Fit 決定適配" startFrame={210} charStagger={3} fontSize={92} fontWeight={850} colorScheme="white-to-cyan" />
  </AbsoluteFill>;
};

const RobotAgent: React.FC<{ size: number; boot?: number; label?: string; bodyColor?: string; compact?: boolean }> = ({ size, boot = 1, label, bodyColor = colors.hcBlueDark, compact = false }) => {
  const faceW = size * 0.52;
  const faceH = size * 0.38;
  const eyeW = size * (0.09 + boot * 0.01);
  const eyeH = size * (0.012 + boot * 0.078);
  return <div style={{ width: size, height: compact ? size * 1.22 : size, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: compact ? size * 0.12 : 0, width: size, height: size, borderRadius: "50%", background: `linear-gradient(145deg, #0B1434, ${bodyColor})`, border: `${Math.max(2, size * 0.015)}px solid rgba(111,227,245,0.45)`, boxShadow: `0 0 ${size * 0.16 + boot * size * 0.18}px rgba(111,227,245,${0.18 + boot * 0.25}), 0 ${size * 0.08}px ${size * 0.16}px rgba(33,81,245,0.18)` }} />
    <div style={{ position: "absolute", left: "50%", top: compact ? size * 0.43 : size * 0.49, width: faceW, height: faceH, transform: "translate(-50%, -50%)", borderRadius: size * 0.07, background: "rgba(255,255,255,0.11)", border: "1px solid rgba(255,255,255,0.18)" }}>
      <div style={{ position: "absolute", left: faceW * 0.23, top: faceH * 0.34, width: eyeW, height: eyeH, borderRadius: 999, background: colors.hcCyanBright, boxShadow: "0 0 18px rgba(111,227,245,0.88)" }} />
      <div style={{ position: "absolute", right: faceW * 0.23, top: faceH * 0.34, width: eyeW, height: eyeH, borderRadius: 999, background: colors.hcCyanBright, boxShadow: "0 0 18px rgba(111,227,245,0.88)" }} />
      <div style={{ position: "absolute", left: faceW * 0.27, right: faceW * 0.27, bottom: faceH * 0.24, height: Math.max(4, size * (0.018 + boot * 0.012)), borderRadius: 999, background: colors.hcCyanBright, transform: `scaleX(${0.22 + boot * 0.78})`, transformOrigin: "left center", boxShadow: "0 0 16px rgba(111,227,245,0.62)" }} />
    </div>
    {compact && <div style={{ position: "absolute", left: size * 0.26, right: size * 0.26, top: size * 0.02, height: size * 0.12, borderRadius: `${size * 0.08}px ${size * 0.08}px ${size * 0.03}px ${size * 0.03}px`, background: "#FFFFFF", boxShadow: "0 0 0 2px rgba(8,16,40,0.10)" }} />}
    {label && <div style={{ position: "absolute", left: -size * 0.16, right: -size * 0.16, bottom: 0, textAlign: "center", color: colors.hcFgPrimary, fontFamily: fonts.mono, fontSize: Math.max(12, size * 0.12), fontWeight: 900 }}>{label}</div>}
  </div>;
};

const BaselineBreak: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 228, 240);
  const fallY = interpolate(frame, [0, 56], [-260, 260], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stoneSc = interpolate(frame, [0, 32, 84, 116], [0.92, 1, 1, 1.08], { easing: Easing.out(Easing.back(0.9)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blast = interpolate(frame, [78, 110], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stoneOp = interpolate(frame, [88, 120], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const formulaOp = interpolate(frame, [48, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const laserW = interpolate(frame, [70, 94], [0, 1360], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const claimOp = interpolate(frame, [116, 142], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const debris = [
    { x: -420, y: -150, r: -28, s: 0.9 },
    { x: 360, y: -120, r: 35, s: 0.7 },
    { x: -280, y: 180, r: 48, s: 0.62 },
    { x: 440, y: 140, r: -42, s: 0.82 },
    { x: 90, y: -240, r: 18, s: 0.55 },
    { x: -40, y: 230, r: -18, s: 0.64 },
  ];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 48%, rgba(33,81,245,0.26), transparent 58%), radial-gradient(circle at 50% 58%, rgba(184,58,46,0.18), transparent 46%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.24, backgroundImage: "radial-gradient(circle, rgba(111,227,245,0.50) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

    <div style={{
      position: "absolute",
      left: "50%",
      top: "44%",
      width: 780,
      minHeight: 250,
      opacity: stoneOp,
      transform: `translate(-50%, -50%) translateY(${fallY}px) scale(${stoneSc}) rotate(${rotZIn(frame, 0, 44, -5)}deg)`,
      borderRadius: "44% 56% 48% 52% / 48% 42% 58% 52%",
      background: "linear-gradient(135deg, #4B5563, #151A24 58%, #080B12)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 42px 130px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "44px 60px",
      boxSizing: "border-box" as const,
      textAlign: "center" as const,
    }}>
      <div style={{ color: "#FFFFFF", fontSize: 40, fontWeight: 850, letterSpacing: "-0.035em", lineHeight: 1.18 }}>
        <span style={{ color: colors.hcRisk }}>✕</span> 建立基準需要<br />數月內部歷史數據
      </div>
    </div>

    <div style={{ position: "absolute", left: "50%", top: "47%", transform: "translate(-50%, -50%)", opacity: formulaOp, color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 118, fontWeight: 900, textShadow: `0 0 ${28 + blast * 48}px rgba(111,227,245,${0.58 + blast * 0.32})`, letterSpacing: "-0.055em" }}>
      B = f(P, E)
    </div>
    <div style={{ position: "absolute", left: "50%", top: "47%", width: laserW, height: 5, opacity: formulaOp, transform: "translate(-50%, -50%) rotate(-7deg)", background: "linear-gradient(90deg, transparent, #6FE3F5, #FFFFFF, #6FE3F5, transparent)", boxShadow: "0 0 36px rgba(111,227,245,0.92)" }} />

    {debris.map((d, i) => {
      const op = interpolate(frame, [82, 100, 152], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const x = interpolate(frame, [82, 152], [0, d.x], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const y = interpolate(frame, [82, 152], [0, d.y], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return <div key={i} style={{ position: "absolute", left: "50%", top: "44%", width: 90 * d.s, height: 70 * d.s, opacity: op, transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${d.r + frame * 0.35}deg)`, borderRadius: "38% 62% 50% 50%", background: "linear-gradient(135deg, #5D6675, #121722)", border: "1px solid rgba(255,255,255,0.08)" }} />;
    })}

    <div style={{ position: "absolute", left: 0, right: 0, bottom: 140, opacity: claimOp, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18 }}>
      <div style={{ color: "#FFFFFF", fontSize: 96, fontWeight: 900, letterSpacing: "-0.06em" }}>無需內部歷史數據！</div>
      <div style={{ color: colors.hcCyanBright, fontSize: 40, fontWeight: 760, letterSpacing: "-0.025em" }}>因為我們讓 AI 先幫你玩了。</div>
    </div>
  </AbsoluteFill>;
};

const SimulationPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const chips = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
  ];
  const chipColors = [colors.hcCyanBright, colors.hcBlue, colors.hcRisk, colors.hcWatch, "#FFFFFF", "#8BAFF5"];
  const phase1 = interpolate(frame, [0, 96], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase2 = interpolate(frame, [88, 232], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phase3 = interpolate(frame, [220, 360], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const count = Math.round(interpolate(frame, [118, 214], [0, 1440], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const kitchenEvents = [
    { label: "ORDER", x: 150, y: 250, c: colors.hcRisk },
    { label: "CHOP", x: 360, y: 160, c: colors.hcCyanBright },
    { label: "FIRE", x: 590, y: 280, c: colors.hcWatch },
    { label: "SERVE", x: 760, y: 170, c: colors.hcBlue },
    { label: "SWAP", x: 420, y: 420, c: "#FFFFFF" },
  ];
  const curves = [
    { label: "延遲反應", c: colors.hcCyanBright, y: 420, amp: 42 },
    { label: "協作選擇", c: colors.hcBlue, y: 520, amp: 58 },
    { label: "Social Friction", c: colors.hcRisk, y: 620, amp: 72 },
  ];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(0,180,216,0.20), transparent 48%), radial-gradient(circle at 78% 56%, rgba(33,81,245,0.22), transparent 45%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.22 + phase2 * 0.26, backgroundImage: "linear-gradient(rgba(111,227,245,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(111,227,245,0.18) 1px, transparent 1px)", backgroundSize: "46px 46px" }} />
    <div style={{ position: "absolute", left: 92, top: 58, color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 22, letterSpacing: "0.16em" }}>AI BEHAVIOR SIMULATION PIPELINE</div>

    <div style={{ opacity: phase1 }}>
      <div style={{ position: "absolute", left: 92, top: 104 }}>
        <TypewriterText text="16 MBTI chips" startFrame={8} charStagger={3} fontSize={74} fontWeight={850} letterSpacing="-0.055em" colorScheme="white-to-cyan" />
      </div>
      <div style={{ position: "absolute", left: 690, top: 210, width: 430, height: 300, borderRadius: 34, background: "linear-gradient(135deg, rgba(33,81,245,0.36), rgba(0,180,216,0.12))", border: "1px solid rgba(111,227,245,0.42)", boxShadow: "0 36px 150px rgba(0,180,216,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div style={{ color: "#FFFFFF", fontSize: 34, fontFamily: fonts.mono, fontWeight: 900 }}>Collab-Overcooked</div>
        <div style={{ color: colors.hcCyanBright, fontSize: 25, fontWeight: 750 }}>game console</div>
        <div style={{ width: 300, height: 18, borderRadius: 999, border: "1px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.06)" }} />
      </div>
      {chips.map((chip, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const start = 26 + i * 3;
        const op = interpolate(frame, [start, start + 10, 92, 108], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = interpolate(frame, [start, 92], [110 + col * 128, 760 + (col - 1.5) * 34], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [start, 92], [250 + row * 96, 314 + (row - 1.5) * 18], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const c = chipColors[i % chipColors.length];
        return <div key={chip} style={{ position: "absolute", left: x, top: y, opacity: op, width: 104, height: 58, borderRadius: 13, background: `${c}1F`, border: `1px solid ${c}88`, boxShadow: `0 16px 70px ${c}22`, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 22, fontWeight: 900 }}>{chip}</div>;
      })}
    </div>

    <div style={{ opacity: phase2 }}>
      <div style={{ position: "absolute", left: 92, top: 112, color: "#FFFFFF", fontSize: 58, fontWeight: 900, letterSpacing: "-0.05em" }}>High-frequency simulation</div>
      <div style={{ position: "absolute", left: 92, top: 206, color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 138, fontWeight: 900, letterSpacing: "-0.08em", textShadow: "0 0 44px rgba(111,227,245,0.66)" }}>{count.toLocaleString()}+</div>
      <div style={{ position: "absolute", left: 520, top: 263, color: colors.dimWhite, fontSize: 32, fontWeight: 720 }}>多壓力情境 × 人格組合模擬</div>
      {Array.from({ length: 36 }, (_, i) => {
        const x = (i * 173 + frame * (7 + (i % 5))) % 1920;
        const y = 140 + ((i * 83 + frame * (3 + (i % 4))) % 720);
        const op = 0.12 + (i % 5) * 0.07;
        return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: op, color: i % 3 ? colors.hcCyanBright : colors.hcBlue, fontFamily: fonts.mono, fontSize: 18, fontWeight: 800 }}>{String((i * 137 + frame * 11) % 9999).padStart(4, "0")}</div>;
      })}
      {kitchenEvents.map((ev, i) => {
        const t = (frame + i * 26) % 88;
        const sc = interpolate(t, [0, 12, 58, 88], [0.7, 1.15, 1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const op = interpolate(t, [0, 10, 72, 88], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={ev.label} style={{ position: "absolute", left: ev.x, top: ev.y, opacity: op, transform: `scale(${sc}) rotate(${rotZIn(t, 0, 16, i % 2 ? 8 : -8)}deg)`, width: 150, height: 96, borderRadius: 18, background: `${ev.c}22`, border: `1px solid ${ev.c}77`, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontFamily: fonts.mono, fontSize: 24, fontWeight: 900, boxShadow: `0 20px 90px ${ev.c}28` }}>{ev.label}</div>;
      })}
    </div>

    <div style={{ opacity: phase3 }}>
      <div style={{ position: "absolute", left: 92, top: 106, color: "#FFFFFF", fontSize: 70, fontWeight: 900, letterSpacing: "-0.055em" }}>Behavioral Fingerprints</div>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {curves.map((curve, i) => {
          const draw = interpolate(frame, [228 + i * 18, 286 + i * 18], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const d = Array.from({ length: 90 }, (_, p) => {
            const x = 190 + p * 16;
            const wave = Math.sin(p * 0.32 + i * 1.4) * curve.amp + Math.sin(p * 0.11 + i * 2.5) * 26;
            const y = curve.y + wave;
            return `${p === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ");
          return <path key={curve.label} d={d} fill="none" stroke={curve.c} strokeWidth={5} strokeLinecap="round" strokeDasharray="1450" strokeDashoffset={1450 * (1 - draw)} opacity={0.92} filter="drop-shadow(0 0 14px rgba(111,227,245,0.35))" />;
        })}
      </svg>
      {curves.map((curve, i) => {
        const op = interpolate(frame, [286 + i * 14, 306 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={curve.label} style={{ position: "absolute", right: 150, top: 392 + i * 98, opacity: op, padding: "16px 24px", borderRadius: 999, background: `${curve.c}1F`, border: `1px solid ${curve.c}77`, color: curve.c, fontSize: 30, fontWeight: 850, boxShadow: `0 20px 90px ${curve.c}24` }}>{curve.label}</div>;
      })}
      <div style={{ position: "absolute", left: 92, bottom: 92, color: colors.dimWhite, fontSize: 30, fontWeight: 650 }}>1,440+ simulations → 可建模的行為證據</div>
    </div>
  </AbsoluteFill>;
};

const MBTIInjection: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chips = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
  ];
  const chipColors = [colors.hcBlue, colors.hcCyan, colors.hcFit, colors.hcWatch];
  const swirl = interpolate(frame, [190, 336], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boot = swirl;
  const coreOpacity = interpolate(frame, [112, 146], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitRing = interpolate(frame, [348, 420], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleOp = interpolate(frame, [10, 36, 170, 220], [0, 1, 1, 0.42], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleTop = interpolate(frame, [82, 136], [292, 44], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [82, 136], [1, 0.58], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onlineText = interpolate(frame, [282, 314, 390, 416], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eyeMood = interpolate(boot, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: enter }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FB 58%, #EAF0FF 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.20, backgroundImage: "radial-gradient(circle, rgba(33,81,245,0.18) 1px, transparent 1px)", backgroundSize: "32px 32px", transform: `scale(${1 + swirl * 0.04}) rotate(${swirl * 1.2}deg)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: titleTop, opacity: titleOp, textAlign: "center", transform: `scale(${titleScale})`, transformOrigin: "center top" }}>
      <div style={{ color: colors.hcFgPrimary, fontSize: 88, fontWeight: 900, letterSpacing: "-0.06em" }}>人格注入</div>
      <div style={{ marginTop: 6, color: colors.hcFgSecondary, fontSize: 28, fontWeight: 680 }}>不是錄用結論，是模擬輸入</div>
    </div>

    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [116, 146, 286, 330], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {[0, 1, 2].map((i) => {
        const rx = 400 + i * 54 - swirl * 150;
        const ry = 298 + i * 42 - swirl * 108;
        return <ellipse key={i} cx="960" cy="590" rx={rx} ry={ry} fill="none" stroke={i % 2 ? colors.hcCyan : colors.hcBlue} strokeWidth={2} strokeDasharray="8 18" opacity={0.16 + i * 0.05} transform={`rotate(${swirl * 210 + i * 18} 960 590)`} />;
      })}
    </svg>

    {chips.map((chip, i) => {
      const c = chipColors[i % chipColors.length];
      const appear = interpolate(frame, [96 + i * 2, 114 + i * 2], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const angle = (Math.PI * 2 * i) / chips.length - Math.PI / 2 + swirl * (Math.PI * 2.15);
      const rx = interpolate(swirl, [0, 0.72, 1], [470 + (i % 4) * 8, 292, 36], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const ry = interpolate(swirl, [0, 0.72, 1], [348 + (i % 4) * 6, 218, 28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const x = 960 + Math.cos(angle) * rx;
      const y = 590 + Math.sin(angle) * ry;
      const absorb = interpolate(swirl, [0.48 + i * 0.01, 0.94], [0, 1], { easing: Easing.in(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const op = appear * (1 - absorb * 0.88);
      const scale = interpolate(absorb, [0, 1], [1, 0.32], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return <div key={chip} style={{ position: "absolute", left: x, top: y, width: 118, height: 58, opacity: op, transform: `translate(-50%, -50%) rotate(${swirl * 16 - 8}deg) scale(${scale})`, borderRadius: 13, background: `${c}13`, border: `1px solid ${c}66`, boxShadow: `0 18px 44px ${c}18`, color: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontSize: 21, fontWeight: 850 }}>{chip}</div>;
    })}

    <div style={{ position: "absolute", left: 960, top: 590, width: 340, height: 340, opacity: coreOpacity, transform: "translate(-50%, -50%)", transformOrigin: "center center" }}>
      <RobotAgent size={340} boot={eyeMood} bodyColor="#17339C" />
      <div style={{ position: "absolute", left: 62, right: 62, bottom: 52, height: 12, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
        <div style={{ width: `${Math.round(boot * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${colors.hcCyanBright}, #FFFFFF)` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 102, opacity: onlineText, textAlign: "center" }}>
      <div style={{ color: colors.hcFgPrimary, fontSize: 66, fontWeight: 900, letterSpacing: "-0.045em" }}>AI Agent Online</div>
      <div style={{ marginTop: 10, color: colors.hcFgSecondary, fontSize: 28, fontWeight: 680 }}>人格訊號已載入，準備進入 Work-Sim</div>
    </div>
    <div style={{ position: "absolute", left: 960, top: 590, width: interpolate(exitRing, [0, 1], [340, 3600]), height: interpolate(exitRing, [0, 1], [340, 3600]), opacity: frame >= 348 ? 1 : 0, background: "#17339C", transform: "translate(-50%, -50%)", borderRadius: "50%", border: `${interpolate(exitRing, [0, 1], [7, 920])}px solid rgba(111,227,245,0.42)`, boxShadow: "0 0 120px rgba(111,227,245,0.36)" }} />
    <div style={{ position: "absolute", left: 960, top: 590, width: 340, height: 340, opacity: frame >= 348 ? 1 : 0, transform: "translate(-50%, -50%)" }}>
      <RobotAgent size={340} boot={1} bodyColor="#17339C" />
    </div>
  </AbsoluteFill>;
};

const OvercookedPlay: React.FC = () => {
  const frame = useCurrentFrame();
  const cover = interpolate(frame, [0, 72], [1, 0], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const playsPunch = interpolate(frame, [84, 106, 128], [0.92, 1.08, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pressurePunch = interpolate(frame, [136, 158, 180], [0.90, 1.08, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scanY = interpolate(frame, [190, 382], [0, 226], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frameDraw = interpolate(frame, [118, 292], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const traceDraw = interpolate(frame, [430, 510], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitX = interpolate(frame, [548, 600], [0, -44], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const handoff = interpolate(frame, [528, 600], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tags = [
    { en: "TIME PRESSURE", zh: "倒數壓力", c: colors.hcCyanBright },
    { en: "ROLE HANDOFF", zh: "角色交接", c: colors.hcBlue },
    { en: "RESOURCE CONFLICT", zh: "資源衝突", c: colors.hcRisk },
  ];
  return <AbsoluteFill style={{ overflow: "hidden", background: "#F7F8FB", transform: `translateX(${exitX}px)` }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 71% 46%, rgba(111,227,245,0.18), transparent 36%), linear-gradient(112deg, #071D32 0%, #0D1430 39%, #F7F8FB 39.2%, #EEF4FF 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.16, backgroundImage: "radial-gradient(circle, rgba(111,227,245,0.42) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

    <div style={{ position: "absolute", left: 70, top: 92, width: 580, opacity: interpolate(frame, [540, 590], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 25, fontWeight: 900, letterSpacing: "0.22em" }}>AI AGENT</div>
      <div style={{ marginTop: 18, color: "#FFFFFF", fontSize: 124, fontWeight: 950, letterSpacing: "-0.078em", lineHeight: 0.82, transform: `scale(${playsPunch})`, transformOrigin: "left center", textShadow: `0 0 ${interpolate(frame, [84, 108, 150], [0, 34, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px rgba(255,255,255,0.42)` }}>PLAYS</div>
      <div style={{ color: colors.hcCyanBright, fontSize: 114, fontWeight: 950, letterSpacing: "-0.078em", lineHeight: 0.82, transform: `scale(${pressurePunch})`, transformOrigin: "left center", textShadow: `0 0 ${interpolate(frame, [136, 160, 204], [0, 40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px rgba(111,227,245,0.55)` }}>PRESSURE</div>
      <div style={{ marginTop: 30, color: colors.dimWhite, fontSize: 35, fontWeight: 820, lineHeight: 1.16, letterSpacing: "-0.04em" }}>遊戲行為<br />轉成可建模訊號</div>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 14, color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 19, fontWeight: 850, letterSpacing: "0.13em" }}>
        <span style={{ width: 120, height: 2, background: `linear-gradient(90deg, ${colors.hcCyanBright}, transparent)`, boxShadow: "0 0 22px rgba(111,227,245,0.42)" }} />
        WORK-SIM SIGNALS
      </div>
    </div>

    <div style={{ position: "absolute", right: 94, top: 148, width: 1080, height: 675, borderRadius: 26, overflow: "hidden", background: "#FFFFFF", border: "1px solid rgba(111,227,245,0.24)", boxShadow: "0 34px 100px rgba(5,7,12,0.24)" }}>
      <Video
        src={staticFile("overcooked-worksim.mp4")}
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(1.04) contrast(1.03)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(5,7,12,0.18) 0%, transparent 22%, transparent 76%, rgba(5,7,12,0.10) 100%)" }} />
      <svg width="1080" height="675" viewBox="0 0 1080 675" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        <path d="M 26 2 H 1054 Q 1078 2 1078 26 V 649 Q 1078 673 1054 673 H 26 Q 2 673 2 649 V 26 Q 2 2 26 2" fill="none" stroke={colors.hcCyanBright} strokeWidth={3} strokeLinecap="round" strokeDasharray="3440" strokeDashoffset={3440 * (1 - frameDraw)} opacity={0.70} filter="drop-shadow(0 0 18px rgba(111,227,245,0.58))" />
      </svg>
    </div>

    <div style={{ position: "absolute", left: 72, bottom: 124, width: 530, height: 244, opacity: interpolate(frame, [540, 590], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {tags.map((tag) => {
        const i = tags.indexOf(tag);
        const glow = interpolate(frame, [190 + i * 42, 218 + i * 42, 250 + i * 42], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={tag.en} style={{ position: "absolute", left: 0, top: i * 76, width: 452, padding: "9px 0 10px 0", display: "grid", gridTemplateColumns: "20px 1fr", columnGap: 16, alignItems: "center", borderBottom: "1px solid rgba(111,227,245,0.12)", filter: `brightness(${1 + glow * 0.45})` }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: tag.c, boxShadow: `0 0 24px ${tag.c}` }} />
          <div>
            <div style={{ color: tag.c, fontFamily: fonts.mono, fontSize: 25, fontWeight: 900, letterSpacing: "0.035em" }}>{tag.en}</div>
            <div style={{ marginTop: 4, color: "#FFFFFF", fontSize: 25, fontWeight: 800, letterSpacing: "-0.02em" }}>{tag.zh}</div>
          </div>
        </div>;
      })}
      <div style={{ position: "absolute", left: -12, top: scanY, width: 476, height: 2, opacity: interpolate(frame, [188, 210, 382, 406], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), background: `linear-gradient(90deg, transparent, ${colors.hcCyanBright}, transparent)`, boxShadow: "0 0 26px rgba(111,227,245,0.70)" }} />
    </div>

    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none", opacity: interpolate(frame, [430, 456, 540, 580], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <path d="M 788 834 C 648 880, 468 922, 284 994" fill="none" stroke={colors.hcCyanBright} strokeWidth={3} strokeLinecap="round" strokeDasharray="620" strokeDashoffset={620 * (1 - traceDraw)} opacity={0.66} filter="drop-shadow(0 0 16px rgba(111,227,245,0.52))" />
      <circle cx={788} cy={834} r={7} fill={colors.hcCyanBright} opacity={traceDraw} filter="drop-shadow(0 0 18px rgba(111,227,245,0.75))" />
    </svg>

    <div style={{ position: "absolute", left: 72, bottom: 62, opacity: interpolate(frame, [470, 510, 576, 600], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 28, fontWeight: 900, letterSpacing: "0.10em", textShadow: "0 0 28px rgba(111,227,245,0.36)" }}>
      TRACE CAPTURED →
    </div>

    <div style={{ position: "absolute", inset: 0, opacity: handoff, background: "linear-gradient(90deg, transparent 0%, transparent 48%, rgba(5,7,12,0.18) 66%, rgba(5,7,12,0.78) 84%, #05070C 100%)", pointerEvents: "none" }} />

    <div style={{ position: "absolute", left: 960, top: 590, width: 340 + cover * 3260, height: 340 + cover * 3260, background: "#17339C", opacity: cover, transform: "translate(-50%, -50%)", borderRadius: "50%", border: `${7 + cover * 913}px solid rgba(111,227,245,0.42)`, boxShadow: "0 0 120px rgba(111,227,245,0.36)", zIndex: 10 }} />
    <div style={{ position: "absolute", left: 960, top: 590, width: 340, height: 340, opacity: cover, transform: "translate(-50%, -50%)", zIndex: 11 }}>
      <RobotAgent size={340} boot={1} bodyColor="#17339C" />
    </div>
  </AbsoluteFill>;
};

const FingerprintResults: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 9998, 9999);
  const reveal = interpolate(frame, [0, 72], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const revealX = interpolate(reveal, [0, 1], [1920, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const modelFocus = interpolate(frame, [514, 574], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const analysisDim = interpolate(modelFocus, [0, 1], [1, 0.22]);
  const curves = [
    { value: "1,440+ simulations", note: "多壓力情況 × 16 MBTI 人格組合", c: colors.hcCyanBright, y: 262, amp: 42, start: 34, width: 8 },
    { value: "73.9% accuracy", note: "行為指紋可識別人格差異", c: colors.hcBlue, y: 508, amp: 54, start: 70, width: 9 },
    { value: "Social Friction", note: "影響績效與留任的關鍵訊號", c: colors.hcRisk, y: 754, amp: 50, start: 106, width: 8 },
  ];
  return <AbsoluteFill style={{
    opacity: m.opacity,
    transform: `${m.transform} translateX(${revealX}px)`,
    overflow: "hidden",
  }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 74% 50%, rgba(33,81,245,0.34), transparent 44%), radial-gradient(circle at 78% 75%, rgba(184,58,46,0.14), transparent 38%), linear-gradient(135deg, #05070C 0%, #101521 54%, #071D32 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.13, backgroundImage: "radial-gradient(circle, rgba(111,227,245,0.42) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

    <div style={{ position: "absolute", left: 74, top: 90, opacity: interpolate(frame, [26, 54, 488, 530], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * analysisDim, color: colors.dimWhite, fontFamily: fonts.mono, fontSize: 20, fontWeight: 850, letterSpacing: "0.14em" }}>BEHAVIORAL FINGERPRINTS</div>

    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: analysisDim }}>
      {curves.map((curve, i) => {
        const draw = interpolate(frame, [curve.start, curve.start + 128], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const active = interpolate(frame, [curve.start, curve.start + 32], [0, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const d = Array.from({ length: 92 }, (_, p) => {
          const x = 775 + p * 12.6;
          const wave = Math.sin(p * 0.27 + i * 1.35 + frame * 0.01) * curve.amp + Math.sin(p * 0.08 + i * 2.4 + frame * 0.005) * 18;
          const y = curve.y + wave;
          return `${p === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ");
        const connector = interpolate(frame, [curve.start + 42, curve.start + 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <g key={curve.value}>
          <path d={`M 516 ${curve.y} C 600 ${curve.y}, 668 ${curve.y}, 748 ${curve.y}`} fill="none" stroke={curve.c} strokeWidth={2} strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - connector)} opacity={0.64} />
          <circle cx={764} cy={curve.y} r={7} fill={curve.c} opacity={connector} filter={`drop-shadow(0 0 16px ${curve.c})`} />
          <path d={d} fill="none" stroke={curve.c} strokeWidth={curve.width} strokeLinecap="round" strokeDasharray="1280" strokeDashoffset={1280 * (1 - draw)} opacity={active} filter={`drop-shadow(0 0 18px ${curve.c}66)`} />
        </g>;
      })}
    </svg>

    <div style={{ opacity: analysisDim }}>
      {curves.map((item) => {
        const op = interpolate(frame, [item.start + 34, item.start + 66, 482, 528], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = interpolate(frame, [item.start + 34, item.start + 70], [-42, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={item.value} style={{ position: "absolute", left: 74, top: item.y - 50, width: 430, opacity: op, transform: `translateX(${x}px)` }}>
          <div style={{ color: item.c, fontFamily: fonts.mono, fontSize: 34, fontWeight: 900, letterSpacing: "-0.02em", textShadow: `0 0 22px ${item.c}55` }}>{item.value}</div>
          <div style={{ marginTop: 9, color: "#FFFFFF", fontSize: 25, fontWeight: 760, letterSpacing: "-0.02em", lineHeight: 1.18 }}>{item.note}</div>
        </div>;
      })}
    </div>

    <div style={{ position: "absolute", left: 120, right: 120, top: 120, height: 760, opacity: interpolate(frame, [312, 346, 430, 482], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${interpolate(frame, [312, 352], [1.34, 1], { easing: Easing.out(Easing.back(1.0)), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}) rotate(-7deg)`, transformOrigin: "center center", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{ width: 900, height: 360, borderRadius: 44, border: `10px solid ${colors.hcWatch}`, color: colors.hcWatch, background: "rgba(5,7,12,0.18)", boxShadow: "0 0 110px rgba(251,191,36,0.20), inset 0 0 42px rgba(251,191,36,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 38, fontWeight: 900, letterSpacing: "0.14em" }}>IEEE ICEIB 2026</div>
        <div style={{ marginTop: 6, fontSize: 100, fontWeight: 950, letterSpacing: "-0.075em", lineHeight: 0.9 }}>BEST PAPER</div>
        <div style={{ fontSize: 92, fontWeight: 950, letterSpacing: "-0.075em", lineHeight: 0.9 }}>AWARD</div>
      </div>
    </div>

    <div style={{ position: "absolute", inset: 0, opacity: modelFocus, background: "radial-gradient(ellipse at center, rgba(5,7,12,0.92) 0%, rgba(5,7,12,0.74) 42%, rgba(5,7,12,0.18) 76%, transparent 100%)" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 320, opacity: interpolate(frame, [536, 584], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [536, 584], [44, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, textAlign: "center" }}>
      <div style={{ color: "#FFFFFF", fontSize: 82, fontWeight: 920, letterSpacing: "-0.06em", lineHeight: 0.98, textShadow: "0 28px 110px rgba(0,0,0,0.60)" }}>
        Behavior Data <span style={{ color: colors.hcCyanBright }}>→</span> P × E Fit Model
      </div>
      <div style={{ marginTop: 26, color: colors.dimWhite, fontSize: 34, fontWeight: 760, letterSpacing: "-0.025em" }}>
        AI 先建立行為基準，不用等內部歷史數據
      </div>
    </div>

    <div style={{ position: "absolute", left: "50%", bottom: 2, width: 6, height: interpolate(frame, [612, 676], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), opacity: interpolate(frame, [612, 642], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: "translateX(-50%)", background: `linear-gradient(180deg, ${colors.hcCyanBright}, transparent)`, boxShadow: "0 0 32px rgba(111,227,245,0.72)" }} />
    <div style={{ position: "absolute", left: "50%", top: 660, width: 278, height: 278, opacity: interpolate(frame, [654, 690], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translate(-50%, -50%) scale(${interpolate(frame, [654, 696], [0.72, 1], { easing: Easing.out(Easing.back(1.0)), extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`, borderRadius: "50%", background: `linear-gradient(145deg, ${colors.hcBlue}, ${colors.hcCyan})`, boxShadow: "0 30px 120px rgba(33,81,245,0.42), 0 0 90px rgba(111,227,245,0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 98, fontWeight: 900, letterSpacing: "-0.08em", lineHeight: 0.9 }}>FIT</div>
    </div>
  </AbsoluteFill>;
};

const ScienceClose: React.FC = () => {
  const frame = useCurrentFrame();
  // Bypass the entry animation of momentAnim so the scene starts perfectly at scale 1.0 (no jumping)
  const exitOp = interpolate(frame, [228, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exitScale = interpolate(frame, [228, 240], [1, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Smoothly fade in the white background over the dark one
  const bgOp = interpolate(frame, [0, 35], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Legacy text from previous scene gracefully fades out
  const oldTextOp = interpolate(frame, [0, 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Morph the circle from B3PxE exactly
  const circleSize = interpolate(frame, [10, 45], [278, 230], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const circleY = interpolate(frame, [10, 45], [120, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Perfectly match the shadow of FingerprintResults at frame 0
  const shadow1 = interpolate(frame, [10, 45], [120, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shadow1A = interpolate(frame, [10, 45], [0.42, 0.30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shadow2 = interpolate(frame, [10, 45], [90, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shadow2A = interpolate(frame, [10, 45], [0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boxShadow = `0 30px ${shadow1}px rgba(33,81,245,${shadow1A})${shadow2 > 0 ? `, 0 0 ${shadow2}px rgba(111,227,245,${shadow2A})` : ""}`;

  const fitFontSize = interpolate(frame, [10, 45], [98, 80], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fitY = interpolate(frame, [10, 45], [0, -16], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  const calcOp = interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calcY = interpolate(frame, [25, 45], [20, 24], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const iconShift = interpolate(frame, [104, 148], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const quoteOp = interpolate(frame, [126, 164, 224, 238], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const quoteY = interpolate(frame, [126, 166], [66, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iconX = interpolate(iconShift, [0, 1], [0, -470], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iconY = interpolate(iconShift, [0, 1], [0, -18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const iconScale = interpolate(iconShift, [0, 1], [1, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  return <AbsoluteFill style={{ opacity: exitOp, transform: `scale(${exitScale})`, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, opacity: bgOp, background: "linear-gradient(180deg, #FFFFFF 0%, #F7F8FB 62%, #EAF0FF 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: bgOp * 0.22, backgroundImage: "radial-gradient(circle, rgba(33,81,245,0.18) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 320, opacity: oldTextOp, textAlign: "center" }}>
      <div style={{ color: "#FFFFFF", fontSize: 82, fontWeight: 920, letterSpacing: "-0.06em", lineHeight: 0.98, textShadow: "0 28px 110px rgba(0,0,0,0.60)" }}>
        Behavior Data <span style={{ color: colors.hcCyanBright }}>→</span> P × E Fit Model
      </div>
      <div style={{ marginTop: 26, color: colors.dimWhite, fontSize: 34, fontWeight: 760, letterSpacing: "-0.025em" }}>
        AI 先建立行為基準，不用等內部歷史數據
      </div>
    </div>

    <div style={{ position: "absolute", left: "50%", top: "50%", width: 620, height: 430, transform: `translate(-50%, -50%) translate(${iconX}px, ${iconY}px) scale(${iconScale})`, transformOrigin: "center center" }}>
      <svg width="620" height="430" viewBox="0 0 620 430" style={{ position: "absolute", inset: 0, overflow: "visible", opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        {[0, 1, 2].map((i) => {
          const draw = interpolate(frame, [25 + i * 10, 85 + i * 14], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const y = 148 + i * 54;
          const d = `M 64 ${y} C 188 ${y - 68}, 314 ${y + 56}, 476 ${y - 8}`;
          return <path key={i} d={d} fill="none" stroke={[colors.hcCyan, colors.hcBlue, colors.hcRisk][i]} strokeWidth={4} strokeLinecap="round" strokeDasharray="640" strokeDashoffset={640 * (1 - draw)} opacity={0.55} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: "50%", top: "50%", width: circleSize, height: circleSize, transform: `translate(-50%, -50%) translateY(${circleY}px)`, borderRadius: "50%", background: `linear-gradient(145deg, ${colors.hcBlue}, ${colors.hcCyan})`, boxShadow, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translateY(${fitY}px)`, fontFamily: fonts.mono, fontSize: fitFontSize, fontWeight: 900, letterSpacing: "-0.08em", lineHeight: 0.9 }}>FIT</div>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) translateY(${calcY}px)`, fontSize: 18, fontWeight: 800, letterSpacing: "0.15em", opacity: calcOp, whiteSpace: "nowrap" }}>CALCULATED</div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 600, right: 80, top: 332, opacity: quoteOp, transform: `translateY(${quoteY}px)`, textAlign: "left" }}>
      <div style={{ color: colors.hcFgPrimary, fontSize: 104, fontWeight: 900, letterSpacing: "-0.065em", lineHeight: 0.92 }}>Right Person.<br /><span style={{ color: colors.hcBlue }}>Fit Environment.</span></div>
      <div style={{ marginTop: 26, color: colors.hcFgSecondary, fontSize: 34, fontWeight: 720, letterSpacing: "-0.025em" }}>用行為證據，判斷人與環境是否真的適配</div>
    </div>
  </AbsoluteFill>;
};

export const S2_Science: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill>
    {/* Actual S2 contents wiping in over the previous scene */}
    <AbsoluteFill style={{ clipPath: slashWipe(frame, 0, 36) }}>
      <Sequence from={0} durationInFrames={240} layout="none"><AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill></Sequence>
      <Sequence from={240} durationInFrames={2640} layout="none"><AbsoluteFill><BgCalm theme="dark" tint="blue" /></AbsoluteFill></Sequence>
      <Sequence from={0} durationInFrames={240} layout="none"><BigBeat text="MBTI" sub="Personality signal，不是錄用結論，是模擬輸入" size={214} /></Sequence>
      <Sequence from={240} durationInFrames={360} layout="none"><Formula /></Sequence>
      <Sequence from={600} durationInFrames={360} layout="none"><PE /></Sequence>
      <Sequence from={960} durationInFrames={420} layout="none"><MBTIInjection /></Sequence>
      <Sequence from={1380} durationInFrames={600} layout="none"><OvercookedPlay /></Sequence>
      <Sequence from={1920} durationInFrames={720} layout="none"><FingerprintResults /></Sequence>
      <Sequence from={2640} durationInFrames={240} layout="none"><ScienceClose /></Sequence>
    </AbsoluteFill>
  </AbsoluteFill>;
};
