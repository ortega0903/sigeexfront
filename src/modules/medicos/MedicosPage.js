import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getMedicos, deleteMedico, toggleMedicoStatus } from '../../services/medicosService';

export default function MedicosPage() {
  const router = useRouter();
  
  const [medicos, setMedicos] = useState([]);
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivo, setFilterActivo] = useState('TODOS');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicoToDelete, setMedicoToDelete] = useState(null);

  useEffect(() => {
    cargarMedicos();
  }, [currentPage]);

  useEffect(() => {
    filtrarMedicos();
  }, [searchTerm, filterActivo, medicos]);

  const cargarMedicos = async () => {
    try {
      setLoading(true);
      const response = await getMedicos({ page: currentPage, limit: itemsPerPage });
      setMedicos(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error al cargar médicos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarMedicos = () => {
    let filtered = medicos;

    // Filtrar por estado
    if (filterActivo !== 'TODOS') {
      const isActivo = filterActivo === 'ACTIVO';
      filtered = filtered.filter(m => m.activo === isActivo);
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.nombres?.toLowerCase().includes(term) ||
        m.apellidos?.toLowerCase().includes(term) ||
        m.especialidad?.toLowerCase().includes(term) ||
        m.licencia_medica?.toLowerCase().includes(term) ||
        m.colegio_medico?.includes(term)
      );
    }

    setFilteredMedicos(filtered);
  };

  const handleToggleStatus = async (medico) => {
    try {
      await toggleMedicoStatus(medico.id);
      cargarMedicos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      alert('Error al cambiar el estado del médico');
    }
  };

  const handleDelete = async () => {
    if (!medicoToDelete) return;

    try {
      await deleteMedico(medicoToDelete.id);
      setShowDeleteModal(false);
      setMedicoToDelete(null);
      cargarMedicos();
    } catch (err) {
      console.error('Error al eliminar médico:', err);
      alert('Error al eliminar el médico');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'nombre_completo', 
      label: 'Nombre Completo',
      render: (medico) => `${medico.nombres} ${medico.apellidos}`
    },
    { key: 'especialidad', label: 'Especialidad' },
    { key: 'licencia_medica', label: 'Licencia Médica' },
    { key: 'colegio_medico', label: 'Colegio Médico' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'activo',
      label: 'Estado',
      render: (medico) => (
        <StatusBadge
          status={medico.activo}
          activeLabel="Activo"
          inactiveLabel="Inactivo"
        />
      )
    }
  ];

  const actions = [
    {
      label: (medico) => medico.activo ? 'Desactivar' : 'Activar',
      variant: (medico) => medico.activo ? 'warning' : 'success',
      onClick: handleToggleStatus
    },
    {
      label: 'Editar',
      variant: 'info',
      onClick: (medico) => router.push(`/medicos/${medico.id}`)
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (medico) => {
        setMedicoToDelete(medico);
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
              Médicos
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Gestión del personal médico y especialistas
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/medicos/nuevo')}
            style={{ backgroundColor: 'white', color: '#2c3e90' }}
          >
            + Nuevo Médico
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, especialidad, licencia o colegio médico..."
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
            Cargando médicos...
          </div>
        ) : filteredMedicos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm || filterActivo !== 'TODOS' 
              ? 'No se encontraron médicos que coincidan con los filtros' 
              : 'No hay médicos registrados'}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={filteredMedicos}
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
        message={`¿Estás seguro de que deseas eliminar al Dr(a). ${medicoToDelete?.nombres} ${medicoToDelete?.apellidos}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setMedicoToDelete(null);
        }}
      />
    </div>
  );
}
