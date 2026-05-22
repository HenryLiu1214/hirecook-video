import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Sequence, Audio, staticFile } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { LucideIcon } from "../components/LucideIcon";
import { TypewriterText } from "../components/TypewriterText";
import { momentAnim, floatY, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S3: 4800 frames (80s) at 60fps — demo-first cut
// B0  0–300     LIGHT  overview (D / I / T cards)
// B1  300–480   LIGHT  zoom into D
// B2  480–1740  LIGHT  D · Define (RoleBuilder + HandCursor)
// B3  1740–1920 DARK   bridge
// B4  1920–3180 DARK   I · Interact (SJT + HandCursor click)
// B5  3180–3420 DARK   capture flash
// B6  3420–3600 DARK   bridge
// B7  3600–4800 LIGHT  T · Tailor (TAT playbook)

// ─── Design system colors ───────────────────────────────────────────────────

const ds = {
  blue: "#2151F5",
  blueDark: "#1430A0",
  cyan: "#00B4D8",
  fit: "#1B7A4D",
  canvas: "#FFFFFF",
  hairline: "rgba(8,16,40,0.06)",
  soft: "rgba(8,16,40,0.10)",
  fgPrimary: "#0B1020",
  fgSecondary: "#364159",
  fgMuted: "#5C677F",
  fgFaint: "#8C95AE",
};

// ─── HexRadar ───────────────────────────────────────────────────────────────

const HexRadar: React.FC<{
  size: number;
  values: number[];
  labels: string[];
  color: string;
  fillColor: string;
  prog?: number;
}> = ({ size, values, labels, color, fillColor, prog = 1 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const angleOf = (i: number) => toRad(-90 + i * 60);

  const rings = [0.33, 0.66, 1.0];
  const ringPolygons = rings.map((k) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = angleOf(i);
      return `${cx + Math.cos(a) * r * k},${cy + Math.sin(a) * r * k}`;
    });
    return pts.join(" ");
  });

  const dataVerts = values.map((v, i) => {
    const a = angleOf(i);
    const dist = (v / 100) * prog * r;
    return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist };
  });
  const dataPolygon = dataVerts.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPositions = labels.map((lbl, i) => {
    const a = angleOf(i);
    return {
      x: cx + Math.cos(a) * (r + 22),
      y: cy + Math.sin(a) * (r + 22),
      label: lbl.toUpperCase(),
    };
  });

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {ringPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(8,16,40,0.06)" strokeWidth={1} />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a = angleOf(i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
            stroke="rgba(8,16,40,0.06)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={dataPolygon}
        fill={fillColor}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataVerts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} />
      ))}
      {labelPositions.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          fontSize={12}
          fontFamily={fonts.mono}
          fill="rgba(90,103,127,1)"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
};

// ─── PEMapRadar ──────────────────────────────────────────────────────────────

const PEMapRadar: React.FC<{
  size: number;
  pVals: number[];
  eVals: number[];
  prog?: number;
}> = ({ size, pVals, eVals, prog = 1 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const angleOf = (i: number) => toRad(-90 + i * 60);

  const rings = [0.25, 0.5, 0.75, 1.0];
  const axisLabels = ["COLLAB", "STRESS", "AUTONOMY", "DECISION", "CONFLICT", "EMPATHY"];

  const ringPolygons = rings.map((k) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = angleOf(i);
      return `${cx + Math.cos(a) * r * k},${cy + Math.sin(a) * r * k}`;
    });
    return pts.join(" ");
  });

  const makeVerts = (vals: number[]) =>
    vals.map((v, i) => {
      const a = angleOf(i);
      const dist = (v / 100) * prog * r;
      return { x: cx + Math.cos(a) * dist, y: cy + Math.sin(a) * dist };
    });

  const eVerts = makeVerts(eVals);
  const pVerts = makeVerts(pVals);

  const labelPositions = axisLabels.map((lbl, i) => {
    const a = angleOf(i);
    return { x: cx + Math.cos(a) * (r + 22), y: cy + Math.sin(a) * (r + 22), label: lbl };
  });

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {ringPolygons.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(8,16,40,0.06)" strokeWidth={1} />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a = angleOf(i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
            stroke="rgba(8,16,40,0.06)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={eVerts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(33,81,245,0.10)"
        stroke="#2151F5"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <polygon
        points={pVerts.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="rgba(0,180,216,0.10)"
        stroke="#00B4D8"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {labelPositions.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          fontSize={11}
          fontFamily={fonts.mono}
          fill="rgba(90,103,127,0.8)"
          textAnchor="middle"
          dominantBaseline="middle"
          letterSpacing="0.04em"
        >
          {lp.label}
        </text>
      ))}
    </svg>
  );
};

// ─── MBTI two-state data ─────────────────────────────────────────────────────
// base = neutral environment (sliders at ~50); final = after env defined (80/55/75/85/60/65)

const mbtiTypes = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];
const mbtiBase: Record<string, number> = {
  INTJ:66, INTP:64, ENTJ:70, ENTP:72,
  INFJ:69, INFP:64, ENFJ:74, ENFP:74,
  ISTJ:50, ISFJ:53, ESTJ:67, ESFJ:64,
  ISTP:64, ISFP:64, ESTP:71, ESFP:72,
};
const mbtiFinal: Record<string, number> = {
  INTJ:67, INTP:63, ENTJ:74, ENTP:75,
  INFJ:68, INFP:61, ENFJ:76, ENFP:76,
  ISTJ:47, ISFJ:51, ESTJ:70, ESFJ:65,
  ISTP:67, ISFP:62, ESTP:76, ESFP:76,
};
// Phase-B local frame when each type first crosses fit threshold (≥75)
// progress goes 0→1 over lB frames 20→380 (span 360)
const mbtiFitCrossLB: Partial<Record<string, number>> = {
  ENFJ: 200,  // 74→76, crosses 75 at 50% progress → lB=20+0.5*360=200
  ENFP: 200,
  ESFP: 290,  // 72→76, crosses 75 at 75% → lB=20+0.75*360=290
  ESTP: 308,  // 71→76, crosses 75 at 80% → lB=20+0.80*360=308
  ENTP: 380,  // 72→75, just reaches at 100%
};

// LiveMBTIGrid — reacts to sliderProgress (0→1) and flashes cells on threshold crossing
const LiveMBTIGrid: React.FC<{ progress: number; lB: number }> = ({ progress, lB }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
      {mbtiTypes.map((type) => {
        const score = Math.round(mbtiBase[type] + progress * (mbtiFinal[type] - mbtiBase[type]));
        const isFit = score >= 75;
        const isRisk = score < 55;
        const bg = isFit ? "#E6F5EC" : isRisk ? "#FBE7E5" : "#F7F8FB";
        const border = isFit ? "rgba(27,122,77,0.22)" : isRisk ? "rgba(184,58,46,0.18)" : "rgba(8,16,40,0.06)";
        const textColor = isFit ? "#146F3E" : isRisk ? "#A02A1F" : "#5C677F";
        // Scale bounce when crossing fit threshold
        const crossLB = mbtiFitCrossLB[type] ?? -1;
        const since = lB - crossLB;
        const flashSc = crossLB >= 0 && since >= 0 && since < 20
          ? 1 + 0.16 * Math.max(0, 1 - since / 20)
          : 1;
        return (
          <div key={type} style={{
            transform: `scale(${flashSc})`,
            background: bg, border: `1px solid ${border}`, borderRadius: 7,
            padding: "7px 10px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, fontWeight: 700, color: textColor }}>{type}</span>
            <span style={{ fontSize: 11, fontFamily: fonts.mono, color: textColor, opacity: 0.85 }}>{score}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── SliderRow ───────────────────────────────────────────────────────────────

const SliderRow: React.FC<{
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  localFrame: number;
  barStart: number;
  color?: string;
}> = ({ label, leftLabel, rightLabel, value, localFrame, barStart, color = "#2151F5" }) => {
  const w = interpolate(localFrame, [barStart, barStart + 50], [0, value], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const op = interpolate(localFrame, [barStart - 10, barStart + 5], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Thumb handle fades in as bar starts moving
  const thumbOp = interpolate(localFrame, [barStart, barStart + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  
  return (
    <div style={{ opacity: op, display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Slider audio */}
      <Sequence from={barStart} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MECHSwtch_Tech Rotary Switch Turn Metal Small Spot Light x9 Variations_ASD.wav")} volume={(f) => interpolate(f, [0, 50], [0.15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 18, color: "#0B1020", fontWeight: 600, fontFamily: fonts.display }}>{label}</span>
        <span style={{ fontSize: 16, color, fontWeight: 700, fontFamily: fonts.mono }}>{Math.round(w)}</span>
      </div>
      <div style={{ height: 8, background: "rgba(8,16,40,0.06)", borderRadius: 9999, position: "relative" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 9999 }} />
        {/* Arrival pulse — fires as the slider lands on its value */}
        <div style={{
          position: "absolute", left: `${w}%`, top: "50%",
          width: 18, height: 18, marginLeft: -9, marginTop: -9, borderRadius: "50%",
          border: `2px solid ${color}`,
          transform: `scale(${1 + interpolate(localFrame, [barStart + 46, barStart + 80], [0, 1.8], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
          opacity: interpolate(localFrame, [barStart + 46, barStart + 52, barStart + 80], [0, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }} />
        {/* Draggable thumb handle */}
        <div style={{
          position: "absolute",
          left: `${w}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 18, height: 18,
          borderRadius: "50%",
          background: "#FFFFFF",
          border: `2.5px solid ${color}`,
          boxShadow: `0 1px 6px rgba(8,16,40,0.30), 0 0 0 3px ${color}22`,
          opacity: thumbOp,
          zIndex: 1,
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontFamily: fonts.mono, color: "#8C95AE" }}>{leftLabel}</span>
        <span style={{ fontSize: 11, fontFamily: fonts.mono, color: "#8C95AE" }}>{rightLabel}</span>
      </div>
    </div>
  );
};

// ─── KPICard ─────────────────────────────────────────────────────────────────

const KPICard: React.FC<{
  eyebrow: string;
  value: number;
  decimals?: number;
  unit: string;
  sub: string;
  delta?: string;
  signal?: boolean;
  localFrame: number;
  delay: number;
}> = ({ eyebrow, value, decimals = 0, unit, sub, delta, signal, localFrame, delay }) => {
  const op = interpolate(localFrame, [delay, delay + 14], [0, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sc = interpolate(localFrame, [delay, delay + 14], [0.88, 1], {
    easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Count-up animation: 0 → final value over 70 frames from reveal
  const numVal = interpolate(localFrame, [delay, delay + 70], [0, value], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const displayVal = decimals > 0 ? numVal.toFixed(decimals) : Math.round(numVal).toString();
  const isPositive = delta && delta.startsWith("+");
  // Signal dot pulse
  const dotGlow = signal ? 0.5 + 0.5 * Math.sin(localFrame * 0.18) : 0;
  return (
    <div style={{
      opacity: op,
      transform: `scale(${sc})`,
      background: "#FFFFFF",
      border: "1px solid rgba(8,16,40,0.06)",
      borderRadius: 8,
      padding: "20px 24px",
      boxShadow: "0 1px 4px rgba(8,16,40,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      flex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {signal && (
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#00B4D8",
            boxShadow: `0 0 ${4 + 6 * dotGlow}px rgba(0,180,216,${0.6 + 0.4 * dotGlow})`,
            flexShrink: 0,
          }} />
        )}
        <span style={{ fontSize: 14, fontFamily: fonts.mono, color: "#5C677F", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{eyebrow}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 48, fontFamily: fonts.mono, fontWeight: 700, color: "#0B1020", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{displayVal}</span>
        <span style={{ fontSize: 16, fontFamily: fonts.mono, color: "#8C95AE" }}>{unit}</span>
      </div>
      <span style={{ fontSize: 14, color: "#5C677F" }}>{sub}</span>
      {delta && (
        <span style={{ fontSize: 13, fontFamily: fonts.mono, fontWeight: 700, color: isPositive ? "#1B7A4D" : "#B83A2E" }}>
          {isPositive ? "↗" : "↘"} {delta}
        </span>
      )}
    </div>
  );
};

// ─── XAIDriver ───────────────────────────────────────────────────────────────

const XAIDriver: React.FC<{
  name: string;
  value: number;
  localFrame: number;
  delay: number;
}> = ({ name, value, localFrame, delay }) => {
  const op = interpolate(localFrame, [delay, delay + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const barW = interpolate(localFrame, [delay, delay + 50], [0, (Math.abs(value) / 5) * 240], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const isPositive = value >= 0;
  const barColor = isPositive ? "#1B7A4D" : "#B83A2E";
  const valColor = isPositive ? "#1B7A4D" : "#B83A2E";
  return (
    <div style={{ opacity: op, display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 16, color: "#364159", fontFamily: fonts.display, width: 130, flexShrink: 0 }}>{name}</span>
      <div style={{ position: "relative", width: 240, height: 20, flexShrink: 0 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "rgba(8,16,40,0.06)", transform: "translateX(-50%)" }} />
        {isPositive ? (
          <div style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            height: 10,
            width: barW,
            background: barColor,
            borderRadius: "0 4px 4px 0",
            transform: "translateY(-50%)",
          }} />
        ) : (
          <div style={{
            position: "absolute",
            right: "50%",
            top: "50%",
            height: 10,
            width: barW,
            background: barColor,
            borderRadius: "4px 0 0 4px",
            transform: "translateY(-50%)",
          }} />
        )}
      </div>
      <span style={{ fontSize: 15, fontFamily: fonts.mono, fontWeight: 700, color: valColor }}>
        {value > 0 ? "+" : ""}{value}
      </span>
    </div>
  );
};

// ─── Data ────────────────────────────────────────────────────────────────────

const envVals = [80, 55, 75, 85, 60, 65];   // target slider values (協作/壓力/自主/決速/範疇/模糊)
const envLabels = ["協作", "壓力", "自主", "決速", "範疇", "模糊"];
const pVals = [75, 45, 85, 70, 65, 80];
const eVals = [80, 55, 75, 85, 60, 65];

const drivers: { name: string; value: number; delay: number }[] = [
  { name: "決策自主性", value: 4.2, delay: 160 },
  { name: "壓力調適力", value: 2.8, delay: 174 },
  { name: "協作頻率契合", value: 1.9, delay: 188 },
  { name: "模糊容忍落差", value: -0.9, delay: 202 },
];

const recs: { num: string; text: string; delay: number }[] = [
  { num: "01", text: "前 90 天：設定清晰自主邊界，避免過度微觀管理", delay: 280 },
  { num: "02", text: "留意跡象：多任務超載時決策品質下降，請及早介入", delay: 292 },
  { num: "03", text: "動機誘因：提供自主探索空間 + 清晰成果邊界", delay: 304 },
];

// ────────────────────────────────────────────────────────────────────────────
// B0 — Overview  (cinematic formula-explosion → three step reveal)
// ────────────────────────────────────────────────────────────────────────────

const B0Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 288, 300);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase 0 (0-120f): HOW HIRECOOK WORKS
  const p0Op = interpolate(frame, [0, 14, 90, 110], [0, 1, 1, 0], cl);

  // Phase 1 (100-300f): DIT side-by-side framework
  const p1Op = interpolate(frame, [100, 120, 290, 300], [0, 1, 1, 0], cl);
  const zoomSc = interpolate(frame, [218, 258], [1, 4.5], { easing: Easing.inOut(Easing.cubic), ...cl });
  const zoomX = interpolate(frame, [218, 258], [0, 490.7], { easing: Easing.inOut(Easing.cubic), ...cl });
  const zoomY = interpolate(frame, [218, 258], [0, 45], { easing: Easing.inOut(Easing.cubic), ...cl });
  const detailOp = interpolate(frame, [218, 238], [1, 0], cl);
  const titleOp = interpolate(frame, [120, 140, 200, 218], [0, 1, 1, 0], cl);

  const steps = [
    { id: "D", tag: "STEP 01 · DEFINE", title: "設定職位壓力場", out: "環境指紋 E", c: ds.blue, delay: 110 },
    { id: "I", tag: "STEP 02 · INTERACT", title: "SJT 情境測驗", out: "行為指紋 P", c: "#5B8AFF", delay: 125 },
    { id: "T", tag: "STEP 03 · TARGET", title: "P×E 交叉分析", out: "TAT 管理手冊", c: ds.fit, delay: 140 },
  ];

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "#05070C" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 82% 60% at 50% 38%, rgba(33,81,245,0.22) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(156,182,255,0.045) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.6 }} />

      <AbsoluteFill style={{ opacity: m.opacity }}>

        {/* ── Phase 0: Title ── */}
        <AbsoluteFill style={{ opacity: p0Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", fontSize: 520, fontWeight: 900, fontFamily: fonts.mono, color: ds.blue, opacity: 0.04, lineHeight: 1, letterSpacing: "-20px", userSelect: "none" as const }}>DIT</div>
          <div style={{ marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 16px", borderRadius: 999, border: "1px solid rgba(0,180,216,0.30)", background: "rgba(0,180,216,0.06)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 8px ${ds.cyan}` }} />
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#6FE3F5", letterSpacing: "0.24em" }}>HOW HIRECOOK WORKS</span>
          </div>
          <div style={{ fontSize: 110, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-5px", lineHeight: 1.08, textAlign: "center" as const }}>
            三個步驟<br /><span style={{ color: ds.cyan }}>一份決策手冊</span>
          </div>
        </AbsoluteFill>

        {/* ── Phase 1: Side-by-side Global Roadmap ── */}
        <AbsoluteFill style={{ opacity: p1Op, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${zoomSc}) translate(${zoomX}px, ${zoomY}px)` }}>
          <div style={{ position: "absolute", top: 120, fontSize: 30, fontWeight: 800, color: "rgba(255,255,255,0.7)", fontFamily: fonts.display, letterSpacing: "0.25em", opacity: titleOp }}>GLOBAL WORKFLOW</div>
          <div style={{ display: "flex", gap: 32, width: 1440 }}>
            {steps.map((s) => {
              const cardOp = interpolate(frame, [s.delay, s.delay + 20], [0, 1], cl);
              const cardY = interpolate(frame, [s.delay, s.delay + 24], [40, 0], { easing: Easing.out(Easing.cubic), ...cl });
              return (
                <div key={s.id} style={{ flex: 1, opacity: cardOp, transform: `translateY(${cardY}px)`, display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 40px", borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -40, top: -20, fontSize: 320, fontWeight: 900, fontFamily: fonts.mono, color: s.c, opacity: 0.05, lineHeight: 1, letterSpacing: "-10px", userSelect: "none" as const }}>{s.id}</div>
                  
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 999, border: `1px solid ${s.c}44`, background: `${s.c}1A`, marginBottom: 32, zIndex: 1 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.c, boxShadow: `0 0 8px ${s.c}` }} />
                    <span style={{ fontSize: 12, fontFamily: fonts.mono, color: s.c, letterSpacing: "0.15em" }}>{s.tag}</span>
                  </div>
                  
                  <div style={{ fontSize: 44, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-2px", textAlign: "center", zIndex: 1, whiteSpace: "nowrap" as const }}>{s.title}</div>
                  
                  <div style={{ opacity: detailOp, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg, transparent, ${s.c}88, transparent)`, margin: "40px 0", zIndex: 1 }} />
                    <div style={{ fontSize: 12, fontFamily: fonts.mono, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", marginBottom: 12, zIndex: 1 }}>OUTPUT</div>
                    <div style={{ fontSize: 28, fontFamily: fonts.mono, fontWeight: 700, color: s.c, zIndex: 1 }}>{s.out}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B2 — D · Define  (3 steps matching actual product, 1260 frames total)
//
//  Step 01 / Phase A    0 – 480   基本資料: type role+team, dropdowns, 繼續
//  Step 02 / Phase B  480 – 960   環境維度: drag 6 sliders → live MBTI changes
//  Step 03 / Phase C  960 –1260   確認送出: review table → click 建立環境模型
// ────────────────────────────────────────────────────────────────────────────

// ─── Right panel: live radar + MBTI grid (persistent across all 3 steps) ────

const B2RightPanel: React.FC<{
  liveEnvVals: number[];
  hexProg: number;
  pressureScore: number;
  sliderProgress: number;
  lB: number;
  radarGlow?: boolean;
  gridGlow?: boolean;
  radarDim?: number;
  gridDim?: number;
}> = ({ liveEnvVals, hexProg, pressureScore, sliderProgress, lB, radarGlow = false, gridGlow = false, radarDim = 1, gridDim = 1 }) => {
  const radarRing = radarGlow ? "0 0 0 2.5px rgba(0,180,216,0.55), 0 0 40px rgba(0,180,216,0.22)" : "none";
  const gridRing  = gridGlow  ? "0 0 0 2.5px rgba(0,180,216,0.55), 0 0 40px rgba(0,180,216,0.22)" : "none";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 480, flexShrink: 0 }}>
      {/* Radar card */}
      <div style={{
        background: "#FFFFFF", borderRadius: 12, padding: "20px 24px",
        border: "1px solid rgba(8,16,40,0.06)", boxShadow: `0 4px 24px rgba(8,16,40,0.08), ${radarRing}`,
        display: "flex", flexDirection: "column", gap: 12, opacity: radarDim, transition: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 6px ${ds.cyan}`, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>即時預覽 · 環境指紋</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ position: "relative" as const, width: 220, height: 220, flexShrink: 0 }}>
            {sliderProgress > 0.02 && sliderProgress < 0.99 && [0, 1].map((k) => {
              const ph = ((lB + k * 22) % 44) / 44;
              return <div key={k} style={{
                position: "absolute" as const, left: "50%", top: "50%",
                width: 196, height: 196, marginLeft: -98, marginTop: -98, borderRadius: "50%",
                border: `1.5px solid ${ds.cyan}`,
                transform: `scale(${0.55 + ph * 0.85})`, opacity: (1 - ph) * 0.42,
                pointerEvents: "none" as const,
              }} />;
            })}
            <HexRadar size={220} values={liveEnvVals} labels={envLabels} color={ds.blue} fillColor="rgba(33,81,245,0.14)" prog={hexProg} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 56, fontFamily: fonts.mono, fontWeight: 700, color: ds.blue, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{pressureScore}</span>
              <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>/100</span>
            </div>
            <span style={{ fontSize: 12, color: ds.fgMuted }}>綜合壓力指數</span>
            {sliderProgress > 0.1 && (
              <span style={{
                fontSize: 11, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.5,
                opacity: interpolate(sliderProgress, [0.1, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}>
                高協作密度與快速決策節奏拉高壓力，壓力基準屬中等。
              </span>
            )}
          </div>
        </div>
      </div>
      {/* MBTI grid card */}
      <div style={{
        background: "#FFFFFF", borderRadius: 12, padding: "16px 20px",
        border: "1px solid rgba(8,16,40,0.06)", boxShadow: `0 4px 24px rgba(8,16,40,0.08), ${gridRing}`,
        display: "flex", flexDirection: "column", gap: 10, opacity: gridDim, transition: "none",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>人格適配 · 16 型</span>
          {sliderProgress > 0.02 && sliderProgress < 0.99 ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 ${4 + 5 * (0.5 + 0.5 * Math.sin(lB * 0.4))}px ${ds.cyan}` }} />
              <span style={{ fontSize: 11, fontFamily: fonts.mono, color: "#066B7C" }}>即時重算中</span>
            </span>
          ) : (
            <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint }}>model.v4.3</span>
          )}
        </div>
        <LiveMBTIGrid progress={sliderProgress} lB={lB} />
        {/* Annotation: explains the live recompute the user emphasized */}
        <div style={{
          fontSize: 11, fontFamily: fonts.display, color: ds.fgMuted, lineHeight: 1.5,
          opacity: interpolate(sliderProgress, [0.04, 0.18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}>
          拖動環境滑桿，系統即時重算每一型人格在此職位的預測適配。
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1B7A4D" }} />
            <span style={{ fontSize: 10, fontFamily: fonts.mono, color: ds.fgMuted }}>最佳適配</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B83A2E" }} />
            <span style={{ fontSize: 10, fontFamily: fonts.mono, color: ds.fgMuted }}>摩擦風險</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared app-shell chrome ───────────────────────────────────────────────────
const AppBar: React.FC<{ step: 0 | 1 | 2; op: number; embedded?: boolean }> = ({ step, op, embedded }) => {
  const frame = useCurrentFrame();
  const dotPulse = 0.55 + 0.45 * Math.sin(frame * 0.19);
  const steps = [
    { n: "01", label: "基本資料", done: step > 0, active: step === 0 },
    { n: "02", label: "環境維度", done: step > 1, active: step === 1 },
    { n: "03", label: "確認送出", done: step > 2, active: step === 2 },
  ];
  return (
    <div style={{ ...(embedded ? {} : { position: "absolute" as const, top: 0, left: 0, right: 0 }), opacity: op, zIndex: 10 }}>
      {/* Top bar */}
      <div style={{ height: 52, background: "#FFFFFF", borderBottom: "1px solid rgba(8,16,40,0.06)", display: "flex", alignItems: "center", padding: "0 32px", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg,#1430A0,#2151F5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 9, fontFamily: fonts.mono, fontWeight: 800, color: "#FFF" }}>HC</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: ds.fgPrimary, fontFamily: fonts.display }}>HireCook</span>
        </div>
        <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.10em" }}>ROLE ENVIRONMENTS · NEW ENVIRONMENT</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 11px", borderRadius: 999, border: "1px solid rgba(0,180,216,0.28)", background: "rgba(0,180,216,0.06)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan, opacity: dotPulse, boxShadow: `0 0 ${4 + 5 * dotPulse}px ${ds.cyan}` }} />
          <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.cyan, letterSpacing: "0.08em" }}>inference active</span>
        </div>
      </div>
      {/* Step tabs */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid rgba(8,16,40,0.05)", padding: "10px 32px 0", display: "flex", alignItems: "center" }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            {i > 0 && <div style={{ width: 40, height: 1, background: s.done || s.active ? ds.blue : "rgba(8,16,40,0.10)", margin: "0 4px", marginBottom: 10 }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 10, borderBottom: s.active ? `2px solid ${ds.blue}` : "2px solid transparent" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: s.done || s.active ? ds.blue : "transparent", border: `1.5px solid ${s.done || s.active ? ds.blue : "rgba(8,16,40,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.done ? <span style={{ fontSize: 10, color: "#FFF" }}>✓</span> : <span style={{ fontSize: 9, fontFamily: fonts.mono, fontWeight: 700, color: s.active ? "#FFF" : ds.fgFaint }}>{s.n}</span>}
              </div>
              <span style={{ fontSize: 12, fontFamily: fonts.display, fontWeight: s.active ? 600 : 400, color: s.active ? ds.fgPrimary : ds.fgMuted }}>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Typewriter for form fields ──────────────────────────────────────────────

const FieldTyped: React.FC<{ text: string; startF: number; charDur?: number; lf: number }> = ({ text, startF, charDur = 5, lf }) => {
  const n = Math.min(text.length, Math.floor(Math.max(0, (lf - startF) / charDur)));
  return (
    <span style={{ fontFamily: fonts.display, fontSize: 16, color: ds.fgPrimary }}>
      {text.slice(0, n)}
    </span>
  );
};

// Slider definitions for Phase B ─────────────────────────────────────────────
// One brand color — all sliders use Deep Intelligence Blue (input, not prediction)
const bSliders = [
  { label: "協作密度",   leftLabel: "單兵作戰", rightLabel: "持續配對", target: 80, barStart: 20,  color: ds.blue },
  { label: "壓力基準",   leftLabel: "穩定節奏", rightLabel: "高壓循環", target: 55, barStart: 80,  color: ds.blue },
  { label: "自主性",     leftLabel: "高度指導", rightLabel: "自主驅動", target: 75, barStart: 140, color: ds.blue },
  { label: "決策速度",   leftLabel: "深思熟慮", rightLabel: "快速推進", target: 85, barStart: 200, color: ds.blue },
  { label: "決策範疇",   leftLabel: "戰術執行", rightLabel: "策略規劃", target: 60, barStart: 260, color: ds.blue },
  { label: "模糊度容忍", leftLabel: "規格明確", rightLabel: "高度模糊", target: 65, barStart: 320, color: ds.blue },
];

// ── Step 01: 基本資料 (left panel) ────────────────────────────────────────────
const B2LeftA: React.FC<{ lf: number }> = ({ lf }) => {
  const op = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showRole = lf >= 40;
  const showTeam = lf >= 160;
  const showDrops = lf >= 260;
  const btnOp = interpolate(lf, [320, 334], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnSc = interpolate(lf, [440, 444, 450], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 12, padding: "30px 32px",
      border: "1px solid rgba(8,16,40,0.06)", boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
      flex: 1, display: "flex", flexDirection: "column", gap: 20, opacity: op,
      boxSizing: "border-box" as const,
    }}>
      <div style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>基本資料</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 14, color: ds.fgSecondary, fontFamily: fonts.display, fontWeight: 500 }}>職位名稱</label>
        <div style={{ height: 44, borderRadius: 6, border: `1.5px solid ${showRole ? ds.blue : "rgba(8,16,40,0.14)"}`, padding: "0 14px", display: "flex", alignItems: "center", background: "#FAFBFD" }}>
          {showRole ? <FieldTyped text="後端工程師 L3" startF={40} charDur={7} lf={lf} /> : <span style={{ color: ds.fgFaint, fontSize: 15, fontFamily: fonts.display }}>例：後端工程師 L3</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label style={{ fontSize: 14, color: ds.fgSecondary, fontFamily: fonts.display, fontWeight: 500 }}>團隊背景</label>
        <div style={{ height: 44, borderRadius: 6, border: `1.5px solid ${showTeam ? ds.blue : "rgba(8,16,40,0.14)"}`, padding: "0 14px", display: "flex", alignItems: "center", background: "#FAFBFD" }}>
          {showTeam ? <FieldTyped text="平台組 · 6 人" startF={160} charDur={6} lf={lf} /> : <span style={{ color: ds.fgFaint, fontSize: 15, fontFamily: fonts.display }}>例：平台組 · 6 人</span>}
        </div>
        <span style={{ fontSize: 11, color: ds.fgFaint, fontFamily: fonts.display }}>例：「平台組·6人，非同步優先，RFC 配對評審」</span>
      </div>

      <div style={{ display: "flex", gap: 14, opacity: interpolate(lf, [260, 272], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 14, color: ds.fgSecondary, fontFamily: fonts.display, fontWeight: 500 }}>匯報對象</label>
          <div style={{ height: 44, borderRadius: 6, border: "1.5px solid rgba(8,16,40,0.14)", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFBFD" }}>
            <span style={{ fontSize: 14, fontFamily: fonts.display, color: ds.fgPrimary }}>回報資深工程師</span>
            <span style={{ fontSize: 11, color: ds.fgFaint }}>▾</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
          <label style={{ fontSize: 14, color: ds.fgSecondary, fontFamily: fonts.display, fontWeight: 500 }}>招募急迫性</label>
          <div style={{ height: 44, borderRadius: 6, border: "1.5px solid rgba(8,16,40,0.14)", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFBFD" }}>
            <span style={{ fontSize: 14, fontFamily: fonts.display, color: ds.fgPrimary }}>30 天內</span>
            <span style={{ fontSize: 11, color: ds.fgFaint }}>▾</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        <span style={{ fontSize: 13, color: ds.fgFaint, fontFamily: fonts.display }}>第 1 步，共 3 步</span>
        <div style={{ opacity: btnOp, transform: `scale(${btnSc})`, padding: "11px 28px", borderRadius: 7, background: ds.blue, color: "#FFF", fontSize: 15, fontFamily: fonts.display, fontWeight: 600, boxShadow: lf > 340 ? `0 0 0 ${2 + 4 * (0.5 + 0.5 * Math.sin(lf * 0.2))}px rgba(33,81,245,${0.18 + 0.12 * (0.5 + 0.5 * Math.sin(lf * 0.2))})` : "none" }}>繼續 →</div>
      </div>
    </div>
  );
};

// ── Step 02: 環境維度 (left panel) ────────────────────────────────────────────
const B2LeftB: React.FC<{ lf: number }> = ({ lf }) => {
  const op = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnOp = interpolate(lf, [400, 414], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnSc = interpolate(lf, [450, 454, 460], [1, 0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 12, padding: "26px 28px",
      border: "1px solid rgba(8,16,40,0.06)", boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
      flex: 1, display: "flex", flexDirection: "column", gap: 14, opacity: op,
      boxSizing: "border-box" as const,
    }}>
      <div>
        <div style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 4 }}>環境維度</div>
        <div style={{ fontSize: 14, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.55 }}>六個軸向。請滑動至這個職位實際的位置——而非理想中的位置。</div>
      </div>
      {bSliders.map((s) => (
        <SliderRow key={s.label} label={s.label} leftLabel={s.leftLabel} rightLabel={s.rightLabel} value={s.target} localFrame={lf} barStart={s.barStart} color={s.color} />
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <div style={{ padding: "9px 18px", borderRadius: 7, border: "1px solid rgba(8,16,40,0.14)", fontSize: 13, fontFamily: fonts.display, color: ds.fgSecondary }}>← 返回</div>
        <div style={{ opacity: btnOp, transform: `scale(${btnSc})`, padding: "11px 28px", borderRadius: 7, background: ds.blue, color: "#FFF", fontSize: 15, fontFamily: fonts.display, fontWeight: 600, boxShadow: lf > 408 ? `0 0 0 ${2 + 4 * (0.5 + 0.5 * Math.sin(lf * 0.2))}px rgba(33,81,245,${0.18 + 0.12 * (0.5 + 0.5 * Math.sin(lf * 0.2))})` : "none" }}>繼續 →</div>
      </div>
    </div>
  );
};

// ── Step 03: 確認送出 (left panel) ───────────────────────────────────────────
const B2LeftC: React.FC<{ lf: number }> = ({ lf }) => {
  const op = interpolate(lf, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rows = [
    { label: "職位",     value: "後端工程師 L3" },
    { label: "團隊",     value: "平台組 · 6 人" },
    { label: "協作密度", value: "80 · 持續配對" },
    { label: "壓力基準", value: "55 · 中間值" },
    { label: "自主性",   value: "75 · 自主驅動" },
    { label: "決策速度", value: "85 · 快速推進" },
    { label: "決策範疇", value: "60 · 中間值" },
    { label: "模糊度容忍", value: "65 · 中間值" },
  ];
  const bannerOp = interpolate(lf, [110, 124], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnSc = interpolate(lf, [180, 184, 190], [1, 0.93, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      background: "#FFFFFF", borderRadius: 12, padding: "26px 28px",
      border: "1px solid rgba(8,16,40,0.06)", boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
      flex: 1, display: "flex", flexDirection: "column", gap: 0, opacity: op,
      boxSizing: "border-box" as const,
    }}>
      <div style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 14 }}>確認送出</div>
      {rows.map((row, i) => (
        <div key={row.label} style={{
          opacity: interpolate(lf, [i * 7, i * 7 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0",
          borderBottom: i < rows.length - 1 ? "1px solid rgba(8,16,40,0.06)" : "none",
        }}>
          <span style={{ fontSize: 13, color: ds.fgMuted, fontFamily: fonts.display }}>{row.label}</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: ds.fgPrimary, fontFamily: fonts.display }}>{row.value}</span>
        </div>
      ))}
      <div style={{ opacity: bannerOp, marginTop: 16, background: "#F0F4FE", borderRadius: 8, border: "1px solid rgba(33,81,245,0.15)", padding: "14px 18px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: ds.fgPrimary, fontFamily: fonts.display, marginBottom: 4 }}>就緒，可以建模了。</div>
        <div style={{ fontSize: 12, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.5, marginBottom: 12 }}>系統將生成環境指紋、16 種人格的適配分佈，以及摩擦風險提示。約需 12 秒。</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 7, background: ds.blue, color: "#FFF", fontSize: 14, fontFamily: fonts.display, fontWeight: 600, transform: `scale(${btnSc})`, boxShadow: lf > 130 ? `0 0 0 ${2 + 5 * (0.5 + 0.5 * Math.sin(lf * 0.2))}px rgba(33,81,245,${0.20 + 0.14 * (0.5 + 0.5 * Math.sin(lf * 0.2))})` : "none" }}>
          <LucideIcon name="zap" size={15} />
          建立環境模型
        </div>
      </div>
    </div>
  );
};

// ── B2Define orchestrator ─────────────────────────────────────────────────────
const B2Define: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 1140, 1164);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // ── Timeline: no intro, directly show the COMPLETE interface ──
  const sceneOp = interpolate(frame, [0, 24, 1140, 1164], [0, 1, 1, 0], cl);
  const cardOp  = interpolate(frame, [0, 30, 1140, 1164], [0, 1, 1, 0], cl);

  // Phase boundaries (whole-interface steps) — left panel crossfades, no flash
  const PB = 440, PC = 780;
  const phaseA = frame < PB;
  const phaseB = frame >= PB && frame < PC;
  const phaseC = frame >= PC;
  const lA = Math.max(0, frame - 20);
  const lB = Math.max(0, frame - PB);
  const lC = Math.max(0, frame - PC);
  const appBarStep: 0 | 1 | 2 = phaseA ? 0 : phaseB ? 1 : 2;

  // Crossfaded left-panel opacities (overlap ~16f at each boundary → smooth swap)
  const aOp = interpolate(frame, [8, 30, PB, PB + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bOp = interpolate(frame, [PB - 16, PB, PC, PC + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cOp = interpolate(frame, [PC - 16, PC], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Right-panel live data (radar + 16-type grid recompute)
  const sliderProgress = phaseA ? 0 : phaseB ? interpolate(lB, [30, 360], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const neutralEnv = [50, 50, 50, 50, 50, 50];
  const liveEnvVals = neutralEnv.map((n, i) => n + sliderProgress * (envVals[i] - n));
  const hexProg = phaseA ? interpolate(lA, [40, 240], [0, 0.5], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const pressureScore = Math.round(50 + sliderProgress * 23);
  const panelLB = phaseB ? lB : phaseC ? 999 : 0;

  // ── Camera focus stops: zoom into a region, hold, return to full view ──
  // [inStart, hold, outStart, outEnd], origin %, zoom, which panel to spotlight, text
  // Stop ① uses z:1.0 (no zoom) — callout + glow only; avoids repetitive zooming in Phase A
  type Stop = { k: number[]; ox: number; oy: number; z: number; panel: "left" | "right" | "radar" | "grid" | "none"; n: string; title: string; desc: string };
  const stops: Stop[] = [
    { k: [90, 130, 210, 250], ox: 30, oy: 35, z: 1.0, panel: "left",  n: "①", title: "描述職位的真實樣貌", desc: "不是理想，是這個位置實際的運作方式。" },
    { k: [480, 520, 602, 640],   ox: 30, oy: 54, z: 1.28, panel: "left",  n: "②", title: "六個維度，拉出壓力場", desc: "每個軸向對應一種真實的工作張力。" },
    { k: [664, 702, 774, 810],   ox: 80, oy: 30, z: 1.32, panel: "radar", n: "③", title: "環境指紋即時生成", desc: "六維壓力分數，量化成一張雷達。" },
    { k: [832, 868, 942, 976], ox: 80, oy: 75, z: 1.32, panel: "grid", n: "④", title: "16 型人格即時適配", desc: "每動一格，預測適配同步重算。" },
    { k: [974, 1010, 1102, 1136], ox: 46, oy: 62, z: 1.22, panel: "none",  n: "⑤", title: "確認後，一鍵建模", desc: "生成環境指紋與適配分佈。" },
  ];
  const active = stops.find((s) => frame >= s.k[0] && frame < s.k[3]);
  // Continuous camera path — ②③④⑤ flow directly, no return to 1.0 between stops
  // Gap ②→③: 640-664 (24f pan left→right)  Gap ③→④: 810-832 (22f shift down)  Gap ④→⑤: 976-1010 (34f sweep right→center)
  const camZoom = interpolate(frame,
    [480,  520,  602,  640,  664,  702,  774,  810,  832,  868,  942,  976, 1010, 1102, 1136],
    [  1, 1.28, 1.28, 1.28, 1.32, 1.32, 1.32, 1.32, 1.32, 1.32, 1.32, 1.22, 1.22, 1.22,    1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOx = interpolate(frame,
    [480,  520,  602,  640,  664,  702,  774,  810,  832,  868,  942,  976, 1010, 1102, 1136],
    [ 50,   30,   30,   30,   80,   80,   80,   80,   80,   80,   80,   46,   46,   46,   50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOy = interpolate(frame,
    [480,  520,  602,  640,  664,  702,  774,  810,  832,  868,  942,  976, 1010, 1102, 1136],
    [ 50,   54,   54,   54,   40,   40,   40,   40,   70,   70,   70,   62,   62,   62,   50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Panel dim/glow (only while meaningfully zoomed)
  const zoomT = Math.max(0, Math.min(1, (camZoom - 1) / 0.4));
  const leftDim  = active?.panel === "right" || active?.panel === "radar" || active?.panel === "grid" ? 1 - 0.62 * zoomT : 1;
  // Per-section dim/glow for right panel sub-zones
  const radarDim  = active?.panel === "left" || active?.panel === "grid" ? 1 - 0.62 * zoomT : 1;
  const gridDim   = active?.panel === "left" || active?.panel === "radar" ? 1 - 0.62 * zoomT : 1;
  const leftGlow  = active?.panel === "left"  && zoomT > 0.4;
  const radarGlow = active?.panel === "radar" && zoomT > 0.4;
  const gridGlow  = active?.panel === "grid"  && zoomT > 0.4;
  const ring = (on: boolean) => on ? "0 0 0 2.5px rgba(0,180,216,0.55), 0 0 40px rgba(0,180,216,0.22)" : "none";

  // Big floating explanation — appears on the side opposite the spotlighted panel
  const calloutOp = active ? interpolate(frame, [active.k[0] + 6, active.k[0] + 28, active.k[2] - 8, active.k[2] + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const calloutRise = active ? interpolate(frame, [active.k[0] + 6, active.k[0] + 30], [26, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const calloutSide: "left" | "right" = active?.panel === "left" ? "left" : "right";

  return (
    <AbsoluteFill style={{ opacity: sceneOp }}>
      <BgCalm theme="light" tint="blue" />

      {/* AI Tech Noise for Phase B and C */}
      <Audio
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNErie_GHOSTS Noise Electro-Magnetic Turbulence_ASD.wav")}
        volume={(f) => {
          if (f < 440) return 0;
          return interpolate(f, [440, 480, 1140, 1164], [0, 0.12, 0.12, 0], cl);
        }}
      />
      {/* UI Clicks */}
      <Sequence from={40} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/COMCell_Tech Button Switch Lock Iphone x5 Variations_ASD.wav")} volume={(f) => interpolate(f, [0, 30], [0.15, 0], cl)} /></Sequence>
      <Sequence from={160} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/COMCell_Tech Button Switch Lock Iphone x5 Variations_ASD.wav")} volume={(f) => interpolate(f, [0, 30], [0.15, 0], cl)} /></Sequence>
      <Sequence from={260} layout="none"><Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/COMCell_Tech Button Switch Lock Iphone x5 Variations_ASD.wav")} volume={(f) => interpolate(f, [0, 30], [0.15, 0], cl)} /></Sequence>

      {/* Confirm Chime (UI completion) */}
      <Sequence from={897} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNErie_Magic Generic Potion, Explosion, Burst, Alchemy, Small Bubbles 03_ASD.wav")} volume={0.4} />
      </Sequence>      {/* ── Floating explanation text (dynamic, not a fixed header) ── */}
      {active && calloutOp > 0.01 && (
        <div style={{
          position: "absolute", zIndex: 9, top: 286, width: 560, padding: "28px 32px",
          ...(calloutSide === "left" ? { left: 56 } : { right: 56 }),
          opacity: calloutOp * m.opacity, transform: `translateY(${calloutRise}px)`,
          textAlign: calloutSide === "left" ? "right" as const : "left" as const,
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow: "0 24px 80px rgba(8,16,40,0.08)",
          ...(calloutSide === "left" ? { display: "flex", flexDirection: "column" as const, alignItems: "flex-end" } : {}),
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 30, fontFamily: fonts.mono, fontWeight: 700, color: ds.blue }}>{active.n}</span>
            <span style={{ width: 38, height: 2, background: `${ds.blue}50` }} />
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: ds.fgPrimary, fontFamily: fonts.display, letterSpacing: "-2px", lineHeight: 1.12, whiteSpace: "nowrap" as const }}>{active.title}</div>
          <div style={{ marginTop: 14, fontSize: 21, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.55, maxWidth: 400 }}>{active.desc}</div>
        </div>
      )}

      {/* ── The COMPLETE interface, with a camera that zooms into regions ── */}
      <AbsoluteFill style={{ opacity: cardOp * m.opacity, display: "flex", alignItems: "center", justifyContent: "center", perspective: "1800px" }}>
        {(() => {
          const entryTiltX = interpolate(frame, [0, 55], [16, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const baseY = interpolate(frame, [0, 55], [80, 28], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // Suppress float during camera zoom to prevent jitter on zoom-out return
          const floatAmp = interpolate(camZoom, [1.02, 1.1], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const floatOsc = frame > 60 ? Math.sin(frame * 0.04) * floatAmp : 0;
          return (
            // Camera wrapper — scales about the focused region's origin, then returns
            <div style={{ transformOrigin: "50% 50%", transform: `translate(${-camZoom * (camOx - 50)}%, ${-camZoom * (camOy - 50)}%) scale(${camZoom})` }}>
              <div style={{
                transform: `translateY(${baseY + floatOsc}px) rotateX(${entryTiltX}deg) scale(0.92)`,
                width: 1440, background: "#FFFFFF", borderRadius: 16,
                boxShadow: "0 52px 150px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.07)",
                overflow: "hidden" as const, display: "flex", flexDirection: "column" as const,
              }}>
                <AppBar step={appBarStep} op={1} embedded />
                <div style={{ display: "flex", flexDirection: "row" as const, gap: 16, padding: "20px 24px", background: "#F5F6FA", flex: 1 }}>
                  {/* Left slot — crossfaded panels overlaid, dim + glow per focus */}
                  <div style={{ flex: 1, position: "relative" as const, display: "flex", borderRadius: 12, opacity: leftDim, boxShadow: ring(leftGlow), minHeight: 520 }}>
                    {frame < PB + 18 && <div style={{ position: "absolute", inset: 0, display: "flex", opacity: aOp }}><B2LeftA lf={lA} /></div>}
                    {frame >= PB - 18 && frame < PC + 18 && <div style={{ position: "absolute", inset: 0, display: "flex", opacity: bOp }}><B2LeftB lf={lB} /></div>}
                    {frame >= PC - 18 && <div style={{ position: "absolute", inset: 0, display: "flex", opacity: cOp }}><B2LeftC lf={lC} /></div>}
                  </div>
                  {/* Right slot — per-section radar/grid glow */}
                  <div style={{ flexShrink: 0, display: "flex", borderRadius: 12 }}>
                    <B2RightPanel liveEnvVals={liveEnvVals} hexProg={hexProg} pressureScore={pressureScore} sliderProgress={sliderProgress} lB={panelLB} radarGlow={radarGlow} gridGlow={gridGlow} radarDim={radarDim} gridDim={gridDim} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B3 — Bridge (dark)
// ────────────────────────────────────────────────────────────────────────────

const PingDot: React.FC<{ frame: number; color?: string }> = ({ frame, color = "#00B4D8" }) => {
  const sc  = interpolate(frame, [0, 14], [0, 1], { easing: Easing.out(Easing.back(1.5)), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op  = interpolate(frame, [0, 8, 22, 36], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringSc = interpolate(frame, [6, 36], [0.5, 2.2], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOp = interpolate(frame, [6, 20, 36], [0.6, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "relative", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", opacity: op, marginBottom: 28 }}>
      <div style={{ position: "absolute", width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${color}`, transform: `scale(${ringSc})`, opacity: ringOp }} />
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, boxShadow: `0 0 18px ${color}`, transform: `scale(${sc})` }} />
    </div>
  );
};

const B3Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  // 360f total — 4 phases, ~90f each with cross-fades
  // P1 0-90: 有了環境，下一步——
  const p1Op = interpolate(frame, [0, 12, 72, 90], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p1DashW = interpolate(frame, [24, 50], [0, 180], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P2 78-168: STEP 02 · INTERACT + 求職者視角
  const p2Op = interpolate(frame, [78, 96, 150, 168], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P3 156-246: 他收到了—— / 一份邀請
  const p3Op = interpolate(frame, [156, 174, 228, 246], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3SubOp = interpolate(frame, [168, 186], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p3SubY = interpolate(frame, [168, 186], [20, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P4 234-360: SJT 情境測驗
  const p4Op = interpolate(frame, [234, 252, 346, 360], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const rootOp = interpolate(frame, [0, 16], [0, 1], cl);
  const outOp = interpolate(frame, [336, 360], [1, 0], cl);

  return (
    <AbsoluteFill style={{ opacity: rootOp * outOp }}>
      <BgCalm theme="dark" tint="blue" />

      {/* Riser transition */}
      <Audio 
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNRise_Sfx Rise Tension, Transition, Processed Bell, Reverse, High 01_ASD.wav")}
        volume={(f) => interpolate(f, [0, 24, 336, 360], [0, 0.35, 0.35, 0], cl)} 
      />

      {/* P1: 有了環境，下一步—— */}
      <AbsoluteFill style={{ opacity: p1Op, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <TypewriterText text="有了環境，下一步" startFrame={6} charStagger={2} fontSize={88} fontWeight={850} colorScheme="white" letterSpacing="-0.04em" />
          <div style={{ width: p1DashW, height: 8, background: `linear-gradient(90deg, ${colors.hcCyanBright}, transparent)`, borderRadius: 4, marginLeft: 8, boxShadow: `0 0 24px ${colors.hcCyanBright}` }} />
        </div>
      </AbsoluteFill>

      {/* P2: STEP 02 · INTERACT + 求職者視角 */}
      <AbsoluteFill style={{ opacity: p2Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -150px)" }}>
          <PingDot frame={Math.max(0, frame - 78)} color="#5B8AFF" />
        </div>
        <div style={{ marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 16px", borderRadius: 999, border: "1px solid rgba(91,138,255,0.40)", background: "rgba(91,138,255,0.15)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B8AFF", boxShadow: "0 0 8px #5B8AFF" }} />
          <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#9CB6FF", letterSpacing: "0.24em" }}>STEP 02 · INTERACT</span>
        </div>
        <TypewriterText text="求職者視角" startFrame={88} charStagger={3} fontSize={110} fontWeight={800} colorScheme="white-to-cyan" />
      </AbsoluteFill>

      {/* P3: 他收到了—— 一份邀請 */}
      <AbsoluteFill style={{ opacity: p3Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ color: colors.dimWhite, fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>他收到了——</div>
        <div style={{ color: "#FFFFFF", fontSize: 96, fontWeight: 900, letterSpacing: "-0.06em", opacity: p3SubOp, transform: `translateY(${p3SubY}px)` }}>一份邀請</div>
      </AbsoluteFill>

      {/* P4: SJT 情境測驗 */}
      <AbsoluteFill style={{ opacity: p4Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -150px)" }}>
          <PingDot frame={Math.max(0, frame - 234)} color="#5B8AFF" />
        </div>
        <TypewriterText text="SJT 情境測驗" startFrame={244} charStagger={3} fontSize={110} fontWeight={800} colorScheme="white-to-cyan" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B4 — I · Interact (SJT two questions + loading + score preview)
//
//  Phase A   0 – 600   Q1 (廚房情境) → cursor arrives → clicks A → confirmed
//  Phase B  600 – 900  Q2 (遠端會議情境, quick) → cursor clicks B
//  Phase C  900 –1080  分析行為指紋中… loading bar
//  Phase D 1080–1260   Score preview: 88.5 / 100  FIT
// ────────────────────────────────────────────────────────────────────────────

// Shared SJT card shell ────────────────────────────────────────────────────
// Shared SJT card shell ────────────────────────────────────────────────────
const SJTCard: React.FC<{
  questionNum: string;
  tag: string;
  scenario: string;
  prompt: string;
  options: { letter: string; text: string }[];
  selectedLetter: string | null;
  revealStart: number;
  clickFrame: number;       // absolute frame within this Sequence when click fires
  localFrame: number;
  progressPct: number;
  totalQ: string;
}> = ({ questionNum, tag, scenario, prompt, options, selectedLetter, revealStart, clickFrame, localFrame, progressPct, totalQ }) => {
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  
  // 3D Entrance
  const cardOp = interpolate(localFrame, [0, 16], [0, 1], cl);
  const cardRotX = interpolate(localFrame, [0, 24], [15, 0], { easing: Easing.out(Easing.back(1.4)), ...cl });
  const cardY = interpolate(localFrame, [0, 24], [40, 0], { easing: Easing.out(Easing.back(1.4)), ...cl });
  const cardSc = interpolate(localFrame, [0, 24], [0.92, 1], { easing: Easing.out(Easing.back(1.2)), ...cl });

  // Breathing motion
  const breathe = Math.sin(localFrame / 30) * 3;

  return (
    <div style={{
      opacity: cardOp,
      transform: `translateY(${cardY + breathe}px) scale(${cardSc}) perspective(1000px) rotateX(${cardRotX}deg)`,
      width: 1100, borderRadius: 12, overflow: "hidden" as const, position: "relative" as const,
      boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
    }}>
      {/* Header */}
      <div style={{ background: "#131826", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#1430A0,#2151F5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontFamily: fonts.mono, fontWeight: 700, color: "#FFF" }}>HC</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: colors.softWhite, fontFamily: fonts.display }}>HireCook</span>
        <span style={{ fontSize: 13, fontFamily: fonts.mono, color: colors.dimWhite }}>後端工程師 L3 · Aurora Robotics</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontFamily: fonts.mono, color: colors.dimWhite }}>{questionNum} / {totalQ}</span>
          <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 9999 }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: ds.blue, borderRadius: 9999, transition: "none" }} />
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.10)", fontSize: 12, fontFamily: fonts.mono, color: ds.fgFaint }}>儲存並離開</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "#1A2030", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>{tag}</span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ds.cyan }} />
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted }}>沒有明顯正確答案 · 選你真實會做的</span>
          </div>
          <div style={{ fontSize: 26, color: colors.softWhite, lineHeight: 1.6, fontFamily: fonts.display }}>{scenario}</div>
          <div style={{ fontSize: 22, color: colors.dimWhite, fontFamily: fonts.display }}>{prompt}</div>
        </div>

        {options.map((opt, i) => {
          const revF = revealStart + i * 8;
          const optOp = interpolate(localFrame, [revF, revF + 12], [0, 1], cl);
          const optY = interpolate(localFrame, [revF, revF + 16], [12, 0], { easing: Easing.out(Easing.cubic), ...cl });
          const selected = opt.letter === selectedLetter;
          
          const pop = selected ? interpolate(localFrame, [clickFrame, clickFrame + 4, clickFrame + 12], [1, 1.024, 1], cl) : 1;
          const tickSc = selected ? interpolate(localFrame, [clickFrame, clickFrame + 10], [0, 1], { easing: Easing.out(Easing.back(1.6)), ...cl }) : 0;
          const rippleSc = selected ? interpolate(localFrame, [clickFrame, clickFrame + 48], [0, 4.2], { easing: Easing.out(Easing.cubic), ...cl }) : 0;
          const rippleOp = selected ? interpolate(localFrame, [clickFrame, clickFrame + 16, clickFrame + 48], [0.45, 0.22, 0], cl) : 0;
          
          return (
            <div key={opt.letter} style={{
              opacity: optOp, transform: `translateY(${optY}px) scale(${pop})`,
              display: "flex", alignItems: "center", gap: 14, height: 58, boxSizing: "border-box" as const, padding: "0 18px", borderRadius: 10,
              background: selected ? "rgba(33,81,245,0.18)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${selected ? "#2151F5AA" : "rgba(255,255,255,0.06)"}`,
              boxShadow: selected ? "0 0 0 3px rgba(33,81,245,0.10)" : "none",
              position: "relative" as const, overflow: "hidden" as const, transition: "none",
            }}>
              {selected && (
                <div style={{
                  position: "absolute", left: "50%", top: "50%", width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(33,81,245,0.40)", transform: `translate(-50%, -50%) scale(${rippleSc})`, opacity: rippleOp, pointerEvents: "none",
                }} />
              )}
              <div style={{ width: 34, height: 34, borderRadius: 8, background: selected ? ds.blue : "rgba(255,255,255,0.06)", border: `1.5px solid ${selected ? ds.blue : "rgba(255,255,255,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1, transition: "none" }}>
                <span style={{ fontSize: 15, fontFamily: fonts.mono, fontWeight: 700, color: "#FFF" }}>{opt.letter}</span>
              </div>
              <span style={{ fontSize: 22, color: selected ? colors.softWhite : colors.dimWhite, fontFamily: fonts.display, flex: 1, zIndex: 1 }}>{opt.text}</span>
              {selected && <span style={{ fontSize: 20, color: ds.cyan, fontWeight: 700, transform: `scale(${tickSc})`, display: "inline-block", zIndex: 1 }}>✓</span>}
            </div>
          );
        })}

        {/* Capture sweep bar */}
        {selectedLetter !== null && (
          <div style={{
            height: 2, borderRadius: 1, background: `linear-gradient(90deg,${ds.blue},${ds.cyan})`,
            width: `${interpolate(localFrame, [clickFrame + 2, clickFrame + 70], [0, 100], { easing: Easing.out(Easing.cubic), ...cl })}%`,
          }} />
        )}
      </div>
    </div>
  );
};

const B4Interact: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 586, 610);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  const O = 0;
  const qFrame      = Math.max(0, frame - O);
  
  // Adjusted timings:
  // Q1: 0 - 320
  // Q2: 280 - 540
  // Loading: 500 - 700
  const showQ1      = frame >= O && frame < O + 320;
  const showQ2      = frame >= O + 280 && frame < O + 540;
  const showLoading = frame >= O + 500 && frame < O + 710;

  const q1Local = qFrame;
  const q1Click = 200;

  const q2Local = Math.max(0, qFrame - 280);
  const q2Click = 140;

  // Q1 Out / Q2 In transitions
  const q1ExitX = interpolate(qFrame, [280, 310], [0, -64], { easing: Easing.in(Easing.cubic), ...cl });
  const q1ExitOp = interpolate(qFrame, [280, 310], [1, 0], cl);
  const q1ExitSc = interpolate(qFrame, [280, 310], [1, 0.90], { easing: Easing.in(Easing.cubic), ...cl });

  const q2EnterX = interpolate(q2Local, [0, 30], [64, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const q2EnterOp = interpolate(q2Local, [0, 20], [0, 1], cl);
  const q2EnterSc = interpolate(q2Local, [0, 30], [0.90, 1], { easing: Easing.out(Easing.cubic), ...cl });

  const q2ExitX = interpolate(qFrame, [500, 530], [0, -64], { easing: Easing.in(Easing.cubic), ...cl });
  const q2ExitOp = interpolate(qFrame, [500, 530], [1, 0], cl);
  const q2ExitSc = interpolate(qFrame, [500, 530], [1, 0.90], { easing: Easing.in(Easing.cubic), ...cl });

  const wireRot = frame * 0.4;

  return (
    <AbsoluteFill style={{ opacity: m.opacity }}>
      <BgCalm theme="dark" tint="blue" />

      {/* Room Tone for Remote Meeting Q2 */}
      <Sequence from={280} durationInFrames={260} layout="none">
        <Audio 
          src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/AMBPubl_Room Tone Hotel Staircase, Quiet, 5Am, Chiang Mai, Thailand_ASD.wav")} 
          volume={(f) => interpolate(f, [0, 30, 230, 260], [0, 0.25, 0.25, 0], cl)} 
        />
      </Sequence>

      <AbsoluteFill style={{ transform: m.transform }}>
        
        <div style={{ width: "100%", height: "100%", position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
          
          {showQ1 && (
            <div style={{ position: "absolute", transform: `translateX(${q1ExitX}px) scale(${q1ExitSc})`, opacity: q1ExitOp, zIndex: 10 }}>
              <SJTCard
                questionNum="07" tag="情境 07 · 廚房 · 截止日碰撞"
                scenario="你負責備餐，傳菜員已在出餐口等待。配菜那端的隊友突然發現食材不夠，開始重備，但沒有開口說。廚師長正在計時，三分鐘後這桌就超時了。"
                prompt="你第一個動作是——"
                options={[
                  { letter: "A", text: "直接接手配菜工作，自己同時備兩個位置。" },
                  { letter: "B", text: "大聲告訴隊友食材不夠，請他去通知廚師長。" },
                  { letter: "C", text: "先出一個可以先上的菜穩住桌況，配菜再想辦法。" },
                  { letter: "D", text: "向廚師長報告有問題，請他決定怎麼調度。" },
                ]}
                selectedLetter={q1Local >= q1Click ? "A" : null}
                revealStart={30}
                clickFrame={q1Click}
                localFrame={q1Local}
                progressPct={46}
                totalQ="15"
              />
            </div>
          )}

          {showQ2 && (
            <div style={{ position: "absolute", transform: `translateX(${q2EnterX + q2ExitX}px) scale(${q2EnterSc * q2ExitSc})`, opacity: q2EnterOp * q2ExitOp, zIndex: 20 }}>
              <SJTCard
                questionNum="08" tag="情境 08 · 遠端會議 · 技術分歧"
                scenario="你在跨時區的視訊設計評審中，提出的架構方案遭到資深工程師當場否決，理由簡短且缺乏解釋。其他人保持沉默，主持人正準備繼續下一議題。"
                prompt="你會——"
                options={[
                  { letter: "A", text: "接受否決，先記下來會後私下溝通。" },
                  { letter: "B", text: "當下禮貌請對方說明具體技術顧慮。" },
                  { letter: "C", text: "提議先暫停議程，開個小組釐清分歧。" },
                  { letter: "D", text: "調整方案，提出折衷版本讓討論繼續。" },
                ]}
                selectedLetter={q2Local >= q2Click ? "B" : null}
                revealStart={30}
                clickFrame={q2Click}
                localFrame={q2Local}
                progressPct={53}
                totalQ="15"
              />
            </div>
          )}

        </div>

        {/* Loading Phase */}
        {showLoading && (() => {
          const lF = qFrame - 500;
          const traits = ["壓力反應模式", "協作決策傾向", "模糊容忍度", "衝突處理策略"];
          const traitCycle = 22; 
          const currentT = Math.max(0, Math.min(traits.length - 1, Math.floor((lF - 30) / traitCycle)));
          const progressStep = (currentT + 1) * 25;
          const smoothProg = interpolate(lF, [30 + currentT * traitCycle, 30 + currentT * traitCycle + 10], [currentT * 25, progressStep], cl);
          const loadOp = interpolate(lF, [0, 20, 180, 200], [0, 1, 1, 0], cl);

          return (
            <AbsoluteFill style={{ opacity: loadOp, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 54 }}>
              
              <div style={{ position: "relative", width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Rotating 3D Hexagon wireframe illusion */}
                <div style={{ position: "absolute", width: "100%", height: "100%", transform: `rotateZ(${wireRot}deg) rotateX(60deg)`, border: "2px solid rgba(0,180,216,0.3)", borderRadius: "50%" }} />
                <div style={{ position: "absolute", width: "100%", height: "100%", transform: `rotateZ(${-wireRot * 0.8}deg) rotateY(60deg)`, border: "2px solid rgba(33,81,245,0.4)", borderRadius: "50%" }} />
                <LucideIcon name="target" size={56} color="#FFF" />
              </div>

              <TypewriterText text="分析行為指紋中…" startFrame={qFrame - 490} charStagger={3} fontSize={56} fontWeight={700} colorScheme="white-to-cyan" />
              
              <div style={{ width: 480, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 9999 }}>
                <div style={{ height: "100%", width: `${smoothProg}%`, background: `linear-gradient(90deg,${ds.blue},${ds.cyan})`, borderRadius: 9999, transition: "none" }} />
              </div>

              <div style={{ height: 40, overflow: "hidden", position: "relative", width: 400, display: "flex", justifyContent: "center" }}>
                {lF >= 30 && traits.map((t, i) => {
                  const tLocal = lF - (30 + i * traitCycle);
                  if (tLocal < 0 || tLocal > traitCycle + 12) return null;
                  const tY = interpolate(tLocal, [0, 8, traitCycle, traitCycle + 8], [30, 0, 0, -30], cl);
                  const tOp = interpolate(tLocal, [0, 8, traitCycle, traitCycle + 8], [0, 1, 1, 0], cl);
                  return (
                    <div key={t} style={{ position: "absolute", opacity: tOp, transform: `translateY(${tY}px)`, display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 10px ${ds.cyan}` }} />
                      <span style={{ fontSize: 24, fontFamily: fonts.mono, color: "rgba(255,255,255,0.70)", letterSpacing: "0.14em" }}>{t}</span>
                    </div>
                  );
                })}
              </div>
            </AbsoluteFill>
          );
        })()}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B5 — Capture flash
// ────────────────────────────────────────────────────────────────────────────

const B5Capture: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 190, 214);

  // Phase 1 (0-40): gradient circle scales in with bounce + radial glow expands
  const circleSc = interpolate(frame, [8, 32], [0, 1], {
    easing: Easing.out(Easing.back(1.55)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const glowSc = interpolate(frame, [8, 60], [0.4, 1.8], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const glowOp = interpolate(frame, [8, 30, 60, 120], [0, 0.7, 0.45, 0.3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Checkmark draw-in (SVG stroke dashoffset trick via opacity + scale)
  const tickOp = interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tickSc = interpolate(frame, [24, 38], [0.3, 1], {
    easing: Easing.out(Easing.back(1.3)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Circle pulse breathe
  const pulse = 1 + 0.025 * Math.sin(frame * 0.12);

  // Phase 2 (50+): text rises up
  const textOp = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const textY  = interpolate(frame, [50, 70], [28, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: m.opacity }}>
      <BgCalm theme="dark" tint="blue" />
      
      {/* Deep Impact & Flashback */}
      <Audio 
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNBram_Face in the Mirror Impact_ASD_XForce_x06.wav")} 
        volume={(f) => interpolate(f, [190, 214], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} 
      />
      <Audio 
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/WHSH_Sfx Transition Flashback, Remembrance, Deep 02_ASD.wav")} 
        volume={(f) => interpolate(f, [190, 214], [0.4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} 
      />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
        {/* Glow halo behind circle — brand blue luminance */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute",
            width: 260, height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(33,81,245,0.45) 0%, rgba(20,48,160,0.22) 46%, transparent 72%)",
            transform: `scale(${glowSc})`,
            opacity: glowOp,
          }} />
          {/* Cyan prediction-signal ring (oscilloscope trace), expands outward */}
          {[0, 1].map((k) => {
            const delay = k * 18;
            const rSc = interpolate(frame - delay, [18, 64], [0.7, 2.0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const rOp = interpolate(frame - delay, [18, 40, 64], [0.55, 0.28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={k} style={{
                position: "absolute", width: 130, height: 130, borderRadius: "50%",
                border: "1.5px solid #6FE3F5",
                transform: `scale(${rSc})`, opacity: rOp,
              }} />
            );
          })}
          {/* Brand-blue circle */}
          <div style={{
            width: 110, height: 110, borderRadius: "50%",
            background: "#2151F5",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 0 40px rgba(33,81,245,0.55)",
            transform: `scale(${circleSc * pulse})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Checkmark */}
            <div style={{ opacity: tickOp, transform: `scale(${tickSc})` }}>
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <polyline
                  points="12,28 22,38 40,16"
                  stroke="#FFFFFF"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <div style={{ opacity: textOp, transform: `translateY(${textY}px)`, textAlign: "center" as const }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-2px", lineHeight: 1.1 }}>
            行為指紋捕捉完成
          </div>
          <div style={{
            marginTop: 14, fontSize: 20, fontFamily: fonts.mono, letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.50)",
            opacity: interpolate(frame, [70, 88], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}>
            BEHAVIOR FINGERPRINT CAPTURED
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B6 — Bridge to T
// ────────────────────────────────────────────────────────────────────────────

const B6Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const rootOp = interpolate(frame, [0, 16], [0, 1], cl);
  const outOp = interpolate(frame, [336, 360], [1, 0], cl);
  // 360f total — 3 phases, ~120f each with cross-fades
  // P1 0-120: 不知道 / 背後的標準答案是什麼
  const p1Op = interpolate(frame, [0, 12, 100, 120], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p1Line2Op = interpolate(frame, [18, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p1Line2Y = interpolate(frame, [18, 34], [16, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P2 108-228: 接著，給主管一份手冊——
  const p2Op = interpolate(frame, [108, 126, 210, 228], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2DashW = interpolate(frame, [140, 170], [0, 180], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // P3 216-360: STEP 03 · TARGET + P×E 交叉分析
  const p3Op = interpolate(frame, [216, 234, 346, 360], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: rootOp * outOp }}>
      <BgCalm theme="dark" tint="blue" />

      {/* Swell Riser Transition */}
      <Audio 
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNEthr_GHOSTS Swell Riser Vaporous_ASD.wav")}
        volume={(f) => interpolate(f, [0, 24, 336, 360], [0, 0.45, 0.45, 0], cl)} 
      />

      {/* P1: 不知道 / 背後的標準答案是什麼 */}
      <AbsoluteFill style={{ opacity: p1Op, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
          <div style={{ color: colors.dimWhite, fontSize: 64, fontWeight: 700, letterSpacing: "-0.02em" }}>不知道</div>
          <div style={{ color: colors.hcCyanBright, fontSize: 88, fontWeight: 900, letterSpacing: "-0.04em", opacity: p1Line2Op, transform: `translateY(${p1Line2Y}px)`, textShadow: `0 0 36px ${colors.hcCyanBright}44` }}>背後的標準答案是什麼</div>
        </div>
      </AbsoluteFill>

      {/* P2: 接著，給主管一份手冊—— */}
      <AbsoluteFill style={{ opacity: p2Op, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <TypewriterText text="接著，給主管一份手冊" startFrame={118} charStagger={2} fontSize={88} fontWeight={850} colorScheme="white" letterSpacing="-0.04em" />
          <div style={{ width: p2DashW, height: 8, background: `linear-gradient(90deg, ${colors.hcCyanBright}, transparent)`, borderRadius: 4, marginLeft: 8, boxShadow: `0 0 24px ${colors.hcCyanBright}` }} />
        </div>
      </AbsoluteFill>

      {/* P3: STEP 03 · TARGET + P×E 交叉分析 */}
      <AbsoluteFill style={{ opacity: p3Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -150px)" }}>
          <PingDot frame={Math.max(0, frame - 216)} color={ds.fit} />
        </div>
        <div style={{ marginBottom: 28, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 16px", borderRadius: 999, border: `1px solid ${ds.fit}40`, background: `${ds.fit}15` }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ds.fit, boxShadow: `0 0 8px ${ds.fit}` }} />
          <span style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fit, letterSpacing: "0.24em" }}>STEP 03 · TARGET</span>
        </div>
        <TypewriterText text="P×E 交叉分析" startFrame={226} charStagger={3} fontSize={110} fontWeight={800} colorScheme="white-to-cyan" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B7 — T · Tailor  (terminal intro + playbook)
//
//  Phase A  0 – 360   terminal: AI streaming analysis lines
//  Phase B  360–1200  playbook cards reveal
// ────────────────────────────────────────────────────────────────────────────

const TERMINAL_LINES = [
  { text: "> 載入環境向量 ENV-2024-0847…",                        start: 10 },
  { text: "> 比對行為指紋 BFP-陳威宇-0312…",                      start: 26 },
  { text: "> 計算 P×E 適配矩陣 [6×6]…",                          start: 42 },
  { text: "> 解析 XAI 驅動因子 (決策自主性 +4.2σ)…",              start: 58 },
  { text: "> 匹配歷史留任資料庫 n=14,820…",                       start: 74 },
  { text: "> 生成管理建議 Playbook v4.3…",                        start: 90 },
  { text: "",                                                     start: 106 },
  { text: "  適配分數    88.5 / 100",                             start: 112 },
  { text: "  6個月留任率  84%   (↑ +18.6pp vs 基準)",             start: 122 },
  { text: "  錯配成本節省  NT$ 22 萬   預期效益",                  start: 132 },
  { text: "",                                                     start: 142 },
  { text: "  [完成] TAT Playbook 已就緒",                         start: 146 },
];

const TerminalLine: React.FC<{ text: string; startF: number; highlight?: boolean; lf: number }> = ({ text, startF, highlight, lf }) => {
  if (!text) return <div style={{ height: 10 }} />;
  const n = Math.floor(interpolate(lf, [startF, startF + text.length * 0.8], [0, text.length], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));
  const displayed = text.slice(0, n);
  const color = highlight
    ? "#00B4D8"
    : text.startsWith(">")
      ? "rgba(255,255,255,0.65)"
      : "rgba(255,255,255,0.88)";
  return (
    <div style={{ fontSize: 17, fontFamily: fonts.mono, color, lineHeight: 1.7, whiteSpace: "pre" as const }}>
      {displayed}
    </div>
  );
};

const B7TailorTerminal: React.FC<{ lf: number }> = ({ lf }) => {
  const op = interpolate(lf, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{
        background: "#0E121C", borderRadius: 12, padding: "36px 44px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.4)",
        width: 760, boxSizing: "border-box" as const,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 22 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 12, fontSize: 13, fontFamily: fonts.mono, color: "rgba(255,255,255,0.30)" }}>hirecook · ai-engine · v4.3</span>
        </div>
        {TERMINAL_LINES.map((l, i) => (
          <React.Fragment key={i}>
            <TerminalLine text={l.text} startF={l.start} lf={lf} highlight={l.text.includes("完成") || l.text.startsWith("  適配") || l.text.startsWith("  6個月") || l.text.startsWith("  錯配")} />

          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const B7Tailor: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 24, 1140, 1154);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase gates & Transition
  const terminalEnd = 220; // Shorter wait time
  const showTerminal = frame < terminalEnd + 30; // keep mounted during transition
  const terminalLF   = frame;
  const lf = Math.max(0, frame - terminalEnd); // playbook local frame

  // ── Terminal Out Transition ──
  const termOutOp = interpolate(frame, [terminalEnd, terminalEnd + 16], [1, 0], cl);
  const termOutSc = interpolate(frame, [terminalEnd, terminalEnd + 20], [1, 1.5], { easing: Easing.in(Easing.cubic), ...cl });

  // ── Dashboard reveal ──
  const dashOp = interpolate(lf, [0, 20], [0, 1], { easing: Easing.out(Easing.cubic), ...cl });
  const dashY  = 0;
  const dashSc = interpolate(lf, [0, 24], [0.75, 1], { easing: Easing.out(Easing.cubic), ...cl });

  // KPI counters
  const fitScore = interpolate(lf, [10, 120], [0, 88.5], { easing: Easing.out(Easing.cubic), ...cl });
  const retPct   = interpolate(lf, [20, 132], [0, 84], { easing: Easing.out(Easing.cubic), ...cl });
  const costVal  = interpolate(lf, [32, 144], [0, 22], { easing: Easing.out(Easing.cubic), ...cl });
  const radarProg = interpolate(lf, [40, 180], [0, 1], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Camera tour stops ──
  type B7Stop = { k: [number,number,number,number]; ox: number; oy: number; z: number; sect: "kpi"|"pemap"|"xai"|"recs"; n: string; title: string; desc: string; calloutPos: "bottom"|"right"|"left"|"top" };
  const b7Stops: B7Stop[] = [
    { k: [170, 198, 330, 358], ox: 50, oy: 15, z: 1.15, sect: "kpi",   n: "①", title: "P×E 預測結果", desc: "結合環境與行為，直接預測留任率與錯配成本。", calloutPos: "top" },
    { k: [358, 386, 518, 546], ox: 25, oy: 54, z: 1.15, sect: "pemap", n: "②", title: "雷達疊合分析", desc: "視覺化比對雙方落差，找出隱藏的摩擦風險點。", calloutPos: "left" },
    { k: [546, 574, 706, 734], ox: 75, oy: 54, z: 1.15, sect: "xai",   n: "③", title: "行為驅動因子", desc: "XAI 解釋為什麼適合，給予高信心度的背後原因。", calloutPos: "right" },
    { k: [734, 762, 894, 922], ox: 50, oy: 85, z: 1.15, sect: "recs",  n: "④", title: "專屬管理建議", desc: "直接給主管第一天的具體帶人指南，避免磨合失敗。", calloutPos: "bottom" },
  ];
  const b7Active = b7Stops.find(s => lf >= s.k[0] && lf < s.k[3]);
  
  // Continuous camera path — no reset between stops, direct pan+zoom
  // Keyframes: before | kpi-in | kpi-hold | pemap-in | pemap-hold | xai-in | xai-hold | recs-in | recs-hold | out
  const camZ = interpolate(lf,
    [170, 198, 330, 386, 518, 574, 706, 762, 894, 922],
    [  1, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15, 1.15,    1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOx = interpolate(lf,
    [170, 198, 330, 386, 518, 574, 706, 762, 894, 922],
    [ 50,  50,  50,  25,  25,  75,  75,  50,  50,  50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOy = interpolate(lf,
    [170, 198, 330, 386, 518, 574, 706, 762, 894, 922],
    [ 50,  15,  15,  54,  54,  54,  54,  85,  85,  50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Idle float — keeps the dashboard alive on arrival, damped to 0 once the camera zooms in
  const b7FloatAmp = interpolate(camZ, [1.02, 1.1], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b7Float = lf > 40 ? Math.sin(lf * 0.045) * b7FloatAmp : 0;

  // Section highlight / dim helpers
  const sOp = (sect: string): number => {
    if (!b7Active) return 1;
    if (b7Active.sect === sect) return 1;
    return interpolate(lf, [b7Active.k[0], b7Active.k[0] + 22], [1, 0.28], cl);
  };
  const sRing = (sect: string): string => {
    if (!b7Active || b7Active.sect !== sect) return "none";
    const p = interpolate(lf, [b7Active.k[0], b7Active.k[0] + 24], [0, 1], cl);
    return `inset 0 0 0 2.5px rgba(33,81,245,${(p * 0.60).toFixed(2)}), 0 0 0 5px rgba(33,81,245,${(p * 0.09).toFixed(2)})`;
  };

  // Big floating explanation logic
  const calloutOp = b7Active ? interpolate(lf, [b7Active.k[0] + 6, b7Active.k[0] + 28, b7Active.k[2] - 8, b7Active.k[2] + 12], [0, 1, 1, 0], cl) : 0;
  const calloutRise = b7Active ? interpolate(lf, [b7Active.k[0] + 6, b7Active.k[0] + 30], [26, 0], { easing: Easing.out(Easing.cubic), ...cl }) : 0;

  // Data
  const drivers = [
    { label: "決策自主性",   score: 94, desc: "在高壓情境下獨立決策，優於基準組 22%",    top: true  },
    { label: "高協作密度",   score: 88, desc: "高頻協作環境下效能顯著提升",             top: false },
    { label: "快速節奏適應", score: 85, desc: "時間壓力下維持穩定決策品質",             top: false },
    { label: "衝突直接處理", score: 79, desc: "面對分歧直接表達，適合開放討論文化",     top: false },
    { label: "模糊容忍度",   score: 73, desc: "可接受非結構任務，但需明確最終目標",     top: false },
  ];
  const recs = [
    { n: "01", text: "設定清晰自主邊界，避免過度微觀管理", detail: "此人決策自主性強——限制空間反而降低效能" },
    { n: "02", text: "多任務超載時提前介入",               detail: "壓力臨界點明確：同時處理 3+ 任務時留意品質" },
    { n: "03", text: "動機誘因：自主探索 + 清晰成果邊界", detail: "內部驅動型——外部物質激勵效果有限" },
  ];

  const bgLightOp = interpolate(lf, [0, 20], [0, 1], cl);

  return (
    <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>
      <BgCalm theme="dark" tint="blue" />

      {/* AI Terminal Noise */}
      <Audio
        src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNErie_GHOSTS Noise Electro-Magnetic Turbulence_ASD.wav")}
        volume={(f) => interpolate(f, [0, 20, terminalEnd, terminalEnd + 20], [0, 0.15, 0.15, 0], cl)}
      />
      {/* Fit Score Chime Reveal */}
      <Sequence from={terminalEnd + 120} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic White Fairy Dust, Chime, Shimmer, Cliche, Short, Appear 05_ASD.wav")} volume={0.3} />
      </Sequence>

      <AbsoluteFill style={{ opacity: bgLightOp }}>
        <BgCalm theme="light" tint="blue" />
      </AbsoluteFill>
      <AbsoluteFill>

        {/* ── Phase A: terminal ── */}
        {showTerminal && (
          <div style={{ position: "absolute", inset: 0, opacity: termOutOp, transform: `scale(${termOutSc})` }}>
            <div style={{ position: "absolute", top: 70, left: 0, right: 0, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 11, opacity: interpolate(terminalLF, [0, 15], [0, 1], cl) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,180,216,0.35)", background: "rgba(0,180,216,0.07)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 ${4 + 5 * (0.5 + 0.5 * Math.sin(frame * 0.18))}px ${ds.cyan}` }} />
                <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#6FE3F5", letterSpacing: "0.18em" }}>T · TARGET — AI 生成中</span>
              </div>
              <div style={{ fontSize: 48, fontWeight: 700, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-1.5px", lineHeight: 1.1, textAlign: "center" as const }}>為這個人，生成專屬管理手冊</div>
              <div style={{ fontSize: 19, color: "rgba(255,255,255,0.55)", fontFamily: fonts.display, lineHeight: 1.5, textAlign: "center" as const }}>結合環境向量與行為指紋，輸出可執行的 TAT 管理建議。</div>
            </div>
            <div style={{ position: "absolute", inset: 0, paddingTop: 150 }}>
              <B7TailorTerminal lf={terminalLF} />
            </div>
            {terminalLF >= 160 && (
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: `rgba(14,18,28,${interpolate(terminalLF, [160, 175], [0, 0.75])})`,
                backdropFilter: `blur(${interpolate(terminalLF, [160, 175], [0, 12])}px)`,
                zIndex: 20
              }}>
                <div style={{
                  fontSize: 72, fontFamily: fonts.mono, color: "#FFFFFF", fontWeight: 800, letterSpacing: "0.2em",
                  textShadow: `0 0 30px ${ds.cyan}, 0 0 60px ${ds.blue}`,
                  transform: `scale(${interpolate(terminalLF, [160, 200], [0.85, 1.15])})`,
                  opacity: interpolate(terminalLF, [160, 175, 200], [0, 1, 0])
                }}>
                  RENDERING UI...
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Phase B: Full HC dashboard + camera tour ── */}
        {lf >= 0 && (
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Camera zoom wrapper */}
            <div style={{ transformOrigin: "50% 50%", transform: `translate(${-camZ * (camOx - 50)}%, ${-camZ * (camOy - 50)}%) scale(${camZ})` }}>
              {/* Dashboard shell */}
              <div style={{
                width: 1440, borderRadius: 16, overflow: "hidden" as const, position: "relative" as const,
                background: "#FFFFFF",
                boxShadow: "0 24px 80px rgba(8,16,40,0.11), 0 1px 0 rgba(8,16,40,0.06)",
                opacity: dashOp, transform: `translateY(${dashY + b7Float}px) scale(${dashSc})`,
                display: "flex", flexDirection: "column" as const,
              }}>
                {/* Sweep overlay for transition */}
                <div style={{ position: "absolute", inset: 0, zIndex: 100, opacity: interpolate(lf, [0, 6, 24, 30], [0, 1, 1, 0], cl), pointerEvents: "none" }}>
                  <div style={{ position: "absolute", top: interpolate(lf, [0, 30], [0, 1000], cl), left: 0, right: 0, height: 4, background: ds.cyan, boxShadow: `0 0 24px 4px ${ds.cyan}` }} />
                  <div style={{ position: "absolute", top: 0, height: interpolate(lf, [0, 30], [0, 1000], cl), left: 0, right: 0, background: "rgba(0,180,216,0.08)" }} />
                </div>

                {/* ── Header ───────────────────────────────────── */}
                <div style={{ height: 52, padding: "0 24px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(8,16,40,0.06)", flexShrink: 0 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg,#1430A0,#2151F5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 10, fontFamily: fonts.mono, fontWeight: 700, color: "#FFF" }}>HC</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display }}>HireCook</span>
                  <div style={{ width: 1, height: 16, background: "rgba(8,16,40,0.08)", margin: "0 2px" }} />
                  <span style={{ fontSize: 12, color: ds.fgMuted, fontFamily: fonts.mono }}>後端工程師 L3 · Aurora Robotics</span>
                  <div style={{ width: 1, height: 16, background: "rgba(8,16,40,0.08)", margin: "0 2px" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display }}>陳威宇</span>
                  <span style={{ fontSize: 11, color: ds.fgFaint, fontFamily: fonts.mono, marginLeft: 2 }}>#CHD-047</span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 5, background: "#E6F5EC", border: "1px solid rgba(27,122,77,0.22)" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: ds.fit }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#146F3E", fontFamily: fonts.mono }}>適配</span>
                    </div>
                    <div style={{ padding: "3px 12px", borderRadius: 5, border: "1px solid rgba(8,16,40,0.08)", fontSize: 11, color: ds.fgMuted, fontFamily: fonts.mono }}>匯出報告</div>
                    <div style={{ padding: "3px 12px", borderRadius: 5, background: ds.blue, fontSize: 11, fontWeight: 600, color: "#FFF", fontFamily: fonts.mono }}>指派面試官</div>
                  </div>
                </div>

                {/* ── KPI row ─────────────────────────────────── */}
                <div style={{ display: "flex", borderBottom: "1px solid rgba(8,16,40,0.06)", flexShrink: 0, opacity: sOp("kpi"), boxShadow: sRing("kpi") }}>
                  {/* Fit Score */}
                  <div style={{ flex: 1, padding: "18px 24px", borderRight: "1px solid rgba(8,16,40,0.06)", position: "relative" as const, opacity: interpolate(lf, [4, 24], [0, 1], cl), transform: `translateY(${interpolate(lf, [4, 30], [22, 0], { easing: Easing.out(Easing.cubic), ...cl })}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: ds.fit, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.08em", marginBottom: 5 }}>P×E 適配分數</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 44, fontFamily: fonts.mono, fontWeight: 800, color: ds.fit, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fitScore.toFixed(1)}</span>
                      <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>/100</span>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, color: "#146F3E", fontFamily: fonts.mono }}>↑ 高出基準組 +18.2 分</div>
                  </div>
                  {/* Retention */}
                  <div style={{ flex: 1, padding: "18px 24px", borderRight: "1px solid rgba(8,16,40,0.06)", position: "relative" as const, opacity: interpolate(lf, [12, 32], [0, 1], cl), transform: `translateY(${interpolate(lf, [12, 38], [22, 0], { easing: Easing.out(Easing.cubic), ...cl })}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: ds.blue, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.08em", marginBottom: 5 }}>6 個月留任率預測</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 44, fontFamily: fonts.mono, fontWeight: 800, color: ds.fgPrimary, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(retPct)}</span>
                      <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>%</span>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, color: ds.blue, fontFamily: fonts.mono }}>對照基準 65.4% · ↑ +18.6pp</div>
                  </div>
                  {/* Cost */}
                  <div style={{ flex: 1, padding: "18px 24px", position: "relative" as const, opacity: interpolate(lf, [20, 40], [0, 1], cl), transform: `translateY(${interpolate(lf, [20, 46], [22, 0], { easing: Easing.out(Easing.cubic), ...cl })}px)` }}>
                    <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: ds.cyan, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.08em", marginBottom: 5 }}>錯配成本節省（預期）</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 20, fontFamily: fonts.mono, color: ds.fgFaint, alignSelf: "flex-end", marginBottom: 5 }}>NT$</span>
                      <span style={{ fontSize: 44, fontFamily: fonts.mono, fontWeight: 800, color: ds.fgPrimary, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(costVal)}</span>
                      <span style={{ fontSize: 20, fontFamily: fonts.mono, color: ds.fgFaint }}>萬</span>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, color: ds.fgMuted, fontFamily: fonts.mono }}>基於歷史錯配率 × 重招成本模型</div>
                  </div>
                </div>

                {/* ── Middle row: P×E map + XAI drivers ──────── */}
                <div style={{ display: "flex", flex: 1, minHeight: 360, overflow: "hidden" as const }}>
                  {/* P×E radar */}
                  <div style={{ width: "38%", padding: "22px 24px", borderRight: "1px solid rgba(8,16,40,0.06)", display: "flex", flexDirection: "column" as const, gap: 12, opacity: sOp("pemap"), boxShadow: sRing("pemap") }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display }}>P × E 人格環境疊合</div>
                      <div style={{ fontSize: 11, color: ds.fgMuted, fontFamily: fonts.mono, marginTop: 2 }}>高度吻合 · 適配信心 92%</div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <PEMapRadar size={270} pVals={pVals} eVals={eVals} prog={radarProg} />
                    </div>
                    <div style={{ display: "flex", gap: 18 }}>
                      {[{ color: ds.cyan, label: "P · 人格向量" }, { color: ds.blue, label: "E · 環境模型" }].map((leg) => (
                        <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 18, height: 2.5, background: leg.color, borderRadius: 2 }} />
                          <span style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgMuted }}>{leg.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* XAI drivers */}
                  <div style={{ flex: 1, padding: "22px 24px", display: "flex", flexDirection: "column" as const, opacity: sOp("xai"), boxShadow: sRing("xai") }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display }}>行為驅動因子解析</div>
                      <div style={{ fontSize: 11, color: ds.fgMuted, fontFamily: fonts.mono, marginTop: 2 }}>XAI 可解釋因子 · 驅動本次適配評估</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" as const, flex: 1, justifyContent: "space-between" }}>
                      {drivers.map((d, i) => {
                        const dOp  = interpolate(lf, [60 + i * 12, 76 + i * 12], [0, 1], cl);
                        const barW = interpolate(lf, [82 + i * 12, 170 + i * 12], [0, d.score], { easing: Easing.out(Easing.cubic), ...cl });
                        return (
                          <div key={d.label} style={{ opacity: dOp, padding: "8px 0", borderBottom: i < drivers.length - 1 ? "1px solid rgba(8,16,40,0.06)" : "none", display: "flex", gap: 14, alignItems: "center" }}>
                            <div style={{ width: 110, flexShrink: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display, marginBottom: 5 }}>{d.label}</div>
                              <div style={{ width: 90, height: 3.5, background: "rgba(8,16,40,0.06)", borderRadius: 2 }}>
                                <div style={{ width: `${barW}%`, height: "100%", background: d.top ? ds.fit : ds.blue, borderRadius: 2 }} />
                              </div>
                            </div>
                            <span style={{ fontSize: 20, fontFamily: fonts.mono, fontWeight: 700, color: d.top ? ds.fit : ds.fgPrimary, flexShrink: 0, minWidth: 32 }}>{d.score}</span>
                            <span style={{ fontSize: 11, color: ds.fgMuted, fontFamily: fonts.display, lineHeight: 1.45, flex: 1 }}>{d.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── Management recs ──────────────────────────── */}
                <div style={{ borderTop: "1px solid rgba(8,16,40,0.06)", padding: "18px 24px", flexShrink: 0, opacity: sOp("recs"), boxShadow: sRing("recs") }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display, marginBottom: 12 }}>可執行管理建議 · 前 90 天</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {recs.map((r, i) => {
                      const rOp = interpolate(lf, [90 + i * 18, 110 + i * 18], [0, 1], cl);
                      const rY  = interpolate(lf, [90 + i * 18, 114 + i * 18], [16, 0], { easing: Easing.out(Easing.cubic), ...cl });
                      return (
                        <div key={r.n} style={{ opacity: rOp, transform: `translateY(${rY}px)`, flex: 1, padding: "14px 16px", background: "#F7F8FB", borderRadius: 10, border: "1px solid rgba(8,16,40,0.06)" }}>
                          <div style={{ marginBottom: 7 }}>
                            <span style={{ fontSize: 10, fontFamily: fonts.mono, fontWeight: 700, color: ds.blue, padding: "2px 7px", borderRadius: 4, background: "rgba(33,81,245,0.10)" }}>{r.n}</span>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display, lineHeight: 1.45, marginBottom: 5 }}>{r.text}</div>
                          <div style={{ fontSize: 11, color: ds.fgMuted, fontFamily: fonts.display, lineHeight: 1.5 }}>{r.detail}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Explanation Callout Overlay ── */}
            <AbsoluteFill style={{ zIndex: 30, opacity: calloutOp, pointerEvents: "none" }}>
              {b7Active && (
                <div style={{
                  position: "absolute",
                  top: b7Active.calloutPos === "bottom" ? "auto" : b7Active.calloutPos === "top" ? "12%" : "50%",
                  bottom: b7Active.calloutPos === "bottom" ? "10%" : "auto",
                  left: b7Active.calloutPos === "left" ? "8%" : b7Active.calloutPos === "top" || b7Active.calloutPos === "bottom" ? "50%" : "auto",
                  right: b7Active.calloutPos === "right" ? "8%" : "auto",
                  transform: b7Active.calloutPos === "top" || b7Active.calloutPos === "bottom"
                    ? `translateX(-50%) translateY(${calloutRise}px)`
                    : `translateY(calc(-50% + ${calloutRise}px))`,
                  width: 440,
                  display: "flex", flexDirection: "column", gap: 14,
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 24px 80px rgba(8,16,40,0.08)",
                  padding: "24px 28px",
                }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: ds.fit, color: "#FFF", fontSize: 13, fontFamily: fonts.mono, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{b7Active.n}</div>
                    <span style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fit, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>T · Target</span>
                  </div>
                  <div style={{ fontSize: 44, fontWeight: 800, color: ds.fgPrimary, fontFamily: fonts.display, letterSpacing: "-1.5px", lineHeight: 1.1 }}>{b7Active.title}</div>
                  <div style={{ fontSize: 20, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.5, letterSpacing: "-0.2px" }}>{b7Active.desc}</div>
                </div>
              )}
            </AbsoluteFill>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


export const S3_DIT: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* ── Global SFX ── */}
      {/* B0: DIT step cards appearing */}
      {[110, 125, 140].map((f) => (
        <Sequence key={`b0card-${f}`} from={f} layout="none">
          <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/MAGShim_Magic Generic Building Block, Aura, Glyph, Activation, Shimmer, Metal Ring, Short, Medium 03_ASD.wav")} volume={0.22} />
        </Sequence>
      ))}
      {/* B4: SJT card entrances (Q1 at B4+0=1752, Q2 at B4+280=2032) */}
      {[1752, 2032].map((f) => (
        <Sequence key={`sjt-${f}`} from={f} layout="none">
          <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/WHSH_Magic Air Whoosh, Twirl, Wind Gust, Tremolo 03_ASD.wav")} volume={0.22} />
        </Sequence>
      ))}
      {/* B4: SJT answer clicks (Q1 click at B4+200=1952, Q2 click at B4+420=2172) */}
      {[1952, 2172].map((f) => (
        <Sequence key={`click-${f}`} from={f} layout="none">
          <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/COMCell_Tech Button Switch Lock Iphone x5 Variations_ASD.wav")} volume={0.25} />
        </Sequence>
      ))}
      {/* B4: processing ambient — loading bar at B4+500=global 2252 */}
      <Sequence from={2252} durationInFrames={110} layout="none">
        <Audio src={staticFile("Articulated--Starter_Pack_v2.0/Articulated--Starter_Pack--Sounds/DSGNEthr_GHOSTS Breath Pulsating_ASD.wav")} volume={(f) => interpolate(f, [0, 20, 90, 110], [0, 0.18, 0.18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      </Sequence>
      {/* S3 total: 4018f. B2Define extended back to 1164f to give ample time for the final confirm step. All subsequent sequences shifted by +150f. */}
      <Sequence from={0}    durationInFrames={300}  layout="none"><B0Overview /></Sequence>
      <Sequence from={276}  durationInFrames={1164} layout="none"><B2Define /></Sequence>
      <Sequence from={1416} durationInFrames={360}  layout="none"><B3Bridge /></Sequence>
      <Sequence from={1752} durationInFrames={610}  layout="none"><B4Interact /></Sequence>
      <Sequence from={2338} durationInFrames={214}  layout="none"><B5Capture /></Sequence>
      <Sequence from={2528} durationInFrames={360}  layout="none"><B6Bridge /></Sequence>
      <Sequence from={2864} durationInFrames={1154} layout="none"><B7Tailor /></Sequence>
    </AbsoluteFill>
  );
};
