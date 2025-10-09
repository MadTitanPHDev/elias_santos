
import axios from 'axios';
import { authService } from './auth';
import { getBackendUrl } from '../config/backend';

const API_BASE_URL = getBackendUrl(); // URL do backend PHP

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
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

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.logout();
      window.location.href = '/admin-acesso';
    }
    return Promise.reject(error);
  }
);

export const viagensAPI = {
  // Métodos da API
  getAll: () => api.get('/viagens'),
  getById: (id) => api.get(`/viagens/${id}`),
  create: (viagemData) => api.post('/viagens', viagemData),
  update: (id, viagemData) => api.put(`/viagens/${id}`, viagemData),
  delete: (id) => api.delete(`/viagens/${id}`),
  updateCapa: (id, imagemId) => api.put(`/viagens/${id}/capa`, { imagemId }),
  getAleatorias: (limit = 3) => api.get(`/viagens/aleatorias?limit=${limit}`),
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
};

// Exportar a instância do axios também
export { api as axiosInstance };