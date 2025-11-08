import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      width: '100%'
    }}>
      {/* Campo de Email */}
      <div style={{ position: 'relative' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Correo Electrónico
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#9ca3af'
          }}>
            📧
          </span>
          <input
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%',
              padding: '14px 16px 14px 48px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2c3e90';
              e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 144, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>
      </div>

      {/* Campo de Contraseña */}
      <div style={{ position: 'relative' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          Contraseña
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '18px',
            color: '#9ca3af'
          }}>
            🔒
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%',
              padding: '14px 48px 14px 48px',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '15px',
              transition: 'all 0.3s',
              outline: 'none',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2c3e90';
              e.target.style.boxShadow = '0 0 0 3px rgba(44, 62, 144, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
      </div>

      {/* Botón de Login */}
      <button 
        type="submit" 
        style={{ 
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, #2c3e90 0%, #1e2870 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'all 0.3s',
          boxShadow: '0 4px 12px rgba(44, 62, 144, 0.3)',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 16px rgba(44, 62, 144, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(44, 62, 144, 0.3)';
        }}
      >
        Iniciar Sesión
      </button>

      {/* Estilos responsive */}
      <style jsx>{`
        @media (max-width: 640px) {
          input {
            font-size: 16px !important;
          }
          button[type="submit"] {
            padding: 14px !important;
            font-size: 15px !important;
          }
        }
      `}</style>
    </form>
  );
};

export default LoginForm;