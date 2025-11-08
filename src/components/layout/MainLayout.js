import TopBar from './TopBar';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <TopBar />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
