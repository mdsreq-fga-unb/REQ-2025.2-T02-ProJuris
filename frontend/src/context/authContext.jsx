import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api'; // Importa a conexão real com o Backend

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Removemos a constante MOCK_USERS e a lógica de simulação de delay.

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para recuperar o usuário do Local Storage
    const recoverUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // Em caso de erro, limpa o token (opcional)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.error("Erro ao recuperar usuário do Local Storage", e);
        }
      }
      setLoading(false);
    };

    recoverUser();
  }, []);

  const login = async (email, senha) => {
    try {
      // 🚨 CORREÇÃO CRÍTICA: CHAMADA REAL AO BACKEND
      const response = await authAPI.login(email, senha);
      
      const { token, user } = response.data;

      // Salva o token REAL retornado pelo Flask
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      return user;
    } catch (error) {
      console.error('❌ Erro no login:', error.response?.data || error.message);
      throw error; // Repassa o erro para a tela de login mostrar "Email ou senha inválidos"
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Redireciona para login após limpar a sessão
    window.location.href = '/login'; 
  };

  const register = async (userData) => {
    try {
      // Conecta com o cadastro real do backend
      await authAPI.register(userData);
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no cadastro:', error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};