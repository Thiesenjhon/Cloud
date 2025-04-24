// src/services/health.js
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

// Registrar novos indicadores de saúde
export const addHealthRecord = async (userId, healthData) => {
  try {
    const healthRecord = {
      userId,
      bloodPressure: healthData.bloodPressure,
      weight: parseFloat(healthData.weight),
      glucose: healthData.glucose ? parseInt(healthData.glucose) : null,
      feeling: healthData.feeling,
      notes: healthData.notes || '',
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "healthRecords"), healthRecord);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter histórico de registros de saúde
export const getHealthHistory = async (userId, limit = 30) => {
  try {
    const healthQuery = query(
      collection(db, "healthRecords"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(healthQuery);
    const records = [];
    
    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return { success: true, records };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter um registro específico
export const getHealthRecord = async (recordId) => {
  try {
    const docRef = doc(db, "healthRecords", recordId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        record: {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt.toDate()
        }
      };
    } else {
      return { success: false, error: "Registro não encontrado" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Atualizar um registro de saúde
export const updateHealthRecord = async (recordId, healthData) => {
  try {
    const docRef = doc(db, "healthRecords", recordId);
    await updateDoc(docRef, {
      bloodPressure: healthData.bloodPressure,
      weight: parseFloat(healthData.weight),
      glucose: healthData.glucose ? parseInt(healthData.glucose) : null,
      feeling: healthData.feeling,
      notes: healthData.notes || '',
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Excluir um registro de saúde
export const deleteHealthRecord = async (recordId) => {
  try {
    await deleteDoc(doc(db, "healthRecords", recordId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Adicionar um lembrete de saúde
export const addHealthReminder = async (userId, reminderData) => {
  try {
    const reminder = {
      userId,
      title: reminderData.title,
      time: reminderData.time,
      days: reminderData.days || [],
      type: reminderData.type,
      description: reminderData.description || '',
      active: true,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "healthReminders"), reminder);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter lembretes de saúde
export const getHealthReminders = async (userId) => {
  try {
    const remindersQuery = query(
      collection(db, "healthReminders"),
      where("userId", "==", userId),
      where("active", "==", true)
    );
    
    const querySnapshot = await getDocs(remindersQuery);
    const reminders = [];
    
    querySnapshot.forEach((doc) => {
      reminders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, reminders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Gerar relatório de saúde (dados para PDF)
export const generateHealthReport = async (userId, startDate, endDate) => {
  try {
    // Converter datas para objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Fim do dia
    
    const healthQuery = query(
      collection(db, "healthRecords"),
      where("userId", "==", userId),
      where("createdAt", ">=", start),
      where("createdAt", "<=", end),
      orderBy("createdAt", "asc")
    );
    
    const querySnapshot = await getDocs(healthQuery);
    const records = [];
    
    querySnapshot.forEach((doc) => {
      records.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    // Obter dados do usuário
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    return { 
      success: true, 
      report: {
        user: userData,
        records,
        startDate: start,
        endDate: end,
        generatedAt: new Date()
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
