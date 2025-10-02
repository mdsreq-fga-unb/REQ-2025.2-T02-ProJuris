### Requisitos Não Funcionais

---

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Não-funcional — Segurança | Autenticação com controle de acesso por perfis (estagiário, advogado, sócio). |
| **RNF03** | Não-funcional — Desempenho | Suportar 300–400 processos ativos simultâneos; tempo de resposta ≤ 500ms para 95% das requisições. |
| **RNF07** | Não-funcional — Usabilidade | Usabilidade para diferentes perfis (estagiários, advogados, sócios) com navegação simplificada. |

---

## Tarefa: Workflow Visual (Kanban)

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF05** | Não-funcional — Usabilidade | Interface intuitiva e responsiva; tempo de carregamento ≤ 500ms; seguir diretrizes de UX. |
| **RNF06** | Não-funcional — Usabilidade / Brand | Adaptar interface à identidade visual (cores, logotipo, tipografia). |
| **RNF08** | Não-funcional — Acessibilidade | Seguir WCAG 2.1 nível AA (validar necessidade específica). |

---

## Tarefa: Atribuição e Transferência de Responsabilidade

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Não-funcional — Segurança | Controle de acesso por perfis (repetido, aplicado aqui). |
| **RNF05 / RNF07 / RNF09** | Não-funcional | Usabilidade (≤500ms), usabilidade multi-perfil e salvamento automático a cada 20 minutos (confiabilidade, perda <0,01%). |

---

## Tarefa: Importador Assistido de Planilhas (Excel → Sistema)

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF04** | Não-funcional — Desempenho | Processar planilhas até 1000 linhas em < 10 segundos, com validação de dados. |
| **RNF05** | Não-funcional — Usabilidade | Interface intuitiva e responsiva; tempo de carregamento ≤ 500ms. |

---

## Tarefa: Anexação e Gerenciamento de Documentos

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF09** | Não-funcional — Confiabilidade | Salvamento automático a cada 20 minutos; perda de dados < 0,01%. |

---

## Tarefa: Notificações e Mensagens Automatizadas

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF10** | Não-funcional — Confiabilidade | Disponibilidade do sistema 99,9% (exceto janelas de manutenção). |

---

## Tarefa: Dashboard de Indicadores e Relatórios

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF05 / RNF06 / RNF02** | Não-funcional | Usabilidade (≤500ms), identidade visual, e desempenho (suporte 300–400 processos, resposta ≤500ms para 95%). |

---

## Tarefa: Auditoria / Trilha de Atividades

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF01 / RNF11** | Não-funcional | Manutenibilidade (documentação de APIs/schemas). |

---

## Tarefa: Revisão de Atribuições

| ID | Tipo | Descrição |
| :--- | :--- | :--- |
| **RNF05 / RNF09** | Não-funcional | Usabilidade (interface responsiva ≤500ms) e confiabilidade (salvamento automático cada 20 minutos). |

---
