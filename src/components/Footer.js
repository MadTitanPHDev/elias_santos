import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo04.svg';
import './Footer.css';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo da empresa - Esquerda */}
          <div className="footer-section footer-logo">
            <Link to="/" className="footer-logo-link">
              <img src={logo} alt="Elias Santos - Logo" className="footer-logo-img" />
              <p>Descubra aventuras incríveis sobre duas rodas</p>
            </Link>
          </div>

          {/* Links de navegação - Centro */}
          <div className="footer-section footer-links">
            <h4>Navegação</h4>
            <div className="footer-nav">
              <Link to="/" className="footer-nav-link">🏠 Home</Link>
              <Link to="/sobre" className="footer-nav-link">ℹ️ Sobre</Link>
              <a href="mailto:contato@eliassantos.com" className="footer-nav-link">📧 Contato</a>
              <a href="tel:+5511999999999" className="footer-nav-link">📱 WhatsApp</a>
            </div>
          </div>

          {/* Seção de Apoiadores - Centro */}
          <div className="footer-section footer-supporters">
            <h4>Apoiadores</h4>
            <div className="supporters-logos">
              <a 
                href="https://example-bikeshop.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="supporter-item supporter-link"
                title="Visite nossa Bike Shop parceira"
              >
                <img 
                  src="https://via.placeholder.com/80x40/006837/ffffff?text=BIKE+SHOP" 
                  alt="Bike Shop Parceira" 
                  className="supporter-logo"
                />
              </a>
              <a 
                href="https://example-tourism.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="supporter-item supporter-link"
                title="Conheça o Turismo Local"
              >
                <img 
                  src="https://via.placeholder.com/80x40/ffb82a/ffffff?text=TOURISM" 
                  alt="Turismo Local" 
                  className="supporter-logo"
                />
              </a>
              <a 
                href="https://example-gear.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="supporter-item supporter-link"
                title="Equipamentos de Ciclismo"
              >
                <img 
                  src="https://via.placeholder.com/80x40/ff6800/ffffff?text=GEAR" 
                  alt="Equipamentos" 
                  className="supporter-logo"
                />
              </a>
              <a 
                href="https://example-sponsor.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="supporter-item supporter-link"
                title="Patrocinador Oficial"
              >
                <img 
                  src="https://via.placeholder.com/80x40/2c3e50/ffffff?text=SPONSOR" 
                  alt="Patrocinador" 
                  className="supporter-logo"
                />
              </a>
            </div>
            <p className="supporters-text">Parceiros que apoiam nossas aventuras</p>
          </div>

          {/* Seção de contatos - Centro */}
          <div className="footer-section footer-contacts">
            <h4>Contato</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <a href="mailto:contato@eliassantos.com" className="contact-link">
                  contato@eliassantos.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="contact-link">
                  +55 (18) 98178-8835
                </a>
              </div>
              
            </div>
          </div>

          {/* Redes sociais - Direita */}
          <div className="footer-section footer-social">
            <h4>Siga-nos</h4>
            <div className="social-links">
              <a 
                href="https://facebook.com/eliassantoscicloviagens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook"
                aria-label="Facebook"
                title="Siga-nos no Facebook"
              >
                📘
              </a>
              <a 
                href="https://www.instagram.com/elias.viagensecicloturismo/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
                title="Siga-nos no Instagram"
              >
                📷
              </a>
              <a 
                href="https://twitter.com/eliassantosbike" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
                aria-label="Twitter"
                title="Siga-nos no Twitter"
              >
                🐦
              </a>
              <a 
                href="https://youtube.com/@eliassantoscicloviagens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link youtube"
                aria-label="YouTube"
                title="Inscreva-se no YouTube"
              >
                📺
              </a>
            </div>
          </div>
        </div>

        {/* Linha de copyright */}
        <div className="footer-bottom">
          <p>&copy; Copyright© 2025 | Feito por Paulo Margutti Dev - Elias Santos - Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Botão Voltar ao Topo */}
      {showBackToTop && (
        <button 
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          ⬆️
        </button>
      )}
    </footer>
  );
};

export default Footer;
