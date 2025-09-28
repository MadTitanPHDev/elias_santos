// src/components/ViagemGaleria.js
import React, { useState } from 'react';
import './ViagemGaleria.css';

const ViagemGaleria = ({ imagens, titulo }) => {
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [indexAtual, setIndexAtual] = useState(0);
  const [erroImagens, setErroImagens] = useState({});

  // Função para obter URL completa da imagem
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300x200/cccccc/999999?text=Imagem+Não+Encontrada';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const handleImageError = (index) => {
    setErroImagens(prev => ({ ...prev, [index]: true }));
  };

  const abrirModal = (index) => {
    setImagemSelecionada(imagens[index]);
    setIndexAtual(index);
  };

  const fecharModal = () => {
    setImagemSelecionada(null);
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
      <h3 className="galeria-titulo">Galeria de Imagens</h3>
      <p className="galeria-contador">{imagens.length} imagem{imagens.length !== 1 ? 'ens' : ''}</p>
      
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
            {imagem.descricao_imagem && (
              <div className="galeria-descricao">
                <p>{imagem.descricao_imagem}</p>
              </div>
            )}
            {imagem.is_capa && (
              <div className="capa-badge">Capa</div>
            )}
          </div>
        ))}
      </div>

      {imagemSelecionada && (
        <div className="modal-overlay" onClick={fecharModal} onKeyDown={handleKeyDown} tabIndex={0}>
          <div className="modal-conteudo" onClick={e => e.stopPropagation()}>
            <button className="modal-fechar" onClick={fecharModal}>×</button>
            
            <div className="modal-imagem-container">
              <img 
                src={getImageUrl(imagemSelecionada.caminho_imagem)} 
                alt={imagemSelecionada.descricao_imagem || `Imagem da viagem ${titulo}`}
                className="modal-imagem"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600/cccccc/999999?text=Imagem+Não+Encontrada';
                }}
              />
            </div>

            <div className="modal-info">
              <h4>{imagemSelecionada.descricao_imagem || 'Imagem da viagem'}</h4>
              {imagemSelecionada.is_capa && <span className="capa-badge-modal">Imagem de Capa</span>}
            </div>

            <div className="modal-navegacao">
              <button className="nav-btn anterior" onClick={imagemAnterior}>‹</button>
              <span className="nav-contador">{indexAtual + 1} / {imagens.length}</span>
              <button className="nav-btn proximo" onClick={proximaImagem}>›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViagemGaleria;