# Autenticar Usuário

## Breve descrição
Permite login com autenticação online/offline e direcionamento conforme perfil.

## Atores
- Refugiado  
- Agência Humanitária  
- Empregador Parceiro  
- Administrador

## Fluxo Principal
1. Usuário acessa o formulário de login.  
2. Sistema verifica conectividade.  
3. Valida credenciais.  
4. Identifica perfil e carrega permissões.  
5. Direciona ao dashboard.

## Fluxos Alternativos
- FA01: Autenticação offline com token local (validade 30 dias).  
- FA02: Recuperação de senha.

## Fluxos de Exceção
- FE01: Credenciais inválidas.  
- FE02: Conta inativa/bloqueada.  
- FE03: Token offline expirado.

## Requisitos Especiais
- Criptografia de senhas.  
- Log de tentativas.

## Regras de Negócio
- RN01: Todas as tentativas são auditadas.  
- RN02: Tokens offline têm validade definida.  

## Pré-condições
- Usuário cadastrado.

## Pós-condições
- Sessão iniciada e permissões aplicadas.
