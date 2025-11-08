import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import * as pacientesService from '../../services/pacientesService';
import styles from './PacienteFormPage.module.css';

export default function PacienteFormPage() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dpi: '',
    nombres: '',
    apellidos: '',
    fecha_nac: '',
    sexo: 'M',
    telefono: '',
    email: '',
    direccion: '',
    tipo_sangre: '',
    alergias: ''
  });

  useEffect(() => {
    if (isEdit && id) {
      loadPaciente();
    }
  }, [id]);

  const loadPaciente = async () => {
    try {
      setLoading(true);
      const response = await pacientesService.getById(id);
      if (response.success) {
        setFormData(response.data);
      } else {
        setError('Error al cargar paciente');
      }
    } catch (err) {
      setError('Error al cargar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isEdit) {
        response = await pacientesService.update(id, formData);
      } else {
        response = await pacientesService.create(formData);
      }
      
      if (response.success) {
        router.push('/pacientes');
      } else {
        setError('Error al guardar paciente');
      }
    } catch (err) {
      setError('Error al guardar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/pacientes');
  };

  const handleCreateAndSchedule = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await pacientesService.create(formData);
      
      if (response.success) {
        router.push(`/citas/nueva?pacienteId=${response.data.id}`);
      } else {
        setError('Error al crear paciente');
      }
    } catch (err) {
      setError('Error al crear paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>Información Personal</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label htmlFor="dpi">DPI *</label>
                <input
                  type="text"
                  id="dpi"
                  name="dpi"
                  value={formData.dpi}
                  onChange={handleChange}
                  required
                  maxLength={13}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellido_paterno">Apellido Paterno *</label>
                <input
                  type="text"
                  id="apellido_paterno"
                  name="apellido_paterno"
                  value={formData.apellido_paterno}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apellido_materno">Apellido Materno</label>
                <input
                  type="text"
                  id="apellido_materno"
                  name="apellido_materno"
                  value={formData.apellido_materno}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sexo">Sexo *</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  required
                  className={styles.input}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Información de Contacto</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  rows={3}
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Información Médica</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label htmlFor="tipo_sangre">Tipo de Sangre</label>
                <select
                  id="tipo_sangre"
                  name="tipo_sangre"
                  value={formData.tipo_sangre}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Seleccione...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="alergias">Alergias</label>
                <textarea
                  id="alergias"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Separar por comas"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="enfermedades_cronicas">Enfermedades Crónicas</label>
                <textarea
                  id="enfermedades_cronicas"
                  name="enfermedades_cronicas"
                  value={formData.enfermedades_cronicas}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Separar por comas"
                  className={styles.textarea}
                />
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.btnCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            {!isEdit && (
              <button
                type="button"
                onClick={handleCreateAndSchedule}
                className={styles.btnSchedule}
                disabled={loading}
              >
                Crear y Agendar Cita
              </button>
            )}
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
