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
| **RF0X** | Funcional | Área de criação de processos no quadro kanban | permitindo adicionar detalhes do processo |
| **RF04** | Funcional | Exibir processos em quadro Kanban | deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |
| **RFXX** | Funcional | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban |


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
| **RF07.1** | Funcional | Iniciar importação e fazer upload de arquivo | O sistema deve prover uma interface para o upload de um arquivo (.xlsx ou .csv) e oferecer um modelo de planilha para download com os cabeçalhos exatos: Cliente, Processo nº, Petição modelo, Atividade, Andamento e Prazo (útil).| 
| **RF07.2** | Funcional | Mapear colunas da planilha (De-Para) | Após o upload, o sistema deve associar automaticamente as colunas do arquivo aos campos do sistema. O usuário deve poder confirmar ou corrigir o mapeamento para Cliente, Processo nº, Petição modelo, Atividade, Andamento e Prazo (útil). |
| **RF07.3** | Funcional | Validar dados e exibir pré-visualização | O sistema deve usar a coluna Processo nº como chave única para determinar a ação: Criar (se o número não existe) ou Atualizar (se o número já existe). A pré-visualização deve exibir esta ação para cada linha. |
| **RF07.4** | Funcional | Destacar erros na pré-visualização | Na pré-visualização, o sistema deve marcar e desabilitar linhas com erros, como a ausência de Cliente ou Processo nº (campos obrigatórios), ou um formato de data inválido no campo Prazo (útil). |
| **RF07.5** | Funcional | Executar importação em lote | Após a confirmação do usuário, o sistema deve executar as operações no banco de dados, populando ou alterando os campos Cliente, Petição modelo, Atividade, Andamento e Prazo (útil) de acordo com cada Processo nº da planilha. |
| **RF07.6** | Funcional | Apresentar relatório de conclusão | Ao final, o sistema deve exibir um relatório sumário detalhando o total de processos criados, atualizados e o número de linhas ignoradas por erros, oferecendo um log com os detalhes das falhas. | 

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
| **RF15.1** | Funcional | Exibir painel de indicadores (Dashboard) | O sistema deve apresentar uma tela principal (Dashboard) que servirá como contêiner para os diversos indicadores de performance. |
| **RF15.2** | Funcional | Indicador - Processos por Status | O dashboard deve exibir um gráfico mostrando a quantidade total de processos para cada status do Kanban. |
| **RF15.3** | Funcional | Indicador - Desempenho de Prazos (% On-time) | O dashboard deve exibir um indicador percentual mostrando a proporção de processos concluídos dentro do prazo versus os atrasados. |
| **RF15.4** | Funcional | Indicador - Tempo Médio de Resolução (TMR) | O dashboard deve calcular e exibir o tempo médio (em dias) que os processos levam desde a sua criação até a sua conclusão. |
| **RF15.5** | Funcional | Indicador - Prazos Críticos | O dashboard deve destacar em uma lista ou contador o número de processos ativos cujo prazo se encerra nos próximos 7 dias. |
| **RF15.6** | Funcional | Indicador - Tempo até Primeira Ação (TTA) | O dashboard deve exibir o tempo médio que um novo processo leva para ter sua primeira ação ou mudança de status registrada. |
| **RF15.7** | Funcional | Indicador - Taxa de Retrabalho | O dashboard deve exibir a porcentagem de processos que, após avançarem, retornam para uma etapa anterior no fluxo de trabalho. |
| **RF15.8** | Funcional | Indicador - Tempo Médio de Atraso | Para os processos concluídos com atraso, o dashboard deve calcular e exibir o tempo médio (em dias) desse atraso. |
| **RF16** | Funcional | Gerar relatório filtrável e exportável | Permitir a geração de relatórios com base nos indicadores, com opções de filtro e exportação para PDF ou CSV. |

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
