import React from 'react';
import SEO from '../components/SEO';
import './Sobre.css';

const Sobre = () => {
  // Dados estruturados para a página Sobre
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Sobre o Elias Santos",
    "description": "Conheça a história e missão do Elias Santos, plataforma dedicada a conectar ciclistas e entusiastas de viagens através de rotas incríveis e experiências únicas para pedalar.",
    "url": "https://elias-santos.com/sobre",
    "mainEntity": {
      "@type": "Person",
      "name": "Elias Santos",
      "description": "Ciclista e entusiasta de viagens sustentáveis",
      "knowsAbout": ["Ciclismo", "Turismo Sustentável", "Rotas de Bicicleta", "Aventuras"]
    }
  };

  return (
    <div className="sobre-page">
      <SEO 
        title="Sobre o Elias Santos - Nossa História e Missão"
        description="Conheça a história e missão do Elias Santos, plataforma dedicada a conectar ciclistas e entusiastas de viagens através de rotas incríveis e experiências únicas para pedalar."
        keywords="sobre Elias Santos, ciclismo, turismo sustentável, história, missão, cicloviagens, comunidade ciclística"
        url="/sobre"
        structuredData={structuredData}
      />
      <div className="container">
        <div className="sobre-content">
          <h1>Sobre o Elias Santos</h1>
          
          <div className="sobre-section">
            <h2>Nossa História</h2>
            <div className="historia-content">
              <div className="historia-text">
                <p>
                  O Elias Santos nasceu da paixão por explorar o mundo sobre duas rodas. 
                  Somos uma plataforma dedicada a conectar ciclistas e entusiastas de 
                  viagens, oferecendo rotas incríveis e experiências únicas para pedalar.
                </p>
                <p>
                  Fundado por Elias Santos, um apaixonado ciclista e aventureiro, nossa 
                  plataforma cresceu a partir de uma simples paixão por descobrir novos 
                  caminhos e compartilhar essas experiências com outros entusiastas.
                </p>
              </div>
              <div className="historia-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Elias Santos - Fundador" 
                  className="founder-image"
                />
                <div className="founder-caption">
                  <h4>Elias Santos</h4>
                  <p>Fundador e Ciclista Apaixonado</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sobre-section">
            <h2>Nossa Missão</h2>
            <p>
              Promover o ciclismo como forma de turismo sustentável, conectando 
              pessoas através de aventuras sobre duas rodas e descobertas de 
              paisagens deslumbrantes.
            </p>
            <p>
              Acreditamos que cada pedalada é uma oportunidade de descobrir algo novo, 
              conectar-se com a natureza e criar memórias inesquecíveis. Nossa missão 
              é tornar essas experiências acessíveis a todos os amantes do ciclismo.
            </p>
            
            {/* Imagem da Família */}
            <div className="family-section">
              <img 
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Família Elias Santos - Aventuras em Família" 
                className="family-image"
              />
              <div className="family-overlay">
                <h3>🚴‍♂️ Aventuras em Família</h3>
                <p>Compartilhando a paixão pelo ciclismo com as pessoas que mais amamos</p>
              </div>
            </div>
          </div>

          <div className="sobre-section">
            <h2>O que Oferecemos</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Rotas Curated</h3>
                <p>Rotas cuidadosamente selecionadas para diferentes níveis de experiência</p>
              </div>
              
              
              
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Comunidade</h3>
                <p>Conecte-se com outros ciclistas e compartilhe suas experiências</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🌱</div>
                <h3>Turismo Sustentável</h3>
                <p>Promovemos viagens responsáveis e respeito ao meio ambiente</p>
              </div>
            </div>
          </div>

          <div className="sobre-section">
            <h2>Entre em Contato</h2>
            <p>
              Quer saber mais sobre nossas rotas ou tem alguma sugestão? 
              Entre em contato conosco através das nossas redes sociais!
            </p>
            <div className="contact-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                <span className="contact-icon">📷</span>
                Instagram
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                <span className="contact-icon">📘</span>
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
