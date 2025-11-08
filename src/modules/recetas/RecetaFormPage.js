import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getRecetaById, createReceta, updateReceta } from '../../services/recetasService';

export default function RecetaFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id && id !== 'nuevo';

  const [formData, setFormData] = useState({
    consulta_id: '',
    medicamento: '',
    presentacion: '',
    via_administracion: 'ORAL',
    dosis: '',
    frecuencia: '',
    duracion: '',
    cantidad: '',
    indicaciones: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);

  const viasAdministracion = [
    'ORAL',
    'SUBLINGUAL',
    'INTRAVENOSA',
    'INTRAMUSCULAR',
    'SUBCUTANEA',
    'TOPICA',
    'OFTALMICA',
    'OTICA',
    'NASAL',
    'RECTAL',
    'INHALATORIA'
  ];

  useEffect(() => {
    if (isEditMode) {
      cargarReceta();
    }
  }, [id]);

  const cargarReceta = async () => {
    try {
      setLoadingData(true);
      const response = await getRecetaById(id);
      const receta = response.data;
      setFormData({
        consulta_id: receta.consulta_id || '',
        medicamento: receta.medicamento || '',
        presentacion: receta.presentacion || '',
        via_administracion: receta.via_administracion || 'ORAL',
        dosis: receta.dosis || '',
        frecuencia: receta.frecuencia || '',
        duracion: receta.duracion || '',
        cantidad: receta.cantidad || '',
        indicaciones: receta.indicaciones || ''
      });
    } catch (err) {
      console.error('Error al cargar receta:', err);
      alert('Error al cargar los datos de la receta');
      router.push('/recetas');
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

    if (!formData.consulta_id) {
      newErrors.consulta_id = 'El ID de consulta es requerido';
    }

    if (!formData.medicamento.trim()) {
      newErrors.medicamento = 'El nombre del medicamento es requerido';
    }

    if (!formData.presentacion.trim()) {
      newErrors.presentacion = 'La presentación es requerida';
    }

    if (!formData.dosis.trim()) {
      newErrors.dosis = 'La dosis es requerida';
    }

    if (!formData.frecuencia.trim()) {
      newErrors.frecuencia = 'La frecuencia es requerida';
    }

    if (!formData.duracion.trim()) {
      newErrors.duracion = 'La duración del tratamiento es requerida';
    }

    if (!formData.cantidad) {
      newErrors.cantidad = 'La cantidad es requerida';
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
        consulta_id: parseInt(formData.consulta_id),
        cantidad: parseFloat(formData.cantidad)
      };

      if (isEditMode) {
        await updateReceta(id, dataToSend);
      } else {
        await createReceta(dataToSend);
      }

      router.push('/recetas');
    } catch (err) {
      console.error('Error al guardar receta:', err);
      alert('Error al guardar la receta');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos de la receta...
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
          {isEditMode ? 'Editar Receta' : 'Nueva Receta Médica'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          {isEditMode ? 'Modifica los datos de la prescripción' : 'Registra una nueva prescripción médica'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                ID de Consulta *
              </label>
              <input
                type="number"
                name="consulta_id"
                value={formData.consulta_id}
                onChange={handleChange}
                placeholder="ID de la consulta"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.consulta_id ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.consulta_id && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.consulta_id}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Vía de Administración *
              </label>
              <select
                name="via_administracion"
                value={formData.via_administracion}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {viasAdministracion.map(via => (
                  <option key={via} value={via}>{via}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Medicamento *
            </label>
            <input
              type="text"
              name="medicamento"
              value={formData.medicamento}
              onChange={handleChange}
              placeholder="Nombre del medicamento"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.medicamento ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px'
              }}
            />
            {errors.medicamento && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.medicamento}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Presentación *
              </label>
              <input
                type="text"
                name="presentacion"
                value={formData.presentacion}
                onChange={handleChange}
                placeholder="Ej: Tabletas de 500mg"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.presentacion ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.presentacion && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.presentacion}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Dosis *
              </label>
              <input
                type="text"
                name="dosis"
                value={formData.dosis}
                onChange={handleChange}
                placeholder="Ej: 1 tableta"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.dosis ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.dosis && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.dosis}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Frecuencia *
              </label>
              <input
                type="text"
                name="frecuencia"
                value={formData.frecuencia}
                onChange={handleChange}
                placeholder="Ej: Cada 8 horas"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.frecuencia ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.frecuencia && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.frecuencia}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Duración *
              </label>
              <input
                type="text"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                placeholder="Ej: 7 días"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.duracion ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.duracion && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.duracion}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Cantidad *
              </label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                placeholder="Unidades a dispensar"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.cantidad ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.cantidad && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.cantidad}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Indicaciones
            </label>
            <textarea
              name="indicaciones"
              value={formData.indicaciones}
              onChange={handleChange}
              placeholder="Instrucciones adicionales para el paciente"
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/recetas')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Receta'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
