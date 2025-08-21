import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** Header component containing brand, navigation links, and signup CTA. */
  return (
    <>
      <div className="brand">Dark Weather</div>
      <nav className="nav" aria-label="Primary">
        <a href="#home">Home</a>
        <a href="#download">Download App</a>
        <a href="#contact">Contact us</a>
      </nav>
      <div>
        <button type="button" className="signup">Sign up</button>
      </div>
    </>
  );
}
