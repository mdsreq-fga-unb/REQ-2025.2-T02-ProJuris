

# UC-03 — Cadastrar Usuário

## 1. Nome do Caso de Uso
**Cadastrar Usuário**

## 1.1 Breve Descrição
Este caso de uso permite ao Sócio cadastrar um novo usuário no sistema LegisPro. O cadastro é necessário para permitir que novos colaboradores (Sócios, Estagiários, Assistentes Administrativos etc.) tenham acesso ao sistema e possam ser atribuídos a demandas. O processo inclui inserção de dados pessoais, definição de permissões e validações de segurança.

## 1.2 Atores
- **Ator Principal:** Sócio  
- **Atores Secundários:** Nenhum

---

# 2. Fluxo de Eventos

## 2.1 Fluxo Principal

1. O Sócio acessa o menu **Configurações → Usuários → Cadastrar Usuário**.  
   → Possível desvio: [FA01 - Consultar Lista de Usuários](#fa01)

2. O sistema exibe o formulário de cadastro contendo os campos:  
   - Nome completo  
   - E-mail  
   - Senha provisória  
   - Perfil de acesso (Sócio, Estagiário, Assistente etc.)  
   - Telefone (opcional)

3. O Sócio preenche o campo **Nome completo**.

4. O Sócio preenche o campo **E-mail** do novo usuário.  
   → Possível exceção: [FE03 - E-mail Inválido ou Malformado](#fe03)

5. O Sócio define a **Senha provisória** para o novo usuário.  
   → Possível exceção: [FE04 - Senha Não Atende aos Critérios Mínimos](#fe04)

6. O Sócio seleciona o **Perfil de Acesso**.  
   → Possível exceção: [FE05 - Perfil de Acesso Inválido ou Não Permitido](#fe05)

7. O sistema salva automaticamente o rascunho do formulário. ([RNF04])

8. O Sócio confirma o cadastro clicando no botão **Salvar**.

9. O sistema exibe um indicador visual de processamento. ([RNF02])

10. O sistema valida se o usuário logado possui permissão de Sócio.  
    → Possível exceção: [FE01 - Usuário Sem Permissão para Cadastrar](#fe01)

11. O sistema verifica se o e-mail informado já existe na base de usuários.  
    → Possível exceção: [FE02 - E-mail Já Cadastrado](#fe02)

12. O sistema valida se todos os campos obrigatórios foram preenchidos.  
    → Possível exceção: [FE06 - Campos Obrigatórios Não Preenchidos](#fe06)

13. O sistema gera um **ID único** para o novo usuário.

14. O sistema registra o novo usuário no banco de dados com:  
    - Nome  
    - E-mail  
    - Senha provisória (criptografada)  
    - Perfil de Acesso  
    - Status ativo

15. O sistema envia um e-mail automático ao novo usuário contendo:  
    - Sua senha provisória  
    - Link para definir senha definitiva  
    - Orientações de primeiro acesso ([RN07])

16. O sistema exibe a mensagem: **"Usuário cadastrado com sucesso."**

17. O sistema redireciona o Sócio para a **lista de usuários** já atualizada.

18. O caso de uso é encerrado.

---

## 2.2 Fluxos Alternativos

### <a id="fa01"></a>FA01 — Consultar Lista de Usuários  
**Passo de origem:** 2.1.1

1. O Sócio acessa a lista de usuários antes de cadastrar um novo.  
2. O Sócio retorna à função **Cadastrar Usuário**.  
3. O fluxo retorna ao passo **2.1.2**.

---

## 2.3 Fluxos de Exceção

### <a id="fe01"></a>FE01 — Usuário Sem Permissão para Cadastrar  
**Passo de origem:** 2.1.10

1. O sistema detecta que o usuário logado não possui perfil de Sócio.  
2. O sistema bloqueia a ação.  
3. O sistema exibe a mensagem: **"Apenas Sócios podem cadastrar novos usuários."**  
4. O sistema registra a tentativa não autorizada no log de segurança. ([RNF01])  
5. O caso de uso é encerrado.

---

### <a id="fe02"></a>FE02 — E-mail Já Cadastrado  
**Passo de origem:** 2.1.11

1. O sistema detecta que o e-mail informado já existe no banco de dados.  
2. O sistema exibe a mensagem: **"Este e-mail já está cadastrado no sistema."**  
3. O sistema impede o cadastro.  
4. O fluxo retorna ao passo **2.1.4**.

---

### <a id="fe03"></a>FE03 — E-mail Inválido ou Malformado  
**Passo de origem:** 2.1.4

1. O sistema identifica que o e-mail não segue o padrão válido (ex: falta de @ ou domínio).  
2. O campo é destacado com borda vermelha.  
3. O sistema exibe a mensagem: **"Digite um e-mail válido."**  
4. O fluxo retorna ao passo **2.1.4**.

---

### <a id="fe04"></a>FE04 — Senha Não Atende aos Critérios Mínimos  
**Passo de origem:** 2.1.5

1. O sistema detecta que a senha provisória não atende aos critérios definidos:  
   - mínimo de 8 caracteres  
   - pelo menos 1 número  
   - pelo menos 1 letra  
2. O sistema exibe a mensagem: **"A senha provisória deve atender aos critérios mínimos."**  
3. O fluxo retorna ao passo **2.1.5**.

---

### <a id="fe05"></a>FE05 — Perfil de Acesso Inválido ou Não Permitido  
**Passo de origem:** 2.1.6

1. O sistema detecta que o perfil selecionado não é válido ou não existe.  
2. O sistema exibe a mensagem: **"Perfil de acesso inválido."**  
3. O fluxo retorna ao passo **2.1.6**.

---

### <a id="fe06"></a>FE06 — Campos Obrigatórios Não Preenchidos  
**Passo de origem:** 2.1.12

1. O sistema identifica que qualquer dos campos obrigatórios não foi preenchido:  
   - Nome  
   - E-mail  
   - Senha provisória  
   - Perfil de Acesso  
2. O sistema destaca os campos pendentes.  
3. O sistema exibe a mensagem: **"Preencha todos os campos obrigatórios."**  
4. O fluxo retorna ao passo **2.1.3**.

---

# 3. Requisitos Especiais

- **[RNF01] Segurança:**  
  O sistema deve registrar toda tentativa de acesso ou ação não autorizada no log de segurança.

- **[RNF02] Feedback Visual:**  
  A interface deve exibir indicador de carregamento durante o processamento do cadastro.

- **[RNF04] Salvamento Automático:**  
  O formulário deve salvar rascunho automaticamente para evitar perda de informações por falha de conexão ou fechamento da página.

---

# 4. Regras de Negócio

- **[RN07] Envio de Credenciais:**  
  Todo usuário recém cadastrado deve receber automaticamente sua senha provisória e instruções de primeiro acesso.

- **[RN08] Perfis de Acesso Controlados:**  
  Apenas perfis configurados pelo sistema (Sócio, Estagiário, Assistente etc.) podem ser atribuídos. Perfis personalizados não são permitidos.

---

# 5. Precondições

- O Sócio deve estar autenticado no sistema.  
- O Sócio deve possuir permissão ativa para gerenciar usuários.  

---

# 6. Pós-condições

- Um novo usuário é registrado no banco de dados.  
- O sistema envia o e-mail de credenciais ao usuário.  
- A lista de usuários é atualizada e exibe o novo cadastro.  
- Um registro de auditoria é criado com informações do criador e data/hora.
