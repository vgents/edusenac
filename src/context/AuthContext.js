/**
 * AuthContext - Gerenciamento de autenticação
 * Controla fluxo: não logado -> AuthRoutes | aluno -> StudentRoutes | professor -> TeacherRoutes
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { login as apiLogin } from '../services/api';

const AUTH_STORAGE_KEY = '@edusenac_auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const stored = await storage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const loggedUser = await apiLogin(email, password);
    if (loggedUser) {
      setUser(loggedUser);
      await storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
      return { success: true };
    }
    return { success: false, error: 'Email ou senha inválidos' };
  };

  const logout = async () => {
    setUser(null);
    await storage.removeItem(AUTH_STORAGE_KEY);
  };

  const isStudent = user?.type === 'student';
  const isTeacher = user?.type === 'teacher';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isStudent,
        isTeacher,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
