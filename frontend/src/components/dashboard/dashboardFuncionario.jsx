import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, Calendar, AlertTriangle, List, Eye, Send, MessageSquare, Menu, User, Edit,LogOut } from 'lucide-react';
import '../../style/dashboardFuncionario.css';
import EditarDemanda from './EditarDemanda';
import SkeletonLoader from '../common/SkeletonLoader';
import { demandasAPI, kanbanAPI, notificacoesAPI } from '../../services/api'; // Importa a API

import { useAuth } from '../../context/authContext'; // Importa o contexto para o usuário logado

// Função para converter hex para rgba
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(200, 200, 200, ${alpha})`;
  
  // Remove o # se existir
  hex = hex.replace('#', '');
  
  // Se a cor tiver 3 caracteres, expande para 6
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  if (hex.length !== 6) return `rgba(200, 200, 200, ${alpha})`;
  
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const DashboardFuncionario = () => {
  const { user } = useAuth(); // Obtém o usuário logado (João/Maria)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dados, setDados] = useState(null);
  const [colunas, setColunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState(null);
  const [isEditingDemanda, setIsEditingDemanda] = useState(false);
  
  const userId = user?.id; 

  // Dados Mockados Restantes (Stats e Notificações)
  const mockData = {
    user: {
      id: userId,
      nome: user?.nome || 'Funcionário',
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=1e3a8a&color=fff'
    },
    stats: {
      total: 0, 
      emAndamento: 0, 
      aguardandoRevisao: 0, 
      urgentes: 0
    },
    notificacoes: [
      {
        id: 1,
        tipo: 'Nova demanda',
        mensagem: 'DEM-002 atribuída a você',
        tempo: 'Há 1 hora',
        lida: false,
        urgente: false
      }
    ]
  };

  // Funções de Mapeamento: Converte dados do DB para o formato do Kanban do Funcionário, aplicando filtro
  const formatDemandasToKanbanFuncionario = (demandasArray, currentUserId, colunasArray) => {
    // Cria objeto kanban dinamicamente baseado nas colunas (por ID)
    const kanban = {};
    colunasArray.forEach(col => {
      kanban[col.id] = [];
    });
    
    // Filtra apenas as demandas atribuídas a este usuário
    demandasArray
      .filter(d => d.responsavel_id === currentUserId) 
      .forEach(d => {
        const dataPrazo = new Date(d.data_prazo);
        const prazoFormatado = `${dataPrazo.getDate().toString().padStart(2, '0')}/${(dataPrazo.getMonth() + 1).toString().padStart(2, '0')}/${dataPrazo.getFullYear()}`;
        
        // Usa coluna_id como chave
        const colunaId = d.coluna_id;
        
        // Se coluna_id for null/undefined, tenta encontrar coluna pelo tipo
        let colunaFinal = colunaId;
        if (!colunaFinal) {
          const coluna = colunasArray.find(c => c.tipo_coluna === d.status);
          if (coluna) {
            colunaFinal = coluna.id;
          }
        }

        const item = {
          id: d.id, 
          titulo: d.titulo,
          descricao: d.descricao,
          prazo: prazoFormatado,
          data_prazo: d.data_prazo, // Mantém a data original do backend para edição
          prioridade: d.prioridade || 'normal', 
          atribuidoPor: 'Sócio', // Simplificado
          responsavel_id: Number(d.responsavel_id) || null
        };

        if (colunaFinal && kanban[colunaFinal]) {
          kanban[colunaFinal].push(item);
        }
      });

    return kanban;
  };
  // Fim das Funções de Mapeamento

  useEffect(() => {
    if (userId) { // Só carrega se o ID do usuário estiver disponível
      loadDados();
    }
  }, [userId]); // Dependência no userId para carregar após o login

  const loadDados = async () => {
    try {
      setLoading(true);
      
      // 1. Carrega as colunas do Kanban
      const colunasResponse = await kanbanAPI.getColunas();
      const colunasArray = colunasResponse.data.sort((a, b) => a.ordem - b.ordem);
      setColunas(colunasArray);
      
      // 2. Carrega as demandas
      const demandaResponse = await demandasAPI.getAll();
      const demandasBackend = demandaResponse.data;

      // 3. Carrega as notificações
      const notificacoesResponse = await notificacoesAPI.getAll();
      const notificacoesData = notificacoesResponse.data.notificacoes || [];

      const kanbanData = formatDemandasToKanbanFuncionario(demandasBackend, userId, colunasArray);

      const totalDemandasFuncionario = demandasBackend.filter(d => d.responsavel_id === userId).length;
      
      // Conta demandas por tipo de coluna dinamicamente
      const stats = { total: totalDemandasFuncionario };
      Object.keys(kanbanData).forEach(tipo => {
        stats[tipo] = kanbanData[tipo].length;
      });

      const combinedData = {
          user: mockData.user, 
          stats: {
            ...mockData.stats,
            ...stats
          }, 
          kanban: kanbanData, // DADOS REAIS - Corrigido de demandas para kanban
          notificacoes: notificacoesData,
          nao_lidas: notificacoesResponse.data.nao_lidas || 0
      };

      setDados(combinedData);
      setLoading(false);
    } catch (error) {
      console.error('Erro:', error);
      setDados({ ...mockData, notificacoes: [], nao_lidas: 0 });
      setLoading(false);
    }
  };

  const LogoutButton = ({ userName, userAvatar, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="logout-container">
      <div
        className="logout-user"
        onClick={() => setShowMenu(!showMenu)}
      >
        <img src={userAvatar} alt="avatar" className="logout-avatar" />
        <span>{userName}</span>
      </div>

      {showMenu && (
        <div className="logout-menu">
          <button onClick={onLogout}>
            <LogOut size={18} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
};


  const handleDemandaAtualizada = (demandaAtualizada) => {
    // CORREÇÃO: Recarrega os dados do servidor para sincronizar
    loadDados(); 
    
    setIsEditingDemanda(false);
    setModalOpen(false);
    alert('✅ Demanda atualizada com sucesso!');
  };

  const menuItems = [
    { icon: List, label: 'Minhas Demandas', active: true },
    { icon: Clock, label: 'Aguardando Revisão' },
    { icon: CheckCircle, label: 'Concluídas' },
    { icon: Calendar, label: 'Calendário' },
    { icon: Bell, label: 'Notificações' },
    { icon: User, label: 'Meu Perfil' }
  ];

  const handleDragStart = (e, demanda, colunaOrigem) => {
    setDraggedCard({ demanda, colunaOrigem });
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    // Remove classes de highlight de todas as colunas
    document.querySelectorAll('.column-content').forEach(col => {
      col.classList.remove('drag-over', 'drag-invalid');
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    
    // Adiciona classe visual para mostrar que pode soltar aqui
    if (e.currentTarget.classList.contains('column-content')) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e) => {
    // Remove classe visual quando sai da área
    if (e.currentTarget.classList.contains('column-content')) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};


  const handleDrop = async (e, colunaDestino) => {
    e.preventDefault();

    if (!draggedCard) return;

    const { demanda, colunaOrigem } = draggedCard;

    // Se soltou na mesma coluna, não faz nada
    if (colunaOrigem.id === colunaDestino.id) {
      setDraggedCard(null);
      return;
    }

    // Regras de negócio (validações no frontend, mas o backend tem a palavra final)
    if (demanda.responsavelId !== userId) {
      alert('❌ Você só pode mover demandas atribuídas a você!');
      setDraggedCard(null);
      return;
    }

    // Bloqueia movimento de colunas de revisão (revisao -> qualquer outra)
    if (colunaOrigem.tipo_coluna === 'revisao' && colunaDestino.tipo_coluna !== 'revisao') {
      alert('⚠️ Demandas em revisão não podem voltar. Aguarde aprovação do sócio.');
      setDraggedCard(null);
      return;
    }

    // Bloqueia movimento para colunas concluídas
    if (colunaDestino.tipo_coluna === 'concluido') {
      alert('⚠️ Apenas o sócio pode marcar demandas como concluídas. Envie para revisão.');
      setDraggedCard(null);
      return;
    }

    setDraggedCard(null);

    try {
        // Chama a API para atualizar o status (PATCH /demandas/<id>/status)
        await demandasAPI.updateStatus(demanda.id, colunaDestino.tipo_coluna, colunaDestino.id);
        
        // Mensagem de sucesso ao enviar para revisão
        if (colunaDestino.tipo_coluna === 'revisao') {
          alert('✅ Demanda enviada para revisão! O sócio será notificado.');
        }
        
        // Recarrega os dados do dashboard
        loadDados();

    } catch (error) {
        console.error('Erro ao persistir movimento:', error);
        
        // Trata erros específicos das regras de coluna
        if (error.response?.data?.tipo === 'restricao_revisao') {
          alert('⚠️ Você não pode mover demandas de colunas de revisão.');
        } else if (error.response?.data?.tipo === 'restricao_concluido') {
          alert('⚠️ Apenas sócios podem mover demandas para colunas concluídas.');
        } else {
          alert('❌ Falha ao atualizar o status da demanda. Verifique sua permissão.');
        }
        
        loadDados(); // Recarrega para voltar o cartão para a posição salva no DB
    }
  };

  const verDetalhes = (demanda) => {
    setDemandaSelecionada(demanda);
    setIsEditingDemanda(false);
    setModalOpen(true);
  };

  const handleEditarDemanda = () => {
    setIsEditingDemanda(true);
  };

  const solicitarRevisao = () => {
    if (demandaSelecionada) {
      // NOTE: Aqui deveria haver uma chamada para o backend. 
      loadDados(); 

      setModalOpen(false);
      alert('✅ Revisão solicitada! O sócio será notificado.');
    }
  };

  const getPrioridadeClass = (prioridade) => {
    return prioridade?.toLowerCase() || 'normal';
  };

  // Mapeamento de ícones por tipo de coluna
  const getIconForTipo = (tipo) => {
    switch(tipo) {
      case 'nova': return <List size={16} />;
      case 'em_andamento': return <Clock size={16} />;
      case 'revisao': return <AlertTriangle size={16} />;
      case 'concluido': return <CheckCircle size={16} />;
      default: return <List size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      novas: 'Novas',
      em_andamento: 'Em Andamento',
      aguardando_revisao: 'Aguardando Revisão',
      concluidas: 'Concluídas'
    };
    return labels[status] || status;
  };


  if (loading || !userId) { 
    return (
      <div className="dashboard-funcionario">
        <aside className="sidebar">
          <div className="logo">
            <SkeletonLoader type="text" width="120px" />
          </div>
          <nav className="nav-menu">
            <SkeletonLoader type="list-item" count={6} />
          </nav>
        </aside>
        <main className="main-content">
          <header className="header">
            <SkeletonLoader type="text" width="200px" />
            <SkeletonLoader type="circle" />
          </header>
          <div className="stats-grid">
            <SkeletonLoader type="card" count={4} height="100px" />
          </div>
          <div className="kanban-section">
            <SkeletonLoader type="text" width="250px" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <div>
                <SkeletonLoader type="kanban-card" count={2} />
              </div>
              <div>
                <SkeletonLoader type="kanban-card" count={3} />
              </div>
              <div>
                <SkeletonLoader type="kanban-card" count={1} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-funcionario">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo">
          {!sidebarCollapsed && <h2>LegisPRO</h2>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="toggle-sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          <ul>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index} className={item.active ? 'active' : ''}>
                  <Icon size={20} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="header">
          <div>
            <h1>Minhas Demandas</h1>
            <p className="subtitle">
              Olá, <strong>{dados?.user.nome}</strong>! Aqui estão suas tarefas.
            </p>
          </div>
          <div className="header-right">
                      <div className="notifications">
                        <Bell size={24} />
                        <span className="badge">{dados?.nao_lidas || 0}</span>
                      </div>
                      <LogoutButton
                        userName={dados?.user.nome}
                        userAvatar={dados?.user.avatar}
                        onLogout={handleLogout}
                      />
                    </div>
                  </header>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <List size={24} />
            </div>
            <div className="stat-content">
              <h3>Atribuídas</h3>
              <p className="stat-value">{dados?.stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Em Andamento</h3>
              <p className="stat-value">{dados?.stats.emAndamento}</p>
            </div>
          </div>

          <div className="stat-card yellow-card">
            <div className="stat-icon yellow">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>Aguardando Revisão</h3>
              <p className="stat-value">{dados?.stats.aguardandoRevisao}</p>
            </div>
          </div>

          <div className="stat-card critical">
            <div className="stat-icon red">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-content">
              <h3>Urgentes</h3>
              <p className="stat-value">{dados?.stats.urgentes}</p>
            </div>
          </div>
        </div>

        {/* Kanban */}
        <div className="kanban-section">
          <h2>Quadro de Demandas</h2>

          <div className="kanban-board">
            {colunas.map((coluna) => {
              const demandas = dados?.kanban?.[coluna.id] || [];

              return (
                <div
                  key={coluna.id}
                  style={{ 
                    backgroundColor: hexToRgba(coluna.cor, 0.3),
                    border: `3px solid ${coluna.cor}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    minHeight: '200px'
                  }}
                >
                  <div style={{ 
                    background: `linear-gradient(135deg, ${hexToRgba(coluna.cor, 0.5)} 0%, ${hexToRgba(coluna.cor, 0.4)} 100%)`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}>
                    <h3>
                      <span style={{ color: coluna.cor }}>
                        {getIconForTipo(coluna.tipo_coluna)}
                      </span>
                      {coluna.nome}
                    </h3>
                    <span className="count" style={{ 
                      backgroundColor: coluna.cor,
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {demandas.length}
                    </span>
                  </div>

                  <div
                    className="column-content"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, coluna)}
                  >
                    {demandas.map((demanda) => (
                      <div
                        key={demanda.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, demanda, coluna)}
                        onDragEnd={handleDragEnd}
                        className="kanban-card"
                      >
                      <div className="card-header">
                        <span className="processo-id">{demanda.id}</span>
                        <span className={`priority-badge ${getPrioridadeClass(demanda.prioridade)}`}>
                          {demanda.prioridade}
                        </span>
                      </div>
                      
                      <h4 className="card-title">{demanda.titulo}</h4>
                      <p className="card-description">{demanda.descricao}</p>
                      
                      <div className="card-footer">
                        <div className="card-meta">
                          <Calendar size={14} />
                          <span>{demanda.prazo}</span>
                        </div>
                        <button
                          onClick={() => verDetalhes(demanda)}
                          className="btn-icon"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Notificações */}
        <div className="notifications-section">
          <h2>Notificações</h2>
          <div className="notifications-list">
            {dados?.notificacoes && dados.notificacoes.length > 0 ? (
              dados.notificacoes.map((notif) => {
                // Formata a data para tempo relativo
                const dataNotif = new Date(notif.data_criacao);
                const agora = new Date();
                const diffMs = agora - dataNotif;
                const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                
                let tempoRelativo;
                if (diffDias > 0) {
                  tempoRelativo = `Há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
                } else if (diffHoras > 0) {
                  tempoRelativo = `Há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
                } else {
                  tempoRelativo = 'Agora mesmo';
                }

                return (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.lida ? 'unread' : ''}`}
                  >
                    <Bell size={20} />
                    <div className="notification-content">
                      <h4>
                        {notif.tipo}
                        {!notif.lida && <span className="badge-urgente">Nova</span>}
                      </h4>
                      <p>{notif.mensagem}</p>
                      <span className="time">{tempoRelativo}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                Nenhuma notificação
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && demandaSelecionada && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditingDemanda ? 'Editar Demanda' : 'Detalhes da Demanda'}</h2>
              <button onClick={() => { setModalOpen(false); setIsEditingDemanda(false); }} className="btn-close">
                ✕
              </button>
            </div>
            
            {isEditingDemanda ? (
              <div className="modal-body">
                <EditarDemanda
                  demanda={demandaSelecionada}
                  onDemandaAtualizada={handleDemandaAtualizada}
                  onCancel={() => setIsEditingDemanda(false)}
                />
              </div>
            ) : (
              <>
                <div className="modal-body">
                  <div className="detail-row">
                    <strong>ID:</strong>
                    <span>{demandaSelecionada.id}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Título:</strong>
                    <span>{demandaSelecionada.titulo}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Descrição:</strong>
                    <span>{demandaSelecionada.descricao || 'Sem descrição'}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Prazo:</strong>
                    <span className="prazo-destaque">
                      <Calendar size={16} />
                      {demandaSelecionada.prazo}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Prioridade:</strong>
                    <span className={`priority-badge ${demandaSelecionada.prioridade}`}>
                      {demandaSelecionada.prioridade}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Atribuído por:</strong>
                    <span>{demandaSelecionada.atribuidoPor}</span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button onClick={() => setModalOpen(false)} className="btn-secondary">
                    Fechar
                  </button>
                  <button onClick={handleEditarDemanda} className="btn-primary">
                    <Edit size={18} />
                    Editar
                  </button>
                  <button onClick={solicitarRevisao} className="btn-primary">
                    <Send size={18} />
                    Solicitar Revisão
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFuncionario;