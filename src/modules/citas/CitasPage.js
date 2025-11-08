import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import * as citasService from '../../services/citasService';
import styles from './CitasPage.module.css';

export default function CitasPage() {
  const router = useRouter();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterEstado, setFilterEstado] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCitas();
  }, [currentPage, filterEstado]);

  const loadCitas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await citasService.getAll({
        page: currentPage,
        limit: 10,
        estado: filterEstado || undefined
      });
      
      if (response.success) {
        setCitas(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError('Error al cargar citas');
      }
    } catch (err) {
      setError('Error al cargar citas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id, newEstado) => {
    try {
      const response = await citasService.changeStatus(id, newEstado);
      if (response.success) {
        loadCitas();
      } else {
        alert('Error al cambiar estado de cita');
      }
    } catch (err) {
      alert('Error al cambiar estado: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta cita?')) return;
    
    try {
      const response = await citasService.deleteCita(id);
      if (response.success) {
        loadCitas();
      } else {
        alert('Error al eliminar cita');
      }
    } catch (err) {
      alert('Error al eliminar cita: ' + err.message);
    }
  };

  const handleEdit = (id) => {
    router.push(`/citas/${id}`);
  };

  const handleNew = () => {
    router.push('/citas/nueva');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'pendiente': return styles.badgePendiente;
      case 'confirmada': return styles.badgeConfirmada;
      case 'completada': return styles.badgeCompletada;
      case 'cancelada': return styles.badgeCancelada;
      default: return styles.badgePendiente;
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Gestión de Citas</h1>
          <button className={styles.btnNew} onClick={handleNew}>
            Nueva Cita
          </button>
        </div>

        <div className={styles.filters}>
          <select
            value={filterEstado}
            onChange={(e) => {
              setFilterEstado(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {loading && <div className={styles.loading}>Cargando...</div>}
        
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Motivo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {citas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className={styles.noData}>
                        No se encontraron citas
                      </td>
                    </tr>
                  ) : (
                    citas.map((cita) => (
                      <tr key={cita.id}>
                        <td>{formatDate(cita.fecha)}</td>
                        <td>{formatTime(cita.hora)}</td>
                        <td>
                          {cita.paciente.nombres} {cita.paciente.apellidos}
                        </td>
                        <td>
                          {cita.medico.personal.nombres} {cita.medico.personal.apellidos}
                          <br />
                          <span className={styles.especialidad}>
                            {cita.medico.especialidad.nombre}
                          </span>
                        </td>
                        <td>{cita.motivo}</td>
                        <td>
                          <span className={`${styles.badge} ${getEstadoBadgeClass(cita.estado)}`}>
                            {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            {cita.estado === 'pendiente' && (
                              <button
                                className={styles.btnConfirm}
                                onClick={() => handleChangeStatus(cita.id, 'confirmada')}
                                title="Confirmar"
                              >
                                Confirmar
                              </button>
                            )}
                            {cita.estado === 'confirmada' && (
                              <button
                                className={styles.btnComplete}
                                onClick={() => handleChangeStatus(cita.id, 'completada')}
                                title="Completar"
                              >
                                Completar
                              </button>
                            )}
                            {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                              <button
                                className={styles.btnCancel}
                                onClick={() => handleChangeStatus(cita.id, 'cancelada')}
                                title="Cancelar"
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                              className={styles.btnEdit}
                              onClick={() => handleEdit(cita.id)}
                            >
                              Editar
                            </button>
                            <button
                              className={styles.btnDelete}
                              onClick={() => handleDelete(cita.id)}
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
