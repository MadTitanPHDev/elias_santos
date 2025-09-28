import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import NovaViagem from './pages/NovaViagem';
import EditarViagem from './pages/EditarViagem';
import Login from './pages/Login';
import ViagemDetalhes from './pages/ViagemDetalhes';
import ProtectedRoute from './components/ProtectedRoute';
import SecretAccess from './components/SecretAccess'; // Novo componente
import { authService } from './services/auth';
import './App.css';

function App() {
  useEffect(() => {
    authService.setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <div className="App">
        <SecretAccess /> {/* Adicione esta linha */}
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/viagem/:id" element={<ViagemDetalhes />} />
            <Route path="/admin-acesso" element={<Login />} /> {/* Rota secreta */}
            <Route 
              path="/nova-viagem" 
              element={
                <ProtectedRoute requireGestor={true}>
                  <NovaViagem />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/editar-viagem/:id" 
              element={
                <ProtectedRoute requireGestor={true}>
                  <EditarViagem />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
            
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;