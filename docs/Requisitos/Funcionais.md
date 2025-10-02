### Requisitos Funcionais

---

## Tarefa: Gestão de Processos / Demandas

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF01** | Funcional | Cadastrar processo com informações detalhadas (cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável). |
| **RF02** | Funcional | Editar processo para atualizar informações (cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável). |
| **RF03** | Funcional | Visualizar processo com todos os detalhes (cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável). |

---

## Tarefa: Workflow Visual (Kanban)

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF04** | Funcional | Exibir processos em quadro Kanban com etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |

---

## Tarefa: Atribuição e Transferência de Responsabilidade

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF05** | Funcional | Atribuir processo a usuário específico; notificar automaticamente o responsável. |
| **RF06** | Funcional | Transferir responsabilidade entre perfis (ex.: estagiário → sócio) com notificação. |
| **RF19** | Funcional | Restringir funcionalidades para estagiários em comparação ao administrador. |
| **RF20** | Funcional | Exibir todas as atribuições do estagiário na página inicial (interface intuitiva e responsiva). |
| **RF21** | Funcional | Atualizar estado da atribuição na página da atribuição ou no dashboard do estagiário. |
| **RF23** | Funcional | Notificar estagiário sobre novas atribuições, prazos próximos ou atrasos. |
| **RF24** | Funcional | Notificar sócio sobre conclusão ou atraso das atribuições. |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF07** | Funcional | Importar planilha Excel com mapeamento de colunas (Cliente, Processo nº, Atividade, Andamento, Prazo), criar/atualizar processos em lote com pré-visualização. |

---

## Tarefa: Notificações e Mensagens Automatizadas

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF10** | Funcional | Enviar notificações automáticas (e-mail/WhatsApp) para prazos críticos, mudanças de status ou novos anexos usando templates. |
| **RF11** | Funcional | Enviar relatórios padronizados manualmente ao cliente (e-mail/WhatsApp). |

---

## Tarefa: Repositório Pesquisável de Modelos e Cláusulas

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF12** | Funcional | Armazenar templates, cláusulas e modelos de honorários com tags e busca por palavras-chave. |
| **RF13** | Funcional | Inserir trechos de templates/cláusulas em minutas. |
| **RF14** | Funcional | Versionar templates/cláusulas; registrar autor e data. |
| **RF26** | Funcional | Pesquisar cláusulas e modelos por palavras-chave. |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF15** | Funcional | Dashboard com indicadores: nº processos por status, % no prazo vs atrasados, tempo médio de resolução/atraso, nº prazos críticos (≤7 dias), metas por tipo, tempo até primeira ação, taxa de reapresentação/retrabalho. |
| **RF16** | Funcional | Gerar relatórios filtráveis e exportáveis (PDF/CSV) baseados nos indicadores. |

---

## Tarefa: Auditoria / Trilha de Atividades

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF17** | Funcional | Registrar log de ações (criação, edição, mudança de status, anexos) com usuário e data. |
| **RF18** | Funcional | Consultar log de auditoria e exportar em formato estruturado para conformidade. |

## Tarefa: Revisão de Atribuições

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RF25** | Funcional | Exibir tela de revisão de documentos antes de marcar atribuição como concluída. |
