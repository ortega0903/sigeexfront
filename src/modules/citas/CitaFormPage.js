import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../../components/layout/MainLayout';
import * as citasService from '../../services/citasService';
import * as pacientesService from '../../services/pacientesService';
import styles from './CitaFormPage.module.css';

export default function CitaFormPage() {
  const router = useRouter();
  const { id, pacienteId } = router.query;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [searchPaciente, setSearchPaciente] = useState('');
  const [showPacienteSuggestions, setShowPacienteSuggestions] = useState(false);
  
  const [formData, setFormData] = useState({
    paciente_id: pacienteId || '',
    medico_id: '',
    fecha: '',
    hora: '',
    motivo: '',
    notas: '',
    estado: 'pendiente'
  });

  // Mock medicos - In production, this would come from an API
  const medicos = [
    { id: 1, nombre: 'Juan', apellido_paterno: 'García', apellido_materno: 'López', especialidad: 'Medicina General' },
    { id: 2, nombre: 'María', apellido_paterno: 'Rodríguez', apellido_materno: 'Martínez', especialidad: 'Pediatría' },
    { id: 3, nombre: 'Pedro', apellido_paterno: 'Hernández', apellido_materno: 'González', especialidad: 'Cardiología' },
    { id: 4, nombre: 'Ana', apellido_paterno: 'Martínez', apellido_materno: 'Sánchez', especialidad: 'Ginecología' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      loadCita();
    }
  }, [id]);

  useEffect(() => {
    if (pacienteId) {
      setFormData(prev => ({ ...prev, paciente_id: pacienteId }));
    }
  }, [pacienteId]);

  useEffect(() => {
    if (searchPaciente.length >= 2) {
      searchPacientes();
    }
  }, [searchPaciente]);

  const loadCita = async () => {
    try {
      setLoading(true);
      const response = await citasService.getById(id);
      if (response.success) {
        const cita = response.data;
        setFormData({
          paciente_id: cita.paciente_id,
          medico_id: cita.medico_id,
          fecha: cita.fecha,
          hora: cita.hora,
          motivo: cita.motivo,
          notas: cita.notas || '',
          estado: cita.estado
        });
      } else {
        setError('Error al cargar cita');
      }
    } catch (err) {
      setError('Error al cargar cita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchPacientes = async () => {
    try {
      const response = await pacientesService.search(searchPaciente);
      if (response.success) {
        setPacientes(response.data);
        setShowPacienteSuggestions(true);
      }
    } catch (err) {
      console.error('Error al buscar pacientes:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePacienteSearch = (e) => {
    setSearchPaciente(e.target.value);
  };

  const selectPaciente = (paciente) => {
    setFormData(prev => ({ ...prev, paciente_id: paciente.id }));
    setSearchPaciente(`${paciente.nombres} ${paciente.apellidos}`);
    setShowPacienteSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.paciente_id) {
      alert('Por favor seleccione un paciente');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (isEdit) {
        response = await citasService.update(id, formData);
      } else {
        response = await citasService.create(formData);
      }
      
      if (response.success) {
        router.push('/citas');
      } else {
        setError('Error al guardar cita');
      }
    } catch (err) {
      setError('Error al guardar cita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/citas');
  };

  const getSelectedPaciente = () => {
    if (!formData.paciente_id) return null;
    return pacientes.find(p => p.id === parseInt(formData.paciente_id));
  };

  const selectedPaciente = getSelectedPaciente();

  return (
    <MainLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{isEdit ? 'Editar Cita' : 'Nueva Cita'}</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>Información de la Cita</h2>
            <div className={styles.grid}>
              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="paciente">Paciente *</label>
                <div className={styles.autocompleteContainer}>
                  <input
                    type="text"
                    id="paciente"
                    value={searchPaciente}
                    onChange={handlePacienteSearch}
                    onFocus={() => searchPaciente.length >= 2 && setShowPacienteSuggestions(true)}
                    placeholder="Buscar paciente por nombre o DPI..."
                    className={styles.input}
                    required={!formData.paciente_id}
                  />
                  {showPacienteSuggestions && pacientes.length > 0 && (
                    <div className={styles.suggestions}>
                      {pacientes.map((paciente) => (
                        <div
                          key={paciente.id}
                          className={styles.suggestionItem}
                          onClick={() => selectPaciente(paciente)}
                        >
                          <strong>{paciente.nombres} {paciente.apellidos}</strong>
                          <br />
                          <small>{paciente.dpi}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {selectedPaciente && (
                  <div className={styles.selectedInfo}>
                    Paciente seleccionado: <strong>{selectedPaciente.nombres} {selectedPaciente.apellidos}</strong>
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="medico_id">Médico *</label>
                <select
                  id="medico_id"
                  name="medico_id"
                  value={formData.medico_id}
                  onChange={handleChange}
                  required
                  className={styles.input}
                >
                  <option value="">Seleccione un médico...</option>
                  {medicos.map((medico) => (
                    <option key={medico.id} value={medico.id}>
                      Dr. {medico.nombre} {medico.apellido_paterno} - {medico.especialidad}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hora">Hora *</label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              {isEdit && (
                <div className={styles.formGroup}>
                  <label htmlFor="estado">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
              )}

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="motivo">Motivo de Consulta *</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Describa el motivo de la consulta"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="notas">Notas Adicionales</label>
                <textarea
                  id="notas"
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Notas adicionales (opcional)"
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
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar Cita' : 'Agendar Cita')}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
