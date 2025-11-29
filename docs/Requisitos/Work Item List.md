# Work Item List

## 1 Critérios de priorização (e sua aplicação): valor de negócio x avaliação técnica

### 1.1 - Níveis de valor de negócio

- **MUST**: são absolutamente essenciais para que o produto funcione minimamente, resolva o problema central de visibilidade do fluxo de trabalho e atenda aos requisitos críticos de segurança e confiabilidade de um ambiente jurídico.

- **SHOULD**: são muito importantes, trazem alto valor agregado ao usuário e melhoram drasticamente a eficiência e a qualidade dos dados, mas existe um contorno (workaround) manual e temporário que o usuário pode executar no MVP.

- **COULD**: são desejáveis (nice-to-have), melhoram a experiência do usuário e a governança a longo prazo, mas não são cruciais para resolver o problema central do fluxo de trabalho. Sua ausência não impede o uso do MVP.

- **WONT**: estão fora do escopo do MVP por enquanto, porque seu custo de implementação é proibitivo em relação ao valor que entregam nesta primeira versão, ou porque a funcionalidade já está coberta por um requisito Must Have mais simples.

### 1.2 - Níveis de Complexidade

| **Nível de Complexidade** | **Descrição (Custo de Trabalho)** |
|----------------------------|----------------------------------|
| **1 - Baixa** | O esforço de trabalho é mínimo. A implementação é direta e não requer decisões complexas ou coordenação externa. |
| **2 - Média** | O esforço de trabalho é padrão para uma funcionalidade (alguns dias, dentro de um micro-incremento ou parte de um Work Item). O caminho de implementação é bem compreendido. |
| **3 - Alta** | O esforço é significativo (vários dias ou mais de uma semana). Requer coordenação entre diferentes desenvolvedores ou papéis (como Analista e Arquiteto). Pode envolver integração com sistemas legados ou de terceiros (Requisitos de Interface). |
| **4 - Proibitiva** | O esforço é extremamente grande, podendo consumir a maior parte de uma iteração. Envolve alta incerteza técnica, exige mudanças arquiteturais significativas, ou requer aquisição de novo conhecimento/tecnologia. |

## 2 Work Item List

| Cód | Nome (Caso de Uso) | Prio | Descrição (Objetivo, Ator, Objeto Gerado) | Rastreio (RF) | Ator Primário |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **UC-01** | Autenticar Usuário | MUST | **Objetivo:** Validar credenciais e liberar acesso.<br>**Ator:** Qualquer Usuário.<br>**Objeto Gerado:** Token de sessão (JWT) + Contexto de Segurança. | | Todos |
| **UC-02** | Cadastrar Usuário | MUST | **Objetivo:** Registrar novo colaborador.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Registro de Usuário com Role. | | Sócio |
| **UC-03** | Registrar Demanda | MUST | **Objetivo:** Criar nova solicitação no sistema.<br>**Ator:** Sócio/Estagiário.<br>**Objeto Gerado:** Registro da Demanda com ID único e status “Backlog”. | | Sócio, Estagiário |
| **UC-04** | Atribuir Responsável | MUST | **Objetivo:** Delegar a demanda a um colaborador.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Associação Demanda → Usuário. | | Sócio |
| **UC-05** | Consultar Fila de Trabalho | MUST | **Objetivo:** Recuperar tarefas para execução imediata.<br>**Ator:** Estagiário.<br>**Objeto Gerado:** Lista de Pendências filtrada pelo usuário logado. | | Estagiário |
| **UC-06** | Editar Dados da Demanda | MUST | **Objetivo:** Atualizar descrição, prazo e demais atributos.<br>**Ator:** Responsável.<br>**Objeto Gerado:** Histórico atualizado (Log de Alterações). | | Estagiário |
| **UC-07** | Mapear Status do Fluxo | MUST | **Objetivo:** Consolidar visão geral para o Kanban.<br>**Ator:** Sócio/Estagiário.<br>**Objeto Gerado:** Matriz de Demandas agrupadas por etapas. | | Todos |
| **UC-08** | Tramitar Demanda (Mover) | MUST | **Objetivo:** Avançar demanda para próxima etapa lógica.<br>**Ator:** Todos.<br>**Objeto Gerado:** Novo Status + Registro de Movimentação. | | Todos |
| **UC-09** | Configurar Etapas do Fluxo | MUST | **Objetivo:** Definir estrutura do processo jurídico.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Metadados de Colunas do Kanban. | | Sócio |
| **UC-10** | Cadastrar Modelo Jurídico | COULD | **Objetivo:** Preservar conhecimento para reuso.<br>**Ator:** Todos.<br>**Objeto Gerado:** Template/Cláusula indexada. | | Todos |
| **UC-11** | Recuperar Modelo de Cláusula | COULD | **Objetivo:** Obter texto padrão para documento.<br>**Ator:** Todos.<br>**Objeto Gerado:** Texto do Template carregado no editor/clipboard. | | Todos |
| **UC-12** | Efetuar Upload de Planilha | SHOULD | **Objetivo:** Transferir dados legados para servidor.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Arquivo armazenado e validado. | | Sócio |
| **UC-13** | Processar Carga de Dados | SHOULD | **Objetivo:** Converter planilha em registros.<br>**Ator:** Sistema.<br>**Objeto Gerado:** Lote de Demandas inseridas. | | Sistema |
| **UC-14** | Definir Template de Mensagem | SHOULD | **Objetivo:** Padronizar comunicação.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Modelo com variáveis dinâmicas. | | Sócio |
| **UC-15** | Disparar Notificação | SHOULD | **Objetivo:** Realizar comunicação automática.<br>**Ator:** Sistema.<br>**Objeto Gerado:** Mensagem enviada + Log de Envio. | | Sistema |
| **UC-16** | Gerar Relatório Gerencial | SHOULD | **Objetivo:** Extrair métricas.<br>**Ator:** Sócio.<br>**Objeto Gerado:** Dataset/Arquivo de Indicadores. | | Sócio |