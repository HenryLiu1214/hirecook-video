import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 18, color: "#0B1020", fontWeight: 600, fontFamily: fonts.display }}>{label}</span>
        <span style={{ fontSize: 16, color, fontWeight: 700, fontFamily: fonts.mono }}>{Math.round(w)}</span>
      </div>
      <div style={{ height: 8, background: "rgba(8,16,40,0.06)", borderRadius: 9999, position: "relative" }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 9999 }} />
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
  const m = momentAnim(frame, 0, 8, 588, 600);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // ── Phase 0 (0–90f): HOW HIRECOOK WORKS title card ───────────────────────
  const p0Op = interpolate(frame, [0, 14, 70, 90], [0, 1, 1, 0], cl);

  // ── Phase 1 (80–230f): D · 企業端 ────────────────────────────────────────
  const p1Op     = interpolate(frame, [80, 100, 212, 230], [0, 1, 1, 0], cl);
  const p1EyeOp  = interpolate(frame, [82, 100], [0, 1], cl);
  const p1TitleOp = interpolate(frame, [94, 114], [0, 1], cl);
  const p1TitleY  = interpolate(frame, [94, 118], [32, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p1SubOp   = interpolate(frame, [114, 132], [0, 1], cl);
  const p1SubY    = interpolate(frame, [114, 136], [24, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p1DivW    = interpolate(frame, [134, 164], [0, 260], { easing: Easing.out(Easing.cubic), ...cl });
  const p1DivOp   = interpolate(frame, [134, 150], [0, 1], cl);
  const p1OutOp   = interpolate(frame, [148, 166], [0, 1], cl);
  const p1OutY    = interpolate(frame, [148, 170], [20, 0], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Phase 2 (220–370f): I · 求職者 ───────────────────────────────────────
  const p2Op     = interpolate(frame, [220, 240, 352, 370], [0, 1, 1, 0], cl);
  const p2EyeOp  = interpolate(frame, [222, 240], [0, 1], cl);
  const p2TitleOp = interpolate(frame, [234, 254], [0, 1], cl);
  const p2TitleY  = interpolate(frame, [234, 258], [32, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p2SubOp   = interpolate(frame, [254, 272], [0, 1], cl);
  const p2SubY    = interpolate(frame, [254, 276], [24, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p2DivW    = interpolate(frame, [274, 304], [0, 260], { easing: Easing.out(Easing.cubic), ...cl });
  const p2DivOp   = interpolate(frame, [274, 290], [0, 1], cl);
  const p2OutOp   = interpolate(frame, [288, 306], [0, 1], cl);
  const p2OutY    = interpolate(frame, [288, 310], [20, 0], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Phase 3 (360–510f): T · 決策者 ───────────────────────────────────────
  const p3Op     = interpolate(frame, [360, 380, 492, 510], [0, 1, 1, 0], cl);
  const p3EyeOp  = interpolate(frame, [362, 380], [0, 1], cl);
  const p3TitleOp = interpolate(frame, [374, 394], [0, 1], cl);
  const p3TitleY  = interpolate(frame, [374, 398], [32, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p3SubOp   = interpolate(frame, [394, 412], [0, 1], cl);
  const p3SubY    = interpolate(frame, [394, 416], [24, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const p3DivW    = interpolate(frame, [414, 444], [0, 260], { easing: Easing.out(Easing.cubic), ...cl });
  const p3DivOp   = interpolate(frame, [414, 430], [0, 1], cl);
  const p3OutOp   = interpolate(frame, [428, 446], [0, 1], cl);
  const p3OutY    = interpolate(frame, [428, 450], [20, 0], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Phase 4 (500–600f): D · I · T cue ────────────────────────────────────
  const p4Op     = interpolate(frame, [500, 518, 582, 600], [0, 1, 1, 0], cl);
  const p4LetOp  = interpolate(frame, [502, 522], [0, 1], cl);
  const p4CueOp  = interpolate(frame, [520, 540], [0, 1], cl);
  const p4CueY   = interpolate(frame, [520, 542], [20, 0], { easing: Easing.out(Easing.cubic), ...cl });

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
            三個角色<br /><span style={{ color: ds.cyan }}>一份決策手冊</span>
          </div>
        </AbsoluteFill>

        {/* ── Phase 1: D 企業端 ── */}
        <AbsoluteFill style={{ opacity: p1Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", fontSize: 520, fontWeight: 900, fontFamily: fonts.mono, color: ds.blue, opacity: 0.05, lineHeight: 1, letterSpacing: "-28px", userSelect: "none" as const }}>D</div>
          <div style={{ opacity: p1EyeOp, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(33,81,245,0.38)", background: "rgba(33,81,245,0.08)", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.blue, boxShadow: `0 0 8px ${ds.blue}` }} />
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#6A8FFF", letterSpacing: "0.20em" }}>STEP 01 · D · DEFINE · 企業端</span>
          </div>
          <div style={{ opacity: p1TitleOp, transform: `translateY(${p1TitleY}px)`, fontSize: 96, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-4px", lineHeight: 1.05, textAlign: "center" as const }}>
            設定職位壓力場
          </div>
          <div style={{ opacity: p1SubOp, transform: `translateY(${p1SubY}px)`, marginTop: 22, fontSize: 28, color: "rgba(255,255,255,0.48)", fontFamily: fonts.display, textAlign: "center" as const, letterSpacing: "-0.3px" }}>
            協作密度、決策節奏、壓力情境等六個維度
          </div>
          <div style={{ opacity: p1DivOp, width: p1DivW, height: 2, background: `linear-gradient(90deg, ${ds.blue}, ${ds.cyan})`, borderRadius: 1, margin: "28px 0" }} />
          <div style={{ opacity: p1OutOp, transform: `translateY(${p1OutY}px)`, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: "rgba(33,81,245,0.60)", letterSpacing: "0.18em" }}>OUTPUT</span>
            <span style={{ fontSize: 32, fontFamily: fonts.mono, fontWeight: 700, color: ds.blue }}>環境指紋 E</span>
          </div>
        </AbsoluteFill>

        {/* ── Phase 2: I 求職者 ── */}
        <AbsoluteFill style={{ opacity: p2Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", fontSize: 520, fontWeight: 900, fontFamily: fonts.mono, color: "#5B8AFF", opacity: 0.05, lineHeight: 1, letterSpacing: "-28px", userSelect: "none" as const }}>I</div>
          <div style={{ opacity: p2EyeOp, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(91,138,255,0.38)", background: "rgba(91,138,255,0.08)", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B8AFF", boxShadow: "0 0 8px #5B8AFF" }} />
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#8AADFF", letterSpacing: "0.20em" }}>STEP 02 · I · INTERACT · 求職者</span>
          </div>
          <div style={{ opacity: p2TitleOp, transform: `translateY(${p2TitleY}px)`, fontSize: 96, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-4px", lineHeight: 1.05, textAlign: "center" as const }}>
            SJT 情境行為測驗
          </div>
          <div style={{ opacity: p2SubOp, transform: `translateY(${p2SubY}px)`, marginTop: 22, fontSize: 28, color: "rgba(255,255,255,0.48)", fontFamily: fonts.display, textAlign: "center" as const, letterSpacing: "-0.3px" }}>
            從真實廚房情境中推論決策模式
          </div>
          <div style={{ opacity: p2DivOp, width: p2DivW, height: 2, background: "linear-gradient(90deg, #5B8AFF, #6FE3F5)", borderRadius: 1, margin: "28px 0" }} />
          <div style={{ opacity: p2OutOp, transform: `translateY(${p2OutY}px)`, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: "rgba(91,138,255,0.60)", letterSpacing: "0.18em" }}>OUTPUT</span>
            <span style={{ fontSize: 32, fontFamily: fonts.mono, fontWeight: 700, color: "#5B8AFF" }}>行為指紋 P</span>
          </div>
        </AbsoluteFill>

        {/* ── Phase 3: T 決策者 ── */}
        <AbsoluteFill style={{ opacity: p3Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", fontSize: 520, fontWeight: 900, fontFamily: fonts.mono, color: ds.fit, opacity: 0.05, lineHeight: 1, letterSpacing: "-28px", userSelect: "none" as const }}>T</div>
          <div style={{ opacity: p3EyeOp, display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(27,122,77,0.38)", background: "rgba(27,122,77,0.08)", marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.fit, boxShadow: `0 0 8px ${ds.fit}` }} />
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#5FC48C", letterSpacing: "0.20em" }}>STEP 03 · T · TARGET · 決策者</span>
          </div>
          <div style={{ opacity: p3TitleOp, transform: `translateY(${p3TitleY}px)`, fontSize: 96, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-4px", lineHeight: 1.05, textAlign: "center" as const }}>
            P × E 交叉分析
          </div>
          <div style={{ opacity: p3SubOp, transform: `translateY(${p3SubY}px)`, marginTop: 22, fontSize: 28, color: "rgba(255,255,255,0.48)", fontFamily: fonts.display, textAlign: "center" as const, letterSpacing: "-0.3px" }}>
            AI 模型比對行為指紋與環境模型
          </div>
          <div style={{ opacity: p3DivOp, width: p3DivW, height: 2, background: `linear-gradient(90deg, ${ds.fit}, ${ds.cyan})`, borderRadius: 1, margin: "28px 0" }} />
          <div style={{ opacity: p3OutOp, transform: `translateY(${p3OutY}px)`, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: "rgba(27,122,77,0.60)", letterSpacing: "0.18em" }}>OUTPUT</span>
            <span style={{ fontSize: 32, fontFamily: fonts.mono, fontWeight: 700, color: ds.fit }}>TAT 管理手冊</span>
          </div>
        </AbsoluteFill>

        {/* ── Phase 4: D · I · T cue ── */}
        <AbsoluteFill style={{ opacity: p4Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <div style={{ opacity: p4LetOp, display: "flex", alignItems: "center", gap: 24 }}>
            {([
              { letter: "D", color: ds.blue },
              { letter: "·", color: "rgba(255,255,255,0.22)" },
              { letter: "I", color: "#5B8AFF" },
              { letter: "·", color: "rgba(255,255,255,0.22)" },
              { letter: "T", color: ds.fit },
            ] as { letter: string; color: string }[]).map((item, idx) => (
              <span key={idx} style={{ fontSize: 88, fontFamily: fonts.mono, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.letter}</span>
            ))}
          </div>
          <div style={{ opacity: p4CueOp, transform: `translateY(${p4CueY}px)`, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 ${4 + 5 * (0.5 + 0.5 * Math.sin(frame * 0.18))}px ${ds.cyan}` }} />
            <span style={{ fontSize: 28, fontFamily: fonts.display, color: "rgba(255,255,255,0.62)", letterSpacing: "-0.3px" }}>接下來，逐一示範這三步</span>
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
}> = ({ liveEnvVals, hexProg, pressureScore, sliderProgress, lB }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 480, flexShrink: 0 }}>
      {/* Radar card */}
      <div style={{
        background: "#FFFFFF", borderRadius: 12, padding: "20px 24px",
        border: "1px solid rgba(8,16,40,0.06)", boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 6px ${ds.cyan}`, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>即時預覽 · 環境指紋</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <HexRadar size={220} values={liveEnvVals} labels={envLabels} color={ds.blue} fillColor="rgba(33,81,245,0.14)" prog={hexProg} />
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
        border: "1px solid rgba(8,16,40,0.06)", boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
        display: "flex", flexDirection: "column", gap: 10,
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
  const m = momentAnim(frame, 0, 8, 1244, 1260);

  // ── Timeline: brief big-text intro, then the COMPLETE interface operates while
  //    a "camera" zooms into each region to explain, then returns it to place. ──
  const introOp = interpolate(frame, [0, 18, 120, 150], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardOp  = interpolate(frame, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase boundaries (whole-interface steps) — left panel crossfades, no flash
  const PB = 560, PC = 980;
  const phaseA = frame < PB;
  const phaseB = frame >= PB && frame < PC;
  const phaseC = frame >= PC;
  const lA = Math.max(0, frame - 140);
  const lB = Math.max(0, frame - PB);
  const lC = Math.max(0, frame - PC);
  const appBarStep: 0 | 1 | 2 = phaseA ? 0 : phaseB ? 1 : 2;

  // Crossfaded left-panel opacities (overlap ~16f at each boundary → smooth swap)
  const aOp = interpolate(frame, [128, 150, PB, PB + 16], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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
  type Stop = { k: number[]; ox: number; oy: number; z: number; panel: "left" | "right" | "none"; n: string; title: string; desc: string };
  const stops: Stop[] = [
    { k: [210, 250, 330, 370], ox: 30, oy: 35, z: 1.0, panel: "left",  n: "①", title: "描述職位的真實樣貌", desc: "不是理想，是這個位置實際的運作方式。" },
    { k: [600, 640, 722, 760],   ox: 30, oy: 54, z: 1.28, panel: "left",  n: "②", title: "六個維度，拉出壓力場", desc: "每個軸向對應一種真實的工作張力。" },
    { k: [784, 822, 894, 930],   ox: 80, oy: 40, z: 1.32, panel: "right", n: "③", title: "環境指紋即時生成", desc: "六維壓力分數，量化成一張雷達。" },
    { k: [952, 988, 1062, 1096], ox: 80, oy: 70, z: 1.32, panel: "right", n: "④", title: "16 型人格即時適配", desc: "每動一格，預測適配同步重算。" },
    { k: [1094, 1130, 1222, 1256], ox: 46, oy: 62, z: 1.22, panel: "none",  n: "⑤", title: "確認後，一鍵建模", desc: "生成環境指紋與適配分佈。" },
  ];
  const active = stops.find((s) => frame >= s.k[0] && frame < s.k[3]);
  // Continuous camera path — ②③④⑤ flow directly, no return to 1.0 between stops
  // Gap ②→③: 760-784 (24f pan left→right)  Gap ③→④: 930-952 (22f shift down)  Gap ④→⑤: 1096-1130 (34f sweep right→center)
  const camZoom = interpolate(frame,
    [600,  640,  722,  760,  784,  822,  894,  930,  952,  988, 1062, 1096, 1130, 1222, 1256],
    [  1, 1.28, 1.28, 1.28, 1.32, 1.32, 1.32, 1.32, 1.32, 1.32, 1.32, 1.22, 1.22, 1.22,    1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOx = interpolate(frame,
    [600,  640,  722,  760,  784,  822,  894,  930,  952,  988, 1062, 1096, 1130, 1222, 1256],
    [ 50,   30,   30,   30,   80,   80,   80,   80,   80,   80,   80,   46,   46,   46,   50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const camOy = interpolate(frame,
    [600,  640,  722,  760,  784,  822,  894,  930,  952,  988, 1062, 1096, 1130, 1222, 1256],
    [ 50,   54,   54,   54,   40,   40,   40,   40,   70,   70,   70,   62,   62,   62,   50],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Panel dim/glow (only while meaningfully zoomed)
  const zoomT = Math.max(0, Math.min(1, (camZoom - 1) / 0.4));
  const leftDim  = active?.panel === "right" ? 1 - 0.62 * zoomT : 1;
  const rightDim = active?.panel === "left"  ? 1 - 0.62 * zoomT : 1;
  const leftGlow  = active?.panel === "left"  && zoomT > 0.4;
  const rightGlow = active?.panel === "right" && zoomT > 0.4;
  const ring = (on: boolean) => on ? "0 0 0 2.5px rgba(0,180,216,0.55), 0 0 40px rgba(0,180,216,0.22)" : "none";

  // Big floating explanation — appears on the side opposite the spotlighted panel
  const calloutOp = active ? interpolate(frame, [active.k[0] + 6, active.k[0] + 28, active.k[2] - 8, active.k[2] + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const calloutRise = active ? interpolate(frame, [active.k[0] + 6, active.k[0] + 30], [26, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const calloutSide: "left" | "right" = active?.panel === "left" ? "right" : "left";

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="blue" />

      {/* ── Big-text intro (crossfades into the interface) ── */}
      {frame < 155 && (
        <AbsoluteFill style={{ opacity: introOp * m.opacity, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", fontSize: 600, fontWeight: 900, fontFamily: fonts.mono, color: ds.blue, opacity: 0.06, lineHeight: 1, letterSpacing: "-26px", userSelect: "none" as const }}>D</div>
          <div style={{ marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 16px", borderRadius: 999, border: `1px solid ${ds.blue}30`, background: `${ds.blue}0D` }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: ds.blue }} />
            <span style={{ fontSize: 14, fontFamily: fonts.mono, color: ds.blue, letterSpacing: "0.20em" }}>STEP 01 · DEFINE</span>
          </div>
          <div style={{ transform: `translateY(${interpolate(frame, [0, 24], [40, 0], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`, fontSize: 150, fontWeight: 800, color: ds.fgPrimary, fontFamily: fonts.display, letterSpacing: "-5px", lineHeight: 1 }}>定義環境</div>
          <div style={{ opacity: interpolate(frame, [24, 42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), marginTop: 18, fontSize: 30, color: ds.fgSecondary, fontFamily: fonts.display }}>企業端，把職位的真實壓力場量化出來</div>
        </AbsoluteFill>
      )}

      {/* ── Floating explanation text (dynamic, not a fixed header) ── */}
      {active && calloutOp > 0.01 && (
        <div style={{
          position: "absolute", zIndex: 9, top: 286, width: 560, padding: "26px 30px",
          ...(calloutSide === "left" ? { left: 56 } : { right: 56 }),
          opacity: calloutOp * m.opacity, transform: `translateY(${calloutRise}px)`,
          textAlign: calloutSide === "left" ? "right" as const : "left" as const,
          // Soft borderless scrim so text stays legible over the dimmed interface
          background: calloutSide === "left"
            ? "radial-gradient(ellipse 120% 90% at 80% 50%, rgba(247,248,251,0.96) 0%, rgba(247,248,251,0.82) 45%, rgba(247,248,251,0) 80%)"
            : "radial-gradient(ellipse 120% 90% at 20% 50%, rgba(247,248,251,0.96) 0%, rgba(247,248,251,0.82) 45%, rgba(247,248,251,0) 80%)",
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
          const entryTiltX = interpolate(frame, [120, 175], [16, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const baseY = interpolate(frame, [120, 175], [80, 28], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          // Suppress float during camera zoom to prevent jitter on zoom-out return
          const floatAmp = interpolate(camZoom, [1.02, 1.1], [3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const floatOsc = frame > 180 ? Math.sin(frame * 0.04) * floatAmp : 0;
          return (
            // Camera wrapper — scales about the focused region's origin, then returns
            <div style={{ transformOrigin: `${camOx}% ${camOy}%`, transform: `scale(${camZoom})` }}>
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
                  {/* Right slot — persistent radar + 16-type grid, dim + glow per focus */}
                  <div style={{ flexShrink: 0, display: "flex", borderRadius: 12, opacity: rightDim, boxShadow: ring(rightGlow) }}>
                    <B2RightPanel liveEnvVals={liveEnvVals} hexProg={hexProg} pressureScore={pressureScore} sliderProgress={sliderProgress} lB={panelLB} />
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
  const m = momentAnim(frame, 0, 8, 136, 150);

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      {/* Ping dot: absolute, centered horizontally, just above vertical center */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -130px)",
        opacity: m.opacity,
      }}>
        <PingDot frame={frame} color="#00B4D8" />
      </div>
      {/* Text centered in AbsoluteFill */}
      <AbsoluteFill style={{
        opacity: m.opacity,
        transform: `rotate(${rotZIn(frame, 10, 28, -6)}deg) skewX(${skewSettle(frame, 10, 24)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypewriterText
          text="有了環境，下一步——"
          startFrame={14}
          charStagger={4}
          fontSize={120}
          fontWeight={700}
          colorScheme="white-to-cyan"
        />
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
  floatOffset: number;
  focusKey?: string;        // "scenario" | "options" | "selected" | "none"
  hoverLetter?: string | null;
}> = ({ questionNum, tag, scenario, prompt, options, selectedLetter, revealStart, clickFrame, localFrame, progressPct, totalQ, floatOffset, focusKey = "none", hoverLetter = null }) => {
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const cardOp = interpolate(localFrame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardSc = interpolate(localFrame, [0, 16], [0.93, 1], {
    easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Gaze-guiding: dim the regions that aren't the current focus, glow the one that is
  const scenarioDim = focusKey === "options" || focusKey === "selected" ? 0.32 : 1;
  const scenarioGlow = focusKey === "scenario";

  return (
    <div style={{
      opacity: cardOp,
      transform: `translateY(${floatOffset}px) scale(${cardSc})`,
      width: 1100, borderRadius: 12, overflow: "hidden" as const,
      boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
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
            <div style={{ height: "100%", width: `${progressPct}%`, background: ds.blue, borderRadius: 9999 }} />
          </div>
          <div style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.10)", fontSize: 12, fontFamily: fonts.mono, color: ds.fgFaint }}>儲存並離開</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "#1A2030", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Scenario block — glows when focused, dims when attention moves to options */}
        <div style={{
          opacity: scenarioDim, transition: "none",
          borderRadius: 10,
          padding: scenarioGlow ? "14px 16px" : 0,
          margin: scenarioGlow ? "-14px -16px" : 0,
          background: scenarioGlow ? "rgba(0,180,216,0.06)" : "transparent",
          boxShadow: scenarioGlow ? "0 0 0 1.5px rgba(0,180,216,0.45), 0 0 24px rgba(0,180,216,0.18)" : "none",
          display: "flex", flexDirection: "column" as const, gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>{tag}</span>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: ds.cyan }} />
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted }}>沒有明顯正確答案 · 選你真實會做的</span>
          </div>
          <div style={{ fontSize: 26, color: colors.softWhite, lineHeight: 1.6, fontFamily: fonts.display }}>{scenario}</div>
          <div style={{ fontSize: 22, color: colors.dimWhite, fontFamily: fonts.display }}>{prompt}</div>
        </div>

        {options.map((opt, i) => {
          const revF = revealStart + i * 14;
          const optOp = interpolate(localFrame, [revF, revF + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const selected = opt.letter === selectedLetter;
          const hovered = !selected && opt.letter === hoverLetter;
          const pop = selected
            ? interpolate(localFrame, [clickFrame, clickFrame + 4, clickFrame + 12], [1, 1.024, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 1;
          const tickSc = selected
            ? interpolate(localFrame, [clickFrame, clickFrame + 10], [0, 1], { easing: Easing.out(Easing.back(1.6)), extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            : 0;
          const rippleSc = selected ? interpolate(localFrame, [clickFrame, clickFrame + 48], [0, 4.2], { easing: Easing.out(Easing.cubic), ...cl }) : 0;
          const rippleOp = selected ? interpolate(localFrame, [clickFrame, clickFrame + 16, clickFrame + 48], [0.45, 0.22, 0], cl) : 0;
          // When a selection is locked in (focusKey "selected"), dim the non-chosen options
          const dimUnchosen = focusKey === "selected" && !selected ? 0.34 : 1;
          return (
            <div key={opt.letter} style={{
              opacity: optOp * dimUnchosen, transform: `scale(${pop})`,
              display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderRadius: 10,
              background: selected ? "rgba(33,81,245,0.18)" : hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${selected ? "#2151F5AA" : hovered ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
              boxShadow: selected ? "0 0 0 3px rgba(33,81,245,0.10)" : hovered ? "0 0 0 1px rgba(255,255,255,0.07)" : "none",
              position: "relative" as const, overflow: "hidden" as const,
            }}>
              {selected && (
                <div style={{
                  position: "absolute", left: "50%", top: "50%",
                  width: 80, height: 80, borderRadius: "50%",
                  background: "rgba(33,81,245,0.40)",
                  transform: `translate(-50%, -50%) scale(${rippleSc})`,
                  opacity: rippleOp, pointerEvents: "none",
                }} />
              )}
              <div style={{ width: 34, height: 34, borderRadius: 8, background: selected ? ds.blue : "rgba(255,255,255,0.06)", border: `1.5px solid ${selected ? ds.blue : "rgba(255,255,255,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                <span style={{ fontSize: 15, fontFamily: fonts.mono, fontWeight: 700, color: "#FFF" }}>{opt.letter}</span>
              </div>
              <span style={{ fontSize: 22, color: selected ? colors.softWhite : colors.dimWhite, fontFamily: fonts.display, flex: 1, zIndex: 1 }}>{opt.text}</span>
              {selected && (
                <span style={{ fontSize: 20, color: ds.cyan, fontWeight: 700, transform: `scale(${tickSc})`, display: "inline-block", zIndex: 1 }}>✓</span>
              )}
            </div>
          );
        })}

        {/* Capture sweep bar */}
        {selectedLetter !== null && (
          <div style={{
            height: 2, borderRadius: 1, background: `linear-gradient(90deg,${ds.blue},${ds.cyan})`,
            width: `${interpolate(localFrame, [clickFrame + 2, clickFrame + 70], [0, 100], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
          }} />
        )}
      </div>
    </div>
  );
};

const B4Interact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 8, 1282, 1294);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // ── 120f candidate-perspective opener before Q1 ───────────────────────────
  const O = 180; // offset applied to all Q-phase frame thresholds
  const openerPhase = frame < O;

  // Opener: 3 sequential cinematic title cards
  const s1Op = interpolate(frame, [0, 12, 72, 90], [0, 1, 1, 0], cl);      // 求職者視角
  const s2Op = interpolate(frame, [88, 104, 136, 154], [0, 1, 1, 0], cl);  // 他收到一份邀請
  const s3Op = interpolate(frame, [152, 168, 174, 180], [0, 1, 1, 0], cl); // 不知道背後在測什麼
  const wmOp = interpolate(frame, [0, 20, 162, 180], [0, 1, 1, 0], cl);    // watermark opacity

  // ── Q-phase flags (all shifted by O) ─────────────────────────────────────
  const qFrame      = Math.max(0, frame - O);   // local frame within Q phases
  const showQ1      = frame >= O && frame < O + 550;
  const showQ2      = frame >= O + 490 && frame < O + 750;
  const showLoading = frame >= O + 710 && frame < O + 910;
  const showScore   = frame >= O + 910;

  // Q1: click A at qFrame 400
  const q1LocalFrame = qFrame;
  const q1selected   = qFrame >= 400 ? "A" : null;

  // Q2: click B at q2LocalFrame 160
  const q2LocalFrame = Math.max(0, qFrame - 520);
  const q2selected   = qFrame >= 680 ? "B" : null;

  // Loading bar
  const loadProg = interpolate(frame, [O + 740, O + 900], [0, 100], {
    easing: Easing.out(Easing.cubic), ...cl,
  });

  // Score card
  const scoreSc = interpolate(frame, [O + 910, O + 928], [0.82, 1], {
    easing: Easing.out(Easing.back(1.25)), ...cl,
  });
  const scoreOp = interpolate(frame, [O + 910, O + 924], [0, 1], cl);
  const scoreVal = interpolate(frame, [O + 930, O + 1010], [0, 88.5], {
    easing: Easing.out(Easing.cubic), ...cl,
  });

  // ── Region focus controller (gaze guiding within the SJT card) ──
  const focusStage = (() => {
    if (qFrame < 520) {
      if (qFrame < 70)  return { key: "none",     title: "", desc: "" };
      if (qFrame < 240) return { key: "scenario", title: "① 真實情境", desc: "把人放進一個沒有標準答案的高壓現場。" };
      if (qFrame < 400) return { key: "options",  title: "② 四個選項", desc: "每個選項對應不同的決策風格與壓力反應。" };
      return                   { key: "selected", title: "③ 真實選擇", desc: "選的不是對錯，是這個人實際會怎麼做。" };
    }
    if (qFrame < 730) return { key: "options", title: "再來一題", desc: "換一個情境，交叉驗證行為的穩定度。" };
    return { key: "none", title: "", desc: "" };
  })();

  const floatA = floatY(t, 0.68, 8, 0.4);

  // ── Transitions ──
  const q1ExitX  = interpolate(frame, [O + 496, O + 530], [0, -64], { easing: Easing.in(Easing.cubic), ...cl });
  const q1ExitOp = interpolate(frame, [O + 490, O + 530], [1, 0], cl);
  const q1ExitSc = interpolate(frame, [O + 496, O + 530], [1, 0.90], { easing: Easing.in(Easing.quad), ...cl });
  
  const q2EnterX = interpolate(frame, [O + 510, O + 550], [64, 0], { easing: Easing.out(Easing.cubic), ...cl });
  const q2EnterOp = interpolate(frame, [O + 510, O + 540], [0, 1], cl);
  const q2EnterSc = interpolate(frame, [O + 510, O + 550], [0.90, 1], { easing: Easing.out(Easing.cubic), ...cl });

  const q2ExitX  = interpolate(frame, [O + 710, O + 740], [0, -64], { easing: Easing.in(Easing.cubic), ...cl });
  const q2ExitOp = interpolate(frame, [O + 710, O + 740], [1, 0], cl);
  const q2ExitSc = interpolate(frame, [O + 710, O + 740], [1, 0.90], { easing: Easing.in(Easing.quad), ...cl });

  // Hover pre-click: candidate's cursor lingers before clicking
  const q1HoverLetter = q1LocalFrame >= 340 && q1LocalFrame < 400 ? "A" : null;
  const q2HoverLetter = q2LocalFrame >= 110 && q2LocalFrame < 160 ? "B" : null;

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />

      {/* ── Opener: 3 cinematic title cards (0–180f) ── */}
      {openerPhase && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Persistent "I" watermark */}
          <div style={{ position: "absolute", fontSize: 560, fontWeight: 900, fontFamily: fonts.mono, color: ds.blue, opacity: wmOp * 0.05, lineHeight: 1, letterSpacing: "-24px", userSelect: "none" as const }}>I</div>

          {/* Stage 1 — 求職者視角 */}
          <AbsoluteFill style={{ opacity: s1Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(0,180,216,0.35)", background: "rgba(0,180,216,0.07)", marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 ${4 + 5 * (0.5 + 0.5 * Math.sin(frame * 0.18))}px ${ds.cyan}` }} />
              <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#6FE3F5", letterSpacing: "0.20em" }}>STEP 02 · INTERACT</span>
            </div>
            <div style={{ fontSize: 164, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-7px", lineHeight: 1 }}>求職者視角</div>
          </AbsoluteFill>

          {/* Stage 2 — 他收到一份邀請 */}
          <AbsoluteFill style={{ opacity: s2Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ fontSize: 24, fontFamily: fonts.mono, color: "rgba(255,255,255,0.38)", letterSpacing: "0.14em" }}>他收到了——</div>
            <div style={{ fontSize: 132, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-5px", lineHeight: 1 }}>一份邀請</div>
          </AbsoluteFill>

          {/* Stage 3 — 不知道背後在測什麼 */}
          <AbsoluteFill style={{ opacity: s3Op, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 108, fontWeight: 800, color: "rgba(255,255,255,0.68)", fontFamily: fonts.display, letterSpacing: "-4px", lineHeight: 1.1 }}>不知道</div>
              <div style={{ fontSize: 108, fontWeight: 800, color: ds.cyan, fontFamily: fonts.display, letterSpacing: "-4px", lineHeight: 1.1 }}>背後在測什麼</div>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}


      <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>
        {/* Q1 + Q2 */}
        {(showQ1 || showQ2) && (
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {showQ1 && (
              <div style={{ transform: `translateX(${q1ExitX}px) scale(${q1ExitSc})`, opacity: q1ExitOp }}>
              <SJTCard
                questionNum="07" totalQ="15" tag="情境 07 · 廚房 · 截止日碰撞"
                scenario="你負責備餐，傳菜員已在出餐口等待。配菜那端的隊友突然發現食材不夠，開始重備，但沒有開口說。廚師長正在計時，三分鐘後這桌就超時了。"
                prompt="你第一個動作是——"
                options={[
                  { letter: "A", text: "直接接手配菜工作，自己同時備兩個位置。" },
                  { letter: "B", text: "大聲告訴隊友食材不夠，請他去通知廚師長。" },
                  { letter: "C", text: "先出一個可以先上的菜穩住桌況，配菜再想辦法。" },
                  { letter: "D", text: "向廚師長報告有問題，請他決定怎麼調度。" },
                ]}
                selectedLetter={q1selected}
                revealStart={70}
                clickFrame={400}
                localFrame={q1LocalFrame}
                progressPct={46}
                floatOffset={floatA}
                focusKey={focusStage.key}
                hoverLetter={q1HoverLetter}
              />
              </div>
            )}
            {showQ2 && (
              <div style={{ transform: `translateX(${q2EnterX + q2ExitX}) scale(${q2EnterSc * q2ExitSc})`, opacity: q2EnterOp * q2ExitOp }}>
              <SJTCard
                questionNum="08" totalQ="15" tag="情境 08 · 遠端會議 · 技術分歧"
                scenario="你在跨時區的視訊設計評審中，提出的架構方案遭到資深工程師當場否決，理由簡短且缺乏解釋。其他人保持沉默，主持人正準備繼續下一議題。"
                prompt="你會——"
                options={[
                  { letter: "A", text: "接受否決，先記下來會後私下溝通。" },
                  { letter: "B", text: "當下禮貌請對方說明具體技術顧慮。" },
                  { letter: "C", text: "提議先暫停議程，開個小組釐清分歧。" },
                  { letter: "D", text: "調整方案，提出折衷版本讓討論繼續。" },
                ]}
                selectedLetter={q2selected}
                revealStart={10}
                clickFrame={160}
                localFrame={q2LocalFrame}
                progressPct={53}
                floatOffset={floatY(t, 0.74, 8, 0.5)}
                focusKey={focusStage.key}
                hoverLetter={q2HoverLetter}
              />
              </div>
            )}
          </AbsoluteFill>
        )}

        {/* Loading — large sequential trait reveal */}
        {showLoading && (() => {
          const loadOp = interpolate(frame, [O + 640, O + 660], [0, 1], cl);
          const traits = ["壓力反應模式", "協作決策傾向", "模糊容忍度", "衝突處理策略"];
          const traitCycle = 38; // frames per trait
          const traitProgress = (frame - (O + 670)) / traitCycle;
          const traitIdx = Math.max(0, Math.min(traits.length - 1, Math.floor(traitProgress)));
          const traitLocalF = (frame - (O + 670)) - traitIdx * traitCycle;
          const traitOp = interpolate(traitLocalF, [0, 10, 28, 38], [0, 1, 1, 0], cl);
          return (
            <AbsoluteFill style={{ opacity: loadOp, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
              <TypewriterText text="分析行為指紋中…" startFrame={O + 640} charStagger={3} fontSize={64} fontWeight={700} colorScheme="white-to-cyan" />
              <div style={{ width: 560, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 9999 }}>
                <div style={{ height: "100%", width: `${loadProg}%`, background: `linear-gradient(90deg,${ds.blue},${ds.cyan})`, borderRadius: 9999, transition: "none" }} />
              </div>
              {frame >= O + 670 && traitIdx < traits.length && (
                <div style={{ opacity: traitOp, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 10px ${ds.cyan}` }} />
                  <span style={{ fontSize: 28, fontFamily: fonts.mono, color: "rgba(255,255,255,0.60)", letterSpacing: "0.14em" }}>{traits[traitIdx]}</span>
                </div>
              )}
            </AbsoluteFill>
          );
        })()}

        {/* Score — cinematic full-screen reveal */}
        {showScore && (
          <AbsoluteFill style={{
            opacity: scoreOp, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0,
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(27,122,77,0.20) 0%, transparent 70%)" }} />
            <div style={{ fontSize: 16, fontFamily: fonts.mono, color: "rgba(255,255,255,0.38)", letterSpacing: "0.20em", marginBottom: 28, zIndex: 1 }}>行為指紋分析完成</div>
            <div style={{ transform: `scale(${scoreSc})`, display: "flex", alignItems: "baseline", gap: 14, zIndex: 1 }}>
              <span style={{ fontSize: 210, fontFamily: fonts.mono, fontWeight: 800, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", lineHeight: 0.82 }}>{scoreVal.toFixed(1)}</span>
              <span style={{ fontSize: 56, fontFamily: fonts.mono, color: "rgba(255,255,255,0.28)", alignSelf: "flex-end", marginBottom: 16 }}>/100</span>
            </div>
            <div style={{
              marginTop: 32, zIndex: 1,
              opacity: interpolate(frame, [O + 854, O + 870], [0, 1], cl),
              transform: `scale(${interpolate(frame, [O + 854, O + 870], [0.5, 1], { easing: Easing.out(Easing.back(1.5)), ...cl })})`,
              display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 32px", borderRadius: 999,
              background: "#E6F5EC", border: "1px solid rgba(27,122,77,0.28)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ds.fit, boxShadow: `0 0 10px ${ds.fit}` }} />
              <span style={{ fontSize: 24, fontWeight: 700, color: "#146F3E", fontFamily: fonts.display }}>適配 · P×E FIT</span>
            </div>
            <div style={{ display: "flex", gap: 36, marginTop: 40, zIndex: 1 }}>
              {[
                { label: "壓力反應", score: "92" },
                { label: "協作決策", score: "87" },
                { label: "模糊容忍", score: "84" },
                { label: "衝突處理", score: "79" },
              ].map((item, i) => {
                const subOp = interpolate(frame, [O + 1112 + i * 14, O + 1126 + i * 14], [0, 1], cl);
                return (
                  <div key={item.label} style={{ opacity: subOp, textAlign: "center" as const }}>
                    <div style={{ fontSize: 50, fontFamily: fonts.mono, fontWeight: 700, color: ds.cyan, lineHeight: 1 }}>{item.score}</div>
                    <div style={{ fontSize: 14, fontFamily: fonts.mono, color: "rgba(255,255,255,0.42)", marginTop: 8, letterSpacing: "0.08em" }}>{item.label}</div>
                  </div>
                );
              })}
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B5 — Capture flash
// ────────────────────────────────────────────────────────────────────────────

const B5Capture: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 230, 240);

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
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <AbsoluteFill style={{ opacity: m.opacity, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
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
  const m = momentAnim(frame, 0, 8, 136, 150);

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      {/* Ping dot: absolute, centered just above text */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -115px)",
        opacity: m.opacity,
      }}>
        <PingDot frame={frame} color="#00B4D8" />
      </div>
      <AbsoluteFill style={{
        opacity: m.opacity,
        transform: `rotate(${rotZIn(frame, 10, 28, -6)}deg) skewX(${skewSettle(frame, 10, 24)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypewriterText
          text="接著，給主管一份手冊——"
          startFrame={14}
          charStagger={4}
          fontSize={100}
          fontWeight={700}
          colorScheme="white-to-cyan"
        />
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
  { text: "> 比對行為指紋 BFP-陳威宇-0312…",                      start: 48 },
  { text: "> 計算 P×E 適配矩陣 [6×6]…",                          start: 86 },
  { text: "> 解析 XAI 驅動因子 (決策自主性 +4.2σ)…",              start: 124 },
  { text: "> 匹配歷史留任資料庫 n=14,820…",                       start: 162 },
  { text: "> 生成管理建議 Playbook v4.3…",                        start: 200 },
  { text: "",                                                     start: 238 },  // blank line
  { text: "  適配分數    88.5 / 100",                             start: 250 },
  { text: "  6個月留任率  84%   (↑ +18.6pp vs 基準)",             start: 268 },
  { text: "  錯配成本節省  NT$ 22 萬   預期效益",                  start: 286 },
  { text: "",                                                     start: 304 },
  { text: "  [完成] TAT Playbook 已就緒",                         start: 310 },
];

const TerminalLine: React.FC<{ text: string; startF: number; highlight?: boolean; lf: number }> = ({ text, startF, highlight, lf }) => {
  if (!text) return <div style={{ height: 10 }} />;
  const n = Math.floor(interpolate(lf, [startF, startF + text.length * 1.8], [0, text.length], {
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
          <TerminalLine key={i} text={l.text} startF={l.start} lf={lf} highlight={l.text.includes("完成") || l.text.startsWith("  適配") || l.text.startsWith("  6個月") || l.text.startsWith("  錯配")} />
        ))}
      </div>
    </div>
  );
};

const B7Tailor: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 8, 1872, 1884);
  const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

  // Phase gates
  const showOpener   = frame < 90;
  const showTerminal = frame >= 90 && frame < 450;
  const terminalLF   = Math.max(0, frame - 90);
  const lf = Math.max(0, frame - 450); // playbook local frame

  // ── Opener ──
  const openerOp = interpolate(frame, [0, 12, 76, 90], [0, 1, 1, 0], cl);
  const opBigSc  = interpolate(frame, [10, 32], [0.2, 1], { easing: Easing.out(Easing.back(1.4)), ...cl });
  const opBigOp  = interpolate(frame, [10, 24], [0, 1], cl);
  const opSubOp  = interpolate(frame, [36, 52], [0, 1], cl);
  const opSubY   = interpolate(frame, [36, 54], [18, 0], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Dashboard reveal ──
  const dashOp = interpolate(lf, [0, 28], [0, 1], { easing: Easing.out(Easing.cubic), ...cl });
  const dashY  = interpolate(lf, [0, 32], [28, 0], { easing: Easing.out(Easing.cubic), ...cl });

  // KPI counters
  const fitScore = interpolate(lf, [10, 120], [0, 88.5], { easing: Easing.out(Easing.cubic), ...cl });
  const retPct   = interpolate(lf, [20, 132], [0, 84], { easing: Easing.out(Easing.cubic), ...cl });
  const costVal  = interpolate(lf, [32, 144], [0, 22], { easing: Easing.out(Easing.cubic), ...cl });
  const radarProg = interpolate(lf, [40, 180], [0, 1], { easing: Easing.out(Easing.cubic), ...cl });

  // ── Camera tour stops ──
  type B7Stop = { k: [number,number,number,number]; ox: number; oy: number; z: number; sect: "kpi"|"pemap"|"xai"|"recs"; n: string; title: string; desc: string; calloutPos: "bottom"|"right"|"left"|"top" };
  const b7Stops: B7Stop[] = [
    { k: [200, 228, 430, 458], ox: 50, oy: 15, z: 1.28, sect: "kpi",   n: "①", title: "P×E 預測結果", desc: "結合環境與行為，直接預測留任率與錯配成本。", calloutPos: "bottom" },
    { k: [458, 486, 688, 716], ox: 24, oy: 54, z: 1.34, sect: "pemap", n: "②", title: "雷達疊合分析", desc: "視覺化比對雙方落差，找出隱藏的摩擦風險點。", calloutPos: "right" },
    { k: [716, 744, 946, 974], ox: 76, oy: 54, z: 1.34, sect: "xai",   n: "③", title: "行為驅動因子", desc: "XAI 解釋為什麼適合，給予高信心度的背後原因。", calloutPos: "left" },
    { k: [974, 1002, 1204, 1232], ox: 50, oy: 85, z: 1.28, sect: "recs",  n: "④", title: "專屬管理建議", desc: "直接給主管第一天的具體帶人指南，避免磨合失敗。", calloutPos: "top" },
  ];
  const b7Active = b7Stops.find(s => lf >= s.k[0] && lf < s.k[3]);
  
  // Static camera - discard zoom, keep the whole dashboard visible
  const camZ = 1;
  const camOx = 50;
  const camOy = 50;

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

  return (
    <AbsoluteFill>
      <BgCalm theme={!showOpener && !showTerminal ? "light" : "dark"} tint={!showOpener && !showTerminal ? "blue" : "blue"} />
      <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>

        {/* ── Phase 0: T·TARGET opener ── */}
        {showOpener && (
          <AbsoluteFill style={{ opacity: openerOp, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
            <div style={{ position: "absolute", fontSize: 560, fontWeight: 900, fontFamily: fonts.mono, color: ds.fit, opacity: 0.05, lineHeight: 1, letterSpacing: "-24px", userSelect: "none" as const }}>T</div>
            <div style={{ opacity: interpolate(frame, [6, 18], [0, 1], cl), display: "inline-flex", alignItems: "center", gap: 10, padding: "5px 14px", borderRadius: 999, border: "1px solid rgba(27,122,77,0.40)", background: "rgba(27,122,77,0.08)", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: ds.fit, boxShadow: `0 0 8px ${ds.fit}` }} />
              <span style={{ fontSize: 13, fontFamily: fonts.mono, color: "#5FC48C", letterSpacing: "0.20em" }}>STEP 03 · TARGET</span>
            </div>
            <div style={{ opacity: opBigOp, transform: `scale(${opBigSc})`, fontSize: 140, fontWeight: 800, color: "#FFFFFF", fontFamily: fonts.display, letterSpacing: "-5px", lineHeight: 1 }}>客製手冊</div>
            <div style={{ opacity: opSubOp, transform: `translateY(${opSubY}px)`, marginTop: 20, fontSize: 26, color: "rgba(255,255,255,0.50)", fontFamily: fonts.display, letterSpacing: "-0.3px", textAlign: "center" as const }}>
              把 P×E 分析，轉化成主管能直接用的行動指南
            </div>
          </AbsoluteFill>
        )}

        {/* ── Phase A: terminal ── */}
        {showTerminal && (
          <>
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
          </>
        )}

        {/* ── Phase B: Full HC dashboard + camera tour ── */}
        {!showOpener && !showTerminal && (
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Camera zoom wrapper */}
            <div style={{ transformOrigin: `${camOx}% ${camOy}%`, transform: `scale(${camZ})` }}>
              {/* Dashboard shell */}
              <div style={{
                width: 1680, borderRadius: 16, overflow: "hidden" as const,
                background: "#FFFFFF",
                boxShadow: "0 24px 80px rgba(8,16,40,0.11), 0 1px 0 rgba(8,16,40,0.06)",
                opacity: dashOp, transform: `translateY(${dashY}px)`,
                display: "flex", flexDirection: "column" as const,
              }}>

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
                  <div style={{ flex: 1, padding: "18px 24px", borderRight: "1px solid rgba(8,16,40,0.06)", position: "relative" as const }}>
                    <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: ds.fit, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.08em", marginBottom: 5 }}>P×E 適配分數</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 44, fontFamily: fonts.mono, fontWeight: 800, color: ds.fit, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fitScore.toFixed(1)}</span>
                      <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>/100</span>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, color: "#146F3E", fontFamily: fonts.mono }}>↑ 高出基準組 +18.2 分</div>
                  </div>
                  {/* Retention */}
                  <div style={{ flex: 1, padding: "18px 24px", borderRight: "1px solid rgba(8,16,40,0.06)", position: "relative" as const }}>
                    <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: ds.blue, borderRadius: "0 2px 2px 0" }} />
                    <div style={{ fontSize: 11, fontFamily: fonts.mono, color: ds.fgFaint, letterSpacing: "0.08em", marginBottom: 5 }}>6 個月留任率預測</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                      <span style={{ fontSize: 44, fontFamily: fonts.mono, fontWeight: 800, color: ds.fgPrimary, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{Math.round(retPct)}</span>
                      <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>%</span>
                    </div>
                    <div style={{ marginTop: 5, fontSize: 11, color: ds.blue, fontFamily: fonts.mono }}>對照基準 65.4% · ↑ +18.6pp</div>
                  </div>
                  {/* Cost */}
                  <div style={{ flex: 1, padding: "18px 24px", position: "relative" as const }}>
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
            <AbsoluteFill style={{ zIndex: 30, opacity: calloutOp * m.opacity, pointerEvents: "none" }}>
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
      {/* S3 total: 4800f (80s @ 60fps).  Each Sequence overlaps ~24f with previous → crossfade, no flash.
          B0:372  B2:1284  B3:150  B4:1104(+120 opener)  B5:264  B6:150  B7:1560(+90 opener) */}
      <Sequence from={0}    durationInFrames={600}  layout="none"><B0Overview /></Sequence>
      <Sequence from={576}  durationInFrames={1284} layout="none"><B2Define /></Sequence>
      <Sequence from={1836} durationInFrames={150}  layout="none"><B3Bridge /></Sequence>
      <Sequence from={1962} durationInFrames={1294} layout="none"><B4Interact /></Sequence>
      <Sequence from={3232} durationInFrames={264}  layout="none"><B5Capture /></Sequence>
      <Sequence from={3472} durationInFrames={150}  layout="none"><B6Bridge /></Sequence>
      <Sequence from={3598} durationInFrames={1884} layout="none"><B7Tailor /></Sequence>
    </AbsoluteFill>
  );
};
