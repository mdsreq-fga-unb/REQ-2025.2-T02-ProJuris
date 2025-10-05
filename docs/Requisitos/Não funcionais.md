### Requisitos Não Funcionais *(RNF01 é requisito funcional, explicar navegação simplificada RNF07, Rnf01 repete algum outro requisito)

---

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF01** | Não-funcional — Segurança | Autenticação com controle de acesso por perfis | (estagiário, advogado, sócio). |
| **RNF03** | Não-funcional — Desempenho | Suportar 300–400 processos ativos simultâneos | tempo de resposta ≤ 500ms para 95% das requisições. |
| **RNF07** | Não-funcional — Usabilidade | Usabilidade para diferentes perfis | (estagiários, advogados, sócios) com navegação simplificada. |
| **RNF03** | Não-funcional — Usabilidade | Especificações da Interface e Fluxo | As interfaces devem seguir especificações funcionais claras para garantir consistência. Exemplos: O formulário de processo deve conter os campos definidos em Kanban  eve ter colunas configuráveis (DR 02). O importador deve ter mapeamento e pré-visualizaçã o (DR 03, DR 04). |
| **RNF09** | Não-funcional | O código deve ser limpo e organizado, passando em uma ferramenta de análise estática (lint)  em erros. Todo novo código deve ser revisado por pelo menos um outro membro da equipe antes de ser integrado à versão principal. |

---

## Tarefa: Workflow Visual (Kanban) *(analisar a viabilidade do ux no RNF05)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF05** | Não-funcional — Usabilidade | Interface intuitiva e responsiva | tempo de carregamento ≤ 500ms; seguir diretrizes de UX. |
| **RNF06** | Não-funcional — Usabilidade / Brand | Adaptar interface à identidade visual | cores, logotipo, tipografia. |

---

## Tarefa: Atribuição e Transferência de Responsabilidade *(prof falou para tirar essa tarefa inteira)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF01** | Não-funcional — Segurança | Controle de Acesso por Perfil (RBAC) | O acesso a dados e funcionalidades deve ser validado no back-end a cada requisição, com base nos perfis definidos (estagiário, advogado, sócio). |
| **RNF05** | Não-funcional | Usabilidade (≤500ms). |
| **RNF07** | Não-funcional | Usabilidade multi-perfil. |
| **RNF09** | Não-funcional | Salvamento automático a cada 20 minutos | confiabilidade, perda <0,01%. |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF04** | Não-funcional — Desempenho | Processar planilhas até 1000 linhas em < 10 segundos | com validação de dados. |
| **RNF05** | Não-funcional — Usabilidade | Interface intuitiva e responsiva | tempo de carregamento ≤ 500ms. |


---

## Tarefa: Anexação e Gerenciamento de Documentos

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF09** | Não-funcional — Confiabilidade | Salvamento automático a cada 20 minutos | perda de dados < 0,01%. |
| **RNF04** | Não-funcional — Confiabilidade | Prevenção de Perda de Dados em Formulários | Em formulários longos ou de preenchimento complexo (ex: cadastro de processo), o conteúdo deve ser salvo periodicamente , permitindo a recuperação em  aso de fechamento acidental da aba. |

---

## Tarefa: Notificações e Mensagens Automatizadas

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF10** | Não-funcional — Confiabilidade | Disponibilidade do sistema 99,9% | exceto janelas de manutenção. |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF02** | Não-funcional — desempenho | Experiência de Carregamento Ágil | Interface: O carregamento das telas principais (Dashboard, Kanban) deve ser percebido pelo usuário como ágil, sem esperas frustrantes, utilizando indicadores visuais de carregamento ("spinners"). Processamento : A importação de planilhas de volume considerável deve ocorrer em segundo plano, e sistema deve notificar o usuário quando o processo for concluído. |
| **RNF05** | Não-funcional | Usabilidade (≤500ms). |
| **RNF06** | Não-funcional | Identidade visual. |

---

## Tarefa: Auditoria / Trilha de Atividades

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF01 / RNF11** | Não-funcional | Manutenibilidade | documentação de APIs/schemas. |

---

## Tarefa: Revisão de Atribuições

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF05** | Não-funcional | Usabilidade | interface responsiva ≤500ms. |
| **RNF09** | Não-funcional | Confiabilidade | salvamento automático cada 20 minutos. |

---

## Tarefa: Notificações e Mensagens Automatizadas *(preicsa ser revisado / não é funcional)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF10** | Funcional | Enviar notificações automáticas| devem ser por e-mail e WhatsApp para prazos críticos, mudanças de status ou novos anexos usando templates. |
| **RF11** | Funcional | Enviar relatório padronizado | manualmente ao cliente por e-mail e WhatsApp. |

## Regras de negócio
| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF05** | Não-funcional | Prevenção de Duplicidade na Importação | Durante a importação, o sistema deve usar a coluna "Número do Processo" como chave única. Se o número não existir, um novo processo é criado. Se já existir, os dados do processo existente são atualizados. O sistema não deve permitir a criação de dois processos com o mesmo número. |
| **RNF06** | Não-funcional | Sincronização de Status (Kanban, Atribuição) | Ao mover um card de processo para uma nova coluna no Kanban (ex: da coluna 'Em Elaboração' para 'Revisão'), o campo 'Andamento' ou 'Status' do processo deve ser automaticamente atualizado para refletir o nome da nova coluna (ex: o status mudaria para 'Revisão'). |
| **RNF07** | Não-funcional | Auditoria Compulsória de Ações | O sistema deve registrar automaticamente um log para todas as ações críticas  (criar, editar, excluir processo; mudar de etapa no Kanban). O log deve conter o usuário, a ação e a data/hora. |
| **RNF08** | Não-funcional | Sistema de Notificações por Evento | O sistema deve enviar notificações automáticas para os responsáveis quando importantes ocorrerem, como: 1) Nova Atribuição. 2) Prazo Crítico (ex: notificar alguns dias antes do vencimento; este valor deve ser facilmente configurável no código). 3) Tarefa Concluída/Atra sada. |
