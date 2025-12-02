# Work Item List

## Priorização

A priorização dos casos de uso foi concebida com base nos critérios dos requisitos funcionais rastreiados, que você pode encontrar [aqui](Funcionais.md#criterios-priorizacao).

---

## Casos de Uso

| Cód   | Nome (Caso de Uso)                | Descrição do Fluxo (Ator + Objetivo + Objeto)                                                                 | Ator Primário         | MVP? | Rastreio (RF)                       |
|-------|------------------------------------|-----------------------------------------------------------------------------------------------------------------|------------------------|------|--------------------------------------|
| UC-01 | Criar Demanda                      | O Sócio registra o caso e define o responsável, gerando a Demanda criada.                                      | Sócio                 | Sim  | RF01, RF10                           |
| UC-02 | Tramitar Demanda (Kanban)          | O Responsável move o card para avançar etapa, atualizando o Novo Status.                                       | Estagiário, Sócio     | Sim  | RF09, RF11, RF13, RF14               |
| UC-03 | Cadastrar Usuário                  | O Sócio insere credenciais para criar acesso, gerando um Registro de Usuário.                                 | Sócio                 | Sim  | RF08                                 |
| UC-04 | Atribuir Responsável               | O Sócio delega ou transfere a tarefa, atualizando o Vínculo Demanda-Usuário.                                  | Sócio                 | Sim  | RF03, RF05                           |
| UC-05 | Editar Detalhes da Demanda         | O Responsável altera dados do processo, salvando o Registro atualizado.                                        | Estagiário, Sócio     | Sim  | RF02, RF07                           |
| UC-06 | Configurar Colunas do Kanban       | O Sócio define as etapas do fluxo, atualizando os Metadados do Quadro.                                        | Sócio                 | Sim  | RF12, RF14                           |
| UC-07 | Consultar Tarefas                  | O Estagiário acessa lista filtrada, gerando a Lista de Pendências.                                            | Estagiário            | Não  | RF06 (Should)                        |
| UC-08 | Retirar Demanda do Quadro          | O Sócio arquiva itens, resultando em uma Demanda arquivada.                                                   | Sócio                 | Não  | RF12 (Implícito)                     |
| UC-09 | Inativar Usuário                   | O Sócio revoga acesso, gerando um Registro Inativo.                                                           | Sócio                 | Não  | (Gestão)                             |
| UC-10 | Importar Planilhas                 | O Sócio carrega arquivo legado, criando um Lote de Demandas.                                                  | Sócio                 | Não  | RF16, RF21                           |
| UC-11 | Cadastrar Modelo de Cláusula       | O Sócio/Estagiário salva texto padrão, gerando um Novo Template.                                              | Sócio, Estagiário     | Não  | RF22                                 |
| UC-12 | Pesquisar Cláusula                 | O Estagiário/Sócio busca termos, obtendo o Texto recuperado.                                                  | Estagiário, Sócio     | Não  | RF22, RF24                           |
| UC-13 | Excluir Modelo de Cláusula         | O Sócio remove item, resultando em um Registro removido.                                                      | Sócio                 | Não  | (Gestão)                             |
| UC-14 | Anexar Arquivos                    | O Responsável faz upload de documentos, salvando o Arquivo armazenado.                                        | Estagiário, Sócio     | Não  | (Suporte)                            |
| UC-15 | Configurar Mensagens Automáticas   | O Sócio edita textos de aviso, gerando um Template salvo.                                                     | Sócio                 | Não  | RF26                                 |
| UC-16 | Configurar Gatilhos de Envio       | O Sócio define regras de envio, ativando uma Regra de Automação.                                              | Sócio                 | Não  | RF27                                 |
| UC-17 | Processar Envio de Mensagem        | O Sistema entrega a notificação, gerando um Log de Disparo.                                                   | Sistema               | Não  | RF28                                 |
| UC-18 | Processar Retorno (Webhook)        | A API WhatsApp confirma a entrega, atualizando o Status da Mensagem.                                          | API WhatsApp          | Não  | RF28                                 |
