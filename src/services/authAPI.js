import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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