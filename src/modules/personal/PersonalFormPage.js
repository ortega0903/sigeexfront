import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getPersonalById, createPersonal, updatePersonal } from '../../services/personalService';

export default function PersonalFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id && id !== 'nuevo';

  const [formData, setFormData] = useState({
    usuario_id: '',
    nombres: '',
    apellidos: '',
    dpi: '',
    fecha_nacimiento: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      cargarPersonal();
    }
  }, [id]);

  const cargarPersonal = async () => {
    try {
      setLoadingData(true);
      const response = await getPersonalById(id);
      const persona = response.data;
      setFormData({
        usuario_id: persona.usuario_id || '',
        nombres: persona.nombres || '',
        apellidos: persona.apellidos || '',
        dpi: persona.dpi || '',
        fecha_nacimiento: persona.fecha_nacimiento ? persona.fecha_nacimiento.split('T')[0] : '',
        telefono: persona.telefono || '',
        email: persona.email || '',
        direccion: persona.direccion || ''
      });
    } catch (err) {
      console.error('Error al cargar personal:', err);
      alert('Error al cargar los datos del personal');
      router.push('/personal');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario_id) {
      newErrors.usuario_id = 'El ID de usuario es requerido';
    }

    if (!formData.nombres.trim() || formData.nombres.length < 2) {
      newErrors.nombres = 'Los nombres son requeridos (mínimo 2 caracteres)';
    }

    if (!formData.apellidos.trim() || formData.apellidos.length < 2) {
      newErrors.apellidos = 'Los apellidos son requeridos (mínimo 2 caracteres)';
    }

    if (!formData.dpi.trim() || formData.dpi.length !== 13) {
      newErrors.dpi = 'El DPI debe tener 13 dígitos';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.telefono.trim() || formData.telefono.length < 8) {
      newErrors.telefono = 'El teléfono es requerido (mínimo 8 dígitos)';
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'El email es requerido y debe ser válido';
    }

    if (!formData.direccion.trim() || formData.direccion.length < 10) {
      newErrors.direccion = 'La dirección es requerida (mínimo 10 caracteres)';
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

      const dataToSend = {
        ...formData,
        usuario_id: parseInt(formData.usuario_id)
      };

      if (isEditMode) {
        await updatePersonal(id, dataToSend);
      } else {
        await createPersonal(dataToSend);
      }

      router.push('/personal');
    } catch (err) {
      console.error('Error al guardar personal:', err);
      alert('Error al guardar los datos del personal');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos del personal...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #2c3e90 0%, #1e2870 100%)',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        color: 'white'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          {isEditMode ? 'Editar Personal' : 'Nuevo Personal'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          {isEditMode ? 'Modifica los datos del personal' : 'Registra un nuevo miembro del personal'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                ID de Usuario *
              </label>
              <input
                type="number"
                name="usuario_id"
                value={formData.usuario_id}
                onChange={handleChange}
                placeholder="ID del usuario relacionado"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.usuario_id ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.usuario_id && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.usuario_id}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                DPI *
              </label>
              <input
                type="text"
                name="dpi"
                value={formData.dpi}
                onChange={handleChange}
                placeholder="13 dígitos"
                maxLength={13}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.dpi ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.dpi && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.dpi}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Nombres *
              </label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Nombres completos"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.nombres ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.nombres && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.nombres}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Apellidos completos"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.apellidos ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.apellidos && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.apellidos}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.fecha_nacimiento ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.fecha_nacimiento && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.fecha_nacimiento}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="12345678"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.telefono ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.telefono && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.telefono}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@ejemplo.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.email ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.email && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Dirección *
            </label>
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección completa del personal"
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.direccion ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            {errors.direccion && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.direccion}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/personal')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Personal'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
