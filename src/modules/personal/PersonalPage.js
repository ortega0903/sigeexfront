import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getPersonal, deletePersonal, togglePersonalStatus } from '../../services/personalService';

export default function PersonalPage() {
  const router = useRouter();
  
  const [personal, setPersonal] = useState([]);
  const [filteredPersonal, setFilteredPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState('TODOS');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personalToDelete, setPersonalToDelete] = useState(null);

  useEffect(() => {
    cargarPersonal();
  }, [currentPage]);

  useEffect(() => {
    filtrarPersonal();
  }, [searchTerm, filterActivo, personal]);

  const cargarPersonal = async () => {
    try {
      setLoading(true);
      const response = await getPersonal({ page: currentPage, limit: itemsPerPage });
      setPersonal(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error al cargar personal:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPersonal = () => {
    let filtered = personal;

    // Filtrar por estado
    if (filterActivo !== 'TODOS') {
      const isActivo = filterActivo === 'ACTIVO';
      filtered = filtered.filter(p => p.activo === isActivo);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombres?.toLowerCase().includes(term) ||
        p.apellidos?.toLowerCase().includes(term) ||
        p.dpi?.includes(term) ||
        p.email?.toLowerCase().includes(term)
      );
    }

    setFilteredPersonal(filtered);
  };

  const handleToggleStatus = async (persona) => {
    try {
      await togglePersonalStatus(persona.id);
      cargarPersonal();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del personal');
    }
  };

  const handleDelete = async () => {
    if (!personalToDelete) return;

    try {
      await deletePersonal(personalToDelete.id);
      setShowDeleteModal(false);
      setPersonalToDelete(null);
      cargarPersonal();
    } catch (err) {
      console.error('Error al eliminar personal:', err);
      alert('Error al eliminar el registro de personal');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombres', label: 'Nombres' },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'dpi', label: 'DPI' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    {
      key: 'activo',
      label: 'Estado',
      render: (persona) => (
        <StatusBadge
          status={persona.activo}
          activeLabel="Activo"
          inactiveLabel="Inactivo"
        />
      )
    }
  ];

  const actions = [
    {
      label: (persona) => persona.activo ? 'Desactivar' : 'Activar',
      variant: (persona) => persona.activo ? 'warning' : 'success',
      onClick: handleToggleStatus
    },
    {
      label: 'Editar',
      variant: 'info',
      onClick: (persona) => router.push(`/personal/${persona.id}`)
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (persona) => {
        setPersonalToDelete(persona);
        setShowDeleteModal(true);
      }
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
              Personal
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Gestión del personal de la clínica
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/personal/nuevo')}
            style={{ backgroundColor: 'white', color: '#2c3e90' }}
          >
            + Nuevo Personal
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, DPI o email..."
            />
          </div>
          <select
            value={filterActivo}
            onChange={(e) => setFilterActivo(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVO">Activos</option>
            <option value="INACTIVO">Inactivos</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando personal...
          </div>
        ) : filteredPersonal.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm || filterActivo !== 'TODOS' 
              ? 'No se encontró personal que coincida con los filtros' 
              : 'No hay personal registrado'}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={filteredPersonal}
              actions={actions}
            />

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar a ${personalToDelete?.nombres} ${personalToDelete?.apellidos}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setPersonalToDelete(null);
        }}
      />
    </div>
  );
}
