// src/pages/ViagemDetalhes.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ViagemGaleria from '../components/ViagemGaleria';
import { viagensAPI } from '../services/api';
import './ViagemDetalhes.css';

const ViagemDetalhes = () => {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        setLoading(true);
        const response = await viagensAPI.getById(id);
        setViagem(response.data);
      } catch (err) {
        setError('Erro ao carregar detalhes da viagem');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViagem();
  }, [id]);

  const getDificuldadeClass = (dificuldade) => {
    const classes = {
      'fácil': 'dificuldade-facil',
      'moderada': 'dificuldade-moderada',
      'difícil': 'dificuldade-dificil',
      'extrema': 'dificuldade-extrema'
    };
    return classes[dificuldade] || 'dificuldade-moderada';
  };

  const formatarData = (data) => {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatarValor = (valor) => {
    if (!valor || valor === 0) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  // Função para obter a imagem de capa
  const getImagemCapa = () => {
    if (!viagem || !viagem.imagens || viagem.imagens.length === 0) {
      return null;
    }

    // Primeiro, tenta encontrar uma imagem marcada como capa
    const capa = viagem.imagens.find(img => img.is_capa === 1 || img.is_capa === true);
    
    // Se não encontrar, usa a primeira imagem
    return capa || viagem.imagens[0];
  };

  // Função para tratar URL da imagem
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
    return imagePath.startsWith('http') 
      ? imagePath 
      : `http://localhost:5000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando detalhes da viagem...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <Link to="/" className="btn-voltar">Voltar para a lista</Link>
      </div>
    );
  }

  if (!viagem) {
    return (
      <div className="not-found-container">
        <h2>Viagem não encontrada</h2>
        <p>A viagem que você está procurando não existe.</p>
        <Link to="/" className="btn-voltar">Voltar para a lista</Link>
      </div>
    );
  }

  const imagemCapa = getImagemCapa();

  return (
    <div className="viagem-detalhes">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>{viagem.titulo}</span>
        </nav>

        {/* Cabeçalho */}
        <div className="detalhes-header">
          <div className="header-content">
            <h1 className="detalhes-titulo">{viagem.titulo}</h1>

            <div className="detalhes-meta">
              <div className="meta-item">
                <span className="meta-label">📍 Localização:</span>
                <span className="meta-value">{viagem.localizacao || 'Não informada'}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">📅 Data:</span>
                <span className="meta-value">{formatarData(viagem.data_viagem)}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">🚴‍♂️ Distância:</span>
                <span className="meta-value">{viagem.distancia_km || '0'} km</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">⏱️ Duração:</span>
                <span className="meta-value">{viagem.duracao_dias || '0'} dia{viagem.duracao_dias !== 1 ? 's' : ''}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">⚡ Dificuldade:</span>
                <span className={`meta-value ${getDificuldadeClass(viagem.dificuldade)}`}>
                  {viagem.dificuldade || 'Não informada'}
                </span>
              </div>
            </div>
          </div>


          <div className="header-image">
            <img
              src={imagemCapa ? getImageUrl(imagemCapa.caminho_imagem) : 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'}
              alt={`Capa: ${viagem.titulo}`}
              className="capa-imagem"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="detalhes-content">
          {/* Resumo */}
          <section className="detalhes-section">
            <h2>📋 Resumo da Viagem</h2>
            <p className="detalhes-resumo">{viagem.resumo || 'Nenhum resumo disponível.'}</p>
          </section>

          {/* Descrição Completa */}
          <section className="detalhes-section">
            <h2>📝 Descrição Completa</h2>
            <div className="detalhes-descricao">
              {viagem.descricao ? (
                viagem.descricao.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Nenhuma descrição disponível.</p>
              )}
            </div>
          </section>

          {/* Galeria de Imagens */}
          {viagem.imagens && viagem.imagens.length > 0 && (
            <section className="detalhes-section">
              <h2>📸 Galeria de Fotos</h2>
              <ViagemGaleria imagens={viagem.imagens} titulo={viagem.titulo} />
            </section>
          )}

          {/* Informações Adicionais */}
          <section className="detalhes-section">
            <h2>ℹ️ Informações Adicionais</h2>
            <div className="info-grid">
              <div className="info-card">
                <h4>📊 Dificuldade</h4>
                <p className={getDificuldadeClass(viagem.dificuldade)}>
                  {viagem.dificuldade || 'Não informada'}
                </p>
              </div>

              <div className="info-card">
                <h4>📏 Distância Total</h4>
                <p>{viagem.distancia_km || '0'} km</p>
              </div>

              <div className="info-card">
                <h4>⏰ Duração</h4>
                <p>{viagem.duracao_dias || '0'} dia{viagem.duracao_dias !== 1 ? 's' : ''}</p>
              </div>

              <div className="info-card">
                <h4>📅 Data da Viagem</h4>
                <p>{formatarData(viagem.data_viagem)}</p>
              </div>

              <div className="info-card valor-card">
                <h4>💰 Valor</h4>
                <p className="valor-texto">{formatarValor(viagem.valor)}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Rodapé */}
        <div className="detalhes-footer">
          <Link to="/" className="btn-voltar">
            ← Voltar para a Lista
          </Link>

          <div className="footer-meta">
            <span>Criado em: {viagem.created_at ? new Date(viagem.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}</span>
            {viagem.updated_at && viagem.updated_at !== viagem.created_at && (
              <span>Atualizado em: {new Date(viagem.updated_at).toLocaleDateString('pt-BR')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViagemDetalhes;