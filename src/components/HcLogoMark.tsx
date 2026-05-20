import React from "react";

interface HcLogoMarkProps {
  size?: number;
}

export const HcLogoMark: React.FC<HcLogoMarkProps> = ({ size = 64 }) => {
  const id = `hcLogoGlow-${size}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width={size} height={size} fill="none">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6FE3F5" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#2151F5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2151F5" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="6" stroke="#2151F5" strokeWidth="1.5" opacity="0.55" />
      <g fill="#2151F5" opacity="0.45">
        <circle cx="16" cy="16" r="1.6" />
        <circle cx="32" cy="16" r="1.6" />
        <circle cx="48" cy="16" r="1.6" />
        <circle cx="16" cy="32" r="1.6" />
        <circle cx="48" cy="32" r="1.6" />
        <circle cx="16" cy="48" r="1.6" />
        <circle cx="32" cy="48" r="1.6" />
        <circle cx="48" cy="48" r="1.6" />
      </g>
      <circle cx="32" cy="32" r="14" fill={`url(#${id})`} />
      <rect x="12" y="12" width="8" height="8" rx="1.5" fill="#2151F5" />
      <rect x="44" y="44" width="8" height="8" rx="1.5" fill="#2151F5" />
      <path d="M20 20 L32 32 L44 44" stroke="#00B4D8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="32" r="3.4" fill="#FFFFFF" stroke="#00B4D8" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="1.2" fill="#00B4D8" />
    </svg>
  );
};
