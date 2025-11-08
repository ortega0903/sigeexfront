import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import AppointmentsTable from '../../components/dashboard/AppointmentsTable';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      // Aquí llamaremos a los servicios de API
      // Por ahora usamos datos de ejemplo
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos de ejemplo
      setStats({
        pacientesNuevos: 24,
        citasHoy: 12,
        citasPendientes: 8,
        consultas: 156
      });

      setAppointments([
        {
          id: 1,
          paciente: { nombre: 'Juan Pérez', dpi: '1234567890101' },
          personal_medico: { usuario: { nombre: 'Dr. Carlos Martínez' } },
          fecha: new Date().toISOString(),
          hora: '09:00',
          estado: 'confirmada'
        },
        {
          id: 2,
          paciente: { nombre: 'María López', dpi: '9876543210101' },
          personal_medico: { usuario: { nombre: 'Dra. Ana García' } },
          fecha: new Date().toISOString(),
          hora: '10:30',
          estado: 'pendiente'
        }
      ]);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Determinar el rol principal del usuario
  const userRole = user.roles?.[0]?.nombre?.toLowerCase() || 'usuario';

  return (
    <MainLayout>
      <div className={styles.dashboard}>
        {/* Header de bienvenida */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.welcomeTitle}>
              ¡Bienvenido, {user.nombre || user.username}! 👋
            </h1>
            <p className={styles.welcomeSubtitle}>
              Aquí está el resumen de hoy
            </p>
          </div>
          <div className={styles.headerActions}>
            {(userRole === 'administrativo' || userRole === 'medico') && (
              <Button 
                icon="➕" 
                onClick={() => router.push('/citas/nueva')}
              >
                Nueva Cita
              </Button>
            )}
          </div>
        </div>

        {/* Estadísticas según el rol */}
        {loadingData ? (
          <div className={styles.statsLoading}>Cargando estadísticas...</div>
        ) : (
          <>
            {userRole === 'administrador' && (
              <AdminStats stats={stats} />
            )}

            {userRole === 'medico' && (
              <MedicoStats stats={stats} />
            )}

            {userRole === 'administrativo' && (
              <AdministrativoStats stats={stats} />
            )}
          </>
        )}

        {/* Sección de citas */}
        <div className={styles.section}>
          <AppointmentsTable 
            appointments={appointments}
            onViewDetails={(appointment) => router.push(`/citas/${appointment.id}`)}
          />
        </div>

        {/* Accesos rápidos */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Accesos Rápidos</h2>
          <div className={styles.quickActions}>
            <QuickActionCard
              icon="👥"
              title="Usuarios"
              description="Gestionar usuarios del sistema"
              onClick={() => router.push('/usuarios')}
            />
            <QuickActionCard
              icon="🏥"
              title="Pacientes"
              description="Gestionar expedientes"
              onClick={() => router.push('/pacientes')}
            />
            <QuickActionCard
              icon="📅"
              title="Agenda"
              description="Ver calendario de citas"
              onClick={() => router.push('/citas')}
            />
            {userRole === 'medico' && (
              <>
                <QuickActionCard
                  icon="📋"
                  title="Consultas"
                  description="Registrar consulta médica"
                  onClick={() => router.push('/consultas/nueva')}
                />
                <QuickActionCard
                  icon="💊"
                  title="Recetas"
                  description="Generar receta médica"
                  onClick={() => router.push('/recetas')}
                />
              </>
            )}
            {userRole === 'administrador' && (
              <>
                <QuickActionCard
                  icon="📈"
                  title="Reportes"
                  description="Ver estadísticas"
                  onClick={() => router.push('/reportes')}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Componente de estadísticas para Administrador
const AdminStats = ({ stats }) => (
  <div className={styles.statsGrid}>
    <StatsCard
      title="Pacientes Nuevos"
      value={stats?.pacientesNuevos || 0}
      icon="👥"
      color="blue"
      trend="up"
      trendValue="+12% vs mes anterior"
    />
    <StatsCard
      title="Citas de Hoy"
      value={stats?.citasHoy || 0}
      icon="📅"
      color="green"
    />
    <StatsCard
      title="Citas Pendientes"
      value={stats?.citasPendientes || 0}
      icon="⏰"
      color="yellow"
    />
    <StatsCard
      title="Consultas del Mes"
      value={stats?.consultas || 0}
      icon="📋"
      color="purple"
      trend="up"
      trendValue="+8%"
    />
  </div>
);

// Componente de estadísticas para Médico
const MedicoStats = ({ stats }) => (
  <div className={styles.statsGrid}>
    <StatsCard
      title="Mis Citas Hoy"
      value={stats?.citasHoy || 0}
      icon="📅"
      color="blue"
    />
    <StatsCard
      title="Citas Pendientes"
      value={stats?.citasPendientes || 0}
      icon="⏰"
      color="yellow"
    />
    <StatsCard
      title="Consultas Realizadas"
      value={stats?.consultas || 0}
      icon="✅"
      color="green"
    />
    <StatsCard
      title="Pacientes Atendidos"
      value={stats?.pacientesNuevos || 0}
      icon="👥"
      color="purple"
    />
  </div>
);

// Componente de estadísticas para Administrativo
const AdministrativoStats = ({ stats }) => (
  <div className={styles.statsGrid}>
    <StatsCard
      title="Citas del Día"
      value={stats?.citasHoy || 0}
      icon="📅"
      color="blue"
    />
    <StatsCard
      title="Por Confirmar"
      value={stats?.citasPendientes || 0}
      icon="⏰"
      color="yellow"
    />
    <StatsCard
      title="Pacientes Nuevos"
      value={stats?.pacientesNuevos || 0}
      icon="👥"
      color="green"
    />
    <StatsCard
      title="Citas del Mes"
      value={stats?.consultas || 0}
      icon="📊"
      color="purple"
    />
  </div>
);

// Componente de tarjeta de acceso rápido
const QuickActionCard = ({ icon, title, description, onClick }) => (
  <div className={styles.quickActionCard} onClick={onClick}>
    <div className={styles.quickActionIcon}>{icon}</div>
    <h3 className={styles.quickActionTitle}>{title}</h3>
    <p className={styles.quickActionDescription}>{description}</p>
  </div>
);

export default DashboardPage;
