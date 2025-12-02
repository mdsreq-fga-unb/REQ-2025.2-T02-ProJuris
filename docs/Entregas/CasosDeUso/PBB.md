# 🚀 Estudo de Caso PBB: InovaHub - Plataforma de Ecossistema
---

## 💡 Visão do Produto e Desafio

[cite_start]A **InovaHub** é uma rede nacional de inovação e empreendedorismo que busca integrar incubadoras, startups, aceleradoras, empresas e governos[cite: 17, 18].

### O Desafio

[cite_start]O ecossistema é marcado pela **fragmentação de informações**, **ausência de métricas integradas** e **dependência de processos manuais** (planilhas, e-mails)[cite: 19, 28]. Isso causa:

* [cite_start]**Redundância e Retrabalho:** Empreendedores preenchem múltiplos formulários e dados não são reaproveitados[cite: 22, 38].
* [cite_start]**Baixa Confiabilidade:** Relatórios são montados manualmente, dificultando a mensuração de impacto em tempo real[cite: 56, 57].
* [cite_start]**Visão Limitada:** Investidores e Gestores Públicos não possuem canais estruturados para acessar dados de desempenho consolidados[cite: 30, 83].

### A Solução

[cite_start]Desenvolver uma **Plataforma Digital Integrada** capaz de centralizar dados estratégicos, padronizar processos de gestão (inscrição, mentoria, monitoramento) e conectar todos os atores do ecossistema[cite: 33].

---

## 🎯 Personas Chave

[cite_start]O produto foi desenhado para resolver os desafios de seis perfis centrais, garantindo alinhamento e valor para todo o ecossistema[cite: 58].

| Persona | Foco Principal | Necessidade Chave |
| :--- | :--- | :--- |
| **Marina (Gestora)** | Gestão de Programas | [cite_start]Sistema unificado para padronizar inscrições, acompanhamento e relatórios automáticos[cite: 91]. |
| **Lucas (Empreendedor)** | Busca e Progresso | [cite_start]Centralização de oportunidades (editais) e acompanhamento de KPIs do negócio[cite: 94]. |
| **Sérgio (Mentor)** | Acompanhamento e Feedback | [cite_start]Ferramentas para registrar agendas, feedbacks e planos de ação em tempo real[cite: 97]. |
| **Patrícia (Analista)** | Mensuração de Impacto | [cite_start]Dashboards confiáveis, padronizados e filtros avançados para análise de desempenho[cite: 104]. |
| **Renato (Investidor)** | Captação de Oportunidades | [cite_start]Acesso a histórico de desempenho e dados qualificados de startups promissoras[cite: 107]. |
| **Cláudia (Gestora Pública)** | Visão Sistêmica | [cite_start]Painel consolidado de indicadores regionais e relatórios de impacto de políticas públicas[cite: 110]. |

---

## 🛠️ Features Mapeadas (O Produto)

As Features (Módulos) abaixo foram definidas para resolver os problemas das Personas e cumprir a visão do produto:

| Feature (Módulo) | Descrição do Valor | Personas Atendidas |
| :--- | :--- | :--- |
| **1. Módulo de Inscrição Unificada** | Reduz o retrabalho ao reaproveitar dados em formulários de editais e centraliza o status das candidaturas. | Lucas, Marina |
| **2. Painel de Seleção e Triagem** | Permite definir critérios padronizados, agiliza a triagem de candidaturas e facilita a comparação de resultados entre programas. | Marina |
| **3. Módulo de Gestão de Mentorias** | Centraliza agendas, feedbacks, planos de ação e histórico de encontros, otimizando o tempo do mentor (Sérgio). | Sérgio, Lucas |
| **4. Dashboard de Métricas Consolidadas** | Automatiza a geração de relatórios e oferece filtros avançados para análise de portfólio (setor, fase, KPIs), garantindo dados confiáveis. | Patrícia, Marina |
| **5. Vitrine de Startups e Networking** | Cria um canal estruturado para investidores (Renato) acessarem startups promissoras com base em dados de tração e governança. | Renato, Lucas |
| **6. Painel de Indicadores de Ecossistema** | Fornece uma visão sistêmica e consolidada, com indicadores regionais e relatórios de impacto para apoiar políticas públicas (Cláudia). | Cláudia, Patrícia |

---

## 📝 Detalhamento do Product Backlog (PBIs)

Abaixo estão exemplos de Itens de Backlog (PBIs) detalhados com as Histórias de Usuário (US) e os Critérios de Aceitação (BDD), priorizando as atividades essenciais do ecossistema.

### PBI Exemplo: Busca e Inscrição (Prioridade Alta)

| PBI | US (Foco) | Critérios de Aceitação (Regras) |
| :--- | :--- | :--- |
| **Buscar/Filtrar Editais (P6)** | [cite_start]Como Lucas, quero buscar e filtrar editais abertos por *Setor*, *Fase* e *Palavra-Chave* para encontrar rapidamente oportunidades relevantes para minha startup[cite: 45]. | Deve permitir a combinação de múltiplos filtros. A lista deve atualizar automaticamente. |
| **Iniciar Inscrição Inteligente (P5)** | [cite_start]Como Lucas, quero que o formulário de inscrição seja **pré-preenchido** com meus dados salvos, para evitar o preenchimento repetitivo de informações[cite: 66]. | Deve reutilizar dados do perfil da startup (CNPJ, Setor, Time) em qualquer edital. |

### PBI Exemplo: Monitoramento e Mentoria (Prioridade Alta)

| PBI | US (Foco) | Critérios de Aceitação (Regras) |
| :--- | :--- | :--- |
| **Registrar Feedback e PA (P7)** | [cite_start]Como Sérgio, quero registrar o feedback da mentoria e criar um **Plano de Ação (PA)** com tarefas, responsáveis e prazos, para estruturar o acompanhamento[cite: 71]. | O PA deve ser vinculado ao histórico da startup e notificar o responsável pela conclusão da tarefa. |
| **Acessar Dashboard Consolidado (P8)** | [cite_start]Como Patrícia, quero acessar um dashboard com **métricas consolidadas** do portfólio, filtrável por *Setor* e *Fase*, para mensurar o impacto em tempo real[cite: 79, 104]. | O dashboard deve exibir KPIs-chave (Faturamento, Empregos) e permitir a exportação dos dados. |

---

## 🔗 Evidências e Documentação

Você pode explorar o PBB Canvas completo e detalhado (incluindo as Personas, a Jornada e a Priorização de PBIs) no link abaixo:

* **PBB Canvas Completo (Miro):** **https://miro.com/app/board/uXjVJx4QRWw=/**

Abaixo estão os espaços para as evidências visuais do seu PBB Canvas:

### 1. Visão Geral (Problemas e Expectativas)

* **Problemas:** ![Problemas](/docs/imagens/Problemas_PBB.png)
* **Expectativas:** ![Expectativas](/docs/imagens/Expectativas_PBB.png)

### 2. Personas e Atividades

* **Personas (Lucas, Marina):** ![Persona1](/docs/imagens/personas1_PBB.png)
* **Personas (Patrícia, Sérgio):** ![Persona2](/docs/imagens/personas2_PBB.png)
* **Personas (Renato, Cláudia):** ![Persona3](/docs/imagens/personas3_PBB.png)

### 3. Módulos e Features

* **Features (Inscrição, Seleção):** ![f1](/docs/imagens/features1_PBB.png)
* **Features (Mentorias, Vitrine):** ![f2](/docs/imagens/features2_PBB.png)
* **Features (Vitrine, Ecossistema):** ![f3](/docs/imagens/features3_PBB.png)

### 4. Detalhamento do Backlog (PBIs)

* **Exemplo> PBIs de Inscrição/Seleção (Busca, Criar Edital, Filtrar):** ![pbi](/docs/imagens/PBI1_PBB.png)
