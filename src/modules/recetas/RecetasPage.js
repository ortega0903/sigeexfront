import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/common/ConfirmModal';
import { getRecetas, deleteReceta } from '../../services/recetasService';

export default function RecetasPage() {
  const router = useRouter();
  
  const [recetas, setRecetas] = useState([]);
  const [filteredRecetas, setFilteredRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recetaToDelete, setRecetaToDelete] = useState(null);

  useEffect(() => {
    cargarRecetas();
  }, [currentPage]);

  useEffect(() => {
    filtrarRecetas();
  }, [searchTerm, recetas]);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const response = await getRecetas({ page: currentPage, limit: itemsPerPage });
      setRecetas(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Error al cargar recetas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtrarRecetas = () => {
    if (!searchTerm.trim()) {
      setFilteredRecetas(recetas);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = recetas.filter(receta =>
      receta.medicamento?.toLowerCase().includes(term) ||
      receta.paciente?.toLowerCase().includes(term) ||
      receta.presentacion?.toLowerCase().includes(term)
    );
    setFilteredRecetas(filtered);
  };

  const handleDelete = async () => {
    if (!recetaToDelete) return;

    try {
      await deleteReceta(recetaToDelete.id);
      setShowDeleteModal(false);
      setRecetaToDelete(null);
      cargarRecetas();
    } catch (err) {
      console.error('Error al eliminar receta:', err);
      alert('Error al eliminar la receta');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'medicamento', label: 'Medicamento' },
    { key: 'presentacion', label: 'Presentación' },
    { key: 'dosis', label: 'Dosis' },
    { key: 'frecuencia', label: 'Frecuencia' },
    { key: 'duracion', label: 'Duración' },
    { key: 'paciente', label: 'Paciente' },
    { 
      key: 'fecha_creacion', 
      label: 'Fecha',
      render: (receta) => receta.fecha_creacion ? new Date(receta.fecha_creacion).toLocaleDateString('es-GT') : '-'
    }
  ];

  const actions = [
    {
      label: 'Ver',
      variant: 'info',
      onClick: (receta) => router.push(`/recetas/${receta.id}`)
    },
    {
      label: 'Eliminar',
      variant: 'danger',
      onClick: (receta) => {
        setRecetaToDelete(receta);
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
              Recetas Médicas
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
              Gestión de prescripciones y medicamentos
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/recetas/nuevo')}
            style={{ backgroundColor: 'white', color: '#2c3e90' }}
          >
            + Nueva Receta
          </Button>
        </div>
      </div>

      <Card>
        <div style={{ marginBottom: '24px' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por medicamento, paciente o presentación..."
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando recetas...
          </div>
        ) : filteredRecetas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm ? 'No se encontraron recetas que coincidan con la búsqueda' : 'No hay recetas registradas'}
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              data={filteredRecetas}
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
        message={`¿Estás seguro de que deseas eliminar la receta de ${recetaToDelete?.medicamento}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setRecetaToDelete(null);
        }}
      />
    </div>
  );
}
