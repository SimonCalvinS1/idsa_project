/**
 * Utility functions for loading and processing debt data
 */

export const loadDebtData = async (country = 'India') => {
  try {
    // Try multiple paths for flexibility
    let response = await fetch(`${process.env.PUBLIC_URL}/data/${country.toLowerCase()}_debt_data.json`);
    
    if (!response.ok) {
      // Fallback to root data path
      response = await fetch(`/data/${country.toLowerCase()}_debt_data.json`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to load data for ${country}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const getYearRange = (data) => {
  if (!data || !data.debts || data.debts.length === 0) return { min: null, max: null };
  const years = data.debts.map(d => d.year);
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  };
};

export const filterDataByYearRange = (data, startYear, endYear) => {
  if (!data || !data.debts) return [];
  return data.debts.filter(d => d.year >= startYear && d.year <= endYear);
};

export const getDebtMetrics = (data) => {
  if (!data || !data.debts) return [];
  
  const metrics = [];
  const firstRecord = data.debts[0];
  
  if (firstRecord) {
    Object.keys(firstRecord).forEach(key => {
      if (key !== 'year' && key !== 'country') {
        // Convert snake_case to readable format
        const readable = key
          .replace(/_percent_gdp$/, ' (% of GDP)')
          .replace(/_billions$/, ' (Billions)')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        metrics.push({ key, readable });
      }
    });
  }
  
  return metrics;
};

export const calculateTrend = (dataArray, metricKey) => {
  const validData = dataArray.filter(d => d[metricKey] !== null && d[metricKey] !== undefined);
  if (validData.length < 2) return null;
  
  const firstValue = validData[0][metricKey];
  const lastValue = validData[validData.length - 1][metricKey];
  const change = lastValue - firstValue;
  const percentChange = (change / firstValue) * 100;
  
  return {
    firstValue,
    lastValue,
    change,
    percentChange
  };
};
