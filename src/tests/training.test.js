// src/tests/training.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TrainingProvider, useTraining } from '../contexts/TrainingContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  onAuthChange: jest.fn((callback) => {
    callback({ uid: '123', email: 'teste@exemplo.com' });
    return jest.fn();
  }),
  getCurrentUser: jest.fn().mockReturnValue({ uid: '123' })
}));

// Mock dos serviços de treino
jest.mock('../services/training', () => ({
  getTrainingCatalog: jest.fn().mockResolvedValue({ 
    success: true, 
    trainings: [
      { 
        id: 'training1', 
        title: 'Alongamento Matinal', 
        description: 'Série de alongamentos suaves para começar o dia com mais disposição.',
        duration: 15,
        level: 'Iniciante',
        category: 'Alongamento',
        videoUrl: 'https://exemplo.com/video1',
        thumbnailUrl: 'https://exemplo.com/thumbnail1'
      },
      { 
        id: 'training2', 
        title: 'Fortalecimento de Pernas', 
        description: 'Exercícios para fortalecer os músculos das pernas e melhorar a estabilidade.',
        duration: 30,
        level: 'Intermediário',
        category: 'Fortalecimento',
        videoUrl: 'https://exemplo.com/video2',
        thumbnailUrl: 'https://exemplo.com/thumbnail2'
      }
    ] 
  }),
  getTrainingDetails: jest.fn().mockResolvedValue({ 
    success: true, 
    training: { 
      id: 'training1', 
      title: 'Alongamento Matinal', 
      description: 'Série de alongamentos suaves para começar o dia com mais disposição.',
      duration: 15,
      level: 'Iniciante',
      category: 'Alongamento',
      videoUrl: 'https://exemplo.com/video1',
      thumbnailUrl: 'https://exemplo.com/thumbnail1',
      steps: [
        'Comece sentado em uma cadeira',
        'Estique os braços acima da cabeça',
        'Incline suavemente para os lados'
      ]
    } 
  }),
  scheduleTraining: jest.fn().mockResolvedValue({ success: true, id: 'scheduled123' }),
  getScheduledTrainings: jest.fn().mockResolvedValue({ 
    success: true, 
    trainings: [
      {
        id: 'scheduled1',
        trainingId: 'training1',
        trainingName: 'Alongamento Matinal',
        date: new Date('2025-04-23T09:00:00'),
        completed: false
      },
      {
        id: 'scheduled2',
        trainingId: 'training2',
        trainingName: 'Fortalecimento de Pernas',
        date: new Date('2025-04-24T10:00:00'),
        completed: false
      }
    ] 
  }),
  getTrainingHistory: jest.fn().mockResolvedValue({ 
    success: true, 
    trainings: [
      {
        id: 'completed1',
        trainingId: 'training1',
        trainingName: 'Alongamento Matinal',
        date: new Date('2025-04-21T09:00:00'),
        completed: true,
        rating: 5,
        feedback: 'Ótimo treino!'
      },
      {
        id: 'completed2',
        trainingId: 'training2',
        trainingName: 'Fortalecimento de Pernas',
        date: new Date('2025-04-20T10:00:00'),
        completed: true,
        rating: 4,
        feedback: 'Bom treino, um pouco cansativo.'
      }
    ] 
  }),
  completeTraining: jest.fn().mockResolvedValue({ success: true }),
  cancelTraining: jest.fn().mockResolvedValue({ success: true }),
  getWeeklySchedule: jest.fn().mockResolvedValue({ 
    success: true, 
    weekSchedule: Array(7).fill().map(() => []),
    startOfWeek: new Date('2025-04-20'),
    endOfWeek: new Date('2025-04-26')
  })
}));

// Componente de teste para verificar as funcionalidades de treino
const TrainingTestComponent = () => {
  const { 
    trainingCatalog, 
    scheduledTrainings, 
    trainingHistory, 
    loading, 
    error, 
    loadTrainingCatalog, 
    getTraining, 
    scheduleNewTraining, 
    markTrainingComplete, 
    cancelScheduledTraining,
    refreshData
  } = useTraining();
  
  const handleScheduleTraining = () => {
    scheduleNewTraining({
      trainingId: 'training1',
      trainingName: 'Alongamento Matinal',
      date: '2025-04-25T09:00:00'
    });
  };
  
  const handleCompleteTraining = (trainingId) => {
    markTrainingComplete(trainingId, 5, 'Treino concluído com sucesso!');
  };
  
  const handleCancelTraining = (trainingId) => {
    cancelScheduledTraining(trainingId);
  };
  
  const handleFilterTrainings = () => {
    loadTrainingCatalog({ level: 'Iniciante', category: 'Alongamento' });
  };
  
  return (
    <div>
      <h1>Teste de Treinos</h1>
      
      {loading ? (
        <p data-testid="loading-status">Carregando...</p>
      ) : (
        <div>
          <h2>Catálogo de Treinos</h2>
          <ul>
            {trainingCatalog.map(training => (
              <li key={training.id} data-testid={`training-${training.id}`}>
                {training.title} - {training.duration} minutos - {training.level} - {training.category}
              </li>
            ))}
          </ul>
          
          <button onClick={handleFilterTrainings} data-testid="filter-button">Filtrar Treinos</button>
          
          <h2>Treinos Agendados</h2>
          <ul>
            {scheduledTrainings.map(training => (
              <li key={training.id} data-testid={`scheduled-${training.id}`}>
                {training.trainingName} - {training.date.toLocaleString()}
                <button onClick={() => handleCompleteTraining(training.id)}>Concluir</button>
                <button onClick={() => handleCancelTraining(training.id)}>Cancelar</button>
              </li>
            ))}
          </ul>
          
          <button onClick={handleScheduleTraining} data-testid="schedule-button">Agendar Treino</button>
          
          <h2>Histórico de Treinos</h2>
          <ul>
            {trainingHistory.map(training => (
              <li key={training.id} data-testid={`history-${training.id}`}>
                {training.trainingName} - {training.date.toLocaleString()} - Avaliação: {training.rating}/5
              </li>
            ))}
          </ul>
          
          <button onClick={refreshData} data-testid="refresh-button">Atualizar Dados</button>
        </div>
      )}
      
      {error && <p data-testid="error-message">{error}</p>}
    </div>
  );
};

describe('Testes de Treinos', () => {
  test('Catálogo de treinos e agendamentos são carregados corretamente', async () => {
    render(
      <AuthProvider>
        <TrainingProvider>
          <TrainingTestComponent />
        </TrainingProvider>
      </AuthProvider>
    );
    
    // Verificar se o catálogo de treinos foi carregado
    expect(screen.getByTestId('training-training1')).toHaveTextContent('Alongamento Matinal - 15 minutos - Iniciante - Alongamento');
    expect(screen.getByTestId('training-training2')).toHaveTextContent('Fortalecimento de Pernas - 30 minutos - Intermediário - Fortalecimento');
    
    // Verificar se os treinos agendados foram carregados
    expect(screen.getByTestId('scheduled-scheduled1')).toHaveTextContent('Alongamento Matinal');
    expect(screen.getByTestId('scheduled-scheduled2')).toHaveTextContent('Fortalecimento de Pernas');
    
    // Verificar se o histórico de treinos foi carregado
    expect(screen.getByTestId('history-completed1')).toHaveTextContent('Alongamento Matinal');
    expect(screen.getByTestId('history-completed1')).toHaveTextContent('Avaliação: 5/5');
    expect(screen.getByTestId('history-completed2')).toHaveTextContent('Fortalecimento de Pernas');
    expect(screen.getByTestId('history-completed2')).toHaveTextContent('Avaliação: 4/5');
  });
});
