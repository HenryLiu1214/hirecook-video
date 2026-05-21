import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, Easing } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { scalePunch, cameraPush, slashWipe, rippleBurst } from "../anim";

const Statement: React.FC<{ english: string; chinese: string; isLight: boolean; start: number; wipeIn?: "slash" | "ripple" }> = ({ english, chinese, isLight, start, wipeIn }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;

  let clip = "none";
  if (wipeIn === "slash") clip = slashWipe(frame, start, 35);
  if (wipeIn === "ripple") clip = rippleBurst(frame, start, 40);

  // We remove the opacity fade-out entirely so this layer acts as a solid base for the next wipe.
  // We use a very long duration for cameraPush so it continues slowly.
  const scale = cameraPush(frame, start, 1000, 1.15);

  const textColor = isLight ? colors.hcBlueDark : colors.pureWhite;
  const subColor = isLight ? colors.hcBlue : colors.hcCyanBright;

  return (
    <AbsoluteFill style={{ 
      clipPath: clip,
      zIndex: start // Ensure later segments stack on top
    }}>
      <BgCalm theme={isLight ? "light" : "dark"} tint="blue" />
      <AbsoluteFill style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        transform: `scale(${scale})`
      }}>
        <TypewriterText text={english} startFrame={start + 10} charStagger={2} fontSize={110} fontWeight={900} colorScheme={isLight ? "blue-to-cyan" : "white"} letterSpacing="-0.02em" />
        <div style={{ 
          marginTop: 24,
          opacity: interpolate(frame, [start + 40, start + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [start + 40, start + 60], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          color: subColor, 
          fontSize: 42, 
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontFamily: fonts.display
        }}>
          {chinese}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GutFeeling: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;

  const clip = slashWipe(frame, start, 20); // Fast slash back to dark
  
  const gutScale = scalePunch(frame, start, 30);
  const lineDraw = interpolate(frame, [start + 45, start + 60], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ clipPath: clip, zIndex: start }}>
      <BgCalm theme="dark" tint="blue" />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${gutScale})` }}>
          <div style={{ fontFamily: fonts.display, fontSize: 130, fontWeight: 900, color: colors.pureWhite, letterSpacing: "-0.02em" }}>
            GUT FEELING
          </div>
          <div style={{ 
            position: "absolute", 
            top: "50%", 
            left: "-5%", 
            width: `${lineDraw * 110}%`, 
            height: 16, 
            background: colors.hcRisk, 
            transform: "translateY(-50%) rotate(-3deg)",
            boxShadow: `0 0 24px ${colors.hcRisk}`,
            borderRadius: 10
          }} />
          <div style={{ 
            textAlign: "center", 
            marginTop: 20,
            color: colors.hcRisk,
            fontSize: 40,
            fontWeight: 700,
            opacity: interpolate(frame, [start + 45, start + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          }}>
            停止直覺式盲選
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BehavioralIntelligence: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;

  const clip = rippleBurst(frame, start, 40); // Massive explosion into light
  const biScale = scalePunch(frame, start, 40);
  const camScale = cameraPush(frame, start, 500, 1.10);

  return (
    <AbsoluteFill style={{ clipPath: clip, zIndex: start }}>
      <BgCalm theme="light" tint="blue" />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${biScale}) scale(${camScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: fonts.display, fontSize: 110, fontWeight: 900, color: colors.hcBlueDark, letterSpacing: "-0.02em" }}>
            BEHAVIORAL INTELLIGENCE
          </div>
          <div style={{ 
            marginTop: 24,
            color: colors.hcBlue,
            fontSize: 42,
            fontWeight: 700,
            opacity: interpolate(frame, [start + 20, start + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          }}>
            開始科學行為預測
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S4_Tech: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* 
        We rely on z-index stacking. 
        Each layer stays mounted so it acts as the solid background for the next layer's clip-path wipe.
      */}
      {/* Frame 0: Dark (Negative/Clarification) */}
      <Statement english="NOT REPLACING HR" chinese="不是取代 HR" isLight={false} start={0} />

      {/* Frame 240: Light (Positive/Upgrade) */}
      <Statement english="UPGRADING DECISIONS" chinese="而是升級決策" isLight={true} wipeIn="slash" start={240} />

      {/* Frame 480: Dark (Negative/Stop) */}
      <GutFeeling start={480} />

      {/* Frame 660: Light (Positive/Start) */}
      <BehavioralIntelligence start={660} />
    </AbsoluteFill>
  );
};
