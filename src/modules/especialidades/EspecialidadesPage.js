import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getEspecialidades, toggleEspecialidadStatus, deleteEspecialidad } from '../../services/especialidadesService';

export default function EspecialidadesPage() {
  const router = useRouter();
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [especialidadToDelete, setEspecialidadToDelete] = useState(null);

  useEffect(() => {
    cargarEspecialidades();
  }, [searchTerm, filtroActivo, currentPage]);

  const cargarEspecialidades = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10
      };

      const response = await getEspecialidades(params);
      setEspecialidades(response.data || []);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);
      setError(null);
    } catch (err) {
      console.error('Error al cargar especialidades:', err);
      setError('Error al cargar las especialidades');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    router.push(`/especialidades/${id}`);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleEspecialidadStatus(id);
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado de la especialidad');
    }
  };

  const handleDeleteClick = (especialidad) => {
    setEspecialidadToDelete(especialidad);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEspecialidad(especialidadToDelete.id);
      setShowDeleteModal(false);
      setEspecialidadToDelete(null);
      cargarEspecialidades();
    } catch (err) {
      console.error('Error al eliminar especialidad:', err);
      alert('Error al eliminar la especialidad');
    }
  };

  const columns = [
    { key: 'id', label: 'ID', width: '5%' },
    { key: 'nombre', label: 'Nombre', width: '25%' },
    { key: 'descripcion', label: 'Descripción', width: '45%' },
    {
      key: 'activo',
      label: 'Estado',
      width: '10%',
      render: (value) => (
        <StatusBadge 
          status={value ? 'activo' : 'inactivo'} 
          text={value ? 'Activo' : 'Inactivo'} 
        />
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '15%',
      render: (_, especialidad) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => handleEdit(especialidad.id)}
          >
            Editar
          </Button>
          <Button
            variant={especialidad.activo ? 'warning' : 'success'}
            size="small"
            onClick={() => handleToggleStatus(especialidad.id)}
          >
            {especialidad.activo ? 'Desactivar' : 'Activar'}
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDeleteClick(especialidad)}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #2c3e90 0%, #1e2870 100%)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              Especialidades Médicas
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Gestiona las especialidades médicas del hospital
            </p>
          </div>
          <Button
            variant="white"
            onClick={() => router.push('/especialidades/nuevo')}
          >
            Nueva Especialidad
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar
              placeholder="Buscar por nombre o descripción..."
              onSearch={handleSearch}
              debounceMs={500}
            />
          </div>
          <select
            value={filtroActivo}
            onChange={(e) => {
              setFiltroActivo(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todas las especialidades</option>
            <option value="activos">Solo activas</option>
            <option value="inactivos">Solo inactivas</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando especialidades...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : especialidades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No se encontraron especialidades
          </div>
        ) : (
          <>
            <Table columns={columns} data={especialidades} />
            <div style={{ marginTop: '20px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
              />
            </div>
          </>
        )}
      </Card>

      {showDeleteModal && (
        <ConfirmModal
          title="Eliminar Especialidad"
          message={`¿Está seguro que desea eliminar la especialidad "${especialidadToDelete?.nombre}"? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setEspecialidadToDelete(null);
          }}
          variant="danger"
        />
      )}
    </div>
  );
}
