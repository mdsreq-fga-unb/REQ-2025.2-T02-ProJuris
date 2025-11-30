

# UC-01 — Criar Demanda

## 1. Nome do Caso de Uso
**Criar Demanda**

## 1.1 Breve Descrição
Este caso de uso permite ao Sócio registrar uma nova necessidade jurídica no sistema LegisPro. O objetivo é formalizar a entrada de trabalho no escritório, garantindo que cada demanda nasça com informações essenciais (Título, Descrição, Prazo Legal e Prioridade), um Responsável definido e seja imediatamente visível no quadro Kanban para acompanhamento.

## 1.2 Atores
- **Ator Principal:** Sócio  
- **Atores Secundários:** Não se aplica

---

# 2. Fluxo de Eventos

## 2.1 Fluxo Principal

1. O Sócio acessa a funcionalidade **Criar Demanda** no sistema.  
   → Possível desvio: [FA02 - Recuperar Rascunho de Demanda](#fa02)

2. O sistema exibe o formulário de criação de demanda contendo os campos: **Título**, **Descrição**, **Prazo Legal**, **Prioridade** e **Responsável**.

3. O Sócio preenche o campo **Título** da demanda.

4. O Sócio preenche o campo **Descrição** com os detalhes do caso jurídico.

5. O Sócio informa o **Prazo Legal** da demanda.

6. O Sócio seleciona a **Prioridade** da demanda (ex: Alta, Média, Baixa).

7. O Sócio seleciona o **Responsável** pela execução da demanda dentre os usuários cadastrados.  
   → Possível exceção: [FE04 - Não Existem Usuários Cadastrados para Atribuição](#fe04)

8. O sistema salva automaticamente o rascunho dos dados preenchidos. ([RNF04])

9. O Sócio confirma a criação da demanda clicando no botão **Criar**.

10. O sistema exibe um indicador visual de carregamento. ([RNF02])

11. O sistema valida se o usuário logado possui perfil de **Sócio**.  
    → Possível exceção: [FE01 - Usuário Não Possui Perfil de Sócio](#fe01)

12. O sistema valida se todos os campos obrigatórios foram preenchidos.  
    → Possível exceção: [FE02 - Campos Obrigatórios Não Preenchidos](#fe02)

13. O sistema gera um **ID único** para a nova demanda.

14. O sistema registra a demanda no banco de dados com status inicial **Backlog**.  
    → Possível exceção: [FE03 - Erro na Comunicação com o Servidor](#fe03)

15. O sistema registra um log de auditoria contendo o criador, a data/hora e o ID da demanda. ([RN03])

16. O sistema verifica se o responsável atribuído é diferente do criador.  
    → Fluxo alternativo: [FA01 - Notificar Responsável pela Nova Atribuição](#fa01)

17. O sistema exibe a mensagem de confirmação **"Demanda criada com sucesso"**.

18. O sistema redireciona o Sócio para o **quadro Kanban**, onde o cartão da nova demanda está visível na coluna inicial.

19. O caso de uso é encerrado.

---

## 2.2 Fluxos Alternativos

### <a id="fa01"></a>FA01 — Notificar Responsável pela Nova Atribuição  
**Passo de origem:** 2.1.16  
**Descrição:** Ocorre quando o Responsável atribuído é diferente do criador.

1. O sistema identifica que o Responsável selecionado é diferente do Sócio criador.  
2. O sistema dispara um evento de notificação **"Nova Atribuição"** para o Responsável. ([RN04])  
3. O fluxo retorna ao passo **2.1.17**.

---

### <a id="fa02"></a>FA02 — Recuperar Rascunho de Demanda  
**Passo de origem:** 2.1.1  
**Descrição:** Ocorre quando o Sócio retorna ao formulário após fechamento acidental.

1. O sistema detecta a existência de um rascunho salvo automaticamente. ([RNF04])  
2. O sistema exibe a mensagem **"Deseja recuperar o rascunho anterior?"**.  
3. O Sócio seleciona **"Sim"**.  
4. O sistema restaura os dados do rascunho nos campos do formulário.  
5. O fluxo retorna ao passo **2.1.3**.

---

### <a id="fa03"></a>FA03 — Descartar Rascunho de Demanda  
**Passo de origem:** FA02.2  
**Descrição:** Ocorre quando o Sócio opta por **não** recuperar o rascunho.

1. O Sócio seleciona **"Não"** na mensagem de recuperação de rascunho.  
2. O sistema descarta o rascunho salvo.  
3. O sistema exibe o formulário em branco.  
4. O fluxo retorna ao passo **2.1.3**.

---

## 2.3 Fluxos de Exceção

### <a id="fe01"></a>FE01 — Usuário Não Possui Perfil de Sócio  
**Passo de origem:** 2.1.11  
**Descrição:** Usuário sem perfil de Sócio tenta criar demanda.

1. O sistema detecta que o usuário logado não possui perfil de **Sócio**.  
2. O sistema bloqueia a operação de criação.  
3. O sistema exibe a mensagem: **"Acesso negado. Apenas Sócios podem criar demandas."**  
4. O sistema registra a tentativa de acesso não autorizado no log de segurança. ([RNF01])  
5. O caso de uso é encerrado.

---

### <a id="fe02"></a>FE02 — Campos Obrigatórios Não Preenchidos  
**Passo de origem:** 2.1.12

1. O sistema detecta que um ou mais campos obrigatórios (**Título**, **Descrição**, **Prazo Legal**, **Responsável**) estão vazios.  
2. O sistema destaca os campos não preenchidos com borda vermelha.  
3. O sistema exibe a mensagem de erro: **"Por favor, preencha todos os campos obrigatórios."**  
4. O fluxo retorna ao passo **2.1.3**.

---

### <a id="fe03"></a>FE03 — Erro na Comunicação com o Servidor  
**Passo de origem:** 2.1.14

1. O sistema detecta erro ao tentar registrar a demanda no banco de dados.  
2. O sistema mantém os dados do rascunho preservados. ([RNF04])  
3. O sistema exibe a mensagem de erro: **"Não foi possível criar a demanda. Tente novamente."**  
4. O sistema registra o erro no log do sistema.  
5. O fluxo retorna ao passo **2.1.9**.

---

### <a id="fe04"></a>FE04 — Não Existem Usuários Cadastrados para Atribuição  
**Passo de origem:** 2.1.7

1. O sistema detecta que não existem usuários cadastrados no sistema.  
2. O sistema exibe: **"Não há usuários disponíveis. Cadastre usuários antes de criar demandas."**  
3. O sistema desabilita o campo **Responsável** e o botão **Criar**.  
4. O caso de uso é encerrado.

---

# 3. Requisitos Especiais

- **[RNF01] Segurança:**  
  O sistema deve validar no back-end se o usuário logado possui perfil de **Sócio** antes de processar a criação da demanda. Esta validação deve ocorrer tanto no front-end (interface) quanto no back-end (servidor).

- **[RNF02] Desempenho:**  
  Ao submeter o formulário, a interface deve exibir um indicador visual de carregamento ("spinner") até a confirmação do servidor, garantindo feedback imediato ao usuário.

- **[RNF04] Confiabilidade:**  
  Durante o preenchimento do formulário, o sistema deve salvar o rascunho dos dados periodicamente (a cada 30 segundos ou mudança de campo) para evitar perda de informações em caso de fechamento acidental do navegador ou queda de conexão.

---

# 4. Regras de Negócio

- **[RN03] Auditoria de Criação:**  
  O sistema deve registrar obrigatoriamente um log de auditoria contendo o identificador do criador (Sócio), a data/hora exata da criação e o ID único da nova demanda. Este log deve ser armazenado em tabela específica de auditoria para fins de rastreabilidade.

- **[RN04] Notificação de Nova Atribuição:**  
  Se o Responsável atribuído à demanda for diferente do criador, o sistema deve disparar automaticamente um evento de notificação **"Nova Atribuição"** para informar o colaborador designado sobre sua nova responsabilidade.

- **[RN05] Controle de Acesso por Perfil:**  
  Apenas usuários com perfil de **Sócio** podem criar demandas no sistema. Esta regra deve ser validada em todas as camadas da aplicação (front-end e back-end).

---

# 5. Precondições

- O Sócio deve estar autenticado no sistema LegisPro com credenciais válidas.  
- Devem existir usuários cadastrados no sistema para receber a atribuição da demanda.

---

# 6. Pós-condições

- Uma nova demanda é criada no banco de dados com ID único e status inicial **Backlog**.  
- O cartão correspondente à demanda torna-se visível na coluna inicial do quadro Kanban.  
- O campo **Responsável** é preenchido com o usuário selecionado pelo Sócio.  
- Um registro de log de auditoria é criado documentando a operação.  
- Se aplicável, uma notificação **"Nova Atribuição"** é disparada para o Responsável.

---
