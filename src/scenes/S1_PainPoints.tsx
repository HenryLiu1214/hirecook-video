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

const HiringMistake: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  const burnOp = interpolate(frame, [86, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burnY = interpolate(frame, [86, 106], [28, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, perspective: "1400px" }}>
    <div style={{ color: colors.hcRisk, fontFamily: fonts.mono, fontSize: 24, fontWeight: 800, letterSpacing: "0.14em" }}>PAIN POINT</div>
    <div style={{ transform: `rotate(${rotZIn(frame, 12, 28, -8)}deg) rotateX(${rotXSettle(frame, 12, 32)}deg)` }}>
      <TypewriterText text="招募錯誤" startFrame={12} charStagger={4} fontSize={176} fontWeight={850} letterSpacing="-0.055em" colorScheme="white-to-blue" />
    </div>
    <div style={{ opacity: burnOp, transform: `translateY(${burnY}px)`, color: colors.hcRisk, fontSize: 76, fontWeight: 850, letterSpacing: "-0.04em" }}>
      = 直接燒錢！
    </div>
  </AbsoluteFill>;
};

const Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  const industryOp = interpolate(frame, [76, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const industryY = interpolate(frame, [76, 96], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22, perspective: "1400px" }}>
    <div style={{ fontFamily: fonts.mono, color: colors.hcFgMuted, fontSize: 23, letterSpacing: "0.14em", textTransform: "uppercase" }}>TARGET CUSTOMER</div>
    <div style={{ transform: `rotate(${rotZIn(frame, 18, 26, -7)}deg) rotateX(${rotXSettle(frame, 18, 30)}deg)` }}>
      <TypewriterText text="成長型中小企業" startFrame={18} charStagger={3} fontSize={176} fontWeight={850} letterSpacing="-0.055em" colorScheme="plum-to-pink" />
    </div>
    <div style={{ opacity: industryOp, transform: `translateY(${industryY}px)`, display: "flex", gap: 14, alignItems: "center", color: colors.hcFgSecondary, fontSize: 34, fontWeight: 650 }}>
      <span style={{ fontFamily: fonts.mono, color: colors.hcBlue }}>30–150 人</span>
      <span style={{ color: colors.hcFgFaint }}>·</span>
      <span>電子資訊業 / 專業服務業</span>
    </div>
  </AbsoluteFill>;
};

const GutFeeling: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  const chips = [
    { label: "創辦人", color: colors.hcBlue },
    { label: "營運長 COO", color: colors.hcCyan },
  ];
  const subOp = interpolate(frame, [116, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [116, 136], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26, perspective: "1400px" }}>
    <div style={{ color: colors.hcFgMuted, fontFamily: fonts.mono, fontSize: 23, letterSpacing: "0.14em" }}>WHO MAKES THE HIRING CALL</div>
    <div style={{ transform: `scale(${breathe(frame / 60, 1, 0.006)}) rotate(${rotZIn(frame, 14, 28, -8)}deg) rotateX(${rotXSettle(frame, 14, 34)}deg)` }}>
      <TypewriterText text="營運導向決策者" startFrame={14} charStagger={3} fontSize={154} fontWeight={850} letterSpacing="-0.055em" colorScheme="plum-to-pink" />
    </div>
    <div style={{ display: "flex", gap: 16 }}>
      {chips.map((p, i) => {
        const op = interpolate(frame, [82 + i * 10, 94 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [82 + i * 10, 102 + i * 10], [26, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return <div key={p.label} style={{ opacity: op, transform: `translateY(${y}px) rotate(${rotZIn(frame, 82 + i * 10, 18, i ? 4 : -4)}deg)`, padding: "14px 28px", borderRadius: 999, border: `1px solid ${p.color}33`, background: `${p.color}10`, color: p.color, fontFamily: fonts.mono, fontSize: 28, fontWeight: 800 }}>{p.label}</div>;
      })}
    </div>
    <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, color: colors.hcFgSecondary, fontSize: 32, fontWeight: 650 }}>
      他們要判斷的，是下一位新人
    </div>
  </AbsoluteFill>;
};

const Pills: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
  const qOp = interpolate(frame, [92, 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qY = interpolate(frame, [92, 112], [30, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, perspective: "1400px" }}>
    <div style={{ color: colors.hcFgMuted, fontFamily: fonts.mono, fontSize: 23, letterSpacing: "0.14em" }}>ABOUT THE NEW HIRE</div>
    <div style={{ transform: `rotate(${rotZIn(frame, 18, 28, -7)}deg) rotateX(${rotXSettle(frame, 18, 32)}deg)` }}>
      <TypewriterText text={"這位新人\n六個月後還在嗎？"} startFrame={18} charStagger={3} fontSize={132} fontWeight={850} letterSpacing="-0.055em" colorScheme="plum-to-pink" lineHeight={0.92} />
    </div>
    <div style={{ opacity: qOp, transform: `translateY(${qY}px)`, fontSize: 34, fontWeight: 650, color: colors.hcFgSecondary }}>
      決策者需要的不是面試印象，是留任答案
    </div>
  </AbsoluteFill>;
};

const Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 108, 120);
  const quoteOp = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22 }}>
    <div style={{ opacity: quoteOp, color: colors.dimWhite, fontSize: 34, fontWeight: 600 }}>「我看人很準」背後</div>
    <TypewriterText text="主管直覺" startFrame={10} charStagger={5} fontSize={162} fontWeight={850} colorScheme="white-to-blue" />
  </AbsoluteFill>;
};

const StatCard: React.FC<{ icon: React.ComponentProps<typeof LucideIcon>["name"]; eyebrow: string; value: number; decimals?: number; suffix: string; caption: string; color: string }> = ({ icon, eyebrow, value, decimals = 0, suffix, caption, color }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 168, 180);
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
  const m = momentAnim(frame, 0, 8, 168, 180);
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

const StatsTogether: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const items = [
    { min: 60.3, max: 60.3, decimals: 1, unit: "天", label: "招募空窗", sub: "職位空轉", color: colors.hcWatch },
    { min: 65.4, max: 65.4, decimals: 1, unit: "%", label: "半年留任", sub: "留不住人", color: colors.hcRisk },
    { min: 20, max: 30, decimals: 0, unit: "萬", label: "單次錯配", sub: "現金代價", color: colors.hcBlue },
  ];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
    <div style={{ transform: `rotate(${rotZIn(frame, 8, 26, -5)}deg) rotateX(${rotXSettle(frame, 8, 30)}deg)` }}>
      <TypewriterText text="直覺決策的真實代價" startFrame={8} charStagger={3} fontSize={98} fontWeight={850} letterSpacing="-0.055em" colorScheme="plum-to-pink" />
    </div>
    <div style={{ display: "flex", gap: 18 }}>
      {items.map((it, i) => {
        const op = interpolate(frame, [78 + i * 12, 92 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [78 + i * 12, 102 + i * 12], [34, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sc = interpolate(frame, [78 + i * 12, 102 + i * 12], [0.9, 1], { easing: Easing.out(Easing.back(1.12)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={it.label} style={{
            opacity: op,
            transform: `translateY(${y}px) scale(${sc})`,
            width: 360,
            minHeight: 250,
            borderRadius: 14,
            border: "1px solid rgba(8,16,40,0.06)",
            background: "#FFFFFF",
            boxShadow: "0 18px 70px rgba(30,64,150,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "26px 26px",
            boxSizing: "border-box" as const,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", color: it.color, fontFamily: fonts.mono, lineHeight: 0.9 }}>
              {it.label === "單次錯配" && <span style={{ fontSize: 26, fontWeight: 800, marginRight: 8 }}>NT$</span>}
              <span style={{ fontSize: 76, fontWeight: 850, letterSpacing: "-0.04em" }}>
                {(() => {
                  const start = 92 + i * 12;
                  const a = interpolate(frame, [start, start + 54], [0, it.min], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const b = interpolate(frame, [start, start + 54], [0, it.max], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const fmt = (n: number) => it.decimals ? n.toFixed(it.decimals) : Math.round(n).toString();
                  return it.min === it.max ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
                })()}
              </span>
              <span style={{ fontSize: 32, fontWeight: 800, marginLeft: 6 }}>{it.unit}</span>
            </div>
            <div style={{ color: colors.hcFgPrimary, fontSize: 28, fontWeight: 750 }}>{it.label}</div>
            <div style={{ color: colors.hcFgMuted, fontSize: 18, fontWeight: 500, textAlign: "center", lineHeight: 1.45 }}>{it.sub}</div>
          </div>
        );
      })}
    </div>
    <div style={{
      opacity: interpolate(frame, [150, 164], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      color: colors.hcFgSecondary,
      fontSize: 36,
      fontWeight: 700,
      letterSpacing: "-0.02em",
    }}>
      三個數字，指向同一個問題
    </div>
  </AbsoluteFill>;
};

const Hidden: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 888, 900);
  const dark = interpolate(frame, [280, 360], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flipY = interpolate(frame, [292, 376], [0, 180], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entryX = interpolate(frame, [0, 28], [-120, 48], { easing: Easing.out(Easing.back(1.15)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entryY = interpolate(frame, [0, 28], [80, 0], { easing: Easing.out(Easing.back(1.05)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const diveY = 0;
  const zoom = interpolate(frame, [0, 28, 292, 376], [0.86, 1.02, 1.02, 1.04], { easing: Easing.out(Easing.back(0.9)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const aboveGroupOp = interpolate(frame, [16, 42, 258, 292], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bridgeOp = interpolate(frame, [278, 306, 350, 378], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const belowGroupOp = interpolate(frame, [382, 414, 868, 900], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bg = dark < 0.5 ? "#FFFFFF" : "#071225";
  const Iceberg = ({ deep }: { deep: boolean }) => (
    <svg width="760" height="860" viewBox="0 0 760 860" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={deep ? "iceDeepA" : "iceTopA"} x1="160" y1="70" x2="570" y2="820" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={deep ? "#A9C6FF" : "#FFFFFF"} />
          <stop offset="0.44" stopColor={deep ? "#4F82F0" : "#DDEAFF"} />
          <stop offset="1" stopColor={deep ? "#1430A0" : "#8BAFF5"} />
        </linearGradient>
        <filter id={deep ? "iceDeepShadow" : "iceTopShadow"} x="-18%" y="-14%" width="136%" height="132%">
          <feDropShadow dx="0" dy="28" stdDeviation="28" floodColor="#1430A0" floodOpacity={deep ? "0.36" : "0.18"} />
        </filter>
      </defs>
      <g filter={`url(#${deep ? "iceDeepShadow" : "iceTopShadow"})`}>
        <path d="M380 50 L296 188 L206 224 L248 306 L118 322 H642 L538 242 L472 260 L428 110 Z" fill={deep ? "#D7E4FF" : "#FFFFFF"} stroke="#82A7F0" strokeWidth="4" />
        <path d="M118 322 H642 L548 548 L456 842 L382 660 L292 850 L218 566 Z" fill={`url(#${deep ? "iceDeepA" : "iceTopA"})`} opacity={deep ? 0.98 : 0.70} />
        <path d="M248 306 L380 50 L366 322 Z" fill="#FFFFFF" opacity="0.9" />
        <path d="M366 322 L428 110 L472 260 L642 322 Z" fill={deep ? "#BBD0FF" : "#CFE0FF"} opacity="0.86" />
        <path d="M118 322 H366 L292 850 L218 566 Z" fill={deep ? "#6C95F2" : "#98B7F4"} opacity="0.86" />
        <path d="M366 322 H642 L548 548 L456 842 Z" fill={deep ? "#2C61D6" : "#6F98EF"} opacity="0.86" />
        <path d="M366 322 L456 842 L292 850 Z" fill={deep ? "#0F2D8C" : "#3D70E4"} opacity={deep ? 0.48 : 0.28} />
      </g>
      <path d="M72 322 C176 304 260 340 376 322 C490 304 588 340 690 322" stroke={deep ? "rgba(111,227,245,0.78)" : "rgba(33,81,245,0.42)"} strokeWidth="7" fill="none" />
    </svg>
  );
  const bigWord = (text: string, start: number, top: number, left: number, size: number, color: string, hold = 78) => {
    const op = interpolate(frame, [start, start + 16, start + hold, start + hold + 20], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const x = interpolate(frame, [start, start + 28, start + hold + 20], [72, 0, -22], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sc = interpolate(frame, [start, start + 30], [0.88, 1], { easing: Easing.out(Easing.back(1.15)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return <div key={text} style={{ position: "absolute", top, left, opacity: op, transform: `translateX(${x}px) scale(${sc})`, color, fontSize: size, fontWeight: 900, letterSpacing: "-0.06em", lineHeight: 0.92 }}>{text}</div>;
  };
  const infoCard = (
    title: string,
    detail: string,
    start: number,
    top: number,
    accent: string,
    darkMode = false,
    leftStart = 28,
    hold = 180,
  ) => {
    const op = interpolate(frame, [start, start + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const x = interpolate(frame, [start, start + 28], [76, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sc = interpolate(frame, [start, start + 28], [0.92, 1], { easing: Easing.out(Easing.back(1.12)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <div key={title} style={{
        position: "absolute",
        left: 790,
        top,
        width: 760,
        opacity: op,
        transform: `translateX(${x}px) scale(${sc})`,
        borderLeft: `8px solid ${accent}`,
        borderRadius: 18,
        padding: "26px 34px",
        boxSizing: "border-box" as const,
        background: darkMode ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.86)",
        boxShadow: darkMode ? "0 24px 90px rgba(0,0,0,0.28)" : "0 24px 80px rgba(30,64,150,0.12)",
        borderTop: darkMode ? "1px solid rgba(111,227,245,0.14)" : "1px solid rgba(33,81,245,0.10)",
      }}>
        <div style={{ color: accent, fontSize: 58, fontWeight: 900, letterSpacing: "-0.055em", lineHeight: 1 }}>{title}</div>
        <div style={{ color: darkMode ? "rgba(236,239,246,0.82)" : colors.hcFgSecondary, fontSize: 28, fontWeight: 700, lineHeight: 1.4, marginTop: 14 }}>{detail}</div>
      </div>
    );
  };
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, background: bg }}>
    <div style={{ position: "absolute", inset: 0, opacity: dark, background: "radial-gradient(ellipse 80% 70% at 40% 54%, rgba(33,81,245,0.34), transparent 68%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.18 + dark * 0.16, backgroundImage: "radial-gradient(circle, rgba(33,81,245,0.55) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
    <div style={{ position: "absolute", left: entryX, top: 110 + entryY + diveY, width: 760, height: 860, perspective: "1500px", opacity: interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <div style={{ transform: `rotateY(${flipY}deg) rotateZ(-2deg) scale(${zoom})`, transformStyle: "preserve-3d" as const, transformOrigin: "50% 50%", opacity: dark < 0.5 ? 0.9 : 0.58 }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" as const }}><Iceberg deep={false} /></div>
        <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" as const }}><Iceberg deep /></div>
      </div>
    </div>
    <div style={{ opacity: aboveGroupOp }}>
      <div style={{ position: "absolute", top: 56, left: 92, color: colors.hcBlue, fontFamily: fonts.mono, fontSize: 24, fontWeight: 800, letterSpacing: "0.13em" }}>ABOVE THE WATER</div>
      {infoCard("靜態職能", "學歷經歷、專業技能、修飾過的履歷", 28, 150, colors.hcBlueDark, false, 28, 214)}
      {infoCard("自陳式測驗", "人格標籤、容易被偽裝的標準化答案", 84, 344, colors.hcBlue, false, 28, 184)}
      {infoCard("主管直覺", "「我看人很準」、基於偏好的主觀印象", 140, 538, colors.hcWatch, false, 28, 160)}
      <div style={{
        position: "absolute",
        left: 804,
        top: 794,
        opacity: interpolate(frame, [190, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        color: colors.hcFgSecondary,
        fontSize: 42,
        fontWeight: 900,
        letterSpacing: "-0.045em",
      }}>看得見，卻防不了職位錯配</div>
    </div>
    <div style={{ opacity: bridgeOp, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", color: "#FFFFFF", fontSize: 128, fontWeight: 900, letterSpacing: "-0.06em", textShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>水面下</div>
    <div style={{ opacity: belowGroupOp }}>
      <div style={{ position: "absolute", top: 56, left: 92, color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 24, fontWeight: 800, letterSpacing: "0.13em" }}>BELOW THE WATER</div>
      {infoCard("P-E Fit 動態適配", "個人特質如何適應整個職務與團隊生態", 402, 150, colors.hcCyanBright, true, 402, 196)}
      {infoCard("行為決策軌跡", "時間壓力、衝突情境與模糊資訊下的反應", 480, 350, "#FFFFFF", true, 402, 176)}
      {infoCard("社交摩擦", "個人行為傾向與環境協作需求的結構性衝突", 558, 550, colors.hcCyanBright, true, 402, 158)}
      <div style={{
        position: "absolute",
        left: 804,
        top: 806,
        opacity: interpolate(frame, [626, 648], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        color: colors.hcRisk,
        fontSize: 62,
        fontWeight: 900,
        letterSpacing: "-0.055em",
      }}>離職風險的真正來源：社交摩擦</div>
    </div>
  </AbsoluteFill>;
};


export const S1_PainPoints: React.FC = () => <AbsoluteFill>
  {/* ── Backgrounds ── */}
  {/* light: pain / audience / gut / pills */}
  <Sequence from={0}    durationInFrames={180} layout="none"><AbsoluteFill><BgCalm theme="dark" tint="blue" /></AbsoluteFill></Sequence>
  <Sequence from={180}  durationInFrames={540} layout="none"><AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill></Sequence>
  {/* dark: transition beat */}
  <Sequence from={720}  durationInFrames={120} layout="none"><AbsoluteFill><BgCalm theme="dark"  tint="blue" /></AbsoluteFill></Sequence>
  {/* light: three stats together */}
  <Sequence from={840}  durationInFrames={360} layout="none"><AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill></Sequence>
  {/* iceberg blind spot */}
  <Sequence from={1200} durationInFrames={900} layout="none"><AbsoluteFill style={{ background: "#FFFFFF" }} /></Sequence>

  {/* ── Beats ── */}
  <Sequence from={0}    durationInFrames={180} layout="none"><HiringMistake /></Sequence>
  <Sequence from={180}  durationInFrames={180} layout="none"><Audience /></Sequence>
  <Sequence from={360}  durationInFrames={180} layout="none"><GutFeeling /></Sequence>
  <Sequence from={540}  durationInFrames={180} layout="none"><Pills /></Sequence>
  <Sequence from={720}  durationInFrames={120} layout="none"><Transition /></Sequence>
  <Sequence from={840}  durationInFrames={360} layout="none"><StatsTogether /></Sequence>
  <Sequence from={1200} durationInFrames={900} layout="none"><Hidden /></Sequence>
</AbsoluteFill>;
