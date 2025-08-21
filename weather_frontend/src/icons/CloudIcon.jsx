import React from 'react';

// PUBLIC_INTERFACE
export default function CloudIcon({ size = 108 }) {
  /** Soft cloud shape with subtle gray shadow; positioned overlapping the sun. */
  return (
    <svg viewBox="0 0 140 100" width={size} height={(size * 100) / 140} aria-hidden="true" style={{ position: 'absolute', left: '-24px', top: '20px' }}>
      <defs>
        <linearGradient id="cloudShade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#C7D2DA" />
        </linearGradient>
      </defs>
      <g filter="url(#shadow)">
        <ellipse cx="55" cy="55" rx="32" ry="26" fill="url(#cloudShade)" />
        <ellipse cx="85" cy="48" rx="26" ry="22" fill="url(#cloudShade)" />
        <rect x="35" y="58" width="60" height="24" rx="12" fill="url(#cloudShade)" />
      </g>
    </svg>
  );
}
