// src/pages/ViagemDetalhes.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ViagemGaleria from '../components/ViagemGaleria';
import LazyImage from '../components/LazyImage';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { viagensAPI } from '../services/api';
import { getImageUrl, getViagemUrl } from '../config/urls';
import './ViagemDetalhes.css';

const ViagemDetalhes = () => {
  const { id } = useParams();
  const [viagem, setViagem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuCompartilharAberto, setMenuCompartilharAberto] = useState(false);
  const [viagemAnterior, setViagemAnterior] = useState(null);
  const [viagemProxima, setViagemProxima] = useState(null);

  useEffect(() => {
    const fetchViagem = async () => {
      try {
        setLoading(true);
        const response = await viagensAPI.getById(id);
        setViagem(response.data);

        // Buscar viagens anterior e próxima
        const todasViagens = await viagensAPI.getAll();
        const viagens = todasViagens.data;
        const indexAtual = viagens.findIndex(v => v.id === parseInt(id));
        
        if (indexAtual > 0) {
          setViagemAnterior(viagens[indexAtual - 1]);
        }
        if (indexAtual < viagens.length - 1) {
          setViagemProxima(viagens[indexAtual + 1]);
        }
      } catch (err) {
        setError('Erro ao carregar detalhes da viagem');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchViagem();
  }, [id]);

  // Fechar menu de compartilhamento ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuCompartilharAberto && !event.target.closest('.compartilhar-container')) {
        setMenuCompartilharAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuCompartilharAberto]);

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

  // Função para tratar URL da imagem (renomeada para evitar conflito)
  const buildImageUrl = (imagePath) => {
    return getImageUrl(imagePath);
  };


  // Função para compartilhar
  const compartilhar = (plataforma) => {
    const url = window.location.href;
    const titulo = viagem?.titulo || 'Viagem';
    const texto = `Confira esta viagem incrível: ${titulo}`;
    
    let urlCompartilhamento = '';
    
    switch (plataforma) {
      case 'whatsapp':
        urlCompartilhamento = `https://wa.me/?text=${encodeURIComponent(texto + ' ' + url)}`;
        break;
      case 'facebook':
        urlCompartilhamento = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        urlCompartilhamento = `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`;
        break;
      case 'link':
        navigator.clipboard.writeText(url);
        alert('Link copiado para a área de transferência!');
        setMenuCompartilharAberto(false);
        return;
      default:
        return;
    }
    
    window.open(urlCompartilhamento, '_blank', 'width=600,height=400');
    setMenuCompartilharAberto(false);
  };

  // Função para imprimir
  const imprimir = () => {
    window.print();
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

  // Dados estruturados para a viagem específica
  const structuredData = viagem ? {
    "@context": "https://schema.org",
    "@type": "TravelAction",
    "name": viagem.titulo,
    "description": viagem.resumo || viagem.descricao,
    "url": getViagemUrl(viagem.id),
    "image": imagemCapa ? getImageUrl(imagemCapa.caminho_imagem) : undefined,
    "location": {
      "@type": "Place",
      "name": viagem.localizacao || "Local não informado"
    },
    "startTime": viagem.data_viagem,
    "duration": viagem.duracao_dias ? `P${viagem.duracao_dias}D` : undefined,
    "distance": viagem.distancia_km ? `${viagem.distancia_km} km` : undefined,
    "organizer": {
      "@type": "Person",
      "name": "Elias Santos"
    },
    "offers": viagem.valor ? {
      "@type": "Offer",
      "price": viagem.valor,
      "priceCurrency": "BRL"
    } : undefined
  } : null;

  return (
    <div className="viagem-detalhes">
      {viagem && (
        <SEO 
          title={viagem.titulo}
          description={viagem.resumo || `Descubra todos os detalhes da viagem ${viagem.titulo}. ${viagem.localizacao ? `Localizada em ${viagem.localizacao}.` : ''} ${viagem.distancia_km ? `Distância: ${viagem.distancia_km}km.` : ''} ${viagem.duracao_dias ? `Duração: ${viagem.duracao_dias} dias.` : ''}`}
          keywords={`${viagem.titulo}, cicloviagem, ciclismo, ${viagem.localizacao || ''}, Elias Santos, viagem de bicicleta, rota ciclística, ${viagem.dificuldade || ''}`}
          image={imagemCapa ? buildImageUrl(imagemCapa.caminho_imagem) : undefined}
          url={`/viagem/${viagem.id}`}
          type="article"
          structuredData={structuredData}
        />
      )}
      <div className="container">
        {/* Breadcrumb */}
        <Breadcrumbs 
          items={[
            { name: 'Home', url: '/' },
            { name: viagem.titulo, url: null }
          ]}
        />

        {/* Cabeçalho */}
        <div className="detalhes-header">
          <div className="header-content">
            <div className="titulo-container">
              <h1 className="detalhes-titulo">{viagem.titulo}</h1>
              <div className="acoes-titulo">
                <div className="compartilhar-container">
                  <button 
                    className="btn-compartilhar"
                    onClick={() => setMenuCompartilharAberto(!menuCompartilharAberto)}
                    title="Compartilhar"
                  >
                    📤
                  </button>
                  {menuCompartilharAberto && (
                    <div className="menu-compartilhar ativo">
                      <button onClick={() => compartilhar('whatsapp')}>
                        📱 WhatsApp
                      </button>
                      <button onClick={() => compartilhar('facebook')}>
                        📘 Facebook
                      </button>
                      <button onClick={() => compartilhar('twitter')}>
                        🐦 Twitter
                      </button>
                      <button onClick={() => compartilhar('link')}>
                        🔗 Copiar Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
            <LazyImage
              src={imagemCapa ? buildImageUrl(imagemCapa.caminho_imagem) : getImageUrl(null)}
              alt={`Capa: ${viagem.titulo}`}
              className="capa-imagem"
              onError={(e) => {
                e.target.src = getImageUrl(null);
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
            
            {/* Botão de Inscrição */}
            <div className="inscricao-container">
              <button className="btn-inscricao">
                🎯 Inscrever-se na Viagem
              </button>
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

        {/* Navegação entre viagens
        {(viagemAnterior || viagemProxima) && (
          <div className="navegacao-viagens">
            <div className="nav-anterior">
              {viagemAnterior ? (
                <Link to={`/viagem/${viagemAnterior.id}`} className="nav-btn">
                  ← {viagemAnterior.titulo}
                </Link>
              ) : (
                <div className="nav-info">Primeira viagem</div>
              )}
            </div>
            
            <div className="nav-info">
              Navegar entre viagens
            </div>
            
            <div className="nav-proxima">
              {viagemProxima ? (
                <Link to={`/viagem/${viagemProxima.id}`} className="nav-btn">
                  {viagemProxima.titulo} →
                </Link>
              ) : (
                <div className="nav-info">Última viagem</div>
              )}
            </div>
          </div>
        )} */}




        {/* Rodapé */}
        <div className="detalhes-footer">
          <div className="footer-acoes">
            <Link to="/" className="btn-voltar">
              ← Voltar para a Lista
            </Link>
            <button className="btn-imprimir" onClick={imprimir}>
              🖨️ Imprimir
            </button>
          </div>

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