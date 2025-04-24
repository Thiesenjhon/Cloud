// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword, 
  getCurrentUser,
  onAuthChange,
  getUserProfile
} from '../services/auth';

// Criar o contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registrar um novo usuário
  const register = async (email, password, name, age) => {
    setError(null);
    try {
      const result = await registerUser(email, password, name, age);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Login de usuário
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await loginUser(email, password);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Logout de usuário
  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      setUserProfile(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Recuperação de senha
  const resetUserPassword = async (email) => {
    setError(null);
    try {
      const result = await resetPassword(email);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar perfil do usuário
  const loadUserProfile = async (userId) => {
    try {
      const result = await getUserProfile(userId);
      if (result.success) {
        setUserProfile(result.profile);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  // Efeito para observar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Limpar o observador ao desmontar
    return unsubscribe;
  }, []);

  // Valor do contexto
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    register,
    login,
    logout,
    resetUserPassword,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
