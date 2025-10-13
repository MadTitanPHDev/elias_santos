import React, { useState, useEffect } from 'react';
import ViagemCard from '../components/ViagemCard';
import BannerViagens from '../components/BannerViagens';
import SEO from '../components/SEO';
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
        console.error('Erro ao carregar viagens:', err);
        setError('Erro ao carregar viagens');
      } finally {
        setLoading(false);
      }
    };

    fetchViagens();
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  // Dados estruturados para a página inicial
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Elias Santos - Cicloviagens",
    "description": "Descubra as melhores cicloviagens e rotas para pedalar. Aventuras sobre duas rodas, galeria de fotos e dicas para ciclistas.",
    "url": "https://khaki-alpaca-178991.hostingersite.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://khaki-alpaca-178991.hostingersite.com/viagem/{search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Person",
      "name": "Elias Santos"
    }
  };

  return (
    <div className="home">
      <SEO 
        title="Cicloviagens - Aventuras sobre Duas Rodas"
        description="Descubra as melhores cicloviagens e rotas para pedalar. Explore aventuras incríveis sobre duas rodas com galeria de fotos, dicas e informações detalhadas para cada viagem."
        keywords="cicloviagens, ciclismo, rotas de bike, turismo sustentável, aventuras, pedal, Elias Santos, viagens de bicicleta, rotas ciclísticas"
        url="/"
        structuredData={structuredData}
      />
      <div className="container">
        <BannerViagens />
        <h1>Cicloviagens</h1>
        <p className="home-description">
          Explore aventuras incríveis sobre duas rodas. Descubra rotas cuidadosamente selecionadas 
          para diferentes níveis de experiência e conecte-se com outros ciclistas apaixonados.
        </p>
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