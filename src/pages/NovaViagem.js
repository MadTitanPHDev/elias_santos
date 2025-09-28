
// src/pages/NovaViagem.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viagensAPI } from '../services/api';
import { authService } from '../services/auth';
import './NovaViagem.css';


const NovaViagem = () => {
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
  const [imagemCapaIndex, setImagemCapaIndex] = useState(0); // Índice da imagem que será a capa
  const [uploading, setUploading] = useState(false);
  const [viagemCriada, setViagemCriada] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // PASSO 4: Verificar autenticação ao carregar o componente
  useEffect(() => {
    if (!authService.isAuthenticated() || !authService.isGestor()) {
      console.log('❌ Usuário não autorizado, redirecionando...');
      navigate('/admin-acesso');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatação especial para o campo valor
    if (name === 'valor') {
      // Remove caracteres não numéricos exceto ponto
      const numericValue = value.replace(/[^0-9.]/g, '');
      // Garante apenas um ponto decimal
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
      return; // Não atualizar se há arquivos inválidos
    }
    
    setImagens(validFiles);
    setImagemCapaIndex(0); // Resetar para a primeira imagem como capa
    setError(''); // Limpar erro se tudo estiver ok
  };

  const selecionarImagemCapa = (index) => {
    setImagemCapaIndex(index);
  };

  const uploadImages = async (viagemId) => {
  const uploadedImages = [];
  const token = authService.getToken();
  
  for (let i = 0; i < imagens.length; i++) {
    const uploadFormData = new FormData();
    uploadFormData.append('image', imagens[i]);
    uploadFormData.append('viagemId', viagemId.toString());
    uploadFormData.append('descricao', `Imagem ${i + 1} - ${formData.titulo}`);
    uploadFormData.append('isCapa', i === imagemCapaIndex ? 'true' : 'false');

    try {
      console.log('📤 Enviando imagem:', imagens[i].name);
      
      // Usar fetch diretamente para melhor controle
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Não definir Content-Type - o browser faz automaticamente para FormData
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
      throw error; // Propagar o erro para ser tratado no handleSubmit
    }
  }
  
  return uploadedImages;
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  debugFormData();
  
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
  console.log('🔍 Validando valor:', formData.valor);
  if (!formData.valor || formData.valor.trim() === '') {
    setError('Por favor, informe um valor para a viagem.');
    return;
  }
  
  const valorNumerico = parseFloat(formData.valor);
  if (isNaN(valorNumerico) || valorNumerico <= 0) {
    setError('Por favor, informe um valor numérico válido maior que zero.');
    return;
  }
  
  console.log('✅ Valor validado:', valorNumerico);
  
  if (!authService.isTokenValid()) {
    setError('Sessão expirada. Faça login novamente.');
    authService.logout();
    navigate('/admin-acesso');
    return;
  }
  
  setUploading(true);
  setError('');
  
  const timeout = setTimeout(() => {
    if (uploading) {
      setUploading(false);
      setError('Tempo limite excedido. Verifique sua conexão.');
      console.error('⏰ Timeout excedido no upload');
    }
  }, 10000);

  try {
    // Preparar dados para envio
    const dadosParaEnvio = {
      ...formData,
      valor: parseFloat(formData.valor) // Garantir que seja número
    };
    
    console.log('📝 Criando viagem...', dadosParaEnvio);
    console.log('💰 Valor sendo enviado:', dadosParaEnvio.valor, typeof dadosParaEnvio.valor);
    
    // 1. Criar a viagem
    const response = await viagensAPI.create(dadosParaEnvio);
    const viagemId = response.data.id;
    console.log('✅ Viagem criada com ID:', viagemId);
    setViagemCriada(viagemId);

    // 2. Fazer upload das imagens se houver
    if (imagens.length > 0) {
      console.log('🖼️ Iniciando upload de', imagens.length, 'imagens...');
      const uploaded = await uploadImages(viagemId);
      console.log('✅ Todas as imagens enviadas:', uploaded.length);
    } else {
      console.log('ℹ️ Nenhuma imagem para enviar');
    }

    // 3. Limpar o formulário
    setFormData({
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
    setImagens([]);
    
    // Mostrar mensagem de sucesso
    alert('✅ Viagem criada com sucesso!');
    
    // Opcional: Redirecionar para a lista de viagens ou home
    // navigate('/');

  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    
    if (error.response?.status === 401) {
      setError('Sessão expirada. Faça login novamente.');
      authService.logout();
      navigate('/admin-acesso');
    } else if (error.response?.status === 403) {
      setError('Acesso negado. Apenas gestores podem criar viagens.');
    } else {
      setError(error.message || 'Erro ao criar viagem. Verifique o console para detalhes.');
    }
  } finally {
    clearTimeout(timeout);
    setUploading(false);
  }
};

const debugFormData = () => {
  console.log('📋 Dados do formulário:', formData);
  console.log('💰 Valor específico:', {
    valor: formData.valor,
    valorType: typeof formData.valor,
    valorLength: formData.valor ? formData.valor.length : 'undefined',
    valorParsed: parseFloat(formData.valor)
  });
  console.log('🖼️ Imagens selecionadas:', imagens.length);
  console.log('🔐 Token válido:', authService.isTokenValid());
  console.log('👤 Usuário:', authService.getUser());
};

  return (
    <div className="nova-viagem-container">
      <div className="container">
        <h2 style={{textAlign: 'center', marginBottom: '2rem', color: '#2c3e50'}}>
          🚴‍♂️ Adicionar Nova Viagem
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

          {/* Seção de Imagens */}
          <div className="form-section">
            <h3>📸 Imagens da Viagem</h3>
            
            <div className="form-group">
              <label className="form-label">Selecionar Imagens</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
              <div className="form-help">
                Selecione uma ou mais imagens. Você poderá escolher qual será a capa na pré-visualização.
              </div>
            </div>

            {imagens.length > 0 && (
              <div>
                <label className="form-label">Pré-visualização e Seleção de Capa:</label>
                <div className="image-preview">
                  {Array.from(imagens).map((image, index) => (
                    <div key={index} className="preview-image-container">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className={`preview-image ${index === imagemCapaIndex ? 'capa-selecionada' : ''}`}
                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        onClick={() => selecionarImagemCapa(index)}
                      />
                      <div className="capa-indicator">
                        {index === imagemCapaIndex ? '🖼️ CAPA' : '📷'}
                      </div>
                      <button
                        type="button"
                        className={`capa-button ${index === imagemCapaIndex ? 'active' : ''}`}
                        onClick={() => selecionarImagemCapa(index)}
                      >
                        {index === imagemCapaIndex ? '✅ Capa' : 'Selecionar Capa'}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="form-help">
                  {imagens.length} imagem(ns) selecionada(s) • Clique em uma imagem para defini-la como capa
                </div>
              </div>
            )}
          </div>

          {/* Botão de Envio */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={uploading}
          >
            {uploading ? '💾 Salvando...' : '✅ Salvar Viagem'}
          </button>

          {viagemCriada && (
            <div className="success-message">
              ✅ Viagem criada com sucesso! ID: {viagemCriada}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NovaViagem;