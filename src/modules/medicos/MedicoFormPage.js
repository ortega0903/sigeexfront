import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getMedicoById, createMedico, updateMedico } from '../../services/medicosService';
import { getPersonal } from '../../services/personalService';
import { getEspecialidades } from '../../services/especialidadesService';

export default function MedicoFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id && id !== 'nuevo';

  const [formData, setFormData] = useState({
    personal_id: '',
    especialidad_id: '',
    licencia_medica: '',
    colegio_medico: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  
  // Catálogos
  const [personalList, setPersonalList] = useState([]);
  const [especialidadesList, setEspecialidadesList] = useState([]);
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (isEditMode && personalList.length > 0 && especialidadesList.length > 0) {
      cargarMedico();
    }
  }, [id, personalList, especialidadesList]);

  const cargarCatalogos = async () => {
    try {
      setLoadingCatalogos(true);
      
      // Cargar personal y especialidades
      const [personalRes, especialidadesRes] = await Promise.all([
        getPersonal({ page: 1, limit: 100 }),
        getEspecialidades({ page: 1, limit: 100 })
      ]);
      
      setPersonalList(personalRes.data || []);
      setEspecialidadesList(especialidadesRes.data || []);
    } catch (err) {
      console.error('Error al cargar catálogos:', err);
      alert('Error al cargar los catálogos necesarios');
    } finally {
      setLoadingCatalogos(false);
    }
  };

  const cargarMedico = async () => {
    try {
      setLoadingData(true);
      const response = await getMedicoById(id);
      const medico = response.data;
      setFormData({
        personal_id: medico.personal_id || '',
        especialidad_id: medico.especialidad_id || '',
        licencia_medica: medico.licencia_medica || '',
        colegio_medico: medico.colegio_medico || ''
      });
    } catch (err) {
      console.error('Error al cargar médico:', err);
      alert('Error al cargar los datos del médico');
      router.push('/medicos');
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

    if (!formData.personal_id) {
      newErrors.personal_id = 'El personal es requerido';
    }

    if (!formData.especialidad_id) {
      newErrors.especialidad_id = 'La especialidad es requerida';
    }

    if (!formData.licencia_medica.trim() || formData.licencia_medica.length < 5) {
      newErrors.licencia_medica = 'La licencia médica es requerida (mínimo 5 caracteres)';
    }

    if (!formData.colegio_medico.trim() || formData.colegio_medico.length < 4) {
      newErrors.colegio_medico = 'El número de colegio médico es requerido (mínimo 4 caracteres)';
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
        personal_id: parseInt(formData.personal_id),
        especialidad_id: parseInt(formData.especialidad_id),
        licencia_medica: formData.licencia_medica,
        colegio_medico: formData.colegio_medico
      };

      if (isEditMode) {
        await updateMedico(id, dataToSend);
      } else {
        await createMedico(dataToSend);
      }

      router.push('/medicos');
    } catch (err) {
      console.error('Error al guardar médico:', err);
      alert('Error al guardar los datos del médico');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCatalogos) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando formulario...
          </div>
        </Card>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos del médico...
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
          {isEditMode ? 'Editar Médico' : 'Nuevo Médico'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          {isEditMode ? 'Modifica los datos del médico' : 'Registra un nuevo médico especialista'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Personal *
            </label>
            <select
              name="personal_id"
              value={formData.personal_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.personal_id ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">Seleccione el personal</option>
              {personalList.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombres} {persona.apellidos} - DPI: {persona.dpi}
                </option>
              ))}
            </select>
            {errors.personal_id && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.personal_id}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', marginBottom: 0 }}>
              Seleccione la persona del personal que será registrada como médico
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Especialidad *
            </label>
            <select
              name="especialidad_id"
              value={formData.especialidad_id}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.especialidad_id ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="">Seleccione la especialidad</option>
              {especialidadesList
                .filter(e => e.activo)
                .map(especialidad => (
                  <option key={especialidad.id} value={especialidad.id}>
                    {especialidad.nombre}
                  </option>
                ))}
            </select>
            {errors.especialidad_id && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.especialidad_id}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Licencia Médica *
              </label>
              <input
                type="text"
                name="licencia_medica"
                value={formData.licencia_medica}
                onChange={handleChange}
                placeholder="Ej: LIC-2024-001"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.licencia_medica ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.licencia_medica && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.licencia_medica}
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                Colegio Médico *
              </label>
              <input
                type="text"
                name="colegio_medico"
                value={formData.colegio_medico}
                onChange={handleChange}
                placeholder="Número de colegiado"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.colegio_medico ? '#d32f2f' : '#e0e0e0'}`,
                  fontSize: '14px'
                }}
              />
              {errors.colegio_medico && (
                <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                  {errors.colegio_medico}
                </p>
              )}
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '32px',
            border: '1px solid #e0e0e0'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              <strong>Nota:</strong> La licencia médica y el número de colegiado son datos únicos 
              que identifican al médico. Asegúrese de ingresarlos correctamente.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/medicos')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar Médico' : 'Crear Médico'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
