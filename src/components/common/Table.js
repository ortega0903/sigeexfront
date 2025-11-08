import styles from './Table.module.css';

const Table = ({ 
  columns, // [{ key, label, render }]
  data, 
  actions,
  onRowClick,
  emptyMessage = 'No hay datos para mostrar'
}) => {
  return (
    <div className={styles.tableWrapper}>
      {!data || data.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📋</p>
          <p className={styles.emptyText}>{emptyMessage}</p>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {actions && actions.length > 0 && (
                <th>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row?.id || index}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? styles.clickable : ''}
              >
                {columns.map((column) => (
                  <td key={`${row?.id || index}-${column.key}`}>
                    {column.render 
                      ? column.render(row) 
                      : (row?.[column.key] ?? '—')
                    }
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className={styles.actions}>
                    {actions.map((action, actionIndex) => {
                      const label = typeof action.label === 'function' 
                        ? action.label(row) 
                        : action.label;
                      const variant = typeof action.variant === 'function'
                        ? action.variant(row)
                        : action.variant;
                      
                      return (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick?.(row);
                          }}
                          className={`${styles.actionButton} ${styles[variant] || ''}`}
                          disabled={action.disabled}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
