import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

function CadastrarDemanda({ onDemandaCriada, onCancel }) {
  const { user } = useAuth(); // Obtém o usuário logado
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_prazo: '',
    responsavel_id: '',
    prioridade: 'normal',
    coluna_inicial: '', // Nova coluna para escolher onde a demanda começa
  });
  const [usuarios, setUsuarios] = useState([]);
  const [colunasNovas, setColunasNovas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoSaveMessage, setAutoSaveMessage] = useState(''); // RNF04

  // RNF04: Auto-save a cada 2 minutos
  useEffect(() => {
    const autoSaveKey = 'cadastrar_demanda_draft';
    
    // Recupera rascunho anterior
    const savedData = localStorage.getItem(autoSaveKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          titulo: parsed.titulo || '',
          descricao: parsed.descricao || '',
          data_prazo: parsed.data_prazo || '',
          prioridade: parsed.prioridade || 'normal'
        }));
        setAutoSaveMessage('📝 Rascunho recuperado do auto-save');
        setTimeout(() => setAutoSaveMessage(''), 5000);
      } catch (e) {
        console.error('Erro ao recuperar auto-save:', e);
      }
    }

    // Auto-save a cada 2 minutos
    const autoSaveInterval = setInterval(() => {
      if (formData.titulo || formData.descricao) { // Só salva se houver conteúdo
        localStorage.setItem(autoSaveKey, JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          data_prazo: formData.data_prazo,
          prioridade: formData.prioridade
        }));
        setAutoSaveMessage('💾 Rascunho salvo automaticamente');
        setTimeout(() => setAutoSaveMessage(''), 3000);
      }
    }, 120000); // 2 minutos

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  const limparAutoSave = () => {
    localStorage.removeItem('cadastrar_demanda_draft');
  };

  useEffect(() => {
    // Busca a lista de usuários para popular o campo 'Responsável' (RF03)
    api.get('/usuarios')
      .then(response => {
        // Filtra o usuário logado da lista (sócio não pode se auto-atribuir)
        const usuariosFiltrados = response.data.filter(u => u.id !== user?.id);
        setUsuarios(usuariosFiltrados);
        // Não pré-seleciona nenhum usuário, deixa vazio para forçar escolha
      })
      .catch(err => {
        console.error("Erro ao carregar usuários:", err);
        setError("Não foi possível carregar a lista de responsáveis.");
      });
    
    // Busca colunas do tipo "nova" para escolha inicial
    api.get('/kanban/colunas')
      .then(response => {
        const colunasNovasDemanda = response.data.filter(col => col.tipo_coluna === 'nova');
        setColunasNovas(colunasNovasDemanda);
        if (colunasNovasDemanda.length > 0) {
          setFormData(prev => ({ ...prev, coluna_inicial: colunasNovasDemanda[0].id }));
        }
      })
      .catch(err => {
        console.error("Erro ao carregar colunas:", err);
      });
  }, [user?.id]); // Adiciona user.id como dependência

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpa erro quando usuário começar a digitar
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Converte o data_prazo de volta para o formato ISO 8601 (o backend espera)
    const data_prazo_iso = new Date(formData.data_prazo).toISOString();
    
    // Define o ID da coluna inicial
    const colunaId = formData.coluna_inicial;

    try {
      const response = await api.post('/demandas', {
        titulo: formData.titulo,
        descricao: formData.descricao,
        data_prazo: data_prazo_iso,
        responsavel_id: parseInt(formData.responsavel_id),
        prioridade: formData.prioridade,
        coluna_id: colunaId ? parseInt(colunaId, 10) : null,
      });

      // Limpa o formulário
      setFormData({ 
        titulo: '',
        descricao: '',
        data_prazo: '',
        responsavel_id: usuarios[0]?.id || '', 
        prioridade: 'normal',
      });
      
      limparAutoSave(); // RNF04: Remove rascunho após salvar
      
      // Notifica o Dashboard pai
      if (onDemandaCriada) {
        onDemandaCriada(response.data.demanda);
      }
      
      alert('✅ Demanda cadastrada com sucesso!');
      if (onCancel) {
        setTimeout(() => onCancel(), 500);
      }

    } catch (err) {
      console.error("Erro ao cadastrar demanda:", err.response?.data || err);
      setError(err.response?.data?.message || 'Falha ao cadastrar demanda. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-cadastro-demanda">
      <h2>Cadastrar Nova Demanda</h2>
      
      {autoSaveMessage && (
        <div style={{
          padding: '8px 12px',
          marginBottom: '16px',
          backgroundColor: '#e3f2fd',
          color: '#1565c0',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {autoSaveMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <div>
          <label htmlFor="titulo">Título da Demanda *</label>
          <input
            id="titulo"
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Elaborar petição inicial"
            required
            maxLength="100"
          />
        </div>

        <div>
          <label htmlFor="descricao">Descrição Detalhada</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva os detalhes da demanda..."
            rows="4"
          />
        </div>

        <div>
          <label htmlFor="data_prazo">Prazo Final *</label>
          <input
            id="data_prazo"
            type="datetime-local"
            name="data_prazo"
            value={formData.data_prazo}
            onChange={handleChange}
            required
            max="9999-12-31T23:59" // CORREÇÃO: Limita o ano a 4 dígitos para validação HTML
          />
        </div>

        {/* NOVO BLOCO: Prioridade */}
        <div>
          <label htmlFor="prioridade">Prioridade</label>
          <select
            id="prioridade"
            name="prioridade"
            value={formData.prioridade}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* NOVO BLOCO: Coluna Inicial */}
        {colunasNovas.length > 0 && (
          <div>
            <label htmlFor="coluna_inicial">Coluna Inicial</label>
            <select
              id="coluna_inicial"
              name="coluna_inicial"
              value={formData.coluna_inicial}
              onChange={handleChange}
              required
              disabled={loading}
            >
              {colunasNovas.map(coluna => (
                <option key={coluna.id} value={coluna.id}>
                  {coluna.nome}
                </option>
              ))}
            </select>
            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Escolha em qual coluna de novas demandas esta tarefa deve começar
            </small>
          </div>
        )}
        
        <div>
          <label htmlFor="responsavel_id">Responsável *</label>
          <select
            id="responsavel_id"
            name="responsavel_id"
            value={formData.responsavel_id}
            onChange={handleChange}
            required
            disabled={loading || usuarios.length === 0}
          >
            <option value="">
              {usuarios.length === 0 ? 'Nenhum funcionário disponível' : 'Selecione o Responsável'}
            </option>
            {usuarios.map(user => (
              <option key={user.id} value={user.id}>
                {user.nome ? `${user.nome} (${user.email})` : user.email}
              </option>
            ))}
          </select>
          {usuarios.length === 0 && (
            <small style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              Não há funcionários disponíveis. Cadastre funcionários primeiro.
            </small>
          )}
        </div>
        
        <div className="form-buttons">
          {onCancel && (
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
              style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              Cancelar
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              opacity: loading ? 0.7 : 1, 
              cursor: loading ? 'not-allowed' : 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid #fff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block'
              }} />
            )}
            {loading ? 'Cadastrando...' : 'Cadastrar Demanda'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarDemanda;