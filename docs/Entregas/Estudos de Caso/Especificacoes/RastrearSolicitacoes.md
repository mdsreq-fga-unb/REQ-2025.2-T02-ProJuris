# Rastrear Status de Solicitações Submetidas

## Breve Descrição
Este caso de uso permite que a Agência Humanitária acompanhe e monitore o status das solicitações de serviços submetidas pelos refugiados palestinos na plataforma HopeBridge. A funcionalidade possibilita visualizar solicitações pendentes, em andamento e concluídas, filtrar por tipo de serviço, região ou período, e gerar relatórios analíticos sobre a demanda e taxa de atendimento. O rastreamento é essencial para que as agências possam identificar gargalos no atendimento, priorizar casos urgentes e planejar a alocação de recursos de forma mais eficiente.

## Atores
- **Ator Principal**: Agência Humanitária
- **Atores Secundários**:
    - Responde às consultas
    - Apresenta dados consolidados
    - Gerar relatórios

## Fluxo de Eventos

### Fluxo Principal
O fluxo principal descreve o caminho de sucesso para rastrear solicitações.
1. O ator realiza login no sistema.
2. O Sistema exibe o painel de controle e o ator seleciona a opção "Rastrear Solicitações".
3. O Sistema apresenta um dashboard com visão geral das solicitações, incluindo:
    - Total de solicitações (por status: Pendente, Em Andamento, Concluída, Cancelada)
    - Gráficos de distribuição por categoria de serviço
    - Indicadores de tempo médio de atendimento [RN01]
4. O ator aplica filtros de busca: tipo de serviço, região, período, status ou protocolo específico [FA01].
5. O Sistema processa os filtros e exibe a lista de solicitações correspondentes com as seguintes informações:
    - Número de protocolo
    - Nome do refugiado (ou ID anonimizado conforme configuração de privacidade)
    - Tipo de serviço solicitado
    - Data e hora da solicitação
    - Status atual
    - Provedor de serviço responsável
    - Última atualização [RN02]
6. O ator seleciona uma solicitação específica para visualizar detalhes completos [FA02].
7. O Sistema exibe o histórico completo da solicitação, incluindo:
    - Dados do refugiado
    - Formulário de solicitação preenchido
    - Timeline com todas as atualizações de status
    - Observações registradas pelo provedor de serviço
    - Documentos anexados (se aplicável) [RN03]
8. O ator visualiza as informações necessárias e pode realizar ações adicionais [FA03] [FA04].
9. O caso de uso é encerrado.

### Fluxos Alternativos

#### [FA01] Buscar por Protocolo Específico
- **Passo de Origem**: 4
- O ator opta por buscar diretamente pelo número de protocolo da solicitação.
- O Sistema apresenta um campo de busca específico.
- O ator informa o número do protocolo no formato AAAAMMDD-HHMMSS-SEQ.
- O Sistema valida o formato [FE01] e localiza a solicitação [FE02].
- O fluxo retorna ao passo 7.

#### [FA02] Visualizar Mapa de Demanda Regional
- **Passo de Origem**: 6
- O ator seleciona a opção "Visualizar Mapa de Demanda".
- O Sistema exibe um mapa interativo mostrando a distribuição geográfica das solicitações por região.
- O mapa apresenta marcadores indicando volume de solicitações e status predominante em cada área [RN04].
- O ator pode clicar em uma região específica para ver detalhes das solicitações locais.
- O fluxo retorna ao passo 5.

#### [FA03] Adicionar Observação à Solicitação
- **Passo de Origem**: 8
- O ator seleciona a opção "Adicionar Observação" para registrar notas internas sobre a solicitação.
- O Sistema apresenta um campo de texto para inserção da observação.
- O ator insere a observação e confirma o registro.
- O Sistema registra a observação com timestamp e identificação do usuário [RN05].
- O Sistema atualiza o histórico da solicitação.
- O fluxo retorna ao passo 8.

#### [FA04] Gerar Relatório Analítico
- **Passo de Origem**: 8
- O ator seleciona a opção "Gerar Relatório".
- O Sistema apresenta opções de relatório:
    - Relatório de Solicitações por Período
    - Relatório de Taxa de Atendimento por Categoria
    - Relatório de Tempo Médio de Resposta
    - Relatório de Demanda por Região
- O ator seleciona o tipo de relatório e define parâmetros (período, categorias, regiões).
- O Sistema processa os dados e gera o relatório em formato PDF ou Excel [RN06].
- O Sistema disponibiliza o download do relatório.
- O fluxo retorna ao passo 8.

### Fluxos de Exceção

#### [FE01] Formato de Protocolo Inválido
- **Passo de Origem**: FA01
- O Sistema identifica que o protocolo informado não está no formato correto (AAAAMMDD-HHMMSS-SEQ).
- O Sistema exibe a mensagem: "Formato de protocolo inválido. Use o formato AAAAMMDD-HHMMSS-SEQ."
- O fluxo retorna ao passo FA01.

#### [FE02] Solicitação Não Encontrada
- **Passo de Origem**: FA01
- O Sistema não localiza nenhuma solicitação com o protocolo informado.
- O Sistema exibe a mensagem: "Nenhuma solicitação encontrada com este protocolo. Verifique o número informado."
- O Sistema oferece a opção de realizar nova busca ou aplicar filtros gerais.
- O fluxo retorna ao passo 4.

#### [FE03] Falha ao Carregar Dados
- **Passo de Origem**: 3, 5, 7
- O Sistema não consegue carregar os dados das solicitações devido a erro de conexão ou indisponibilidade do banco de dados.
- O Sistema exibe a mensagem: "Não foi possível carregar os dados. Tente novamente em alguns instantes."
- O Sistema oferece a opção de tentar novamente.
- Se o erro persistir, o ator é orientado a contatar o suporte técnico.
- O caso de uso é encerrado.

#### [FE04] Sem Permissão para Visualizar Solicitação
- **Passo de Origem**: 6, 7
- O Sistema identifica que o ator não possui permissão para visualizar detalhes da solicitação selecionada (restrição por região ou tipo de serviço) [RN07].
- O Sistema exibe a mensagem: "Acesso negado. Você não possui permissão para visualizar esta solicitação."
- O fluxo retorna ao passo 5.

## Requisitos Especiais
- **RE01**: O sistema deve permitir a visualização de dados em modo offline para solicitações previamente sincronizadas, com atualização automática quando a conectividade for restabelecida.
- **RE02**: A interface de rastreamento deve ser responsiva e compatível com tablets e smartphones.
- **RE03**: O sistema deve suportar a exportação de dados em múltiplos formatos (PDF, Excel, CSV) para facilitar análises externas.
- **RE04**: O tempo de resposta para carregar a lista de solicitações com filtros aplicados não deve exceder 3 segundos em condições normais de rede.
- **RE05**: O dashboard deve atualizar automaticamente os indicadores em tempo real quando houver mudanças no status das solicitações.

## Regras de Negócio
- **[RN01]**: O tempo médio de atendimento é calculado como a diferença entre a data/hora de criação da solicitação e a data/hora da conclusão, considerando apenas dias úteis.
- **[RN02]**: Solicitações com mais de 72 horas em status "Pendente" devem ser destacadas visualmente com um alerta de prioridade.
- **[RN03]**: O acesso a dados pessoais sensíveis dos refugiados deve respeitar as configurações de privacidade e consentimento registradas no sistema, podendo exibir apenas dados anonimizados conforme necessário.
- **[RN04]**: O mapa de demanda regional deve calcular a densidade de solicitações por quilômetro quadrado para identificar áreas de maior vulnerabilidade.
- **[RN05]**: Todas as observações adicionadas pelas agências devem gerar registro no log de auditoria com timestamp, ID do usuário e conteúdo da observação.
- **[RN06]**: Relatórios analíticos devem incluir comparativos com períodos anteriores quando aplicável (variação percentual, tendências).
- **[RN07]**: As permissões de acesso às solicitações devem ser configuráveis por região geográfica, tipo de serviço ou organização responsável, respeitando acordos de compartilhamento de dados entre agências.

## Pré-condições
- **PRE01**: O ator deve estar autenticado no sistema com perfil de Agência Humanitária.
- **PRE02**: O ator deve estar autenticado no sistema com perfil de Agência Humanitária.
- **PRE03**: Deve haver ao menos uma solicitação registrada no sistema.
- **PRE04**: O banco de dados de solicitações deve estar acessível.

## Pós-condições
- **POS01**: O ator obteve as informações necessárias sobre o status das solicitações.
- **POS02**: Se observações foram adicionadas, elas foram registradas no histórico da solicitação com registro de auditoria.
- **POS03**: Se relatórios foram gerados, eles ficaram disponíveis para download e foram registrados no log de atividades do sistema.
- **POS04**: Todas as ações de visualização de dados sensíveis foram registradas no log de auditoria para fins de conformidade com políticas de privacidade.

## Pontos de Extensão
- **PE01**: No passo 6, este caso de uso pode ser estendido por "Alterar Status da Solicitação" caso a agência tenha permissões administrativas para intervir diretamente.
- **PE02**: No passo 8, este caso de uso pode ser estendido por "Comunicar-se com Provedor de Serviço" para enviar mensagens ou instruções específicas sobre o atendimento.
- **PE03**: No passo FA04, este caso de uso pode ser estendido por "Configurar Alertas Automáticos" para receber notificações quando determinados critérios forem atingidos (ex: solicitações pendentes há mais de 48 horas).
- **PE04**: No passo 7, este caso de uso pode ser estendido por "Visualizar Perfil Completo do Refugiado" para acessar informações contextuais adicionais que possam auxiliar na análise da solicitação.
