import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import * as pacientesService from '../../services/pacientesService';
import styles from './PacientesPage.module.css';

export default function PacientesPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPacientes();
  }, [currentPage, searchTerm]);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await pacientesService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      
      if (response.success) {
        setPacientes(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError('Error al cargar pacientes');
      }
    } catch (err) {
      setError('Error al cargar pacientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar este paciente?')) return;
    
    try {
      const response = await pacientesService.deletePaciente(id);
      if (response.success) {
        loadPacientes();
      } else {
        alert('Error al eliminar paciente');
      }
    } catch (err) {
      alert('Error al eliminar paciente: ' + err.message);
    }
  };

  const handleEdit = (id) => {
    router.push(`/pacientes/${id}`);
  };

  const handleNew = () => {
    router.push('/pacientes/nuevo');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Pacientes</h1>
          <button className={styles.btnNew} onClick={handleNew}>
            Nuevo Paciente
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o DPI..."
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>

        {loading && <div className={styles.loading}>Cargando...</div>}
        
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>DPI</th>
                    <th>Nombre</th>
                    <th>Fecha Nacimiento</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Tipo Sangre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.length === 0 ? (
                    <tr>
                      <td colSpan="7" className={styles.noData}>
                        No se encontraron pacientes
                      </td>
                    </tr>
                  ) : (
                    pacientes.map((paciente) => (
                      <tr key={paciente.id}>
                        <td>{paciente.dpi}</td>
                        <td>{paciente.nombre} {paciente.apellido_paterno} {paciente.apellido_materno}</td>
                        <td>{formatDate(paciente.fecha_nacimiento)}</td>
                        <td>{paciente.telefono}</td>
                        <td>{paciente.email}</td>
                        <td>{paciente.tipo_sangre}</td>
                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.btnEdit}
                              onClick={() => handleEdit(paciente.id)}
                            >
                              Editar
                            </button>
                            <button
                              className={styles.btnDelete}
                              onClick={() => handleDelete(paciente.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.btnPage}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </button>
                <span className={styles.pageInfo}>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  className={styles.btnPage}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
