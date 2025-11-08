import api from '../../utils/api';

// MODO: Producción - conectado a API real
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mighty-spire-98966-2431b30a782e.herokuapp.com/api/v1';
const USE_MOCK = true;

// Datos mock - Roles fijos del sistema (solo si USE_MOCK = true)
const MOCK_ROLES = [
  {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Super usuario con permiso a todas las funcionalidades del sistema',
    usuarios_count: 1
  },
  {
    id: 2,
    nombre: 'Administrativo',
    descripcion: 'Usuario encargado de creacion y gestion de citas medicas',
    usuarios_count: 3
  },
  {
    id: 3,
    nombre: 'Médico',
    descripcion: 'Usuario que atendera el paciente de forma directa',
    usuarios_count: 5
  }
];

const rolesService = {
  // Obtener todos los roles
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        data: {
          success: true,
          data: {
            data: MOCK_ROLES,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: MOCK_ROLES.length,
              itemsPerPage: 10
            }
          }
        }
      };
    }
    
    // API real
    return await api.get('/roles');
  },

  // Obtener rol por ID
  getById: async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const rol = MOCK_ROLES.find(r => r.id === parseInt(id));
      
      return {
        data: {
          success: true,
          data: rol || null
        }
      };
    }
    
    // API real
    return await api.get(`/roles/${id}`);
  },

  // Obtener usuarios con un rol específico
  getUsuariosByRole: async (roleId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      return {
        data: {
          success: true,
          data: {
            data: [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalItems: 0,
              itemsPerPage: 10
            }
          }
        }
      };
    }
    
    // API real
    return await api.get(`/roles/${roleId}/usuarios`);
  }
};

export default rolesService;
