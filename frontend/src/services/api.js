import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const dashboardAPI = {
  getDashboard: () => api.get('/dashboard'),
  getStats: () => api.get('/stats'),
  getMinhasDemandas: () => api.get('/demandas/minhas'),
};

export const demandasAPI = {
  getAll: () => api.get('/demandas'),
  getById: (id) => api.get(`/demandas/${id}`),
  create: (data) => api.post('/demandas', data),
  // NOVO: Função para atualizar a demanda
  update: (id, data) => api.put(`/demandas/${id}`, data), 
  updateStatus: (id, tipo_coluna, coluna_id) => api.patch(`/demandas/${id}/status`, { tipo_coluna, coluna_id }),
  solicitarRevisao: (id) => api.post(`/demandas/${id}/solicitar-revisao`),
};

export const authAPI = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const kanbanAPI = {
  getColunas: () => api.get('/kanban/colunas'),
  createColuna: (data) => api.post('/kanban/colunas', data),
  updateColuna: (id, data) => api.put(`/kanban/colunas/${id}`, data),
  deleteColuna: (id) => api.delete(`/kanban/colunas/${id}`),
};

export const usuariosAPI = {
  getAll: () => api.get('/usuarios'),
};

export const notificacoesAPI = {
  getAll: () => api.get('/notificacoes'),
  marcarLida: (id) => api.patch(`/notificacoes/${id}/marcar-lida`),
  marcarTodasLidas: () => api.patch('/notificacoes/marcar-todas-lidas'),
};

export default api;