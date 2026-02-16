import React, { useState } from 'react';

const DataTable = ({ data, maxRows = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || !data.debts || data.debts.length === 0) {
    return <div>No data to display</div>;
  }

  const totalPages = Math.ceil(data.debts.length / maxRows);
  const startIdx = (currentPage - 1) * maxRows;
  const paginatedData = data.debts.slice(startIdx, startIdx + maxRows);

  // Get all unique columns from all records (handles sparse data)
  const allColumnSet = new Set();
  data.debts.forEach(record => {
    Object.keys(record).forEach(key => {
      if (key !== 'year') {
        allColumnSet.add(key);
      }
    });
  });
  const columns = Array.from(allColumnSet).sort();

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Year</th>
            {columns.map(col => (
              <th key={col} title={col}>
                {col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).substring(0, 20)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(record => (
            <tr key={record.year}>
              <td><strong>{record.year}</strong></td>
              {columns.map(col => (
                <td key={`${record.year}-${col}`}>
                  {record[col] === null || record[col] === undefined ? '-' : record[col].toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          First
        </button>
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default DataTable;
