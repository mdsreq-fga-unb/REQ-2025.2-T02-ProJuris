# Autenticar Usuário

## Breve descrição
Este caso de uso permite que um usuário previamente cadastrado realize login na plataforma HopeBridge. O sistema valida as credenciais fornecidas e concede acesso às funcionalidades compatíveis com o perfil do usuário. O caso de uso contempla autenticação online e offline, garantindo continuidade operacional em ambientes com conectividade limitada.

## Atores
- Refugiado  
- Agência Humanitária  
- Empregador Parceiro  
- Administrador

## Fluxo Principal
1. O sistema apresenta o formulário de autenticação solicitando E-mail ou Telefone e Senha.  
2. O usuário insere as credenciais e confirma o envio.
3. O sistema verifica a existência de conexão com a rede de dados [RN01][FA01]
4. O sistema valida as credenciais fornecidas [RN02][FE01]. 
5. O sistema verifica o status da conta [FE02].
6. O sistema identifica o perfil do usuário e carrega as permissões correspondentes [RN03].
7. O sistema registra a tentativa de acesso bem-sucedida no log de auditoria [RN04].
8. O sistema redireciona o usuário ao Dashboard específico do seu perfil.
9. O caso de uso é encerrado.

## Fluxos Alternativos

#### [FA01] Autenticação em Modo Offline
Inicia-se no passo 3 o sistema identifica ausência de conectividade com a internet.
1. O sistema verifica a existência de token de sessão local válido [RN05][FE03].
2. O sistema valida a integridade e prazo de validade do token local [RN05].
3. O sistema autentica o usuário em Modo Restrito, permitindo acesso apenas a funcionalidades e dados em cache.
4. O sistema exibe mensagem: "Você está offline. Alguns recursos podem estar indisponíveis."
5. Retorna ao passo 6.


#### [FA02] Recuperação de Senha
Inicia-se no passo 1 o usuário seleciona a opção "Esqueci minha senha".
1. O sistema direciona o usuário para o caso de uso "Recuperar Credenciais de Acesso".

## Fluxos de Exceção

#### [FE01] Credenciais Inválidas
Inicia-se no passo 4 o sistema identifica que as credenciais não correspondem aos dados armazenados.
1. O sistema incrementa o contador de tentativas falhas.
2. O sistema apresenta mensagem: "Usuário ou senha inválidos."
3. O sistema retorna ao passo 1.

#### [FE02] Conta Bloqueada ou Inativa
Inicia-se no passo 5 o sistema identifica que a conta está bloqueada ou inativa.
1. O sistema apresenta mensagem: "Sua conta encontra-se bloqueada. Entre em contato com o suporte."
2. O caso de uso é encerrado.


#### [FE03] Token Local Inválido ou Expirado
Inicia-se no passo 1 do [FA01] o sistema identifica que não existe token válido ou o token está expirado.
1. O sistema apresenta mensagem: "Não é possível acessar o sistema offline. Conecte-se à internet para autenticar."
2. O sistema retorna ao passo 1.

## Requisitos Especiais
- **RE01**: Toda comunicação entre cliente e servidor deve ocorrer por meio de protocolo HTTPS/TLS.
- **RE02**: A interface de autenticação deve ser responsiva e otimizada para dispositivos móveis de baixo desempenho.

## Regras de Negócio
- **[RN01]**: O sistema deve verificar a conectividade com a rede antes de enviar as credenciais. Em caso de falha, acionar [FA01].
- **[RN02]**: Senhas devem ser validadas por meio de comparação entre hash fornecido e hash armazenado na base central. Algoritmos seguros como bcrypt ou Argon2 devem ser utilizados. Armazenamento ou tráfego em texto plano é proibido.
- **[RN03]**: Após autenticação bem-sucedida, o sistema deve redirecionar automaticamente o usuário ao Dashboard correspondente ao seu perfil: Refugiado, Agência Humanitária, Empregador Parceiro ou Administrador.
- **[RN04]**: Todas as tentativas de login devem ser registradas em log contendo: timestamp, identificador informado, endereço IP (quando online), ID do dispositivo e resultado da tentativa.
- **[RN05]**: Tokens de acesso para operação offline devem possuir validade máxima de 30 dias. Renovação exige autenticação online.

## Pré-condições
- **PRE01**: O usuário deve possuir cadastro ativo na plataforma HopeBridge.

## Pós-condições
- **POS01**: Uma sessão autenticada é estabelecida no dispositivo.
- **POS02**: As permissões de acesso são carregadas na camada de aplicação.
- **POS03**: Todas as operações são registradas em log para fins de auditoria.

## Pontos de Extensão
- **PE01**: No passo 1 este caso de uso pode ser estendido por "Recuperar Credenciais de Acesso".
