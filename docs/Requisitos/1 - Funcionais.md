# Funcionais

## Tarefa: Gestão de Demandas

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF01** | Funcional | Cadastrar demandas com informações detalhadas | essas informações devem conter cliente, número de demandas, petição modelo, atividade, andamento, prazo e responsável. |
| **RF02** | Funcional | Editar demandas | Deve ser possível atualizar informações como cliente, número de demandas, petição modelo, atividade, andamento, prazo e responsável. |
| **RF03** | Funcional | Atribuir atividades | o sistema deve ser possível atribuir atividades a pessoas específicas. |
| **RF04** | Funcional | Transferir responsabilidade das atividades | o sistema deve ser possível transferir a responsabilidade de uma atividade para outra pessoa. |
| **RF05** | Funcional | Exibir todas as atribuições do estagiário | o sistema deve ter as atribuições do estagiário, mostrando as atividades a serem feitas. |
| **RF06** | Funcional | Mostrar detalhes das atividades | o sistema deve apresentar todos os detalhes de demandas como cliente, número de demandas, petição modelo, atividade, andamento, prazo e responsável. |

---

## Cadastro e Login

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF07** | Funcional | cadastrar novos estagiários e sócios | O usuário de nível “Sócio” deve ser capaz de clicar em um botão para cadastrar novos estagiários e sócios.

---

## Tarefa: Workflow Visual (Kanban)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF08** | Funcional | Atualizar demandas kanban | o sistema deve permitir alterar detalhes das demandas. |
| **RF09** | Funcional | Criar/Adicionar Demanda | O sistema deve permitir a criação de um novo cartão (demanda) no quadro Kanban, informando no mínimo um título e a coluna inicial. |
| **RF10** | Funcional | Editar Detalhes da Demanda | O sistema deve permitir a edição dos detalhes de um cartão existente, como título, descrição, responsável, data de entrega, etc. |
| **RF11** | Funcional | Mover Demanda entre Colunas | O sistema deve permitir que o usuário mova um cartão entre as colunas do quadro para refletir o avanço da demanda no fluxo de trabalho (ex: "arrastar e soltar"). |
| **RF12** | Funcional | Retirar Demanda | O sistema deve permitir excluir um cartão que não é mais necessário ou foi concluído há muito tempo, removendo-o da visualização principal do quadro.. |
| **RF13** | Funcional | Solicitar revisão de atividade | o sistema deve ser possível pedir para ter uma revisão de uma atividade. |
| **RF14** | Funcional | Exibir etapas dos demandas em quadro Kanban | o sistema deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |
| **RF15** | Funcional | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban. |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF16** | Funcional | Iniciar importação e fazer upload de arquivo | O sistema deve ser capaz de fazer upload dos arquivos de planilhas (csv, xlsx) e importar a planilha. | 
| **RF17** | Funcional | Mapear colunas da planilha (De-Para) | O sistema deve apresentar como os quadros ficaram dispostos a partir da planilha, nomodelo “De-Para”. |
| **RF18** | Funcional | Destacar erros na pré-visualização | Durante a pré-visualização dos quadros Kanban, o sistema deve apresentar quais erros são indicados prestar maior atenção. |
| **RF19** | Funcional | Validar dados e exibir pré-visualização | O sistema deve conseguir apresentar quais dados estão válidos para importação, e apresentar como eles ficaram dispostos nos quadros Kanban. |
| **RF20** | Funcional | Executar importação em lote | O usuário pode escolher quantas planilhas quer importar por vez, desde que atenda aos requisitos de importação. |
| **RF21** | Funcional | Apresentar relatório de conclusão | Apóes concluir a importação de planilha, deve apresentar quantas fora importadas com sucesso, quais tiveram erros e quais erros foram enfrentados durante a importação. | 

---

## Tarefa: Repositório Pesquisável de Modelos e Cláusulas

| ID | Tipo | Nome | Descrição |
| :--- | :--- | :--- | :--- |
| **RF22** | Funcional | Armazenar e pesquisar templates e cláusulas | O sistema deve permitir ao usuário salvar, categorizar e pesquisar modelos e cláusulas por tags ou palavras-chave, criando uma base de conhecimento unificada. |
| **RF23** | Funcional | Versionar templates/cláusulas | O sistema deve registrar o histórico de alterações, incluindo o autor e a data de cada modificação na cláusula ou template, permitindo restaurar versões anteriores. |
| **RF24** | Funcional | Inserir trechos de templates/cláusulas em minutas. | O sistema deve permitir ao usuário selecionar e injetar automaticamente o texto de uma cláusula pesquisada em um editor de texto ou campo de documento. |

---

## Mensagem automática

| ID | Tipo | Nome |Descrição |
| :--- | :--- | :--- | :--- |
| **RF25** | Funcional | Gerenciar Dados do Cliente para Notificação | O sistema deve incluir uma interface e persistência no banco de dados para armazenar o número de WhatsApp do cliente e um status de consentimento ou opção de opt-out para receber as notificações automáticas do sistema, garantindo a conformidade. |
| **RF26** | Funcional | Gerenciar Templates de Mensagem (WhatsApp) | O sistema deve fornecer uma interface para o Sócio criar, editar e aprovar modelos de mensagem padronizados (templates). Estes templates devem ser configurados com placeholders (variáveis) para serem preenchidos dinamicamente com dados das demandas. |
| **RF27** | Funcional | Configurar Gatilho de Notificação Automática | O sistema deve permitir ao Sócio definir eventos (gatilhos) que automaticamente disparam o envio das notificações. Exemplos de gatilhos: "Mudança de Status" (ex.: Sendo Revisado), "Proximidade de Prazo" ou "Nova Atribuição". |
| **RF28** | Funcional | Enviar Notificação via WhatsApp na Conclusão | O sistema deve ser capaz de disparar a mensagem padronizada (usando o template e preenchendo as variáveis) para o contato do cliente ou responsável, utilizando a API oficial do WhatsApp Business, sendo acionado por um gatilho configurado no sistema. | 
| **RF29** | Funcional | Gerar relatório filtrável e exportável | Gerar relatório de acompanhamento de clientes. |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Nome |Descrição |
| :--- | :--- | :--- | :--- |
| **RF30** | Funcional | Exibir painel de indicadores (Dashboard) | Apresentar a tela principal centralizada que serve como contêiner para todos os indicadores. |
| **RF31** | Funcional | indicador - Demandas por Status | Calcular e exibir o volume total de demandas e a distribuição atual em cada Status do Kanban. |
| **RF32** | Funcional | indicador - Desempenho de Prazos (% On-time) | Calcular e exibir o percentual de demandas concluídos no prazo para medir a eficiência. |
| **RF33** | Funcional | indicador - Tempo Médio de Resolução (TMR) | Calcular e exibir o tempo médio total (em dias) que as demandas levam desde a sua data de criação até a sua conclusão. |
| **RF34** | Funcional | indicador - Prazos Críticos |  Destacar o número de demandas cujo prazo final se encerra nos próximos 4 dias. |
| **RF35** | Funcional | indicador - Tempo até Primeira Ação (TTA) | Calcular e exibir o tempo médio que uma nova demanda leva para ter sua primeira atividade registrada. |
| **RF36** | Funcional | indicador - Taxa de Retrabalho | Calcular e exibir a porcentagem de demandas que retornam para uma etapa anterior no fluxo. |
| **RF37** | Funcional | indicador - Tempo Médio de Atraso | Calcular e exibir a média (em dias) que as demandas finalizadas ultrapassaram o prazo original. |
| **RF38** | Funcional | Gerar relatório filtrável e exportável | Permitir ao usuário gerar relatórios com filtros e funcionalidade de exportação para PDF ou CSV. |
