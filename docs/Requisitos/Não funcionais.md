# Não funcionais

- [Segurança](#segurança)
- [Desempenho](#desempenho)
- [Usabilidade](#usabilidade)
- [Confiabilidade](#confiabilidade)
- [Código](#c%C3%B3digo)
- [Relatórios e Dashboards](#relat%C3%B3rios-e-dashboards)
- [Regras de negócio](#regras-de-neg%C3%B3cio)

## Segurança

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF01* | Não-funcional | Controle de Acesso por Perfil (RBAC) | O acesso a dados e funcionalidades deve ser validado no back-end a cada requisição, com base nos perfis definidos (estagiário, advogado, sócio). Exemplo: estagiários não podem excluir demandas. O sistema deve retornar código HTTP 403 para acessos não autorizados. |


## Desempenho

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF02* | Não-funcional | Experiência de Carregamento Ágil | As telas principais (Dashboard, Kanban) devem exibir um indicador visual de carregamento (spinner) para ações que levam mais de 500ms. |


## Usabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF03* | Não-funcional | Especificações da Interface e Fluxo | As interfaces devem seguir especificações funcionais claras para garantir consistência. O formulário de cadastro de demanda deve conter os campos obrigatórios: número da demanda, cliente, tipo de ação, prazo e responsável. O Kanban deve ter colunas configuráveis (ex: Pendente, Em Elaboração, Em Revisão, Concluída). O importador deve permitir mapeamento De-Para de colunas e exibir pré-visualização dos dados antes da importação. |


## Confiabilidade

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF04* | Não-funcional — Confiabilidade | Prevenção de Perda de Dados em Formulários | Em formulários longos ou de preenchimento complexo (ex: cadastro de demanda), o conteúdo deve ser salvo automaticamente a cada 2 minutos usando LocalStorage, permitindo a recuperação em caso de fechamento acidental da aba. |


## Código

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF05* | Não-funcional | Qualidade e Manutenibilidade do Código | Todo novo código deve ser revisado por pelo menos um outro membro da equipe antes de ser integrado à versão principal. Funcionalidades críticas (cadastro de usuário, autenticação, importação de planilhas) devem ter testes automatizados. |

## Relatórios e Dashboards

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RNF06* | Não-funcional | Dashboard de Indicadores | O sistema deve fornecer dashboard visual com KPIs: volume de tarefas (concluídas vs. pendentes), tempo médio de conclusão, taxa de cumprimento de prazos. Deve carregar em até 2 s e permitir filtros por período (7 dias, 30 dias, personalizado). |
| *RNF07* | Não-funcional | Geração de Relatórios | O sistema deve permitir gerar relatórios em PDF (resumido ou detalhado) contendo número da demanda, cliente, status, prazo, última atualização e responsável. Geração deve levar no máximo 5 s para até 100 registros de histórico. |
| *RNF08* | Não-funcional | Visualização de Métricas por Responsável | O dashboard deve permitir visualizar métricas individuais por responsável (número de demandas, taxa de conclusão no prazo, demandas atrasadas). Sócios veem métricas de todos; estagiários/advogados veem apenas as próprias. |


## Regras de negócio

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| *RN01* | Não-funcional | Prevenção de Duplicidade na Importação | Durante a importação, o sistema deve usar a coluna "Número da Demanda" como chave única. Se o número não existir, uma nova demanda é criada. Se já existir, os dados da demanda existente são atualizados. O sistema não deve permitir a criação de duas demandas com o mesmo número e deve exibir mensagem de erro específica ao usuário. |
| *RN02* | Não-funcional | Sincronização de Status (Kanban, Atribuição) | Ao mover um card de demanda para uma nova coluna no Kanban (ex: da coluna 'Em Elaboração' para 'Revisão'), o campo 'Status' da demanda deve ser automaticamente atualizado para refletir o nome da nova coluna. A atualização deve refletir imediatamente na interface, sem delay perceptível para o usuário. |
| *RN03* | Não-funcional | Auditoria Compulsória de Ações | O sistema deve registrar automaticamente um log para todas as ações críticas (criar, editar, excluir demanda; mudar de etapa no Kanban). O log deve conter: usuário, ação, data/hora e ID da demanda. Os logs devem ser armazenados em tabela MySQL dedicada. |
| *RN04* | Não-funcional | Sistema de Notificações por Evento | O sistema deve exibir notificações no painel do usuário (in-app) em tempo real quando eventos importantes ocorrerem: 1) Nova Atribuição de demanda; 2) Prazo Crítico (notificar 3 dias antes do vencimento; este valor deve ser facilmente configurável no código); 3) Mudança de Status da demanda. Opcionalmente, o sistema pode enviar notificações por e-mail. |
| *RN05* | Não-funcional | Restrição de Acesso | O sistema deve ter restrições de acesso com relação ao cargo da pessoa. Exemplo: sócios podem criar, editar e excluir demandas; estagiários e advogados podem criar e editar, mas não excluir demandas. |
| *RN06* | Não-funcional | Processamento em Segundo Plano | A importação de planilhas com mais de 50 registros deve ocorrer em segundo plano, com barra de progresso visível ao usuário. O sistema deve notificar o usuário quando o processo for concluído. |
| *RN07* | Não-funcional | Mapear Colunas da Planilha (De-Para) | O sistema deve apresentar interface que permita ao usuário mapear as colunas da planilha Excel aos campos do sistema antes de realizar a importação. O mapeamento deve ser salvo para reutilização em importações futuras. |
| *RN08* | Não-funcional | Destacar Erros na Pré-visualização | Durante a pré-visualização da importação, o sistema deve destacar em vermelho as linhas com erros de validação e exibir tooltip explicativo ao passar o mouse sobre o erro. |
| *RN09* | Não-funcional | Validar Dados e Exibir Pré-visualização | O sistema deve validar os dados da planilha e exibir pré-visualização em formato de tabela, destacando dados válidos em verde e inválidos em vermelho. O usuário deve poder corrigir dados antes de confirmar a importação. |
| *RN10* | Não-funcional | Executar Importação em Lote | O usuário pode importar até 3 planilhas simultaneamente, desde que cada planilha não exceda 5 MB. |
