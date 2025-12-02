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

---

# 3.1 Gerenciar Estoque de Recursos

### Breve descrição
Permite que a Agência Humanitária registre, atualize e monitore itens do estoque (alimentos, kits, medicamentos etc.), mantendo o inventário confiável.

### Atores
- Agência Humanitária (principal)  
- Sistema HopeBridge (secundário)

### Fluxo Principal
1. Ator acessa o painel e seleciona *Gerenciar Estoque*.  
2. Sistema exibe itens, quantidade, local e nível mínimo configurado.  
3. Ator seleciona *Adicionar*, *Atualizar* ou *Remover*.  
4. Preenche formulário (tipo, quantidade, validade, localização).  
5. Sistema valida e salva ajuste no inventário.  
6. Se níveis estiverem críticos, exibem-se alertas.

### Fluxos Alternativos
- FA01: Atualizar item sem alterar quantidade.  
- FA02: Remover item por dano ou vencimento.  
- FA03: Anexar documentos como notas fiscais ou comprovantes.

### Fluxos de Exceção
- FE01: Tentativa de estoque negativo.  
- FE02: Campos obrigatórios não preenchidos.

### Requisitos Especiais
- Suporte offline com sincronização posterior.  
- Interface responsiva.

### Regras de Negócio
- RN01: Toda alteração deve gerar log de auditoria.  
- RN02: Itens com validade <60 dias devem ter alerta.  
- RN03: Quantidade influencia disponibilidade de serviços.

### Pré-condições
- Ator autenticado e autorizado.

### Pós-condições
- Estoque atualizado e log registrado.

---

# 3.2 Autenticar Usuário

### Breve descrição
Permite login com autenticação online/offline e direcionamento conforme perfil.

### Atores
- Refugiado  
- Agência Humanitária  
- Empregador Parceiro  
- Administrador

### Fluxo Principal
1. Usuário acessa o formulário de login.  
2. Sistema verifica conectividade.  
3. Valida credenciais.  
4. Identifica perfil e carrega permissões.  
5. Direciona ao dashboard.

### Fluxos Alternativos
- FA01: Autenticação offline com token local (validade 30 dias).  
- FA02: Recuperação de senha.

### Fluxos de Exceção
- FE01: Credenciais inválidas.  
- FE02: Conta inativa/bloqueada.  
- FE03: Token offline expirado.

### Requisitos Especiais
- Criptografia de senhas.  
- Log de tentativas.

### Regras de Negócio
- RN01: Todas as tentativas são auditadas.  
- RN02: Tokens offline têm validade definida.  

### Pré-condições
- Usuário cadastrado.

### Pós-condições
- Sessão iniciada e permissões aplicadas.

---

# 3.3 Solicitar Serviços

### Breve descrição
Permite que refugiados solicitem serviços como abrigo, saúde, alimentação ou cursos.

### Atores
- Refugiado

### Fluxo Principal
1. Usuário acessa lista personalizada de serviços.  
2. Seleciona categoria e serviço.  
3. Preenche formulário de solicitação.  
4. Sistema valida disponibilidade.  
5. Gera protocolo e notifica provedor.

### Fluxos Alternativos
- FA01: Exibir mapa interativo.  
- FA02: Agendar horário quando necessário.

### Fluxos de Exceção
- FE01: Serviço indisponível → oferecer alternativas.  
- FE02: Modo offline → armazenar solicitação localmente.

### Requisitos Especiais
- Interface multilíngue (árabe/inglês).  
- Modo offline com sincronização em 24h.

### Regras de Negócio
- RN01: Protocolo segue padrão AAAAMMDD-HHMMSS-SEQ.  
- RN02: Serviços exibidos em raio de 50 km.  
- RN03: Personalização por perfil.  

### Pré-condições
- Refugiado autenticado.

### Pós-condições
- Solicitação registrada com status inicial *Pendente*.

---

# 3.4 Rastrear Status de Solicitações Submetidas

### Breve descrição
Painel para agências visualizarem solicitações, históricos e relatórios.

### Atores
- Agência Humanitária

### Fluxo Principal
1. Seleciona *Rastrear Solicitações*.  
2. Visualiza dashboard com indicadores.  
3. Filtra por status, tipo, período ou região.  
4. Seleciona solicitação para ver histórico completo.

### Fluxos Alternativos
- FA01: Buscar por protocolo.  
- FA02: Visualizar mapa de demanda.  
- FA03: Gerar relatórios (PDF, CSV).  
- FA04: Registrar observação.

### Fluxos de Exceção
- FE01: Protocolo inválido.  
- FE02: Solicitação não encontrada.  
- FE03: Falha ao carregar dados.

### Requisitos Especiais
- Exportação de dados.  
- Suporte offline parcial.

### Regras de Negócio
- RN01: Solicitações pendentes >72h destacadas.  
- RN02: Todas observações são auditadas.  
- RN03: Privacidade com dados anonimizados.

### Pré-condições
- Acesso da Agência Humanitária.

### Pós-condições
- Dados consultados e ações auditadas.

---

# 3.5 Candidatar-se para Curso

### Breve descrição
Permite ao refugiado visualizar cursos recomendados e se inscrever.

### Atores
- Refugiado

### Fluxo Principal
1. Sistema lista cursos recomendados.  
2. Usuário visualiza detalhes.  
3. Solicita inscrição.  
4. Sistema valida pré-requisitos.  
5. Confirma inscrição.

### Fluxos Alternativos
- FA01: Operação offline (fila de sincronização).  
- FA02: Filtro manual de cursos.

### Fluxos de Exceção
- FE01: Perfil incompleto.  
- FE02: Vagas esgotadas.

### Regras de Negócio
- RN01: Cursos recomendados por perfil.  
- RN02: Notificação a parceiros após inscrição.

### Pré-condições
- Refugiado autenticado.

### Pós-condições
- Inscrição registrada.

---

# 3.6 Consultar Usuários

### Breve descrição
Permite que administradores consultem usuários, visualizem totais e gerenciem perfis.

### Atores
- Administrador do Sistema

### Fluxo Principal
1. Administrador acessa *Gerenciar Usuários*.  
2. Vê categorias e contadores (ativos/inativos).  
3. Expande categoria para detalhes.  
4. Acessa lista de usuários inativos.

### Fluxos Alternativos
- FA01: Remover usuários.

### Fluxos de Exceção
- FE01: Offline sem cache → contagem impossível.

### Regras de Negócio
- RN01: Cache JSON para operação offline.  
- RN02: Recontagem apenas ao reiniciar.  

### Pré-condições
- Administrador autenticado.

### Pós-condições
- Dados exibidos e ações registradas.

---

## 4. Regras de Negócio e Requisitos Transversais

- Auditoria obrigatória em ações críticas.  
- Suporte offline em vários módulos (estoque, solicitações, cursos).  
- Multilíngue (árabe/inglês).  
- Tempo de resposta ≤3 segundos em listagens e dashboards.  
- Compatibilidade com dispositivos simples.  
- Segurança reforçada (criptografia, logs, tokens de acesso).  
