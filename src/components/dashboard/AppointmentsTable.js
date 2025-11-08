import { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import styles from './AppointmentsTable.module.css';

const AppointmentsTable = ({ appointments = [], onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendiente': { label: 'Pendiente', color: 'yellow' },
      'confirmada': { label: 'Confirmada', color: 'blue' },
      'en_consulta': { label: 'En Consulta', color: 'purple' },
      'completada': { label: 'Completada', color: 'green' },
      'cancelada': { label: 'Cancelada', color: 'red' }
    };

    const config = statusConfig[status] || statusConfig.pendiente;
    return (
      <span className={`${styles.badge} ${styles[config.color]}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Card title="Citas Recientes" noPadding>
      {appointments.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📅</p>
          <p className={styles.emptyText}>No hay citas programadas</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Médico</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className={styles.patientCell}>
                        <div className={styles.avatar}>
                          {appointment.paciente?.nombre?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className={styles.patientName}>
                            {appointment.paciente?.nombre || 'N/A'}
                          </p>
                          <p className={styles.patientDpi}>
                            DPI: {appointment.paciente?.dpi || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{appointment.personal_medico?.usuario?.nombre || 'N/A'}</td>
                    <td>{new Date(appointment.fecha).toLocaleDateString('es-GT')}</td>
                    <td>{appointment.hora}</td>
                    <td>{getStatusBadge(appointment.estado)}</td>
                    <td>
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => onViewDetails?.(appointment)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AppointmentsTable;
