// src/services/profile.js
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Obter perfil do usuário
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    } else {
      return { success: false, error: "Perfil não encontrado" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userId, profileData) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      name: profileData.name,
      age: profileData.age,
      healthConditions: profileData.healthConditions || [],
      activityLevel: profileData.activityLevel,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Adicionar uma meta
export const addGoal = async (userId, goalData) => {
  try {
    const goal = {
      userId,
      title: goalData.title,
      description: goalData.description || '',
      deadline: goalData.deadline ? new Date(goalData.deadline) : null,
      completed: false,
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "goals"), goal);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter metas do usuário
export const getUserGoals = async (userId) => {
  try {
    const goalsQuery = query(
      collection(db, "goals"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(goalsQuery);
    const goals = [];
    
    querySnapshot.forEach((doc) => {
      goals.push({
        id: doc.id,
        ...doc.data(),
        deadline: doc.data().deadline ? doc.data().deadline.toDate() : null,
        createdAt: doc.data().createdAt.toDate()
      });
    });
    
    return { success: true, goals };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Marcar meta como concluída
export const completeGoal = async (goalId) => {
  try {
    const docRef = doc(db, "goals", goalId);
    await updateDoc(docRef, {
      completed: true,
      completedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Desmarcar meta como concluída
export const uncompleteGoal = async (goalId) => {
  try {
    const docRef = doc(db, "goals", goalId);
    await updateDoc(docRef, {
      completed: false,
      completedAt: null
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Excluir meta
export const deleteGoal = async (goalId) => {
  try {
    await deleteDoc(doc(db, "goals", goalId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter conquistas do usuário
export const getUserAchievements = async (userId) => {
  try {
    const achievementsQuery = query(
      collection(db, "achievements"),
      where("userId", "==", userId),
      orderBy("earnedAt", "desc")
    );
    
    const querySnapshot = await getDocs(achievementsQuery);
    const achievements = [];
    
    querySnapshot.forEach((doc) => {
      achievements.push({
        id: doc.id,
        ...doc.data(),
        earnedAt: doc.data().earnedAt.toDate()
      });
    });
    
    // Obter também conquistas disponíveis mas não conquistadas
    const availableAchievementsQuery = query(
      collection(db, "availableAchievements"),
      orderBy("difficulty", "asc")
    );
    
    const availableSnapshot = await getDocs(availableAchievementsQuery);
    const availableAchievements = [];
    
    availableSnapshot.forEach((doc) => {
      // Verificar se o usuário já conquistou
      const alreadyEarned = achievements.some(a => a.achievementId === doc.id);
      
      if (!alreadyEarned) {
        availableAchievements.push({
          id: doc.id,
          ...doc.data(),
          earned: false
        });
      }
    });
    
    return { 
      success: true, 
      achievements: [
        ...achievements.map(a => ({ ...a, earned: true })),
        ...availableAchievements
      ]
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Salvar configurações de acessibilidade
export const saveAccessibilitySettings = async (userId, settings) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      accessibilitySettings: {
        fontSize: settings.fontSize || 'normal',
        theme: settings.theme || 'light',
        notifications: settings.notifications !== undefined ? settings.notifications : true
      },
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter configurações de acessibilidade
export const getAccessibilitySettings = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().accessibilitySettings) {
      return { 
        success: true, 
        settings: docSnap.data().accessibilitySettings 
      };
    } else {
      // Configurações padrão
      return { 
        success: true, 
        settings: {
          fontSize: 'normal',
          theme: 'light',
          notifications: true
        }
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Adicionar familiar para compartilhamento
export const addFamilyMember = async (userId, familyEmail) => {
  try {
    const familyMember = {
      userId,
      familyEmail,
      status: 'pending', // pending, accepted, rejected
      createdAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, "familySharing"), familyMember);
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter familiares com acesso
export const getFamilyMembers = async (userId) => {
  try {
    const familyQuery = query(
      collection(db, "familySharing"),
      where("userId", "==", userId)
    );
    
    const querySnapshot = await getDocs(familyQuery);
    const familyMembers = [];
    
    querySnapshot.forEach((doc) => {
      familyMembers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, familyMembers };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remover familiar
export const removeFamilyMember = async (sharingId) => {
  try {
    await deleteDoc(doc(db, "familySharing", sharingId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
