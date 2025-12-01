# Work Item List

## Priorização

A priorização dos casos de uso foi concebida com base nos critérios dos requisitos funcionais rastreiados, que você pode encontrar [aqui](Funcionais.md#criterios-priorizacao).

---

## Casos de Uso

| Cód | Nome (Caso de Uso) | Descrição do Fluxo (Ator + Objetivo + Objeto) | Ator Primário | MVP? | Objetivo | Rastreio (RF Origem) |
| :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| **UC-01** | Criar Demanda | "O Sócio/Estagiário insere dados para registrar novo caso, gerando uma Demanda criada." | Sócio, Estagiário | Sim | OE1 | "RF01, RF09" |
| **UC-02** | Tramitar Demanda (Kanban) | "O Responsável move o card para avançar etapa, atualizando o Novo Status." | Estagiário, Sócio | Sim | OE1 | "RF11, RF13" |
| **UC-03** | Cadastrar Usuário | "O Sócio insere credenciais para criar acesso, gerando um Registro de Usuário." | Sócio | Sim | OE2 | RF07 |
| **UC-04** | Atribuir Responsável | "O Sócio indica um colaborador para delegar tarefa, criando o Vínculo Demanda-Usuário." | Sócio | Sim | OE2 | "RF03, RF04" |
| **UC-05** | Editar Detalhes da Demanda | "O Responsável altera dados para atualizar informações, salvando o Registro atualizado." | Estagiário, Sócio | Sim | OE3 | "RF02, RF06, RF10" |
| **UC-06** | Configurar Colunas do Kanban | "O Sócio define etapas para estruturar fluxo, atualizando os Metadados do Quadro." | Sócio | Não | OE1 | "RF08, RF14, RF15" |
| **UC-07** | Consultar Tarefas | "O Estagiário acessa o painel para ver pendências, gerando a Lista de Pendências." | Estagiário | Não | OE1 | RF05 |
| **UC-08** | Retirar Demanda do Quadro | "O Sócio arquiva itens para limpar visualização, resultando em uma Demanda arquivada." | Sócio | Não | OE1 | RF12 |
| **UC-09** | Inativar Usuário | "O Sócio bloqueia acesso para revogar permissões, gerando um Registro Inativo." | Sócio | Não | OE2 | "Novo (Implícito em RF07)" |
| **UC-10** | Importar Planilhas | "O Sócio envia arquivo para carga em lote, criando um Lote de Demandas." | Sócio | Não | OE2 | "RF16, RF21" |
| **UC-11** | Cadastrar Modelo de Cláusula | "O Sócio/Estagiário salva texto para padronizar documentos, gerando um Novo Template." | Sócio, Estagiário | Não | OE2 | "RF22, RF23" |
| **UC-12** | Pesquisar Cláusula | "O Estagiário/Sócio busca termos para copiar padrão, obtendo o Texto recuperado." | Estagiário, Sócio | Não | OE2 | "RF22, RF24" |
| **UC-13** | Excluir Modelo de Cláusula | "O Sócio remove item para limpar biblioteca, resultando em um Registro removido." | Sócio | Não | OE2 | "Novo (Gestão de RF22)" |
| **UC-14** | Anexar Arquivos | "O Responsável faz upload para vincular documentos, salvando o Arquivo armazenado." | Estagiário, Sócio | Não | OE3 | "Implícito em RF02/10" |
| **UC-15** | Configurar Mensagens Automáticas | "O Sócio edita textos para padronizar avisos, gerando um Template salvo." | Sócio | Não | OE4 | RF26 |
| **UC-16** | Configurar Gatilhos de Envio | "O Sócio define regras para automatizar envio, ativando uma Regra de Automação." | Sócio | Não | OE4 | "RF25, RF27, RF28" |
