import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SecretAccess = () => {
  const [combo, setCombo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Previne o comportamento padrão apenas para a combinação
      if (e.ctrlKey && e.altKey && e.shiftKey) {
        e.preventDefault();
      }

      // Detecta Ctrl+Alt+Shift+A
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'A') {
        navigate('/admin-acesso');
        setCombo([]);
        
        // Opcional: Feedback visual
        console.log('🔐 Acesso admin ativado!');
      }

      // Sistema alternativo de combinação (ex: "admin")
      const newCombo = [...combo, e.key].slice(-5);
      setCombo(newCombo);

      if (newCombo.join('') === 'admin') {
        navigate('/admin-acesso');
        setCombo([]);
        console.log('🔐 Acesso via combinação ativado!');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [combo, navigate]);

  return null; // Componente invisível
};

export default SecretAccess;