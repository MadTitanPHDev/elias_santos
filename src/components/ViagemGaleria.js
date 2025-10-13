// src/components/ViagemGaleria.js
import React, { useState } from 'react';
import { getImageUrl as buildImageUrl } from '../config/urls';
import './ViagemGaleria.css';

const ViagemGaleria = ({ imagens, titulo }) => {
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [indexAtual, setIndexAtual] = useState(0);
  const [erroImagens, setErroImagens] = useState({});
  const [modoVisualizacao, setModoVisualizacao] = useState('grid'); // 'grid' ou 'carrossel'
  const [indexCarrossel, setIndexCarrossel] = useState(0);
  
  // Estados para zoom e pan
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados para touch/swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lastTouchTime, setLastTouchTime] = useState(0);

  // Função para obter URL completa da imagem
  const getImageUrl = (path) => {
    return buildImageUrl(path);
  };

  const handleImageError = (index) => {
    setErroImagens(prev => ({ ...prev, [index]: true }));
  };

  const abrirModal = (index) => {
    setImagemSelecionada(imagens[index]);
    setIndexAtual(index);
    resetZoom(); // Reset zoom ao abrir nova imagem
  };

  const fecharModal = () => {
    setImagemSelecionada(null);
    resetZoom(); // Reset zoom ao fechar modal
  };

  const proximaImagem = () => {
    const novoIndex = (indexAtual + 1) % imagens.length;
    setImagemSelecionada(imagens[novoIndex]);
    setIndexAtual(novoIndex);
  };

  const imagemAnterior = () => {
    const novoIndex = (indexAtual - 1 + imagens.length) % imagens.length;
    setImagemSelecionada(imagens[novoIndex]);
    setIndexAtual(novoIndex);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'ArrowRight') proximaImagem();
    if (e.key === 'ArrowLeft') imagemAnterior();
    if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    if (e.key === '0') resetZoom();
    if (e.key === '+' || e.key === '=') zoomIn();
    if (e.key === '-') zoomOut();
  };

  // Funções de zoom
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.2, 5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Funções de pan (arrastar)
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Funções de touch/swipe
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setLastTouchTime(Date.now());
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && zoomLevel > 1) {
      // Pan com um dedo
      const touch = e.touches[0];
      setPanOffset({
        x: touch.clientX - touchStart.x,
        y: touch.clientY - touchStart.y
      });
    } else if (e.touches.length === 2) {
      // Zoom com dois dedos
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchStart.distance) {
        const scale = distance / touchStart.distance;
        setZoomLevel(prev => Math.min(Math.max(prev * scale, 0.5), 5));
      }
      
      setTouchStart({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    // Verificar se é um swipe rápido
    const timeDiff = Date.now() - lastTouchTime;
    const swipeThreshold = 300; // ms
    const swipeDistance = 50; // px
    
    if (timeDiff < swipeThreshold) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeDistance) {
        if (deltaX > 0) {
          imagemAnterior();
        } else {
          proximaImagem();
        }
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Funções do carrossel
  const proximaImagemCarrossel = () => {
    setIndexCarrossel((indexCarrossel + 1) % imagens.length);
  };

  const imagemAnteriorCarrossel = () => {
    setIndexCarrossel((indexCarrossel - 1 + imagens.length) % imagens.length);
  };

  const irParaImagem = (index) => {
    setIndexCarrossel(index);
  };

  if (!imagens || imagens.length === 0) {
    return (
      <div className="galeria-vazia">
        <p>Nenhuma imagem disponível para esta viagem.</p>
      </div>
    );
  }

  return (
    <div className="viagem-galeria">
      <div className="galeria-header">
        <h3 className="galeria-titulo">Galeria</h3>
        
        <div className="galeria-controles">
          <button 
            className={`controle-btn ${modoVisualizacao === 'grid' ? 'ativo' : ''}`}
            onClick={() => setModoVisualizacao('grid')}
          >
            ⊞
          </button>
          <button 
            className={`controle-btn ${modoVisualizacao === 'carrossel' ? 'ativo' : ''}`}
            onClick={() => setModoVisualizacao('carrossel')}
          >
            ⏵
          </button>
        </div>
      </div>
      
      {modoVisualizacao === 'grid' ? (
        <div className="galeria-grid">
        {imagens.map((imagem, index) => (
          <div 
            key={imagem.id || index} 
            className="galeria-item"
            onClick={() => abrirModal(index)}
          >
            <img 
              src={erroImagens[index] ? 'https://via.placeholder.com/300x200/cccccc/999999?text=Erro+ao+Carregar' : getImageUrl(imagem.caminho_imagem)}
              alt={imagem.descricao_imagem || `Imagem ${index + 1} da viagem ${titulo}`}
              className="galeria-imagem"
              loading="lazy"
              onError={() => handleImageError(index)}
            />
            {imagem.is_capa && (
              <div className="capa-badge">Capa</div>
            )}
          </div>
        ))}
        </div>
      ) : (
        <div className="galeria-carrossel">
          <div className="carrossel-container">
            <button 
              className="carrossel-btn anterior"
              onClick={imagemAnteriorCarrossel}
              disabled={imagens.length <= 1}
            >
              ‹
            </button>
            
            <div className="carrossel-imagem-container">
              <img 
                src={erroImagens[indexCarrossel] ? 'https://via.placeholder.com/800x600/cccccc/999999?text=Erro+ao+Carregar' : getImageUrl(imagens[indexCarrossel].caminho_imagem)}
                alt={imagens[indexCarrossel].descricao_imagem || `Imagem ${indexCarrossel + 1} da viagem ${titulo}`}
                className="carrossel-imagem"
                onClick={() => abrirModal(indexCarrossel)}
                onError={() => handleImageError(indexCarrossel)}
              />
            </div>
            
            <button 
              className="carrossel-btn proximo"
              onClick={proximaImagemCarrossel}
              disabled={imagens.length <= 1}
            >
              ›
            </button>
          </div>
          
          <div className="carrossel-indicadores">
            {imagens.map((_, index) => (
              <button
                key={index}
                className={`indicador ${index === indexCarrossel ? 'ativo' : ''}`}
                onClick={() => irParaImagem(index)}
              />
            ))}
          </div>
          
        </div>
      )}

      {imagemSelecionada && (
        <div 
          className="modal-overlay" 
          onClick={fecharModal} 
          onKeyDown={handleKeyDown} 
          tabIndex={0}
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Botão fechar minimalista */}
          <button 
            className="modal-fechar" 
            onClick={(e) => {
              e.stopPropagation();
              fecharModal();
            }}
          >
            ×
          </button>
          
          {/* Container da imagem */}
          <div 
            className="modal-imagem-container"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={e => e.stopPropagation()}
            style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            <img 
              src={getImageUrl(imagemSelecionada.caminho_imagem)} 
              alt={imagemSelecionada.descricao_imagem || `Imagem da viagem ${titulo}`}
              className="modal-imagem"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/cccccc/999999?text=Imagem+Não+Encontrada';
              }}
              draggable={false}
            />
          </div>

          {/* Setas de navegação minimalistas */}
          {imagens.length > 1 && (
            <>
              <button 
                className="modal-nav anterior" 
                onClick={(e) => {
                  e.stopPropagation();
                  imagemAnterior();
                }}
              >
                ‹
              </button>
              <button 
                className="modal-nav proximo" 
                onClick={(e) => {
                  e.stopPropagation();
                  proximaImagem();
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ViagemGaleria;