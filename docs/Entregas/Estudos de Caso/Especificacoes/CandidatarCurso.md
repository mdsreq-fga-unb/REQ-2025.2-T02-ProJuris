# Candidatar-se para curso

## Breve Descrição
Este caso de uso permite que o refugiado visualize oportunidades de capacitação profissional sugeridas pelo sistema com base em seu perfil e realize sua inscrição. O objetivo é conectar o usuário a cursos oferecidos por ONGs e parceiros para promover sua reintegração econômica e social.

## Atores
- Refugiado

## Fluxo de Eventos

### Fluxo Principal
Este caso de uso é iniciado quando o refugiado acessa a seção de "Capacitação e Oportunidades" na plataforma.

1. O sistema analisa o perfil do usuário (experiência prévia, interesses) e utiliza algoritmos para listar as opções de cursos mais adequadas disponíveis na região[FA01][FA02][FE01].
2. O refugiado seleciona um curso de interesse na lista apresentada.
3. O sistema apresenta os detalhes do curso (instituição, horários, local, conteúdo e requisitos).
4. O refugiado confirma o interesse selecionando a opção "Candidatar-se".
5. O sistema verifica se o usuário atende aos pré-requisitos e se há vagas disponíveis[RN01][FE01][FE02].
6. O sistema registra a candidatura do usuário no curso selecionado.
7. O sistema exibe uma mensagem de confirmação da inscrição e informa que notificações futuras serão enviadas[RN03].
8. O caso de uso é encerrado.

### Fluxos Alternativos

#### [FA01] Uso em Modo Offline
No passo 1, o sistema detecta que não há conexão com a internet.

1. O sistema carrega as informações de cursos armazenadas localmente no dispositivo durante a última sincronização.
2. O refugiado seleciona o curso e clica em "Candidatar-se" (passos 2 a 4).
3. O sistema armazena a solicitação de candidatura localmente e informa que a inscrição será processada assim que a conexão for restabelecida [RN02].
4. O caso de uso é encerrado.

#### [FA02] Filtragem Manual de Cursos
No passo 1, o refugiado decide buscar cursos fora das sugestões automáticas.

1. O usuário utiliza filtros de busca (área de atuação, localização, tipo de curso).
2. O sistema atualiza a lista de cursos conforme os filtros.
3. O fluxo retorna ao passo 2.

### Fluxos de Exceção

#### [FE01] Perfil Incompleto
- No passo 1 ou 5, o sistema identifica que faltam dados essenciais no perfil do refugiado para realizar a candidatura.
- O sistema exibe uma mensagem solicitando o preenchimento dos dados faltantes e redireciona para o caso de uso "Manter Perfil".

#### [FE02] Vagas Esgotadas
- No passo 5, o sistema verifica que o limite de participantes para o curso já foi atingido.
- O sistema informa o usuário e oferece a opção de entrar em uma lista de espera.

## Requisitos Especiais
- A interface deve ser intuitiva e dar suporte a múltiplos idiomas (árabe e inglês) para atender refugiados com baixa familiaridade tecnológica.
- O sistema deve garantir funcionamento básico e armazenamento de dados em áreas com baixa ou nenhuma conectividade (Modo Offline).
- A aplicação deve ser compatível com dispositivos móveis simples.

## Regras de Negócio
- **[RN01] Validação de Adequação (Match)**: O sistema deve priorizar a exibição de cursos que tenham "match" com o perfil do usuário (ex: um refugiado com experiência em construção civil deve ver cursos de reconstrução prioritariamente).
- **[RN02] Sincronização de Dados Offline**: Candidaturas realizadas em modo offline devem ser mantidas em uma fila local e enviadas automaticamente para o servidor central assim que a conectividade for restaurada.
- **[RN03] Notificação de Parceiros**: Sempre que uma candidatura for confirmada, o sistema deve permitir que o parceiro/empregador responsável acompanhe o interesse e organize as próximas etapas (entrevistas ou início das aulas).

## Pré-condições
- O refugiado deve estar cadastrado e autenticado na plataforma "HopeBridge".
- Devem existir cursos com inscrições abertas cadastrados por parceiros ou ONGs.

## Pós-condições
- O registro do refugiado é vinculado à lista de inscritos do curso.
- O parceiro/ONG responsável pelo curso tem acesso aos dados do candidato para gestão.
- O histórico do usuário é atualizado para facilitar futuras sugestões de emprego após a conclusão do curso.

## Pontos de Extensão
- Esse caso de uso não possui pontos de extensão.
