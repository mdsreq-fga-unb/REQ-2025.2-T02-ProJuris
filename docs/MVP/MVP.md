# Documento de Especificação Técnica - MVP Sistema de Gestão Jurídica

## 1 — Escopo do MVP (o que será entregue)

**Objetivo:** entregar valor mínimo viável para gestão de processos jurídicos com workflow visual, atribuição de responsáveis, anexação de documentos e notificações essenciais.

### Inclui (MUST):

- Autenticação + controle de acesso por perfil (estagiário, advogado, sócio).
- CRUD de Processos (RF01, RF02, RF03).
- Quadro Kanban com etapas configuráveis e drag/drop que atualiza responsável (RF04).
- Atribuição e transferência de responsabilidade + notificações básicas (RF05, RF06, RF19, RF20, RF21, RF23, RF24).
- Upload de anexos com metadados e versão básica (RF08, RF09).
- Importador assistido de planilhas (pré-visualização + mapeamento) (RF07).
- Logs de auditoria (RF17, RF18).
- Repositório básico de templates/cláusulas com tags e busca (RF12, RF26, RF13 básica).
- Notificações críticas por e-mail (prazos críticos, novas atribuições) usando templates (RF10).
- Dashboard de indicadores básicos (processos por status, % no prazo, prazos críticos) e export CSV (RF15, RF16 minimal).
- Tela de revisão de atribuições antes de conclusão (RF25).
- Requisitos não-funcionais implementados: autenticação, criptografia em trânsito (TLS), medidas iniciais para criptografia em repouso (configuração DB/armazenamento), autosave a cada 20 minutos (RNF09), logs, documentação mínima de API/schemas (RNF11).

## 2 — Backlog priorizado (MoSCoW)

### Must (MVP mínimo):

- RF01, RF02, RF03 (CRUD/visualização)
- RF04 (Kanban básico)
- RF05, RF06 (atribuição/transferência + notificações por e-mail)
- RF08, RF09 (anexos + pesquisa por nome/data)
- RF07 (importador assistido, 1k linhas com validação básica)
- RF17, RF18 (auditoria)
- Autenticação + controle de acesso (RNF01)
- TLS para tráfego (RNF02)
- Dashboard básico (RF15)
- Notificações por e-mail (RF10 minimal)
- Autosave (RNF09)

### Should (valores fortes, pós-MVP imediato):

- Versionamento avançado de documentos com diffs
- WhatsApp notificações (integração Twilio/WhatsApp Business)
- Templates/cláusulas com edição in-place (RF12 aprimorado)
- Export PDF de relatórios (RF16)

### Could (ótimo para roadmap):

- Integração com provedores de storage externos (S3, Backblaze)
- Full WCAG 2.1 AA audit & remediation (RNF08) — confirmar necessidade específica
- Mobile app nativo / PWA offline

### Won't (não para MVP):

- Gestão complexa de cobrança/honorários (apenas repositório de modelos)
- Machine Learning para classificação automática de documentos

## 3 — Principais histórias de usuário + critérios de aceitação (exemplos)

### H1 — Como advogado, quero cadastrar um processo para que eu possa acompanhar o caso.

**Critérios de aceitação:**

- Formulário permite preencher: cliente, número do processo, petição modelo (select), atividade, andamento, prazo (date), responsável (user).
- Ao salvar, processo aparece na lista e na coluna Kanban correta.
- API retorna HTTP 201 com objeto processo criado.

### H2 — Como estagiário, quero ver apenas ações permitidas para meu perfil.

**Critérios:**

- Estagiário não consegue alterar campos restritos (ex.: alterar responsável para sócio sem permissão).
- Tentativa de ação proibida retorna 403.
- Dashboard inicial mostra apenas atribuições do estagiário (RF20).

### H3 — Como responsável, quero receber e-mail quando um processo for atribuído a mim.

**Critérios:**

- Ao atribuir, sistema envia e-mail usando template padrão, contendo link para processo.
- E-mail também é registrado como notificação no sistema.

### H4 — Como gestor, quero arrastar um processo no Kanban e que o responsável seja atualizado automaticamente.

**Critérios:**

- Drag/drop muda stage do processo.
- Se a etapa tem regra de responsabilidade, responsável é atualizado conforme regra.
- Mudança gera entrada em log de auditoria.

*(Para todas as histórias, incluir testes automatizados unit/integration que cobrem os critérios.)*

## 4 — Modelo de dados (principais entidades — ER simplificado)

### Usuários / Autenticação:

- **users**: id, nome, email (único), hashed_password, role_id, ativo, created_at, last_login

### Perfis:

- **roles**: id, name (estagiario/advogado/socio), permissions (json)

### Processos:

- **processes**: id, cliente, processo_numero, peticao_modelo_id, atividade, andamento, prazo (date), stage_id, responsável_id, created_by, created_at, updated_at, meta (json)

### Etapas/Workflow:

- **stages**: id, name, order, auto_assign_role_id (opcional), color

### Atribuições:

- **assignments**: id, process_id, user_id, assigned_by, assigned_at, due_date, status

### Anexos:

- **attachments**: id, process_id, filename, storage_path, version, uploaded_by, uploaded_at, size, mime_type, checksum

### Templates/Cláusulas:

- **templates**: id, title, body (rich text), tags (array), version, author_id, created_at

### Importações:

- **imports**: id, uploaded_by, filename, mapping (json), status, processed_at, rows_created, rows_updated, errors (json)

### Auditoria:

- **audit_logs**: id, user_id, action_type, target_type, target_id, payload (json), created_at

### Notificações:

- **notifications**: id, user_id, type, channel (email/whatsapp/in-app), status, payload, sent_at

**Índices essenciais:** processes(prazo), processes(stage_id), attachments(process_id), users(email).

## 5 — Endpoints REST (essenciais, exemplos)

*(Autenticação via JWT / session)*

### Auth:

- `POST /api/auth/login` → {email, password} -> {token}
- `POST /api/auth/logout`

### Users:

- `GET /api/users/me`
- `GET /api/users` (admin)
- `POST /api/users` (admin)

### Processos:

- `GET /api/processes` → lista filtros (status, responsável, prazo_from, prazo_to, search)
- `POST /api/processes` → cria processo (payload com campos)
- `GET /api/processes/{id}` → detalhes (inclui anexos, audit)
- `PUT /api/processes/{id}` → atualiza
- `PATCH /api/processes/{id}/stage` → move estágio (body: stage_id, optional new_responsible)
- `POST /api/processes/bulk-import` → dispara import com mapping (RF07)

### Anexos:

- `POST /api/processes/{id}/attachments` → upload multipart
- `GET /api/processes/{id}/attachments` → listar
- `GET /api/attachments/{id}/download`

### Kanban:

- `GET /api/kanban` → {stages: [...], cards: [...]} ou endpoint que retorna processes grouped by stage

### Assignments / Notifications:

- `POST /api/processes/{id}/assign` → {user_id, due_date}
- `POST /api/notifications/send` → admin trigger

### Templates:

- `GET /api/templates?search=`
- `POST /api/templates`
- `POST /api/templates/{id}/insert` → retorna snippet para edição

### Audit:

- `GET /api/audit?target_type=process&target_id={id}`

## 6 — Fluxo de telas / componentes (wireframes textuais)

### Telas principais:

1. Login (email + senha + 2FA future)
2. Dashboard (KPIs: total/aberto/andamento/concluído, % no prazo, prazos críticos, lista rápida de atribuições)
3. Lista de processos (filtros, busca)
4. Visualização de processo (detalhes, timeline, anexos, auditoria, ações rápidas)
5. Editor / formulário de processo (criar/editar)
6. Kanban (stages configuráveis, drag & drop, botão para criar processo)
7. Atribuições do usuário (estagiário) — lista + botão atualizar status
8. Importador assistido (upload xlsx, mapeamento colunas, pré-visualização linhas conflitantes, botão aplicar)
9. Repositório de modelos (busca por tag/palavra, visualização & inserir)
10. Tela de revisão antes de concluir atribuição (mostra checklist de itens obrigatórios)
11. Admin: gestão de usuários, roles, stages, templates, logs

### Design notes:

- Layout responsivo (desktop-first), uso de cards, tabelas paginadas, modal para quick-edit.
- Conformidade básica com WCAG 2.1 AA: contraste, labels, teclado-navegável — implementar auditável no roadmap.

## 7 — Requisitos não-funcionais e como implementá-los no MVP

### Segurança

- **Autenticação**: JWT com refresh tokens e expiração curta + logout.
- **Controle de acesso**: roles + permissions (middleware em APIs).
- **Criptografia in-transit**: HTTPS obrigatório (TLS).
- **Criptografia at-rest**: usar armazenamento que suporte encryption-at-rest (RDS/Postgres com encryption, S3 com SSE). Para MVP: ativar encryption at-rest no banco/armazenamento.
- **Proteção de arquivos**: gerar URLs assinadas para download (expiram).
- **Logs de auditoria imutáveis**: escrever em tabela audit_logs com append-only.

### Performance

- **Objetivo (RNF03/RNF05)**: projetar para 300—400 processos ativos; para MVP garanta boa indexação e queries eficientes, paginação, lazy-loading de anexos.
- **Caching**: usar cache de aplicação (Redis) para queries de dashboard/kanban.
- **Timeouts e limites**: paginate e rate limit por IP/user.

### Confiabilidade

- **Autosave local + servidor a cada 20 minutos (RNF09)**: front-end salva rascunho local e envia snapshot automático; backend aceita snapshots e versão de rascunho.
- **Backups regulares do DB**; testes de restauração.
- **Monitoramento**: Healthchecks + métricas (Prometheus/Grafana ou serviço SaaS).

### Usabilidade & Acessibilidade

- UX minimalista, campos claros, ajuda inline (tooltips).
- Adotar componente de UI com suporte a acessibilidade (aria attributes).
- IDV: fornecer theming (cores, logo upload, tipografia via tokens).

### Disponibilidade

- **Roteiro para 99.9% (RNF10)**: infra em cloud com deploy múltiplo e health checks — roadmap após MVP.

## 8 — Plano de testes & qualidade

- **Unit tests (backend)**: modelos, validações, lógica de autorização.
- **Integration tests**: endpoints críticos (auth, CRUD process, upload, import).
- **End-to-end tests (Cypress)** para principais flows: criação processo, arrastar Kanban, upload, atribuição e notificação por e-mail.
- **Load test básicos (k6)** simulando leitura de Kanban e listagens para garantir latência ≤ 500ms na maioria das requisições (optimizar queries e caching).
- **Security scans**: dependabot + SCA + revisão de configuração TLS.

## 9 — Arquitetura técnica sugerida (stack recomendado)

- **Frontend**: React + Vite + Tailwind (ou Next.js se quiser SSR). Component library acessível (Radix / shadcn).
- **Backend**: Python Flask/FastAPI ou Node.js (Express/Nest). Você já tem experiência com Flask — FastAPI é recomendado por performance & docs automáticas (OpenAPI).
- **Database**: PostgreSQL (produção). Para dev, SQLite/Local.
- **File storage**: S3 (AWS) / Spaces (DigitalOcean) — com URLs assinadas.
- **Cache/queue**: Redis (cache + Celery/RQ/Background tasks para envio de notificações e processamento de import).
- **Worker**: Celery (Python) ou BullMQ (Node) para jobs (importação planilhas, envio e-mails/whatsapp).
- **Email**: SMTP (SendGrid/Mailgun) ou provedor local.
- **WhatsApp (opcional)**: Twilio ou WhatsApp Business API (custo e onboarding).
- **Observabilidade**: Sentry (erros), Prometheus/Grafana (métricas) ou SaaS.

## 10 — Checklist de implementação (milestones, sem estimativas de tempo)

1. Infra & CI: repo, branch strategy, pipeline CI (testes), infraestrutura base (DB, storage).
2. Auth & roles.
3. CRUD de processos + UI lista/detalhes.
4. Kanban básico + stages management.
5. Atribuições + notificações por e-mail + audit logs.
6. Upload/attachments + pesquisar.
7. Importador assistido (upload XLSX, mapeamento, preview, aplicar).
8. Templates repository & inserir snippets.
9. Dashboard básicos + export CSV.
10. Testes E2E, load test, segurança, docs API (OpenAPI).

## 11 — Observações, premissas e pontos a confirmar (assumptions)

- Assumo que haverá um provedor de e-mail/WhatsApp disponível; WhatsApp exige aprovação comercial — por isso, no MVP apenas e-mail (WhatsApp como SHOULD).
- Para criptografia em repouso, assumo uso de serviços com SSE (S3/RDS). Caso de hospedagem própria, será necessário volume cifrado.
- RNF08 (WCAG AA): no MVP aplicamos práticas básicas e roadmap para auditoria completa — confirme se é obrigatório já para o MVP.
- Documentação: usaremos OpenAPI/Swagger para APIs (RNF11). Confirme ferramenta preferida (Postman/Swagger).
- Backup/restore e SLA 99.9%: essas metas dependem de infra/arquitetura (multizona, failover) — ficam para fase pós-MVP.

## 12 — O que fica fora do MVP (para não inflar escopo)

- Integração formal com sistemas de tribunais (e-Proc) — demandaria autenticação e parser de documentos.
- Integração nativa com WhatsApp (salvo como opção paga).
- PWA offline avançado e mobile apps nativos.
- Relatórios PDF complexos com layout customizado (CSV ok no MVP).