// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut } from '../api/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, nombre, email, rol, token, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar usuario desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const login = (userData) => {
    if (userData && typeof userData === 'object' && userData.token) {
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  // Registro (retorna la respuesta para manejar en UI)
  const register = async (userData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiPost('auth/register', userData);
      if (res.msg) {
        setError(res.msg);
        return res;
      }
      setSuccess('Registro correcto. Por favor inicia sesión.');
      return res;
    } catch (err) {
      setError('Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async ({ email, password }) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiPost('auth/login', { email, password });
      if (res.msg) {
        setError(res.msg);
        return null;
      }
      const payload = { ...res.usuario, token: res.token };
      login(payload);
      setSuccess('Login exitoso');
      return payload;
    } catch (err) {
      setError('Error en login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar perfil del usuario autenticado
  const updateProfile = async (updatedData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // 🔒 Restricciones para usuarios normales
      if (user?.rol === 'usuario') {
        delete updatedData.direccion;
        delete updatedData.barrio;
        delete updatedData.email;
        delete updatedData.tipoDocumento;
        delete updatedData.documento;
      }

      const token = user?.token;
      const res = await apiPut('auth/me', updatedData, token);
      if (res.msg || res.error) {
        setError(res.msg || 'Error al actualizar perfil');
        return null;
      }

      // Actualizar estado y storage (manteniendo token)
      const updatedUser = { ...user, ...res, token: user.token };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setSuccess('Perfil actualizado');
      return res;
    } catch (err) {
      setError('Error al actualizar perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener mis préstamos (helper)
  const fetchMyLoans = async () => {
    setLoading(true);
    setError('');
    try {
      const token = user?.token;
      const res = await apiGet('loans/mis-prestamos', token);
      if (res.msg) {
        setError(res.msg);
        return [];
      }
      return res;
    } catch (err) {
      setError('Error al obtener préstamos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login: doLogin,
    logout,
    register,
    loading,
    error,
    success,
    clearMessages,
    updateProfile,
    fetchMyLoans,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};