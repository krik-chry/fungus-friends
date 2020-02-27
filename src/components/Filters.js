import React from 'react';
import Select from 'react-select';
import { Button } from '@material-ui/core';
import '../styles/Filters.css';

function Filters(props) {
  const {
    colorOptions,
    spotsOptions,
    handleColorSelection,
    handleSpotsSelection,
    onClear
  } = props;
  const { filteredMushrooms, selectedColor, selectedSpots } = props.state;
  return (
    <div className="filters">
      <h1>Fungus Friends App</h1>
      <p id="app-description">
        All kinds of fungus can be found in the garden of SpronQ. Check them out
        on the map and filter them below
        <span role="img" aria-label="below">
          👇🏼
        </span>
      </p>

      {/* Results description that checks for number,color and spots of found mushrooms */}
      {filteredMushrooms.length !== 0 && (
        <h3>
          We found {filteredMushrooms.length}{' '}
          {selectedColor !== 'Select color...' && (
            <span>{selectedColor.label}</span>
          )}{' '}
          {filteredMushrooms.length === 1 ? (
            <spam>mushroom</spam>
          ) : (
            <span>mushrooms</span>
          )}{' '}
          {selectedSpots !== 'Select spots...' && (
            <span>with {selectedSpots.label} spots</span>
          )}{' '}
          <span role="img" aria-label="mushroom">
            🍄
          </span>
        </h3>
      )}

      {/* When promise returns a response (Mushrooms array), display the filters */}
      {filteredMushrooms.length !== 0 ? (
        <div className="filters-area">
          <div className="color-filter">
            <p className="filter-title">Color</p>

            <div className="color-options">
              <Select
                value={selectedColor}
                placeholder={selectedColor}
                options={colorOptions}
                onChange={handleColorSelection}
              ></Select>
              <Button variant="contained" onClick={() => onClear('color')}>
                Clear
              </Button>
            </div>
          </div>

          <div className="spots-filter">
            <p className="filter-title">Spots</p>

            <div className="spots-options">
              <Select
                value={selectedSpots}
                placeholder={selectedSpots}
                options={spotsOptions}
                onChange={handleSpotsSelection}
              ></Select>
              <Button variant="contained" onClick={() => onClear('spots')}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <h3 id="loading-text">Loading some mushrooms....</h3>
      )}
    </div>
  );
}

export default Filters;
