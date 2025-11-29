## 6 CRONOGRAMA E ENTREGAS

## 6.1 Cronograma 

A partir da estratégia de desenvolvimento de software estabelecida, tem-se a seguinte proposta de cronograma, suas fases e resultados esperados:

| Semanas | Data Início | Data Fim | Fase do OpenUP | Objetivo do Ciclo | Entregas Previstas | Validação do Cliente |
| --- | --- | --- | --- | --- | --- | --- |
| Semana 0 | 01/09 | 07/09 | Concepção | Definir problema | Ata de reunião com cliente | Aprovação do problema. |
| Semana 1 | 08/09 | 14/09 | Elaboração | Definição dos Incrementos; Alteração do problema de acordo com a revisão do professor | Estrutura inicial do projeto; Configuração da arquitetura (Arquitetura de Três Camadas (MVC)); | Detalhamento do problema e validação de objetivos do produto. |
| Semana 2 | 15/09 | 21/09 | Elaboração | Planejamento do Projeto; Levantamento de requisitos iniciais e principais regras de negócio; Iniciar protótipo de baixa fidelidade; | Template inicial do sistema do website configurado; Backlog do produto; Cronograma detalhado. | Protótipo de baixa fidelidade; | Elaboração |
| Semana 3 | 22/09 | 28/09 | Elaboração | Definição de responsáveis (OE2) | Definir líderes e responsáveis; | Líderes definidos |
| Semana 4 | 29/09 | 05/10 | Elaboração | Definir requisitos funcionais (OE2, OE3) | Elaboração dos requisitos funcionais iniciais; Finalizar protótipo de baixa fidelidade; | Protótipo de alta fidelidade |
| Semana 5 | 06/10 | 12/10 | Elaboração | Definir requisitos não funcionais (OE1) | Elaboração de requisitos não funcionais | Feedback com o cliente sobre os requisitos não funcionais do projeto |
| Semana 6 | 13/10 | 19/10 | Elaboração | Refinamento de requisitos e revisão de MVP com professor (OE3) | Finalização da elaboração do MVP completo | Validação da estrutura do MVP com professor e cliente |
| Semana 7 | 20/10 | 26/10 | Construção | Implementar Fundação e Controle de Acesso (OE5) | Estabelecer a base de usuários, permissões e a visualização principal do Kanban | Sistema de cadastro de usuários (Sócio/Estagiário) (RF08); Login funcional com restrição de acesso (RF04); Estrutura visual do Kanban com colunas (RF12) |
| Semana 8 | 27/10 | 02/11 | Construção | Implementar Gerenciamento de Processos (Core) | Permitir a criação e gerenciamento do objeto de dados principal (o processo) | Formulários para cadastrar (RF01) e editar (RF02) processos; Os processos criados aparecem no Kanban (RF12); Visualização de detalhes (RF07) |
| Semana 9 | 03/11 | 09/11 | Construção | Implementar Fluxo de Trabalho e Colaboração | Habilitar o fluxo de trabalho colaborativo e a movimentação de tarefas (OE1, OE2) | Funcionalidade para atribuir (RF03) e transferir (RF05) um responsável; Interação de arrastar e soltar (drag-and-drop) para atualizar o status no Kanban (RF09) |
| Semana 10 | 10/11 | 16/11 | Construção | Implementar Refinamentos (Should Haves) e Estabilização | Refinar a usabilidade e a experiência do estagiário (OE1); Estabilizar "Must Haves". | Implementação do "Dashboard do estagiário" (RF06); Adicionar processo diretamente pelo quadro Kanban (RF10); Correção de bugs e aumento da cobertura de testes. |
| Semana 11 | 17/11 | 23/11 | Transição | Homologação do MVP com o cliente. | Homologação do MVP (Must + Should). Feedback final da equipe | Sistema integrado (painel, fluxo, dashboard); Feedback final da equipe de desenvolvimento; Sistema preparado para testes de aceitação |
| Semana 12 | 24/11 | 02/12 | Transição | Ajustes Finais e Treinamento. | Ajustes pós-homologação e preparação para entrega. | Feedback do sócio e validação em uso real. |

O cronograma acima poderá sofrer alterações ao longo do desenvolvimento do projeto do LegisPro.

## 6.2 Framework de Desenvolvimento

### 6.2.1 - Regras do Kanban para a Produção do MVP

O Kanban é utilizado para garantir que o trabalho flua de forma contínua e previsível, alinhado com o ciclo de vida Iterativo e Incremental do OpenUP.


### 6.2.2 - Políticas do Board de Desenvolvimento do projeto no processo OpenUP

O quadro Kanban está estruturado com colunas que representam as etapas do fluxo de trabalho, desde a preparação até a conclusão.

| **Coluna** | **Descrição** | **Regras e Propósito** |
|-------------|----------------|-------------------------|
| **WORK ITEM LIST** | Contém os requisitos (RF-01 a RF-12) que foram refinados e estão prontos para implementação. | É a fonte de trabalho priorizada para o time. |
| **TO DO** | Lista de Work items priorizados especificamente para a sprint atual. | O trabalho é puxado desta coluna para a implementação. |
| **IN PROGRESS** | Fase de desenvolvimento ativo. | Sujeito ao Limite WIP (máximo 3). |
| **REVIEW** | Fase de Code review e testes de aceitação. | Sujeito ao Limite WIP (máximo 2) para evitar gargalos na validação. |
| **DONE** | Funcionalidade que está completa, testada e validada. | Atende integralmente à Definição de Pronto (DoD). |


### 6.2.3 - Limites de Trabalho em Andamento (WIP Limits)

Os limites de WIP (Work in Progress Limits) são cruciais para a filosofia Kanban, pois evitam o acúmulo de trabalho e garantem o foco na conclusão.

- **IN PROGRESS:** Máximo de 3 itens. Este limite foi definido como 0.5 vezes o número de desenvolvedores na equipe, a fim de permitir o pareamento do time de desenvolvimento, quando possível.  
- **REVIEW:** Máximo de 2 itens. Este limite é aplicado para evitar o gargalo no processo de validação, permitindo ao responsável por cada frente operacional consiga validar o produto de software, e produtos de documentação, no caso do responsável pelos requisitos.


### 6.2.4 - Sistema Puxado (Pull System) e Priorização

O sistema é baseado na capacidade da equipe (sistema puxado), garantindo a eficiência:

- **Regra de Puxada:** Os desenvolvedores só podem puxar novos work items para a coluna **IN PROGRESS** quando concluem a tarefa anterior.  
- **Prioridade:** O trabalho é priorizado rigidamente seguindo os critérios de valor de negócio, que são: **MUST > SHOULD**. Os itens MUST são absolutamente essenciais para resolver o problema central de visibilidade do fluxo de trabalho e atender aos requisitos críticos de segurança.


### 6.2.5 - Métricas de Acompanhamento

As seguintes métricas Kanban serão utilizadas para monitorar a eficiência do processo:

- **Lead Time:** Tempo total desde que um item entra na **WORK ITEM LIST** até ser considerado **Done**.  
- **Cycle Time:** Tempo desde que um item entra na coluna **To Do** até ser concluído.  
- **Throughput:** Quantidade de Work items que são concluídos por semana.  
- **Bloqueios:** A quantidade e o tempo que os itens permanecem bloqueados.