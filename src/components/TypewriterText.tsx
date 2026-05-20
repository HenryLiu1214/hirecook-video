import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { colors, fonts } from "../tokens";

function lerpColor(a: string, b: string, t: number): string {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.slice(0, 2), 16);
  const ag = parseInt(ah.slice(2, 4), 16);
  const ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16);
  const bg = parseInt(bh.slice(2, 4), 16);
  const bb = parseInt(bh.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const blue = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${blue})`;
}

type ColorScheme =
  | "white"
  | "white-to-purple"
  | "white-to-cyan"
  | "purple"
  | "white-to-blue"
  | "orange"
  | "plum-to-pink";

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  /** frames between each character beginning its entrance (higher = slower) */
  charStagger?: number;
  fontSize: number;
  fontWeight?: number;
  letterSpacing?: string;
  colorScheme?: ColorScheme;
  showCursor?: boolean;
  align?: "left" | "center" | "right";
  lineHeight?: number;
  /** softer per-char motion (used inside pills / small UI) */
  subtle?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  charStagger = 4,
  fontSize,
  fontWeight = 800,
  letterSpacing = "-2px",
  colorScheme = "white",
  showCursor = false,
  align = "center",
  lineHeight = 1.05,
  subtle = false,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  const chars = text.split("");

  const popEm = subtle ? 0.14 : 0.42;
  const scaleFrom = subtle ? 0.72 : 0.4;

  const getColor = (i: number): string => {
    const ratio = chars.length > 1 ? i / (chars.length - 1) : 0;
    switch (colorScheme) {
      case "white":
        return colors.pureWhite;
      case "purple":
        return "#2151F5";
      case "orange":
        return colors.alertOrange;
      case "white-to-purple":
        if (ratio < 0.45) return colors.pureWhite;
        return lerpColor("#FFFFFF", "#2151F5", (ratio - 0.45) / 0.55);
      case "white-to-blue":
        if (ratio < 0.45) return colors.pureWhite;
        return lerpColor("#FFFFFF", "#2151F5", (ratio - 0.45) / 0.55);
      case "white-to-cyan":
        if (ratio < 0.45) return colors.pureWhite;
        return lerpColor("#FFFFFF", "#00B4D8", (ratio - 0.45) / 0.55);
      case "plum-to-pink":
        if (ratio < 0.5) return lerpColor("#09173A", "#2151F5", ratio * 2);
        return lerpColor("#2151F5", "#00B4D8", (ratio - 0.5) * 2);
      default:
        return colors.pureWhite;
    }
  };

  const lastCharSettleFrame = (chars.length - 1) * charStagger + 16;
  const allDone = elapsed > lastCharSettleFrame;
  const cursorBlink = Math.floor(frame / 16) % 2 === 0;

  return (
    <div
      style={{
        textAlign: align,
        fontFamily: fonts.display,
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
        whiteSpace: "pre-wrap",
      }}
    >
      {chars.map((char, i) => {
        if (char === "\n") return <br key={i} />;
        const ce = elapsed - i * charStagger;
        const op = interpolate(ce, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ty = interpolate(ce, [0, 13], [popEm, 0], {
          easing: Easing.out(Easing.back(1.6)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const sc = interpolate(ce, [0, 15], [scaleFrom, 1], {
          easing: Easing.out(Easing.back(1.5)),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: op,
              transform: `translateY(${ty}em) scale(${sc})`,
              color: getColor(i),
            }}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
      {showCursor && !allDone && elapsed >= 0 && (
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            height: "0.82em",
            verticalAlign: "middle",
            background: "#2151F5",
            marginLeft: "0.04em",
            opacity: cursorBlink ? 1 : 0.2,
          }}
        />
      )}
    </div>
  );
};
