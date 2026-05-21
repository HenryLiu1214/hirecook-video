// Atoms.jsx — small primitives shared across screens. Globals: Eyebrow, Button, Chip, KPI, Card, IconBtn, Sparkline.
const { useState } = React;

function Eyebrow({ children, signal, style }) {
  return (
    <div className="hc-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...style }}>
      {signal && <span className="hc-signal-dot" aria-hidden="true"></span>}
      {children}
    </div>
  );
}

function Button({ variant = "secondary", size = "md", icon, children, onClick, disabled }) {
  const cls = `hc-btn hc-btn--${variant} hc-btn--${size}`;
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      {icon && <i data-lucide={icon} className="hc-btn__icon" aria-hidden="true"></i>}
      {children}
    </button>
  );
}

function Chip({ status = "neutral", icon, dot, children }) {
  return (
    <span className={`hc-chip hc-chip--${status}`}>
      {dot && <span className="hc-chip__dot"></span>}
      {icon && <i data-lucide={icon} aria-hidden="true"></i>}
      {children}
    </span>
  );
}

function Card({ children, padding = 20, style, className = "" }) {
  return (
    <div className={`hc-card ${className}`} style={{ padding, ...style }}>
      {children}
    </div>
  );
}

function KPI({ eyebrow, value, unit, sub, delta, signal }) {
  const deltaCls = delta && delta.startsWith("-") ? "hc-delta hc-delta--down" : "hc-delta hc-delta--up";
  const arrow = delta && delta.startsWith("-") ? "↘" : "↗";
  return (
    <Card>
      <Eyebrow signal={signal}>{eyebrow}</Eyebrow>
      <div className="hc-kpi__num">
        <span>{value}</span>
        {unit && <span className="hc-kpi__unit">{unit}</span>}
      </div>
      <div className="hc-kpi__meta">
        {sub && <span>{sub}</span>}
        {delta && <span className={deltaCls}>{arrow} {delta.replace("-", "")}</span>}
      </div>
    </Card>
  );
}

function IconBtn({ icon, label, active, onClick }) {
  return (
    <button className={`hc-iconbtn ${active ? "is-active" : ""}`} aria-label={label} onClick={onClick}>
      <i data-lucide={icon}></i>
    </button>
  );
}

// Mini sparkline using SVG.
function Sparkline({ data, height = 28, accent = "#2151F5" }) {
  const w = 120;
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / (max - min || 1)) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true">
      <polyline points={pts} fill="none" stroke={accent} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, { Eyebrow, Button, Chip, Card, KPI, IconBtn, Sparkline });
