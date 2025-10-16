# Não funcionais

## Segurança

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF01** | Não-funcional | Controle de Acesso por Perfil (RBAC) | O acesso a dados e funcionalidades deve ser validado no back-end a cada requisição, com base nos perfis definidos (estagiário, advogado, sócio). |

---

## Desempenho

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF02** | Não-funcional | Experiência de Carregamento Ágil | Interface: O carregamento das telas principais (Dashboard, Kanban) deve ser percebido pelo usuário como ágil, sem esperas frustrantes, utilizando indicadores visuais de carregamento ("spinners"). Processamento : A importação de planilhas de volume considerável deve ocorrer em segundo plano, e sistema deve notificar o usuário quando o processo for concluído. |

---

## Usabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF03** | Não-funcional | Especificações da Interface e Fluxo | As interfaces devem seguir especificações funcionais claras para garantir consistência. Exemplos: O formulário de processo deve conter os campos definidos em Kanban  eve ter colunas configuráveis (DR 02). O importador deve ter mapeamento e pré-visualizaçã o (DR 03, DR 04). |


---

## Confiabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF04** | Não-funcional — Confiabilidade | Prevenção de Perda de Dados em Formulários | Em formulários longos ou de preenchimento complexo (ex: cadastro de processo), o conteúdo deve ser salvo periodicamente , permitindo a recuperação em  aso de fechamento acidental da aba. |

---

## Regras de negócio

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF05** | Não-funcional | Prevenção de Duplicidade na Importação | Durante a importação, o sistema deve usar a coluna "Número do Processo" como chave única. Se o número não existir, um novo processo é criado. Se já existir, os dados do processo existente são atualizados. O sistema não deve permitir a criação de duas demandas com o mesmo número. |
| **RNF06** | Não-funcional | Sincronização de Status (Kanban, Atribuição) | Ao mover um card de processo para uma nova coluna no Kanban (ex: da coluna 'Em Elaboração' para 'Revisão'), o campo 'Andamento' ou 'Status' do processo deve ser automaticamente atualizado para refletir o nome da nova coluna (ex: o status mudaria para 'Revisão'). |
| **RNF07** | Não-funcional | Auditoria Compulsória de Ações | O sistema deve registrar automaticamente um log para todas as ações críticas  (criar, editar, excluir processo; mudar de etapa no Kanban). O log deve conter o usuário, a ação e a data/hora. |
| **RNF08** | Não-funcional | Sistema de Notificações por Evento | O sistema deve enviar notificações automáticas para os responsáveis quando importantes ocorrerem, como: 1) Nova Atribuição. 2) Prazo Crítico (ex: notificar alguns dias antes do vencimento; este valor deve ser facilmente configurável no código). 3) Tarefa Concluída/Atra sada. |
| **RNF09** | Funcional | Restriçao de acesso | o sistema deve ter restrições de acesso com relação ao cargo da pessoa. |

---

## Código

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RNF-010** | Não-funcional | Qualidade e Manutenibilidade do Código | O código deve ser limpo e organizado, passando em uma ferramenta de análise estática (lint) sem erros. Todo novo código deve ser revisado por pelo menos um outro membro da de  equipe antes de ser integrado à versão principal. 