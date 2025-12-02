import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import '../../style/editarColunas.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EditarColunas = ({ onClose, onColunasAtualizadas }) => {
  const [colunas, setColunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [criandoNova, setCriandoNova] = useState(false);
  const [draggedColuna, setDraggedColuna] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    cor: '#3b82f6',
    tipo_coluna: 'em_andamento'
  });

  const coresDisponiveis = [
    { nome: 'Azul', valor: '#3b82f6' },
    { nome: 'Verde', valor: '#10b981' },
    { nome: 'Amarelo', valor: '#f59e0b' },
    { nome: 'Vermelho', valor: '#ef4444' },
    { nome: 'Roxo', valor: '#8b5cf6' },
    { nome: 'Rosa', valor: '#ec4899' },
    { nome: 'Cinza', valor: '#6b7280' }
  ];

  const tiposColuna = [
    { valor: 'nova', label: 'Nova Demanda', descricao: 'Coluna para novas demandas criadas' },
    { valor: 'em_andamento', label: 'Em Andamento', descricao: 'Sem restrições especiais' },
    { valor: 'revisao', label: 'Revisão', descricao: 'Notifica sócios e bloqueia funcionário' },
    { valor: 'concluido', label: 'Concluído', descricao: 'Apenas sócios podem mover para aqui' }
  ];

  useEffect(() => {
    carregarColunas();
  }, []);

  const carregarColunas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/kanban/colunas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setColunas(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar colunas:', err);
      setError('Erro ao carregar as colunas');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tipo_coluna) {
      setError('Nome e Tipo de Coluna são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (criandoNova) {
        // Criar nova coluna
        await axios.post(
          `${API_BASE_URL}/kanban/colunas`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else if (editandoId) {
        // Editar coluna existente
        await axios.put(
          `${API_BASE_URL}/kanban/colunas/${editandoId}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Limpa o formulário
      setFormData({ nome: '', cor: '#3b82f6', tipo_coluna: 'em_andamento' });
      setCriandoNova(false);
      setEditandoId(null);
      setError(null);
      
      // Recarrega as colunas
      await carregarColunas();
      
      // Notifica o componente pai
      if (onColunasAtualizadas) {
        onColunasAtualizadas();
      }
    } catch (err) {
      console.error('Erro ao salvar coluna:', err);
      setError(err.response?.data?.message || 'Erro ao salvar a coluna');
    }
  };

  const handleEditar = (coluna) => {
    setEditandoId(coluna.id);
    setFormData({
      nome: coluna.nome,
      cor: coluna.cor,
      tipo_coluna: coluna.tipo_coluna || 'em_andamento'
    });
    setCriandoNova(false);
  };

  const handleDeletar = async (colunaId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta coluna?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/kanban/colunas/${colunaId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      await carregarColunas();
      
      if (onColunasAtualizadas) {
        onColunasAtualizadas();
      }
    } catch (err) {
      console.error('Erro ao deletar coluna:', err);
      setError(err.response?.data?.message || 'Erro ao deletar a coluna');
    }
  };

  const handleCancelar = () => {
    setFormData({ nome: '', cor: '#3b82f6', tipo_coluna: 'em_andamento' });
    setCriandoNova(false);
    setEditandoId(null);
    setError(null);
  };

  const handleMoverColuna = async (colunaId, direcao) => {
    const index = colunas.findIndex(c => c.id === colunaId);
    if (index === -1) return;

    const novoIndex = direcao === 'cima' ? index - 1 : index + 1;
    if (novoIndex < 0 || novoIndex >= colunas.length) return;

    const novasColunas = [...colunas];
    [novasColunas[index], novasColunas[novoIndex]] = [novasColunas[novoIndex], novasColunas[index]];

    // Atualiza as ordens
    try {
      const token = localStorage.getItem('token');
      
      // Atualiza as duas colunas que trocaram de posição
      await axios.put(
        `${API_BASE_URL}/kanban/colunas/${novasColunas[index].id}`,
        { ordem: index + 1 },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      await axios.put(
        `${API_BASE_URL}/kanban/colunas/${novasColunas[novoIndex].id}`,
        { ordem: novoIndex + 1 },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      await carregarColunas();
      if (onColunasAtualizadas) {
        onColunasAtualizadas();
      }
    } catch (err) {
      console.error('Erro ao reordenar colunas:', err);
      setError('Erro ao reordenar as colunas');
    }
  };

  const handleNovaColunaClick = () => {
    setCriandoNova(true);
    setEditandoId(null);
    setFormData({ nome: '', cor: '#3b82f6', tipo_coluna: 'em_andamento' });
  };

  if (loading) {
    return (
      <div className="editar-colunas-container">
        <p>Carregando colunas...</p>
      </div>
    );
  }

  return (
    <div className="editar-colunas-container">
      <div className="editar-colunas-header">
        <h2>Gerenciar Colunas do Kanban</h2>
        <button className="btn-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="colunas-lista">
        <h3>Colunas Atuais</h3>
        {colunas.length === 0 ? (
          <p className="empty-message">Nenhuma coluna cadastrada</p>
        ) : (
          <div className="colunas-grid">
            {colunas.map((coluna) => (
              <div key={coluna.id} className="coluna-card">
                <div className="coluna-header">
                  <div className="grip-and-reorder">
                    <button 
                      className="btn-reorder"
                      onClick={() => handleMoverColuna(coluna.id, 'cima')}
                      disabled={colunas.indexOf(coluna) === 0}
                      title="Mover para cima"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button 
                      className="btn-reorder"
                      onClick={() => handleMoverColuna(coluna.id, 'baixo')}
                      disabled={colunas.indexOf(coluna) === colunas.length - 1}
                      title="Mover para baixo"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div 
                    className="coluna-cor-badge" 
                    style={{ backgroundColor: coluna.cor }}
                  />
                  <span className="coluna-nome">{coluna.nome}</span>
                </div>
                
                <div className="coluna-info">
                  <small>Tipo: {tiposColuna.find(t => t.valor === coluna.tipo_coluna)?.label || coluna.tipo_coluna}</small>
                </div>
                
                <div className="coluna-actions">
                  <button 
                    className="btn-icon-small"
                    onClick={() => handleEditar(coluna)}
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="btn-icon-small danger"
                    onClick={() => handleDeletar(coluna.id)}
                    title="Deletar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(criandoNova || editandoId) && (
        <div className="coluna-form-section">
          <h3>{criandoNova ? 'Nova Coluna' : 'Editar Coluna'}</h3>
          <form onSubmit={handleSubmit} className="coluna-form">
            <div className="form-group">
              <label>Nome da Coluna *</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Em Revisão"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Coluna *</label>
              <select
                value={formData.tipo_coluna}
                onChange={(e) => setFormData({ ...formData, tipo_coluna: e.target.value })}
                required
                className="tipo-coluna-select"
              >
                {tiposColuna.map((tipo) => (
                  <option key={tipo.valor} value={tipo.valor}>
                    {tipo.label}
                  </option>
                ))}
              </select>
              <small className="form-hint">
                {tiposColuna.find(t => t.valor === formData.tipo_coluna)?.descricao}
              </small>
            </div>

            <div className="form-group">
              <label>Cor</label>
              <div className="cores-grid">
                {coresDisponiveis.map((cor) => (
                  <button
                    key={cor.valor}
                    type="button"
                    className={`cor-option ${formData.cor === cor.valor ? 'selected' : ''}`}
                    style={{ backgroundColor: cor.valor }}
                    onClick={() => setFormData({ ...formData, cor: cor.valor })}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancelar}>
                <X size={18} />
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                <Save size={18} />
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {!criandoNova && !editandoId && (
        <div className="nova-coluna-section">
          <button className="btn-add-coluna" onClick={handleNovaColunaClick}>
            <Plus size={20} />
            Adicionar Nova Coluna
          </button>
        </div>
      )}
    </div>
  );
};

export default EditarColunas;
