import axios from 'axios';

export const authService = {
  // Salvar token no localStorage
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Remover token
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Obter usuário
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Verificar se é gestor
  isGestor: () => {
    const user = authService.getUser();
    return user && user.tipo === 'gestor';
  },

  // Configurar axios para incluir token automaticamente
  setupAxiosInterceptors: () => {
    // Usar a instância base do axios
    axios.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  },


  //////////////////////////////////////////////
   isTokenValid: () => {
    const token = authService.getToken();
    if (!token) return false;
    
    try {
      // Verifica se o token está expirado (decodifica o payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  
  // Função para fazer requisições autenticadas manualmente
  fetchWithAuth: async (url, options = {}) => {
    const token = authService.getToken();
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
    
    try {
      const response = await fetch(url, config);
      if (response.status === 401) {
        authService.logout();
        window.location.href = '/admin-acesso';
        throw new Error('Não autorizado');
      }
      return response;
    } catch (error) {
      throw error;
    }
  }
};