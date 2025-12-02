# Solicitar Serviços

## Breve Descrição
Este caso de uso permite que refugiados palestinos solicitem acesso a serviços essenciais disponíveis na plataforma HopeBridge, como reserva de vagas em abrigos, agendamento de consultas médicas ou solicitação de vouchers para alimentos e itens de primeira necessidade. O sistema identifica os serviços disponíveis com base no perfil e localização do usuário, facilitando o acesso a recursos que atendam às suas necessidades prioritárias.

## Atores
- Refugiado

## Fluxo de Eventos

### Fluxo Principal
1. O refugiado acessa a plataforma HopeBridge e realiza autenticação.
2. O sistema exibe a tela inicial com os serviços personalizados com base no perfil e localização do usuário [RN01].
3. O refugiado seleciona a opção "Solicitar Serviço".
4. O sistema apresenta as categorias de serviços disponíveis (Abrigo, Saúde, Alimentação, Educação, Capacitação).
5. O refugiado seleciona a categoria desejada.
6. O sistema exibe a lista de serviços disponíveis na categoria selecionada, mostrando informações detalhadas como localização, horários de funcionamento, capacidade disponível e contato do provedor [FA01] [RN02].
7. O refugiado seleciona o serviço específico que deseja solicitar.
8. O sistema apresenta um formulário de solicitação com campos pré-preenchidos baseados no perfil do usuário.
9. O refugiado revisa as informações, adiciona observações se necessário, e confirma a solicitação.
10. O sistema valida os dados da solicitação [FE01] [FE02].
11. O sistema gera um protocolo único para a solicitação [RN03].
12. O sistema registra a solicitação e envia notificação ao provedor do serviço.
13. O sistema exibe mensagem de confirmação com o número do protocolo e informações sobre os próximos passos [FA02].
14. O caso de uso é encerrado.

### Fluxos Alternativos

#### [FA01] Visualizar Mapa Interativo
Inicia-se no passo 6 quando o refugiado deseja visualizar a localização dos serviços em um mapa.
1. O refugiado seleciona a opção "Ver no Mapa".
2. O sistema exibe um mapa interativo com os serviços disponíveis marcados geograficamente.
3. O sistema mostra rotas e opções de transporte até o local [RN04].
4. O refugiado pode selecionar um serviço diretamente no mapa.
5. Retorna ao passo 7.

#### [FA02] Agendar Horário Específico
Inicia-se no passo 13 quando o serviço requer agendamento de horário.
1. O sistema verifica se o serviço solicitado exige agendamento [RN05].
2. O sistema apresenta calendário com horários disponíveis.
3. O refugiado seleciona data e horário preferidos.
4. O sistema confirma o agendamento e atualiza o protocolo com as informações de data/hora.
5. O sistema envia notificação de lembrete 24 horas antes do horário agendado.
6. Retorna ao passo 14.

### Fluxos de Exceção

#### [FE01] Serviço sem Disponibilidade
Inicia-se no passo 10 quando o serviço selecionado não possui vagas ou recursos disponíveis.
1. O sistema identifica que o serviço está com capacidade esgotada.
2. O sistema exibe mensagem informando a indisponibilidade temporária.
3. O sistema oferece opção de incluir o refugiado em lista de espera [FA03].
4. O sistema sugere serviços alternativos similares na região.
5. O caso de uso retorna ao passo 6.

#### [FE02] Dados Obrigatórios Ausentes
Inicia-se no passo 10 quando informações obrigatórias não foram preenchidas.
1. O sistema identifica campos obrigatórios vazios ou inválidos.
2. O sistema destaca os campos que precisam ser corrigidos.
3. O sistema exibe mensagem de orientação ao usuário.
4. O caso de uso retorna ao passo 9.

#### [FE03] Falha de Conectividade
Pode ocorrer em qualquer momento durante o fluxo principal.
1. O sistema detecta perda de conexão com a internet.
2. O sistema ativa modo offline e armazena a solicitação localmente [RN06].
3. O sistema exibe mensagem informando que a solicitação será sincronizada quando a conexão for restabelecida.
4. Quando a conexão retorna, o sistema sincroniza automaticamente a solicitação.
5. O caso de uso continua normalmente.

## Requisitos Especiais
- **RE01**: A interface deve ser intuitiva e acessível para usuários com baixa familiaridade tecnológica.
- **RE02**: O sistema deve suportar múltiplos idiomas, incluindo árabe e inglês.
- **RE03**: A plataforma deve funcionar em dispositivos simples com recursos limitados.
- **RE04**: O sistema deve operar em modo offline, permitindo armazenamento local de solicitações em áreas sem conectividade estável.
- **RE05**: O tempo de resposta para exibição da lista de serviços não deve exceder 3 segundos em condições normais de rede.
- **RE06**: O sistema deve ser compatível com tecnologias assistivas para garantir acessibilidade.

## Regras de Negócio
- **[RN01]**: O sistema deve apresentar serviços personalizados baseados nas necessidades informadas no perfil do refugiado (localização, tamanho da família, necessidades específicas).
- **[RN02]**: Serviços exibidos devem estar dentro de um raio de 50 km da localização atual do refugiado, salvo em regiões com escassez de recursos.
- **[RN03]**: O protocolo de solicitação deve ser gerado no formato AAAAMMDD-HHMMSS-SEQ, onde SEQ é um número sequencial de 4 dígitos.
- **[RN04]**: As rotas sugeridas devem priorizar transporte público disponível e segurança do trajeto.
- **[RN05]**: Serviços de saúde e capacitação profissional exigem agendamento prévio com horário específico.
- **[RN06]**: Solicitações criadas em modo offline devem ser sincronizadas automaticamente em até 24 horas após o restabelecimento da conexão, mantendo a ordem cronológica de criação.

## Pré-condições
- **PRE01**: O refugiado deve estar registrado na plataforma HopeBridge com perfil completo.
- **PRE02**: O refugiado deve estar autenticado no sistema.
- **PRE03**: O perfil do refugiado deve conter informações mínimas obrigatórias: nome, localização atual e pelo menos uma necessidade identificada.
- **PRE04**: Deve haver pelo menos um provedor de serviço cadastrado na região do refugiado.

## Pós-condições
- **POS01**: A solicitação de serviço é registrada no sistema com status "Pendente".
- **POS02**: Um protocolo único é gerado e associado à solicitação.
- **POS03**: O provedor do serviço recebe notificação sobre a nova solicitação.
- **POS04**: O refugiado recebe confirmação com número de protocolo e orientações sobre próximos passos.
- **POS05**: Log de auditoria é gerado registrando data, hora, usuário e tipo de serviço solicitado.
- **POS06**: Indicadores de demanda são atualizados para análise de agências humanitárias.

## Pontos de Extensão
- **PE01**: No passo 6, este caso de uso pode ser estendido por "Visualizar Detalhes do Provedor de Serviço".
- **PE02**: No passo 13, este caso de uso pode ser estendido por "Acompanhar Status da Solicitação".
- **PE03**: Em [FA02.2], este caso de uso pode ser estendido por "Reagendar Serviço" caso o refugiado precise alterar a data/hora posteriormente.
