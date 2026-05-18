import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;

  return user && user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
