import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/login';
import PrivateRoute from './components/auth/privateRoute';
import DashboardSocio from './components/dashboard/dashboardSocio';
import DashboardFuncionario from './components/dashboard/dashboardFuncionario';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard-socio"
            element={
              <PrivateRoute requiredRole="socio">
                <DashboardSocio />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard-funcionario"
            element={
              <PrivateRoute requiredRole="funcionario">
                <DashboardFuncionario />
              </PrivateRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;