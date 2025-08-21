import React from 'react';
import WeatherCard from './WeatherCard';

// PUBLIC_INTERFACE
export default function WeatherGrid() {
  /** Grid wrapper that renders the three weather cards per the screenshot text. */
  const data = [
    { city: 'Tehran', temp: '35°C', wind: '3 km', time: 'Tuesday 15:52', cond: 'Cloudy', variant: 'cloudy' },
    { city: 'Qom', temp: '41°C', wind: '2 km', time: 'Tuesday 15:52', cond: 'Sunny', variant: 'sunny' },
    { city: 'Gilan', temp: '23°C', wind: '23 km', time: 'Tuesday 15:52', cond: 'Rainy', variant: 'rainy' },
  ];

  return (
    <>
      {data.map((c) => (
        <WeatherCard key={c.city} {...c} />
      ))}
    </>
  );
}
