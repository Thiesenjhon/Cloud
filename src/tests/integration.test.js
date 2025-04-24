// src/tests/integration.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { HealthProvider } from '../contexts/HealthContext';
import { TrainingProvider } from '../contexts/TrainingContext';
import { ProfileProvider } from '../contexts/ProfileContext';
import { SupportProvider } from '../contexts/SupportContext';

// Mock dos serviços Firebase
jest.mock('../services/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  db: {},
  storage: {}
}));

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
  resetPassword: jest.fn(),
  getCurrentUser: jest.fn(),
  onAuthChange: jest.fn((callback) => {
    callback(null);
    return jest.fn();
  }),
  getUserProfile: jest.fn()
}));

// Mock dos serviços de saúde
jest.mock('../services/health', () => ({
  addHealthRecord: jest.fn(),
  getHealthHistory: jest.fn(),
  getHealthRecord: jest.fn(),
  updateHealthRecord: jest.fn(),
  deleteHealthRecord: jest.fn(),
  addHealthReminder: jest.fn(),
  getHealthReminders: jest.fn(),
  generateHealthReport: jest.fn()
}));

// Mock dos serviços de treino
jest.mock('../services/training', () => ({
  getTrainingCatalog: jest.fn(),
  getTrainingDetails: jest.fn(),
  scheduleTraining: jest.fn(),
  getScheduledTrainings: jest.fn(),
  getTrainingHistory: jest.fn(),
  completeTraining: jest.fn(),
  cancelTraining: jest.fn(),
  getWeeklySchedule: jest.fn()
}));

// Mock dos serviços de perfil
jest.mock('../services/profile', () => ({
  getUserProfile: jest.fn(),
  updateUserProfile: jest.fn(),
  addGoal: jest.fn(),
  getUserGoals: jest.fn(),
  completeGoal: jest.fn(),
  uncompleteGoal: jest.fn(),
  deleteGoal: jest.fn(),
  getUserAchievements: jest.fn(),
  saveAccessibilitySettings: jest.fn(),
  getAccessibilitySettings: jest.fn(),
  addFamilyMember: jest.fn(),
  getFamilyMembers: jest.fn(),
  removeFamilyMember: jest.fn()
}));

// Mock dos serviços de suporte
jest.mock('../services/support', () => ({
  sendSupportMessage: jest.fn(),
  getSupportHistory: jest.fn(),
  getFAQs: jest.fn(),
  scheduleVideoCall: jest.fn(),
  getScheduledAppointments: jest.fn(),
  cancelAppointment: jest.fn(),
  getAppointmentHistory: jest.fn(),
  joinVideoCall: jest.fn()
}));

// Componente de teste para verificar a integração dos contextos
const TestComponent = () => {
  return (
    <div>
      <h1>Teste de Integração</h1>
      <p>Se você está vendo esta mensagem, os contextos foram carregados corretamente.</p>
    </div>
  );
};

// Wrapper para os provedores de contexto
const AllProviders = ({ children }) => {
  return (
    <AuthProvider>
      <HealthProvider>
        <TrainingProvider>
          <ProfileProvider>
            <SupportProvider>
              {children}
            </SupportProvider>
          </ProfileProvider>
        </TrainingProvider>
      </HealthProvider>
    </AuthProvider>
  );
};

describe('Testes de Integração dos Contextos', () => {
  test('Todos os contextos são carregados corretamente', () => {
    render(
      <AllProviders>
        <TestComponent />
      </AllProviders>
    );
    
    expect(screen.getByText('Teste de Integração')).toBeInTheDocument();
    expect(screen.getByText('Se você está vendo esta mensagem, os contextos foram carregados corretamente.')).toBeInTheDocument();
  });
});
