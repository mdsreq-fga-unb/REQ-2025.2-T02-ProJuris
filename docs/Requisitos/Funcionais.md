### Requisitos Funcionais

---

## Tarefa: Gestão de Processos / Demandas

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF01** | Funcional | Cadastrar processo com informações detalhadas | essas informações devem conter cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |
| **RF02** | Funcional | Editar processo | deve ser possível atualizar informações como cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |
| **RF03** | Funcional | Visualizar processo | deve apresentar todos os detalhes do processo como cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |

---

## Tarefa: Workflow Visual (Kanban)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF0X** | funcional | Área de criação de processos no quadro kanban | permitindo adicionar detalhes do processo |
| **RF04** | Funcional | Exibir processos em quadro Kanban | deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |

---

## Tarefa: Atribuição e Transferência de Responsabilidade *(RF 23 e 24 são regras de negócio)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF05** | Funcional | Atribuir processo a usuário específico | notificar automaticamente o responsável. |
| **RF06** | Funcional | Transferir responsabilidade entre perfis | (ex.: estagiário → sócio) com notificação. |
| **RF19** | Funcional | Restringir funcionalidades para estagiários | em comparação ao administrador. |
| **RF20** | Funcional | Exibir todas as atribuições do estagiário | na página inicial (interface intuitiva e responsiva). |
| **RF21** | Funcional | Atualizar estado da atribuição | na página da atribuição ou no dashboard do estagiário. |
| **RF23** | Funcional | Notificar estagiário sobre novas atribuições, prazos próximos ou atrasos. |
| **RF24** | Funcional | Notificar sócio sobre conclusão ou atraso das atribuições. |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF07** | Funcional | Importar planilha Excel | com mapeamento de colunas (Cliente, Processo nº, Atividade, Andamento, Prazo), criar/atualizar processos em lote com pré-visualização. |

---

## Tarefa: Repositório Pesquisável de Modelos e Cláusulas

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF12** | Funcional | Armazenar templates, cláusulas e modelos de honorários | com tags e busca por palavras-chave. |
| **RF13** | Funcional | Inserir trechos de templates/cláusulas em minutas. |
| **RF14** | Funcional | Versionar templates/cláusulas | registrar autor e data. |
| **RF26** | Funcional | Pesquisar cláusulas e modelos | por palavras-chave. |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Nome |Descrição |
| :--- | :--- | :--- | :--- |
| **RF15** | Funcional | Dashboard com indicadores | nº processos por status, % no prazo vs atrasados, tempo médio de resolução/atraso, nº prazos críticos (≤7 dias), metas por tipo, tempo até primeira ação, taxa de reapresentação/retrabalho. |
| **RF16** | Funcional | Gerar relatório filtrável e exportável | o formato do relatório deve ser PDF/CSV e baseado nos indicadores. |

---

## Tarefa: Auditoria / Trilha de Atividades *(são regras de negócio)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF17** | Funcional | Registrar log de ações | (criação, edição, mudança de status, anexos) com usuário e data. |
| **RF18** | Funcional | Consultar log de auditoria | em formato estruturado para conformidade. | 
| **RF19** | Funcional | exportar log de auditoria | em formato estruturado para conformidade. |

## Tarefa: Revisão de Atribuições *(Detalhamento do RF04)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF25** | Funcional | Exibir tela de revisão de documentos | antes de marcar atribuição como concluída. |
