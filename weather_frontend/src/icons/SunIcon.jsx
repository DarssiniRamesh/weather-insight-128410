import React from 'react';

// PUBLIC_INTERFACE
export default function SunIcon({ size = 108 }) {
  /** Radial gradient sun per design: warning to warning-2, with soft blur glow. */
  const glow = {
    filter: 'blur(16px)',
    opacity: 0.35,
  };
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDBA21" />
          <stop offset="100%" stopColor="#FF8C1A" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="34" fill="url(#sunGrad)" />
      <circle cx="60" cy="60" r="48" fill="#FFB849" style={glow} />
    </svg>
  );
}
