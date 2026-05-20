import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HandCursor } from "../components/HandCursor";
import { LucideIcon } from "../components/LucideIcon";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { momentAnim, floatY, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S3: 3600 frames (60s) at 60fps
// B0  0–600     LIGHT  overview (D / I / T cards)
// B1  600–840   LIGHT  zoom into D
// B2  840–1740  LIGHT  D · Define (RoleBuilder + HandCursor)
// B3  1740–1860 DARK   bridge
// B4  1860–2700 DARK   I · Interact (SJT + HandCursor click)
// B5  2700–2820 DARK   capture flash
// B6  2820–2940 DARK   bridge
// B7  2940–3600 LIGHT  T · Tailor (TAT playbook)

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
          fontFamily="'JetBrains Mono', monospace"
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
          fontFamily="'JetBrains Mono', monospace"
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

// ─── MBTIGrid ────────────────────────────────────────────────────────────────

const mbtiData: { type: string; score: number }[] = [
  { type: "INTJ", score: 86 }, { type: "INTP", score: 79 }, { type: "ENTJ", score: 92 }, { type: "ENTP", score: 88 },
  { type: "INFJ", score: 63 }, { type: "INFP", score: 57 }, { type: "ENFJ", score: 70 }, { type: "ENFP", score: 72 },
  { type: "ISTJ", score: 44 }, { type: "ISFJ", score: 38 }, { type: "ESTJ", score: 78 }, { type: "ESFJ", score: 49 },
  { type: "ISTP", score: 74 }, { type: "ISFP", score: 52 }, { type: "ESTP", score: 82 }, { type: "ESFP", score: 68 },
];

const MBTIGrid: React.FC<{ localFrame: number }> = ({ localFrame }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
      {mbtiData.map((item, i) => {
        const op = interpolate(localFrame, [600 + i * 8, 612 + i * 8], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        const isFit = item.score >= 75;
        const isRisk = item.score < 55;
        const bg = isFit ? "#E6F5EC" : isRisk ? "#FBE7E5" : "#F7F8FB";
        const border = isFit ? "rgba(27,122,77,0.22)" : isRisk ? "rgba(184,58,46,0.18)" : "rgba(8,16,40,0.06)";
        const textColor = isFit ? "#146F3E" : isRisk ? "#A02A1F" : "#5C677F";
        return (
          <div key={item.type} style={{
            opacity: op,
            background: bg,
            border: `1px solid ${border}`,
            borderRadius: 6,
            padding: "6px 8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}>
            <span style={{ fontSize: 11, fontFamily: fonts.mono, fontWeight: 700, color: textColor }}>{item.type}</span>
            <span style={{ fontSize: 10, fontFamily: fonts.mono, color: textColor, opacity: 0.8 }}>{item.score}</span>
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
  return (
    <div style={{ opacity: op, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 18, color: "#0B1020", fontWeight: 600, fontFamily: fonts.display }}>{label}</span>
        <span style={{ fontSize: 16, color, fontWeight: 700, fontFamily: fonts.mono }}>{value}</span>
      </div>
      <div style={{ height: 8, background: "rgba(8,16,40,0.06)", borderRadius: 9999 }}>
        <div style={{ height: "100%", width: `${w}%`, background: color, borderRadius: 9999 }} />
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
  value: string;
  unit: string;
  sub: string;
  delta?: string;
  signal?: boolean;
  localFrame: number;
  delay: number;
}> = ({ eyebrow, value, unit, sub, delta, signal, localFrame, delay }) => {
  const op = interpolate(localFrame, [delay, delay + 14], [0, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const sc = interpolate(localFrame, [delay, delay + 14], [0.88, 1], {
    easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const isPositive = delta && delta.startsWith("+");
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
            boxShadow: "0 0 6px #00B4D8",
            flexShrink: 0,
          }} />
        )}
        <span style={{ fontSize: 14, fontFamily: fonts.mono, color: "#5C677F", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{eyebrow}</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 48, fontFamily: fonts.mono, fontWeight: 700, color: "#0B1020", lineHeight: 1 }}>{value}</span>
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

const envVals = [80, 55, 75, 60, 60, 65];
const envLabels = ["協作", "壓力", "自主", "決速", "範疇", "模糊"];
const pVals = [75, 45, 85, 70, 65, 80];
const eVals = [80, 55, 75, 60, 60, 65];

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
// B0 — Overview
// ────────────────────────────────────────────────────────────────────────────

const B0Overview: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 11, 590, 600);

  const eyebrowOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cards = [
    { letter: "D", color: ds.blue, title: "Define · 定義環境", body: "用 6 個維度，模擬職位真實壓力場域" },
    { letter: "I", color: "#6A8FFF", title: "Interact · 蒐集行為", body: "情境判斷測驗，提取行為指紋" },
    { letter: "T", color: ds.fit, title: "Tailor · 客製手冊", body: "AI 生成 TAT 人才使用手冊" },
  ];

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="blue" />
      <AbsoluteFill style={{
        opacity: m.opacity, transform: m.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56,
      }}>
        <div style={{
          opacity: eyebrowOp,
          fontSize: 22,
          fontFamily: fonts.mono,
          textTransform: "uppercase" as const,
          letterSpacing: "0.16em",
          color: ds.fgMuted,
        }}>HIRECOOK 的三步驟</div>

        <TypewriterText
          text="從環境到人才，三步完成"
          startFrame={20}
          charStagger={4}
          fontSize={80}
          fontWeight={700}
          colorScheme="plum-to-pink"
        />

        <div style={{ display: "flex", gap: 28, alignItems: "stretch" }}>
          {cards.map((c, i) => {
            const start = 60 + i * 30;
            const op = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const sc = interpolate(frame, [start, start + 18], [0.88, 1], {
              easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={c.letter} style={{
                opacity: op,
                transform: `scale(${sc})`,
                width: 420,
                padding: "44px 40px",
                background: ds.canvas,
                border: `1px solid ${ds.soft}`,
                borderRadius: 16,
                boxShadow: "0 1px 0 rgba(8,16,40,0.04), 0 0 0 1px rgba(8,16,40,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxSizing: "border-box" as const,
              }}>
                <div style={{
                  fontSize: 140, fontWeight: 900, fontFamily: fonts.mono,
                  letterSpacing: "-6px", color: c.color, lineHeight: 0.85,
                }}>{c.letter}</div>
                <div style={{
                  fontSize: 26, fontWeight: 700, color: ds.fgPrimary, fontFamily: fonts.display,
                }}>{c.title}</div>
                <div style={{
                  fontSize: 18, color: ds.fgSecondary, lineHeight: 1.5, fontFamily: fonts.display,
                }}>{c.body}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B1 — Zoom into D
// ────────────────────────────────────────────────────────────────────────────

const B1ZoomD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 11, 230, 240);

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="blue" />
      <AbsoluteFill style={{
        opacity: m.opacity, transform: m.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
        perspective: "1400px",
      }}>
        <div style={{
          transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 0, 28, -10)}deg) rotateX(${rotXSettle(frame, 0, 32)}deg)`,
          fontSize: 360, fontWeight: 900, fontFamily: fonts.mono,
          color: ds.blue, letterSpacing: "-18px", lineHeight: 0.85,
        }}>D</div>
        <TypewriterText
          text="Define"
          startFrame={20}
          charStagger={5}
          fontSize={140}
          fontWeight={500}
          letterSpacing="-4px"
          colorScheme="plum-to-pink"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B2 — D · Define
// ────────────────────────────────────────────────────────────────────────────

const B2Define: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 11, 890, 900);

  const hexProg = interpolate(frame, [240, 400], [0, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="blue" />
      <AbsoluteFill style={{ opacity: m.opacity, transform: m.transform }}>
        {/* Eyebrow */}
        <div style={{
          position: "absolute", top: 64, left: 96,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontSize: 20, fontFamily: fonts.mono, color: ds.fgMuted,
          letterSpacing: "0.16em", textTransform: "uppercase" as const,
        }}>D · Define</div>

        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 20,
        }}>
          {/* Left card — sliders */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            width: 580,
            boxSizing: "border-box" as const,
            border: "1px solid rgba(8,16,40,0.06)",
            boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
            transform: `translateY(${floatY(t, 0.6, 6, 0.2)}px)`,
          }}>
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
              STEP 1 · 職位環境建模
            </span>
            <div style={{ fontSize: 22, fontWeight: 600, color: ds.fgPrimary, letterSpacing: "-0.015em", fontFamily: fonts.display }}>
              先定義環境，再定義人才。
            </div>
            <SliderRow label="協作密度" leftLabel="單兵作戰" rightLabel="持續配對" value={80} localFrame={frame} barStart={60} color={ds.blue} />
            <SliderRow label="壓力基準" leftLabel="穩定節奏" rightLabel="高壓循環" value={55} localFrame={frame} barStart={100} color={ds.blue} />
            <SliderRow label="自主性" leftLabel="高度指導" rightLabel="自主驅動" value={75} localFrame={frame} barStart={140} color="#5B8FF9" />
            <SliderRow label="決策速度" leftLabel="深思熟慮" rightLabel="快速推進" value={60} localFrame={frame} barStart={180} color={ds.cyan} />
            <SliderRow label="決策範疇" leftLabel="戰術執行" rightLabel="策略規劃" value={60} localFrame={frame} barStart={220} color={ds.cyan} />
            <SliderRow label="模糊度容忍" leftLabel="規格明確" rightLabel="高度模糊" value={65} localFrame={frame} barStart={260} color="#8B5CF6" />
            <div style={{
              opacity: interpolate(frame, [500, 513], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              marginTop: 4,
              alignSelf: "flex-end" as const,
              padding: "10px 22px",
              borderRadius: 6,
              background: ds.blue,
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: fonts.display,
              fontWeight: 600,
            }}>建立環境模型 →</div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Env fingerprint */}
            <div style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(8,16,40,0.06)",
              boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: interpolate(frame, [200, 214], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: ds.cyan, boxShadow: `0 0 6px ${ds.cyan}`, flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
                  即時預覽 · 環境指紋
                </span>
              </div>
              <HexRadar
                size={260}
                values={envVals}
                labels={envLabels}
                color={ds.blue}
                fillColor="rgba(33,81,245,0.14)"
                prog={hexProg}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontSize: 40, fontFamily: fonts.mono, fontWeight: 700, color: ds.fgPrimary }}>65</span>
                <span style={{ fontSize: 16, fontFamily: fonts.mono, color: ds.fgFaint }}>/100</span>
                <span style={{ fontSize: 14, color: ds.fgMuted, marginLeft: 6 }}>綜合壓力指數</span>
              </div>
            </div>

            {/* MBTI grid */}
            <div style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "16px 20px",
              border: "1px solid rgba(8,16,40,0.06)",
              boxShadow: "0 4px 24px rgba(8,16,40,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              opacity: interpolate(frame, [580, 594], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                人格適配 · 16 型
              </span>
              <MBTIGrid localFrame={frame} />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* HandCursor — overlay */}
      <HandCursor
        startFrame={80}
        duration={720}
        path={[
          { x: 1750, y: 120 },
          { x: 900, y: 410 },
          { x: 820, y: 500 },
          { x: 780, y: 600 },
          { x: 870, y: 770 },
          { x: 870, y: 770 },
        ]}
        clickAt={[680]}
        size={42}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B3 — Bridge (dark)
// ────────────────────────────────────────────────────────────────────────────

const B3Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 11, 110, 120);

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <AbsoluteFill style={{
        opacity: m.opacity,
        transform: `${m.transform} rotate(${rotZIn(frame, 0, 24, -6)}deg) skewX(${skewSettle(frame, 0, 22)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypewriterText
          text="有了環境，下一步——"
          startFrame={10}
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
// B4 — I · Interact (SJT + click)
// ────────────────────────────────────────────────────────────────────────────

const B4Interact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 11, 830, 840);

  const sjtProgressW = interpolate(frame, [40, 120], [0, 46], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const optionASelected = frame >= 340;

  const sjtOptions = [
    { letter: "A", text: "直接接手配菜工作，自己同時備兩個位置。" },
    { letter: "B", text: "大聲告訴隊友食材不夠，請他去通知廚師長。" },
    { letter: "C", text: "先出一個可以先上的菜穩住桌況，配菜再想辦法。" },
    { letter: "D", text: "向廚師長報告有問題，請他決定怎麼調度。" },
  ];

  const cardOp = interpolate(frame, [20, 33], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardSc = interpolate(frame, [20, 34], [0.92, 1], {
    easing: Easing.out(Easing.back(1.2)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <AbsoluteFill style={{
        opacity: m.opacity, transform: m.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
      }}>
        {/* Eyebrow */}
        <div style={{
          position: "absolute", top: 64, left: 96,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontSize: 20, fontFamily: fonts.mono, color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.16em", textTransform: "uppercase" as const,
        }}>I · Interact</div>

        <div style={{
          opacity: cardOp,
          transform: `translateY(${floatY(t, 0.68, 10, 0.4)}px) scale(${cardSc})`,
          width: 880,
          borderRadius: 12,
          overflow: "hidden" as const,
          boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Header */}
          <div style={{
            background: "#131826",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: "linear-gradient(135deg, #1430A0, #2151F5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, fontFamily: fonts.mono, fontWeight: 700, color: "#FFFFFF" }}>HC</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.softWhite, fontFamily: fonts.display }}>HireCook</span>
            <span style={{ fontSize: 13, fontFamily: fonts.mono, color: colors.dimWhite }}>後端工程師 L3 · Aurora Robotics</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: colors.dimWhite }}>07 / 15</span>
              <div style={{ width: 120, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 9999 }}>
                <div style={{
                  height: "100%",
                  width: `${sjtProgressW}%`,
                  background: ds.blue,
                  borderRadius: 9999,
                }} />
              </div>
              <div style={{
                padding: "4px 10px",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.10)",
                fontSize: 12,
                fontFamily: fonts.mono,
                color: ds.fgFaint,
              }}>儲存並離開</div>
            </div>
          </div>

          {/* Body */}
          <div style={{
            background: "#1A2030",
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                情境 07 · 廚房 · 截止日碰撞
              </span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ds.cyan }} />
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted }}>
                沒有明顯正確答案 · 選你真實會做的
              </span>
            </div>
            <div style={{ fontSize: 20, color: colors.softWhite, lineHeight: 1.65, fontFamily: fonts.display }}>
              你負責備餐，傳菜員已在出餐口等待。配菜那端的隊友突然發現食材不夠，開始重備，但沒有開口說。廚師長正在計時，三分鐘後這桌就超時了。
            </div>
            <div style={{ fontSize: 17, color: colors.dimWhite, fontFamily: fonts.display }}>
              你第一個動作是——
            </div>
            {sjtOptions.map((opt, i) => {
              const reveals = [80, 92, 104, 116];
              const optOp = interpolate(frame, [reveals[i], reveals[i] + 16], [0, 1], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              });
              const selected = opt.letter === "A" && optionASelected;
              return (
                <div key={opt.letter} style={{
                  opacity: optOp,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 8,
                  background: selected ? "rgba(33,81,245,0.18)" : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${selected ? "#2151F588" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.2s ease",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: selected ? ds.blue : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 13, fontFamily: fonts.mono, fontWeight: 700, color: "#FFFFFF" }}>{opt.letter}</span>
                  </div>
                  <span style={{
                    fontSize: 18,
                    color: selected ? colors.softWhite : colors.dimWhite,
                    fontFamily: fonts.display,
                    flex: 1,
                  }}>{opt.text}</span>
                  {selected && (
                    <span style={{ fontSize: 16, color: ds.blue, fontWeight: 700, marginLeft: "auto" }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>

      {/* HandCursor click */}
      <HandCursor
        startFrame={200}
        duration={580}
        path={[
          { x: 1500, y: 200 },
          { x: 1300, y: 500 },
          { x: 880, y: 660 },
          { x: 880, y: 660 },
        ]}
        clickAt={[340]}
        size={42}
      />
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B5 — Capture flash
// ────────────────────────────────────────────────────────────────────────────

const B5Capture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 11, 110, 120);

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,180,216,0.18) 0%, transparent 70%)",
      }} />
      <AbsoluteFill style={{
        opacity: m.opacity,
        transform: `${m.transform} scale(${breathe(t)}) rotate(${rotZIn(frame, 8, 30, -10)}deg) rotateX(${rotXSettle(frame, 8, 32)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypewriterText
          text="行為指紋捕捉完成"
          startFrame={8}
          charStagger={5}
          fontSize={140}
          fontWeight={900}
          letterSpacing="-3px"
          colorScheme="white-to-cyan"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// B6 — Bridge to T
// ────────────────────────────────────────────────────────────────────────────

const B6Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 11, 110, 120);

  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      <AbsoluteFill style={{
        opacity: m.opacity,
        transform: `${m.transform} rotate(${rotZIn(frame, 0, 24, -6)}deg) skewX(${skewSettle(frame, 0, 22)}deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <TypewriterText
          text="接著，給主管一份手冊——"
          startFrame={10}
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
// B7 — T · Tailor
// ────────────────────────────────────────────────────────────────────────────

const B7Tailor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 11, 650, 660);

  const peProg = interpolate(frame, [100, 240], [0, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const headerOp = interpolate(frame, [0, 13], [0, 1], {
    easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BgCalm theme="light" tint="green" />
      <AbsoluteFill style={{
        opacity: m.opacity, transform: m.transform,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
      }}>
        {/* Eyebrow */}
        <div style={{
          position: "absolute", top: 64, left: 96,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontSize: 20, fontFamily: fonts.mono, color: ds.fgMuted,
          letterSpacing: "0.16em", textTransform: "uppercase" as const,
          marginBottom: 8,
        }}>T · Tailor</div>

        <div style={{ width: 1500, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Candidate header */}
          <div style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "20px 28px",
            border: "1px solid rgba(8,16,40,0.06)",
            boxShadow: "0 4px 24px rgba(8,16,40,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: headerOp,
            transform: `translateY(${floatY(t, 0.74, 10, 0.5)}px)`,
          }}>
            <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginRight: 8 }}>
              TAT PLAYBOOK · CHD-047
            </span>
            <div style={{
              width: 44, height: 44, borderRadius: 8,
              background: "linear-gradient(135deg, #1430A0, #2151F5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, fontFamily: fonts.mono, fontWeight: 700, color: "#FFFFFF" }}>CW</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: ds.fgPrimary, fontFamily: fonts.display }}>陳威宇</span>
              <span style={{ fontSize: 14, color: ds.fgMuted, fontFamily: fonts.display }}>後端工程師 L3 · 2 天前測驗 via SJT-v4</span>
            </div>
            <div style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 9999,
              background: "#E6F5EC",
              border: "1px solid rgba(27,122,77,0.22)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ds.fit }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#146F3E", fontFamily: fonts.display }}>適配</span>
            </div>
          </div>

          {/* KPI row */}
          <div style={{ display: "flex", gap: 12 }}>
            <KPICard eyebrow="P×E適配" value="88.5" unit="/100" sub="± 2.1 信賴區間" delta="+4.2" signal={true} localFrame={frame} delay={30} />
            <KPICard eyebrow="6個月留任率" value="84" unit="%" sub="對照基準 65.4%" localFrame={frame} delay={48} />
            <KPICard eyebrow="錯配成本節省" value="22" unit="萬" sub="NT$ · 預期效益" localFrame={frame} delay={66} />
            <KPICard eyebrow="預測信心度" value="91" unit="%" sub="model.v4.3 · 穩定" localFrame={frame} delay={84} />
          </div>

          {/* Bottom row */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* PEMap card */}
            <div style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(8,16,40,0.06)",
              boxShadow: "0 4px 24px rgba(8,16,40,0.06)",
              flexBasis: 360,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              opacity: interpolate(frame, [100, 113], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                P × E MAP
              </span>
              <PEMapRadar size={280} pVals={pVals} eVals={eVals} prog={peProg} />
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 2, background: ds.cyan, borderRadius: 1 }} />
                  <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted }}>P · 人格</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 2, background: ds.blue, borderRadius: 1 }} />
                  <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted }}>E · 環境</span>
                </div>
              </div>
            </div>

            {/* XAI card */}
            <div style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(8,16,40,0.06)",
              boxShadow: "0 4px 24px rgba(8,16,40,0.06)",
              flexBasis: 380,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: interpolate(frame, [150, 163], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                  XAI · 驅動因子
                </span>
                <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgFaint }}>Δ 對照團隊基準</span>
              </div>
              {drivers.map((d) => (
                <XAIDriver key={d.name} name={d.name} value={d.value} localFrame={frame} delay={d.delay} />
              ))}
            </div>

            {/* Management recs */}
            <div style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(8,16,40,0.06)",
              boxShadow: "0 4px 24px rgba(8,16,40,0.06)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: interpolate(frame, [250, 263], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}>
              <span style={{ fontSize: 12, fontFamily: fonts.mono, color: ds.fgMuted, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                管理建議
              </span>
              {recs.map((rec) => {
                const recOp = interpolate(frame, [rec.delay, rec.delay + 12], [0, 1], {
                  extrapolateLeft: "clamp", extrapolateRight: "clamp",
                });
                return (
                  <div key={rec.num} style={{
                    opacity: recOp,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 13, fontFamily: fonts.mono, fontWeight: 700, color: ds.blue, flexShrink: 0, marginTop: 2 }}>{rec.num}</span>
                    <span style={{ fontSize: 17, color: ds.fgSecondary, fontFamily: fonts.display, lineHeight: 1.55 }}>{rec.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────────────────

export const S3_DIT: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={600} layout="none"><B0Overview /></Sequence>
      <Sequence from={600} durationInFrames={240} layout="none"><B1ZoomD /></Sequence>
      <Sequence from={840} durationInFrames={900} layout="none"><B2Define /></Sequence>
      <Sequence from={1740} durationInFrames={120} layout="none"><B3Bridge /></Sequence>
      <Sequence from={1860} durationInFrames={840} layout="none"><B4Interact /></Sequence>
      <Sequence from={2700} durationInFrames={120} layout="none"><B5Capture /></Sequence>
      <Sequence from={2820} durationInFrames={120} layout="none"><B6Bridge /></Sequence>
      <Sequence from={2940} durationInFrames={660} layout="none"><B7Tailor /></Sequence>
      <SubtitleBar />
    </AbsoluteFill>
  );
};
