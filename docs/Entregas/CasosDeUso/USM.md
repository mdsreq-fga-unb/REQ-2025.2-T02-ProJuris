# User Story Mapping — EcoMove (Atividade de Grupo)

> Atividade de User Story Mapping (USM)

---

## O que é User Story Mapping (USM)
User Story Mapping é uma técnica visual para organizar e priorizar histórias de usuário como uma jornada completa do cliente. Ela permite enxergar o produto “de ponta a ponta”, alinhar entendimento entre a equipe e priorizar o que entra no MVP (produto mínimo viável). A metodologia ajuda a transformar atividades (grandes blocos de interação) em tarefas/histórias menores e ordenadas. :contentReference[oaicite:2]{index=2}

---

## Contextualização da atividade
A EcoMove é uma startup fictícia focada em mobilidade urbana sustentável (bicicletas e patinetes compartilhados). O estudo de caso parte de problemas reais observados em operações desse tipo: frota mal distribuída, equipamentos danificados, falhas nos pagamentos, falta de integração com o poder público e manutenção reativa. O objetivo da atividade foi construir um USM que represente as jornadas das personas principais, identificando atividades, tarefas e prioridades para um MVP. :contentReference[oaicite:3]{index=3}

**Problema central tratado**
- Fragmentação de dados e processos manuais;
- Experiência do usuário inconsistente (localizar, desbloquear e pagar);
- Dificuldades operacionais (distribuição da frota, manutenção e monitoramento). :contentReference[oaicite:4]{index=4}

---

## Personas & Stakeholders
> As personas abaixo foram definidas a partir do estudo de caso. Para cada persona listamos necessidades principais.

- **Usuário urbano — Lucas**  
  Necessidades: localizar veículos, desbloquear com confiabilidade, informações de bateria/segurança, pagamento claro e canal de suporte. :contentReference[oaicite:5]{index=5}

- **Técnica de manutenção — Marina**  
  Necessidades: localizar veículos com defeito, registrar manutenção, receber alertas, roteirização eficiente e comunicação com a equipe. :contentReference[oaicite:6]{index=6}

- **Operador de frota — Carlos**  
  Necessidades: painel com mapa em tempo real, indicadores de desempenho, controle de recolhimentos e redistribuição. :contentReference[oaicite:7]{index=7}

- **Gestora municipal de mobilidade — Fernanda**  
  Necessidades: acesso a dados consolidados, relatórios integrados, integração com sistemas municipais e comunicação com operadores. :contentReference[oaicite:8]{index=8}

- **Motorista de apoio — Rogério**  
  Necessidades: rotas otimizadas, prioridades de atendimento, comprovação de recolhimento e checklist digital de segurança. :contentReference[oaicite:9]{index=9}

---

## Atividades principais (visão por persona)
Abaixo as atividades de mais alto nível que formam a coluna “topo” do USM — cada atividade é então quebrada em histórias / tarefas.

### Usuário urbano (Lucas)
- Localizar veículo
- Desbloquear veículo
- Usar veículo (informações de bateria/segurança)
- Pagar / receber comprovante
- Reportar problema
- Acompanhar histórico de uso

### Técnica de manutenção (Marina)
- Identificar defeitos
- Registrar reparo
- Receber alertas de falhas
- Planejar roteiros de recolhimento/redistribuição
- Comunicar-se com equipe

### Operador de frota (Carlos)
- Visualizar frota em tempo real
- Monitorar indicadores e alertas
- Controlar recolhimentos em campo
- Redistribuir veículos
- Gerar/exportar relatórios

### Gestora municipal (Fernanda)
- Acompanhar dados de uso e impacto
- Emitir relatórios integrados
- Integrar dados com sistemas públicos
- Gerenciar licenças e autorizações

### Motorista de apoio (Rogério)
- Receber rotas otimizadas
- Ver prioridades de atendimento
- Comprovar recolhimento digitalmente
- Realizar checklist de segurança

(Todas as atividades acima foram sintetizadas a partir do estudo de caso EcoMove). :contentReference[oaicite:10]{index=10}

---

## User Stories (exemplos — formato: Como \<persona\>, quero \<ação\>, para \<benefício\>)
### Usuário urbano (Lucas)
- Como usuário, quero ver no mapa veículos disponíveis próximos a mim para escolher o mais próximo.  
- Como usuário, quero desbloquear o veículo facilmente para iniciar minha viagem sem fricção.  
- Como usuário, quero pagar de forma transparente e receber comprovante para controle financeiro.  
- Como usuário, quero reportar problemas diretamente pelo app para que a empresa responda rápido.

### Técnica de manutenção (Marina)
- Como técnica, quero acessar a lista de veículos com defeito e sua localização exata para priorizar intervenções.  
- Como técnica, quero registrar o reparo realizado para manter histórico e métricas de manutenção.  
- Como técnica, quero receber alertas automáticos de falhas recorrentes para planejamento preventivo.

### Operador de frota (Carlos)
- Como operador, quero um painel em tempo real com mapa da frota para tomar decisões operacionais.  
- Como operador, quero comandos para redistribuir veículos com base na demanda para melhorar disponibilidade.  
- Como operador, quero exportar relatórios para parceiros e gestão para prestação de contas.

### Gestora municipal (Fernanda)
- Como gestora, quero acessar painéis com dados de uso e impacto ambiental para embasar políticas públicas.  
- Como gestora, quero integrar esses dados aos sistemas da prefeitura para análise consolidada.

### Motorista de apoio (Rogério)
- Como motorista, quero receber rotas otimizadas para recolher veículos para reduzir tempo e custo.  
- Como motorista, quero registrar digitalmente cada recolhimento como comprovação de serviço.

---

## Priorização (sugestão para MVP)
- **Alvo MVP (prioridade alta):** Localizar, Desbloquear, Uso básico (bateria/segurança), Pagamento e canal de suporte (para Lucas); Localização de defeitos e registro de manutenção (para Marina); Painel básico da frota e redistribuição simples (para Carlos). :contentReference[oaicite:11]{index=11}

---

## Materiais e links
- Exemplo de referência / estrutura (usado como base deste markdown): página USM — EcoMove (Docusaurus). :contentReference[oaicite:12]{index=12}  
- Fonte do estudo de caso (documento do curso): *Exercício de Construção de USM - EcoMove*. :contentReference[oaicite:13]{index=13}

---

### Observações finais
- Este markdown está pensado para GitHub Pages (Docusaurus/Docs ou MkDocs): salve em `docs/estudos-de-caso/usm-ecmove.md` ou onde seu site lê as páginas de documentação.  
- Quer que eu gere também um diagrama simples de User Story Mapping (lista ordenada horizontal) em imagem ou um arquivo `.md` pronto para ser usado com Miro/links? Posso já incluir um link para o Miro se vocês possuírem o board.
