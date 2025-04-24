// src/tests/support.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SupportProvider, useSupport } from '../contexts/SupportContext';
import { AuthProvider } from '../contexts/AuthContext';

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  onAuthChange: jest.fn((callback) => {
    callback({ uid: '123', email: 'teste@exemplo.com' });
    return jest.fn();
  }),
  getCurrentUser: jest.fn().mockReturnValue({ uid: '123' })
}));

// Mock dos serviços de suporte
jest.mock('../services/support', () => ({
  sendSupportMessage: jest.fn().mockResolvedValue({ success: true, id: 'message123' }),
  getSupportHistory: jest.fn().mockResolvedValue({ 
    success: true, 
    messages: [
      {
        id: 'message1',
        subject: 'Dúvida sobre treinos',
        message: 'Gostaria de saber como adaptar os exercícios para minha condição de artrite.',
        attachmentUrl: null,
        status: 'resolved',
        createdAt: new Date('2025-04-15T14:30:00')
      },
      {
        id: 'message2',
        subject: 'Problema técnico',
        message: 'O vídeo de alongamento não está carregando corretamente.',
        attachmentUrl: 'https://exemplo.com/screenshot.jpg',
        status: 'in-progress',
        createdAt: new Date('2025-04-20T10:15:00')
      }
    ] 
  }),
  getFAQs: jest.fn().mockResolvedValue({ 
    success: true, 
    faqs: [
      {
        id: 'faq1',
        question: 'Como aferir corretamente a pressão arterial?',
        answer: 'Sente-se em uma cadeira com as costas apoiadas, deixe o braço na altura do coração, relaxe por 5 minutos antes de medir, não fale durante a medição e evite café ou exercícios 30 minutos antes.',
        order: 1
      },
      {
        id: 'faq2',
        question: 'Posso fazer os exercícios mesmo com dores nas articulações?',
        answer: 'Consulte seu médico antes. Nossos exercícios são adaptados, mas é importante ter liberação médica, especialmente se você sente dores.',
        order: 2
      }
    ] 
  }),
  scheduleVideoCall: jest.fn().mockResolvedValue({ success: true, id: 'appointment123' }),
  getScheduledAppointments: jest.fn().mockResolvedValue({ 
    success: true, 
    appointments: [
      {
        id: 'appointment1',
        subject: 'Consulta com Nutricionista',
        date: new Date('2025-04-25T14:00:00'),
        specialist: 'Ana (Nutricionista)',
        status: 'scheduled'
      },
      {
        id: 'appointment2',
        subject: 'Dúvidas sobre exercícios',
        date: new Date('2025-04-30T10:30:00'),
        specialist: 'Carlos (Educador Físico)',
        status: 'scheduled'
      }
    ] 
  }),
  cancelAppointment: jest.fn().mockResolvedValue({ success: true }),
  getAppointmentHistory: jest.fn().mockResolvedValue({ 
    success: true, 
    appointments: [
      {
        id: 'past-appointment1',
        subject: 'Dúvidas sobre treinos',
        date: new Date('2025-04-15T14:00:00'),
        specialist: 'Carlos (Educador Físico)',
        status: 'completed'
      },
      {
        id: 'past-appointment2',
        subject: 'Orientação nutricional',
        date: new Date('2025-04-10T10:30:00'),
        specialist: 'Ana (Nutricionista)',
        status: 'completed'
      }
    ] 
  }),
  joinVideoCall: jest.fn().mockResolvedValue({ 
    success: true, 
    callUrl: 'https://meet.revitalizafitness.com/appointment1',
    appointment: {
      id: 'appointment1',
      subject: 'Consulta com Nutricionista',
      date: new Date('2025-04-25T14:00:00'),
      specialist: 'Ana (Nutricionista)',
      status: 'scheduled'
    }
  })
}));

// Componente de teste para verificar as funcionalidades de suporte
const SupportTestComponent = () => {
  const { 
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
    refreshData
  } = useSupport();
  
  const handleSendMessage = () => {
    sendMessage({
      subject: 'Nova mensagem',
      message: 'Conteúdo da nova mensagem'
    });
  };
  
  const handleScheduleAppointment = () => {
    scheduleAppointment({
      subject: 'Novo agendamento',
      date: '2025-05-01T11:00:00',
      specialist: 'Suporte técnico'
    });
  };
  
  const handleCancelAppointment = (appointmentId) => {
    cancelScheduledAppointment(appointmentId);
  };
  
  const handleJoinAppointment = (appointmentId) => {
    joinAppointment(appointmentId);
  };
  
  return (
    <div>
      <h1>Teste de Suporte</h1>
      
      {loading ? (
        <p data-testid="loading-status">Carregando...</p>
      ) : (
        <div>
          <h2>Mensagens de Suporte</h2>
          <ul>
            {supportMessages.map(message => (
              <li key={message.id} data-testid={`message-${message.id}`}>
                {message.subject} - {message.status} - {message.createdAt.toLocaleString()}
              </li>
            ))}
          </ul>
          
          <button onClick={handleSendMessage} data-testid="send-message-button">Enviar Mensagem</button>
          
          <h2>Perguntas Frequentes</h2>
          <ul>
            {faqs.map(faq => (
              <li key={faq.id} data-testid={`faq-${faq.id}`}>
                <strong>{faq.question}</strong>
                <p>{faq.answer}</p>
              </li>
            ))}
          </ul>
          
          <h2>Agendamentos</h2>
          <ul>
            {scheduledAppointments.map(appointment => (
              <li key={appointment.id} data-testid={`appointment-${appointment.id}`}>
                {appointment.subject} - {appointment.specialist} - {appointment.date.toLocaleString()}
                <button onClick={() => handleJoinAppointment(appointment.id)}>Entrar</button>
                <button onClick={() => handleCancelAppointment(appointment.id)}>Cancelar</button>
              </li>
            ))}
          </ul>
          
          <button onClick={handleScheduleAppointment} data-testid="schedule-appointment-button">Agendar Atendimento</button>
          
          <h2>Histórico de Atendimentos</h2>
          <ul>
            {appointmentHistory.map(appointment => (
              <li key={appointment.id} data-testid={`history-${appointment.id}`}>
                {appointment.subject} - {appointment.specialist} - {appointment.date.toLocaleString()} - {appointment.status}
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

describe('Testes de Suporte', () => {
  test('Mensagens, FAQs e agendamentos são carregados corretamente', async () => {
    render(
      <AuthProvider>
        <SupportProvider>
          <SupportTestComponent />
        </SupportProvider>
      </AuthProvider>
    );
    
    // Verificar se as mensagens de suporte foram carregadas
    expect(screen.getByTestId('message-message1')).toHaveTextContent('Dúvida sobre treinos');
    expect(screen.getByTestId('message-message1')).toHaveTextContent('resolved');
    expect(screen.getByTestId('message-message2')).toHaveTextContent('Problema técnico');
    expect(screen.getByTestId('message-message2')).toHaveTextContent('in-progress');
    
    // Verificar se as FAQs foram carregadas
    expect(screen.getByTestId('faq-faq1')).toHaveTextContent('Como aferir corretamente a pressão arterial?');
    expect(screen.getByTestId('faq-faq2')).toHaveTextContent('Posso fazer os exercícios mesmo com dores nas articulações?');
    
    // Verificar se os agendamentos foram carregados
    expect(screen.getByTestId('appointment-appointment1')).toHaveTextContent('Consulta com Nutricionista');
    expect(screen.getByTestId('appointment-appointment1')).toHaveTextContent('Ana (Nutricionista)');
    expect(screen.getByTestId('appointment-appointment2')).toHaveTextContent('Dúvidas sobre exercícios');
    expect(screen.getByTestId('appointment-appointment2')).toHaveTextContent('Carlos (Educador Físico)');
    
    // Verificar se o histórico de atendimentos foi carregado
    expect(screen.getByTestId('history-past-appointment1')).toHaveTextContent('Dúvidas sobre treinos');
    expect(screen.getByTestId('history-past-appointment1')).toHaveTextContent('completed');
    expect(screen.getByTestId('history-past-appointment2')).toHaveTextContent('Orientação nutricional');
    expect(screen.getByTestId('history-past-appointment2')).toHaveTextContent('completed');
  });
});
