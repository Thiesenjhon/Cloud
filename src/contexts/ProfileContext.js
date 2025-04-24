// src/contexts/ProfileContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getUserProfile,
  updateUserProfile,
  addGoal,
  getUserGoals,
  completeGoal,
  uncompleteGoal,
  deleteGoal,
  getUserAchievements,
  saveAccessibilitySettings,
  getAccessibilitySettings,
  addFamilyMember,
  getFamilyMembers,
  removeFamilyMember
} from '../services/profile';
import { useAuth } from './AuthContext';

// Criar o contexto de perfil
const ProfileContext = createContext();

// Hook personalizado para usar o contexto de perfil
export const useProfile = () => {
  return useContext(ProfileContext);
};

// Provedor de perfil
export const ProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [goals, setGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'normal',
    theme: 'light',
    notifications: true
  });
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar perfil do usuário
  const loadProfile = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      const result = await getUserProfile(currentUser.uid);
      if (result.success) {
        setProfile(result.profile);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil do usuário
  const updateProfile = async (profileData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await updateUserProfile(currentUser.uid, profileData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar o perfil local
      await loadProfile();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Adicionar uma meta
  const addNewGoal = async (goalData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await addGoal(currentUser.uid, goalData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de metas
      await loadGoals();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar metas do usuário
  const loadGoals = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getUserGoals(currentUser.uid);
      if (result.success) {
        setGoals(result.goals);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Marcar meta como concluída
  const markGoalComplete = async (goalId) => {
    setError(null);
    try {
      const result = await completeGoal(goalId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de metas
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId 
            ? { ...goal, completed: true, completedAt: new Date() } 
            : goal
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Desmarcar meta como concluída
  const markGoalIncomplete = async (goalId) => {
    setError(null);
    try {
      const result = await uncompleteGoal(goalId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de metas
      setGoals(prevGoals => 
        prevGoals.map(goal => 
          goal.id === goalId 
            ? { ...goal, completed: false, completedAt: null } 
            : goal
        )
      );
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Excluir meta
  const removeGoal = async (goalId) => {
    setError(null);
    try {
      const result = await deleteGoal(goalId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de metas
      setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar conquistas do usuário
  const loadAchievements = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getUserAchievements(currentUser.uid);
      if (result.success) {
        setAchievements(result.achievements);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Salvar configurações de acessibilidade
  const saveSettings = async (settings) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await saveAccessibilitySettings(currentUser.uid, settings);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar as configurações locais
      setAccessibilitySettings(settings);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar configurações de acessibilidade
  const loadAccessibilitySettings = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getAccessibilitySettings(currentUser.uid);
      if (result.success) {
        setAccessibilitySettings(result.settings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Adicionar familiar para compartilhamento
  const addFamily = async (familyEmail) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await addFamilyMember(currentUser.uid, familyEmail);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de familiares
      await loadFamilyMembers();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar familiares com acesso
  const loadFamilyMembers = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getFamilyMembers(currentUser.uid);
      if (result.success) {
        setFamilyMembers(result.familyMembers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Remover familiar
  const removeFamily = async (sharingId) => {
    setError(null);
    try {
      const result = await removeFamilyMember(sharingId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de familiares
      setFamilyMembers(prevMembers => prevMembers.filter(member => member.id !== sharingId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Efeito para carregar dados quando o usuário muda
  useEffect(() => {
    if (currentUser) {
      loadProfile();
      loadGoals();
      loadAchievements();
      loadAccessibilitySettings();
      loadFamilyMembers();
    } else {
      setProfile(null);
      setGoals([]);
      setAchievements([]);
      setAccessibilitySettings({
        fontSize: 'normal',
        theme: 'light',
        notifications: true
      });
      setFamilyMembers([]);
    }
  }, [currentUser]);

  // Valor do contexto
  const value = {
    profile,
    goals,
    achievements,
    accessibilitySettings,
    familyMembers,
    loading,
    error,
    updateProfile,
    addNewGoal,
    markGoalComplete,
    markGoalIncomplete,
    removeGoal,
    saveSettings,
    addFamily,
    removeFamily,
    refreshData: () => {
      loadProfile();
      loadGoals();
      loadAchievements();
      loadAccessibilitySettings();
      loadFamilyMembers();
    }
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
