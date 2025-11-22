# Não funcionais

## Segurança

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF01* | Não-funcional | Controle de Acesso por Perfil (RBAC) | O acesso a dados e funcionalidades deve ser validado no back-end a cada requisição, com base nos perfis definidos (estagiário, advogado, sócio). |

---

## Desempenho

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF02* | Não-funcional | Experiência de Carregamento Ágil | Interface: O carregamento das telas principais (Dashboard, Kanban) devem indicar visualmente que a ação do usuário está sendo processada, utilizando indicadores visuais de carregamento ("spinners"). |

---

## Usabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF03* | Não-funcional | Especificações da Interface e Fluxo | As interfaces devem seguir especificações funcionais claras para garantir consistência. Exemplos: O formulário de processo deve conter os campos definidos em Kanban deve ter colunas configuráveis (DR 02). O importador deve ter mapeamento e pré-visualização (DR 03, DR 04). |


---

## Confiabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF04* | Não-funcional — Confiabilidade | Prevenção de Perda de Dados em Formulários | Em formulários longos ou de preenchimento complexo (ex: cadastro de processo), o conteúdo deve ser salvo periodicamente, permitindo a recuperação em caso de fechamento acidental da aba. |

---

## Regras de negócio

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RN01* | Não-funcional | Prevenção de Duplicidade na Importação | Durante a importação, o sistema deve usar a coluna "Número da Demanda" como chave única. Se o número não existir, uma nova demanda é criada. Se já existir, os dados da demanda existente são atualizados. O sistema não deve permitir a criação de duas demandas com o mesmo número. |
| *RN02* | Não-funcional | Sincronização de Status (Kanban, Atribuição) | Ao mover um card de demanda para uma nova coluna no Kanban (ex: da coluna 'Em Elaboração' para 'Revisão'), o campo 'Andamento' ou 'Status' da demanda deve ser automaticamente atualizado para refletir o nome da nova coluna (ex: o status mudaria para 'Revisão'). |
| *RN03* | Não-funcional | Auditoria Compulsória de Ações | O sistema deve registrar automaticamente um log para todas as ações críticas  (criar, editar, excluir demanda; mudar de etapa no Kanban). O log deve conter o usuário, a ação e a data/hora. |
| *RN04* | Não-funcional | Sistema de Notificações por Evento | O sistema deve enviar notificações automáticas para os responsáveis quando importantes ocorrerem, como: 1) Nova Atribuição. 2) Prazo Crítico (ex: notificar alguns dias antes do vencimento; este valor deve ser facilmente configurável no código). 3) Tarefa Concluída/Atrasada. |
| *RN05* | Funcional | Restriçao de acesso | O sistema deve ter restrições de acesso com relação ao cargo da pessoa. |
| *RN06* | Não-funcional | Processamento | A importação de planilhas de volume considerável deve ocorrer em segundo plano, e o sistema deve notificar o usuário quando o processo for concluído. |
| *RN07* | Funcional | Mapear colunas da planilha (De-Para) | O sistema deve apresentar como os quadros ficaram dispostos a partir da planilha, nomodelo “De-Para”. |
| *RN08* | Funcional | Destacar erros na pré-visualização | Durante a pré-visualização dos quadros Kanban, o sistema deve apresentar quais erros são indicados prestar maior atenção. |
| *RN09* | Funcional | Validar dados e exibir pré-visualização | O sistema deve conseguir apresentar quais dados estão válidos para importação, e apresentar como eles ficaram dispostos nos quadros Kanban. |
| *RN10* | Funcional | Executar importação em lote | O usuário pode escolher quantas planilhas quer importar por vez, desde que atenda aos requisitos de importação. |

push:
RN10 ~> RF01
RNF99 ~> RF01

pull:
RF01 ~> [RN10, RNF99]

---

## Código

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF05* | Não-funcional | Qualidade e Manutenibilidade do Código | Todo novo código deve ser revisado por pelo menos um outro membro da equipe antes de ser integrado à versão principal. | 