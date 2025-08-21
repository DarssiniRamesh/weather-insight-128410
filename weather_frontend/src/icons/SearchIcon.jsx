import React from 'react';

// PUBLIC_INTERFACE
export default function SearchIcon({ className }) {
  /** 16px magnifier icon with ~1.5px stroke, muted color. */
  return (
    <svg className={className} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
