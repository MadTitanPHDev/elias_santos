// src/components/ViagemCard.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';
import { viagensAPI } from '../services/api';
import { authService } from '../services/auth';
import { getImageUrl } from '../config/urls';
import './ViagemCard.css';

const ViagemCard = ({ viagem, onViagemDeleted }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  
 // DEBUG
  
  const getDificuldadeClass = (dificuldade) => {
    const classes = {
      'fácil': 'facil',
      'moderada': 'moderada',
      'difícil': 'dificil',
      'extrema': 'extrema'
    };
    return classes[dificuldade] || 'moderada';
  };

  // Função para obter a imagem corretamente
  const getImagemUrl = () => {
    // Verifica todos os possíveis campos onde a imagem pode estar
    if (viagem.imagem_capa) {
      return getImageUrl(viagem.imagem_capa);
    }
    if (viagem.imagemCapa) {
      return getImageUrl(viagem.imagemCapa);
    }
    if (viagem.caminho_imagem) {
      return getImageUrl(viagem.caminho_imagem);
    }
    
    return getImageUrl(null); // Retorna imagem padrão
  };

  const handleImageError = (e) => {
    console.error('Erro ao carregar imagem:', e.target.src);
    e.target.src = getImageUrl(null); // Usar função centralizada
  };

  const handleEdit = () => {
    navigate(`/editar-viagem/${viagem.id}`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await viagensAPI.delete(viagem.id);
      console.log('✅ Viagem excluída com sucesso');
      
      // Notificar o componente pai para atualizar a lista
      if (onViagemDeleted) {
        onViagemDeleted(viagem.id);
      }
      
      setShowConfirmDelete(false);
    } catch (error) {
      console.error('❌ Erro ao excluir viagem:', error);
      alert('Erro ao excluir viagem. Verifique o console para detalhes.');
    } finally {
      setDeleting(false);
    }
  };

  const isGestor = authService.isAuthenticated() && authService.isGestor();

  return (
    <div className="viagem-card">
      <LazyImage 
        src={getImagemUrl()} 
        alt={viagem.titulo} 
        className="viagem-imagem"
        onError={handleImageError}
      />
      <div className="viagem-content">
        <h2 className="viagem-titulo">{viagem.titulo}</h2>
        <div className="viagem-meta">
          <span>{viagem.distancia_km} km • {viagem.duracao_dias} dias</span>
          <span className={`dificuldade ${getDificuldadeClass(viagem.dificuldade)}`}>
            {viagem.dificuldade}
          </span>
        </div>
        <p className="viagem-resumo">{viagem.resumo}</p>
        <p className="viagem-descricao">
          {viagem.descricao ? viagem.descricao.substring(0, 150) + '...' : ''}
        </p>
        <div className="viagem-actions">
          <Link to={`/viagem/${viagem.id}`} className="btn-detalhes">
            Ver Detalhes
          </Link>
          
          {isGestor && (
            <div className="admin-actions">
              <button 
                onClick={handleEdit}
                className="btn-edit"
                title="Editar viagem"
              >
                ✏️ Editar
              </button>
              
              {!showConfirmDelete ? (
                <button 
                  onClick={() => setShowConfirmDelete(true)}
                  className="btn-delete"
                  title="Excluir viagem"
                >
                  🗑️ Excluir
                </button>
              ) : (
                <div className="confirm-delete">
                  <span>Tem certeza?</span>
                  <button 
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-confirm-delete"
                  >
                    {deleting ? '🗑️ Excluindo...' : '✅ Sim'}
                  </button>
                  <button 
                    onClick={() => setShowConfirmDelete(false)}
                    className="btn-cancel-delete"
                  >
                    ❌ Não
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViagemCard;