// src/tests/setup.js
import '@testing-library/jest-dom';

// Mock para o objeto window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para o objeto window.scrollTo
window.scrollTo = jest.fn();

// Mock para o objeto window.alert
window.alert = jest.fn();

// Mock para o objeto window.confirm
window.confirm = jest.fn();

// Mock para o objeto window.fetch
global.fetch = jest.fn();

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
