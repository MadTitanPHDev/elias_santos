// src/pages/EditarViagem.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { viagensAPI } from '../services/api';
import { authService } from '../services/auth';
import { URLS, getImageUrl } from '../config/urls';
import './NovaViagem.css'; // Reutilizar os mesmos estilos

const EditarViagem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    resumo: '',
    distancia_km: '',
    duracao_dias: '',
    data_viagem: '',
    localizacao: '',
    dificuldade: 'moderada',
    valor: ''
  });

  const [imagens, setImagens] = useState([]);
  const [imagensExistentes, setImagensExistentes] = useState([]);
  const [imagemCapaIndex, setImagemCapaIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [updatingCapa, setUpdatingCapa] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Verificar autenticação ao carregar o componente
  useEffect(() => {
    if (!authService.isAuthenticated() || !authService.isGestor()) {
      console.log('❌ Usuário não autorizado, redirecionando...');
      navigate('/admin-acesso');
      return;
    }
    
    carregarViagem();
  }, [navigate, id]);

  const carregarViagem = async () => {
    try {
      setLoading(true);
      const response = await viagensAPI.getById(id);
      const viagem = response.data;
      
      // Preencher o formulário com os dados existentes
      setFormData({
        titulo: viagem.titulo || '',
        descricao: viagem.descricao || '',
        resumo: viagem.resumo || '',
        distancia_km: viagem.distancia_km || '',
        duracao_dias: viagem.duracao_dias || '',
        data_viagem: viagem.data_viagem || '',
        localizacao: viagem.localizacao || '',
        dificuldade: viagem.dificuldade || 'moderada',
        valor: viagem.valor || ''
      });
      
      // Carregar imagens existentes
      if (viagem.imagens && viagem.imagens.length > 0) {
        setImagensExistentes(viagem.imagens);
        // Encontrar qual imagem é a capa
        const capaIndex = viagem.imagens.findIndex(img => img.is_capa);
        setImagemCapaIndex(capaIndex >= 0 ? capaIndex : 0);
      }
      
    } catch (error) {
      console.error('❌ Erro ao carregar viagem:', error);
      setError('Erro ao carregar dados da viagem');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação especial para o campo valor
    if (name === 'valor') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      const parts = numericValue.split('.');
      const formattedValue = parts.length > 2 
        ? parts[0] + '.' + parts.slice(1).join('')
        : numericValue;
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validação de tamanho e tipo de arquivo
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`Arquivo ${file.name} não é uma imagem válida.`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        setError(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length !== files.length) {
      return;
    }
    
    setImagens(validFiles);
    setError('');
  };

  const selecionarImagemCapa = async (index, isExisting = false) => {
    if (isExisting) {
      // Para imagens existentes, atualizar no banco de dados
      const imagemSelecionada = imagensExistentes[index];
      if (imagemSelecionada) {
        try {
          setUpdatingCapa(true);
          console.log('🖼️ Atualizando capa para imagem existente:', imagemSelecionada.id);
          await viagensAPI.updateCapa(id, imagemSelecionada.id);
          setImagemCapaIndex(index);
          console.log('✅ Capa atualizada com sucesso');
        } catch (error) {
          console.error('❌ Erro ao atualizar capa:', error);
          setError('Erro ao atualizar imagem de capa');
        } finally {
          setUpdatingCapa(false);
        }
      }
    } else {
      // Para novas imagens, apenas atualizar o índice local
      setImagemCapaIndex(imagensExistentes.length + index);
    }
  };

  const uploadImages = async (viagemId) => {
    const uploadedImages = [];
    const token = authService.getToken();
    
    for (let i = 0; i < imagens.length; i++) {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imagens[i]);
      uploadFormData.append('viagemId', viagemId.toString());
      uploadFormData.append('descricao', `Imagem ${i + 1} - ${formData.titulo}`);
      uploadFormData.append('isCapa', (imagensExistentes.length + i) === imagemCapaIndex ? 'true' : 'false');

      try {
        console.log('📤 Enviando nova imagem:', imagens[i].name);
        
        const response = await fetch(URLS.upload, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          uploadedImages.push(data.image);
          console.log('✅ Imagem enviada com sucesso:', data);
        } else {
          console.error('❌ Erro no upload:', data.error);
          throw new Error(data.error || `Erro ao enviar imagem ${i + 1}`);
        }
      } catch (error) {
        console.error('❌ Erro ao enviar imagem:', error);
        throw error;
      }
    }
    
    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação geral do formulário
    if (!formData.titulo.trim()) {
      setError('Por favor, informe o título da viagem.');
      return;
    }
    
    if (!formData.descricao.trim()) {
      setError('Por favor, informe a descrição da viagem.');
      return;
    }
    
    if (!formData.resumo.trim()) {
      setError('Por favor, informe o resumo da viagem.');
      return;
    }
    
    // Validação do valor
    if (!formData.valor || formData.valor.trim() === '') {
      setError('Por favor, informe um valor para a viagem.');
      return;
    }
    
    const valorNumerico = parseFloat(formData.valor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Por favor, informe um valor numérico válido maior que zero.');
      return;
    }
    
    if (!authService.isTokenValid()) {
      setError('Sessão expirada. Faça login novamente.');
      authService.logout();
      navigate('/admin-acesso');
      return;
    }
    
    setUploading(true);
    setError('');
    
    try {
      // Preparar dados para envio
      const dadosParaEnvio = {
        ...formData,
        valor: parseFloat(formData.valor)
      };
      
      console.log('📝 Atualizando viagem...', dadosParaEnvio);
      
      // 1. Atualizar a viagem
      await viagensAPI.update(id, dadosParaEnvio);
      console.log('✅ Viagem atualizada com sucesso');

      // 2. Fazer upload das novas imagens se houver
      if (imagens.length > 0) {
        console.log('🖼️ Iniciando upload de', imagens.length, 'novas imagens...');
        const uploadedImages = await uploadImages(id);
        console.log('✅ Todas as novas imagens enviadas');
        
        // 3. Se uma nova imagem foi selecionada como capa, atualizar no banco
        if (imagemCapaIndex >= imagensExistentes.length && uploadedImages.length > 0) {
          const novaImagemIndex = imagemCapaIndex - imagensExistentes.length;
          if (novaImagemIndex < uploadedImages.length) {
            const novaImagemCapa = uploadedImages[novaImagemIndex];
            console.log('🖼️ Definindo nova imagem como capa:', novaImagemCapa.id);
            await viagensAPI.updateCapa(id, novaImagemCapa.id);
          }
        }
      }

      alert('✅ Viagem atualizada com sucesso!');
      navigate(`/viagem/${id}`);
      
    } catch (error) {
      console.error('❌ Erro ao atualizar viagem:', error);
      
      if (error.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente.');
        authService.logout();
        navigate('/admin-acesso');
      } else if (error.response?.status === 403) {
        setError('Acesso negado. Apenas gestores podem editar viagens.');
      } else {
        setError(error.message || 'Erro ao atualizar viagem. Verifique o console para detalhes.');
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="nova-viagem-container">
        <div className="container">
          <div style={{textAlign: 'center', padding: '2rem'}}>
            <div className="loading-spinner"></div>
            <p>Carregando dados da viagem...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nova-viagem-container">
      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50'}}>
          ✏️ Editar Viagem
        </h2>
        
        {/* Exibir mensagem de erro */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="form-container">
          {/* Seção de Informações Básicas */}
          <div className="form-section">
            <h3>📝 Informações da Viagem</h3>
            
            <div className="form-group">
              <label className="form-label">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Serra do Rio do Rastro - SC"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Resumo *</label>
              <input
                type="text"
                name="resumo"
                value={formData.resumo}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Ex: Desafio na serra catarinense com vistas espetaculares"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição Completa *</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
                rows="5"
                className="form-input form-textarea"
                placeholder="Descreva detalhadamente a viagem..."
              />
            </div>
          </div>

          {/* Seção de Detalhes */}
          <div className="form-section">
            <h3>📊 Detalhes da Viagem</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">📏 Distância (km) *</label>
                <input
                  type="number"
                  step="0.1"
                  name="distancia_km"
                  value={formData.distancia_km}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ex: 85.5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">⏰ Duração (dias) *</label>
                <input
                  type="number"
                  name="duracao_dias"
                  value={formData.duracao_dias}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ex: 2"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">📅 Data da Viagem *</label>
                <input
                  type="date"
                  name="data_viagem"
                  value={formData.data_viagem}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">⚡ Dificuldade *</label>
                <select
                  name="dificuldade"
                  value={formData.dificuldade}
                  onChange={handleChange}
                  required
                  className="form-input form-select"
                >
                  <option value="fácil">Fácil</option>
                  <option value="moderada">Moderada</option>
                  <option value="difícil">Difícil</option>
                  <option value="extrema">Extrema</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">💰 Valor da Viagem (R$) *</label>
                <div className="valor-input-container">
                  <span className="valor-symbol">R$</span>
                  <input
                    type="text"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    required
                    className="form-input valor-input"
                    placeholder="150.00"
                    pattern="[0-9]+(\.[0-9]{1,2})?"
                    title="Digite um valor válido (ex: 150.00)"
                  />
                </div>
                <div className="form-help">
                  💡 Valor estimado da viagem em reais (ex: 150.00)
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">📍 Localização *</label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Ex: Santa Catarina, Brasil"
                />
                <div className="form-help">
                  Cidade, estado ou país da viagem
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Imagens Existentes */}
          {imagensExistentes.length > 0 && (
            <div className="form-section">
              <h3>🖼️ Imagens Atuais</h3>
              
              <div className="image-preview">
                {imagensExistentes.map((imagem, index) => (
                  <div key={imagem.id} className="preview-image-container">
                    <img
                      src={getImageUrl(imagem.caminho_imagem)}
                      alt={`Imagem ${index + 1}`}
                      className={`preview-image ${index === imagemCapaIndex ? 'capa-selecionada' : ''}`}
                      onClick={() => selecionarImagemCapa(index, true)}
                    />
                    <div className="capa-indicator">
                      {index === imagemCapaIndex ? '🖼️ CAPA' : '📷'}
                    </div>
                    <button
                      type="button"
                      className={`capa-button ${index === imagemCapaIndex ? 'active' : ''}`}
                      onClick={() => selecionarImagemCapa(index, true)}
                      disabled={updatingCapa}
                    >
                      {updatingCapa && index === imagemCapaIndex ? '⏳ Atualizando...' : 
                       index === imagemCapaIndex ? '✅ Capa' : 'Selecionar Capa'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="form-help">
                Clique em uma imagem existente para defini-la como capa
              </div>
            </div>
          )}

          {/* Seção de Novas Imagens */}
          <div className="form-section">
            <h3>📸 Adicionar Novas Imagens</h3>
            
            <div className="form-group">
              <label className="form-label">Selecionar Novas Imagens</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              <div className="form-help">
                Selecione novas imagens para adicionar à viagem. Você poderá escolher qual será a capa na pré-visualização.
              </div>
            </div>

            {imagens.length > 0 && (
              <div>
                <label className="form-label">Pré-visualização das Novas Imagens:</label>
                <div className="image-preview">
                  {Array.from(imagens).map((image, index) => (
                    <div key={index} className="preview-image-container">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className={`preview-image ${(imagensExistentes.length + index) === imagemCapaIndex ? 'capa-selecionada' : ''}`}
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        onClick={() => selecionarImagemCapa(index, false)}
                      />
                      <div className="capa-indicator">
                        {(imagensExistentes.length + index) === imagemCapaIndex ? '🖼️ CAPA' : '📷'}
                      </div>
                      <button
                        type="button"
                        className={`capa-button ${(imagensExistentes.length + index) === imagemCapaIndex ? 'active' : ''}`}
                        onClick={() => selecionarImagemCapa(index, false)}
                      >
                        {(imagensExistentes.length + index) === imagemCapaIndex ? '✅ Capa' : 'Selecionar Capa'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="form-help">
                  {imagens.length} nova(s) imagem(ns) selecionada(s) • Clique em uma imagem para defini-la como capa
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
            <button 
              type="button"
              onClick={() => navigate(`/viagem/${id}`)}
              className="cancel-button"
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                flex: 1
              }}
            >
              ❌ Cancelar
            </button>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={uploading}
              style={{flex: 1}}
            >
              {uploading ? '💾 Salvando...' : '✅ Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarViagem;
