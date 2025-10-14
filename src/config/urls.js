/**
 * Configuração Centralizada de URLs
 * Todas as URLs da aplicação devem ser definidas aqui
 */

// URL base do site (produção)
export const SITE_URL = process.env.REACT_APP_SITE_URL || 'https://khaki-alpaca-178991.hostingersite.com';

// URL base da API
export const API_URL = process.env.REACT_APP_API_URL || 'https://khaki-alpaca-178991.hostingersite.com/backend-php/api';

// URLs específicas
export const URLS = {
  // Site principal
  home: SITE_URL,
  sobre: `${SITE_URL}/sobre`,
  
  // API
  api: {
    base: API_URL,
    viagens: `${API_URL}/viagens`,
    login: `${API_URL}/login`,
    upload: `${API_URL}/upload`,
    health: `${API_URL}/health`
  },
  
  // Upload de imagens
  upload: `${API_URL}/upload`,
  
  // Imagens
  images: {
    base: SITE_URL,
    uploads: `${SITE_URL}/backend-php/uploads`
  },
  
  // Social
  social: {
    whatsapp: 'https://wa.me/5511999999999',
    email: 'mailto:contato@eliassantos.com',
    instagram: 'https://instagram.com/eliassantoscicloviagens',
    facebook: 'https://facebook.com/eliassantoscicloviagens',
    twitter: 'https://twitter.com/eliassantosbike',
    youtube: 'https://youtube.com/@eliassantoscicloviagens'
  }
};

// Função para construir URL de imagem
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1549476464-37392f717541?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Se é um caminho relativo, construir URL completa
  return `${URLS.images.base}${imagePath}`;
};

// Função para construir URL de página
export const getPageUrl = (path = '') => {
  const cleanPath = path.replace(/^\//, '');
  return cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
};

// Função para construir URL de viagem
export const getViagemUrl = (viagemId) => {
  return `${SITE_URL}/viagem/${viagemId}`;
};

export default URLS;
