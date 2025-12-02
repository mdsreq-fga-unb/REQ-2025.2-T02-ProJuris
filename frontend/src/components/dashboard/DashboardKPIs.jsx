import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../common/SkeletonLoader';

function DashboardKPIs() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState(30); // 7, 30 ou custom
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [showCustomDate, setShowCustomDate] = useState(false);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (showCustomDate && dataInicio && dataFim) {
        params.append('data_inicio', dataInicio);
        params.append('data_fim', dataFim);
      } else {
        params.append('periodo', periodo);
      }
      
      const response = await api.get(`/dashboard/kpis?${params.toString()}`);
      setKpis(response.data);
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs();
  }, [periodo, showCustomDate]);

  const handlePeriodoChange = (novoPeriodo) => {
    setPeriodo(novoPeriodo);
    setShowCustomDate(false);
  };

  const handleCustomDateSubmit = (e) => {
    e.preventDefault();
    if (dataInicio && dataFim) {
      loadKPIs();
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div className="loading-spinner">Carregando KPIs...</div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Não foi possível carregar os KPIs.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-kpis" style={{ padding: '24px' }}>
      {/* Header com Filtros */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={28} />
          Dashboard de Indicadores
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => handlePeriodoChange(7)}
            className={periodo === 7 && !showCustomDate ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px' }}
          >
            7 dias
          </button>
          <button
            onClick={() => handlePeriodoChange(30)}
            className={periodo === 30 && !showCustomDate ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px' }}
          >
            30 dias
          </button>
          <button
            onClick={() => setShowCustomDate(!showCustomDate)}
            className={showCustomDate ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px' }}
          >
            Personalizado
          </button>
          <button
            onClick={loadKPIs}
            className="btn-secondary"
            style={{ padding: '8px 16px' }}
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Filtro de Data Personalizada */}
      {showCustomDate && (
        <form onSubmit={handleCustomDateSubmit} style={{
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          gap: '12px',
          alignItems: 'end',
          flexWrap: 'wrap'
        }}>
          <div>
            <label htmlFor="dataInicio" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
              Data Início
            </label>
            <input
              type="date"
              id="dataInicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              style={{ padding: '8px' }}
              required
            />
          </div>
          <div>
            <label htmlFor="dataFim" style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
              Data Fim
            </label>
            <input
              type="date"
              id="dataFim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              style={{ padding: '8px' }}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
            Aplicar Filtro
          </button>
        </form>
      )}

      {/* Cards de KPIs Principais */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Volume de Tarefas */}
        <div className="kpi-card" style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <CheckCircle size={24} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Volume de Tarefas</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            {kpis.volume_tarefas.total}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            ✅ {kpis.volume_tarefas.concluidas} concluídas ({kpis.volume_tarefas.percentual_conclusao.toFixed(1)}%)
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            ⏳ {kpis.volume_tarefas.pendentes} pendentes
          </div>
        </div>

        {/* Tempo Médio */}
        <div className="kpi-card" style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Clock size={24} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Tempo Médio</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            {kpis.tempo_medio_conclusao_dias.toFixed(1)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            dias para conclusão
          </div>
        </div>

        {/* Taxa de Cumprimento */}
        <div className="kpi-card" style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <TrendingUp size={24} color="#10b981" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Taxa de Cumprimento</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            {kpis.taxa_cumprimento_prazos.toFixed(1)}%
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            demandas entregues no prazo
          </div>
        </div>

        {/* Demandas Atrasadas */}
        <div className="kpi-card" style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <AlertTriangle size={24} color="#ef4444" />
            <h3 style={{ margin: 0, fontSize: '16px' }}>Demandas Atrasadas</h3>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
            {kpis.demandas_atrasadas}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            necessitam atenção urgente
          </div>
        </div>
      </div>

      {/* Gráficos e Tabelas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {/* Demandas por Status */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Demandas por Status</h3>
          {kpis.demandas_por_status.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
              <span style={{ fontWeight: 'bold' }}>{item.count}</span>
            </div>
          ))}
        </div>

        {/* Demandas por Prioridade */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Demandas por Prioridade</h3>
          {kpis.demandas_por_prioridade.map((item, index) => {
            const colors = {
              urgente: '#ef4444',
              alta: '#f59e0b',
              normal: '#3b82f6',
              baixa: '#6b7280'
            };
            return (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span style={{
                  textTransform: 'capitalize',
                  color: colors[item.prioridade] || '#6b7280'
                }}>
                  {item.prioridade}
                </span>
                <span style={{ fontWeight: 'bold' }}>{item.count}</span>
              </div>
            );
          })}
        </div>

        {/* Top Responsáveis */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users size={20} />
            <h3 style={{ margin: 0 }}>Top 5 Responsáveis</h3>
          </div>
          {kpis.top_responsaveis.length > 0 ? (
            kpis.top_responsaveis.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <span>{item.nome}</span>
                <span style={{ fontWeight: 'bold' }}>{item.demandas}</span>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Nenhuma demanda no período</p>
          )}
        </div>
      </div>

      {/* Info do Período */}
      <div style={{
        marginTop: '24px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        📊 Dados do período: {new Date(kpis.periodo.data_inicio).toLocaleDateString('pt-BR')} até {new Date(kpis.periodo.data_fim).toLocaleDateString('pt-BR')} ({kpis.periodo.dias} dias)
      </div>
    </div>
  );
}

export default DashboardKPIs;
