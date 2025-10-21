# Declaração de MVP
## Sistema de Gestão de Processos Jurídicos

---


## 1. Objetivos do MVP

### 1.1 - Objetivo Principal
Validar que escritórios de advocacia conseguem gerenciar processos jurídicos de forma colaborativa, com controle de prazos e responsabilidades, reduzindo em até 50% o tempo gasto na coordenação de atividades entre sócios e estagiários.

### 1.2 - Objetivos Específicos
- OE1 (Facilitar a visualização das demandas internas, assegurando uma divisão clara entre pendentes, em andamento, enviadas para revisão e concluídas.)
- OE2 (Reduzir a sobrecarga do sócio na atribuição de tarefas, permitindo que o fluxo de demandas seja distribuído de forma mais ágil e organizada.)
- OE3 (Minimizar riscos de falhas no cumprimento de prazos processuais, garantindo maior confiabilidade no acompanhamento.)

### 1.3 - Critérios de Sucesso
-  100% dos processos contêm todas as informações obrigatórias
-  Tempo de atribuição/transferência de atividade rápida
-  Taxa de adoção pelos estagiários no 1ª mês
-  Zero processos sem responsável atribuído
-  Redução de perguntas sobre responsabilidades

---

## 2. critérios de priorização (e sua aplicação): valor de negócio x avaliação técnica

- **MUST**: são absolutamente essenciais para que o produto funcione minimamente, resolva o problema central de visibilidade do fluxo de trabalho e atenda aos requisitos críticos de segurança e confiabilidade de um ambiente jurídico.

- **SHOULD**: são muito importantes, trazem alto valor agregado ao usuário e melhoram drasticamente a eficiência e a qualidade dos dados, mas existe um contorno (workaround) manual e temporário que o usuário pode executar no MVP.

- **COULD**: são desejáveis (nice-to-have), melhoram a experiência do usuário e a governança a longo prazo, mas não são cruciais para resolver o problema central do fluxo de trabalho. Sua ausência não impede o uso do MVP.

- **WONT**: estão fora do escopo do MVP por enquanto, porque seu custo de implementação é proibitivo em relação ao valor que entregam nesta primeira versão, ou porque a funcionalidade já está coberta por um requisito Must Have mais simples.

### 2.1 - Níveis de Complexidade

| **Nível de Complexidade** | **Descrição (Custo de Trabalho)** |
|----------------------------|----------------------------------|
| **1 - Baixa** | O esforço de trabalho é mínimo. A implementação é direta e não requer decisões complexas ou coordenação externa. |
| **2 - Média** | O esforço de trabalho é padrão para uma funcionalidade (alguns dias, dentro de um micro-incremento ou parte de um Work Item). O caminho de implementação é bem compreendido. |
| **3 - Alta** | O esforço é significativo (vários dias ou mais de uma semana). Requer coordenação entre diferentes desenvolvedores ou papéis (como Analista e Arquiteto). Pode envolver integração com sistemas legados ou de terceiros (Requisitos de Interface). |
| **4 - Proibitiva** | O esforço é extremamente grande, podendo consumir a maior parte de uma iteração. Envolve alta incerteza técnica, exige mudanças arquiteturais significativas, ou requer aquisição de novo conhecimento/tecnologia. |

---

## 3. Escopo do MVP

### 3.1 - Funcionalidades Incluídas

| Objetivos Específicos | Prioridade | ID | Funcionalidade | Descrição |
|----------------------|-----------|----|----------------|-----------|
| OE1 | MUST | RF01 | Cadastrar processo | Cadastro com cliente, número, petição modelo, atividade, andamento, prazo e responsável |
| OE1 | MUST | RF02 | Editar processo | Atualizar informações do processo |
| OE2 | MUST | RF03 | Atribuir atividades | Vincular tarefas a pessoas específicas |
| OE2 | MUST | RF04 | Restrição de acesso | Controle por cargo: Sócio (visão total) e Estagiário (apenas suas atribuições) |
| OE2 | MUST | RF05 | Transferir responsabilidade | Reatribuir atividades entre pessoas |
| OE1 | MUST | RF07 | Visualizar detalhes | Exibir informações completas do processo |
| OE3 | MUST | RF08 | Cadastrar usuários | Sócio cadastra novos estagiários e sócios |
| OE1 | MUST | RF09 | Atualizar no Kanban | Alterar detalhes diretamente no quadro |
| OE1 | MUST | RF11 | Funcional | Mover demanda entre Colunas | O sistema deve permitir que o usuário mova um cartão entre as colunas do quadro para refletir o avanço da demanda no fluxo de trabalho (ex: "arrastar e soltar"). |
| OE1 | MUST | RF12 | Kanban com etapas | Colunas configuráveis (Elaboração → Revisão → Pendente Cliente → Concluída) |
| OE1 | MUST | RF14 | Funcional | Exibir etapas das demandas em quadro Kanban | O sistema deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |
| OE1 | SHOULD | RF06 | Dashboard do estagiário | Visualização de todas as atribuições do estagiário |
| OE1 | SHOULD | RF10 | Criar processo no Kanban | Adicionar processo direto do quadro |
| OE1 | COULD | RF13 | Funcional | Solicitar revisão de demanda | O sistema deve ser possível pedir para ter uma revisão de uma demanda. |
| OE1 | COULD | RF15 | Funcional | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban. |

### 3.2 - Funcionalidades Excluídas
- Funcionalidades de automação de mensagem
- Importador de planilhas
- Dashboard de indicadores
- Repositório de cláusulas

![Tabela MVP](./imagens/Esforco_Impacto.png)

---

## 4. Framework de Desenvolvimento

### 4.1 - Regras do Kanban para a Produção do MVP

O Kanban é utilizado para garantir que o trabalho flua de forma contínua e previsível, alinhado com o ciclo de vida Iterativo e Incremental do OpenUP.


### 4.2 - Políticas do Board de Desenvolvimento do projeto no processo OpenUP

O quadro Kanban está estruturado com colunas que representam as etapas do fluxo de trabalho, desde a preparação até a conclusão.

| **Coluna** | **Descrição** | **Regras e Propósito** |
|-------------|----------------|-------------------------|
| **WORK ITEM LIST** | Contém os requisitos (RF-01 a RF-12) que foram refinados e estão prontos para implementação. | É a fonte de trabalho priorizada para o time. |
| **TO DO** | Lista de Work items priorizados especificamente para a sprint atual. | O trabalho é puxado desta coluna para a implementação. |
| **IN PROGRESS** | Fase de desenvolvimento ativo. | Sujeito ao Limite WIP (máximo 3). |
| **REVIEW** | Fase de Code review e testes de aceitação. | Sujeito ao Limite WIP (máximo 2) para evitar gargalos na validação. |
| **DONE** | Funcionalidade que está completa, testada e validada. | Atende integralmente à Definição de Pronto (DoD). |


### 4.3 - Limites de Trabalho em Andamento (WIP Limits)

Os limites de WIP (Work in Progress Limits) são cruciais para a filosofia Kanban, pois evitam o acúmulo de trabalho e garantem o foco na conclusão.

- **IN PROGRESS:** Máximo de 3 itens. Este limite foi definido como 0.5 vezes o número de desenvolvedores na equipe, a fim de permitir o pareamento do time de desenvolvimento, quando possível.  
- **REVIEW:** Máximo de 2 itens. Este limite é aplicado para evitar o gargalo no processo de validação, permitindo ao responsável por cada frente operacional consiga validar o produto de software, e produtos de documentação, no caso do responsável pelos requisitos.


### 4.4 - Sistema Puxado (Pull System) e Priorização

O sistema é baseado na capacidade da equipe (sistema puxado), garantindo a eficiência:

- **Regra de Puxada:** Os desenvolvedores só podem puxar novos work items para a coluna **IN PROGRESS** quando concluem a tarefa anterior.  
- **Prioridade:** O trabalho é priorizado rigidamente seguindo os critérios de valor de negócio, que são: **MUST > SHOULD**. Os itens MUST são absolutamente essenciais para resolver o problema central de visibilidade do fluxo de trabalho e atender aos requisitos críticos de segurança.


### 4.5 - Métricas de Acompanhamento

As seguintes métricas Kanban serão utilizadas para monitorar a eficiência do processo:

- **Lead Time:** Tempo total desde que um item entra na **WORK ITEM LIST** até ser considerado **Done**.  
- **Cycle Time:** Tempo desde que um item entra na coluna **To Do** até ser concluído.  
- **Throughput:** Quantidade de Work items que são concluídos por semana.  
- **Bloqueios:** A quantidade e o tempo que os itens permanecem bloqueados.

