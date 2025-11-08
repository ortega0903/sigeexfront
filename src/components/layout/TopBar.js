import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';
import styles from './TopBar.module.css';

const TopBar = () => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const navItems = [
    { path: '/dashboard', label: 'Inicio' },
    { 
      label: 'Administración',
      dropdown: [
        { path: '/usuarios', label: 'Usuarios' },
        { path: '/roles', label: 'Roles' },
        { path: '/especialidades', label: 'Especialidades' },
        { path: '/personal', label: 'Personal' },
        { path: '/medicos', label: 'Médicos' },
      ]
    },
    { 
      label: 'Pacientes',
      dropdown: [
        { path: '/pacientes', label: 'Lista de Pacientes' },
        { path: '/historia_clinica', label: 'Historia Clínica' },
        { path: '/seguimientos', label: 'Seguimientos' },
        { path: '/adjuntos', label: 'Documentos' },
      ]
    },
    { 
      label: 'Atención Médica',
      dropdown: [
        { path: '/citas', label: 'Citas' },
        { path: '/consultas', label: 'Consultas' },
        { path: '/diagnosticos', label: 'Diagnósticos' },
        { path: '/recetas', label: 'Recetas' },
      ]
    },
    { 
      label: 'Laboratorio',
      dropdown: [
        { path: '/ordenes', label: 'Órdenes' },
        { path: '/resultados', label: 'Resultados' },
      ]
    },
  ];

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <h1 className={styles.logoText}>SIGEEX</h1>
          <p className={styles.logoSubtext}>Sistema de Gestión de Expedientes</p>
        </div>

        {/* Navegación principal */}
        <nav className={styles.mainNav}>
          {navItems.map((item, index) => {
            // Simple link (no dropdown)
            if (item.path) {
              const isActive = router.pathname.startsWith(item.path);
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                >
                  {item.label}
                </Link>
              );
            }
            
            // Dropdown menu
            const dropdownKey = `dropdown-${index}`;
            const isDropdownActive = activeDropdown === dropdownKey;
            const hasActiveRoute = item.dropdown?.some(subItem => 
              router.pathname.startsWith(subItem.path)
            );
            
            return (
              <div key={dropdownKey} className={styles.navDropdown}>
                <button 
                  className={`${styles.navLink} ${hasActiveRoute ? styles.active : ''}`}
                  onClick={() => toggleDropdown(dropdownKey)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {item.label}
                  <span style={{ fontSize: '10px', transition: 'transform 0.2s', transform: isDropdownActive ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ▼
                  </span>
                </button>
                
                {isDropdownActive && (
                  <div className={styles.dropdownMenu}>
                    {item.dropdown.map((subItem) => {
                      const isSubActive = router.pathname.startsWith(subItem.path);
                      return (
                        <Link 
                          key={subItem.path} 
                          href={subItem.path}
                          className={`${styles.dropdownItem} ${isSubActive ? styles.dropdownItemActive : ''}`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className={styles.rightSection}>
        {/* Menú de usuario */}
        <div className={styles.userMenu}>
          <button 
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              {user?.nombre?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className={styles.userName}>{user?.nombre || user?.username}</span>
            <span className={styles.dropdownIcon}>▼</span>
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout} className={styles.dropdownItem}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
