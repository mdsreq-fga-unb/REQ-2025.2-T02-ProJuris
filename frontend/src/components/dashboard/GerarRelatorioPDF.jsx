import React, { useState } from 'react';
import { Download, FileText, Filter, X } from 'lucide-react';
import api from '../../services/api';

/**
 * Componente para geração e download de relatórios PDF (RNF07)
 * Permite escolher tipo (resumido/detalhado) e aplicar filtros
 */
const GerarRelatorioPDF = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState('resumido');
  const [filtros, setFiltros] = useState({
    status: '',
    prioridade: '',
    data_inicio: '',
    data_fim: ''
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gerarPDF = async () => {
    setLoading(true);
    
    try {
      // Construir query params
      const params = new URLSearchParams();
      params.append('tipo', tipo);
      
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.prioridade) params.append('prioridade', filtros.prioridade);
      if (filtros.data_inicio) params.append('data_inicio', filtros.data_inicio);
      if (filtros.data_fim) params.append('data_fim', filtros.data_fim);
      
      // Fazer request
      const response = await api.get(`/relatorios/pdf?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Criar URL do blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Criar link temporário e fazer download
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_${tipo}_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('✅ Relatório PDF gerado com sucesso!');
      
      // Fechar modal após sucesso
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      if (error.response?.status === 404) {
        alert('⚠️ Nenhuma demanda encontrada com os filtros especificados.');
      } else {
        alert('❌ Erro ao gerar relatório PDF. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={24} color="#1e40af" />
          <h2 style={styles.title}>Gerar Relatório PDF</h2>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>
      </div>

      {/* Tipo de relatório */}
      <div style={styles.section}>
        <label style={styles.label}>
          <FileText size={16} />
          Tipo de Relatório
        </label>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="resumido"
              checked={tipo === 'resumido'}
              onChange={(e) => setTipo(e.target.value)}
              style={styles.radio}
            />
            <span>Resumido</span>
            <span style={styles.radioDescription}>
              (Tabela com principais informações)
            </span>
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              value="detalhado"
              checked={tipo === 'detalhado'}
              onChange={(e) => setTipo(e.target.value)}
              style={styles.radio}
            />
            <span>Detalhado</span>
            <span style={styles.radioDescription}>
              (Informações completas de cada demanda)
            </span>
          </label>
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.section}>
        <label style={styles.label}>
          <Filter size={16} />
          Filtros (Opcional)
        </label>

        <div style={styles.filterGrid}>
          {/* Status */}
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Status</label>
            <select
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="revisao">Revisão</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          {/* Prioridade */}
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Prioridade</label>
            <select
              name="prioridade"
              value={filtros.prioridade}
              onChange={handleFiltroChange}
              style={styles.select}
            >
              <option value="">Todas</option>
              <option value="urgente">Urgente</option>
              <option value="alta">Alta</option>
              <option value="normal">Normal</option>
              <option value="baixa">Baixa</option>
            </select>
          </div>

          {/* Data Início */}
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Data Início</label>
            <input
              type="date"
              name="data_inicio"
              value={filtros.data_inicio}
              onChange={handleFiltroChange}
              style={styles.input}
            />
          </div>

          {/* Data Fim */}
          <div style={styles.filterItem}>
            <label style={styles.filterLabel}>Data Fim</label>
            <input
              type="date"
              name="data_fim"
              value={filtros.data_fim}
              onChange={handleFiltroChange}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div style={styles.actions}>
        <button onClick={onClose} style={styles.btnCancel} disabled={loading}>
          Cancelar
        </button>
        <button onClick={gerarPDF} style={styles.btnGenerate} disabled={loading}>
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Gerando...
            </>
          ) : (
            <>
              <Download size={18} />
              Gerar PDF
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div style={styles.info}>
        <p style={styles.infoText}>
          💡 O relatório será baixado automaticamente após a geração.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '600px',
    width: '100%'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e7eb'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e40af',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  },
  section: {
    marginBottom: '24px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '12px'
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#f9fafb'
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  radioDescription: {
    fontSize: '12px',
    color: '#6b7280',
    marginLeft: 'auto'
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4b5563'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#fff'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  },
  btnCancel: {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  btnGenerate: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    backgroundColor: '#1e40af',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  info: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#eff6ff',
    borderRadius: '6px',
    border: '1px solid #bfdbfe'
  },
  infoText: {
    margin: 0,
    fontSize: '13px',
    color: '#1e40af'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #fff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block'
  }
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  try {
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  } catch (e) {
    // Animation already exists
  }
}

export default GerarRelatorioPDF;
