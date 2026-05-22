import React from "react";
import { useCurrentFrame, interpolate, Easing, AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { LucideIcon } from "../components/LucideIcon";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle, slashWipe, circleWipe } from "../anim";

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

const HiringMistakeStats: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 348, 360);
  const light = interpolate(frame, [96, 142], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [102, 154], [0, -240], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleScale = interpolate(frame, [102, 154], [1, 0.68], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burnOp = interpolate(frame, [86, 100, 120, 142], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const burnY = interpolate(frame, [86, 106], [28, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const items = [
    { min: 60.3, max: 60.3, decimals: 1, unit: "天", label: "招募空窗", sub: "職位空轉", color: colors.hcWatch },
    { min: 65.4, max: 65.4, decimals: 1, unit: "%", label: "半年留任", sub: "留不住人", color: colors.hcRisk },
    { min: 20, max: 30, decimals: 0, unit: "萬", label: "單次錯配", sub: "現金代價", color: colors.hcBlue },
  ];
  return <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform, overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 42%, rgba(33,81,245,0.34), transparent 50%), linear-gradient(180deg, #071225 0%, #0D1430 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: light, background: "radial-gradient(circle at 50% 42%, rgba(33,81,245,0.10), transparent 52%), linear-gradient(180deg, #FFFFFF 0%, #F7F8FB 62%, #EAF0FF 100%)" }} />
    <div style={{ position: "absolute", inset: 0, opacity: 0.16 + light * 0.06, backgroundImage: "radial-gradient(circle, rgba(111,227,245,0.38) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

    <div style={{ position: "absolute", left: 0, right: 0, top: 370, transform: `translateY(${titleY}px) scale(${titleScale})`, transformOrigin: "center center", textAlign: "center", perspective: "1400px" }}>
      {/* Typing & Impact Audio */}

      <Sequence from={35} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/VEGETree_Magic Foliage Ent, Living Tree, Footstep, Fall, Large, Impact, Heavy 04_ASD.wav")} volume={0.4} /></Sequence>

      <div style={{ opacity: interpolate(frame, [0, 16, 108, 136], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), color: colors.hcRisk, fontFamily: fonts.mono, fontSize: 24, fontWeight: 800, letterSpacing: "0.14em" }}>PAIN POINT</div>
      <div style={{ marginTop: 16, transform: `rotate(${rotZIn(frame, 12, 28, -8)}deg) rotateX(${rotXSettle(frame, 12, 32)}deg)` }}>
        <TypewriterText text="招募錯誤" startFrame={12} charStagger={4} fontSize={176} fontWeight={850} letterSpacing="-0.055em" colorScheme={light > 0.5 ? "plum-to-pink" : "white-to-blue"} />
      </div>
      <div style={{ opacity: burnOp, transform: `translateY(${burnY}px)`, color: colors.hcRisk, fontSize: 76, fontWeight: 850, letterSpacing: "-0.04em" }}>
        = 直接燒錢！
      </div>
    </div>

    <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", gap: 24 }}>
      {items.map((it, i) => {
        const op = interpolate(frame, [154 + i * 10, 170 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(frame, [154 + i * 10, 188 + i * 10], [44, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sc = interpolate(frame, [154 + i * 10, 188 + i * 10], [0.9, 1], { easing: Easing.out(Easing.back(1.12)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={it.label} style={{
            opacity: op,
            transform: `translateY(${y}px) scale(${sc})`,
            width: 420,
            minHeight: 280,
            borderRadius: 18,
            border: "1px solid rgba(8,16,40,0.06)",
            background: "#FFFFFF",
            boxShadow: "0 24px 80px rgba(30,64,150,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: "36px 36px",
            boxSizing: "border-box" as const,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", color: it.color, fontFamily: fonts.mono, lineHeight: 0.9 }}>
              {it.label === "單次錯配" && <span style={{ fontSize: 28, fontWeight: 800, marginRight: 8 }}>NT$</span>}
              <span style={{ fontSize: it.label === "單次錯配" ? 70 : 86, fontWeight: 850, letterSpacing: "-0.04em" }}>
                {(() => {
                  const start = 170 + i * 10;
                  const a = interpolate(frame, [start, start + 54], [0, it.min], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const b = interpolate(frame, [start, start + 54], [0, it.max], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const fmt = (n: number) => it.decimals ? n.toFixed(it.decimals) : Math.round(n).toString();
                  return it.min === it.max ? fmt(a) : `${fmt(a)}–${fmt(b)}`;
                })()}
              </span>
              <span style={{ fontSize: 34, fontWeight: 800, marginLeft: 8 }}>{it.unit}</span>
            </div>
            <div style={{ color: colors.hcFgPrimary, fontSize: 32, fontWeight: 800 }}>{it.label}</div>
            <div style={{ color: colors.hcFgMuted, fontSize: 20, fontWeight: 500, textAlign: "center", lineHeight: 1.45 }}>{it.sub}</div>
          </div>
        );
      })}
    </div>
    <div style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 180,
      opacity: interpolate(frame, [258, 278], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      color: colors.hcFgSecondary,
      fontSize: 42,
      fontWeight: 820,
      letterSpacing: "-0.02em",
      textAlign: "center",
    }}>
      直覺決策的真實代價
    </div>
  </AbsoluteFill>;
};

const Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 9998, 9999);
  const industryOp = interpolate(frame, [76, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const industryY = interpolate(frame, [76, 96], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, clipPath: slashWipe(frame, 0, 24), transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 22, perspective: "1400px" }}>
    <BgCalm theme="light" tint="blue" />
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
  const m = momentAnim(frame, 0, 8, 9998, 9999);
  const chips = [
    { label: "創辦人", color: colors.hcBlue },
    { label: "營運長 COO", color: colors.hcCyan },
  ];
  const subOp = interpolate(frame, [116, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [116, 136], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, clipPath: slashWipe(frame, 0, 24), transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 26, perspective: "1400px" }}>
    <BgCalm theme="light" tint="blue" />
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
  const m = momentAnim(frame, 0, 8, 9998, 9999);
  const qOp = interpolate(frame, [92, 106], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const qY = interpolate(frame, [92, 112], [30, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: m.opacity, clipPath: slashWipe(frame, 0, 24), transform: m.transform, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 24, perspective: "1400px" }}>
    <BgCalm theme="light" tint="blue" />
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

  // Entrance: smooth slash wipe matching the rest
  const wipe = slashWipe(frame, 0, 24);

  // Subtitle: "「我看人很準」背後"
  const subOp = interpolate(frame, [16, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subY = interpolate(frame, [16, 36], [24, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ clipPath: wipe, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 32 }}>
      <BgCalm theme="dark" tint="blue" />
      <div style={{
        opacity: subOp,
        transform: `translateY(${subY}px)`,
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 42,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}>「我看人很準」背後</div>
      <TypewriterText text="主管直覺" startFrame={28} charStagger={4} fontSize={168} fontWeight={850} colorScheme="white-to-blue" />
    </AbsoluteFill>
  );
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
      <TypewriterText text="招募錯誤" startFrame={8} charStagger={3} fontSize={116} fontWeight={850} letterSpacing="-0.055em" colorScheme="plum-to-pink" />
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
      fontSize: 42,
      fontWeight: 820,
      letterSpacing: "-0.02em",
    }}>
      直覺決策的真實代價
    </div>
  </AbsoluteFill>;
};

const Hidden: React.FC = () => {
  const frame = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // BG: light → dark at bridge
  const dark = interpolate(frame, [370, 460], [0, 1], { easing: Easing.inOut(Easing.cubic), ...cl });

  // Iceberg: enters from left → stays left → slides RIGHT during flip
  const iceXEntry = interpolate(frame, [0, 52], [-180, 60], { easing: Easing.out(Easing.back(1.04)), ...cl });
  const iceXSlide = interpolate(frame, [382, 462], [0, 940], { easing: Easing.inOut(Easing.cubic), ...cl });
  const iceX = iceXEntry + iceXSlide;

  // Flip: syncs with slide
  const flipY = interpolate(frame, [374, 458], [0, 180], { easing: Easing.inOut(Easing.cubic), ...cl });
  const bg = dark < 0.5 ? "#FFFFFF" : "#071225";

  // Phase gates
  // Above: kw1 exits@230, kw2 noExit fades with aboveOp@440-460
  const aboveOp  = interpolate(frame, [14, 32, 440, 460], [0, 1, 1, 0], cl);
  // Bridge: overlaps aboveOp fade + belowOp rise
  const bridgeOp = interpolate(frame, [450, 470, 492, 512], [0, 1, 1, 0], cl);
  // Below: kw3 exits@688, kw4 noExit fades with belowOp@860-880
  const belowOp  = interpolate(frame, [504, 524, 860, 880], [0, 1, 1, 0], cl);

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

  // Sequential keyword — Zelios entrance (rotZ + rotX + scale), hard exit (opacity).
  // TIMING RULE: kw[n+1].start = kw[n].start + hold + 18 (exit duration)
  // → guarantees exactly ONE keyword visible at a time, zero stacking.
  const kw = (text: string, start: number, size: number, color: string, hold: number, noExit = false) => {
    const exitStart = noExit ? 9999 : start + hold;
    const op = interpolate(frame, [start, start + 16, exitStart, exitStart + 18], [0, 1, 1, 0], cl);
    const sc = interpolate(frame, [start, start + 26], [0.88, 1], { easing: Easing.out(Easing.back(1.12)), ...cl });
    return (
      <div style={{
        position: "absolute" as const, top: 0, left: 0, opacity: op,
        transform: `rotate(${rotZIn(frame, start, start + 28, -7)}deg) rotateX(${rotXSettle(frame, start, start + 30)}deg) scale(${sc})`,
        fontSize: size, fontWeight: 850, fontFamily: fonts.display, color,
        letterSpacing: "-0.055em", lineHeight: 0.9, whiteSpace: "nowrap" as const,
      }}>{text}</div>
    );
  };
  // kw timings (strictly non-overlapping):
  // Above:  kw1 start=22  hold=190  → fully gone at 22+190+18=230
  //         kw2 start=230 noExit   → reads 230→440 = 210f (3.5s) before aboveOp fade
  // Below:  kw3 start=512 hold=160  → fully gone at 512+160+18=690
  //         kw4 start=690 noExit   → reads 690→860 = 170f (2.8s) before belowOp fade

  return (
    <AbsoluteFill style={{ background: bg, clipPath: slashWipe(frame, 0, 24) }}>
      {/* ── Audio ── */}
      {/* Iceberg Flip Flashback */}
      <Sequence from={324} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/WHSH_Sfx Transition Flashback, Remembrance, Deep 02_ASD.wav")} volume={0.45} /></Sequence>
      {/* Deep Impact for "水面下" reveal */}
      <Sequence from={450} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNBram_Face in the Mirror Impact_ASD_XForce_x06.wav")} volume={0.45} />
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/LIQBubl_Liquid Bubble Glasses Air Sources, Stereo Spread, Release Sequence_ASD.wav")} volume={0.35} />
      </Sequence>
      {/* Keyword shimmer: each iceberg keyword appearing */}
      {[22, 230, 512, 690].map((f) => (
        <Sequence key={`kw-${f}`} from={f} layout="none">
          <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic Generic Building Block, Aura, Glyph, Activation, Shimmer, Metal Ring, Short, Medium 03_ASD.wav")} volume={0.22} />
        </Sequence>
      ))}

      {/* Ambient glow + dot grid */}
      <div style={{ position: "absolute", inset: 0, opacity: dark, background: "radial-gradient(ellipse 80% 70% at 50% 54%, rgba(33,81,245,0.34), transparent 68%)" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.18 + dark * 0.16, backgroundImage: "radial-gradient(circle, rgba(33,81,245,0.55) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />

      {/* Iceberg — left on enter, slides right during flip */}
      <div style={{ position: "absolute", left: iceX, top: 90, width: 760, height: 860, perspective: "1500px", opacity: interpolate(frame, [0, 14], [0, 1], cl) }}>
        <div style={{ transform: `rotateY(${flipY}deg) rotateZ(-2deg)`, transformStyle: "preserve-3d" as const, transformOrigin: "50% 50%", opacity: dark < 0.5 ? 0.88 : 0.62 }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" as const }}><Iceberg deep={false} /></div>
          <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" as const }}><Iceberg deep /></div>
        </div>
      </div>

      {/* Water-line: left edge above / right edge below */}
      <div style={{ position: "absolute", left: 0, right: 1060, top: 396, height: 3, opacity: aboveOp * 0.6, background: "rgba(33,81,245,0.35)", borderRadius: 2 }} />
      <div style={{ position: "absolute", left: 960, right: 0, top: 396, height: 3, opacity: belowOp * 0.7, background: "rgba(111,227,245,0.55)", borderRadius: 2 }} />

      {/* ── ABOVE THE WATER — right panel, iceberg is on the left ── */}
      <div style={{
        opacity: aboveOp, position: "absolute",
        top: 0, bottom: 0, left: 840, right: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        paddingLeft: 72, paddingRight: 80,
      }}>
        <div style={{ color: colors.hcBlue, fontFamily: fonts.mono, fontSize: 18, fontWeight: 800, letterSpacing: "0.2em", marginBottom: 36 }}>ABOVE THE WATER</div>
        <div style={{ position: "relative", height: 160 }}>
          {kw("履歷包裝", 22,  148, colors.hcFgPrimary, 190)}
          {kw("自陳測驗", 230, 148, colors.hcBlue, 0, true)}
        </div>
        <div style={{
          marginTop: 44,
          opacity: interpolate(frame, [360, 378], [0, 1], cl),
          color: colors.hcRisk, fontSize: 34, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.35,
        }}>看得見，卻防不了職位錯配</div>
      </div>

      {/* ── BRIDGE: 水面下 ── */}
      <div style={{
        opacity: bridgeOp, position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        color: "#FFFFFF", fontSize: 128, fontWeight: 900, letterSpacing: "-0.06em",
        textShadow: "0 24px 80px rgba(0,0,0,0.35)", fontFamily: fonts.display,
        whiteSpace: "nowrap" as const, zIndex: 10,
      }}>水面下</div>

      {/* ── BELOW THE WATER — left panel, iceberg has moved to the right ── */}
      <div style={{
        opacity: belowOp, position: "absolute",
        top: 0, bottom: 0, left: 0, width: 960,
        display: "flex", flexDirection: "column", justifyContent: "center",
        paddingLeft: 92, paddingRight: 40,
      }}>
        <div style={{ color: colors.hcCyanBright, fontFamily: fonts.mono, fontSize: 18, fontWeight: 800, letterSpacing: "0.2em", marginBottom: 36 }}>BELOW THE WATER</div>
        <div style={{ position: "relative", height: 160 }}>
          {kw("P-E Fit",  512, 148, colors.hcCyanBright, 160)}
          {kw("人際協作", 690, 148, "#FFFFFF", 0, true)}
        </div>
        <div style={{
          marginTop: 44,
          opacity: interpolate(frame, [780, 798], [0, 1], cl),
          color: colors.hcRisk, fontSize: 34, fontWeight: 900, letterSpacing: "-0.045em",
        }}>離職風險的真正來源：社交摩擦</div>
      </div>
    </AbsoluteFill>
  );
};

export const S1_PainPoints: React.FC = () => {
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <AbsoluteFill>
      {/* ── Audio ── */}
      {/* Stat cards popping */}
      {[154, 164, 174].map((f) => (
        <Sequence key={`card-${f}`} from={f} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/FOLYMisc_Rustle Studio Performed Whoosh Thorny Branches X18_ASD.wav")} volume={0.25} /></Sequence>
      ))}
      {/* Slash wipes — all panel transitions share the same whoosh */}
      {[360, 540, 720, 900].map((f) => (
        <Sequence key={`wipe-${f}`} from={f} layout="none">
          <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/WHSH_Magic Air Whoosh, Twirl, Wind Gust, Tremolo 03_ASD.wav")} volume={0.32} />
        </Sequence>
      ))}
      {/* Riser building into iceberg reveal */}
      <Sequence from={693} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNRise_Sfx Rise Tension, Transition, Processed Bell, Reverse, High 01_ASD.wav")} volume={(f) => interpolate(f, [0, 59, 60, 80], [0, 0.4, 0.4, 0], cl)} />
      </Sequence>


      {/* ── Beats ── */}
      <Sequence from={0}    durationInFrames={384} layout="none"><HiringMistakeStats /></Sequence>
      <Sequence from={360}  durationInFrames={204} layout="none"><Audience /></Sequence>
      <Sequence from={540}  durationInFrames={204} layout="none"><GutFeeling /></Sequence>

  <Sequence from={720}  durationInFrames={210} layout="none"><Pills /></Sequence>
  <Sequence from={900} durationInFrames={240} layout="none"><Transition /></Sequence>
  <Sequence from={1110} durationInFrames={900} layout="none"><Hidden /></Sequence>
    </AbsoluteFill>
  );
};
