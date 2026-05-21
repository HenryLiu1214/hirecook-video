import React from "react";
import { Composition, Series, AbsoluteFill, Audio, staticFile, interpolate } from "remotion";
import { FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT, SCENES } from "./tokens";
import { S0_Intro } from "./scenes/S0_Intro";
import { S1_PainPoints } from "./scenes/S1_PainPoints";
import { S2_Science } from "./scenes/S2_Science";
import { S3_DIT } from "./scenes/S3_DIT";
import { S4_Tech } from "./scenes/S4_Tech";
import { S5_CTA } from "./scenes/S5_CTA";

const HireCookVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio
        src={staticFile("雲端啟動.mp3")}
        volume={(f) => {
          // Fade-in over first 2s (120f), fade-out over last 4s (240f)
          const fadeIn  = interpolate(f, [0, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(f, [DURATION_IN_FRAMES - 240, DURATION_IN_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return 0.30 * Math.min(fadeIn, fadeOut);
        }}
      />
      <Series>
        <Series.Sequence durationInFrames={SCENES.s0.end - SCENES.s0.start}>
          <S0_Intro />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.s1.end - SCENES.s1.start} offset={SCENES.s1.start - SCENES.s0.end}>
          <S1_PainPoints />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.s2.end - SCENES.s2.start} offset={SCENES.s2.start - SCENES.s1.end}>
          <S2_Science />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.s3.end - SCENES.s3.start} offset={SCENES.s3.start - SCENES.s2.end}>
          <S3_DIT />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.s4.end - SCENES.s4.start} offset={SCENES.s4.start - SCENES.s3.end}>
          <S4_Tech />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENES.s5.end - SCENES.s5.start} offset={SCENES.s5.start - SCENES.s4.end}>
          <S5_CTA />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full 3-minute competition cut */}
      <Composition
        id="HireCook"
        component={HireCookVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />

      {/* Individual scene previews */}
      <Composition
        id="S0-Intro"
        component={S0_Intro}
        durationInFrames={SCENES.s0.end - SCENES.s0.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="S1-PainPoints"
        component={S1_PainPoints}
        durationInFrames={SCENES.s1.end - SCENES.s1.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="S2-Science"
        component={S2_Science}
        durationInFrames={SCENES.s2.end - SCENES.s2.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="S3-DIT"
        component={S3_DIT}
        durationInFrames={SCENES.s3.end - SCENES.s3.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="S4-Tech"
        component={S4_Tech}
        durationInFrames={SCENES.s4.end - SCENES.s4.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="S5-CTA"
        component={S5_CTA}
        durationInFrames={SCENES.s5.end - SCENES.s5.start}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
