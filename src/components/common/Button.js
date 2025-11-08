import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary', // primary, secondary, danger, success
  size = 'medium', // small, medium, large
  disabled = false,
  fullWidth = false,
  icon,
  className = ''
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]} 
        ${fullWidth ? styles.fullWidth : ''}
        ${className}
      `}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
