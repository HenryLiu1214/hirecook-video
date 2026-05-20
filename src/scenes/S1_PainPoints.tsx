import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing, AbsoluteFill, Sequence } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { SubtitleBar } from "../components/SubtitleBar";
import { LucideIcon, IconName } from "../components/LucideIcon";
import { momentAnim, breathe, rotXSettle, rotZIn, skewSettle } from "../anim";

// S1 PainPoints — 3900 frames (65s @ 60fps)
// B1  0    – 360   LIGHT  Audience opener (two sub-beats)
// B2  360  – 1140  LIGHT  Gut feeling title
// B3  1140 – 1500  LIGHT  Tag pills
// B4  1500 – 1740  DARK   Transition "但代價，正在發生。"
// B5  1740 – 2280  DARK   Stat 1 — clock / 60.3 天 / 招募空窗期
// B6  2280 – 2820  DARK   Stat 2 — trending-down / 65.4% / 新人快閃率
// B7  2820 – 3360  DARK   Stat 3 — coins / NT$30萬 / 單次錯配成本
// B8  3360 – 3600  DARK   Combine — 3 small cards
// B9  3600 – 3900  DARK   M3 — Visible vs hidden + closing line

const SIGNAL_CYAN = "#00B4D8";
const SOFT_PURPLE = "#A78BFA";

// ── B1: Audience opener ──────────────────────────────────────────────
const B1Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // First line shows 0–180, fades out 160–180.
  const firstOp = interpolate(frame, [0, 12, 160, 180], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Second line fades in 170–200, holds to 360.
  const secondOp = interpolate(frame, [170, 200, 340, 360], [0, 1, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      {/* First line */}
      <div style={{
        position: "absolute",
        opacity: firstOp,
        transform: `scale(${breathe(t)}) rotate(${rotZIn(frame, 0, 28, -10)}deg)`,
      }}>
        <TypewriterText
          text="招募現場——"
          startFrame={0}
          charStagger={5}
          fontSize={260}
          fontWeight={900}
          letterSpacing="-6px"
          colorScheme="plum-to-pink"
        />
      </div>
      {/* Second line */}
      <div style={{
        position: "absolute",
        opacity: secondOp,
        transform: `scale(${breathe(t, 1.1, 0.012)}) rotate(${rotZIn(frame, 180, 26, -8)}deg)`,
      }}>
        <TypewriterText
          text="每天都在發生。"
          startFrame={180}
          charStagger={5}
          fontSize={200}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="plum-to-pink"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B2: Gut feeling title ────────────────────────────────────────────
const B2GutFeeling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 14, 770, 780);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: `${m.transform} scale(${breathe(t)}) rotate(${rotZIn(frame, 14, 32, -10)}deg) rotateX(${rotXSettle(frame, 14, 36)}deg)`,
      }}>
        <TypewriterText
          text="這個人感覺很適合。"
          startFrame={14}
          charStagger={4}
          fontSize={160}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="plum-to-pink"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── B3: Tag pills ─────────────────────────────────────────────────────
const B3TagPills: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 14, 340, 360);

  const pills = [
    { label: "履歷包裝", color: colors.alertOrange },
    { label: "靜態測驗", color: colors.warningYellow },
    { label: "主管直覺", color: "#6A8FFF" },
  ] as const;

  const eyebrowOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        fontFamily: fonts.display,
        fontSize: 28,
        fontWeight: 500,
        color: colors.hcFgMuted,
        letterSpacing: "4px",
        transform: m.transform,
      }}>
        我們仰賴的，只有這些——
      </div>
      <div style={{ display: "flex", gap: 28, transform: m.transform }}>
        {pills.map((pill, idx) => {
          const pillStart = 30 + idx * 16;
          const op = interpolate(frame, [pillStart, pillStart + 14], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const sc = interpolate(frame, [pillStart, pillStart + 16], [0.6, 1], {
            easing: Easing.out(Easing.back(1.4)), extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          return (
            <div key={pill.label} style={{
              opacity: op,
              transform: `scale(${sc})`,
              padding: "16px 40px",
              borderRadius: 9999,
              border: `1.5px solid ${pill.color}`,
              background: `${pill.color}18`,
              fontSize: 38,
              fontWeight: 700,
              color: pill.color,
              fontFamily: fonts.display,
            }}>{pill.label}</div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── B4: Transition ────────────────────────────────────────────────────
const B4Transition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const m = momentAnim(frame, 0, 14, 220, 240);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: `${m.transform} scale(${breathe(t)}) rotate(${rotZIn(frame, 10, 30, -8)}deg)`,
      }}>
        <TypewriterText
          text="但代價，正在發生。"
          startFrame={10}
          charStagger={5}
          fontSize={200}
          fontWeight={900}
          letterSpacing="-4px"
          colorScheme="white-to-blue"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Animated Counter (used in B5/B6/B7) ──────────────────────────────
const Counter: React.FC<{
  value: number;
  decimals?: number;
  color: string;
  delay: number;
  fontSize?: number;
}> = ({ value, decimals = 0, color, delay, fontSize = 200 }) => {
  const frame = useCurrentFrame();
  const raw = interpolate(frame, [delay, delay + 50], [0, value], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const count = decimals > 0 ? raw.toFixed(decimals) : Math.round(raw).toString();
  const op = interpolate(frame, [delay, delay + 9], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scaleIn = interpolate(frame, [delay, delay + 14], [0.6, 1], {
    easing: Easing.out(Easing.back(1.3)),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const rx = rotXSettle(frame, delay, 32);
  const rz = rotZIn(frame, delay, 28, -8);

  return (
    <span style={{
      display: "inline-block",
      opacity: op,
      transform: `scale(${scaleIn}) rotateX(${rx}deg) rotate(${rz}deg)`,
      fontFamily: fonts.mono,
      fontSize,
      fontWeight: 900,
      letterSpacing: "-4px",
      lineHeight: 1,
      color,
    }}>{count}</span>
  );
};

// ── Single big stat card (B5/B6) ─────────────────────────────────────
const BigStatCard: React.FC<{
  icon: IconName;
  color: string;
  eyebrow: string;
  value: number;
  decimals?: number;
  unit: string;
  subtitle: string;
}> = ({ icon, color, eyebrow, value, decimals = 1, unit, subtitle }) => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 520, 540);

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: m.transform,
        width: 720,
        padding: 48,
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        boxSizing: "border-box",
      }}>
        <LucideIcon name={icon} size={56} color={color} strokeWidth={1.5} />
        <div style={{
          fontFamily: fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "4px",
          textTransform: "uppercase",
          color,
        }}>{eyebrow}</div>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12,
        }}>
          <Counter value={value} decimals={decimals} color={color} delay={30} fontSize={200} />
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 80,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}>{unit}</span>
        </div>
        <div style={{
          fontSize: 28,
          color: colors.dimWhite,
          fontFamily: fonts.display,
        }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};

// ── B7: Stat 3 — NT$ prefix + 30 + 萬 ─────────────────────────────────
const B7Stat3: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 520, 540);
  const color = SOFT_PURPLE;

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", alignItems: "center", justifyContent: "center",
      perspective: "1400px",
    }}>
      <div style={{
        transform: m.transform,
        width: 720,
        padding: 48,
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 20,
        boxSizing: "border-box",
      }}>
        <LucideIcon name="coins" size={56} color={color} strokeWidth={1.5} />
        <div style={{
          fontFamily: fonts.mono,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "4px",
          textTransform: "uppercase",
          color,
        }}>代價高</div>
        <div style={{
          display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12,
        }}>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 60,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}>NT$</span>
          <Counter value={30} decimals={0} color={color} delay={30} fontSize={200} />
          <span style={{
            fontFamily: fonts.mono,
            fontSize: 80,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}>萬</span>
        </div>
        <div style={{
          fontSize: 28,
          color: colors.dimWhite,
          fontFamily: fonts.display,
        }}>單次錯配成本</div>
      </div>
    </AbsoluteFill>
  );
};

// ── B8: Combine — three smaller cards ────────────────────────────────
const B8Combine: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 220, 240);

  const cards = [
    { icon: "clock" as IconName, color: colors.warningYellow, title: "找人難", number: "60.3", unit: "天", subtitle: "招募空窗期" },
    { icon: "trending-down" as IconName, color: colors.alertOrange, title: "留不住", number: "65.4", unit: "%", subtitle: "新人快閃率" },
    { icon: "coins" as IconName, color: SOFT_PURPLE, title: "代價高", number: "30", unit: "萬", subtitle: "單次錯配成本", prefix: "NT$" as const },
  ];

  const eyebrowOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        transform: `${m.transform} rotate(${rotZIn(frame, 6, 24, -6)}deg)`,
      }}>
        <TypewriterText
          text="三個數字，一個系統性問題"
          startFrame={6}
          charStagger={3}
          fontSize={32}
          fontWeight={600}
          letterSpacing="2px"
          colorScheme="white-to-blue"
        />
      </div>
      <div style={{ display: "flex", gap: 24, transform: m.transform }}>
        {cards.map((card, idx) => {
          const cardStart = 24 + idx * 14;
          const op = interpolate(frame, [cardStart, cardStart + 14], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const sc = interpolate(frame, [cardStart, cardStart + 16], [0.8, 1], {
            easing: Easing.out(Easing.back(1.3)),
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const prefix = "prefix" in card ? (card as { prefix: string }).prefix : "";
          return (
            <div key={card.title} style={{
              opacity: op,
              transform: `scale(${sc})`,
              width: 380,
              padding: 32,
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              boxSizing: "border-box",
            }}>
              <LucideIcon name={card.icon} size={28} color={card.color} strokeWidth={1.5} />
              <div style={{
                fontSize: 18,
                fontWeight: 700,
                color: card.color,
                fontFamily: fonts.mono,
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}>{card.title}</div>
              <div style={{
                display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4,
              }}>
                {prefix && (
                  <span style={{
                    fontFamily: fonts.mono,
                    fontSize: 28,
                    fontWeight: 700,
                    color: card.color,
                    lineHeight: 1,
                  }}>{prefix}</span>
                )}
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: 88,
                  fontWeight: 900,
                  letterSpacing: "-3px",
                  color: card.color,
                  lineHeight: 1,
                }}>{card.number}</span>
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: 32,
                  fontWeight: 700,
                  color: card.color,
                  lineHeight: 1,
                }}>{card.unit}</span>
              </div>
              <div style={{
                fontSize: 16,
                color: colors.dimWhite,
                fontFamily: fonts.display,
              }}>{card.subtitle}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── B9: Visible vs hidden comparison + closing line ──────────────────
const B9Compare: React.FC = () => {
  const frame = useCurrentFrame();
  const m = momentAnim(frame, 0, 16, 280, 300);

  const visibleItems = ["履歷學歷", "面試技巧", "性格標籤", "自我陳述"];
  const hiddenItems = ["壓力反應", "決策邏輯", "溝通偏好", "動態協作", "真實職場適應性"];

  const eyebrowOp = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{
      opacity: m.opacity,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40,
      perspective: "1400px",
    }}>
      <div style={{
        opacity: eyebrowOp,
        fontFamily: fonts.mono,
        fontSize: 28,
        color: colors.dimWhite,
        letterSpacing: "3px",
        transform: m.transform,
      }}>
        招募現場看得到的——與看不見的——
      </div>

      <div style={{
        transform: m.transform,
        display: "flex", gap: 24, width: 1240,
      }}>
        {/* Left — visible */}
        <div style={{
          flex: 1,
          padding: 36,
          borderRadius: 16,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", gap: 18,
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LucideIcon name="eye" size={32} color={colors.dimWhite} strokeWidth={1.5} />
            <div style={{
              fontSize: 24,
              fontFamily: fonts.mono,
              fontWeight: 700,
              letterSpacing: "3px",
              color: colors.dimWhite,
            }}>可見</div>
          </div>
          {visibleItems.map((item, i) => {
            const start = 24 + i * 8;
            const op = interpolate(frame, [start, start + 12], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const tx = interpolate(frame, [start, start + 14], [-12, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={item} style={{
                opacity: op,
                transform: `translateX(${tx}px)`,
                display: "flex", alignItems: "center", gap: 12,
                fontSize: 26,
                color: colors.dimWhite,
                fontFamily: fonts.display,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 9999, background: colors.dimWhite,
                }} />
                {item}
              </div>
            );
          })}
        </div>

        {/* Right — hidden */}
        <div style={{
          flex: 1,
          padding: 36,
          borderRadius: 16,
          background: "rgba(0,180,216,0.04)",
          border: `1px solid ${SIGNAL_CYAN}33`,
          display: "flex", flexDirection: "column", gap: 18,
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LucideIcon name="eye-off" size={32} color={SIGNAL_CYAN} strokeWidth={1.5} />
            <div style={{
              fontSize: 24,
              fontFamily: fonts.mono,
              fontWeight: 700,
              letterSpacing: "3px",
              color: SIGNAL_CYAN,
            }}>隱性</div>
          </div>
          {hiddenItems.map((item, i) => {
            const start = 60 + i * 8;
            const op = interpolate(frame, [start, start + 12], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const tx = interpolate(frame, [start, start + 14], [12, 0], {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={item} style={{
                opacity: op,
                transform: `translateX(${tx}px)`,
                display: "flex", alignItems: "center", gap: 12,
                fontSize: 26,
                color: SIGNAL_CYAN,
                fontFamily: fonts.display,
                fontWeight: 600,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 9999, background: SIGNAL_CYAN,
                }} />
                {item}
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing line */}
      <div style={{
        transform: `${m.transform} rotate(${rotZIn(frame, 180, 28, -6)}deg)`,
      }}>
        <TypewriterText
          text="看不見的，才是關鍵。"
          startFrame={180}
          charStagger={4}
          fontSize={96}
          fontWeight={900}
          letterSpacing="-3px"
          colorScheme="white-to-cyan"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene root ───────────────────────────────────────────────────────
export const S1_PainPoints: React.FC = () => {
  // skewSettle imported for symmetry with other scenes; not directly used here.
  void skewSettle;
  return (
    <AbsoluteFill style={{ background: colors.void }}>
      {/* Light backdrop B1–B3 (0–1500) */}
      <Sequence from={0} durationInFrames={1500} layout="none">
        <AbsoluteFill>
          <BgCalm theme="light" tint="blue" />
        </AbsoluteFill>
      </Sequence>

      {/* Dark backdrop B4–B9 (1500–3900) */}
      <Sequence from={1500} durationInFrames={2400} layout="none">
        <AbsoluteFill>
          <BgCalm theme="dark" tint="blue" />
        </AbsoluteFill>
      </Sequence>

      {/* B1 0–360 Audience opener */}
      <Sequence from={0} durationInFrames={360} layout="none">
        <B1Audience />
      </Sequence>

      {/* B2 360–1140 Gut feeling */}
      <Sequence from={360} durationInFrames={780} layout="none">
        <B2GutFeeling />
      </Sequence>

      {/* B3 1140–1500 Tag pills */}
      <Sequence from={1140} durationInFrames={360} layout="none">
        <B3TagPills />
      </Sequence>

      {/* B4 1500–1740 Transition */}
      <Sequence from={1500} durationInFrames={240} layout="none">
        <B4Transition />
      </Sequence>

      {/* B5 1740–2280 Stat 1 */}
      <Sequence from={1740} durationInFrames={540} layout="none">
        <BigStatCard
          icon="clock"
          color={colors.warningYellow}
          eyebrow="找人難"
          value={60.3}
          decimals={1}
          unit="天"
          subtitle="招募空窗期"
        />
      </Sequence>

      {/* B6 2280–2820 Stat 2 */}
      <Sequence from={2280} durationInFrames={540} layout="none">
        <BigStatCard
          icon="trending-down"
          color={colors.alertOrange}
          eyebrow="留不住"
          value={65.4}
          decimals={1}
          unit="%"
          subtitle="新人快閃率"
        />
      </Sequence>

      {/* B7 2820–3360 Stat 3 */}
      <Sequence from={2820} durationInFrames={540} layout="none">
        <B7Stat3 />
      </Sequence>

      {/* B8 3360–3600 Combine */}
      <Sequence from={3360} durationInFrames={240} layout="none">
        <B8Combine />
      </Sequence>

      {/* B9 3600–3900 Visible vs hidden */}
      <Sequence from={3600} durationInFrames={300} layout="none">
        <B9Compare />
      </Sequence>

      <SubtitleBar />
    </AbsoluteFill>
  );
};
