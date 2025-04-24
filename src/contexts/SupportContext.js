// src/contexts/SupportContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  sendSupportMessage,
  getSupportHistory,
  getFAQs,
  scheduleVideoCall,
  getScheduledAppointments,
  cancelAppointment,
  getAppointmentHistory,
  joinVideoCall
} from '../services/support';
import { useAuth } from './AuthContext';

// Criar o contexto de suporte
const SupportContext = createContext();

// Hook personalizado para usar o contexto de suporte
export const useSupport = () => {
  return useContext(SupportContext);
};

// Provedor de suporte
export const SupportProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [supportMessages, setSupportMessages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [scheduledAppointments, setScheduledAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enviar mensagem para o suporte
  const sendMessage = async (messageData, attachmentFile = null) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await sendSupportMessage(currentUser.uid, messageData, attachmentFile);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de mensagens
      await loadSupportHistory();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar histórico de mensagens de suporte
  const loadSupportHistory = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      const result = await getSupportHistory(currentUser.uid);
      if (result.success) {
        setSupportMessages(result.messages);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar perguntas frequentes
  const loadFAQs = async () => {
    setError(null);
    try {
      const result = await getFAQs();
      if (result.success) {
        setFaqs(result.faqs);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Agendar atendimento por vídeo
  const scheduleAppointment = async (appointmentData) => {
    setError(null);
    try {
      if (!currentUser) {
        setError("Usuário não autenticado");
        return false;
      }
      
      const result = await scheduleVideoCall(currentUser.uid, appointmentData);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de agendamentos
      await loadScheduledAppointments();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar atendimentos por vídeo agendados
  const loadScheduledAppointments = async () => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getScheduledAppointments(currentUser.uid);
      if (result.success) {
        setScheduledAppointments(result.appointments);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Cancelar atendimento por vídeo
  const cancelScheduledAppointment = async (appointmentId) => {
    setError(null);
    try {
      const result = await cancelAppointment(appointmentId);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      // Atualizar a lista de agendamentos
      setScheduledAppointments(prevAppointments => 
        prevAppointments.filter(appointment => appointment.id !== appointmentId)
      );
      await loadAppointmentHistory();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Carregar histórico de atendimentos por vídeo
  const loadAppointmentHistory = async (limit = 10) => {
    setError(null);
    try {
      if (!currentUser) {
        return;
      }
      
      const result = await getAppointmentHistory(currentUser.uid, limit);
      if (result.success) {
        setAppointmentHistory(result.appointments);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Entrar em uma chamada de vídeo
  const joinAppointment = async (appointmentId) => {
    setError(null);
    try {
      const result = await joinVideoCall(appointmentId);
      if (!result.success) {
        setError(result.error);
        return null;
      }
      
      return result.callUrl;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Efeito para carregar dados quando o usuário muda
  useEffect(() => {
    loadFAQs(); // Carregar FAQs independentemente do login
    
    if (currentUser) {
      loadSupportHistory();
      loadScheduledAppointments();
      loadAppointmentHistory();
    } else {
      setSupportMessages([]);
      setScheduledAppointments([]);
      setAppointmentHistory([]);
    }
  }, [currentUser]);

  // Valor do contexto
  const value = {
    supportMessages,
    faqs,
    scheduledAppointments,
    appointmentHistory,
    loading,
    error,
    sendMessage,
    scheduleAppointment,
    cancelScheduledAppointment,
    joinAppointment,
    refreshData: () => {
      loadSupportHistory();
      loadFAQs();
      loadScheduledAppointments();
      loadAppointmentHistory();
    }
  };

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  );
};
