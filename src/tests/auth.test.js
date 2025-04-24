// src/tests/auth.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock dos serviços de autenticação
jest.mock('../services/auth', () => ({
  registerUser: jest.fn().mockResolvedValue({ success: true, user: { uid: '123' } }),
  loginUser: jest.fn().mockResolvedValue({ success: true, user: { uid: '123' } }),
  logoutUser: jest.fn().mockResolvedValue({ success: true }),
  resetPassword: jest.fn().mockResolvedValue({ success: true }),
  getCurrentUser: jest.fn().mockReturnValue({ uid: '123' }),
  onAuthChange: jest.fn((callback) => {
    callback({ uid: '123', email: 'teste@exemplo.com' });
    return jest.fn();
  }),
  getUserProfile: jest.fn().mockResolvedValue({ 
    success: true, 
    profile: { 
      name: 'Maria Silva', 
      age: 67, 
      healthConditions: ['Hipertensão'] 
    } 
  })
}));

// Componente de teste para verificar a autenticação
const AuthTestComponent = () => {
  const { currentUser, userProfile, login, logout, register, resetUserPassword, error } = useAuth();
  
  const handleLogin = () => {
    login('teste@exemplo.com', 'senha123');
  };
  
  const handleLogout = () => {
    logout();
  };
  
  const handleRegister = () => {
    register('novo@exemplo.com', 'senha123', 'Novo Usuário', 65);
  };
  
  const handleResetPassword = () => {
    resetUserPassword('teste@exemplo.com');
  };
  
  return (
    <div>
      <h1>Teste de Autenticação</h1>
      
      {currentUser ? (
        <div>
          <p data-testid="user-status">Usuário autenticado: {currentUser.email}</p>
          {userProfile && (
            <div>
              <p data-testid="user-name">Nome: {userProfile.name}</p>
              <p data-testid="user-age">Idade: {userProfile.age}</p>
            </div>
          )}
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <div>
          <p data-testid="user-status">Usuário não autenticado</p>
          <button onClick={handleLogin}>Entrar</button>
          <button onClick={handleRegister}>Registrar</button>
          <button onClick={handleResetPassword}>Recuperar Senha</button>
        </div>
      )}
      
      {error && <p data-testid="error-message">{error}</p>}
    </div>
  );
};

describe('Testes de Autenticação', () => {
  test('Usuário é autenticado corretamente', () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    // Verificar se o usuário está autenticado
    expect(screen.getByTestId('user-status')).toHaveTextContent('Usuário autenticado: teste@exemplo.com');
    
    // Verificar se o perfil do usuário foi carregado
    expect(screen.getByTestId('user-name')).toHaveTextContent('Nome: Maria Silva');
    expect(screen.getByTestId('user-age')).toHaveTextContent('Idade: 67');
  });
});
