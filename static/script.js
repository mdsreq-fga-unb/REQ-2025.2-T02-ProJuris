
// Inicialização do Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard LegalPRO carregado');
    
    // Configurar sidebar retrátil
    setupSidebarToggle();
    
    // Adicionar animações aos cards
    animateCards();
    
    // Configurar interações
    setupInteractions();
});

// SIDEBAR RETRÁTIL - FUNÇÃO SIMPLIFICADA
function setupSidebarToggle() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            console.log('Sidebar toggle clicked - collapsed:', sidebar.classList.contains('collapsed'));
        });
    } else {
        console.error('Elementos da sidebar não encontrados');
    }
}

// Animar entrada dos cards
function animateCards() {
    const cards = document.querySelectorAll('.stat-card, .kanban-card, .notification-item');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Configurar interações dos elementos
function setupInteractions() {
    // Menu lateral
    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Botões de ação rápida
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('strong').textContent;
            handleQuickAction(action);
        });
    });
    
    
    // Notificações
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.backgroundColor = '#f3f4f6';
            setTimeout(() => {
                this.style.backgroundColor = 'transparent';
            }, 300);
        });
    });
    
    // Cards do Kanban - Drag and Drop (básico)
    const kanbanCards = document.querySelectorAll('.kanban-card');
    kanbanCards.forEach(card => {
        card.setAttribute('draggable', 'true');
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
    
    const columns = document.querySelectorAll('.column-content');
    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });
}

// Handlers para Drag and Drop
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.5';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDrop(e) {
    e.preventDefault();
    
    if (draggedElement) {
        this.appendChild(draggedElement);
        updateColumnCounts();
        showNotification('Processo movido com sucesso!');
    }
    
    return false;
}

// Atualizar contadores das colunas
function updateColumnCounts() {
    const columns = document.querySelectorAll('.kanban-column');
    
    columns.forEach(column => {
        const count = column.querySelectorAll('.kanban-card').length;
        const countElement = column.querySelector('.count');
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// Handler para ações rápidas
function handleQuickAction(action) {
    console.log(`Ação selecionada: ${action}`);
    
    switch(action) {
        case 'Novo Processo':
            showNotification('Abrindo formulário de novo processo...');
            // Aqui você pode abrir um modal ou redirecionar para outra página
            break;
        case 'Importar Excel':
            showNotification('Funcionalidade de importação em desenvolvimento...');
            break;
        case 'Gerar Relatório':
            showNotification('Gerando relatório...');
            break;
        case 'Buscar Modelo':
            showNotification('Abrindo busca de modelos...');
            break;
        default:
            showNotification('Ação não reconhecida');
    }
}

// Mostrar notificação temporária
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #1e3a8a;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Atualizar dashboard com novos dados (exemplo)
async function updateDashboard() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        console.log('Dashboard atualizado:', data);
        // Aqui você pode atualizar os elementos da página com os novos dados
        
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

// Funcionalidade de busca (se necessário)
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterContent(searchTerm);
        });
    }
}

function filterContent(term) {
    const cards = document.querySelectorAll('.kanban-card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}