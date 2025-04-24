// src/services/support.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// Enviar mensagem para o suporte
export const sendSupportMessage = async (userId, messageData, attachmentFile = null) => {
  try {
    let attachmentUrl = null;
    
    // Se houver um arquivo anexo, fazer upload para o Storage
    if (attachmentFile) {
      const storageRef = ref(storage, `support-attachments/${userId}/${Date.now()}_${attachmentFile.name}`);
      await uploadBytes(storageRef, attachmentFile);
      attachmentUrl = await getDownloadURL(storageRef);
    }
    
    const supportMessage = {
      userId,
      subject: messageData.subject,
      message: messageData.message,
      attachmentUrl,
      status: 'pending', // pending, in-progress, resolved
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "supportMessages"), supportMessage);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter histórico de mensagens de suporte
export const getSupportHistory = async (userId) => {
  try {
    const messagesQuery = query(
      collection(db, "supportMessages"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return { success: true, messages };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter perguntas frequentes
export const getFAQs = async () => {
  try {
    const faqsQuery = query(
      collection(db, "faqs"),
      orderBy("order", "asc")
    );
    
    const querySnapshot = await getDocs(faqsQuery);
    const faqs = [];
    
    querySnapshot.forEach((doc) => {
      faqs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, faqs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Agendar atendimento por vídeo
export const scheduleVideoCall = async (userId, appointmentData) => {
  try {
    const appointment = {
      userId,
      subject: appointmentData.subject,
      date: new Date(appointmentData.date),
      specialist: appointmentData.specialist || null,
      notes: appointmentData.notes || '',
      status: 'scheduled', // scheduled, completed, cancelled
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "videoAppointments"), appointment);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter atendimentos por vídeo agendados
export const getScheduledAppointments = async (userId) => {
  try {
    const now = new Date();
    const appointmentsQuery = query(
      collection(db, "videoAppointments"),
      where("userId", "==", userId),
      where("date", ">=", now),
      where("status", "==", "scheduled"),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(appointmentsQuery);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cancelar atendimento por vídeo
export const cancelAppointment = async (appointmentId) => {
  try {
    const docRef = doc(db, "videoAppointments", appointmentId);
    await updateDoc(docRef, {
      status: 'cancelled',
      cancelledAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter histórico de atendimentos por vídeo
export const getAppointmentHistory = async (userId, limit = 10) => {
  try {
    const appointmentsQuery = query(
      collection(db, "videoAppointments"),
      where("userId", "==", userId),
      where("status", "in", ["completed", "cancelled"]),
      orderBy("date", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(appointmentsQuery);
    const appointments = [];
    
    querySnapshot.forEach((doc) => {
      appointments.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      });
    });
    
    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Entrar em uma chamada de vídeo
export const joinVideoCall = async (appointmentId) => {
  try {
    // Verificar se o agendamento existe e está no horário
    const docRef = doc(db, "videoAppointments", appointmentId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: "Agendamento não encontrado" };
    }
    
    const appointment = docSnap.data();
    const now = new Date();
    const appointmentDate = appointment.date.toDate();
    
    // Verificar se está dentro do período permitido (15 min antes até 15 min depois)
    const fifteenMinsBefore = new Date(appointmentDate);
    fifteenMinsBefore.setMinutes(appointmentDate.getMinutes() - 15);
    
    const fifteenMinsAfter = new Date(appointmentDate);
    fifteenMinsAfter.setMinutes(appointmentDate.getMinutes() + 15);
    
    if (now < fifteenMinsBefore || now > fifteenMinsAfter) {
      return { 
        success: false, 
        error: "Você só pode entrar na chamada 15 minutos antes ou depois do horário agendado" 
      };
    }
    
    // Gerar URL da chamada (em um sistema real, isso seria integrado com um serviço de videoconferência)
    const callUrl = `https://meet.revitalizafitness.com/${appointmentId}`;
    
    return { 
      success: true, 
      callUrl,
      appointment: {
        id: docSnap.id,
        ...appointment,
        date: appointment.date.toDate()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
