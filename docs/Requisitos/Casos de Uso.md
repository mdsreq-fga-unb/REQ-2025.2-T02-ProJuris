# Casos de Uso

## RF01 - Cadastra demanda:
**Nome do Caso de Uso**: Cadastrar Demanda com Informações Detalhadas
**Atores**: Sócio, Estagiário
**Objetivo**: Permitir que o usuário crie uma nova demanda com informações como atividade, andamento, prazo e responsável.
**Requisitos Especiais**: Registrar log (RNF07) e enviar notificação (RNF08).

### Fluxo Principal:

1. Ator acessa a funcionalidade "Nova Demanda" (botão ou comando);

2. Sistema apresenta formulário de cadastro com campos obrigatórios: Título/Atividade, Descrição (opcional/fortemente recomendado), Andamento (estado inicial ou seleção), Prazo (data/hora), Responsável (usuário ou campo "sem responsável");

3. Ator preenche os campos obrigatórios e confirma (clicando em “Salvar” / “Criar”);

4. Sistema valida os dados: campos obrigatórios preenchidos, formato de data do prazo correto, responsável existe e está ativo;

5. Se validação ok, sistema cria o registro da demanda no banco de dados com um identificador único, grava timestamps (criação/última alteração) e o usuário criador;

6. Sistema registra entrada de log da operação (RNF07) com detalhes da criação (id demanda, criador, timestamp, campos principais);

7. Sistema aciona disparo de notificação (RNF08) ao responsável designado (se houver) e/ou a grupos configurados;

8. Sistema apresenta tela de confirmação ao ator e exibe a demanda criada no local apropriado (lista de demandas, quadro Kanban na coluna inicial);

9. Caso o sistema integre com workflow Kanban, o novo cartão é criado na coluna inicial conforme configuração (RF09 / RF11).

### Fluxos Alternativos Críticos:

**A1 — Campos obrigatórios não preenchidos**

- A1.1 Se o ator tentar salvar sem preencher campos obrigatórios (p.ex. Atividade ou Prazo), o sistema bloqueia a criação e mostra mensagem indicando quais campos faltam. Volta ao passo 2.

**A2 — Prazo inválido (data no passado / formato inválido)**

- A2.1 Sistema mostra erro sobre o prazo inválido e solicita correção. Volta ao passo 2.

**A3 — Responsável inexistente / inativo**

- A3.1 Se o responsável indicado não for encontrado ou estiver inativo, o sistema exibe um erro e sugere selecionar outro responsável ou deixar em branco. Volta ao passo 2;

- A3.2 (Opcional) Permitir criação com “sem responsável” e registrar essa condição.

**A4 — Permissão insuficiente**

- A4.1 Se o ator não tiver permissão para criar demandas, o sistema nega a ação e exibe mensagem “Permissão negada”. Fluxo termina sem criar demanda.

**A5 — Falha de persistência (erro do servidor / BD)**

- A5.1 Sistema exibe mensagem de erro genérica (ex.: “Não foi possível salvar. Tente novamente.”) e registra erro técnico em log de sistema. Não confirma criação. (Operação pode ser reexecutada pelo usuário.)

**A6 — Conflito de duplicidade**

- A6.1 Se houver política de evitar duplicatas (ex.: mesmo título e data), sistema alerta o usuário e pede confirmação para criar mesmo assim ou cancelar.

### Pré-condições:

- Usuário autenticado no sistema;

- Usuário possui permissão para cadastrar demandas;

- Sistema com conectividade ao banco de dados e serviços de notificação.

### Pós-condições:

- Nova demanda criada com ID único e persistida;

- Demanda aparece nas visualizações (lista, detalhe, Kanban);

- Log de criação gravado (RNF07);

- Notificação enviada ao responsável conforme RNF08 (se aplicável);

- Métricas/contadores atualizados (p.ex. total de demandas do responsável).

### Critérios de Aceitação:

- Uma nova demanda pode ser criada preenchendo os campos: atividade, andamento, prazo e responsável;

- Todas as validações são aplicadas (campos obrigatórios, formato de data, existência do responsável);

- Ao criar, a demanda aparece imediatamente no Kanban (coluna inicial) e na lista de demandas;

- Um registro de log (RNF07) é criado contendo id da demanda, id do usuário criador e timestamp;

- Uma notificação (RNF08) é enviada ao responsável com informações mínimas e link para a demanda;

- Mensagens de erro amigáveis são apresentadas quando a criação falha por validação, permissão ou erro servidor;

- Caso o usuário não tenha permissão para criar, a operação é negada e o sistema não altera o estado;

- Teste de integração com importador/kanban: criação via formulário e criação via API/importação resultam em comportamento consistente (mesmos logs e notificações).

### Diagrama de Caso de Uso:
![Image](https://github.com/user-attachments/assets/a4673e9e-a868-46b2-ac01-8759962a7e20)

---

## RF04 - Transferir Responsabilidade:

- Nome do Caso de Uso: Reatribuir Responsabilidade da Demanda

- Atores: Sócio, Estagiário

- Objetivo: Permitir alterar o responsável por uma demanda existente.

- Requisitos Especiais: Registrar log (RNF07) e enviar notificação (RNF08).

O ator seleciona uma demanda e escolhe um novo responsável; o sistema valida permissão e existência do novo responsável, atualiza a demanda, registra o evento em log e envia notificação ao novo (e opcionalmente ao antigo) responsável.

### Pré-condições:

- Usuário autenticado.

- Usuário tem permissão para reatribuir (p.ex. Sócio pode sempre; Estagiário só se regra permitir).

- Demanda existe e está no estado que permite reatribuição.

### Pós-condições:

- Responsável da demanda atualizado no sistema.

- Evento de alteração registrado em log (RNF07).

- Notificação enviada conforme RNF08.

### Critérios de aceitação (mínimos):

1. É possível selecionar uma demanda existente e indicar um novo responsável válido.

2. Após confirmação, a demanda apresenta o novo responsável em todos os views relevantes (lista, detalhe, Kanban).

3. O sistema cria um registro de log contendo: id da demanda, id do usuário que efetuou a reatribuição, id do novo responsável, timestamp e motivo/opcional.

4. Notificação (por canal configurado) é enviada ao novo responsável informando a atribuição; se configurado, o responsável anterior também é notificado.

5. Mensagens de erro informativas são exibidas quando a operação não pode ser concluída (ex.: usuário inexistente, falta de permissão, conflito de dados).

### Diagrama de Caso de Uso:
![Image](https://github.com/user-attachments/assets/61e3b03b-d159-467d-bf4e-f2ecf59a9a67)
