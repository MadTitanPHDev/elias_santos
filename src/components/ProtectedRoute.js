import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

const ProtectedRoute = ({ children, requireGestor = false }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requireGestor && !authService.isGestor()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;