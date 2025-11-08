import Card from '../../src/components/common/Card';

export default function HistoriaClinicaPage() {
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
          Historia Clínica
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
          Módulo en desarrollo
        </p>
      </div>

      <Card>
        <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
          <h2>Página en Desarrollo</h2>
          <p>Este módulo estará disponible próximamente.</p>
        </div>
      </Card>
    </div>
  );
}
