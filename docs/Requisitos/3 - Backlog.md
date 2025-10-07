# Backlog

## Critérios de priorização (e sua aplicação): valor de negócio x avaliação técnica

- **MUST**: são absolutamente essenciais para que o produto funcione minimamente, resolva o problema central de visibilidade do fluxo de trabalho e atenda aos requisitos críticos de segurança e confiabilidade de um ambiente jurídico.

- **SHOULD**: são muito importantes, trazem alto valor agregado ao usuário e melhoram drasticamente a eficiência e a qualidade dos dados, mas existe um contorno (workaround) manual e temporário que o usuário pode executar no MVP.

- **COULD**: são desejáveis (nice-to-have), melhoram a experiência do usuário e a governança a longo prazo, mas não são cruciais para resolver o problema central do fluxo de trabalho. Sua ausência não impede o uso do MVP.

- **WONT**: estão fora do escopo do MVP por enquanto, porque seu custo de implementação é proibitivo em relação ao valor que entregam nesta primeira versão, ou porque a funcionalidade já está coberta por um requisito Must Have mais simples.

## Tarefa: Gestão de Processos / Demandas

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF01** | Funcional | Must | Cadastrar processo com informações detalhadas | essas informações devem conter cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |
| **RF02** | Funcional | Must | Editar processo | deve ser possível atualizar informações como cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |
| **RF03** | Funcional | Must | Atribuir atividades | o sistema deve ser possível atribuir atividades a pessoas específicas. |
| **Rf04** | Funcional | Must | Restriçao de acesso | o sistema deve ter restrições de acesso com relação ao cargo da pessoa. |
| **RF05** | Funcional | Must | Transferir responsabilidade das atividades | o sistema deve ser possível transferir a responsabilidade de uma atividade para outra pessoa. |
| **RF06** | Funcional | Should | Exibir todas as atribuições do estagiário | o sistema deve ter as atribuições do estagiário, mostrando as atividades a serem feitas. |
| **RF07** | Funcional | Must | Mostrar detalhes das atividades | o sistema deve apresentar todos os detalhes do processo como cliente, número do processo, petição modelo, atividade, andamento, prazo e responsável. |

---

## Cadastro e Login

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF08** | Funcional | Must | cadastrar novos estagiários e sócios | O usuário de nível “Sócio” deve ser capaz de clicar em um botão para cadastrar novos estagiários e sócios.

---

## Tarefa: Workflow Visual (Kanban)

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF09** | Funcional | Must | Atualizar processo kanban | o sistema deve permitir alterar detalhes do processo. |
| **RF10** | Funcional | Should | Área de criação de processos no quadro kanban | o sistema deve permitir adicionar detalhes do processo. |
| **RF11** | Funcional | Could | Solicitar revisão de atividade | o sistema deve ser possível pedir para ter uma revisão de uma atividade. |
| **RF12** | Funcional | Must | Exibir etapas dos processos em quadro Kanban | o sistema deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |
| **RF13** | Funcional | Could | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban. |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF14** | Funcional | Should | Iniciar importação e fazer upload de arquivo | O sistema deve ser capaz de fazer upload dos arquivos de planilhas (csv, xlsx) e importar a planilha. | 
| **RF15** | Funcional | Should | Mapear colunas da planilha (De-Para) | O sistema deve apresentar como os quadros ficaram dispostos a partir da planilha, nomodelo “De-Para”. |
| **RF16** | Funcional | Should | Destacar erros na pré-visualização | Durante a pré-visualização dos quadros Kanban, o sistema deve apresentar quais erros são indicados prestar maior atenção. |
| **RF17** | Funcional | Should | Validar dados e exibir pré-visualização | O sistema deve conseguir apresentar quais dados estão válidos para importação, e apresentar como eles ficaram dispostos nos quadros Kanban. |
| **RF18** | Funcional | Should | Executar importação em lote | O usuário pode escolher quantas planilhas quer importar por vez, desde que atenda aos requisitos de importação. |
| **RF19** | Funcional | Should | Apresentar relatório de conclusão | Apóes concluir a importação de planilha, deve apresentar quantas fora importadas com sucesso, quais tiveram erros e quais erros foram enfrentados durante a importação. | 

---

## Tarefa: Repositório Pesquisável de Modelos e Cláusulas

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF20** | Funcional | Could | Armazenar e pesquisar templates e cláusulas | O sistema deve permitir ao usuário salvar, categorizar e pesquisar modelos e cláusulas por tags ou palavras-chave, criando uma base de conhecimento unificada. |
| **RF21** | Funcional | Could | Versionar templates/cláusulas | O sistema deve registrar o histórico de alterações, incluindo o autor e a data de cada modificação na cláusula ou template, permitindo restaurar versões anteriores. |
| **RF22** | Funcional | Could | Inserir trechos de templates/cláusulas em minutas. | O sistema deve permitir ao usuário selecionar e injetar automaticamente o texto de uma cláusula pesquisada em um editor de texto ou campo de documento. |

---

## Mensagem automática

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF23** | Funcional | Should | Gerenciar Dados do Cliente para Notificação | O sistema deve incluir uma interface e persistência no banco de dados para armazenar o número de WhatsApp do cliente e um status de consentimento ou opção de opt-out para receber as notificações automáticas do sistema, garantindo a conformidade. |
| **RF24** | Funcional | Should | Gerenciar Templates de Mensagem (WhatsApp) | O sistema deve fornecer uma interface para o Sócio criar, editar e aprovar modelos de mensagem padronizados (templates). Estes templates devem ser configurados com placeholders (variáveis) para serem preenchidos dinamicamente com dados do processo. |
| **RF25** | Funcional | Should | Configurar Gatilho de Notificação Automática | O sistema deve permitir ao Sócio definir eventos (gatilhos) que automaticamente disparam o envio das notificações. Exemplos de gatilhos: "Mudança de Status" (ex.: Sendo Revisado), "Proximidade de Prazo" ou "Nova Atribuição". |
| **RF26** | Funcional | Should | Enviar Notificação via WhatsApp na Conclusão | O sistema deve ser capaz de disparar a mensagem padronizada (usando o template e preenchendo as variáveis) para o contato do cliente ou responsável, utilizando a API oficial do WhatsApp Business, sendo acionado por um gatilho configurado no sistema. | 
| **RF27** | Funcional | Should | Gerar relatório filtrável e exportável | Gerar relatório de acompanhamento de clientes. |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Priorização| Nome | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| **RF28** | Funcional | Should | Exibir painel de indicadores (Dashboard) | Apresentar a tela principal centralizada que serve como contêiner para todos os indicadores. |
| **RF29** | Funcional | Should | indicador - Processos por Status | Calcular e exibir o volume total de processos e a distribuição atual em cada Status do Kanban. |
| **RF30** | Funcional | Should | indicador - Desempenho de Prazos (% On-time) | Calcular e exibir o percentual de processos concluídos no prazo para medir a eficiência. |
| **RF31** | Funcional | Should | indicador - Tempo Médio de Resolução (TMR) | Calcular e exibir o tempo médio total (em dias) que os processos levam desde a sua data de criação até a sua conclusão. |
| **RF32** | Funcional | Should | indicador - Prazos Críticos |  Destacar o número de processos ativos cujo prazo final se encerra nos próximos 4 dias. |
| **RF33** | Funcional | Could | indicador - Tempo até Primeira Ação (TTA) | Calcular e exibir o tempo médio que um novo processo leva para ter sua primeira atividade registrada. |
| **RF34** | Funcional | Could | indicador - Taxa de Retrabalho | Calcular e exibir a porcentagem de processos que retornam para uma etapa anterior no fluxo. |
| **RF35** | Funcional | Could | indicador - Tempo Médio de Atraso | Calcular e exibir a média (em dias) que os processos finalizados ultrapassaram o prazo original. |
| **RF36** | Funcional | Should | Gerar relatório filtrável e exportável | Permitir ao usuário gerar relatórios com filtros e funcionalidade de exportação para PDF ou CSV. |
