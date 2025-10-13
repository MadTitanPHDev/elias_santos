import axios from 'axios';
import { getBackendUrl } from '../config/backend';

const API_BASE_URL = getBackendUrl();

export const authAPI = {
  // Método de login
  login: (email, senha) => 
    axios.post(`${API_BASE_URL}/login`, { email, senha }),
  
  // Verificar token
  verifyToken: (token) => 
    axios.get(`${API_BASE_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  
  // Criar usuário (apenas para gestores)
  createUser: (userData, token) =>
    axios.post(`${API_BASE_URL}/usuarios`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};