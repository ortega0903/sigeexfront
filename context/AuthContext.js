import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStoredUser, getStoredToken, logout as authLogout } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay token y usuario guardados
    const token = getStoredToken();
    const storedUser = getStoredUser();
    
    if (token && storedUser) {
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};