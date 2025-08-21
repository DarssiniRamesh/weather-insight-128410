import React from 'react';
import SunIcon from '../icons/SunIcon';
import CloudIcon from '../icons/CloudIcon';
import RainIcon from '../icons/RainIcon';

// PUBLIC_INTERFACE
export default function WeatherCard({ city, temp, wind, time, cond, variant }) {
  /** Single weather card: floating weather icon, city+temp row, meta lines, and condition badge. */
  const isCool = city === 'Gilan';
  return (
    <article className="card" aria-label={`${city} weather card`}>
      <div className="iconWrap" aria-hidden="true">
        {variant === 'sunny' && <SunIcon />}
        {variant === 'cloudy' && (
          <>
            <SunIcon />
            <CloudIcon />
          </>
        )}
        {variant === 'rainy' && (
          <>
            <SunIcon />
            <CloudIcon />
            <RainIcon />
          </>
        )}
      </div>

      <div className="titleRow">
        <div className="city">{city}</div>
        <div className={`temp ${isCool ? 'cool' : ''}`}>{temp}</div>
      </div>
      <div className="meta">
        <div>wind speed: {wind}</div>
        <div>{time}</div>
      </div>
      <div className="badge" aria-label="Condition">{cond}</div>
    </article>
  );
}
