import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react'; 
import api, { demandasAPI } from '../../services/api'; 

function EditarDemanda({ demanda, onDemandaAtualizada, onCancel }) {
  
  // Função auxiliar para converter a data do backend para o formato datetime-local
  const formatBackendDate = (dateString) => {
    if (!dateString) return '';
    try {
      // Cria um objeto Date a partir da string do backend
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        console.error("Data inválida:", dateString);
        return '';
      }
      
      // Formata para YYYY-MM-DDTHH:mm (formato datetime-local)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
      console.log('Data formatada para input:', formatted, 'Original:', dateString);
      return formatted;
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return '';
    }
  };


  const [formData, setFormData] = useState({
    titulo: demanda.titulo || '',
    descricao: demanda.descricao || '',
    // Tenta formatar a data que vem do backend (ISO) para o formato HTML datetime-local (YYYY-MM-DDThh:mm)
    data_prazo: formatBackendDate(demanda.data_prazo),
    status: demanda.status || 'Elaboração',
    prioridade: demanda.prioridade || 'normal', 
    responsavel_id: demanda.responsavel_id || '', 
  });

  
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoSaveMessage, setAutoSaveMessage] = useState(''); // RNF04: Mensagem de auto-save

  // Atualiza formData quando a demanda prop mudar
  useEffect(() => {
    console.log('Demanda recebida:', demanda);
    console.log('data_prazo original:', demanda.data_prazo);
    console.log('responsavel_id original:', demanda.responsavel_id, 'tipo:', typeof demanda.responsavel_id);
    const dataFormatada = formatBackendDate(demanda.data_prazo);
    console.log('data_prazo formatada:', dataFormatada);
    
    // Garante que responsavel_id seja number para comparação correta com options
    const responsavelId = demanda.responsavel_id ? Number(demanda.responsavel_id) : '';
    console.log('responsavel_id convertido:', responsavelId, 'tipo:', typeof responsavelId);
    
    setFormData({
      titulo: demanda.titulo || '',
      descricao: demanda.descricao || '',
      data_prazo: dataFormatada,
      status: demanda.status || 'Elaboração',
      prioridade: demanda.prioridade || 'normal', 
      responsavel_id: responsavelId, 
    });
  }, [demanda]);

  // RNF04: Auto-save a cada 2 minutos
  useEffect(() => {
    const autoSaveKey = `editar_demanda_${demanda.id}`;
    
    // Tenta recuperar dados salvos anteriormente
    const savedData = localStorage.getItem(autoSaveKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          titulo: parsed.titulo || prev.titulo,
          descricao: parsed.descricao || prev.descricao,
          prioridade: parsed.prioridade || prev.prioridade,
          responsavel_id: parsed.responsavel_id || prev.responsavel_id,
          // Mantém a data original se não houver data salva ou se estiver vazia
          data_prazo: parsed.data_prazo || prev.data_prazo
        }));
        setAutoSaveMessage('📝 Rascunho recuperado do auto-save');
        setTimeout(() => setAutoSaveMessage(''), 5000);
      } catch (e) {
        console.error('Erro ao recuperar auto-save:', e);
      }
    }

    // Configura auto-save a cada 2 minutos (120.000ms)
    const autoSaveInterval = setInterval(() => {
      localStorage.setItem(autoSaveKey, JSON.stringify(formData));
      setAutoSaveMessage('💾 Rascunho salvo automaticamente');
      setTimeout(() => setAutoSaveMessage(''), 3000);
    }, 120000); // 2 minutos

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [formData, demanda.id]);

  // Limpa auto-save após envio bem-sucedido
  const limparAutoSave = () => {
    localStorage.removeItem(`editar_demanda_${demanda.id}`);
  };

  // Efeito para carregar a lista de usuários (para o campo Responsável)
  useEffect(() => {
    // Busca a lista de usuários (RF03)
    api.get('/usuarios')
      .then(response => {
        setUsuarios(response.data);
        // Tenta pre-selecionar o responsável atual
        const responsavelAtual = response.data.find(u => u.id === demanda.responsavel_id);
        if (responsavelAtual) {
            setFormData(prev => ({ ...prev, responsavel_id: responsavelAtual.id }));
        } else {
             // Mantém o ID original se o usuário não for encontrado na lista
             setFormData(prev => ({ ...prev, responsavel_id: demanda.responsavel_id }));
        }
      })
      .catch(err => {
        console.error("Erro ao carregar usuários para edição:", err);
        setError("Não foi possível carregar a lista de responsáveis para edição.");
      });
  }, [demanda.responsavel_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.titulo.trim() || !formData.data_prazo || !formData.responsavel_id) {
      setError('Título, Prazo e Responsável são obrigatórios.');
      setLoading(false);
      return;
    }
    
    // Converte a data do formato datetime-local para o formato ISO 8601 que o backend espera
    const data_prazo_iso = formData.data_prazo ? new Date(formData.data_prazo).toISOString() : null;

    try {
      // Prepara os dados para enviar ao backend
      const dadosAtualizados = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        data_prazo: data_prazo_iso,
        status: formData.status, 
        prioridade: formData.prioridade,
        responsavel_id: parseInt(formData.responsavel_id), // RF05: Transferir responsabilidade
      };
      
      // Chama a API PUT para atualizar a demanda (RF02 e RF05)
      const response = await demandasAPI.update(demanda.id, dadosAtualizados);

      if (response.data) {
        limparAutoSave(); // RNF04: Remove rascunho após salvar
        // Notifica o dashboard pai para recarregar ou atualizar a lista
        onDemandaAtualizada(response.data.demanda);
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar demanda:', err.response?.data || err);
      // Exibe a mensagem de erro do backend (incluindo erros de permissão RF04)
      setError(err.response?.data?.message || 'Falha ao atualizar demanda. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="card-cadastro-demanda">
      <h2>Editar Demanda: {demanda.titulo}</h2>
      
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
        
        {/* TITULO E DESCRIÇÃO */}
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Elaborar petição inicial"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva os detalhes da demanda..."
            rows="4"
          />
        </div>

        {/* PRAZO E PRIORIDADE */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data_prazo">Prazo *</label>
            <input
              type="datetime-local" 
              id="data_prazo"
              name="data_prazo"
              value={formData.data_prazo}
              onChange={handleChange}
              required
              max="9999-12-31T23:59" // CORREÇÃO: Limita o ano a 4 dígitos para validação HTML
            />
          </div>

          <div className="form-group">
            <label htmlFor="prioridade">Prioridade</label>
            <select
              id="prioridade"
              name="prioridade"
              value={formData.prioridade}
              onChange={handleChange}
            >
              <option value="baixa">Baixa</option>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
        
        {/* STATUS */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="Elaboração">Elaboração</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Aguardando Revisão">Aguardando Revisão</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        {/* RESPONSÁVEL (RF05) */}
        <div className="form-group">
          <label htmlFor="responsavel_id">Responsável *</label>
          <select
            id="responsavel_id"
            name="responsavel_id"
            value={formData.responsavel_id || ''}
            onChange={handleChange}
            required
            disabled={loading || usuarios.length === 0}
          >
            <option value="">Selecione o Responsável</option>
            {usuarios.map(user => (
              <option key={user.id} value={user.id}>
                {user.nome ? `${user.nome} (${user.email})` : user.email}
              </option>
            ))}
          </select>
          {formData.responsavel_id && (
            <small style={{ color: '#10b981', fontSize: '0.875rem' }}>
              Responsável atual: ID {formData.responsavel_id}
            </small>
          )}
        </div>

        {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            <X size={18} />
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ 
              opacity: loading ? 0.7 : 1, 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                  display: 'inline-block'
                }} />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarDemanda;