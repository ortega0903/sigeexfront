import api from '../../utils/api';

const USE_MOCK = true;

// Datos mock de diagnósticos
let MOCK_DIAGNOSTICOS = [
  { 
    id: 1, 
    consulta_id: 1, 
    codigo_cie10: 'E11.9', 
    descripcion_cie10: 'Diabetes mellitus no insulinodependiente sin mención de complicación',
    tipo: 'PRINCIPAL',
    notas: 'Paciente con diabetes tipo 2 controlada con metformina',
    creado_en: '2024-01-15T10:30:00Z'
  },
  { 
    id: 2, 
    consulta_id: 1, 
    codigo_cie10: 'I10', 
    descripcion_cie10: 'Hipertensión esencial (primaria)',
    tipo: 'SECUNDARIO',
    notas: 'Hipertensión arterial bien controlada',
    creado_en: '2024-01-15T10:35:00Z'
  },
  { 
    id: 3, 
    consulta_id: 2, 
    codigo_cie10: 'J06.9', 
    descripcion_cie10: 'Infección aguda de las vías respiratorias superiores, no especificada',
    tipo: 'PRINCIPAL',
    notas: 'Resfriado común',
    creado_en: '2024-01-20T14:20:00Z'
  }
];

// Datos mock de CIE-10 para búsqueda
const MOCK_CIE10 = [
  { codigo: 'A09', descripcion: 'Diarrea y gastroenteritis de presunto origen infeccioso' },
  { codigo: 'E11.9', descripcion: 'Diabetes mellitus no insulinodependiente sin mención de complicación' },
  { codigo: 'I10', descripcion: 'Hipertensión esencial (primaria)' },
  { codigo: 'J06.9', descripcion: 'Infección aguda de las vías respiratorias superiores, no especificada' },
  { codigo: 'J18.9', descripcion: 'Neumonía, no especificada' },
  { codigo: 'K29.0', descripcion: 'Gastritis aguda hemorrágica' },
  { codigo: 'M54.5', descripcion: 'Lumbago no especificado' },
  { codigo: 'N39.0', descripcion: 'Infección de vías urinarias, sitio no especificado' },
  { codigo: 'R50.9', descripcion: 'Fiebre, no especificada' },
  { codigo: 'Z00.0', descripcion: 'Examen médico general' }
];

// Obtener todos los diagnósticos con filtros
export const getAllDiagnosticos = async ({ 
  page = 1, 
  limit = 10, 
  consulta_id = null, 
  tipo = null,
  search = null 
} = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...MOCK_DIAGNOSTICOS];
    
    if (consulta_id) {
      filtered = filtered.filter(d => d.consulta_id === parseInt(consulta_id));
    }
    
    if (tipo) {
      filtered = filtered.filter(d => d.tipo === tipo);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(d => 
        d.codigo_cie10.toLowerCase().includes(searchLower) ||
        d.descripcion_cie10.toLowerCase().includes(searchLower) ||
        d.notas?.toLowerCase().includes(searchLower)
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
  if (tipo) params.append('tipo', tipo);
  if (search) params.append('search', search);
  
  const response = await api.get(`/diagnosticos?${params.toString()}`);
  return response.data;
};

// Obtener diagnóstico por ID
export const getDiagnosticoById = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const diagnostico = MOCK_DIAGNOSTICOS.find(d => d.id === parseInt(id));
    
    if (!diagnostico) {
      throw new Error('Diagnóstico no encontrado');
    }
    
    return {
      success: true,
      data: diagnostico
    };
  }
  
  const response = await api.get(`/diagnosticos/${id}`);
  return response.data;
};

// Crear diagnóstico
export const createDiagnostico = async (data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newDiagnostico = {
      id: Math.max(...MOCK_DIAGNOSTICOS.map(d => d.id), 0) + 1,
      ...data,
      creado_en: new Date().toISOString()
    };
    
    MOCK_DIAGNOSTICOS.push(newDiagnostico);
    
    return {
      success: true,
      message: 'Diagnóstico creado exitosamente',
      data: newDiagnostico
    };
  }
  
  const response = await api.post('/diagnosticos', data);
  return response.data;
};

// Actualizar diagnóstico
export const updateDiagnostico = async (id, data) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = MOCK_DIAGNOSTICOS.findIndex(d => d.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Diagnóstico no encontrado');
    }
    
    MOCK_DIAGNOSTICOS[index] = {
      ...MOCK_DIAGNOSTICOS[index],
      ...data
    };
    
    return {
      success: true,
      message: 'Diagnóstico actualizado exitosamente',
      data: MOCK_DIAGNOSTICOS[index]
    };
  }
  
  const response = await api.put(`/diagnosticos/${id}`, data);
  return response.data;
};

// Eliminar diagnóstico
export const deleteDiagnostico = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_DIAGNOSTICOS.findIndex(d => d.id === parseInt(id));
    
    if (index === -1) {
      throw new Error('Diagnóstico no encontrado');
    }
    
    MOCK_DIAGNOSTICOS.splice(index, 1);
    
    return {
      success: true,
      message: 'Diagnóstico eliminado exitosamente'
    };
  }
  
  const response = await api.delete(`/diagnosticos/${id}`);
  return response.data;
};

// Buscar códigos CIE-10
export const searchCIE10 = async (query) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!query || query.length < 2) {
      return {
        success: true,
        data: []
      };
    }
    
    const queryLower = query.toLowerCase();
    const results = MOCK_CIE10.filter(item => 
      item.codigo.toLowerCase().includes(queryLower) ||
      item.descripcion.toLowerCase().includes(queryLower)
    );
    
    return {
      success: true,
      data: results.slice(0, 10) // Limitar a 10 resultados
    };
  }
  
  const response = await api.get(`/diagnosticos/cie10/search?q=${query}`);
  return response.data;
};
