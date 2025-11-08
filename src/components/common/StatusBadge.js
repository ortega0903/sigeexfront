import styles from './StatusBadge.module.css';

const StatusBadge = ({ 
  status, 
  label, 
  variant = 'default' // default, success, warning, danger, info
}) => {
  const getVariant = () => {
    if (variant !== 'default') return variant;
    
    // Auto-detectar variante según el status
    const statusLower = String(status).toLowerCase();
    
    if (statusLower === 'activo' || statusLower === 'active' || status === true) {
      return 'success';
    }
    if (statusLower === 'inactivo' || statusLower === 'inactive' || status === false) {
      return 'danger';
    }
    if (statusLower === 'pendiente' || statusLower === 'pending') {
      return 'warning';
    }
    
    return 'info';
  };

  const displayLabel = label || String(status);
  const variantClass = getVariant();

  return (
    <span className={`${styles.badge} ${styles[variantClass]}`}>
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
