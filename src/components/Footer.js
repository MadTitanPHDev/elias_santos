import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo04.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo da empresa - Esquerda */}
          <div className="footer-section footer-logo">
            <Link to="/" className="footer-logo-link">
              <img src={logo} alt="Elias Santos - Logo" className="footer-logo-img" />
             
            </Link>
          </div>

          {/* Seção de contatos - Centro */}
          <div className="footer-section footer-contacts">
            <h4>Contato</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>contato@viagensdebicicleta.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <span>+55 (11) 99999-9999</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Redes sociais - Direita */}
          <div className="footer-section footer-social">
            <h4>Siga-nos</h4>
            <div className="social-links">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link facebook"
                aria-label="Facebook"
              >
                📘
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram"
              >
                📷
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link youtube"
                aria-label="YouTube"
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
    </footer>
  );
};

export default Footer;
