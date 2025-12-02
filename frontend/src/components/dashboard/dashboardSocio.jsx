import React, { useState, useEffect } from 'react';
import {
  Bell, Home, Folder, Users, TrendingUp, FileText, Plus, Settings,
  ChevronRight, Calendar, AlertTriangle, Clock, FolderOpen,
  Menu, List, CheckCircle, Eye, Edit, LogOut, Columns, Upload
} from 'lucide-react';
import '../../style/dashboardSocio.css';
import CadastrarDemanda from './CadastrarDemanda';
import EditarDemanda from './EditarDemanda';
import EditarColunas from './EditarColunas';
import DashboardKPIs from './DashboardKPIs';
import GerarRelatorioPDF from './GerarRelatorioPDF';
import ImportarDemandas from './ImportarDemandas';
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

// Funções de Mapeamento: Converte dados do DB para o formato do Kanban
const formatDemandasToKanban = (demandasArray, colunasArray) => {
  // Cria objeto kanban dinamicamente baseado nas colunas (por ID)
  const kanban = {};
  colunasArray.forEach(col => {
    kanban[col.id] = [];
  });

  demandasArray.forEach(d => {
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
      responsavel: d.responsavel_email || 'Não Atribuído', 
      prioridade: d.prioridade || 'normal', 
      status: d.status,
      responsavel_id: Number(d.responsavel_id) || null,
    };

    // Adiciona na coluna correspondente pelo ID
    if (colunaFinal && kanban[colunaFinal]) {
      kanban[colunaFinal].push(item);
    }
  });

  return kanban;
};
// Fim das Funções de Mapeamento

const DashboardSocio = () => {
  const { user } = useAuth(); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dados, setDados] = useState(null);
  const [colunas, setColunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState(null);
  const [isCreatingDemanda, setIsCreatingDemanda] = useState(false);
  const [isEditingDemanda, setIsEditingDemanda] = useState(false);
  const [isEditingColunas, setIsEditingColunas] = useState(false);
  const [showKPIs, setShowKPIs] = useState(false);
  const [showRelatorioPDF, setShowRelatorioPDF] = useState(false);
  const [showImportarDemandas, setShowImportarDemandas] = useState(false);

  // Dados mockados restantes (Stats e Notificações)
  const mockData = {
    user: {
      nome: user?.nome || 'Dr. Fausto Correia',
      avatar: 'https://ui-avatars.com/api/?name=Fausto+Correia&background=1e3a8a&color=fff'
    },
    stats: {
      processosAtivos: { value: 124, change: '+12% vs mês anterior' },
      prazosPrazo: { value: 89, change: '+5% vs mês anterior' },
      prazosCriticos: { value: 7 },
      tempoMedio: { value: '12 dias', change: '-2 dias vs mês anterior' }
    },
    notificacoes: [
      {
        id: 1,
        tipo: 'Prazo Próximo',
        mensagem: 'Processo DEM-001 vence em 3 dias',
        tempo: 'Há 2 horas',
        urgente: true
      },
      {
        id: 2,
        tipo: 'Solicitação de Revisão',
        mensagem: 'João Silva enviou DEM-007 para revisão',
        tempo: 'Há 5 horas',
        urgente: false
      }
    ]
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
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

      const kanbanData = formatDemandasToKanban(demandasBackend, colunasArray);

      const combinedData = {
          user: mockData.user, 
          stats: mockData.stats, 
          kanban: kanbanData, 
          notificacoes: notificacoesData,
          nao_lidas: notificacoesResponse.data.nao_lidas || 0
      };

      setDados(combinedData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      const fallbackData = { ...mockData, kanban: {}, notificacoes: [], nao_lidas: 0 };
      setDados(fallbackData); 
      setLoading(false);
    }
  };

  const handleDemandaCriada = (novaDemandaBackend) => {
    loadDashboardData(); 
    setIsCreatingDemanda(false);
    alert('✅ Demanda cadastrada com sucesso!');
  };

  const handleDemandaAtualizada = (demandaAtualizada) => {
    loadDashboardData(); 
    setIsEditingDemanda(false);
    setModalOpen(false);
    alert('✅ Demanda atualizada com sucesso!');
  };


  const getPrioridadeClass = (prioridade) => {
    return prioridade?.toLowerCase() || 'normal';
  };

  const verDetalhes = (demanda) => {
    setDemandaSelecionada(demanda);
    setIsEditingDemanda(false);
    setModalOpen(true);
  };

  const handleEditarDemanda = () => {
    setIsEditingDemanda(true);
  };

  const handleDragStart = (e, demanda, status) => {
    setDraggedCard({ demanda, status });
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleLogout = () => {
  // Limpa o token/sessão
  localStorage.removeItem('token');
  
  // Chama logout do contexto se tiver
  // logout(); 
  
  // Redireciona para login
  window.location.href = '/login';
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

  const [showMenu, setShowMenu] = useState(false);
// CORREÇÃO CRÍTICA: LIGA O DRAG & DROP AO BACKEND (RF11)
const handleDrop = async (e, colunaDestino) => {
  e.preventDefault();

  if (!draggedCard) return;

  const { demanda } = draggedCard;
  
  setDraggedCard(null);

  try {
    // Chama a API para atualizar o status (PATCH /demandas/<id>/status)
    await demandasAPI.updateStatus(demanda.id, colunaDestino.tipo_coluna, colunaDestino.id);
    
    // Recarrega os dados do dashboard
    loadDashboardData();
    //alert(`✅ Status atualizado para: ${novoStatusBackend}`);

  } catch (error) {
    console.error('Erro ao persistir movimento:', error);
    alert('❌ Falha ao atualizar o status da demanda. Verifique sua permissão.');
    loadDashboardData(); // Recarrega para voltar o cartão para a posição salva no DB
  }
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

// ... (O restante do código de renderização do componente não muda)
//...
  const navItems = [
    { icon: Home, label: 'Processos', active: true },
    { icon: Folder, label: 'Tarefas' },
    { icon: Users, label: 'Atribuições' },
    { 
      icon: TrendingUp, 
      label: 'Dashboard KPIs', 
      onClick: () => {
        setShowKPIs(true);
        setIsEditingColunas(false);
        setIsCreatingDemanda(false);
        setIsEditingDemanda(false);
        setShowRelatorioPDF(false);
        setShowImportarDemandas(false);
      }
    },
    { 
      icon: FileText, 
      label: 'Gerar PDF', 
      onClick: () => {
        setShowRelatorioPDF(true);
        setShowKPIs(false);
        setIsEditingColunas(false);
        setIsCreatingDemanda(false);
        setIsEditingDemanda(false);
        setShowImportarDemandas(false);
      }
    },
    {
      icon: Upload,
      label: 'Importar Excel/CSV',
      onClick: () => {
        setShowImportarDemandas(true);
        setShowRelatorioPDF(false);
        setShowKPIs(false);
        setIsEditingColunas(false);
        setIsCreatingDemanda(false);
        setIsEditingDemanda(false);
      }
    },
    { icon: Plus, label: 'Adicionar' },
    { icon: Settings, label: 'Configurações' }
  ];

  const statsData = dados ? [
    {
      icon: FolderOpen,
      color: 'blue',
      title: 'Processos Ativos',
      value: dados.stats.processosAtivos.value,
      change: dados.stats.processosAtivos.change,
      positive: true
    },
    {
      icon: Clock,
      color: 'green',
      title: 'Prazos no Prazo',
      value: dados.stats.prazosPrazo.value,
      change: dados.stats.prazosPrazo.change,
      positive: true
    },
    {
      icon: AlertTriangle,
      color: 'red',
      title: 'Prazos Críticos',
      value: dados.stats.prazosCriticos.value,
      critical: true
    },
    {
      icon: TrendingUp,
      color: 'yellow',
      title: 'Tempo Médio',
      value: dados.stats.tempoMedio.value,
      change: dados.stats.tempoMedio.change,
      positive: false
    }
  ] : [];

// ... (Resto do código de renderização)

  if (loading) {
    return (
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="logo">
            <SkeletonLoader type="text" width="120px" />
          </div>
          <nav className="nav-menu">
            <SkeletonLoader type="list-item" count={7} />
          </nav>
        </aside>
        <main className="main-content">
          <header className="header">
            <SkeletonLoader type="text" width="200px" />
            <SkeletonLoader type="circle" />
          </header>
          <div className="stats-grid">
            <SkeletonLoader type="card" count={4} height="120px" />
          </div>
          <div className="kanban-section">
            <SkeletonLoader type="text" width="300px" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div>
                <SkeletonLoader type="kanban-card" count={3} />
              </div>
              <div>
                <SkeletonLoader type="kanban-card" count={2} />
              </div>
              <div>
                <SkeletonLoader type="kanban-card" count={2} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li 
                  key={index} 
                  className={item.active ? 'active' : ''}
                  onClick={item.onClick}
                  style={item.onClick ? { cursor: 'pointer' } : {}}
                >
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
          <h1>Dashboard</h1>
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
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`stat-card ${stat.critical ? 'critical' : ''}`}>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  {stat.change && (
                    <p className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                      {stat.change}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard KPIs (RNF06) */}
        {showKPIs ? (
          <div>
            <div className="section-header" style={{ marginBottom: '20px' }}>
              <h2>Dashboard de KPIs</h2>
              <button 
                className="btn-link"
                onClick={() => setShowKPIs(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Home size={16} />
                Voltar ao Kanban
              </button>
            </div>
            <DashboardKPIs />
          </div>
        ) : (
          <>
            {/* Kanban Board */}
            <div className="kanban-section">
          <div className="section-header">
            <h2>Visão Geral - Kanban</h2>
            <div className="section-header-actions">
              <button 
                className="btn-editar-colunas"
                onClick={() => setIsEditingColunas(true)}
                title="Editar Colunas"
              >
                <Columns size={18} />
                Editar Colunas
              </button>
              <button className="btn-link">
                Ver Quadro Completo <ChevronRight size={16} />
              </button>
            </div>
          </div>

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
                    minHeight: '300px'
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
                    onDrop={(e) => handleDrop(e, coluna)}
                  >
                    {demandas.map((demanda) => (
                      <div
                        key={demanda.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, demanda, coluna.tipo_coluna)}
                        onDragEnd={handleDragEnd}
                        className={`kanban-card priority-${getPrioridadeClass(demanda.prioridade)}`}
                      >
                        <div className="card-header">
                          <span className="processo-id">{demanda.id}</span>
                          <span className={`priority-badge ${getPrioridadeClass(demanda.prioridade)}`}>
                            {demanda.prioridade || 'normal'}
                          </span>
                        </div>

                        <h4 className="card-title">{demanda.titulo || `Processo ${demanda.id}`}</h4>
                        <p className="card-description">{demanda.descricao || 'Demanda em andamento'}</p>

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

        {/* Notificações e Ações */}
        <div className="bottom-section">
          <div className="notifications-panel">
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
                    <div key={notif.id} className="notification-item">
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

          <div className="quick-actions">
            <h2>Ações Rápidas</h2>
            <div className="actions-list">
              <button 
                  className="action-btn primary"
                  onClick={() => setIsCreatingDemanda(true)} // Abre o modal
              >
                <Plus size={24} />
                <div>
                  <strong>Nova Demanda</strong>
                  <span>Criar instantemente</span>
                </div>
              </button>
            </div>
          </div>
        </div>
          </>
        )}
      </main>

      {/* Modal/Componente para Cadastro de Demanda (RF01) */}
      {isCreatingDemanda && (
        <div className="modal-overlay" onClick={() => setIsCreatingDemanda(false)}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={() => setIsCreatingDemanda(false)}>X</button>
                <CadastrarDemanda 
                    onDemandaCriada={handleDemandaCriada} // Passa a função de callback
                    onCancel={() => setIsCreatingDemanda(false)} // Permite fechar pelo componente
                />
            </div>
        </div>
      )}
      {/* Fim ADIÇÃO 5 */}

      {/* Modal para Editar Colunas (Exclusivo Sócio) */}
      {isEditingColunas && (
        <div className="modal-overlay" onClick={() => setIsEditingColunas(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <EditarColunas
              onClose={() => setIsEditingColunas(false)}
              onColunasAtualizadas={loadDashboardData}
            />
          </div>
        </div>
      )}

      {/* Modal para Gerar Relatório PDF (RNF07) */}
      {showRelatorioPDF && (
        <div className="modal-overlay" onClick={() => setShowRelatorioPDF(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <GerarRelatorioPDF onClose={() => setShowRelatorioPDF(false)} />
          </div>
        </div>
      )}

      {/* Modal para Importar Demandas (RN01) */}
      {showImportarDemandas && (
        <ImportarDemandas 
          onClose={() => setShowImportarDemandas(false)}
          onImportComplete={() => {
            setShowImportarDemandas(false);
            loadDashboardData(); // Recarrega o kanban
          }}
        />
      )}

      {modalOpen && demandaSelecionada && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditingDemanda ? 'Editar Demanda' : 'Detalhes da Demanda'}</h2>
              <button className="close-btn" onClick={() => { setModalOpen(false); setIsEditingDemanda(false); }}>×</button>
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
                    <span>{demandaSelecionada.titulo || `Processo ${demandaSelecionada.id}`}</span>
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
                    <strong>Responsável:</strong>
                    <span>{demandaSelecionada.responsavel}</span>
                  </div>
                  
                  <div className="detail-row">
                    <strong>Prioridade:</strong>
                    <span className={`priority-badge ${getPrioridadeClass(demandaSelecionada.prioridade)}`}>
                      {demandaSelecionada.prioridade || 'normal'}
                    </span>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="btn-secondary" onClick={() => setModalOpen(false)}>
                    Fechar
                  </button>
                  <button className="btn-primary" onClick={handleEditarDemanda}>
                    <Edit size={18} />
                    Editar
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

export default DashboardSocio;