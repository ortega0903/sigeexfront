import api from '../../utils/api';

const USE_MOCK = true;

// Datos mock de médicos
let MOCK_MEDICOS = [
  {
    id: 1,
    personal_id: 1,
    especialidad_id: 1,
    licencia_medica: 'LIC-2024-001',
    colegio_medico: '12345',
    activo: true,
    // Datos relacionados
    nombres: 'Carlos Eduardo',
    apellidos: 'Martínez López',
    especialidad: 'Cardiología',
    telefono: '5512-3456',
    email: 'carlos.martinez@hospital.com'
  },
  {
    id: 2,
    personal_id: 2,
    especialidad_id: 2,
    licencia_medica: 'LIC-2024-002',
    colegio_medico: '67890',
    activo: true,
    nombres: 'María Fernanda',
    apellidos: 'García Ruiz',
    especialidad: 'Pediatría',
    telefono: '5512-7891',
    email: 'maria.garcia@hospital.com'
  },
  {
    id: 3,
    personal_id: 3,
    especialidad_id: 4,
    licencia_medica: 'LIC-2024-003',
    colegio_medico: '11223',
    activo: false,
    nombres: 'José Antonio',
    apellidos: 'Ramírez Soto',
    especialidad: 'Medicina Interna',
    telefono: '5512-4567',
    email: 'jose.ramirez@hospital.com'
  }
];

// Obtener todos los médicos con paginación
export const getMedicos = async ({ page = 1, limit = 10 } = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = MOCK_MEDICOS.slice(start, end);
    
    return {
      success: true,
      data: paginatedData,
      totalPages: Math.ceil(MOCK_MEDICOS.length / limit),
      currentPage: page,
      totalItems: MOCK_MEDICOS.length
    };
  }
  
  const response = await api.get(`/medicos?page=${page}&limit=${limit}`);
  return response.data;
};

// Obtener médico por ID
export const getMedicoById = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const medico = MOCK_MEDICOS.find(m => m.id === parseInt(id));
    
    if (!medico) {
      throw new Error('Médico no encontrado');
    }
    
    return {
      success: true,
      data: medico
    };
  }
  
  const response = await api.get(`/medicos/${id}`);
  return response.data;
};

// Crear médico
export const createMedico = async (data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newMedico = {
      id: Math.max(...MOCK_MEDICOS.map(m => m.id), 0) + 1,
      ...data,
      activo: true
    };
    
    MOCK_MEDICOS.push(newMedico);
    
    return {
      success: true,
      message: 'Médico creado exitosamente',
      data: newMedico
    };
  }
  
  const response = await api.post('/medicos', data);
  return response.data;
};

// Actualizar médico
export const updateMedico = async (id, data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = MOCK_MEDICOS.findIndex(m => m.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Médico no encontrado');
    }
    
    MOCK_MEDICOS[index] = {
      ...MOCK_MEDICOS[index],
      ...data
    };
    
    return {
      success: true,
      message: 'Médico actualizado exitosamente',
      data: MOCK_MEDICOS[index]
    };
  }
  
  const response = await api.put(`/medicos/${id}`, data);
  return response.data;
};

// Eliminar médico
export const deleteMedico = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_MEDICOS.findIndex(m => m.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Médico no encontrado');
    }
    
    MOCK_MEDICOS.splice(index, 1);
    
    return {
      success: true,
      message: 'Médico eliminado exitosamente'
    };
  }
  
  const response = await api.delete(`/medicos/${id}`);
  return response.data;
};

// Cambiar estado activo/inactivo
export const toggleMedicoStatus = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_MEDICOS.findIndex(m => m.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Médico no encontrado');
    }
    
    MOCK_MEDICOS[index].activo = !MOCK_MEDICOS[index].activo;
    
    return {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: MOCK_MEDICOS[index]
    };
  }
  
  const response = await api.patch(`/medicos/${id}/toggle-status`);
  return response.data;
};

// Buscar médicos por nombre o especialidad
export const searchMedicos = async (query) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filtered = MOCK_MEDICOS.filter(m =>
      m.nombres?.toLowerCase().includes(query.toLowerCase()) ||
      m.apellidos?.toLowerCase().includes(query.toLowerCase()) ||
      m.especialidad?.toLowerCase().includes(query.toLowerCase()) ||
      m.licencia_medica?.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: filtered
    };
  }
  
  const response = await api.get(`/medicos/search?q=${query}`);
  return response.data;
};
