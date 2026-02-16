import React, { useState } from 'react';

const DataVisualization = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [yearRange, setYearRange] = useState({ start: null, end: null });

  if (!data || !data.debts || data.debts.length === 0) {
    return <div className="visualization">No data available</div>;
  }

  // Get all unique metrics from all records (handles sparse data)
  const metricSet = new Set();
  data.debts.forEach(record => {
    Object.keys(record).forEach(key => {
      if (key !== 'year') {
        metricSet.add(key);
      }
    });
  });
  const metrics = Array.from(metricSet)
    .sort()
    .map(key => ({
      key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));

  const minYear = Math.min(...data.debts.map(d => d.year));
  const maxYear = Math.max(...data.debts.map(d => d.year));

  return (
    <div className="visualization">
      <h2>Data Visualization</h2>
      
      <div className="controls">
        <div className="metric-selector">
          <label>Select Metric:</label>
          <select value={selectedMetric || ''} onChange={(e) => setSelectedMetric(e.target.value || null)}>
            <option value="">-- Select Metric --</option>
            {metrics.map(metric => (
              <option key={metric.key} value={metric.key}>
                {metric.label}
              </option>
            ))}
          </select>
        </div>

        <div className="year-range">
          <label>Year Range:</label>
          <input 
            type="number" 
            min={minYear} 
            max={maxYear}
            value={yearRange.start || minYear}
            onChange={(e) => setYearRange({ ...yearRange, start: parseInt(e.target.value) })}
            placeholder="Start Year"
          />
          <span>-</span>
          <input 
            type="number" 
            min={minYear} 
            max={maxYear}
            value={yearRange.end || maxYear}
            onChange={(e) => setYearRange({ ...yearRange, end: parseInt(e.target.value) })}
            placeholder="End Year"
          />
        </div>
      </div>

      {selectedMetric && (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>{metrics.find(m => m.key === selectedMetric)?.label}</th>
              </tr>
            </thead>
            <tbody>
              {data.debts
                .filter(d => d.year >= (yearRange.start || minYear) && d.year <= (yearRange.end || maxYear))
                .map(record => {
                  const value = record[selectedMetric];
                  const displayValue = value === null || value === undefined ? 'N/A' : (typeof value === 'number' ? value.toFixed(2) : value);
                  return (
                    <tr key={record.year}>
                      <td>{record.year}</td>
                      <td>{displayValue}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      <div className="data-info">
        <p><strong>Country:</strong> {data.country}</p>
        <p><strong>Data Source:</strong> {data.dataSource}</p>
        <p><strong>Total Records:</strong> {data.debts.length}</p>
      </div>
    </div>
  );
};

export default DataVisualization;
