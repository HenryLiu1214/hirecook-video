import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { HcLogoMark } from "../components/HcLogoMark";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S2: 4200 frames (70s) — 10 beats, light → dark midway
// B1 0–600       (light) Stop Hiring
// B2 600–1080    (light) by Gut Feeling
// B3 1080–1500   (light) Brand pill
// B4 1500–2400   (dark)  B = f(P, E)
// B5 2400–2580   (dark)  那 E 是什麼？
// B6 2580–3300   (dark)  P-E Fit
// B7 3300–3540   (dark)  但 E 無法面試出來
// B8 3540–3780   (dark)  Simulate the Pressure
// B9 3780–4020   (dark)  Scenarios
// B10 4020–4200  (dark)  讓對的人

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── B1 — Stop Hiring (light) ──────────────────────────────
const B1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 600;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const eyebrowOp = interpolate(frame, [0, 15], [0, 1], clamp);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        fontSize: 28, fontFamily: fonts.mono, color: colors.hcFgMuted, letterSpacing: "2px",
      }}>
        用直覺招募的時代——
      </div>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 22, 34, -14)}deg) rotateX(${rotXSettle(frame, 22, 36)}deg)`,
      }}>
        <TypewriterText
          text="Stop Hiring"
          startFrame={22}
          charStagger={4}
          fontSize={240}
          fontWeight={900}
          letterSpacing="-8px"
          colorScheme="plum-to-pink"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B2 — by Gut Feeling (light) ───────────────────────────
const B2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 480;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const subOp = interpolate(frame, [50, 70], [0, 1], clamp);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
      perspective: "1400px",
    }}>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 22, 34, -14)}deg) rotateX(${rotXSettle(frame, 22, 36)}deg)`,
      }}>
        <TypewriterText
          text="by Gut Feeling"
          startFrame={22}
          charStagger={4}
          fontSize={240}
          fontWeight={900}
          letterSpacing="-8px"
          colorScheme="plum-to-pink"
        />
      </div>
      <div style={{
        opacity: subOp,
        fontSize: 80, fontWeight: 700, color: "#2151F5", fontFamily: fonts.display,
      }}>
        已經結束。
      </div>
    </AbsoluteFill>
  );
};

// ── B3 — Brand intro (light) ──────────────────────────────
const B3: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 420;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const titleOp = interpolate(frame, [10, 28], [0, 1], clamp);
  const pillOp = interpolate(frame, [20, 50], [0, 1], clamp);
  const pillSc = interpolate(frame, [20, 50], [0.7, 1], {
    easing: Easing.out(Easing.back(1.3)), ...clamp,
  });

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: titleOp,
        fontSize: 44, color: "#364159", fontFamily: fonts.display, fontWeight: 600,
      }}>
        別再憑直覺用人——
      </div>
      <div style={{
        opacity: pillOp,
        transform: `scale(${pillSc})`,
        display: "flex", flexDirection: "row", alignItems: "center", gap: 18,
        padding: "20px 56px", borderRadius: 9999,
        background: "rgba(33,81,245,0.10)",
        border: "1.5px solid rgba(33,81,245,0.40)",
      }}>
        <HcLogoMark size={56} />
        <TypewriterText
          text="HireCook 真才實測"
          startFrame={30}
          charStagger={4}
          fontSize={56}
          fontWeight={700}
          colorScheme="plum-to-pink"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B4 — B = f(P, E) (dark) ───────────────────────────────
const B4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 900;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const eyebrowOp = interpolate(frame, [0, 15], [0, 1], clamp);
  const legendOp = interpolate(frame, [130, 150], [0, 1], clamp);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        fontSize: 32, fontFamily: fonts.mono, color: colors.dimWhite, letterSpacing: "3px",
      }}>
        理論支柱 · Lewin 行為公式
      </div>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 20, 34, -12)}deg) rotateX(${rotXSettle(frame, 20, 36)}deg)`,
      }}>
        <TypewriterText
          text="B = f(P, E)"
          startFrame={20}
          charStagger={6}
          fontSize={380}
          fontWeight={900}
          letterSpacing="-14px"
          colorScheme="white-to-blue"
          showCursor
        />
      </div>
      <div style={{
        opacity: legendOp,
        display: "flex", gap: 80, fontSize: 36, fontFamily: fonts.mono, color: colors.dimWhite,
      }}>
        <span><span style={{ color: "#FFF", fontWeight: 700 }}>B</span> 行為</span>
        <span><span style={{ color: "#00B4D8", fontWeight: 700 }}>P</span> 人格特質</span>
        <span><span style={{ color: "#2151F5", fontWeight: 700 }}>E</span> 環境壓力</span>
      </div>
      <TypewriterText
        text="傳統工具只算 P，HireCook 同時測 E"
        startFrame={260}
        charStagger={3}
        fontSize={44}
        fontWeight={600}
        colorScheme="white"
      />
    </AbsoluteFill>
  );
};

// ── B5 — 那 E 是什麼？ (dark) ─────────────────────────────
const B5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 180;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 15, 34, -14)}deg) rotateX(${rotXSettle(frame, 15, 36)}deg)`,
      }}>
        <TypewriterText
          text="那 E 是什麼？"
          startFrame={15}
          charStagger={5}
          fontSize={220}
          fontWeight={900}
          letterSpacing="-6px"
          colorScheme="white-to-cyan"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B6 — P-E Fit circles (dark) ───────────────────────────
const B6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const td = frame / fps;
  const duration = 720;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const overlap = interpolate(frame, [40, 200], [0, 1], {
    easing: Easing.inOut(Easing.cubic), ...clamp,
  });
  const pX = -(240 - overlap * 150);
  const eX = 240 - overlap * 150;
  const circleBreathe = 1 + 0.045 * Math.sin(td * 1.5);

  const circleStyle = (color: string): React.CSSProperties => ({
    width: 320, height: 320, borderRadius: "50%",
    background: `radial-gradient(circle, ${color}33 30%, ${color}11 70%, transparent 100%)`,
    border: `2px solid ${color}66`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column",
    transform: `scale(${circleBreathe})`,
  });

  const fitOp = overlap >= 0.8 ? overlap * overlap : 0;

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56,
      perspective: "1400px",
    }}>
      <div style={{ position: "relative", width: 900, height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", left: `calc(50% + ${pX}px - 160px)`, top: "50%", transform: "translateY(-50%)" }}>
          <div style={circleStyle("#00B4D8")}>
            <div style={{ fontSize: 96, fontWeight: 900, color: "#00B4D8", fontFamily: fonts.mono }}>P</div>
            <div style={{ fontSize: 22, color: "#00B4D8", marginTop: 6, fontFamily: fonts.display }}>P · 人格</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: `calc(50% + ${eX}px - 160px)`, top: "50%", transform: "translateY(-50%)" }}>
          <div style={circleStyle("#2151F5")}>
            <div style={{ fontSize: 96, fontWeight: 900, color: "#2151F5", fontFamily: fonts.mono }}>E</div>
            <div style={{ fontSize: 22, color: "#2151F5", marginTop: 6, fontFamily: fonts.display }}>E · 環境</div>
          </div>
        </div>
        <div style={{ position: "absolute", zIndex: 10, opacity: fitOp }}>
          <div style={{ fontSize: 28, fontFamily: fonts.mono, color: "#FFFFFF", letterSpacing: "3px", fontWeight: 700 }}>FIT</div>
        </div>
      </div>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 260, 30, -10)}deg) rotateX(${rotXSettle(frame, 260, 32)}deg)`,
      }}>
        <TypewriterText
          text="適配度↑ = 離職風險↓"
          startFrame={260}
          charStagger={5}
          fontSize={120}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="white-to-cyan"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B7 — 但 E 無法面試出來 (dark) ─────────────────────────
const B7: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 240;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: `rotate(${rotZIn(frame, 10, 30, -10)}deg) skewX(${skewSettle(frame, 10, 26)}deg)`,
      }}>
        <TypewriterText
          text="但 E 無法面試出來——除非……"
          startFrame={10}
          charStagger={4}
          fontSize={110}
          fontWeight={700}
          letterSpacing="-3px"
          colorScheme="white-to-cyan"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B8 — Simulate the Pressure (dark) ─────────────────────
const B8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 240;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
      perspective: "1400px",
    }}>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 10, 32, -12)}deg) rotateX(${rotXSettle(frame, 10, 34)}deg)`,
      }}>
        <TypewriterText
          text="Simulate the Pressure"
          startFrame={10}
          charStagger={4}
          fontSize={160}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="white-to-cyan"
        />
      </div>
      <div style={{
        transform: `rotate(${rotZIn(frame, 90, 26, -8)}deg) rotateX(${rotXSettle(frame, 90, 28)}deg)`,
      }}>
        <TypewriterText
          text="Before Hiring"
          startFrame={90}
          charStagger={3}
          fontSize={80}
          fontWeight={700}
          colorScheme="white"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B9 — Scenarios (dark) ─────────────────────────────────
const B9: React.FC = () => {
  const frame = useCurrentFrame();
  const duration = 240;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  const eyebrowOp = interpolate(frame, [0, 15], [0, 1], clamp);

  const scenarios = [
    { label: "大客戶突然退單", color: colors.alertOrange, dx: -200 },
    { label: "主管同時催報表", color: colors.warningYellow, dx: 200 },
    { label: "同事任務延遲", color: "#6A8FFF", dx: -200 },
    { label: "時間倒數壓力", color: "#00B4D8", dx: 200 },
  ] as const;

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        fontSize: 36, fontFamily: fonts.mono, color: colors.dimWhite, letterSpacing: "2px",
      }}>
        1,440+ 模擬場景 · AI 行為沙盒
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, justifyContent: "center",
      }}>
        {scenarios.map((s, i) => {
          const tagStart = 40 + i * 18;
          const tagOp = interpolate(frame, [tagStart, tagStart + 13], [0, 1], clamp);
          const tagX = interpolate(frame, [tagStart, tagStart + 18], [s.dx, 0], {
            easing: Easing.out(Easing.back(1.2)), ...clamp,
          });
          return (
            <div key={s.label} style={{
              opacity: tagOp,
              transform: `translateX(${tagX}px)`,
              padding: "16px 36px", borderRadius: 9999,
              background: `${s.color}18`, border: `1.5px solid ${s.color}66`,
              fontSize: 36, fontWeight: 700, color: s.color,
              fontFamily: fonts.display,
              textAlign: "center",
            }}>{s.label}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── B10 — 讓對的人 (dark) ─────────────────────────────────
const B10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const duration = 180;
  const m = momentAnim(frame, 0, 11, duration - 10, duration);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity, transform: m.transform,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 10, 32, -12)}deg) rotateX(${rotXSettle(frame, 10, 34)}deg)`,
      }}>
        <TypewriterText
          text="讓對的人，進入對的環境。"
          startFrame={10}
          charStagger={4}
          fontSize={130}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="white-to-cyan"
        />
      </div>
    </AbsoluteFill>
  );
};

export const S2_Science: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Light backdrop for B1-B3 (frames 0-1500) */}
      <Sequence from={0} durationInFrames={1500} layout="none">
        <AbsoluteFill><BgCalm theme="light" tint="blue" /></AbsoluteFill>
      </Sequence>
      {/* Dark backdrop for B4-B10 (frames 1500-4200) */}
      <Sequence from={1500} durationInFrames={2700} layout="none">
        <AbsoluteFill><BgCalm theme="dark" tint="blue" /></AbsoluteFill>
      </Sequence>

      <Sequence from={0} durationInFrames={600} layout="none"><B1 /></Sequence>
      <Sequence from={600} durationInFrames={480} layout="none"><B2 /></Sequence>
      <Sequence from={1080} durationInFrames={420} layout="none"><B3 /></Sequence>
      <Sequence from={1500} durationInFrames={900} layout="none"><B4 /></Sequence>
      <Sequence from={2400} durationInFrames={180} layout="none"><B5 /></Sequence>
      <Sequence from={2580} durationInFrames={720} layout="none"><B6 /></Sequence>
      <Sequence from={3300} durationInFrames={240} layout="none"><B7 /></Sequence>
      <Sequence from={3540} durationInFrames={240} layout="none"><B8 /></Sequence>
      <Sequence from={3780} durationInFrames={240} layout="none"><B9 /></Sequence>
      <Sequence from={4020} durationInFrames={180} layout="none"><B10 /></Sequence>

      <SubtitleBar />
    </AbsoluteFill>
  );
};
