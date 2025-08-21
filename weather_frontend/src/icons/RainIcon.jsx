import React from 'react';

// PUBLIC_INTERFACE
export default function RainIcon({ size = 108 }) {
  /** Blue rain drops under the cloud, subtle opacity. */
  const w = size;
  const h = (size * 100) / 140;
  return (
    <svg viewBox="0 0 140 100" width={w} height={h} aria-hidden="true" style={{ position: 'absolute', left: '-10px', top: '60px' }}>
      <g stroke="#8EC6FF" strokeWidth="3" strokeLinecap="round" opacity="0.9">
        <line x1="30" y1="20" x2="30" y2="36" />
        <line x1="50" y1="26" x2="50" y2="42" />
        <line x1="70" y1="20" x2="70" y2="36" />
        <line x1="90" y1="26" x2="90" y2="42" />
      </g>
    </svg>
  );
}
