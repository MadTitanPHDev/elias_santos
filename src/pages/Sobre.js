import React from 'react';
import './Sobre.css';

const Sobre = () => {
  return (
    <div className="sobre-page">
      <div className="container">
        <div className="sobre-content">
          <h1>Sobre o Elias Santos</h1>
          
          <div className="sobre-section">
            <h2>Nossa História</h2>
            <p>
              O Elias Santos nasceu da paixão por explorar o mundo sobre duas rodas. 
              Somos uma plataforma dedicada a conectar ciclistas e entusiastas de 
              viagens, oferecendo rotas incríveis e experiências únicas para pedalar.
            </p>
          </div>

          <div className="sobre-section">
            <h2>Nossa Missão</h2>
            <p>
              Promover o ciclismo como forma de turismo sustentável, conectando 
              pessoas através de aventuras sobre duas rodas e descobertas de 
              paisagens deslumbrantes.
            </p>
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
                <div className="feature-icon">📸</div>
                <h3>Galeria de Fotos</h3>
                <p>Imagens incríveis das paisagens e momentos especiais de cada viagem</p>
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
