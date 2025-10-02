# Documento de Especificação Técnica - MVP Sistema de Gestão Jurídica

## 1 — Escopo do MVP (o que será entregue)

**Objetivo:** entregar valor mínimo viável para gestão de processos jurídicos com workflow visual, atribuição de responsáveis, anexação de documentos e notificações essenciais.

Critérios de Escolha para o MVP





Valor de Negócio: Priorizar tarefas que maximizem eficiência operacional, reduzam atrasos em prazos e melhorem a tomada de decisão gerencial, alinhando-se aos indicadores mencionados (ex.: % de processos atrasados, tempo médio de resolução).



Necessidades de Sistema: Incluir funcionalidades core que formem a base do sistema (ex.: gerenciamento de processos), essenciais para suportar outras tarefas.



Complexidade e Viabilidade: Focar em tarefas de baixa a média complexidade para entrega rápida (6-8 semanas), evitando integrações externas complexas (ex.: WhatsApp) no MVP inicial.



Feedback Iterativo: Selecionar um conjunto mínimo que permita testes com usuários reais (estagiários, advogados, sócios) para validar hipóteses antes de expansões.

Tarefas e Requisitos do MVP

Tarefa: Gestão de Processos / Demandas





RF01 – Cadastrar processo com informações detalhadas, incluindo cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável.



RF02 – Editar processo para atualizar informações como cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável.



RF03 – Visualizar processo com todos os detalhes, incluindo cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável.

Tarefa: Atribuição e Transferência de Responsabilidade





RF05 – Atribuir processo a um usuário específico, com notificação automática ao responsável.



RF06 – Transferir responsabilidade de processo entre perfis (ex.: estagiário para sócio) com notificação automática aos envolvidos.



RF19 – Restringir acesso de estagiários a funcionalidades específicas, limitando ações em comparação com administradores.



RF20 – Exibir todas as atribuições do estagiário na página inicial, com interface intuitiva e responsiva.



RF21 – Atualizar estado de atribuição diretamente na página da atribuição ou no dashboard do estagiário.



RF23 – Notificar estagiário sobre novas atribuições, prazos próximos ou atrasados.



RF24 – Notificar sócio sobre conclusão ou atraso de atribuições realizadas por estagiários.

Tarefa: Anexação e Gerenciamento de Documentos





RF08 – Anexar documentos a processos, com controle de versão, metadados (quem anexou, quando) e opções de visualização e download.



RF09 – Pesquisar documentos anexados por nome ou data.

Tarefa: Auditoria / Trilha de Atividades





RF17 – Registrar log de ações (criação, edição, mudança de status, anexos) com usuário e data para auditoria.



RF18 – Consultar log de auditoria e exportar em formato estruturado para conformidade.

Tarefa: Dashboard de Indicadores e Relatórios





RF15 – Exibir dashboard com indicadores, incluindo número de processos por status (aberto, em andamento, concluído), percentual de processos dentro do prazo vs. atrasados, tempo médio de resolução, tempo médio de atraso, número de prazos críticos (7 dias ou menos), meta de tempo por tipo de processo, tempo até primeira ação e taxa de reapresentação/retrabalho.



RF16 – Gerar relatórios filtráveis e exportáveis em PDF ou CSV com base nos indicadores do dashboard.

Escopo do MVP

O MVP abrange o núcleo funcional de um sistema de gerenciamento de processos jurídicos, focado em atender as dores principais de um escritório de advocacia: organização de demandas, colaboração entre perfis (estagiários e sócios), rastreamento de ações, armazenamento seguro de documentos e visibilidade gerencial. Ele cobre o ciclo básico de um processo jurídico (criar/atribuir → anexar documentos → monitorar → auditar), garantindo:





Eficiência Operacional: Centralização de processos e atribuições reduz retrabalho e desorganização.



Conformidade: Auditoria e controle de documentos asseguram rastreabilidade e aderência a normas como LGPD.



Tomada de Decisão: Dashboard com indicadores-chave (ex.: prazos críticos) suporta decisões rápidas.



Usabilidade: Interface intuitiva para diferentes perfis, com foco em adoção rápida.

Excluímos do MVP tarefas mais complexas (ex.: Workflow Kanban, Notificações por WhatsApp, Repositório de Cláusulas) para viabilizar entrega ágil e coletar feedback. Iterações futuras podem incluir essas funcionalidades, com base em validações do MVP.