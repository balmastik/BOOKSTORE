import React, { useState, useEffect, useRef } from 'react';

interface FilterProps {
  onApplyFilter: (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => void;
  onClearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({ onApplyFilter, onClearFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [yearMin, setYearMin] = useState(1800);
  const [yearMax, setYearMax] = useState(2025);

  const priceTrackRef = useRef<HTMLDivElement>(null);
  const yearTrackRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceMin(Number(e.target.value));
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceMax(Number(e.target.value));
  };

  const handleYearMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearMin(Number(e.target.value));
  };

  const handleYearMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYearMax(Number(e.target.value));
  };

  const applyFilters = () => {
    onApplyFilter(priceMin, priceMax, yearMin, yearMax);
  };

  const fillColor = () => {

    const startingPriceMin = 0;
    const startingPriceMax = 100;
    const priceDifference = startingPriceMax - startingPriceMin;
    const startingYearMin = 1800;
    const startingYearMax = 2025;
    const yearDifference = startingYearMax - startingYearMin;

    const percent1 = ((priceMin - startingPriceMin) / priceDifference) * 100;
    const percent2 = ((priceMax - startingPriceMin) / priceDifference) * 100;
    const percent3 = ((yearMin - startingYearMin) / yearDifference) * 100;
    const percent4 = ((yearMax - startingYearMin) / yearDifference) * 100;

    if (priceTrackRef.current && yearTrackRef.current) {
      priceTrackRef.current.style.background = `linear-gradient(to right, #ccc ${percent1}%, #f99462 ${percent1}%, #f99462 ${percent2}%, #ccc ${percent2}%)`;
      yearTrackRef.current.style.background = `linear-gradient(to right, #ccc ${percent3}%, #f99462 ${percent3}%, #f99462 ${percent4}%, #ccc ${percent4}%)`;
    }
  };

  useEffect(() => {
    fillColor();
  }, [priceMin, priceMax, yearMin, yearMax]);

  const clearFilters = () => {
    setPriceMin(0);
    setPriceMax(100);
    setYearMin(1800);
    setYearMax(2025);
    onClearFilter();
  };

  return (
    <div className={`filter-panel ${isOpen ? 'open' : ''}`}>
      <button className="filter-panel-close" onClick={toggleFilter}>X</button>
      <div className="filter-content">
        <h2>Filter</h2>
        <div className="range">
          <label htmlFor="price-range-container" className="range-label">PRICE RANGE</label>
          <div className="range-values">
            <span className="price-range-min">{priceMin} €</span>
            <span className="price-range-max">{priceMax} €</span>
          </div>
          <div className="range-container">
            <div ref={priceTrackRef} className="price-track"></div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceMin}
              onChange={handlePriceMinChange}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceMax}
              onChange={handlePriceMaxChange}
            />
          </div>
        </div>

        <div className="range">
          <label htmlFor="year-range-container" className="range-label">PUBLICATION DATE</label>
          <div className="range-values">
            <span className="year-range-min">{yearMin}</span>
            <span className="year-range-max">{yearMax}</span>
          </div>
          <div className="range-container">
            <div ref={yearTrackRef} className="year-track"></div>
            <input
              type="range"
              min="1800"
              max="2025"
              value={yearMin}
              onChange={handleYearMinChange}
            />
            <input
              type="range"
              min="1800"
              max="2025"
              value={yearMax}
              onChange={handleYearMaxChange}
            />
          </div>
        </div>

        <div className="filter-button">
          <button className="filter-button-clear" onClick={clearFilters}>Clear</button>
          <button className="filter-button-apply" onClick={applyFilters}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
