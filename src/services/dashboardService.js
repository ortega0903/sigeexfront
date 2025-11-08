import api from '../../utils/api';

const dashboardService = {
  // Obtener estadísticas del dashboard según el rol
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },

  // Obtener citas recientes/del día
  getRecentAppointments: async (limit = 10) => {
    try {
      const response = await api.get('/citas', {
        params: {
          limit,
          fecha: new Date().toISOString().split('T')[0]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener citas:', error);
      throw error;
    }
  },

  // Obtener notificaciones
  getNotifications: async () => {
    try {
      const response = await api.get('/notificaciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  },

  // Obtener actividad reciente
  getRecentActivity: async (limit = 5) => {
    try {
      const response = await api.get('/actividad', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      throw error;
    }
  }
};

export default dashboardService;
