import api from '../../utils/api';

// Toggle para usar mock o API real
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mighty-spire-98966-2431b30a782e.herokuapp.com/api/v1';
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

// Datos mock para desarrollo
const MOCK_DATA = {
  pacientes: [
    {
      id: 1,
      nombres: 'María',
      apellidos: 'González López',
      dpi: '2587412369801',
      fecha_nac: '1985-03-20',
      telefono: '+502 5555-1234',
      email: 'maria.gonzalez@example.com',
      direccion: 'Ciudad de Guatemala, Zona 10, Calle Principal 15-20',
      tipo_sangre: 'O+',
      alergias: 'Penicilina',
      activo: true,
      creado_en: '2025-11-01T10:00:00Z'
    },
    {
      id: 2,
      nombres: 'José',
      apellidos: 'Ramírez Pérez',
      dpi: '1234567890101',
      fecha_nac: '1978-07-15',
      telefono: '+502 4444-5678',
      email: 'jose.ramirez@example.com',
      direccion: 'Antigua Guatemala, Calle del Arco 10-05',
      tipo_sangre: 'A+',
      alergias: 'Ninguna',
      activo: true,
      creado_en: '2025-10-25T14:30:00Z'
    },
    {
      id: 3,
      nombres: 'Ana',
      apellidos: 'Martínez Rodríguez',
      dpi: '9876543210987',
      fecha_nac: '1992-11-30',
      telefono: '+502 3333-9876',
      email: 'ana.martinez@example.com',
      direccion: 'Quetzaltenango, Zona 1, Avenida Central',
      tipo_sangre: 'B+',
      alergias: 'Mariscos, Látex',
      activo: true,
      creado_en: '2025-10-20T09:15:00Z'
    },
    {
      id: 4,
      nombres: 'Carlos',
      apellidos: 'López Hernández',
      dpi: '5555666677778',
      fecha_nac: '1965-05-10',
      telefono: '+502 6666-4321',
      email: 'carlos.lopez@example.com',
      direccion: 'Escuintla, Zona 2, Barrio El Centro',
      tipo_sangre: 'AB+',
      alergias: 'Ninguna',
      activo: false,
      creado_en: '2025-09-15T16:45:00Z'
    }
  ]
};

// Obtener todos los pacientes con filtros
export const getAll = async (filters = {}) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let filtered = [...MOCK_DATA.pacientes];
      
      // Filtro de búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.nombres.toLowerCase().includes(searchLower) ||
          p.apellidos.toLowerCase().includes(searchLower) ||
          p.dpi.includes(searchLower)
        );
      }
      
      // Filtro de estado
      if (filters.activo !== undefined && filters.activo !== '') {
        filtered = filtered.filter(p => p.activo === (filters.activo === 'true'));
      }
      
      // Paginación
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        success: true,
        data: {
          data: paginatedData,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filtered.length / limit),
            totalItems: filtered.length,
            itemsPerPage: limit
          }
        }
      };
    }
    
    // API real
    return await api.get('/pacientes', { params: filters });
  };

// Obtener paciente por ID
export const getById = async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const paciente = MOCK_DATA.pacientes.find(p => p.id === parseInt(id));
      
      if (!paciente) {
        throw new Error('Paciente no encontrado');
      }
      
      return {
        success: true,
        data: paciente
      };
    }
    
    return await api.get(`/pacientes/${id}`);
  };

// Crear paciente
export const create = async (data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPaciente = {
        id: MOCK_DATA.pacientes.length + 1,
        ...data,
        activo: data.activo !== undefined ? data.activo : true,
        creado_en: new Date().toISOString()
      };
      
      MOCK_DATA.pacientes.push(newPaciente);
      
      return {
        success: true,
        message: 'Paciente creado exitosamente',
        data: newPaciente
      };
    }
    
    return await api.post('/pacientes', data);
  };

// Actualizar paciente
export const update = async (id, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = MOCK_DATA.pacientes.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.pacientes[index] = { 
          ...MOCK_DATA.pacientes[index], 
          ...data 
        };
        
        return {
          success: true,
          message: 'Paciente actualizado exitosamente',
          data: MOCK_DATA.pacientes[index]
        };
      }
      
      throw new Error('Paciente no encontrado');
    }
    
    return await api.put(`/pacientes/${id}`, data);
  };

// Eliminar paciente
export const deletePaciente = async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = MOCK_DATA.pacientes.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.pacientes.splice(index, 1);
        
        return {
          success: true,
          message: 'Paciente eliminado exitosamente'
        };
      }
      
      throw new Error('Paciente no encontrado');
    }
    
    return await api.delete(`/pacientes/${id}`);
  };

// Buscar pacientes (para autocomplete)
export const search = async (query) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const searchLower = query.toLowerCase();
      const results = MOCK_DATA.pacientes.filter(p =>
        p.activo && (
          p.nombres.toLowerCase().includes(searchLower) ||
          p.apellidos.toLowerCase().includes(searchLower) ||
          p.dpi.includes(searchLower)
        )
      ).slice(0, 10);
      
      return {
        success: true,
        data: results.map(p => ({
          id: p.id,
          nombres: p.nombres,
          apellidos: p.apellidos,
          dpi: p.dpi
        }))
      };
    }
    
    return await api.get(`/pacientes/buscar?q=${encodeURIComponent(query)}`);
  };
