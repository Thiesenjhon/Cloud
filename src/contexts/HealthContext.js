// src/contexts/HealthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  addHealthRecord, 
  getHealthHistory, 
  getHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  addHealthReminder,
  getHealthReminders,
  generateHealthReport
} from '../services/health';
import { useAuth } from './AuthContext';

// Criar o contexto de saúde
const HealthContext = createContext();

// Hook personalizado para usar o contexto de saúde
export const useHealth = () => {
  return useContext(HealthContext);
};

// Provedor de saúde
export const HealthProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [healthRecords, setHealthRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registrar novos indicadores de saúde
  const addRecord = async (healthData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await addHealthRecord(currentUser.uid, healthData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de registros
      await loadHealthHistory();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar histórico de saúde
  const loadHealthHistory = async (limit = 30) => {
    setError(null);
    setLoading(true);
    try {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      const result = await getHealthHistory(currentUser.uid, limit);
      if (result.success) {
        setHealthRecords(result.records);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obter um registro específico
  const getRecord = async (recordId) => {
    setError(null);
    try {
      const result = await getHealthRecord(recordId);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      return result.record;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Atualizar um registro de saúde
  const updateRecord = async (recordId, healthData) => {
    setError(null);
    try {
      const result = await updateHealthRecord(recordId, healthData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de registros
      await loadHealthHistory();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Excluir um registro de saúde
  const deleteRecord = async (recordId) => {
    setError(null);
    try {
      const result = await deleteHealthRecord(recordId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de registros
      setHealthRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Adicionar um lembrete de saúde
  const addReminder = async (reminderData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await addHealthReminder(currentUser.uid, reminderData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de lembretes
      await loadReminders();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar lembretes de saúde
  const loadReminders = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getHealthReminders(currentUser.uid);
      if (result.success) {
        setReminders(result.reminders);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Gerar relatório de saúde
  const generateReport = async (startDate, endDate) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return null;
      }
      
      const result = await generateHealthReport(currentUser.uid, startDate, endDate);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      
      return result.report;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Efeito para carregar dados quando o usuário muda
  useEffect(() => {
    if (currentUser) {
      loadHealthHistory();
      loadReminders();
    } else {
      setHealthRecords([]);
      setReminders([]);
    }
  }, [currentUser]);

  // Valor do contexto
  const value = {
    healthRecords,
    reminders,
    loading,
    error,
    addRecord,
    getRecord,
    updateRecord,
    deleteRecord,
    addReminder,
    generateReport,
    refreshData: () => {
      loadHealthHistory();
      loadReminders();
    }
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};
