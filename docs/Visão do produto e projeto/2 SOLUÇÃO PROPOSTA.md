## 2.1 Objetivos do Produto

### Objetivos Geral

Superar as limitações do controle manual de processos jurídicos no escritório Cortes, Santos Advogados, por meio de uma solução digital que aumente a eficiência operacional, a transparência interna e a qualidade da comunicação com clientes.

### Objetivos Específicos

| Código | Objetivo Específico |
| - | - |
| OE1 | Facilitar a visualização das demandas internas, assegurando uma divisão clara entre pendentes, em andamento, enviadas para revisão e concluídas. |
| OE2 | Reduzir a sobrecarga do sócio na atribuição de tarefas, permitindo que o fluxo de demandas seja distribuído de forma mais ágil e organizada. |
| OE3 | Minimizar riscos de falhas no cumprimento de prazos processuais, garantindo maior confiabilidade no acompanhamento. |
| OE4 | Melhorar a comunicação com clientes por meio de atualizações proativas sobre o andamento de seus processos. |
| OE5 | Fornecer indicadores de desempenho que apoiem a tomada de decisão estratégica e o controle das operações. |

## 2.2 Características da Solução

O produto deverá contemplar as seguintes funcionalidades principais:

- **Cadastro de Usuários(OE2)**: possibilitar o registro de diferentes perfis de acesso, diferenciando papéis e responsabilidades, tais como administrador (chefe do escritório) e colaborador (funcionário, estagiário), de forma a garantir maior controle sobre as funcionalidades disponíveis para cada tipo de usuário.

- **Painel de Controle(OE2), (OE3)**: fornece um ambiente centralizado para gerenciar e visualizar as demandas do escritório, permitindo sua organização em períodos diários, semanais ou personalizados. O painel deverá apresentar métricas gerais de desempenho, auxiliando no acompanhamento do volume e do andamento das atividades.

- **Status das Demandas(OE1)**: dentro do Painel de Controle, cada demanda será representada por fichas coloridas, que indicarão de forma clara e intuitiva seu status atual (pendente, em andamento, em revisão ou concluída). Essa visualização facilitará a transparência e o monitoramento do progresso das tarefas.

- **Anexação e Gerenciamento de Arquivos**: os usuários poderão anexar, enviar, receber e visualizar arquivos, que serão armazenados de forma organizada em banco de dados seguro, garantindo acesso posterior sempre que necessário.

- **Dashboard de Indicadores(OE5)**: Uma tela principal que apresentará, de forma visual e centralizada, os principais indicadores de desempenho do escritório. Incluirá gráficos sobre o volume de tarefas (concluídas vs. pendentes), o tempo médio de conclusão das demandas e a taxa de cumprimento de prazos, permitindo a identificação rápida de gargalos e a tomada de decisões estratégicas com base em dados.

- **Notificações Automáticas(OE3)**: os usuários receberão alertas sobre atualizações de status, prazos próximos ou novos documentos anexados, assegurando o acompanhamento em tempo real das demandas. Essa é uma funcionalidade secundária do sistema que o cliente insistiu.

- **Segurança da Informação**: serão implementados mecanismos de autenticação e controle de acesso, assegurando a proteção dos dados armazenados e a confidencialidade das informações.

- **Repositório e Pesquisa de Cláusulas**: Um módulo que poderá ser implementado posteriormente para armazenamento de cláusulas contratuais, de honorários e outros textos jurídicos reutilizáveis. Contará com um mecanismo de pesquisa por palavras-chave que permitirá à equipe localizar e copiar rapidamente o conteúdo necessário, agilizando a elaboração de novos documentos.

## 2.3 Tecnologias a Serem Utilizadas

A solução será desenvolvida em uma arquitetura web moderna a fim de garantir a segurança e escalabilidade do produto de software. Construído em modelo MVC, as tecnologias foram escolhidas baseado na experiência da equipe e em como poderíamos adequar ao domínio jurídico que exige controle rígido de segurança e dados bem estruturado, por isso aderimos ao ecossistema **JavaScript**.

- **Frontend**: Dado os perfis de usuários distintivos que vão acessar as interfaces, precisamos de algo que seja dinâmico e que suporte incrementação alinhada às iterações do produto, por isso escolhemos o **React**, que se adequa muito bem ao sistema, e possui suporte de tecnologias modernas para dashboards de indicadores.

- **Backend**: Para que seja construído a API do sistema com toda lógica e segurança, optamos por seguir com **Node.js** e **Express**, essa escolha se dá, principalmente pela uniformidade da linguagem, que acelera o desenvolvimento e a dinâmica da equipe.

- **Banco de dados**: Para o armazenamento estruturado das informações jurídicas, será utilizado o **MySQL**, banco de dados relacional conhecido por sua confiabilidade, segurança e robustez. Essa escolha é estratégica para lidar com prazos, processos, usuários e controles de acesso de forma consistente, além de facilitar a migração das planilhas Excel utilizadas atualmente pelo cliente.

- **Chatbot**: O chatbot do LegisPro será responsável por notificar clientes sobre o andamento de seus processos jurídicos e responder dúvidas simples. A solução utilizará a API oficial do WhatsApp Business, integrada ao backend em Node.js por meio de um provedor BSP (como Blip ou Twilio), garantindo envio seguro e escalável de mensagens. O backend será responsável por disparar notificações automáticas sempre que houver eventos relevantes no sistema (como mudança de status ou anexação de documentos), preencher modelos de mensagem pré-aprovados com dados do MySQL e disponibilizar respostas a perguntas frequentes. Essa abordagem centraliza a lógica no backend e mantém uniformidade tecnológica, permitindo comunicação eficiente, padronizada e alinhada às necessidades de transparência do escritório.

## 2.4 Pesquisa de Mercado e Análise Competitiva

O mercado brasileiro de softwares jurídicos oferece diversas plataformas maduras voltadas ao controle de prazos, gerenciamento documental e painéis de controle (como Projuris, Astrea, ADVBOX e entre outros). Apesar da robustez funcional dessas soluções, observam-se lacunas relevantes para escritórios conservadores e enxutos como o Cortes, Santos Advogados: rigidez de fluxos, dificuldades na migração de dados vindos de Excel, e automações que, quando impostas de forma genérica, podem comprometer o atendimento personalizado.

As soluções já existentes no mercado costumam oferecer: 

- Centralização de processos e documentos, reduzindo o uso de planilhas;

- Controle de prazos e notificações automáticas;

- Repositórios de modelos e templates reutilizáveis;

- Dashboards e indicadores gerenciais para apoio à decisão;

Esses recursos justificam a adoção em escritórios que precisam organizar volume de trabalho e comprovar conformidade com regras de prazo.

Para diferenciar e alinhar a solução às prioridades do Cortes, Santos Advogados, recomendamos os seguintes diferenciais, que deverão constar no documento de visão:

- Workflow visual dinâmico;

- Visualização por etapas (exemplo.: elaboração → revisão → pendente cliente → concluída) com filtros rápidos e responsável visível por demanda;

- Importador assistido de planilhas (Excel → sistema);

- Controle de acesso granular e auditoria;

- Permissões por processo e trilhas de auditoria (quem fez o quê e quando), garantindo confidencialidade e conformidade com boas práticas de governança de dados;

- Notificações e relatórios configuráveis (mantendo opção manual);

- Templates para relatórios de andamento (resumido/detalhado), envio automático por evento e opção de envio manual para preservar o atendimento pessoal;

- Repositório pesquisável de cláusulas e modelos;

- Banco de cláusulas/honorários com pesquisa por palavras, tags e snippets integrados ao editor de peças;

- Automação de envio de mensagens para os seus devidos clientes (via WhatsApp);

Diferenciar o produto por meio de um workflow visual, importador assistido, controles de acesso granulares e automações configuráveis permitirá atender às necessidades centrais do Cortes, Santos Advogados: visibilidade do fluxo, redução de retrabalho e manutenção do caráter pessoal do atendimento. Esses diferenciais tornam a solução mais apropriada para escritórios conservadores e enxutos do que plataformas genéricas e “tudo em um” que, apesar de ricas em funcionalidades, nem sempre resolvem problemas operacionais cotidianos.

## 2.5 Análise de Viabilidade 

A solução proposta é tecnicamente viável e adequada ao problema do escritório: uma aplicação web responsiva com backend estruturado, banco relacional, armazenamento de documentos e controles de acesso granular permitindo implementar o workflow visual, importador planilhas do Excel, status e progresso dos processos e repositório pesquisável de cláusulas.   

O ideal é fazer por etapas: primeiro entender bem e alinhar o escopo do projeto (2 semanas), depois desenvolver um MVP com o essencial (8-10 semanas), testar o produto como piloto com o cliente e só então fazer correções finais (1-2 semanas). No total, algo em torno de 3 meses. Em relação aos custos, como sendo um projeto acadêmico, a maior parte das coisas podem ser gratuitas: Git e GitHub para controlar o código, hospedagem em planos gratuitos para a demo e um banco leve como MySQL (ou armazenamento local) durante o desenvolvimento. Caso queiramos um domínio próprio ou algum serviço extra (por exemplo uma hospedagem paga ou ferramenta específica), os gastos tendem a ser pequenos; uma estimativa realista fica entre R$60,00 e R$1.000,00, dependendo do que o cliente escolher. Se for preciso terceirizar algo pontual, como um deploy profissional ou configuração de servidor, o ideal é combinar um pequeno orçamento coletivo entre os membros do grupo para cobrir esse custo.

Os principais riscos e soluções identificados pelo grupo são: 

1. Complicação para a migração de dados das planilhas: a solução seria testar com amostras e ter um importador guiado; 
2. Cliente pode resistir à mudança da rotina: a solução seria um treinamento prático e implantação por fases; 
3. Atrasos ou custos maiores: solução seria dividir o trabalho em entregas pequenas e constante acompanhamento; 
4. Importância da segurança e privacidade: a solução seria ter controles básicos de acesso, backups e regras claras sobre dados.

Portanto, o projeto é adequado e sustentável, entregando um MVP enxuto que resolva o problema central (visibilidade do fluxo e diminuição do uso de planilhas), usando ferramentas gratuitas e um cronograma bem dividido em 2–3 meses. Assim, conseguiremos uma solução útil para o cliente e um bom produto para avaliação.

## 2.6 Impacto da Solução 

A solução proposta trará benefícios práticos e imediatos para o escritório,  substituindo planilhas por um painel visual, fazendo com que todos vejam de forma clara em que etapa cada processo está, reduzindo conferências diárias e confusões sobre responsabilidade. Com isso, o sócio passa a gastar menos tempo em tarefas de triagem e delegação, os funcionários e estagiários trabalham com instruções mais claras e há menos retrabalho por erros de organização. Notificações automáticas e relatórios padronizados melhoram a comunicação com os clientes, que passam a receber atualizações regulares e ficam mais tranquilos sobre o andamento dos casos. O repositório de cláusulas e modelos agiliza a preparação de peças e propostas, trazendo mais consistência nas entregas. 

No geral, espera-se aumento da eficiência operacional, menor risco de perda de prazos, maior satisfação dos clientes e mais tempo livre para o sócio se dedicar a tarefas estratégicas ou à captação de novos negócios. Esses resultados tornam o escritório mais organizado, confiável e competitivo sem perder o atendimento pessoal que é seu diferencial.
