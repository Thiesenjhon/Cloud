// src/tests/profile.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileProvider, useProfile } from '../contexts/ProfileContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  onAuthChange: jest.fn((callback) => {
    callback({ uid: '123', email: 'teste@exemplo.com' });
    return jest.fn();
  }),
  getCurrentUser: jest.fn().mockReturnValue({ uid: '123' })
}));

// Mock dos serviços de perfil
jest.mock('../services/profile', () => ({
  getUserProfile: jest.fn().mockResolvedValue({ 
    success: true, 
    profile: { 
      name: 'Maria Silva', 
      age: 67, 
      healthConditions: ['Hipertensão', 'Artrite'],
      activityLevel: 'Iniciante',
      createdAt: new Date('2025-01-01')
    } 
  }),
  updateUserProfile: jest.fn().mockResolvedValue({ success: true }),
  addGoal: jest.fn().mockResolvedValue({ success: true, id: 'goal123' }),
  getUserGoals: jest.fn().mockResolvedValue({ 
    success: true, 
    goals: [
      {
        id: 'goal1',
        title: 'Caminhar 30 minutos por dia',
        description: 'Meta para melhorar o condicionamento cardiovascular',
        deadline: new Date('2025-06-01'),
        completed: false,
        createdAt: new Date('2025-04-01')
      },
      {
        id: 'goal2',
        title: 'Fazer alongamento todos os dias',
        description: 'Meta para melhorar a flexibilidade',
        deadline: null,
        completed: true,
        completedAt: new Date('2025-04-15'),
        createdAt: new Date('2025-03-15')
      }
    ] 
  }),
  completeGoal: jest.fn().mockResolvedValue({ success: true }),
  uncompleteGoal: jest.fn().mockResolvedValue({ success: true }),
  deleteGoal: jest.fn().mockResolvedValue({ success: true }),
  getUserAchievements: jest.fn().mockResolvedValue({ 
    success: true, 
    achievements: [
      {
        id: 'achievement1',
        title: 'Primeira Semana',
        description: 'Completou uma semana de atividades',
        icon: 'emoji_events',
        earned: true,
        earnedAt: new Date('2025-01-15')
      },
      {
        id: 'achievement2',
        title: 'Saúde em Dia',
        description: 'Registrou indicadores de saúde por 30 dias consecutivos',
        icon: 'favorite',
        earned: true,
        earnedAt: new Date('2025-02-14')
      },
      {
        id: 'achievement3',
        title: 'Mestre do Fortalecimento',
        description: 'Complete 20 treinos de fortalecimento',
        icon: 'fitness_center',
        earned: false
      }
    ] 
  }),
  saveAccessibilitySettings: jest.fn().mockResolvedValue({ success: true }),
  getAccessibilitySettings: jest.fn().mockResolvedValue({ 
    success: true, 
    settings: {
      fontSize: 'grande',
      theme: 'claro',
      notifications: true
    } 
  }),
  addFamilyMember: jest.fn().mockResolvedValue({ success: true, id: 'family123' }),
  getFamilyMembers: jest.fn().mockResolvedValue({ 
    success: true, 
    familyMembers: [
      {
        id: 'family1',
        familyEmail: 'joao.silva@email.com',
        status: 'accepted',
        createdAt: new Date('2025-03-01')
      },
      {
        id: 'family2',
        familyEmail: 'ana.medica@email.com',
        status: 'accepted',
        createdAt: new Date('2025-03-15')
      }
    ] 
  }),
  removeFamilyMember: jest.fn().mockResolvedValue({ success: true })
}));

// Componente de teste para verificar as funcionalidades de perfil
const ProfileTestComponent = () => {
  const { 
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
    refreshData
  } = useProfile();
  
  const handleUpdateProfile = () => {
    updateProfile({
      name: 'Maria Silva',
      age: 68,
      healthConditions: ['Hipertensão', 'Artrite'],
      activityLevel: 'Intermediário'
    });
  };
  
  const handleAddGoal = () => {
    addNewGoal({
      title: 'Nova meta',
      description: 'Descrição da nova meta',
      deadline: '2025-07-01'
    });
  };
  
  const handleCompleteGoal = (goalId) => {
    markGoalComplete(goalId);
  };
  
  const handleIncompleteGoal = (goalId) => {
    markGoalIncomplete(goalId);
  };
  
  const handleRemoveGoal = (goalId) => {
    removeGoal(goalId);
  };
  
  const handleSaveSettings = () => {
    saveSettings({
      fontSize: 'extragrande',
      theme: 'escuro',
      notifications: true
    });
  };
  
  const handleAddFamily = () => {
    addFamily('novo.familiar@email.com');
  };
  
  const handleRemoveFamily = (familyId) => {
    removeFamily(familyId);
  };
  
  return (
    <div>
      <h1>Teste de Perfil</h1>
      
      {loading ? (
        <p data-testid="loading-status">Carregando...</p>
      ) : (
        <div>
          <h2>Perfil do Usuário</h2>
          {profile && (
            <div data-testid="profile-info">
              <p>Nome: {profile.name}</p>
              <p>Idade: {profile.age}</p>
              <p>Condições de saúde: {profile.healthConditions.join(', ')}</p>
              <p>Nível de atividade: {profile.activityLevel}</p>
            </div>
          )}
          
          <button onClick={handleUpdateProfile} data-testid="update-profile-button">Atualizar Perfil</button>
          
          <h2>Metas</h2>
          <ul>
            {goals.map(goal => (
              <li key={goal.id} data-testid={`goal-${goal.id}`}>
                {goal.title} - {goal.description} - {goal.completed ? 'Concluída' : 'Pendente'}
                {!goal.completed && (
                  <button onClick={() => handleCompleteGoal(goal.id)}>Concluir</button>
                )}
                {goal.completed && (
                  <button onClick={() => handleIncompleteGoal(goal.id)}>Desmarcar</button>
                )}
                <button onClick={() => handleRemoveGoal(goal.id)}>Excluir</button>
              </li>
            ))}
          </ul>
          
          <button onClick={handleAddGoal} data-testid="add-goal-button">Adicionar Meta</button>
          
          <h2>Conquistas</h2>
          <ul>
            {achievements.map(achievement => (
              <li key={achievement.id} data-testid={`achievement-${achievement.id}`}>
                {achievement.title} - {achievement.description} - {achievement.earned ? 'Conquistada' : 'Não conquistada'}
              </li>
            ))}
          </ul>
          
          <h2>Configurações de Acessibilidade</h2>
          <div data-testid="accessibility-settings">
            <p>Tamanho da fonte: {accessibilitySettings.fontSize}</p>
            <p>Tema: {accessibilitySettings.theme}</p>
            <p>Notificações: {accessibilitySettings.notifications ? 'Ativadas' : 'Desativadas'}</p>
          </div>
          
          <button onClick={handleSaveSettings} data-testid="save-settings-button">Salvar Configurações</button>
          
          <h2>Compartilhamento com Família</h2>
          <ul>
            {familyMembers.map(member => (
              <li key={member.id} data-testid={`family-${member.id}`}>
                {member.familyEmail} - {member.status}
                <button onClick={() => handleRemoveFamily(member.id)}>Remover</button>
              </li>
            ))}
          </ul>
          
          <button onClick={handleAddFamily} data-testid="add-family-button">Adicionar Familiar</button>
          
          <button onClick={refreshData} data-testid="refresh-button">Atualizar Dados</button>
        </div>
      )}
      
      {error && <p data-testid="error-message">{error}</p>}
    </div>
  );
};

describe('Testes de Perfil', () => {
  test('Perfil, metas, conquistas e configurações são carregados corretamente', async () => {
    render(
      <AuthProvider>
        <ProfileProvider>
          <ProfileTestComponent />
        </ProfileProvider>
      </AuthProvider>
    );
    
    // Verificar se o perfil foi carregado
    expect(screen.getByTestId('profile-info')).toHaveTextContent('Nome: Maria Silva');
    expect(screen.getByTestId('profile-info')).toHaveTextContent('Idade: 67');
    expect(screen.getByTestId('profile-info')).toHaveTextContent('Condições de saúde: Hipertensão, Artrite');
    expect(screen.getByTestId('profile-info')).toHaveTextContent('Nível de atividade: Iniciante');
    
    // Verificar se as metas foram carregadas
    expect(screen.getByTestId('goal-goal1')).toHaveTextContent('Caminhar 30 minutos por dia');
    expect(screen.getByTestId('goal-goal1')).toHaveTextContent('Pendente');
    expect(screen.getByTestId('goal-goal2')).toHaveTextContent('Fazer alongamento todos os dias');
    expect(screen.getByTestId('goal-goal2')).toHaveTextContent('Concluída');
    
    // Verificar se as conquistas foram carregadas
    expect(screen.getByTestId('achievement-achievement1')).toHaveTextContent('Primeira Semana');
    expect(screen.getByTestId('achievement-achievement1')).toHaveTextContent('Conquistada');
    expect(screen.getByTestId('achievement-achievement3')).toHaveTextContent('Mestre do Fortalecimento');
    expect(screen.getByTestId('achievement-achievement3')).toHaveTextContent('Não conquistada');
    
    // Verificar se as configurações de acessibilidade foram carregadas
    expect(screen.getByTestId('accessibility-settings')).toHaveTextContent('Tamanho da fonte: grande');
    expect(screen.getByTestId('accessibility-settings')).toHaveTextContent('Tema: claro');
    expect(screen.getByTestId('accessibility-settings')).toHaveTextContent('Notificações: Ativadas');
    
    // Verificar se os familiares foram carregados
    expect(screen.getByTestId('family-family1')).toHaveTextContent('joao.silva@email.com');
    expect(screen.getByTestId('family-family2')).toHaveTextContent('ana.medica@email.com');
  });
});
