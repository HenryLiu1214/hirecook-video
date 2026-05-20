import React from "react";

interface BgCalmProps {
  theme: "light" | "dark";
  tint?: "blue" | "cyan" | "green" | "none";
  /** override dot lattice opacity (defaults: 0.55 light / 0.4 dark) */
  dotOpacity?: number;
}

export const BgCalm: React.FC<BgCalmProps> = ({ theme, tint = "none", dotOpacity }) => {
  const isLight = theme === "light";
  const baseColor = isLight ? "#FFFFFF" : "#0E121C";
  const dotColor = isLight ? "rgba(33,81,245,0.10)" : "rgba(111,227,245,0.10)";
  const lumOp = isLight ? 0.06 : 0.10;
  const tintRgb = tint === "blue" ? "33,81,245"
                : tint === "cyan" ? "0,180,216"
                : tint === "green" ? "27,122,77"
                : null;
  const ratio = dotOpacity ?? (isLight ? 0.55 : 0.4);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: baseColor }} />
      {tintRgb && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 50% -10%, rgba(${tintRgb},${lumOp}) 0%, transparent 70%)`,
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        opacity: ratio,
        backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, #000 35%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, #000 35%, transparent 100%)",
      }} />
    </div>
  );
};
