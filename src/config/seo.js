// Configurações de SEO
export const SEO_CONFIG = {
  siteName: 'Elias Santos - Cicloviagens',
  siteUrl: process.env.REACT_APP_SITE_URL || 'https://khaki-alpaca-178991.hostingersite.com',
  defaultDescription: 'Descubra as melhores cicloviagens e rotas para pedalar. Aventuras sobre duas rodas, galeria de fotos e dicas para ciclistas.',
  defaultKeywords: 'cicloviagens, ciclismo, rotas de bike, turismo sustentável, aventuras, pedal, Elias Santos',
  author: 'Elias Santos',
  locale: 'pt_BR',
  twitterHandle: '@elias_santos',
  facebookAppId: 'FACEBOOK_APP_ID',
  googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  googleSiteVerification: process.env.REACT_APP_GOOGLE_SITE_VERIFICATION
};

// Função para gerar meta tags de Open Graph
export const generateOpenGraphTags = (data) => {
  const {
    title,
    description,
    image,
    url,
    type = 'website'
  } = data;

  return {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': SEO_CONFIG.siteName,
    'og:locale': SEO_CONFIG.locale
  };
};

// Função para gerar meta tags do Twitter
export const generateTwitterTags = (data) => {
  const {
    title,
    description,
    image
  } = data;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': SEO_CONFIG.twitterHandle,
    'twitter:creator': SEO_CONFIG.twitterHandle
  };
};

