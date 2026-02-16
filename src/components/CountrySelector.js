import React from 'react';

const CountrySelector = ({ countries, selectedCountry, onCountryChange }) => {
  return (
    <div className="country-selector">
      <label htmlFor="country-select">Please Select a Country</label>
      <select 
        id="country-select"
        value={selectedCountry} 
        onChange={(e) => onCountryChange(e.target.value)}
      >
        <option value="">-- Select Country --</option>
        {countries.map(country => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;
