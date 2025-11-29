# Declaração de MVP
## Sistema de Gestão de Demandas

---

## 1. Objetivos do MVP

### 1.1 - Objetivo Principal
Validar que escritórios de advocacia conseguem gerenciar demandas de forma colaborativa, com controle de prazos e responsabilidades, reduzindo em até 50% o tempo gasto na coordenação de atividades entre sócios e estagiários.

### 1.2 - Objetivos Específicos
- OE1 (Facilitar a visualização das demandas internas, assegurando uma divisão clara entre pendentes, em andamento, enviadas para revisão e concluídas.)
- OE2 (Reduzir a sobrecarga do sócio na atribuição de demandas, permitindo que o fluxo seja distribuído de forma mais ágil e organizada.)
- OE3 (Minimizar riscos de falhas no cumprimento de prazos processuais, garantindo maior confiabilidade no acompanhamento.)

### 1.3 - Critérios de Sucesso
-  100% das demandas contêm todas as informações obrigatórias
-  Tempo de atribuição/transferência de demanda rápida
-  Taxa de adoção pelos estagiários no 1ª mês
-  Zero demandas sem responsável atribuído
-  Redução de perguntas sobre responsabilidades

---

## 3. Escopo do MVP

### 3.1 - Funcionalidades Incluídas 

| Objetivos Específicos | Prioridade | ID | Funcionalidade | Descrição |
|----------------------|-----------|----|----------------|-----------|
| OE1 | MUST | RF01 | Cadastrar demanda | Cadastro com atividade, andamento, prazo e responsável |
| OE1 | MUST | RF02 | Editar demanda | Atualizar informações da demanda |
| OE2 | MUST | RF03 | Atribuir demandas | Vincular demandas a pessoas específicas |
| OE2 | MUST | RF04 | Restrição de acesso | Controle por cargo: Sócio (visão total) e Estagiário (apenas suas atribuições) |
| OE2 | MUST | RF05 | Transferir responsabilidade | Reatribuir demandas entre pessoas |
| OE1 | MUST | RF07 | Visualizar detalhes | Exibir informações completas da demanda |
| OE3 | MUST | RF08 | Cadastrar usuários | Sócio cadastra novos estagiários e sócios |
| OE1 | MUST | RF09 | Atualizar no Kanban | Alterar detalhes diretamente no quadro |
| OE1 | MUST | RF11 | Mover demanda entre Colunas | O sistema deve permitir que o usuário mova um cartão entre as colunas do quadro para refletir o avanço da demanda no fluxo de trabalho (ex: "arrastar e soltar"). |
| OE1 | MUST | RF12 | Kanban com etapas | Colunas configuráveis (Elaboração → Revisão → Pendente Cliente → Concluída) |
| OE1 | MUST | RF14 | Exibir etapas das demandas em quadro Kanban | O sistema deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. |
| OE1 | SHOULD | RF06 | Dashboard do estagiário | Visualização de todas as atribuições do estagiário |
| OE1 | SHOULD | RF10 | Criar demanda no Kanban | Adicionar demanda direto do quadro |
| OE1 | COULD | RF13 | Solicitar revisão de demanda | O sistema deve ser possível pedir para ter uma revisão de uma demanda. |
| OE1 | COULD | RF15 | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban. |

### 3.2 - Funcionalidades Excluídas
- Funcionalidades de automação de mensagem
- Importador de planilhas
- Dashboard de indicadores
- Repositório de cláusulas

![Tabela MVP](./imagens/Esforco_Impacto.png)