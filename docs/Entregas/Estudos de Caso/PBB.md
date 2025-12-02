# 🚀 Estudo de Caso PBB: InovaHub - Plataforma de Ecossistema

## 💡 Visão do Produto e Desafio

A **InovaHub** é uma rede nacional de inovação e empreendedorismo que busca integrar incubadoras, startups, aceleradoras, empresas e governos.

### O Desafio Central

O ecossistema é marcado pela **fragmentação de informações**, **ausência de métricas integradas** e **dependência de processos manuais** (planilhas, e-mails). Isso gera:

* **Redundância e Retrabalho:** Empreendedores preenchem múltiplos formulários, e os dados não são reaproveitados entre instituições.
* **Baixa Confiabilidade:** Relatórios são montados manualmente, o que dificulta a mensuração de impacto em tempo real e a prestação de contas.
* **Visão Limitada:** Investidores e Gestores Públicos não possuem canais estruturados para acessar dados de desempenho consolidados e o histórico de evolução das startups.

### A Solução

Desenvolver uma **Plataforma Digital Integrada** capaz de centralizar dados estratégicos, padronizar processos de gestão (inscrição, mentoria, monitoramento) e conectar todos os atores do ecossistema.

---

## 🎯 Personas Chave

O produto foi desenhado para resolver os desafios de seis perfis centrais:

| Persona | Foco Principal | Necessidade Chave |
| :--- | :--- | :--- |
| **Marina (Gestora)** | Gestão de Programas | Sistema unificado para padronizar inscrições, acompanhamento e relatórios automáticos. |
| **Lucas (Empreendedor)** | Busca e Progresso | Centralização de oportunidades (editais) e acompanhamento de KPIs do negócio. |
| **Sérgio (Mentor)** | Acompanhamento e Feedback | Ferramentas para registrar agendas, feedbacks e planos de ação em tempo real. |
| **Patrícia (Analista)** | Mensuração de Impacto | Dashboards confiáveis, padronizados e filtros avançados para análise de desempenho. |
| **Renato (Investidor)** | Captação de Oportunidades | Acesso a histórico de desempenho e dados qualificados de startups promissoras. |
| **Cláudia (Gestora Pública)** | Visão Sistêmica | Painel consolidado de indicadores regionais e relatórios de impacto de políticas públicas. |

---

## 🛠️ Features Mapeadas (Os Módulos do Produto)

As Features (Módulos) abaixo foram definidas para resolver os problemas das Personas:

| Feature (Módulo) | Descrição do Valor | Personas Atendidas |
| :--- | :--- | :--- |
| **1. Módulo de Inscrição Unificada** | Reduz o retrabalho ao reaproveitar dados em formulários de editais e centraliza o status das candidaturas. | Lucas, Marina |
| **2. Painel de Seleção e Triagem** | Permite definir critérios padronizados, agiliza a triagem de candidaturas e facilita a comparação de resultados. | Marina |
| **3. Módulo de Gestão de Mentorias** | Centraliza agendas, feedbacks, planos de ação e histórico de encontros, otimizando o tempo do mentor (Sérgio). | Sérgio, Lucas |
| **4. Dashboard de Métricas Consolidadas** | Automatiza a geração de relatórios e oferece filtros avançados para análise de portfólio (setor, fase, KPIs), garantindo dados confiáveis. | Patrícia, Marina |
| **5. Vitrine de Startups e Networking** | Cria um canal estruturado para investidores (Renato) acessarem startups promissoras com base em dados de tração e governança. | Renato, Lucas |
| **6. Painel de Indicadores de Ecossistema** | Fornece uma visão sistêmica e consolidada, com indicadores regionais e relatórios de impacto para apoiar políticas públicas (Cláudia). | Cláudia, Patrícia |

---

## 📝 Detalhamento do Product Backlog (PBIs)

Abaixo estão exemplos de Itens de Backlog (PBIs) detalhados, que serão desenvolvidos no formato US e BDD.

### PBI Exemplo: Busca e Inscrição (Prioridade Alta)

| PBI | US (Foco) | Critérios de Aceitação (Regras) |
| :--- | :--- | :--- |
| **Buscar/Filtrar Editais (P6)** | Como Lucas, quero buscar e filtrar editais abertos por *Setor*, *Fase* e *Palavra-Chave* para encontrar rapidamente oportunidades relevantes para minha startup. | Deve permitir a combinação de múltiplos filtros. A lista deve atualizar automaticamente. |
| **Iniciar Inscrição Inteligente (P5)** | Como Lucas, quero que o formulário de inscrição seja **pré-preenchido** com meus dados salvos, para evitar o preenchimento repetitivo de informações. | Deve reutilizar dados do perfil da startup (CNPJ, Setor, Time) em qualquer edital. |

### PBI Exemplo: Monitoramento e Mentoria (Prioridade Alta)

| PBI | US (Foco) | Critérios de Aceitação (Regras) |
| :--- | :--- | :--- |
| **Registrar Feedback e PA (P7)** | Como Sérgio, quero registrar o feedback da mentoria e criar um **Plano de Ação (PA)** com tarefas, responsáveis e prazos, para estruturar o acompanhamento. | O PA deve ser vinculado ao histórico da startup e notificar o responsável pela conclusão da tarefa. |
| **Acessar Dashboard Consolidado (P8)** | Como Patrícia, quero acessar um dashboard com **métricas consolidadas** do portfólio, filtrável por *Setor* e *Fase*, para mensurar o impacto em tempo real. | O dashboard deve exibir KPIs-chave (Faturamento, Empregos) e permitir a exportação dos dados. |

---

## 🖼️ Evidências Visuais do PBB Canvas

A documentação visual do PBB Canvas (Miro) detalha o mapeamento e priorização das funcionalidades.

* **PBB Canvas Completo (Miro):** [Acessar o board no Miro](https://miro.com/app/board/uXjVJx4QRWw=/)