import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import { Card, Button, SearchBar, Table, StatusBadge, Pagination, ConfirmModal } from '../../components/common';
import usuariosService from '../../services/usuariosService';
import rolesService from '../../services/rolesService';
import styles from './UsuariosPage.module.css';

const UsuariosPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rol_id: '',
    activo: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  
  // Modal de confirmación
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Protección de ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadRoles();
      loadUsuarios();
    }
  }, [user]);

  // Recargar usuarios cuando cambien los filtros
  useEffect(() => {
    if (user) {
      loadUsuarios();
    }
  }, [filters.search, filters.rol_id, filters.activo, filters.page]);

  const loadRoles = async () => {
    try {
      const response = await rolesService.getAll();
      // La API real devuelve response.data.data (array directo)
      // El mock devuelve response.data.data.data
      const rolesData = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data.data || [];
      setRoles(rolesData);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      const response = await usuariosService.getAll(filters);
      
      // La API real devuelve response.data.data (array directo)
      // El mock devuelve response.data.data.data
      const usuarios = Array.isArray(response.data.data) 
        ? response.data.data 
        : response.data.data.data || [];
      
      setUsuarios(usuarios);
      setPagination(response.data.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: usuarios.length,
        itemsPerPage: 10
      });
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleEdit = (usuario) => {
    router.push(`/usuarios/${usuario.id}`);
  };

  const handleToggleStatus = async (usuario) => {
    setConfirmModal({
      isOpen: true,
      title: `${usuario.activo ? 'Desactivar' : 'Activar'} Usuario`,
      message: `¿Estás seguro de ${usuario.activo ? 'desactivar' : 'activar'} al usuario "${usuario.username}"?`,
      onConfirm: async () => {
        try {
          await usuariosService.toggleStatus(usuario.id);
          loadUsuarios();
        } catch (error) {
          console.error('Error al cambiar estado:', error);
        }
      }
    });
  };

  const handleDelete = (usuario) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await usuariosService.delete(usuario.id);
          loadUsuarios();
        } catch (error) {
          console.error('Error al eliminar usuario:', error);
        }
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      rol_id: '',
      activo: '',
      page: 1,
      limit: 10
    });
  };

  // Columnas de la tabla
  const columns = [
    {
      key: 'username',
      label: 'Usuario',
      render: (row) => (
        <div className={styles.userCell}>
          <div className={styles.avatar}>
            {row?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className={styles.username}>{row?.username || 'Sin usuario'}</p>
            <p className={styles.email}>{row?.email || 'Sin email'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'personal',
      label: 'Nombre Completo',
      render: (row) => row?.personal
        ? `${row.personal.nombres} ${row.personal.apellidos}` 
        : <span className={styles.noData}>-</span>
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      render: (row) => row?.telefono || <span className={styles.noData}>-</span>
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (row) => (
        <div className={styles.rolesCell}>
          {row?.roles?.map((rol) => (
            <StatusBadge key={rol.id} status={rol.nombre} variant="info" />
          )) || <span className={styles.noData}>-</span>}
        </div>
      )
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (row) => (
        <StatusBadge 
          status={row?.activo} 
          label={row?.activo ? 'Activo' : 'Inactivo'}
        />
      )
    },
    {
      key: 'creado_en',
      label: 'Registrado',
      render: (row) => row?.creado_en ? new Date(row.creado_en).toLocaleDateString('es-GT') : '-'
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (row) => (
        <div className={styles.actions}>
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(row); }}
            className={styles.actionButton}
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleStatus(row); }}
            className={styles.actionButton}
            title={row?.activo ? 'Desactivar' : 'Activar'}
          >
            {row?.activo ? '🔒' : '🔓'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(row); }}
            className={styles.actionButton}
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      )
    }
  ];

  if (authLoading || !user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Gestión de Usuarios</h1>
            <p className={styles.subtitle}>
              Administra los usuarios del sistema y sus permisos
            </p>
          </div>
          <Button
            icon="➕"
            onClick={() => router.push('/usuarios/nuevo')}
          >
            Nuevo Usuario
          </Button>
        </div>

        {/* Estadísticas */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>👥</span>
            <div>
              <p className={styles.statValue}>{pagination.totalItems}</p>
              <p className={styles.statLabel}>Total Usuarios</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <div>
              <p className={styles.statValue}>
                {usuarios.filter(u => u.activo).length}
              </p>
              <p className={styles.statLabel}>Activos</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🔒</span>
            <div>
              <p className={styles.statValue}>
                {usuarios.filter(u => !u.activo).length}
              </p>
              <p className={styles.statLabel}>Inactivos</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <div className={styles.filters}>
            <SearchBar
              placeholder="Buscar por nombre, usuario, email..."
              onSearch={handleSearch}
            />
            
            <select
              value={filters.rol_id}
              onChange={(e) => handleFilterChange('rol_id', e.target.value)}
              className={styles.select}
            >
              <option value="">Todos los roles</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            
            <select
              value={filters.activo}
              onChange={(e) => handleFilterChange('activo', e.target.value)}
              className={styles.select}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
            
            <Button
              variant="secondary"
              size="medium"
              onClick={clearFilters}
            >
              Limpiar
            </Button>
          </div>
        </Card>

        {/* Tabla */}
        <Card noPadding>
          {loading ? (
            <div className={styles.tableLoading}>
              <div className={styles.spinner}></div>
              <p>Cargando usuarios...</p>
            </div>
          ) : (
            <>
              <Table
                columns={columns}
                data={usuarios}
                emptyMessage="No se encontraron usuarios"
              />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Card>

        {/* Modal de confirmación */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
        />
      </div>
    </MainLayout>
  );
};

export default UsuariosPage;
