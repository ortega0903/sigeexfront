import api from '../../utils/api';

const USE_MOCK = true;

// Datos mock de especialidades
let MOCK_ESPECIALIDADES = [
  { id: 1, nombre: 'Cardiología', descripcion: 'Especialidad médica del corazón', activo: true },
  { id: 2, nombre: 'Pediatría', descripcion: 'Atención médica infantil', activo: true },
  { id: 3, nombre: 'Ginecología', descripcion: 'Salud de la mujer', activo: true },
  { id: 4, nombre: 'Medicina Interna', descripcion: 'Atención médica integral de adultos', activo: true },
  { id: 5, nombre: 'Cirugía General', descripcion: 'Procedimientos quirúrgicos generales', activo: false }
];

// Obtener todas las especialidades con paginación
export const getEspecialidades = async ({ page = 1, limit = 10 } = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = MOCK_ESPECIALIDADES.slice(start, end);
    
    return {
      success: true,
      data: paginatedData,
      totalPages: Math.ceil(MOCK_ESPECIALIDADES.length / limit),
      currentPage: page,
      totalItems: MOCK_ESPECIALIDADES.length
    };
  }
  
  const response = await api.get(`/especialidades?page=${page}&limit=${limit}`);
  return response.data;
};

// Obtener especialidad por ID
export const getEspecialidadById = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const especialidad = MOCK_ESPECIALIDADES.find(e => e.id === parseInt(id));
    
    if (!especialidad) {
      throw new Error('Especialidad no encontrada');
    }
    
    return {
      success: true,
      data: especialidad
    };
  }
  
  const response = await api.get(`/especialidades/${id}`);
  return response.data;
};

// Crear especialidad
export const createEspecialidad = async (data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newEspecialidad = {
      id: Math.max(...MOCK_ESPECIALIDADES.map(e => e.id), 0) + 1,
      ...data,
      activo: true
    };
    
    MOCK_ESPECIALIDADES.push(newEspecialidad);
    
    return {
      success: true,
      message: 'Especialidad creada exitosamente',
      data: newEspecialidad
    };
  }
  
  const response = await api.post('/especialidades', data);
  return response.data;
};

// Actualizar especialidad
export const updateEspecialidad = async (id, data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = MOCK_ESPECIALIDADES.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Especialidad no encontrada');
    }
    
    MOCK_ESPECIALIDADES[index] = {
      ...MOCK_ESPECIALIDADES[index],
      ...data
    };
    
    return {
      success: true,
      message: 'Especialidad actualizada exitosamente',
      data: MOCK_ESPECIALIDADES[index]
    };
  }
  
  const response = await api.put(`/especialidades/${id}`, data);
  return response.data;
};

// Eliminar especialidad
export const deleteEspecialidad = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_ESPECIALIDADES.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Especialidad no encontrada');
    }
    
    MOCK_ESPECIALIDADES.splice(index, 1);
    
    return {
      success: true,
      message: 'Especialidad eliminada exitosamente'
    };
  }
  
  const response = await api.delete(`/especialidades/${id}`);
  return response.data;
};

// Cambiar estado activo/inactivo
export const toggleEspecialidadStatus = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_ESPECIALIDADES.findIndex(e => e.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Especialidad no encontrada');
    }
    
    MOCK_ESPECIALIDADES[index].activo = !MOCK_ESPECIALIDADES[index].activo;
    
    return {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: MOCK_ESPECIALIDADES[index]
    };
  }
  
  const response = await api.patch(`/especialidades/${id}/toggle-status`);
  return response.data;
};

// Buscar especialidades
export const searchEspecialidades = async (query) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const filtered = MOCK_ESPECIALIDADES.filter(e =>
      e.nombre.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: filtered
    };
  }
  
  const response = await api.get(`/especialidades/search?q=${query}`);
  return response.data;
};
