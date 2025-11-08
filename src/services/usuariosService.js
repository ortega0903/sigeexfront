import api from '../../utils/api';

// MODO: API real - backend corregido
const USE_MOCK = false;

// Datos mock para desarrollo (solo si USE_MOCK = true)
const MOCK_DATA = {
  usuarios: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@sigeex.com',
      telefono: '+502 2334-5678',
      activo: true,
      creado_en: '2025-01-15T10:30:00.000Z',
      roles: [{ id: 1, nombre: 'Administrador' }],
      personal: null
    },
    {
      id: 2,
      username: 'recepcion1',
      email: 'recepcion@sigeex.com',
      telefono: '+502 5432-1098',
      activo: true,
      creado_en: '2025-02-20T14:15:00.000Z',
      roles: [{ id: 2, nombre: 'Administrativo' }],
      personal: {
        id: 1,
        nombres: 'María José',
        apellidos: 'García Pérez',
        dpi: '2587412369801'
      }
    },
    {
      id: 3,
      username: 'dr_martinez',
      email: 'carlos.martinez@sigeex.com',
      telefono: '+502 2334-9999',
      activo: true,
      creado_en: '2025-03-10T09:00:00.000Z',
      roles: [{ id: 3, nombre: 'Médico' }],
      personal: {
        id: 2,
        nombres: 'Dr. Carlos Eduardo',
        apellidos: 'Martínez López',
        dpi: '2587412369802',
        medico: {
          id: 1,
          especialidad: { id: 1, nombre: 'Cardiología' },
          colegiado: 'COLEGIO-GT-12345',
          activo: true
        }
      }
    }
  ]
};

const usuariosService = {
  // Obtener todos los usuarios con filtros
  getAll: async (filters = {}) => {
    if (USE_MOCK) {
      // Mock temporal
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let usuarios = [...MOCK_DATA.usuarios];
      
      // Filtrar por búsqueda
      if (filters.search) {
        const search = filters.search.toLowerCase();
        usuarios = usuarios.filter(u => 
          u.username.toLowerCase().includes(search) ||
          u.email?.toLowerCase().includes(search) ||
          u.personal?.nombres?.toLowerCase().includes(search) ||
          u.personal?.apellidos?.toLowerCase().includes(search)
        );
      }
      
      // Filtrar por rol
      if (filters.rol_id) {
        usuarios = usuarios.filter(u => 
          u.roles.some(r => r.id === parseInt(filters.rol_id))
        );
      }
      
      // Filtrar por estado
      if (filters.activo !== undefined && filters.activo !== '') {
        const activoFilter = filters.activo === 'true' || filters.activo === true;
        usuarios = usuarios.filter(u => u.activo === activoFilter);
      }
      
      return {
        data: {
          success: true,
          data: {
            data: usuarios,
            pagination: {
              currentPage: filters.page || 1,
              totalPages: 1,
              totalItems: usuarios.length,
              itemsPerPage: filters.limit || 10
            }
          }
        }
      };
    }
    
    // API real - endpoint usuarios existe
    return await api.get('/usuarios', { params: filters });
  },

  // Obtener usuario por ID
  getById: async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const usuario = MOCK_DATA.usuarios.find(u => u.id === parseInt(id));
      
      return {
        data: {
          success: true,
          data: usuario || null
        }
      };
    }
    
    // API real - endpoint correcto
    return await api.get(`/usuarios/${id}`);
  },

  // Crear usuario
  create: async (data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser = {
        id: MOCK_DATA.usuarios.length + 1,
        ...data,
        creado_en: new Date().toISOString()
      };
      
      MOCK_DATA.usuarios.push(newUser);
      
      return {
        data: {
          success: true,
          message: 'Usuario creado exitosamente',
          data: newUser
        }
      };
    }
    
    // API real - Flujo según backend:
    // Paso 1: Crear usuario (solo credenciales y contacto)
    const usuarioData = {
      username: data.username,
      password: data.password,
      email: data.email,
      telefono: data.telefono,
      activo: data.activo !== undefined ? data.activo : true
    };
    
    console.log('📤 Enviando a POST /usuarios:', usuarioData);
    
    const response = await api.post('/usuarios', usuarioData);
    
    console.log('📥 Respuesta de POST /usuarios:', response.data);
    
    const usuarioId = response.data.data.id || response.data.data.usuario_id;
    
    // Paso 2: Si es personal (Administrativo o Médico), crear registro de personal
    if (response.data.success && data.esPersonal) {
      const personalData = {
        usuario_id: usuarioId,
        nombres: data.nombres,
        apellidos: data.apellidos,
        dpi: data.dpi || null,
        fecha_nac: data.fecha_nac || null,
        telefono: data.telefono_personal || data.telefono || null,
        email: data.email_personal || data.email || null,
        direccion: data.direccion || null
      };
      
      console.log('📤 Enviando a POST /personal:', personalData);
      
      try {
        const personalResponse = await api.post('/personal', personalData);
        console.log('📥 Respuesta de POST /personal:', personalResponse.data);
        
        // Paso 3: Si es médico, crear registro de médico
        if (data.esMedico && personalResponse.data.success) {
          const personalId = personalResponse.data.data.id || personalResponse.data.data.personal_id;
          
          const medicoData = {
            personal_id: personalId,
            especialidad_id: data.especialidad_id
          };
          
          console.log('📤 Enviando a POST /medicos:', medicoData);
          
          try {
            const medicoResponse = await api.post('/medicos', medicoData);
            console.log('📥 Respuesta de POST /medicos:', medicoResponse.data);
          } catch (medicoError) {
            console.error('❌ Error en POST /medicos:', medicoError);
            throw new Error('Error al crear registro de médico');
          }
        }
      } catch (personalError) {
        console.error('❌ Error en POST /personal:', personalError);
        throw new Error('Error al crear datos personales');
      }
    }
    
    // Paso 4: Asignar rol si se seleccionó
    if (response.data.success && data.rol_id) {
      console.log('📤 Enviando a POST /roles/asignar:', {
        usuario_id: usuarioId,
        rol_id: data.rol_id
      });
      
      try {
        const rolResponse = await api.post('/roles/asignar', {
          usuario_id: usuarioId,
          rol_id: data.rol_id
        });
        console.log('📥 Respuesta de POST /roles/asignar:', rolResponse.data);
      } catch (rolError) {
        console.error('❌ Error en POST /roles/asignar:', rolError);
        throw new Error('Error al asignar rol');
      }
    }
    
    return response;
  },

  // Actualizar usuario
  update: async (id, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const index = MOCK_DATA.usuarios.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.usuarios[index] = { ...MOCK_DATA.usuarios[index], ...data };
      }
      
      return {
        data: {
          success: true,
          message: 'Usuario actualizado exitosamente',
          data: MOCK_DATA.usuarios[index]
        }
      };
    }
    
    // API real - actualizar usuario
    return await api.put(`/usuarios/${id}`, data);
  },

  // Eliminar usuario
  delete: async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = MOCK_DATA.usuarios.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        MOCK_DATA.usuarios.splice(index, 1);
      }
      
      return {
        data: {
          success: true,
          message: 'Usuario eliminado exitosamente'
        }
      };
    }
    
    // API real - eliminar usuario
    return await api.delete(`/usuarios/${id}`);
  },

  // Cambiar estado activo/inactivo
  toggleStatus: async (id) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const usuario = MOCK_DATA.usuarios.find(u => u.id === parseInt(id));
      if (usuario) {
        usuario.activo = !usuario.activo;
      }
      
      return {
        data: {
          success: true,
          message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente`,
          data: usuario
        }
      };
    }
    
    // API real - endpoint correcto
    return await api.patch(`/usuarios/${id}/toggle-status`);
  },

  // Asignar rol a usuario
  asignarRol: async (usuarioId, rolId) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        data: {
          success: true,
          message: 'Rol asignado exitosamente'
        }
      };
    }
    
    // API real - usar endpoint correcto de asignación de roles
    return await api.post('/roles/asignar', { usuario_id: usuarioId, rol_id: rolId });
  },

  // Crear personal asociado a usuario
  createPersonal: async (usuarioId, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        data: {
          success: true,
          message: 'Personal creado exitosamente',
          data: { id: Math.random(), usuario_id: usuarioId, ...data }
        }
      };
    }
    
    // API real
    return await api.post('/personal', { usuario_id: usuarioId, ...data });
  },

  // Actualizar personal
  updatePersonal: async (personalId, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        data: {
          success: true,
          message: 'Personal actualizado exitosamente'
        }
      };
    }
    
    // API real
    return await api.put(`/personal/${personalId}`, data);
  },

  // Crear médico
  createMedico: async (data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        data: {
          success: true,
          message: 'Médico creado exitosamente',
          data: { id: Math.random(), ...data }
        }
      };
    }
    
    // API real
    return await api.post('/medicos', data);
  },

  // Actualizar médico
  updateMedico: async (medicoId, data) => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        data: {
          success: true,
          message: 'Médico actualizado exitosamente'
        }
      };
    }
    
    // API real
    return await api.put(`/medicos/${medicoId}`, data);
  }
};

export default usuariosService;
