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
      // Actualizar contexto de autenticación
      setUser(data.user);
      // Redirigir al dashboard
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
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px', color: '#333' }}>
          SIGEEX
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666', fontSize: '14px' }}>
          Sistema de Gestión de Expedientes
        </p>
        {error && (
          <p style={{ 
            color: '#c00', 
            background: '#fee', 
            padding: '12px', 
            borderRadius: '4px',
            border: '1px solid #fcc',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </p>
        )}
        {loading && (
          <p style={{ color: '#667eea', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
            Iniciando sesión...
          </p>
        )}
        <LoginForm onLogin={handleLogin} />
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#999' }}>
          ¿No tienes cuenta? Contacta al administrador
        </p>
      </div>
    </div>
  );
};

export default LoginPage;