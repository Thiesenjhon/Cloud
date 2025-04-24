// src/services/training.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Obter catálogo de treinos
export const getTrainingCatalog = async (filters = {}) => {
  try {
    let trainingQuery = query(
      collection(db, "trainings"),
      orderBy("createdAt", "desc")
    );
    
    // Aplicar filtros se fornecidos
    if (filters.level && filters.level !== 'Todos os níveis') {
      trainingQuery = query(
        trainingQuery,
        where("level", "==", filters.level)
      );
    }
    
    if (filters.category && filters.category !== 'Todas as categorias') {
      trainingQuery = query(
        trainingQuery,
        where("category", "==", filters.category)
      );
    }
    
    const querySnapshot = await getDocs(trainingQuery);
    const trainings = [];
    
    querySnapshot.forEach((doc) => {
      trainings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, trainings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter detalhes de um treino específico
export const getTrainingDetails = async (trainingId) => {
  try {
    const docRef = doc(db, "trainings", trainingId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        training: {
          id: docSnap.id,
          ...docSnap.data()
        }
      };
    } else {
      return { success: false, error: "Treino não encontrado" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Agendar um treino
export const scheduleTraining = async (userId, trainingData) => {
  try {
    const scheduledTraining = {
      userId,
      trainingId: trainingData.trainingId,
      trainingName: trainingData.trainingName,
      date: new Date(trainingData.date),
      completed: false,
      rating: null,
      feedback: null,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "scheduledTrainings"), scheduledTraining);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter treinos agendados
export const getScheduledTrainings = async (userId) => {
  try {
    const now = new Date();
    const trainingQuery = query(
      collection(db, "scheduledTrainings"),
      where("userId", "==", userId),
      where("date", ">=", now),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(trainingQuery);
    const trainings = [];
    
    querySnapshot.forEach((doc) => {
      trainings.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      });
    });
    
    return { success: true, trainings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter histórico de treinos
export const getTrainingHistory = async (userId, limit = 30) => {
  try {
    const trainingQuery = query(
      collection(db, "scheduledTrainings"),
      where("userId", "==", userId),
      where("completed", "==", true),
      orderBy("date", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(trainingQuery);
    const trainings = [];
    
    querySnapshot.forEach((doc) => {
      trainings.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      });
    });
    
    return { success: true, trainings };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Marcar treino como concluído
export const completeTraining = async (trainingId, rating, feedback) => {
  try {
    const docRef = doc(db, "scheduledTrainings", trainingId);
    await updateDoc(docRef, {
      completed: true,
      completedAt: new Date(),
      rating: rating,
      feedback: feedback || ''
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cancelar treino agendado
export const cancelTraining = async (trainingId) => {
  try {
    await deleteDoc(doc(db, "scheduledTrainings", trainingId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter agenda semanal de treinos
export const getWeeklySchedule = async (userId) => {
  try {
    // Calcular início e fim da semana atual
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Próximo domingo
    
    const trainingQuery = query(
      collection(db, "scheduledTrainings"),
      where("userId", "==", userId),
      where("date", ">=", startOfWeek),
      where("date", "<", endOfWeek),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(trainingQuery);
    
    // Organizar por dia da semana (0-6, domingo-sábado)
    const weekSchedule = Array(7).fill().map(() => []);
    
    querySnapshot.forEach((doc) => {
      const training = {
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate()
      };
      
      const dayOfWeek = training.date.getDay();
      weekSchedule[dayOfWeek].push(training);
    });
    
    return { 
      success: true, 
      weekSchedule,
      startOfWeek,
      endOfWeek
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
