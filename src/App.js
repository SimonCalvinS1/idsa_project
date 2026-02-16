import React, { useState, useEffect } from 'react';
import './App.css';
import CountrySelector from './components/CountrySelector';
import DataVisualization from './components/DataVisualization';
import DataTable from './components/DataTable';
import { loadDebtData } from './utils/dataLoader';

function App() {
  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('visualization'); // 'visualization' or 'table'

  const countries = ['India', 'United States', 'United Kingdom', 'Germany', 'France', 'Japan'];

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCountry) return;
      
      setLoading(true);
      setError(null);
      try {
        const result = await loadDebtData(selectedCountry);
        if (result) {
          setData(result);
        } else {
          setError(`Failed to load data for ${selectedCountry}`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>International Debt Statistics Analysis</h1>
        <p>Analyze global debt trends by country</p>
      </header>

      <main className="App-main">
        <CountrySelector 
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading data...</div>}

        {data && (
          <>
            <div className="view-toggle">
              <button 
                className={view === 'visualization' ? 'active' : ''}
                onClick={() => setView('visualization')}
              >
                Visualization
              </button>
              <button 
                className={view === 'table' ? 'active' : ''}
                onClick={() => setView('table')}
              >
                Data Table
              </button>
            </div>

            {view === 'visualization' && <DataVisualization data={data} />}
            {view === 'table' && <DataTable data={data} />}
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>Source: International Debt Statistics Database</p>
      </footer>
    </div>
  );
}

export default App;
