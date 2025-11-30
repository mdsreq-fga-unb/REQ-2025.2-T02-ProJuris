
# UC-04 — Editar Detalhes da Demanda

## 1. Nome do Caso de Uso
**Editar Detalhes da Demanda**

## 1.1 Breve Descrição
Permite que usuários autorizados (Sócio ou Responsável pela demanda) atualizem informações de uma demanda existente: título, descrição, prazo legal, prioridade e responsável. As alterações devem ser persistidas, auditáveis e acionarem notificações quando aplicável.

## 1.2 Atores
- **Ator Principal:** Sócio, Responsável (Estagiário quando for o responsável)  
- **Atores Secundários:** Não se aplica

---

# 2. Fluxo de Eventos

## 2.1 Fluxo Principal

1. O usuário acessa o **quadro Kanban** ou a listagem de demandas.  
   → Possível desvio: [FA04 - Recuperar Rascunho de Edição](#fa04)

2. O usuário identifica e clica no cartão da demanda que deseja editar.

3. O sistema exibe a **tela de detalhes** da demanda em modo de visualização.

4. O sistema valida se o usuário possui permissão para editar a demanda (Sócio ou Responsável).  
   → Possível exceção: [FE01 - Usuário Sem Permissão para Editar](#fe01)

5. O usuário clica no botão **Editar**.

6. O sistema habilita os campos editáveis do formulário: **Título**, **Descrição**, **Prazo Legal**, **Prioridade** e **Responsável**.

7. O usuário modifica um ou mais campos conforme necessário.  
   → Possível desvio: [FA03 - Cancelar Edição](#fa03)

8. O sistema salva automaticamente um rascunho das alterações periodicamente (auto-save). ([RNF04])  
   → Possível desvio: [FA04 - Recuperar Rascunho de Edição](#fa04)

9. O sistema captura os valores anteriores dos campos críticos modificados (ex.: Prazo, Responsável) para fins de auditoria. ([RN03])

10. O usuário confirma as alterações clicando no botão **Salvar**.

11. O sistema valida se todos os campos obrigatórios permanecem preenchidos.  
    → Possível exceção: [FE02 - Campos Obrigatórios Removidos](#fe02)

12. O system valida o formato dos dados alterados (ex.: formato de data DD/MM/AAAA).  
    → Possível exceção: [FE03 - Formato de Data Inválido](#fe03)

13. O sistema atualiza os dados da demanda no banco de dados.  
    → Possível exceção: [FE04 - Erro ao Atualizar no Banco de Dados](#fe04)  
    → Possível exceção: [FE05 - Demanda Foi Excluída por Outro Usuário](#fe05)  
    → Possível exceção: [FE06 - Conflito de Edição Concorrente](#fe06)

14. O sistema registra logs de auditoria para cada campo crítico alterado, detalhando "Valor Antigo" e "Valor Novo". ([RN03])

15. O sistema verifica se o campo **Responsável** foi alterado.  
    → Fluxo alternativo: [FA01 - Transferir Responsabilidade da Demanda](#fa01)

16. O system verifica se o campo **Prazo** foi alterado para uma data crítica (ex.: menos de 3 dias úteis).  
    → Fluxo alternativo: [FA02 - Alterar Prazo para Data Crítica](#fa02)

17. O sistema exibe a mensagem de confirmação **"Demanda atualizada com sucesso"**.

18. O sistema atualiza a visualização do cartão no quadro Kanban refletindo as alterações.

19. O caso de uso é encerrado.

---

## 2.2 Fluxos Alternativos

### <a id="fa01"></a>FA01 — Transferir Responsabilidade da Demanda  
**Passo de origem:** 2.1.15  
**Descrição:** Ocorre quando o campo "Responsável" é modificado.

1. O sistema detecta alteração no campo **Responsável**.  
2. O sistema registra no log de auditoria o responsável anterior e o novo responsável. ([RN03])  
3. O sistema transfere a demanda para a lista de tarefas do novo responsável.  
4. O sistema dispara notificação **"Nova Atribuição"** para o novo responsável e notifica o responsável anterior. ([RN04])  
5. O fluxo retorna ao passo **2.1.16**.

---

### <a id="fa02"></a>FA02 — Alterar Prazo para Data Crítica  
**Passo de origem:** 2.1.16  
**Descrição:** Ocorre quando o prazo é alterado para uma data próxima ou vencida.

1. O sistema detecta que o novo **Prazo Legal** está dentro do período crítico (ex.: menos de 3 dias úteis).  
2. O sistema calcula proximidade do novo prazo em relação à data atual.  
3. O sistema dispara notificações de **"Prazo Crítico"** para o responsável e para o Sócio. ([RN04])  
4. O sistema atualiza visualmente o cartão com indicador de urgência (ex.: cor/ícone).  
5. O fluxo retorna ao passo **2.1.17**.

---

### <a id="fa03"></a>FA03 — Cancelar Edição  
**Passo de origem:** 2.1.7

1. O usuário clica no botão **Cancelar** durante a edição.  
2. O sistema exibe confirmação: **"Deseja descartar as alterações?"**.  
3. O usuário confirma o descarte.  
4. O sistema descarta as alterações não salvas e restaura os valores atuais do banco de dados.  
5. O caso de uso é encerrado.

---

### <a id="fa04"></a>FA04 — Recuperar Rascunho de Edição  
**Passo de origem:** 2.1.8

1. O sistema detecta a existência de um rascunho de edição salvo automaticamente. ([RNF04])  
2. O sistema exibe a mensagem: **"Deseja recuperar as alterações não salvas?"**.  
3. O usuário seleciona **"Sim"**.  
4. O sistema restaura os dados do rascunho nos campos editáveis.  
5. O fluxo retorna ao passo **2.1.7**.

---

### <a id="fa05"></a>FA05 — Descartar Rascunho de Edição  
**Passo de origem:** FA04.2

1. O usuário seleciona **"Não"** na mensagem de recuperação de rascunho.  
2. O sistema descarta o rascunho salvo.  
3. O sistema exibe os dados originais carregados do banco de dados.  
4. O fluxo retorna ao passo **2.1.7**.

---

## 2.3 Fluxos de Exceção

### <a id="fe01"></a>FE01 — Usuário Sem Permissão para Editar  
**Passo de origem:** 2.1.4

1. O sistema detecta que o usuário não é "Sócio" nem o "Responsável" pela demanda.  
2. O sistema mantém os campos em modo somente leitura e oculta o botão **Editar**.  
3. O sistema exibe a mensagem: **"Você possui apenas permissão de leitura para esta demanda."**  
4. O caso de uso é encerrado.

---

### <a id="fe02"></a>FE02 — Campos Obrigatórios Removidos  
**Passo de origem:** 2.1.11

1. O sistema detecta que um ou mais campos obrigatórios (**Título**, **Descrição**, **Prazo Legal**, **Responsável**) estão vazios.  
2. O sistema destaca os campos vazios com borda vermelha.  
3. O sistema exibe a mensagem: **"Campos obrigatórios não podem ficar vazios."**  
4. O fluxo retorna ao passo **2.1.7**.

---

### <a id="fe03"></a>FE03 — Formato de Data Inválido  
**Passo de origem:** 2.1.12

1. O sistema identifica que o campo **Prazo Legal** não está no formato válido (DD/MM/AAAA).  
2. O sistema destaca o campo com borda vermelha.  
3. O sistema exibe a mensagem: **"Data inválida. Use o formato DD/MM/AAAA."**  
4. O fluxo retorna ao passo **2.1.7**.

---

### <a id="fe04"></a>FE04 — Erro ao Atualizar no Banco de Dados  
**Passo de origem:** 2.1.13

1. O sistema detecta erro na comunicação com o banco de dados ao tentar salvar as alterações.  
2. O sistema mantém o rascunho das alterações preservado. ([RNF04])  
3. O sistema exibe a mensagem: **"Não foi possível salvar as alterações. Tente novamente."**  
4. O sistema registra o erro no log do sistema.  
5. O fluxo retorna ao passo **2.1.10**.

---

### <a id="fe05"></a>FE05 — Demanda Foi Excluída por Outro Usuário  
**Passo de origem:** 2.1.13

1. O sistema detecta que a demanda não existe mais no banco de dados.  
2. O sistema exibe a mensagem: **"Esta demanda foi excluída. Suas alterações não podem ser salvas."**  
3. O sistema descarta o rascunho de edição.  
4. O sistema redireciona o usuário para o quadro Kanban.  
5. O caso de uso é encerrado.

---

### <a id="fe06"></a>FE06 — Conflito de Edição Concorrente  
**Passo de origem:** 2.1.13

1. O sistema detecta que a versão da demanda foi alterada por outro usuário desde o início da edição.  
2. O sistema exibe a mensagem: **"Esta demanda foi modificada por outro usuário. Deseja sobrescrever as alterações dele?"**  
3. O usuário seleciona **"Não"**.  
4. O sistema recarrega os dados atuais da demanda.  
5. O sistema exibe as diferenças entre as versões para revisão.  
6. O fluxo retorna ao passo **2.1.7**.

---

# 3. Requisitos Especiais

- **[RNF04] Confiabilidade:**  
  Edições em campos de texto longo devem contar com salvamento automático periódico (a cada 30 segundos ou mudança de campo). O rascunho deve ser preservado em caso de fechamento acidental do navegador, perda de conexão ou falha no servidor.

- **[RNF05] Restrição de Acesso:**  
  A edição completa é permitida apenas se o usuário for "Sócio" ou o "Responsável" direto pela demanda. Outros perfis têm acesso somente leitura. Validação deve ocorrer no front-end e no back-end.

- **[RNF02] Feedback Visual:**  
  A interface deve fornecer feedback claro durante as operações de salvar, recuperação de rascunho e detecção de conflitos.

---

# 4. Regras de Negócio

- **[RN03] Auditoria de Alterações Críticas:**  
  Alterações em campos críticos (Prazo Legal, Responsável, Status, Prioridade) geram logs imutáveis contendo: campo alterado, valor antigo, valor novo, identificador do usuário, data/hora e endereço IP.

- **[RN04] Notificações por Evento de Alteração:**  
  Se o Prazo Legal for alterado para uma data crítica (menos de 3 dias úteis) ou houver troca de responsável, disparar notificações automáticas para os usuários relevantes (responsável atual, responsável anterior, Sócio) pelos canais configurados.

---

# 5. Precondições

- O usuário deve estar autenticado no sistema LegisPro.  
- O usuário deve ser Sócio ou o atual Responsável pela demanda.  
- A demanda deve existir no banco de dados e estar acessível.

---

# 6. Pós-condições

- Os dados da demanda são atualizados no banco de dados refletindo as alterações.  
- Logs de auditoria são gerados para cada alteração em campos críticos.  
- Se o Responsável foi alterado, a demanda é transferida para a lista do novo responsável e notificações são disparadas conforme regras.  
- O cartão no quadro Kanban é atualizado para refletir as novas informações.
