import api from '../../utils/api';

const USE_MOCK = true;

// Datos mock de recetas
let MOCK_RECETAS = [
  { 
    id: 1, 
    consulta_id: 1, 
    medicamento: 'Metformina',
    presentacion: '850mg tabletas',
    dosis: '1 tableta',
    frecuencia: 'Cada 12 horas',
    via_administracion: 'Oral',
    duracion: '30 días',
    cantidad: '60 tabletas',
    indicaciones: 'Tomar con alimentos',
    creado_en: '2024-01-15T10:40:00Z'
  },
  { 
    id: 2, 
    consulta_id: 1, 
    medicamento: 'Enalapril',
    presentacion: '10mg tabletas',
    dosis: '1 tableta',
    frecuencia: 'Cada 24 horas',
    via_administracion: 'Oral',
    duracion: '30 días',
    cantidad: '30 tabletas',
    indicaciones: 'Tomar en ayunas',
    creado_en: '2024-01-15T10:42:00Z'
  },
  { 
    id: 3, 
    consulta_id: 2, 
    medicamento: 'Amoxicilina',
    presentacion: '500mg cápsulas',
    dosis: '1 cápsula',
    frecuencia: 'Cada 8 horas',
    via_administracion: 'Oral',
    duracion: '7 días',
    cantidad: '21 cápsulas',
    indicaciones: 'Completar tratamiento aunque se sienta mejor',
    creado_en: '2024-01-20T14:25:00Z'
  }
];

// Vías de administración disponibles
export const VIAS_ADMINISTRACION = [
  'Oral',
  'Intravenosa',
  'Intramuscular',
  'Subcutánea',
  'Tópica',
  'Oftálmica',
  'Ótica',
  'Nasal',
  'Rectal',
  'Vaginal',
  'Inhalatoria'
];

// Obtener todas las recetas con filtros
export const getRecetas = async ({ 
  page = 1, 
  limit = 10, 
  consulta_id = null,
  search = null 
} = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...MOCK_RECETAS];
    
    if (consulta_id) {
      filtered = filtered.filter(r => r.consulta_id === parseInt(consulta_id));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.medicamento.toLowerCase().includes(searchLower) ||
        r.presentacion.toLowerCase().includes(searchLower) ||
        r.indicaciones?.toLowerCase().includes(searchLower)
      );
    }
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);
    
    return {
      success: true,
      data: paginatedData,
      totalPages: Math.ceil(filtered.length / limit),
      currentPage: page,
      totalItems: filtered.length
    };
  }
  
  const params = new URLSearchParams({ page, limit });
  if (consulta_id) params.append('consulta_id', consulta_id);
  if (search) params.append('search', search);
  
  const response = await api.get(`/recetas?${params.toString()}`);
  return response.data;
};

// Obtener receta por ID
export const getRecetaById = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const receta = MOCK_RECETAS.find(r => r.id === parseInt(id));
    
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    return {
      success: true,
      data: receta
    };
  }
  
  const response = await api.get(`/recetas/${id}`);
  return response.data;
};

// Crear receta
export const createReceta = async (data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newReceta = {
      id: Math.max(...MOCK_RECETAS.map(r => r.id), 0) + 1,
      ...data,
      creado_en: new Date().toISOString()
    };
    
    MOCK_RECETAS.push(newReceta);
    
    return {
      success: true,
      message: 'Receta creada exitosamente',
      data: newReceta
    };
  }
  
  const response = await api.post('/recetas', data);
  return response.data;
};

// Actualizar receta
export const updateReceta = async (id, data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = MOCK_RECETAS.findIndex(r => r.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Receta no encontrada');
    }
    
    MOCK_RECETAS[index] = {
      ...MOCK_RECETAS[index],
      ...data
    };
    
    return {
      success: true,
      message: 'Receta actualizada exitosamente',
      data: MOCK_RECETAS[index]
    };
  }
  
  const response = await api.put(`/recetas/${id}`, data);
  return response.data;
};

// Eliminar receta
export const deleteReceta = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_RECETAS.findIndex(r => r.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Receta no encontrada');
    }
    
    MOCK_RECETAS.splice(index, 1);
    
    return {
      success: true,
      message: 'Receta eliminada exitosamente'
    };
  }
  
  const response = await api.delete(`/recetas/${id}`);
  return response.data;
};
