# Work Item List

## Critérios de priorização (e sua aplicação): valor de negócio x avaliação técnica

### 2.1 - Níveis de valor de negócio

- **MUST**: são absolutamente essenciais para que o produto funcione minimamente, resolva o problema central de visibilidade do fluxo de trabalho e atenda aos requisitos críticos de segurança e confiabilidade de um ambiente jurídico.

- **SHOULD**: são muito importantes, trazem alto valor agregado ao usuário e melhoram drasticamente a eficiência e a qualidade dos dados, mas existe um contorno (workaround) manual e temporário que o usuário pode executar no MVP.

- **COULD**: são desejáveis (nice-to-have), melhoram a experiência do usuário e a governança a longo prazo, mas não são cruciais para resolver o problema central do fluxo de trabalho. Sua ausência não impede o uso do MVP.

- **WONT**: estão fora do escopo do MVP por enquanto, porque seu custo de implementação é proibitivo em relação ao valor que entregam nesta primeira versão, ou porque a funcionalidade já está coberta por um requisito Must Have mais simples.

### 2.2 - Níveis de Complexidade

| **Nível de Complexidade** | **Descrição (Custo de Trabalho)** |
|----------------------------|----------------------------------|
| **1 - Baixa** | O esforço de trabalho é mínimo. A implementação é direta e não requer decisões complexas ou coordenação externa. |
| **2 - Média** | O esforço de trabalho é padrão para uma funcionalidade (alguns dias, dentro de um micro-incremento ou parte de um Work Item). O caminho de implementação é bem compreendido. |
| **3 - Alta** | O esforço é significativo (vários dias ou mais de uma semana). Requer coordenação entre diferentes desenvolvedores ou papéis (como Analista e Arquiteto). Pode envolver integração com sistemas legados ou de terceiros (Requisitos de Interface). |
| **4 - Proibitiva** | O esforço é extremamente grande, podendo consumir a maior parte de uma iteração. Envolve alta incerteza técnica, exige mudanças arquiteturais significativas, ou requer aquisição de novo conhecimento/tecnologia. |

| ID | Tipo | Priorização| Nome | Descrição | Objetivos Específicos | MVP |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RF01** | Funcional | Must | Cadastrar demanda com informações detalhadas | Essas informações devem conter atividade, andamento, prazo e responsável. | OE1 | Contém |
| **RF02** | Funcional | Must | Editar demanda | Deve ser possível atualizar informações como atividade, andamento, prazo e responsável. | OE1 | Contém |
| **RF03** | Funcional | Must | Atribuir demandas | O sistema deve ser possível atribuir demandas a pessoas específicas. | OE2 | Contém |
| **RF04** | Funcional | Must | Transferir responsabilidade das demandas | O sistema deve ser possível transferir a responsabilidade de uma demanda para outra pessoa. | OE2 | Contém |
| **RF05** | Funcional | Should | Exibir todas as atribuições do estagiário | O sistema deve ter as atribuições do estagiário, mostrando as demandas a serem feitas. |
| **RF06** | Funcional | Must | Mostrar detalhes das demandas | O sistema deve apresentar todos os detalhes da demanda como atividade, andamento, prazo e responsável. |
| **RF07** | Funcional | Must | Cadastrar novos estagiários e sócios | O usuário de nível “Sócio” deve ser capaz de clicar em um botão para cadastrar novos estagiários e sócios.
| **RF08** | Funcional | Must | Atualizar processo kanban | O sistema deve permitir alterar detalhes do processo. |
| **RF09** | Funcional | Must | Criar/Adicionar demanda | O sistema deve permitir a criação de um novo cartão (demanda) no quadro Kanban, informando no mínimo um título e a coluna inicial. |
| **RF10** | Funcional | Must | Editar Detalhes da demanda | O sistema deve permitir a edição dos detalhes de um cartão existente, como título, descrição, responsável e data de entrega. |
| **RF11** | Funcional | Must | Mover demanda entre Colunas | O sistema deve permitir que o usuário mova um cartão entre as colunas do quadro para refletir o avanço da demanda no fluxo de trabalho (ex: "arrastar e soltar"). | OE1 | Contém |
| **RF12** | Funcional | Must | Retirar demanda | O sistema deve permitir excluir um cartão que não é mais necessário ou foi concluído há muito tempo, removendo-o da visualização principal do quadro. |
| **RF13** | Funcional | Could | Solicitar revisão de demanda | O sistema deve ser possível pedir para ter uma revisão de uma demanda. | OE1 | Contém |
| **RF14** | Funcional | Must | Exibir etapas das demandas em quadro Kanban | O sistema deve conter etapas configuráveis (Ex.: Elaboração → Revisão → Pendente Cliente → Concluída) e permitir alteração de etapa com atualização automática do responsável. | OE1 | Contém |
| **RF15** | Funcional | Could | Criar quadros kanban | O usuário deve ser capaz de construir novos quadros de atividades kanban. | OE1 | Contém |
| **RF16** | Funcional | Should | Iniciar importação e fazer upload de arquivo | O sistema deve ser capaz de fazer upload dos arquivos de planilhas (csv, xlsx) e importar a planilha. | 
| **RF21** | Funcional | Should | Apresentar relatório de conclusão da importação | Apóes concluir a importação de planilha, deve apresentar quantas fora importadas com sucesso, quais tiveram erros e quais erros foram enfrentados durante a importação. |
| **RF22** | Funcional | Could | Armazenar e pesquisar templates e cláusulas | O sistema deve permitir ao usuário salvar, categorizar e pesquisar modelos e cláusulas por tags ou palavras-chave, criando uma base de conhecimento unificada. |
| **RF23** | Funcional | Could | Versionar templates/cláusulas | O sistema deve registrar o histórico de alterações, incluindo o autor e a data de cada modificação na cláusula ou template, permitindo restaurar versões anteriores. |
| **RF24** | Funcional | Could | Inserir trechos de templates/cláusulas em minutas. | O sistema deve permitir ao usuário selecionar e injetar automaticamente o texto de uma cláusula pesquisada em um editor de texto ou campo de documento. |
| **RF25** | Funcional | Should | Gerenciar Dados do Cliente para Notificação | O sistema deve incluir uma interface e persistência no banco de dados para armazenar o número de WhatsApp do cliente e um status de consentimento ou opção de opt-out para receber as notificações automáticas do sistema, garantindo a conformidade. |
| **RF26** | Funcional | Should | Gerenciar Templates de Mensagem (WhatsApp) | O sistema deve fornecer uma interface para o Sócio criar, editar e aprovar modelos de mensagem padronizados (templates). Estes templates devem ser configurados com placeholders (variáveis) para serem preenchidos dinamicamente com dados do processo. |
| **RF27** | Funcional | Should | Configurar Gatilho de Notificação Automática | O sistema deve permitir ao Sócio definir eventos (gatilhos) que automaticamente disparam o envio das notificações. Exemplos de gatilhos: "Mudança de Status" (ex.: Sendo Revisado), "Proximidade de Prazo" ou "Nova Atribuição". |
| **RF28** | Funcional | Should | Enviar Notificação via WhatsApp na Conclusão | O sistema deve ser capaz de disparar a mensagem padronizada (usando o template e preenchendo as variáveis) para o contato do cliente ou responsável, utilizando a API oficial do WhatsApp Business, sendo acionado por um gatilho configurado no sistema. | 
| **RF29** | Funcional | Should | Gerar relatório filtrável e exportável | Gerar relatório de acompanhamento de clientes. |