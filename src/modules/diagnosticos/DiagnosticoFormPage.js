import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getDiagnosticoById, createDiagnostico, updateDiagnostico, searchCIE10 } from '../../services/diagnosticosService';

export default function DiagnosticoFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = id && id !== 'nuevo';

  const [formData, setFormData] = useState({
    consulta_id: '',
    codigo_cie10: '',
    nombre_diagnostico: '',
    tipo: 'PRINCIPAL',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  
  // CIE-10 autocomplete
  const [cie10Results, setCie10Results] = useState([]);
  const [showCie10Dropdown, setShowCie10Dropdown] = useState(false);
  const [searchingCie10, setSearchingCie10] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      cargarDiagnostico();
    }
  }, [id]);

  const cargarDiagnostico = async () => {
    try {
      setLoadingData(true);
      const response = await getDiagnosticoById(id);
      const diagnostico = response.data;
      setFormData({
        consulta_id: diagnostico.consulta_id || '',
        codigo_cie10: diagnostico.codigo_cie10 || '',
        nombre_diagnostico: diagnostico.nombre_diagnostico || '',
        tipo: diagnostico.tipo || 'PRINCIPAL',
        observaciones: diagnostico.observaciones || ''
      });
    } catch (err) {
      console.error('Error al cargar diagnóstico:', err);
      alert('Error al cargar los datos del diagnóstico');
      router.push('/diagnosticos');
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

  const handleCie10Search = async (query) => {
    if (query.length < 2) {
      setCie10Results([]);
      setShowCie10Dropdown(false);
      return;
    }

    try {
      setSearchingCie10(true);
      const response = await searchCIE10(query);
      setCie10Results(response.data);
      setShowCie10Dropdown(true);
    } catch (err) {
      console.error('Error al buscar CIE-10:', err);
    } finally {
      setSearchingCie10(false);
    }
  };

  const handleCie10Select = (codigo, nombre) => {
    setFormData(prev => ({
      ...prev,
      codigo_cie10: codigo,
      nombre_diagnostico: nombre
    }));
    setShowCie10Dropdown(false);
    setCie10Results([]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.consulta_id) {
      newErrors.consulta_id = 'El ID de consulta es requerido';
    }

    if (!formData.codigo_cie10.trim()) {
      newErrors.codigo_cie10 = 'El código CIE-10 es requerido';
    }

    if (!formData.nombre_diagnostico.trim()) {
      newErrors.nombre_diagnostico = 'El nombre del diagnóstico es requerido';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo es requerido';
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
        consulta_id: parseInt(formData.consulta_id)
      };

      if (isEditMode) {
        await updateDiagnostico(id, dataToSend);
      } else {
        await createDiagnostico(dataToSend);
      }

      router.push('/diagnosticos');
    } catch (err) {
      console.error('Error al guardar diagnóstico:', err);
      alert('Error al guardar el diagnóstico');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Cargando datos del diagnóstico...
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
          {isEditMode ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico'}
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          {isEditMode ? 'Modifica los datos del diagnóstico' : 'Registra un nuevo diagnóstico según CIE-10'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
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

          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Buscar Código CIE-10 *
            </label>
            <input
              type="text"
              value={formData.codigo_cie10}
              onChange={(e) => {
                handleChange(e);
                handleCie10Search(e.target.value);
              }}
              name="codigo_cie10"
              placeholder="Busca por código o nombre (ej: I10, Hipertensión)"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.codigo_cie10 ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px'
              }}
            />
            {searchingCie10 && (
              <div style={{ position: 'absolute', right: '12px', top: '42px', color: '#666' }}>
                Buscando...
              </div>
            )}
            {showCie10Dropdown && cie10Results.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '4px'
              }}>
                {cie10Results.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleCie10Select(item.codigo, item.nombre)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '600', color: '#2c3e90' }}>{item.codigo}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{item.nombre}</div>
                  </div>
                ))}
              </div>
            )}
            {errors.codigo_cie10 && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.codigo_cie10}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Nombre del Diagnóstico *
            </label>
            <input
              type="text"
              name="nombre_diagnostico"
              value={formData.nombre_diagnostico}
              onChange={handleChange}
              placeholder="Nombre completo del diagnóstico"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.nombre_diagnostico ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px'
              }}
            />
            {errors.nombre_diagnostico && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.nombre_diagnostico}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Tipo de Diagnóstico *
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.tipo ? '#d32f2f' : '#e0e0e0'}`,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="PRINCIPAL">Principal</option>
              <option value="SECUNDARIO">Secundario</option>
            </select>
            {errors.tipo && (
              <p style={{ color: '#d32f2f', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>
                {errors.tipo}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Observaciones adicionales sobre el diagnóstico"
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
              onClick={() => router.push('/diagnosticos')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear Diagnóstico'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
