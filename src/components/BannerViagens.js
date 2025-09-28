import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viagensAPI } from '../services/api';
import './BannerViagens.css';

const BannerViagens = () => {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    carregarViagensAleatorias();
  }, []);

  const carregarViagensAleatorias = async () => {
    try {
      setLoading(true);
      setError(null); // Limpar erro anterior
      const response = await viagensAPI.getAleatorias(5); // Busca 5 viagens aleatórias
      console.log('📋 Viagens aleatórias recebidas:', response.data);
      setViagens(response.data || []);
    } catch (err) {
      console.error('Erro no banner:', err);
      setError('Erro ao carregar viagens');
      setViagens([]); // Garantir que o array está vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  // Rotação automática do banner
  useEffect(() => {
    if (viagens.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === viagens.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Muda a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [viagens.length]);

  const handleViagemClick = (viagemId) => {
    navigate(`/viagem/${viagemId}`);
  };

  const nextViagem = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === viagens.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevViagem = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? viagens.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="banner-loading">
        <div className="loading-spinner"></div>
        <p>Carregando destinos incríveis...</p>
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
          onClick={carregarViagensAleatorias}
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

  const viagemAtual = viagens[currentIndex];
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

      {/* Controles de navegação */}
      {viagens.length > 1 && (
        <>
          <button className="banner-control prev" onClick={prevViagem}>
            ‹
          </button>
          <button className="banner-control next" onClick={nextViagem}>
            ›
          </button>
          
          {/* Indicadores */}
          <div className="banner-indicators">
            {viagens.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BannerViagens;