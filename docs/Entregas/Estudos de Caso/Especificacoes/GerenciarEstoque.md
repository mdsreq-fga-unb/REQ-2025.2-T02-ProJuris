# Gerenciar Estoque de Recursos

## Breve Descrição
Permite que a Agência Humanitária registre a entrada, monitore e atualize a contagem de recursos físicos (alimentos, medicamentos, água, kits de higiene, entre outros) em diferentes locais de armazenamento. O controle de estoque é fundamental para garantir que os dados de disponibilidade de serviços no sistema estejam sempre atualizados para os refugiados e para informar as estratégias de distribuição.

## Atores
- **Agência Humanitária (Primário)**: O ator que inicia e executa as ações de gestão.
- **Sistema HopeBridge (Secundário)**: Responde, valida dados e atualiza o inventário.

## Fluxo de Eventos

### Fluxo Principal
O fluxo principal descreve o caminho de sucesso para adicionar estoque. O fluxo pressupõe que o ator já realizou o login.

2.1.1 O Sistema exibe o painel de controle e o ator seleciona a opção "Gestão de Estoque".

2.1.2 O Sistema apresenta a tabela de inventário atual com filtros e o Nível Mínimo de Alerta configurado para cada item. (Referência: [RN03])

2.1.3 O ator seleciona a ação: Adicionar Estoque, Atualizar Item ([FA01]) ou Remover Item ([FA02])

2.1.4 Se Adicionar Estoque: O ator preenche o formulário com o tipo de recurso, a quantidade de entrada, o local de armazenamento e, opcionalmente, a data de validade.

2.1.5 O Sistema valida os dados do formulário. (Exceção: [FE01])

2.1.6 O Sistema registra a entrada do estoque (aumento da quantidade) e atualiza o inventário com timestamp e ID do ator. (Referência: [RN01])

2.1.7 O Sistema verifica o novo nível de estoque. Se o nível cair abaixo do limite, dispara uma notificação. (Referência: [PE01])

2.1.8 O Sistema exibe uma mensagem de sucesso ("Estoque atualizado com sucesso")

2.1.9 O fluxo termina.

### Fluxos Alternativos

#### [FA01] Atualizar Detalhes do Item (Não Quantidade)
**Passo de Origem**: 2.1.3.

O ator seleciona um item na tabela e altera detalhes como localização ou descrição, mantendo a quantidade. O fluxo segue para 2.1.5 (Validação) e retorna a 2.1.8.

#### [FA02] Remoção de Item por Vencimento ou Dano
**Passo de Origem**: 2.1.3.

O ator seleciona um item e escolhe Remover Item. O ator deve inserir o motivo (ex: Vencimento, Dano). O Sistema registra a saída com o motivo (Referência: [RN01]) e o remove do inventário. O fluxo retorna a 2.1.8.

#### [FA03] Anexar Documentos de Recebimento
**Passo de Origem**: 2.1.4.

O ator anexa o arquivo de Nota Fiscal ou Documento de Doação (Referência: [PE02]) antes de submeter o formulário. O Sistema armazena o documento com o registro de estoque. O fluxo continua em 2.1.5.

### Fluxos de Exceção

#### [FE01] Falha na Validação de Dados
**Passo de Origem**: 2.1.5.

O Sistema identifica um campo obrigatório faltando (ex: Quantidade) ou dados em formato inválido. O Sistema interrompe a atualização, realça o(s) campo(s) com erro e exibe a mensagem: "Falha na validação. Corrija os campos em destaque." O fluxo retorna ao Passo 2.1.4.

#### [FE02] Tentativa de Estoque Negativo
**Passo de Origem**: 2.1.6.

O ator tenta atualizar um item de estoque com uma saída que resultaria em quantidade menor que zero (estoque negativo). O Sistema rejeita a operação e exibe a mensagem de erro: "Operação negada. A quantidade de saída excede o estoque disponível." O fluxo retorna ao Passo 2.1.3.

## Requisitos Especiais
- **RS01**: O gerenciamento de estoque deve permitir o registro temporário de entradas/saídas em modo offline (localmente no dispositivo), com sincronização automática e em background assim que a conectividade for restabelecida.
- **RS02**: A interface de entrada de dados (formulário) deve ser compatível e responsiva para uso em tablets e smartphones.

## Regras de Negócio
- **[RN01]**: Toda alteração na quantidade do estoque (entrada, saída/distribuição, remoção) deve gerar um log de auditoria contendo timestamp, o ID do ator e a razão da mudança.
- **[RN02]**: O Sistema deve gerar um alerta visual se um item de estoque possuir uma data de validade inferior a 60 dias.
- **[RN03]**: Cada tipo de recurso deve ter um Nível Mínimo de Alerta configurável pelo Gestor de Estoque.
- **[RN04]**: A quantidade de estoque disponível deve ser o dado primário para determinar a disponibilidade de serviços relacionados nos UCs de busca dos Refugiados.

## Precondições
- O ator deve estar autenticado no sistema com acesso a funcionalidades de Gestão de Recursos (permissão de Gestor de Recursos).
- O banco de dados de inventário deve estar acessível.

## Pós-condições
- O registro do item no inventário é atualizado com a nova quantidade e timestamp.
- A contagem de recursos disponíveis para os Refugiados é ajustada automaticamente.
- Um registro de log de auditoria foi gerado. (Referência: RN01)

## Pontos de Extensão
- **[PE01] Notificação de Nível Crítico**: No passo 2.1.7, o fluxo pode ser estendido para Notificar o Administrador do Sistema sobre a necessidade de reabastecimento via e-mail ou push notification.
- **[PE02] Anexar Documentos de Recebimento**: No passo 2.1.4, permite estender para Upload de Documentos de Doação (FA03).
- **[PE03] Gerar Relatório de Auditoria**: No passo 2.1.8, o fluxo pode ser estendido para Gerar PDF de Auditoria de Estoque para fins regulatórios.
