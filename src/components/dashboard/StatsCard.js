import styles from './StatsCard.module.css';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'blue' }) => {
  return (
    <div className={`${styles.statsCard} ${styles[color]}`}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
        {trend && (
          <div className={`${styles.trend} ${styles[trend]}`}>
            <span className={styles.trendIcon}>
              {trend === 'up' ? '↑' : '↓'}
            </span>
            <span className={styles.trendValue}>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
