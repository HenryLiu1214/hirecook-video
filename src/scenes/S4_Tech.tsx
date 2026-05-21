import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, Sequence, Easing } from "remotion";
import { colors, fonts } from "../tokens";
import { BgCalm } from "../components/BgCalm";
import { TypewriterText } from "../components/TypewriterText";
import { scalePunch, cameraPush, circleWipe } from "../anim";

const Statement: React.FC<{ english: string; chinese: string; start: number; end: number; align?: "center" | "left" }> = ({ english, chinese, start, end, align = "center" }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end + 30) return null;

  const clip = circleWipe(frame, start, 40);
  const opacity = interpolate(frame, [end - 20, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = cameraPush(frame, start, end - start, 1.05);

  return (
    <AbsoluteFill style={{ 
      display: "flex", 
      alignItems: align, 
      justifyContent: "center",
      flexDirection: "column",
      clipPath: clip,
      opacity,
      transform: `scale(${scale})`
    }}>
      <TypewriterText text={english} startFrame={start + 10} charStagger={2} fontSize={110} fontWeight={900} colorScheme="white" letterSpacing="-0.02em" />
      <div style={{ 
        marginTop: 24,
        opacity: interpolate(frame, [start + 40, start + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [start + 40, start + 60], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        color: colors.hcCyanBright, 
        fontSize: 42, 
        fontWeight: 700,
        letterSpacing: "0.05em",
        fontFamily: fonts.display
      }}>
        {chinese}
      </div>
    </AbsoluteFill>
  );
};

const ParadigmShift: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Gut Feeling
  const gutScale = scalePunch(frame, 0, 30);
  const gutOp = interpolate(frame, [150, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineDraw = interpolate(frame, [45, 60], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Behavioral Intelligence
  const biScale = scalePunch(frame, 160, 40);
  const biOp = interpolate(frame, [450, 480], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const camScale = cameraPush(frame, 160, 320, 1.10); // gentle push in

  return (
    <AbsoluteFill>
      {/* 0-180: GUT FEELING crossed out */}
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: gutOp }}>
        <div style={{ position: "relative", transform: `scale(${gutScale})` }}>
          <div style={{ fontFamily: fonts.display, fontSize: 130, fontWeight: 900, color: colors.pureWhite, letterSpacing: "-0.02em" }}>
            GUT FEELING
          </div>
          <div style={{ 
            position: "absolute", 
            top: "50%", 
            left: "-5%", 
            width: `${lineDraw * 110}%`, 
            height: 14, 
            background: colors.hcRisk, 
            transform: "translateY(-50%) rotate(-2deg)",
            boxShadow: `0 0 20px ${colors.hcRisk}`,
            borderRadius: 10
          }} />
          <div style={{ 
            textAlign: "center", 
            marginTop: 20,
            color: colors.hcRisk,
            fontSize: 40,
            fontWeight: 700,
            opacity: interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          }}>
            停止直覺式盲選
          </div>
        </div>
      </AbsoluteFill>

      {/* 160-480: BEHAVIORAL INTELLIGENCE */}
      {frame >= 160 && (
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: biOp }}>
          <div style={{ position: "relative", transform: `scale(${biScale}) scale(${camScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontFamily: fonts.display, fontSize: 110, fontWeight: 900, color: colors.hcCyanBright, letterSpacing: "-0.02em", textShadow: `0 0 40px rgba(0,180,216,0.4)` }}>
              BEHAVIORAL INTELLIGENCE
            </div>
            <div style={{ 
              marginTop: 24,
              color: colors.pureWhite,
              fontSize: 42,
              fontWeight: 700,
              opacity: interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
            }}>
              開始科學行為預測
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const S4_Tech: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgCalm theme="dark" tint="blue" />
      
      {/* 0-240: Not replacing HR */}
      <Sequence from={0} durationInFrames={960} layout="none">
        <Statement english="NOT REPLACING HR" chinese="不是取代 HR" start={0} end={240} />
      </Sequence>

      {/* 240-480: Upgrading decisions */}
      <Sequence from={0} durationInFrames={960} layout="none">
        <Statement english="UPGRADING DECISIONS" chinese="而是升級決策" start={240} end={480} />
      </Sequence>

      {/* 480-960: Paradigm Shift (Stop Gut Feeling -> Start Behavioral Intelligence) */}
      <Sequence from={480} durationInFrames={480} layout="none">
        <ParadigmShift />
      </Sequence>
      
    </AbsoluteFill>
  );
};

