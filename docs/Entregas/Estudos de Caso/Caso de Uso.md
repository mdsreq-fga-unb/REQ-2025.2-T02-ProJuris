# Estudo de Caso — HopeBridge (Diagrama de Casos de Uso)

 Reconstruindo vidas e comunidades de refugiados palestinos — exercício de Diagrama de Casos de Uso.

---

## Acessar Mirro
- **Board Miro (espaço para mapa/US/diagrama):**  
  [Acessar o board no Miro](https://miro.com/app/board/uXjVJlD_SGQ=/)

---

## O que é este estudo de caso
Este documento reúne o contexto, as orientações e os principais casos de uso identificados para a plataforma **HopeBridge**, além de um resumo das especificações de casos de uso presentes no material do grupo. O objetivo é servir como página de referência do estudo de caso e apoiar a construção do diagrama de casos de uso. 

---


## 1. Introdução e contexto
A HopeBridge é uma plataforma projetada para apoiar refugiados palestinos, conectando-os a serviços essenciais — como abrigo, saúde, alimentação e capacitação — enquanto provê ferramentas para agências humanitárias gerirem recursos, monitorarem solicitações e gerarem relatórios.  
Os casos de uso documentados oferecem suporte a acessibilidade, operação em baixa conectividade, auditoria e escalabilidade.

---

## 2. Atores principais
- **Refugiado**  
- **Agência Humanitária**  
- **Administrador do Sistema**  
- **Empregador Parceiro / Provedor de Serviço**  
- **Sistema HopeBridge** (ator secundário em algumas interações)

---

## 3. Casos de Uso

### 3.1 Gerenciar Estoque de Recursos

#### 3.1.1 Breve descrição
Permite que a Agência Humanitária registre a entrada, monitore e atualize a contagem de recursos físicos (alimentos, medicamentos, água, kits de higiene, entre outros) em diferentes locais de armazenamento. O controle de estoque é fundamental para garantir que os dados de disponibilidade de serviços no sistema estejam sempre atualizados para os refugiados e para informar as estratégias de distribuição.

#### 3.1.2 Atores
- Agência Humanitária (Primário): O ator que inicia e executa as ações de gestão;
- Sistema HopeBridge (Secundário): Responde, valida dados e atualiza o inventário.

#### 3.1.3 Fluxo Principal
O fluxo principal descreve o caminho de sucesso para adicionar estoque. O fluxo pressupõe que o ator já realizou o login.

1. O Sistema exibe o painel de controle e o ator seleciona a opção "Gestão de Estoque".  
2. O Sistema apresenta a tabela de inventário atual com filtros e o Nível Mínimo de Alerta configurado para cada item.  
3. O ator seleciona a ação: Adicionar Estoque, Atualizar Item ([FA01]) ou Remover Item ([FA02]).
4. Se Adicionar Estoque: O ator preenche o formulário com o tipo de recurso, a quantidade de entrada, o local de armazenamento e, opcionalmente, a data de validade. 
5. O Sistema valida os dados do formulário (Exceção: [FE01]). 
6. O Sistema registra a entrada do estoque (aumento da quantidade) e atualiza o inventário com timestamp e ID do ator. (Referência: [RN01]).
7. O Sistema verifica o novo nível de estoque. Se o nível cair abaixo do limite, dispara uma notificação. (Referência: [PE01]).
8. O Sistema exibe uma mensagem de sucesso ("Estoque atualizado com sucesso").
9. O fluxo termina.

#### 3.1.4 Fluxos Alternativos
[FA01] Atualizar Detalhes do Item (Não Quantidade): 

- Passo de Origem: 2.1.3.
- O ator seleciona um item na tabela e altera detalhes como localização ou descrição, mantendo a quantidade. O fluxo segue para 2.1.5 (Validação) e retorna a 2.1.8.

[FA02] Remoção de Item por Vencimento ou Dano:

- Passo de Origem: 2.1.3.
-  O ator seleciona um item e escolhe Remover Item. O ator deve inserir
o motivo (ex: Vencimento, Dano). O Sistema registra a saída com o
motivo (Referência: [RN01]) e o remove do inventário. O fluxo retorna
a 2.1.8.

[FA03] Anexar Documentos de Recebimento:

- Passo de Origem: 2.1.4.
- O ator anexa o arquivo de Nota Fiscal ou Documento de Doação
(Referência: [PE02]) antes de submeter o formulário. O Sistema
armazena o documento com o registro de estoque. O fluxo continua em
2.1.5.

#### 3.1.5 Fluxos de Exceção

[FE01] Falha na Validação de Dados:

- Passo de Origem: 2.1.5.
- O Sistema identifica um campo obrigatório faltando (ex: Quantidade) ou dados em formato inválido. O Sistema interrompe a atualização, realça o(s) campo(s) com erro e exibe a mensagem: "Falha na validação. Corrija os campos em destaque." O fluxo retorna ao Passo 2.1.4.

[FE02] Tentativa de Estoque Negativo:

- Passo de Origem: 2.1.6.
- O ator tenta atualizar um item de estoque com uma saída que resultaria em quantidade menor que zero (estoque negativo). O Sistema rejeita a operação e exibe a mensagem de erro: "Operação negada. A quantidade de saída excede o estoque disponível." O fluxo retorna ao Passo 2.1.3.

#### 3.1.6 Requisitos Especiais
- RS01: O gerenciamento de estoque deve permitir o registro temporário de entradas/saídas em modo offline (localmente no dispositivo), com sincronização automática e em background assim que a conectividade for restabelecida.
- RS02: A interface de entrada de dados (formulário) deve ser compatível e responsiva para uso em tablets e smartphones.

#### 3.1.7 Regras de Negócio
- [RN01] Toda alteração na quantidade do estoque (entrada, saída/distribuição, remoção) deve gerar um log de auditoria contendo timestamp, o ID do ator e a razão da mudança.
- [RN02] O Sistema deve gerar um alerta visual se um item de estoque possuir uma data de validade inferior a 60 dias.
- [RN03] Cada tipo de recurso deve ter um Nível Mínimo de Alerta configurável pelo Gestor de Estoque.
- [RN04] A quantidade de estoque disponível deve ser o dado primário para determinar a disponibilidade de serviços relacionados nos UCs de busca dos Refugiados.

#### 3.1.8 Pré-condições
- O ator deve estar autenticado no sistema com acesso a funcionalidades de Gestão de Recursos (permissão de Gestor de Recursos).
- O banco de dados de inventário deve estar acessível.

#### 3.1.9 Pós-condições
- Estoque atualizado e log registrado.

## 3.2 Autenticar Usuário

#### 3.2.1 Breve descrição
Permite login com autenticação online/offline e direcionamento conforme perfil.

#### 3.2.2 Atores
- Refugiado  
- Agência Humanitária  
- Empregador Parceiro  
- Administrador

#### 3.2.3 Fluxo Principal
1. Usuário acessa o formulário de login.  
2. Sistema verifica conectividade.  
3. Valida credenciais.  
4. Identifica perfil e carrega permissões.  
5. Direciona ao dashboard.

#### 3.2.4 Fluxos Alternativos
- FA01: Autenticação offline com token local (validade 30 dias).  
- FA02: Recuperação de senha.

#### 3.2.5 Fluxos de Exceção
- FE01: Credenciais inválidas.  
- FE02: Conta inativa/bloqueada.  
- FE03: Token offline expirado.

#### 3.2.6 Requisitos Especiais
- Criptografia de senhas.  
- Log de tentativas.

#### 3.2.7 Regras de Negócio
- RN01: Todas as tentativas são auditadas.  
- RN02: Tokens offline têm validade definida.  

#### 3.2.8 Pré-condições
- Usuário cadastrado.

#### 3.2.9 Pós-condições
- Sessão iniciada e permissões aplicadas.

## 3.3 Solicitar Serviços

#### 3.3.1 Breve descrição
Permite que refugiados solicitem serviços como abrigo, saúde, alimentação ou cursos.

#### 3.3.2 Atores
- Refugiado

#### 3.3.3 Fluxo Principal
1. Usuário acessa lista personalizada de serviços.  
2. Seleciona categoria e serviço.  
3. Preenche formulário de solicitação.  
4. Sistema valida disponibilidade.  
5. Gera protocolo e notifica provedor.

#### 3.3.4 Fluxos Alternativos
- FA01: Exibir mapa interativo.  
- FA02: Agendar horário quando necessário.

#### 3.3.5 Fluxos de Exceção
- FE01: Serviço indisponível → oferecer alternativas.  
- FE02: Modo offline → armazenar solicitação localmente.

#### 3.3.6 Requisitos Especiais
- Interface multilíngue (árabe/inglês).  
- Modo offline com sincronização em 24h.

#### 3.3.7 Regras de Negócio
- RN01: Protocolo segue padrão AAAAMMDD-HHMMSS-SEQ.  
- RN02: Serviços exibidos em raio de 50 km.  
- RN03: Personalização por perfil.  

#### 3.3.8 Pré-condições
- Refugiado autenticado.

#### 3.3.9 Pós-condições
- Solicitação registrada com status inicial *Pendente*.

## 3.4 Rastrear Status de Solicitações Submetidas

#### 3.4.1 Breve descrição
Painel para agências visualizarem solicitações, históricos e relatórios.

#### 3.4.2 Atores
- Agência Humanitária

#### 3.4.3 Fluxo Principal
1. Seleciona *Rastrear Solicitações*.  
2. Visualiza dashboard com indicadores.  
3. Filtra por status, tipo, período ou região.  
4. Seleciona solicitação para ver histórico completo.

#### 3.4.4 Fluxos Alternativos
- FA01: Buscar por protocolo.  
- FA02: Visualizar mapa de demanda.  
- FA03: Gerar relatórios (PDF, CSV).  
- FA04: Registrar observação.

#### 3.4.5 Fluxos de Exceção
- FE01: Protocolo inválido.  
- FE02: Solicitação não encontrada.  
- FE03: Falha ao carregar dados.

#### 3.4.6 Requisitos Especiais
- Exportação de dados.  
- Suporte offline parcial.

#### 3.4.7 Regras de Negócio
- RN01: Solicitações pendentes >72h destacadas.  
- RN02: Todas observações são auditadas.  
- RN03: Privacidade com dados anonimizados.

#### 3.4.8 Pré-condições
- Acesso da Agência Humanitária.

#### 3.4.9 Pós-condições
- Dados consultados e ações auditadas.

## 3.5 Candidatar-se para Curso

#### 3.5.1 Breve descrição
Permite ao refugiado visualizar cursos recomendados e se inscrever.

#### 3.5.2 Atores
- Refugiado

#### 3.5.3 Fluxo Principal
1. Sistema lista cursos recomendados.  
2. Usuário visualiza detalhes.  
3. Solicita inscrição.  
4. Sistema valida pré-requisitos.  
5. Confirma inscrição.

#### 3.5.4 Fluxos Alternativos
- FA01: Operação offline (fila de sincronização).  
- FA02: Filtro manual de cursos.

#### 3.5.5 Fluxos de Exceção
- FE01: Perfil incompleto.  
- FE02: Vagas esgotadas.

#### 3.5.6 Regras de Negócio
- RN01: Cursos recomendados por perfil.  
- RN02: Notificação a parceiros após inscrição.

#### 3.5.7 Pré-condições
- Refugiado autenticado.

#### 3.5.8 Pós-condições
- Inscrição registrada.

## 3.6 Consultar Usuários

#### 3.6.1 Breve descrição
Permite que administradores consultem usuários, visualizem totais e gerenciem perfis.

#### 3.6.2 Atores
- Administrador do Sistema

#### 3.6.3 Fluxo Principal
1. Administrador acessa *Gerenciar Usuários*.  
2. Vê categorias e contadores (ativos/inativos).  
3. Expande categoria para detalhes.  
4. Acessa lista de usuários inativos.

#### 3.6.4 Fluxos Alternativos
- FA01: Remover usuários.

#### 3.6.5 Fluxos de Exceção
- FE01: Offline sem cache → contagem impossível.

#### 3.6.6 Regras de Negócio
- RN01: Cache JSON para operação offline.  
- RN02: Recontagem apenas ao reiniciar.  

#### 3.6.7 Pré-condições
- Administrador autenticado.

#### 3.6.8 Pós-condições
- Dados exibidos e ações registradas.

---

## 4. Regras de Negócio e Requisitos Transversais

- Auditoria obrigatória em ações críticas.  
- Suporte offline em vários módulos (estoque, solicitações, cursos).  
- Multilíngue (árabe/inglês).  
- Tempo de resposta ≤3 segundos em listagens e dashboards.  
- Compatibilidade com dispositivos simples.  
- Segurança reforçada (criptografia, logs, tokens de acesso).  
