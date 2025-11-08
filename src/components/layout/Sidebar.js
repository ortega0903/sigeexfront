import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen }) => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  // Menú según el rol del usuario
  const getMenuItems = () => {
    if (!user) return [];

    const baseItems = [
      { label: 'Dashboard', path: '/dashboard', icon: '📊', roles: ['administrador', 'medico', 'administrativo'] }
    ];

    const adminItems = [
      { label: 'Usuarios', path: '/usuarios', icon: '👥', roles: ['administrador'] },
      { label: 'Roles', path: '/roles', icon: '🔐', roles: ['administrador'] },
      { label: 'Reportes', path: '/reportes', icon: '📈', roles: ['administrador'] }
    ];

    const medicoItems = [
      { label: 'Pacientes', path: '/pacientes', icon: '🏥', roles: ['medico', 'administrativo'] },
      { label: 'Citas', path: '/citas', icon: '📅', roles: ['medico', 'administrativo'] },
      { label: 'Consultas', path: '/consultas', icon: '📋', roles: ['medico'] },
      { label: 'Recetas', path: '/recetas', icon: '💊', roles: ['medico'] },
      { label: 'Órdenes Médicas', path: '/ordenes', icon: '🔬', roles: ['medico'] },
      { label: 'Seguimientos', path: '/seguimientos', icon: '📌', roles: ['medico'] }
    ];

    const allItems = [...baseItems, ...adminItems, ...medicoItems];

    // Filtrar items según el rol del usuario
    return allItems.filter(item => {
      if (!item.roles) return true;
      return item.roles.some(role => 
        user.roles?.some(userRole => userRole.nombre.toLowerCase() === role.toLowerCase())
      );
    });
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <div className={styles.logo}>
        <h2>SIGEEX</h2>
        <p className={styles.logoSubtitle}>Sistema de Gestión de Expedientes</p>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`${styles.navItem} ${router.pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            {isOpen && <span className={styles.label}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isOpen && user && (
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.nombre?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user.nombre || user.username}</p>
            <p className={styles.userRole}>
              {user.roles?.[0]?.nombre || 'Usuario'}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
