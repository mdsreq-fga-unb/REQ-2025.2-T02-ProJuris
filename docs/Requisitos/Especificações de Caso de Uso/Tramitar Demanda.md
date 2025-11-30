
# UC-02 — Tramitar Demanda (Kanban)

## 1. Nome do Caso de Uso
**Tramitar Demanda (Kanban)**

## 1.1 Breve Descrição
Este caso de uso permite ao Sócio ou Estagiário alterar o estado de uma Demanda movendo seu cartão entre as colunas do quadro Kanban. A tramitação representa o avanço do trabalho jurídico, garantindo rastreabilidade, controle de progresso e registro de responsáveis pelas movimentações.

## 1.2 Atores
- **Ator Principal:** Sócio  
- **Atores Secundários:** Estagiário

---

# 2. Fluxo de Eventos

## 2.1 Fluxo Principal

1. O usuário (Sócio ou Estagiário) acessa o **quadro Kanban** do LegisPro.  
   → Possível desvio: [FA01 - Filtrar Demandas no Quadro](#fa01)

2. O sistema exibe as colunas do Kanban:  
   - **Backlog**  
   - **Em Análise**  
   - **Em Execução**  
   - **Em Revisão**  
   - **Concluída**

3. O sistema carrega os cartões das demandas conforme seu status atual. ([RNF05])

4. O usuário identifica a demanda que deseja tramitar.

5. O usuário seleciona e arrasta o cartão da demanda para outra coluna.

6. O sistema exibe um indicador visual de movimentação. ([RNF02])

7. O sistema valida se o usuário possui permissão para alterar o status da demanda.  
   → Possível exceção: [FE01 - Usuário Não Autorizado a Tramitar Demandas](#fe01)

8. O sistema valida se a transição entre as colunas é permitida conforme as regras do fluxo Kanban.  
   → Possível exceção: [FE02 - Transição de Status Inválida](#fe02)

9. O sistema registra a alteração de status, incluindo:  
   - Status anterior  
   - Novo status  
   - Data/hora  
   - Usuário responsável ([RN03])

10. O sistema atualiza visualmente o cartão na nova coluna.

11. O sistema verifica se a nova coluna exige obrigatoriamente dados complementares.  
    → Possível desvio: [FA02 - Solicitar Dados Complementares para Avançar Etapa](#fa02)

12. O sistema finaliza a operação e mantém o quadro atualizado.

13. O caso de uso é encerrado.

---

## 2.2 Fluxos Alternativos

### <a id="fa01"></a>FA01 — Filtrar Demandas no Quadro  
**Passo de origem:** 2.1.1

1. O usuário seleciona um filtro (por responsável, prioridade, prazo ou palavra-chave).  
2. O sistema aplica o filtro e exibe apenas os cartões relevantes.  
3. O fluxo retorna ao passo **2.1.4**.

---

### <a id="fa02"></a>FA02 — Solicitar Dados Complementares para Avançar Etapa  
**Passo de origem:** 2.1.11  
**Descrição:** Acontece quando o avanço para uma coluna exige metadados obrigatórios.

1. O sistema identifica que a coluna **Em Revisão** ou **Concluída** exige dados complementares.  
2. O sistema exibe um formulário modal solicitando as informações necessárias (ex: conclusão da análise, parecer, arquivos anexos).  
3. O usuário preenche os campos solicitados.  
4. O usuário confirma a operação clicando em **Salvar**.  
5. O sistema valida os dados inseridos.  
   → Possível exceção: [FE03 - Dados Complementares Inválidos](#fe03)  
6. O sistema associa os dados complementares à demanda.  
7. O fluxo retorna ao passo **2.1.12**.

---

## 2.3 Fluxos de Exceção

### <a id="fe01"></a>FE01 — Usuário Não Autorizado a Tramitar Demandas  
**Passo de origem:** 2.1.7

1. O sistema identifica que o usuário não possui permissão para mover o cartão.  
2. O sistema exibe a mensagem: **"Você não tem permissão para tramitar esta demanda."**  
3. O sistema impede a mudança de coluna e retorna o cartão à posição original.  
4. O sistema registra a tentativa em log de segurança. ([RNF01])  
5. O fluxo retorna ao passo **2.1.4**.

---

### <a id="fe02"></a>FE02 — Transição de Status Inválida  
**Passo de origem:** 2.1.8

1. O sistema detecta que a transição entre os status não é permitida (ex: mover de Backlog diretamente para Concluída).  
2. O sistema exibe a mensagem: **"Transição não permitida para esta etapa."**  
3. O sistema retorna o cartão à coluna original.  
4. O sistema registra a tentativa inválida em log operacional.  
5. O fluxo retorna ao passo **2.1.4**.

---

### <a id="fe03"></a>FE03 — Dados Complementares Inválidos  
**Passo de origem:** FA02.5

1. O sistema identifica inconsistências nos dados obrigatórios fornecidos.  
2. O sistema exibe uma mensagem destacando o erro encontrado.  
3. O sistema impede o avanço da demanda até que os dados sejam corrigidos.  
4. O fluxo retorna ao passo **FA02.3**.

---

# 3. Requisitos Especiais

- **[RNF01] Segurança:**  
  O sistema deve registrar tentativas de movimentação não autorizada no log de segurança para auditoria.

- **[RNF02] Feedback Visual:**  
  Deve ser exibido um indicador visual (ex: highlight) durante a movimentação do cartão para indicar ação em andamento.

- **[RNF05] Desempenho:**  
  A atualização do quadro Kanban deve ocorrer em tempo real, sem recarregar a página, utilizando eventos reativos ou WebSockets.

---

# 4. Regras de Negócio

- **[RN03] Registro de Histórico de Tramitações:**  
  Cada mudança de coluna deve gerar uma entrada no histórico da demanda, contendo status anterior, novo status, horário e usuário responsável pela ação.

- **[RN06] Controle de Transições Permitidas:**  
  As transições entre colunas devem seguir rigorosamente o fluxo definido pelo escritório, impedindo saltos diretos entre etapas não consecutivas.

---

# 5. Precondições

- O usuário deve estar autenticado no sistema LegisPro.  
- O usuário deve possuir permissão de Sócio ou Estagiário.  
- Devem existir demandas cadastradas e exibidas no quadro Kanban.

---

# 6. Pós-condições

- A demanda é atualizada com o novo status.  
- O histórico da demanda recebe um novo registro de tramitação.  
- Dados complementares obrigatórios (quando exigidos) são devidamente associados.  
- O quadro é atualizado e reflete o novo estado da demanda.
