import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viagensAPI } from '../services/api';
import './BannerViagens.css';

const BannerViagens = () => {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarViagemAleatoria();
  }, []);

  const carregarViagemAleatoria = async () => {
    try {
      setLoading(true);
      setError(null); // Limpar erro anterior
      const response = await viagensAPI.getAleatorias(1); // Busca apenas 1 viagem aleatória
      console.log('📋 Viagem aleatória recebida:', response.data);
      setViagens(response.data || []);
    } catch (err) {
      console.error('Erro no banner:', err);
      setError('Erro ao carregar viagem');
      setViagens([]); // Garantir que o array está vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };


  const handleViagemClick = (viagemId) => {
    navigate(`/viagem/${viagemId}`);
  };


  if (loading) {
    return (
      <div className="banner-loading">
        <div className="loading-spinner"></div>
        <p>Carregando destino incrível...</p>
      </div>
    );
  }

  if (error && viagens.length === 0) {
    return (
      <div className="banner-error">
        <p>🚴‍♂️ Descubra novas aventuras em breve!</p>
        <small>Nossos destinos estão sendo preparados</small>
        <small style={{marginTop: '10px', opacity: 0.7}}>
          {error.includes('404') ? 'Servidor não está rodando' : error}
        </small>
        <button 
          onClick={carregarViagemAleatoria}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#ffb82a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  // Verificar se há viagens disponíveis
  if (viagens.length === 0) {
    return (
      <div className="banner-viagens">
        <div className="banner-item banner-placeholder">
          <div className="banner-content">
            <h2 className="banner-titulo">🚴‍♂️ Descubra Novas Aventuras</h2>
            <p className="banner-descricao">Em breve, novas viagens incríveis estarão disponíveis!</p>
            <div className="banner-info">
              <span className="banner-distancia">Em breve</span>
              <span className="banner-dias">Aventuras</span>
              <span className="banner-dificuldade moderada">Moderada</span>
            </div>
            <button className="banner-btn" onClick={() => window.location.reload()}>
              🔄 Atualizar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const viagemAtual = viagens[0]; // Sempre a primeira (e única) viagem
  console.log('🎯 Banner - viagem atual:', viagemAtual);

  // Construir URL completa da imagem de capa
  const getImageUrl = (imagePath) => {
    console.log('🖼️ Banner - imagem_capa recebida:', imagePath);
    if (!imagePath) {
      console.log('🖼️ Banner - usando imagem padrão');
      return 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80';
    }
    if (imagePath.startsWith('http')) {
      console.log('🖼️ Banner - URL já completa:', imagePath);
      return imagePath;
    }
    const fullUrl = `http://localhost:5000${imagePath}`;
    console.log('🖼️ Banner - URL construída:', fullUrl);
    return fullUrl;
  };

  return (
    <div className="banner-viagens">
      <div 
        className="banner-item"
        onClick={() => handleViagemClick(viagemAtual.id)}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${getImageUrl(viagemAtual.imagem_capa)})`
        }}
      >
        <div className="banner-content">
          <h2 className="banner-titulo">{viagemAtual.titulo}</h2>
          <p className="banner-descricao">{viagemAtual.resumo || viagemAtual.descricao?.substring(0, 100) + '...'}</p>
          
          <div className="banner-info">
            <span className="banner-distancia">{viagemAtual.distancia_km} km</span>
            <span className="banner-dias">{viagemAtual.duracao_dias} dias</span>
            <span className={`banner-dificuldade ${viagemAtual.dificuldade}`}>
              {viagemAtual.dificuldade}
            </span>
          </div>

          <button className="banner-btn">
            Ver Detalhes →
          </button>
        </div>
      </div>

    </div>
  );
};

export default BannerViagens;