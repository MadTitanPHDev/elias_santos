/**
 * Configuração do Backend
 * Centralize a URL do backend aqui para facilitar mudanças
 */

// Configurações do backend
export const backendConfig = {
  // URL base do backend PHP
  baseURL: process.env.REACT_APP_API_URL || 'https://lightpink-albatross-852396.hostingersite.com/backend-php/api',
  
  // Timeout para requisições (em milissegundos)
  timeout: 30000,
  
  // Configurações de retry
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Headers padrão
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Função para obter a URL completa
export const getApiUrl = (endpoint = '') => {
  const baseUrl = backendConfig.baseURL.replace(/\/$/, ''); // Remove barra final
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove barra inicial
  return cleanEndpoint ? `${baseUrl}/${cleanEndpoint}` : baseUrl;
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

// Função para obter URL do backend baseada no ambiente
export const getBackendUrl = () => {
  if (isDevelopment()) {
    // Em desenvolvimento, pode usar localhost ou o servidor de produção
    return process.env.REACT_APP_API_URL || 'https://lightpink-albatross-852396.hostingersite.com/backend-php/api';
  }
  
  // Em produção, sempre usar a URL de produção
  return 'https://lightpink-albatross-852396.hostingersite.com/backend-php/api';
};

export default backendConfig;
