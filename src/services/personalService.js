import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mighty-spire-98966-2431b30a782e.herokuapp.com/api/v1';
const USE_MOCK = true;

// Mock data
const mockPersonal = [
  {
    id: 1,
    usuario_id: 2,
    nombres: 'Carlos Eduardo',
    apellidos: 'Martínez López',
    dpi: '2587451230101',
    fecha_nacimiento: '1985-06-15',
    telefono: '5512-3456',
    email: 'carlos.martinez@hospital.com',
    direccion: 'Zona 10, Ciudad de Guatemala',
    activo: true,
    username: 'dr_martinez',
    creado_en: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    usuario_id: 3,
    nombres: 'Ana María',
    apellidos: 'Rodríguez García',
    dpi: '2587451230102',
    fecha_nacimiento: '1990-03-22',
    telefono: '5512-7890',
    email: 'ana.rodriguez@hospital.com',
    direccion: 'Zona 9, Ciudad de Guatemala',
    activo: true,
    username: 'enf_rodriguez',
    creado_en: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    usuario_id: 4,
    nombres: 'Luis Fernando',
    apellidos: 'González Pérez',
    dpi: '2587451230103',
    fecha_nacimiento: '1988-11-10',
    telefono: '5512-4567',
    email: 'luis.gonzalez@hospital.com',
    direccion: 'Zona 11, Ciudad de Guatemala',
    activo: true,
    username: 'admin_gonzalez',
    creado_en: '2025-01-01T00:00:00.000Z'
  }
];

// Función principal con paginación simple
export const getPersonal = async ({ page = 1, limit = 10 } = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockPersonal.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedData,
      totalPages: Math.ceil(mockPersonal.length / limit),
      currentPage: page,
      totalItems: mockPersonal.length
    };
  }

  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/personal`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAllPersonal = async (params = {}) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...mockPersonal];

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.nombres.toLowerCase().includes(searchLower) ||
        p.apellidos.toLowerCase().includes(searchLower) ||
        p.dpi.includes(params.search) ||
        (p.email && p.email.toLowerCase().includes(searchLower))
      );
    }

    if (params.activo !== undefined) {
      filtered = filtered.filter(p => p.activo === params.activo);
    }

    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
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

  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/personal`, {
    params,
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getPersonalById = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const personal = mockPersonal.find(p => p.id === parseInt(id));
    if (!personal) {
      throw new Error('Personal no encontrado');
    }
    return { success: true, data: personal };
  }

  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/personal/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createPersonal = async (personalData) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPersonal = {
      id: mockPersonal.length + 1,
      ...personalData,
      activo: true,
      creado_en: new Date().toISOString()
    };
    mockPersonal.push(newPersonal);
    return { success: true, message: 'Personal creado exitosamente', data: newPersonal };
  }

  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/personal`, personalData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updatePersonal = async (id, personalData) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPersonal.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Personal no encontrado');
    }
    mockPersonal[index] = { ...mockPersonal[index], ...personalData };
    return { success: true, message: 'Personal actualizado exitosamente', data: mockPersonal[index] };
  }

  const token = localStorage.getItem('token');
  const response = await axios.patch(`${API_URL}/personal/${id}`, personalData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const togglePersonalStatus = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const personal = mockPersonal.find(p => p.id === parseInt(id));
    if (!personal) {
      throw new Error('Personal no encontrado');
    }
    personal.activo = !personal.activo;
    return { 
      success: true, 
      message: `Personal ${personal.activo ? 'activado' : 'desactivado'} exitosamente`, 
      data: personal 
    };
  }

  const token = localStorage.getItem('token');
  const response = await axios.patch(`${API_URL}/personal/${id}/toggle-status`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deletePersonal = async (id) => {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPersonal.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Personal no encontrado');
    }
    mockPersonal.splice(index, 1);
    return { success: true, message: 'Personal eliminado exitosamente' };
  }

  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/personal/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
