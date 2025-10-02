### Requisitos Funcionais

| ID | Descrição |
| :--- | :--- |
| **RF01** | **Gestão de Processos / Demandas:** Permitir criar, editar e visualizar processos/demandas com campos: título, cliente, responsável, prazo, prioridade, tags e status; cada processo liga-se a um caso jurídico único. |
| **RF02** | **Workflow Visual (Kanban):** Exibir as demandas em um quadro visual por etapas (ex.: Elaboração → Revisão → Pendente Cliente → Concluída) com caixa de seleção de fases para mudar de etapa e atualização automática do responsável. |
| **RF03** | **Atribuição e Transferência de Responsabilidade:** Possibilitar atribuir demandas a usuários, transferir responsabilidade entre perfis (estagiário → sócio) e notificar automaticamente os envolvidos da mudança. |
| **RF04** | **Importador Assistido de Planilhas (Excel → Sistema):** Permitir importar uma planilha Excel, mapear colunas para campos do sistema, validar dados e criar/atualizar processos em lote com pré-visualização das alterações. |
| **RF05** | **Anexação e Gerenciamento de Documentos:** Anexar, versionar, visualizar e baixar documentos vinculados a cada processo; controlar metadados (quem anexou, quando) e permitir pesquisa por nome/data. |
| **RF06** | **Notificações e Mensagens Automatizadas (incl. WhatsApp):** Disparar alertas configuráveis (prazo crítico, mudança de status, novo anexo) por e-mail/WhatsApp usando templates pré-aprovados; permitir envio manual de relatórios padronizados ao cliente. |
| **RF07** | **Repositório Pesquisável de Modelos e Cláusulas:** Armazenar templates, cláusulas e modelos de honorários com tags e busca por palavras-chave; possibilitar inserir trechos em minutas e manter versão/autor dos modelos. |
| **RF08** | **Dashboard de Indicadores e Relatórios:** Mostrar nº processos por status, tempo médio de resolução, taxa de cumprimento de prazos; gerar relatórios filtráveis e exportáveis (PDF/CSV) para acompanhamento gerencial. |
| **RF09** | **Auditoria / Trilha de Atividades:** Registrar todas as ações relevantes (criação/edição/status/baixar/anexar) com usuário e data; permitir consulta e exportação do log para fins de conformidade. |
| **RF10** | **Restrição de acesso:** O estagiário terá funcionalidades e utilidades limitadas quando comparado com o administrador. |
| **RF11** | **Visualizar todas as atribuições:** A interface do programa deverá ser intuitiva, rápida e responsiva, mostrando todas as atribuições do estagiário logo na página inicial. |
| **RF12** | **Atualizar o estado da Atribuição:** Através da página da atribuição ou da dashboard do Estagiário. |
| **RF13** | **Salvar automaticamente atualizações de atribuição (desejável):** O sistema deverá salvar de 20 em 20 minutos o estado atual das edições do usuário para o banco de dados, de forma a evitar perda de dados e informações. |
| **RF14** | **Notificações (Estagiário):** O sistema deverá notificar quando o usuário receber uma ou mais atribuições, quando uma atribuição estiver próxima do vencimento ou quando for atrasada. |
| **RF15** | **Notificar Sócio de atualização nas atribuições:** Assim que uma ou mais atribuições forem concluídas ou entrarem em atraso, o sistema deverá sinalizar o Sócio que atribuiu a tarefa. |
| **RF16** | **Requisitar revisões de andamento de processos:** O sistema deverá, antes de salvar o estado da atribuição como "concluído", mostrar ao usuário uma tela de revisão do documento para evitar erros. |
| **RF17** | **Busca de cláusulas no repositório:** Permitir a busca de cláusulas no repositório de cláusulas e modelos. |