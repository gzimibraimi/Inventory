import './Table.css';

const Table = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange
}) => {
  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleSelectAll = (checked) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange(data.map((_, index) => index));
      } else {
        onSelectionChange([]);
      }
    }
  };

  const handleSelectRow = (index, checked) => {
    if (onSelectionChange) {
      if (checked) {
        onSelectionChange([...selectedRows, index]);
      } else {
        onSelectionChange(selectedRows.filter(i => i !== index));
      }
    }
  };

  const tableClasses = [
    'table',
    className
  ].filter(Boolean).join(' ');

  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-spinner">⟳</div>
        <span>Loading...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <span>{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className={tableClasses}>
        <thead>
          <tr>
            {selectable && (
              <th className="table-select-column">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th key={column.key || index} className={column.className || ''}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={onRowClick ? 'table-row-clickable' : ''}
              onClick={() => handleRowClick(row, rowIndex)}
            >
              {selectable && (
                <td className="table-select-column">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(rowIndex)}
                    onChange={(e) => handleSelectRow(rowIndex, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td key={column.key || colIndex} className={column.className || ''}>
                  {column.render ? column.render(row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;