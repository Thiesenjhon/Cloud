// src/services/auth.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Registrar um novo usuário
export const registerUser = async (email, password, name, age) => {
  try {
    // Criar usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Atualizar o perfil do usuário com o nome
    await updateProfile(user, {
      displayName: name
    });
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      age,
      createdAt: new Date(),
      role: 'user',
      healthConditions: [],
      activityLevel: 'iniciante'
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Login de usuário
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout de usuário
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Recuperação de senha
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obter usuário atual
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Observar mudanças no estado de autenticação
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obter dados do perfil do usuário
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
