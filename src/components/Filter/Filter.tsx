import React, {useState, useEffect, useRef} from 'react';
import styles from './Filter.module.css';

interface FilterProps {
  isOpen: boolean;
  onCloseFilter: () => void;
  onApplyFilter: (priceMin: number, priceMax: number, yearMin: number, yearMax: number) => void;
  onClearFilter: () => void;
}

const Filter: React.FC<FilterProps> = ({isOpen, onCloseFilter, onApplyFilter, onClearFilter}) => {
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);
  const [yearMin, setYearMin] = useState(1800);
  const [yearMax, setYearMax] = useState(2025);

  const priceTrackRef = useRef<HTMLDivElement>(null);
  const yearTrackRef = useRef<HTMLDivElement>(null);

  const minGap = 1;

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > priceMax - minGap) {
      value = priceMax - minGap;
    }
    setPriceMin(value);
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < priceMin + minGap) {
      value = priceMin + minGap;
    }
    setPriceMax(value);
  };

  const handleYearMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > yearMax - minGap) {
      value = yearMax - minGap;
    }
    setYearMin(value);
  };

  const handleYearMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < yearMin + minGap) {
      value = yearMin + minGap;
    }
    setYearMax(value);
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
    <div className={`${styles.filterPanel} ${isOpen ? styles.open : ''}`}>

      <button className={styles.filterPanelClose} onClick={onCloseFilter}>X</button>

      <div className={styles.filterContent}>
        <h2 className={styles.filterTitle}>Filter</h2>

        <div className={styles.range}>
          <label htmlFor="price-range-container" className={styles.rangeLabel}>PRICE RANGE</label>

          <div className={styles.rangeValues}>
            <span>{priceMin} €</span>
            <span>{priceMax} €</span>
          </div>

          <div id="price-range-container" className={styles.rangeContainer}>
            <div ref={priceTrackRef} className={styles.priceTrack}></div>
            <input
              type="range"
              className={styles.filterInput}
              min="0"
              max="100"
              value={priceMin}
              onChange={handlePriceMinChange}
            />

            <input
              type="range"
              className={styles.filterInput}
              min="0"
              max="100"
              value={priceMax}
              onChange={handlePriceMaxChange}
            />
          </div>
        </div>

        <div className={styles.range}>
        <label htmlFor="year-range-container" className={styles.rangeLabel}>PUBLICATION DATE</label>
          <div className={styles.rangeValues}>
            <span>{yearMin}</span>
            <span>{yearMax}</span>
          </div>

          <div id="year-range-container" className={styles.rangeContainer}>
            <div ref={yearTrackRef} className={styles.yearTrack}></div>
            <input
              type="range"
              className={styles.filterInput}
              min="1800"
              max="2025"
              value={yearMin}
              onChange={handleYearMinChange}
            />

            <input
              type="range"
              className={styles.filterInput}
              min="1800"
              max="2025"
              value={yearMax}
              onChange={handleYearMaxChange}
            />
          </div>
        </div>

        <div className={styles.filterButton}>
          <button className={styles.filterButtonClear} onClick={clearFilters}>Clear</button>
          <button className={styles.filterButtonApply} onClick={applyFilters}>Apply</button>
        </div>

      </div>
    </div>
  );
};

export default Filter;
