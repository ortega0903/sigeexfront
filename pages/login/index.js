import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../../components/LoginForm';
import { login } from '../../utils/auth';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const data = await login(email, password);
      console.log('Login exitoso:', data);
      setUser(data.user);
      router.push('/');
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || 'Error en el login. Verifica tus credenciales.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2c3e90 0%, #1e2870 100%)',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-5%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      {/* Card principal */}
      <div style={{
        background: 'white',
        padding: '48px 40px',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo/Icono */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #2c3e90 0%, #1e2870 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 16px rgba(44, 62, 144, 0.3)'
        }}>
          <span style={{ fontSize: '36px', color: 'white', fontWeight: 'bold' }}>S</span>
        </div>

        {/* Título */}
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '8px', 
          color: '#1e2870',
          fontSize: '32px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          SIGEEX
        </h1>
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '40px', 
          color: '#6b7280',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          Sistema de Gestión de Expedientes - Wilson Ortega
        </p>

        {/* Mensaje de error */}
        {error && (
          <div style={{ 
            color: '#dc2626', 
            background: '#fee2e2', 
            padding: '14px 16px', 
            borderRadius: '10px',
            border: '1px solid #fecaca',
            marginBottom: '24px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Mensaje de carga */}
        {loading && (
          <div style={{ 
            color: '#2c3e90', 
            textAlign: 'center', 
            marginBottom: '24px', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #2c3e90',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Iniciando sesión...
          </div>
        )}

        <LoginForm onLogin={handleLogin} />

        <p style={{ 
          marginTop: '32px', 
          textAlign: 'center', 
          fontSize: '13px', 
          color: '#9ca3af',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '24px'
        }}>
          ¿No tienes cuenta? <span style={{ color: '#2c3e90', fontWeight: '600', cursor: 'pointer' }}>Contacta al administrador</span>
        </p>
      </div>

      {/* Estilos para animación */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          div {
            padding: 32px 24px !important;
          }
        }

        @media (max-width: 400px) {
          div {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;