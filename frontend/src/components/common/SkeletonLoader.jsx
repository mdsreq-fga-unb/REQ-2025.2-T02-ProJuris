import React from 'react';

/**
 * Componente de Skeleton Loading (RNF02)
 * Fornece placeholders visuais durante carregamento de dados
 */

const SkeletonLoader = ({ type = 'card', count = 1, height = '100px', width = '100%' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return <SkeletonCard height={height} width={width} />;
      case 'table-row':
        return <SkeletonTableRow />;
      case 'list-item':
        return <SkeletonListItem />;
      case 'kanban-card':
        return <SkeletonKanbanCard />;
      case 'text':
        return <SkeletonText width={width} />;
      case 'circle':
        return <SkeletonCircle />;
      default:
        return <SkeletonCard height={height} width={width} />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ marginBottom: type === 'table-row' ? '0' : '16px' }}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};

// Skeleton para cards genéricos
const SkeletonCard = ({ height, width }) => (
  <div style={{
    ...styles.base,
    height,
    width,
    borderRadius: '8px'
  }} />
);

// Skeleton para linha de tabela
const SkeletonTableRow = () => (
  <div style={styles.tableRow}>
    <div style={{ ...styles.base, width: '10%', height: '20px' }} />
    <div style={{ ...styles.base, width: '30%', height: '20px' }} />
    <div style={{ ...styles.base, width: '15%', height: '20px' }} />
    <div style={{ ...styles.base, width: '20%', height: '20px' }} />
    <div style={{ ...styles.base, width: '25%', height: '20px' }} />
  </div>
);

// Skeleton para item de lista
const SkeletonListItem = () => (
  <div style={styles.listItem}>
    <div style={{ ...styles.base, width: '40px', height: '40px', borderRadius: '50%' }} />
    <div style={{ flex: 1 }}>
      <div style={{ ...styles.base, width: '60%', height: '16px', marginBottom: '8px' }} />
      <div style={{ ...styles.base, width: '40%', height: '12px' }} />
    </div>
  </div>
);

// Skeleton para card do Kanban
const SkeletonKanbanCard = () => (
  <div style={styles.kanbanCard}>
    <div style={{ ...styles.base, width: '80%', height: '18px', marginBottom: '8px' }} />
    <div style={{ ...styles.base, width: '100%', height: '40px', marginBottom: '8px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
      <div style={{ ...styles.base, width: '30%', height: '12px' }} />
      <div style={{ ...styles.base, width: '30%', height: '12px' }} />
    </div>
  </div>
);

// Skeleton para texto
const SkeletonText = ({ width }) => (
  <div style={{ ...styles.base, width, height: '16px' }} />
);

// Skeleton para avatar/círculo
const SkeletonCircle = () => (
  <div style={{ ...styles.base, width: '48px', height: '48px', borderRadius: '50%' }} />
);

const styles = {
  base: {
    background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '4px'
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    gap: '16px',
    borderBottom: '1px solid #e5e7eb'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb'
  },
  kanbanCard: {
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

// Adiciona animação CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    try {
      styleSheet.insertRule(`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `, styleSheet.cssRules.length);
    } catch (e) {
      // Animação já existe
    }
  }
}

export default SkeletonLoader;
