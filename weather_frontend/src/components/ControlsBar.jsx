import React, { useState } from 'react';
import SearchIcon from '../icons/SearchIcon';

// PUBLIC_INTERFACE
export default function ControlsBar() {
  /** Controls bar that includes a search input with an icon and filter chips. */
  const [chips, setChips] = useState({
    filters: false,
    coldest: true,
    range: false,
    rainy: false
  });

  const toggle = (key) => {
    setChips((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <>
      <div className="search" role="search">
        <SearchIcon className="icon" />
        <input
          type="text"
          placeholder="Search Here"
          aria-label="Search"
        />
      </div>

      <div className="filters" role="group" aria-label="Filters">
        <button
          type="button"
          className={`chip ${chips.filters ? 'selected' : ''}`}
          onClick={() => toggle('filters')}
          aria-pressed={chips.filters}
        >
          Filters
        </button>
        <button
          type="button"
          className={`chip ${chips.coldest ? 'selected' : ''}`}
          onClick={() => toggle('coldest')}
          aria-pressed={chips.coldest}
        >
          Coldest
          <span aria-hidden="true">▾</span>
        </button>
        <button
          type="button"
          className={`chip ${chips.range ? 'selected' : ''}`}
          onClick={() => toggle('range')}
          aria-pressed={chips.range}
        >
          10°C - 20°C
          <span aria-hidden="true">▾</span>
        </button>
        <button
          type="button"
          className={`chip ${chips.rainy ? 'selected' : ''}`}
          onClick={() => toggle('rainy')}
          aria-pressed={chips.rainy}
        >
          Rainy
          <span aria-hidden="true">▾</span>
        </button>
      </div>
    </>
  );
}
