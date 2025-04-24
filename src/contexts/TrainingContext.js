// src/contexts/TrainingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getTrainingCatalog,
  getTrainingDetails,
  scheduleTraining,
  getScheduledTrainings,
  getTrainingHistory,
  completeTraining,
  cancelTraining,
  getWeeklySchedule
} from '../services/training';
import { useAuth } from './AuthContext';

// Criar o contexto de treinos
const TrainingContext = createContext();

// Hook personalizado para usar o contexto de treinos
export const useTraining = () => {
  return useContext(TrainingContext);
};

// Provedor de treinos
export const TrainingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [trainingCatalog, setTrainingCatalog] = useState([]);
  const [scheduledTrainings, setScheduledTrainings] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState(Array(7).fill().map(() => []));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar catálogo de treinos
  const loadTrainingCatalog = async (filters = {}) => {
    setError(null);
    setLoading(true);
    try {
      const result = await getTrainingCatalog(filters);
      if (result.success) {
        setTrainingCatalog(result.trainings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obter detalhes de um treino específico
  const getTraining = async (trainingId) => {
    setError(null);
    try {
      const result = await getTrainingDetails(trainingId);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.training;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Agendar um treino
  const scheduleNewTraining = async (trainingData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await scheduleTraining(currentUser.uid, trainingData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de treinos agendados
      await loadScheduledTrainings();
      await loadWeeklySchedule();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar treinos agendados
  const loadScheduledTrainings = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getScheduledTrainings(currentUser.uid);
      if (result.success) {
        setScheduledTrainings(result.trainings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Carregar histórico de treinos
  const loadTrainingHistory = async (limit = 30) => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getTrainingHistory(currentUser.uid, limit);
      if (result.success) {
        setTrainingHistory(result.trainings);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Marcar treino como concluído
  const markTrainingComplete = async (trainingId, rating, feedback) => {
    setError(null);
    try {
      const result = await completeTraining(trainingId, rating, feedback);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar listas
      await loadScheduledTrainings();
      await loadTrainingHistory();
      await loadWeeklySchedule();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Cancelar treino agendado
  const cancelScheduledTraining = async (trainingId) => {
    setError(null);
    try {
      const result = await cancelTraining(trainingId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar listas
      setScheduledTrainings(prevTrainings => prevTrainings.filter(training => training.id !== trainingId));
      await loadWeeklySchedule();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar agenda semanal
  const loadWeeklySchedule = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getWeeklySchedule(currentUser.uid);
      if (result.success) {
        setWeeklySchedule(result.weekSchedule);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Efeito para carregar dados quando o usuário muda
  useEffect(() => {
    if (currentUser) {
      loadTrainingCatalog();
      loadScheduledTrainings();
      loadTrainingHistory();
      loadWeeklySchedule();
    } else {
      setTrainingCatalog([]);
      setScheduledTrainings([]);
      setTrainingHistory([]);
      setWeeklySchedule(Array(7).fill().map(() => []));
    }
  }, [currentUser]);

  // Valor do contexto
  const value = {
    trainingCatalog,
    scheduledTrainings,
    trainingHistory,
    weeklySchedule,
    loading,
    error,
    loadTrainingCatalog,
    getTraining,
    scheduleNewTraining,
    markTrainingComplete,
    cancelScheduledTraining,
    refreshData: () => {
      loadTrainingCatalog();
      loadScheduledTrainings();
      loadTrainingHistory();
      loadWeeklySchedule();
    }
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
};
