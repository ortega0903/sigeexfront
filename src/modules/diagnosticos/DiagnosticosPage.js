import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getAllDiagnosticos, deleteDiagnostico } from '../../services/diagnosticosService';

export default function DiagnosticosPage() {
  const router = useRouter();
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [diagnosticoToDelete, setDiagnosticoToDelete] = useState(null);

  useEffect(() => {
    cargarDiagnosticos();
  }, [searchTerm, filtroTipo, currentPage]);

  const cargarDiagnosticos = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        page: currentPage,
        limit: 10
      };

      if (filtroTipo !== 'todos') {
        params.tipo = filtroTipo;
      }

      const response = await getAllDiagnosticos(params);
      setDiagnosticos(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
      setError(null);
    } catch (err) {
      console.error('Error al cargar diagnósticos:', err);
      setError('Error al cargar los diagnósticos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleView = (id) => {
    router.push(`/diagnosticos/${id}`);
  };

  const handleDeleteClick = (diagnostico) => {
    setDiagnosticoToDelete(diagnostico);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDiagnostico(diagnosticoToDelete.id);
      setShowDeleteModal(false);
      setDiagnosticoToDelete(null);
      cargarDiagnosticos();
    } catch (err) {
      console.error('Error al eliminar diagnóstico:', err);
      alert('Error al eliminar el diagnóstico');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTipoBadge = (tipo) => {
    const colors = {
      PRINCIPAL: { bg: '#1976d2', color: 'white' },
      SECUNDARIO: { bg: '#757575', color: 'white' }
    };
    const style = colors[tipo] || colors.SECUNDARIO;
    
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color
      }}>
        {tipo}
      </span>
    );
  };

  const columns = [
    { key: 'codigo_cie10', label: 'Código CIE-10', width: '12%' },
    { key: 'nombre_diagnostico', label: 'Diagnóstico', width: '30%' },
    { key: 'nombre_paciente', label: 'Paciente', width: '20%' },
    { key: 'expediente_num', label: 'Expediente', width: '12%' },
    { 
      key: 'tipo', 
      label: 'Tipo', 
      width: '10%',
      render: (value) => getTipoBadge(value)
    },
    { 
      key: 'fecha_consulta', 
      label: 'Fecha', 
      width: '10%',
      render: (value) => formatDate(value)
    },
    {
      key: 'acciones',
      label: 'Acciones',
      width: '6%',
      render: (_, diagnostico) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="info"
            size="small"
            onClick={() => handleView(diagnostico.id)}
          >
            Ver
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDeleteClick(diagnostico)}
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
              Diagnósticos
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Registro de diagnósticos según CIE-10
            </p>
          </div>
          <Button
            variant="white"
            onClick={() => router.push('/diagnosticos/nuevo')}
          >
            Nuevo Diagnóstico
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar
              placeholder="Buscar por código CIE-10, diagnóstico o paciente..."
              onSearch={handleSearch}
              debounceMs={500}
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => {
              setFiltroTipo(e.target.value);
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
            <option value="todos">Todos los tipos</option>
            <option value="PRINCIPAL">Principal</option>
            <option value="SECUNDARIO">Secundario</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando diagnósticos...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            {error}
          </div>
        ) : diagnosticos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No se encontraron diagnósticos
          </div>
        ) : (
          <>
            <Table columns={columns} data={diagnosticos} />
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
          title="Eliminar Diagnóstico"
          message={`¿Está seguro que desea eliminar este diagnóstico? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setDiagnosticoToDelete(null);
          }}
          variant="danger"
        />
      )}
    </div>
  );
}
