// src/tests/health.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HealthProvider, useHealth } from '../contexts/HealthContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  onAuthChange: jest.fn((callback) => {
    callback({ uid: '123', email: 'teste@exemplo.com' });
    return jest.fn();
  }),
  getCurrentUser: jest.fn().mockReturnValue({ uid: '123' })
}));

// Mock dos serviços de saúde
jest.mock('../services/health', () => ({
  addHealthRecord: jest.fn().mockResolvedValue({ success: true, id: 'record123' }),
  getHealthHistory: jest.fn().mockResolvedValue({ 
    success: true, 
    records: [
      { 
        id: 'record1', 
        bloodPressure: '130/85', 
        weight: 72.5, 
        glucose: 110, 
        feeling: 'Bem',
        createdAt: new Date('2025-04-22T10:00:00')
      },
      { 
        id: 'record2', 
        bloodPressure: '128/82', 
        weight: 72.8, 
        glucose: 105, 
        feeling: 'Muito bem',
        createdAt: new Date('2025-04-21T10:00:00')
      }
    ] 
  }),
  getHealthRecord: jest.fn().mockResolvedValue({ 
    success: true, 
    record: { 
      id: 'record1', 
      bloodPressure: '130/85', 
      weight: 72.5, 
      glucose: 110, 
      feeling: 'Bem',
      createdAt: new Date('2025-04-22T10:00:00')
    } 
  }),
  updateHealthRecord: jest.fn().mockResolvedValue({ success: true }),
  deleteHealthRecord: jest.fn().mockResolvedValue({ success: true }),
  addHealthReminder: jest.fn().mockResolvedValue({ success: true, id: 'reminder123' }),
  getHealthReminders: jest.fn().mockResolvedValue({ 
    success: true, 
    reminders: [
      {
        id: 'reminder1',
        title: 'Medicação: Pressão',
        time: '08:00',
        days: ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'],
        type: 'medication',
        description: 'Tomar medicamento para pressão após o café da manhã'
      },
      {
        id: 'reminder2',
        title: 'Beber água',
        time: '10:00',
        days: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
        type: 'hydration',
        description: 'Lembrete para beber um copo de água'
      }
    ] 
  }),
  generateHealthReport: jest.fn().mockResolvedValue({ 
    success: true, 
    report: {
      user: { name: 'Maria Silva', age: 67 },
      records: [
        { 
          id: 'record1', 
          bloodPressure: '130/85', 
          weight: 72.5, 
          glucose: 110, 
          feeling: 'Bem',
          createdAt: new Date('2025-04-22T10:00:00')
        },
        { 
          id: 'record2', 
          bloodPressure: '128/82', 
          weight: 72.8, 
          glucose: 105, 
          feeling: 'Muito bem',
          createdAt: new Date('2025-04-21T10:00:00')
        }
      ],
      startDate: new Date('2025-04-15'),
      endDate: new Date('2025-04-22'),
      generatedAt: new Date()
    } 
  })
}));

// Componente de teste para verificar as funcionalidades de saúde
const HealthTestComponent = () => {
  const { 
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
    refreshData
  } = useHealth();
  
  const handleAddRecord = () => {
    addRecord({
      bloodPressure: '120/80',
      weight: 72.0,
      glucose: 100,
      feeling: 'Bem',
      notes: 'Teste de registro'
    });
  };
  
  const handleDeleteRecord = (recordId) => {
    deleteRecord(recordId);
  };
  
  const handleAddReminder = () => {
    addReminder({
      title: 'Novo lembrete',
      time: '12:00',
      days: ['segunda', 'quarta', 'sexta'],
      type: 'custom',
      description: 'Teste de lembrete'
    });
  };
  
  const handleGenerateReport = () => {
    generateReport('2025-04-15', '2025-04-22');
  };
  
  return (
    <div>
      <h1>Teste de Saúde</h1>
      
      {loading ? (
        <p data-testid="loading-status">Carregando...</p>
      ) : (
        <div>
          <h2>Registros de Saúde</h2>
          <ul>
            {healthRecords.map(record => (
              <li key={record.id} data-testid={`record-${record.id}`}>
                {record.bloodPressure} - {record.weight}kg - {record.glucose}mg/dL - {record.feeling}
                <button onClick={() => handleDeleteRecord(record.id)}>Excluir</button>
              </li>
            ))}
          </ul>
          
          <button onClick={handleAddRecord} data-testid="add-record-button">Adicionar Registro</button>
          
          <h2>Lembretes</h2>
          <ul>
            {reminders.map(reminder => (
              <li key={reminder.id} data-testid={`reminder-${reminder.id}`}>
                {reminder.title} - {reminder.time} - {reminder.description}
              </li>
            ))}
          </ul>
          
          <button onClick={handleAddReminder} data-testid="add-reminder-button">Adicionar Lembrete</button>
          
          <button onClick={handleGenerateReport} data-testid="generate-report-button">Gerar Relatório</button>
          
          <button onClick={refreshData} data-testid="refresh-button">Atualizar Dados</button>
        </div>
      )}
      
      {error && <p data-testid="error-message">{error}</p>}
    </div>
  );
};

describe('Testes de Saúde', () => {
  test('Registros de saúde são carregados corretamente', async () => {
    render(
      <AuthProvider>
        <HealthProvider>
          <HealthTestComponent />
        </HealthProvider>
      </AuthProvider>
    );
    
    // Verificar se os registros de saúde foram carregados
    expect(screen.getByTestId('record-record1')).toHaveTextContent('130/85 - 72.5kg - 110mg/dL - Bem');
    expect(screen.getByTestId('record-record2')).toHaveTextContent('128/82 - 72.8kg - 105mg/dL - Muito bem');
    
    // Verificar se os lembretes foram carregados
    expect(screen.getByTestId('reminder-reminder1')).toHaveTextContent('Medicação: Pressão - 08:00 - Tomar medicamento para pressão após o café da manhã');
    expect(screen.getByTestId('reminder-reminder2')).toHaveTextContent('Beber água - 10:00 - Lembrete para beber um copo de água');
  });
});
