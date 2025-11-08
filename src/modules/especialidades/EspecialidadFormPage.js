import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getEspecialidadById, createEspecialidad, updateEspecialidad } from '../../services/especialidadesService';

export default function EspecialidadFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id && id !== 'nuevo';

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      cargarEspecialidad();
    }
  }, [id]);

  const cargarEspecialidad = async () => {
    try {
      setLoadingData(true);
      const response = await getEspecialidadById(id);
      const especialidad = response.data;
      setFormData({
        nombre: especialidad.nombre || '',
        descripcion: especialidad.descripcion || ''
      });
    } catch (err) {
      console.error('Error al cargar especialidad:', err);
      alert('Error al cargar los datos de la especialidad');
      router.push('/especialidades');
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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
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

      if (isEditMode) {
        await updateEspecialidad(id, formData);
      } else {
        await createEspecialidad(formData);
      }

      router.push('/especialidades');
    } catch (err) {
      console.error('Error al guardar especialidad:', err);
      alert('Error al guardar la especialidad');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos de la especialidad...
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
          {isEditMode ? 'Editar Especialidad' : 'Nueva Especialidad'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          {isEditMode ? 'Modifica los datos de la especialidad' : 'Completa el formulario para crear una nueva especialidad'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Nombre de la Especialidad *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Cardiología, Pediatría, Medicina General"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.nombre ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                transition: 'border-color 0.3s'
              }}
            />
            {errors.nombre && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.nombre}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el área de especialización y los servicios que ofrece"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.descripcion ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'border-color 0.3s'
              }}
            />
            {errors.descripcion && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.descripcion}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/especialidades')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Especialidad'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
