import api from '../../utils/api';

// Toggle para usar mock o API real
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mighty-spire-98966-2431b30a782e.herokuapp.com/api/v1';
const USE_MOCK = true; // Cambiar a false cuando el backend esté listo

// Datos mock para desarrollo
const MOCK_DATA = {
  citas: [
    {
      id: 1,
      paciente_id: 1,
      medico_id: 1,
      fecha: '2025-11-08',
      hora: '10:00:00',
      motivo: 'Consulta general',
      estado: 'confirmada',
      notas: 'Primera visita',
      creado_en: '2025-11-07T08:00:00Z',
      paciente: {
        id: 1,
        nombres: 'María',
        apellidos: 'González López',
        dpi: '2587412369801'
      },
      medico: {
        id: 1,
        personal: {
          nombres: 'Dr. Carlos',
          apellidos: 'Martínez López'
        },
        especialidad: {
          id: 1,
          nombre: 'Cardiología'
        }
      }
    },
    {
      id: 2,
      paciente_id: 2,
      medico_id: 1,
      fecha: '2025-11-08',
      hora: '11:00:00',
      motivo: 'Control de presión arterial',
      estado: 'pendiente',
      notas: 'Traer resultados de exámenes',
      creado_en: '2025-11-07T09:00:00Z',
      paciente: {
        id: 2,
        nombres: 'José',
        apellidos: 'Ramírez Pérez',
        dpi: '1234567890101'
      },
      medico: {
        id: 1,
        personal: {
          nombres: 'Dr. Carlos',
          apellidos: 'Martínez López'
        },
        especialidad: {
          id: 1,
          nombre: 'Cardiología'
        }
      }
    },
    {
      id: 3,
      paciente_id: 3,
      medico_id: 2,
      fecha: '2025-11-09',
      hora: '09:00:00',
      motivo: 'Dolor abdominal',
      estado: 'pendiente',
      notas: 'Urgente',
      creado_en: '2025-11-07T10:30:00Z',
      paciente: {
        id: 3,
        nombres: 'Ana',
        apellidos: 'Martínez Rodríguez',
        dpi: '9876543210987'
      },
      medico: {
        id: 2,
        personal: {
          nombres: 'Dra. Rebeca',
          apellidos: 'Ortega Quiñonez'
        },
        especialidad: {
          id: 2,
          nombre: 'Medicina General'
        }
      }
    },
    {
      id: 4,
      paciente_id: 1,
      medico_id: 1,
      fecha: '2025-11-07',
      hora: '14:00:00',
      motivo: 'Revisión de resultados',
      estado: 'completada',
      notas: 'Paciente en buen estado',
      creado_en: '2025-11-06T15:00:00Z',
      paciente: {
        id: 1,
        nombres: 'María',
        apellidos: 'González López',
        dpi: '2587412369801'
      },
      medico: {
        id: 1,
        personal: {
          nombres: 'Dr. Carlos',
          apellidos: 'Martínez López'
        },
        especialidad: {
          id: 1,
          nombre: 'Cardiología'
        }
      }
    },
    {
      id: 5,
      paciente_id: 2,
      medico_id: 2,
      fecha: '2025-11-06',
      hora: '15:30:00',
      motivo: 'Consulta de seguimiento',
      estado: 'cancelada',
      notas: 'Paciente canceló',
      creado_en: '2025-11-05T10:00:00Z',
      paciente: {
        id: 2,
        nombres: 'José',
        apellidos: 'Ramírez Pérez',
        dpi: '1234567890101'
      },
      medico: {
        id: 2,
        personal: {
          nombres: 'Dra. Rebeca',
          apellidos: 'Ortega Quiñonez'
        },
        especialidad: {
          id: 2,
          nombre: 'Medicina General'
        }
      }
    }
  ]
};

// Obtener todas las citas con filtros
export const getAll = async (filters = {}) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filtered = [...MOCK_DATA.citas];
      
      // Filtro por fecha
      if (filters.fecha) {
        filtered = filtered.filter(c => c.fecha === filters.fecha);
      }
      
      // Filtro por médico
      if (filters.medico_id) {
        filtered = filtered.filter(c => c.medico_id === parseInt(filters.medico_id));
      }
      
      // Filtro por paciente
      if (filters.paciente_id) {
        filtered = filtered.filter(c => c.paciente_id === parseInt(filters.paciente_id));
      }
      
      // Filtro por estado
      if (filters.estado) {
        filtered = filtered.filter(c => c.estado === filters.estado);
      }
      
      // Ordenar por fecha y hora
      filtered.sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora}`);
        const dateB = new Date(`${b.fecha}T${b.hora}`);
        return dateB - dateA;
      });
      
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
    return await api.get('/citas', { params: filters });
  };

// Obtener cita por ID
export const getById = async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const cita = MOCK_DATA.citas.find(c => c.id === parseInt(id));
      
      if (!cita) {
        throw new Error('Cita no encontrada');
      }
      
      return {
        success: true,
        data: cita
      };
    }
    
    return await api.get(`/citas/${id}`);
  };

// Crear cita
export const create = async (data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newCita = {
        id: MOCK_DATA.citas.length + 1,
        ...data,
        estado: 'pendiente',
        creado_en: new Date().toISOString()
      };
      
      MOCK_DATA.citas.push(newCita);
      
      return {
        success: true,
        message: 'Cita creada exitosamente',
        data: newCita
      };
    }
    
    return await api.post('/citas', data);
  };

// Actualizar cita
export const update = async (id, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = MOCK_DATA.citas.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.citas[index] = { 
          ...MOCK_DATA.citas[index], 
          ...data 
        };
        
        return {
          success: true,
          message: 'Cita actualizada exitosamente',
          data: MOCK_DATA.citas[index]
        };
      }
      
      throw new Error('Cita no encontrada');
    }
    
    return await api.put(`/citas/${id}`, data);
  };

// Cambiar estado de la cita
export const changeStatus = async (id, estado) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = MOCK_DATA.citas.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.citas[index].estado = estado;
        
        return {
          success: true,
          message: 'Estado actualizado exitosamente',
          data: MOCK_DATA.citas[index]
        };
      }
      
      throw new Error('Cita no encontrada');
    }
    
    return await api.patch(`/citas/${id}/estado`, { estado });
  };

// Eliminar cita (cancelar)
export const deleteCita = async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = MOCK_DATA.citas.findIndex(c => c.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.citas[index].estado = 'cancelada';
        
        return {
          success: true,
          message: 'Cita cancelada exitosamente'
        };
      }
      
      throw new Error('Cita no encontrada');
    }
    
    return await api.delete(`/citas/${id}`);
  };
