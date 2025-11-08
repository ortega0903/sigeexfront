import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../context/AuthContext';
import MainLayout from '../../components/layout/MainLayout';
import { Card, Button } from '../../components/common';
import usuariosService from '../../services/usuariosService';
import rolesService from '../../services/rolesService';
import especialidadesService from '../../services/especialidadesService';
import styles from './UsuarioFormPage.module.css';

const UsuarioFormPage = ({ usuarioId = null }) => {
  const router = useRouter();
  const { user, loading: authLoading } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [errors, setErrors] = useState({});
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Credenciales
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    activo: true,
    
    // Rol
    rol_id: '',
    
    // Personal (opcional)
    esPersonal: false,
    nombres: '',
    apellidos: '',
    dpi: '',
    fecha_nac: '',
    telefono_personal: '',
    email_personal: '',
    direccion: '',
    
    // Médico (opcional)
    esMedico: false,
    especialidad_id: '',
    colegiado: '',
    firma_digital: '',
    medico_activo: true
  });

  // Protección de ruta
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Cargar datos iniciales
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  // Si es edición, cargar datos del usuario
  useEffect(() => {
    if (usuarioId && user) {
      loadUsuario();
    }
  }, [usuarioId, user]);

  const loadInitialData = async () => {
    try {
      const [rolesRes, especialidadesRes] = await Promise.all([
        rolesService.getAll(),
        especialidadesService.getAll()
      ]);
      
      console.log('📦 Respuesta de roles:', rolesRes);
      console.log('📦 rolesRes.data:', rolesRes.data);
      console.log('📦 rolesRes.data.data:', rolesRes.data.data);
      
      // Roles: Verificar si viene con paginación o array directo
      let rolesData = [];
      if (Array.isArray(rolesRes.data.data)) {
        // Array directo
        rolesData = rolesRes.data.data;
      } else if (rolesRes.data.data && rolesRes.data.data.data) {
        // Con paginación: data.data.data
        rolesData = rolesRes.data.data.data;
      }
      
      console.log('✅ Roles procesados:', rolesData);
      console.log('✅ Primer rol:', rolesData[0]);
      console.log('✅ JSON roles:', JSON.stringify(rolesData, null, 2));
      setRoles(rolesData);
      
      // Especialidades: API real devuelve data.data.data
      const especialidadesData = especialidadesRes.data.data.data || especialidadesRes.data.data || [];
      setEspecialidades(especialidadesData);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    }
  };

  const loadUsuario = async () => {
    try {
      setLoading(true);
      const response = await usuariosService.getById(usuarioId);
      const usuario = response.data.data;
      
      if (usuario) {
        setFormData({
          username: usuario.username || '',
          email: usuario.email || '',
          password: '',
          confirmPassword: '',
          telefono: usuario.telefono || '',
          activo: usuario.activo,
          rol_id: usuario.roles?.[0]?.id || '',
          esPersonal: !!usuario.personal,
          nombres: usuario.personal?.nombres || '',
          apellidos: usuario.personal?.apellidos || '',
          dpi: usuario.personal?.dpi || '',
          fecha_nac: usuario.personal?.fecha_nac || '',
          telefono_personal: usuario.personal?.telefono || '',
          email_personal: usuario.personal?.email || '',
          direccion: usuario.personal?.direccion || '',
          esMedico: !!usuario.personal?.medico,
          especialidad_id: usuario.personal?.medico?.especialidad?.id || '',
          colegiado: usuario.personal?.medico?.colegiado || '',
          firma_digital: usuario.personal?.medico?.firma_digital || '',
          medico_activo: usuario.personal?.medico?.activo || true
        });
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRolChange = (rolId) => {
    const rol = roles.find(r => r.id == rolId); // Comparación flexible (== en vez de ===)
    const rolNombre = rol?.nombre || '';
    
    console.log('🎭 Rol seleccionado:', { rolId, rol, rolNombre });
    console.log('🎭 Roles disponibles:', roles);
    
    // Normalizar nombres (sin tildes, minúsculas)
    const nombreNorm = rolNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const esAdmin = nombreNorm === 'administrativo';
    const esMed = nombreNorm === 'medico';
    
    setFormData(prev => ({
      ...prev,
      rol_id: rolId,
      esPersonal: esAdmin || esMed,
      esMedico: esMed
    }));
    
    console.log('🎭 Estado actualizado:', { esPersonal: esAdmin || esMed, esMedico: esMed });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar credenciales
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    // Validar contraseña
    if (!usuarioId) {
      // Modo creación: contraseña es obligatoria
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    } else {
      // Modo edición: contraseña es opcional, pero si se proporciona debe ser válida
      if (formData.password) {
        if (formData.password.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
      }
    }
    
    if (!formData.rol_id) {
      newErrors.rol_id = 'Debe seleccionar un rol';
    }
    
    // Validar personal si es necesario
    if (formData.esPersonal) {
      if (!formData.nombres.trim()) {
        newErrors.nombres = 'El nombre es requerido';
      }
      if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son requeridos';
      }
    }
    
    // Validar médico si es necesario
    if (formData.esMedico) {
      if (!formData.especialidad_id) {
        newErrors.especialidad_id = 'La especialidad es requerida';
      }
      if (!formData.colegiado.trim()) {
        newErrors.colegiado = 'El número de colegiado es requerido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (usuarioId) {
        // Actualizar usuario - PUT /usuarios/{id}
        // Puede actualizar: username, email, password, telefono
        const updateData = {
          username: formData.username,
          email: formData.email,
          telefono: formData.telefono
        };
        
        // Solo incluir password si se proporcionó uno nuevo
        if (formData.password && formData.password.trim() !== '') {
          updateData.password = formData.password;
        }
        
        console.log('📤 Actualizando usuario:', updateData);
        await usuariosService.update(usuarioId, updateData);
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear usuario
        await usuariosService.create(formData);
        alert('Usuario creado exitosamente');
      }
      
      router.push('/usuarios');
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert('Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {usuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h1>
            <p className={styles.subtitle}>
              {usuarioId 
                ? 'Actualiza la información del usuario'
                : 'Completa el formulario para crear un nuevo usuario'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sección 1: Credenciales */}
          <Card title="Credenciales de Acceso">
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Usuario <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                  placeholder="Ej: jperez"
                />
                {errors.username && (
                  <span className={styles.errorText}>{errors.username}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={styles.input}
                  placeholder="usuario@ejemplo.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Contraseña {!usuarioId && <span className={styles.required}>*</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  placeholder={usuarioId ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
                />
                {errors.password && (
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Confirmar Contraseña {!usuarioId && <span className={styles.required}>*</span>}
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  placeholder="Confirmar contraseña"
                />
                {errors.confirmPassword && (
                  <span className={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Teléfono</label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className={styles.input}
                  placeholder="+502 1234-5678"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => handleChange('activo', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Usuario activo</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Sección 2: Rol */}
          <Card title="Rol del Usuario">
            <div className={styles.rolesContainer}>
              {roles.map((rol) => (
                <label key={rol.id} className={styles.roleCard}>
                  <input
                    type="radio"
                    name="rol"
                    value={rol.id}
                    checked={formData.rol_id === rol.id}
                    onChange={(e) => handleRolChange(e.target.value)}
                    className={styles.radioInput}
                  />
                  <div className={styles.roleContent}>
                    <span className={styles.roleName}>{rol.nombre}</span>
                    <span className={styles.roleDescription}>{rol.descripcion}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.rol_id && (
              <span className={styles.errorText}>{errors.rol_id}</span>
            )}
          </Card>

          {/* Sección 3: Datos de Personal */}
          {formData.esPersonal && (
            <Card title="Datos de Personal">
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Nombres <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombres}
                    onChange={(e) => handleChange('nombres', e.target.value)}
                    className={`${styles.input} ${errors.nombres ? styles.inputError : ''}`}
                    placeholder="Ej: Juan Carlos"
                  />
                  {errors.nombres && (
                    <span className={styles.errorText}>{errors.nombres}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Apellidos <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    className={`${styles.input} ${errors.apellidos ? styles.inputError : ''}`}
                    placeholder="Ej: Pérez García"
                  />
                  {errors.apellidos && (
                    <span className={styles.errorText}>{errors.apellidos}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>DPI</label>
                  <input
                    type="text"
                    value={formData.dpi}
                    onChange={(e) => handleChange('dpi', e.target.value)}
                    className={styles.input}
                    placeholder="1234567890101"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.fecha_nac}
                    onChange={(e) => handleChange('fecha_nac', e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono Personal</label>
                  <input
                    type="tel"
                    value={formData.telefono_personal}
                    onChange={(e) => handleChange('telefono_personal', e.target.value)}
                    className={styles.input}
                    placeholder="+502 1234-5678"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Personal</label>
                  <input
                    type="email"
                    value={formData.email_personal}
                    onChange={(e) => handleChange('email_personal', e.target.value)}
                    className={styles.input}
                    placeholder="personal@ejemplo.com"
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Dirección</label>
                  <textarea
                    value={formData.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    className={styles.textarea}
                    rows="3"
                    placeholder="Dirección completa"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Sección 4: Datos de Médico */}
          {formData.esMedico && (
            <Card title="Datos de Médico">
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Especialidad <span className={styles.required}>*</span>
                  </label>
                  <select
                    value={formData.especialidad_id}
                    onChange={(e) => handleChange('especialidad_id', e.target.value)}
                    className={`${styles.select} ${errors.especialidad_id ? styles.inputError : ''}`}
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.especialidad_id && (
                    <span className={styles.errorText}>{errors.especialidad_id}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Número de Colegiado <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.colegiado}
                    onChange={(e) => handleChange('colegiado', e.target.value)}
                    className={`${styles.input} ${errors.colegiado ? styles.inputError : ''}`}
                    placeholder="COLEGIO-GT-12345"
                  />
                  {errors.colegiado && (
                    <span className={styles.errorText}>{errors.colegiado}</span>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label}>Firma Digital</label>
                  <input
                    type="text"
                    value={formData.firma_digital}
                    onChange={(e) => handleChange('firma_digital', e.target.value)}
                    className={styles.input}
                    placeholder="URL o base64 de la firma"
                  />
                  <small className={styles.helpText}>
                    Puede ingresar una URL o base64 de la imagen de la firma
                  </small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={formData.medico_activo}
                      onChange={(e) => handleChange('medico_activo', e.target.checked)}
                      className={styles.checkbox}
                    />
                    <span>Médico activo</span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Botones de acción */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/usuarios')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (usuarioId ? 'Actualizar Usuario' : 'Crear Usuario')}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default UsuarioFormPage;
