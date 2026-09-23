import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAuth = ({ children }) => {
  const { activeUser } = useAuth();
  const location = useLocation();

  if (!activeUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedAuth;