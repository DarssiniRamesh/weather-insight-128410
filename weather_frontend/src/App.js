import React from 'react';
import './styles/theme.css';
import './styles/app.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ControlsBar from './components/ControlsBar';
import WeatherGrid from './components/WeatherGrid';

// PUBLIC_INTERFACE
export default function App() {
  /** Root application rendering the pixel-perfect Dark Weather UI.
   * This app follows the provided design notes and style guide for colors, spacing,
   * typography, and component structure. No API calls are made here; static content
   * is rendered to achieve exact visual fidelity with the screenshot.
   */
  return (
    <>
      <div className="canvas-mesh" aria-hidden="true" />
      <div className="canvas-vignette" aria-hidden="true" />

      <header className="container header" role="banner" aria-label="Site header">
        <Header />
      </header>

      <main role="main" aria-label="Main content">
        <section className="container hero" aria-label="Hero">
          <Hero />
        </section>

        <section className="container controls" aria-label="Search and filters">
          <ControlsBar />
        </section>

        <section className="container grid" aria-label="Weather cards">
          <WeatherGrid />
        </section>
      </main>
    </>
  );
}
