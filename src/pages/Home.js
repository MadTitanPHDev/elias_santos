import React, { useState, useEffect } from 'react';
import ViagemCard from '../components/ViagemCard';
import BannerViagens from '../components/BannerViagens';
import { viagensAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViagemDeleted = (viagemId) => {
    setViagens(prevViagens => prevViagens.filter(viagem => viagem.id !== viagemId));
  };

  useEffect(() => {
    const fetchViagens = async () => {
      try {
        const response = await viagensAPI.getAll();
        setViagens(response.data);
      } catch (err) {
        setError('Erro ao carregar viagens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchViagens();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <div className="container">
        <BannerViagens />
        <h2>Cicloviagens</h2>
        <div className="viagens-grid">
          {viagens.map(viagem => (
            <ViagemCard 
              key={viagem.id} 
              viagem={viagem} 
              onViagemDeleted={handleViagemDeleted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;