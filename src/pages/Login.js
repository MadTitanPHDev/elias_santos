import React, { useState } from 'react';
import { authAPI } from '../services/authAPI'; // Importe o novo serviço
import { authService } from '../services/auth';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use a authAPI para login
      const response = await authAPI.login(formData.email, formData.senha);
      
      // Verifique se a resposta tem dados
      if (response.data && response.data.token) {
        authService.login(response.data.token, response.data.user);
        window.location.href = '/';
      } else {
        setError('Resposta inválida do servidor');
      }
    } catch (error) {
      if (error.response) {
        // Erro do servidor (4xx, 5xx)
        setError(error.response.data.error || `Erro ${error.response.status}`);
      } else if (error.request) {
        // Erro de rede (servidor não respondeu)
        setError('Servidor não respondeu. Verifique se o backend está rodando.');
      } else {
        // Outro erro
        setError('Erro inesperado: ' + error.message);
      }
      console.error('Erro completo no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🚴‍♂️ Acessar Sistema</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            //   placeholder="admin@biketravels.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            //   placeholder="admin123"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="admin-info">
          <h4>👤 Credenciais para teste:</h4>
          <p>Email: admin@eliassantos.com</p>
          <p>Senha: admin@eliasSantos</p>
        </div>
      </div>
    </div>
  );
};

export default Login;