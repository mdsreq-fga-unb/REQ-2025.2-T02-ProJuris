# Testes Automatizados - ProJuris

## 📊 Resumo da Cobertura

**Cobertura Total: 54%** ✅

### Módulos por Cobertura

| Módulo | Statements | Missing | Cobertura | Status |
|--------|-----------|---------|-----------|---------|
| `app/__init__.py` | 27 | 0 | **100%** | ✅ Excelente |
| `app/models.py` | 87 | 8 | **91%** | ✅ Excelente |
| `app/auth.py` | 58 | 6 | **90%** | ✅ Excelente |
| `app/importador.py` | 151 | 25 | **83%** | ✅ Muito Bom |
| `app/decorators.py` | 29 | 6 | **79%** | ✅ Bom |
| `app/main.py` | 473 | 271 | **43%** | ⚠️ Médio |
| `app/audit.py` | 23 | 13 | **43%** | ⚠️ Médio |
| `app/json_handler.py` | 64 | 37 | **42%** | ⚠️ Médio |
| `app/pdf_generator.py` | 135 | 116 | **14%** | ❌ Baixo |

**TOTAL: 1047 statements, 482 missing, 54% coverage**

## 🧪 Testes Implementados

### Estatísticas
- **Total de Testes:** 71 testes
- **Testes Passando:** 68 (96%)
- **Testes Falhando:** 3 (4%)
- **Arquivos de Teste:** 6 arquivos

### Arquivos de Teste

#### 1. `test_models.py` (6 testes)
- Testa modelos User, Demanda e KanbanColumn
- Valida criação, serialização (to_dict)
- Testa propriedades de senha

#### 2. `test_api.py` (13 testes)
- Testes de API de autenticação (login, credenciais inválidas)
- Testes CRUD de demandas (criar, listar, atualizar, deletar, permissões)
- Testes de kanban (listar colunas, reordenar)
- Testes de dashboard (KPIs)
- Testes de importação (sem arquivo, permissões)

#### 3. `test_importador.py` (10 testes)
- Testes de normalização (prioridade, status, data)
- Testes de leitura de arquivo (CSV)
- Testes de mapeamento e validação de colunas
- Testes de processamento de linhas
- Teste de integração completo de importação

#### 4. `test_main_routes.py` (24 testes)
- Testes adicionais de rotas de demandas (atualizar, obter, filtros, mover coluna)
- Testes de rotas de kanban (criar coluna, atualizar, deletar)
- Testes de dashboard (stats, relatórios)
- Testes de auditoria (logs, histórico)
- Testes de auth (registro, duplicação, campos faltando, current user)
- Testes de geração de PDF

#### 5. `test_rotas_completo.py` (18 testes)
- Testes CRUD completo de demandas (listagem, campos inválidos, status, prazo, inexistente)
- Testes de operações de kanban (colunas vazias, específica, mover mesma coluna)
- Testes de dashboard (KPIs com período customizado, sem parâmetros, sem dados)
- Testes de importação (sem token, arquivo vazio, formato inválido)
- Testes de auth (campos faltando, CPF duplicado, email não existe, logout)
- Testes de permissões (funcionário não pode deletar, sem token, token inválido)
- Testes de status (autenticado, não autenticado)

## 🚀 Como Executar os Testes

### Instalar Dependências
```bash
cd src/backend
pip install pytest pytest-cov pytest-flask pytest-mock flask-testing
```

### Executar Todos os Testes
```bash
pytest tests/ -v
```

### Executar com Cobertura
```bash
pytest tests/ --cov=app --cov-report=html
```

### Executar Testes Específicos
```bash
# Por arquivo
pytest tests/test_models.py -v

# Por classe
pytest tests/test_api.py::TestAuthAPI -v

# Por teste individual
pytest tests/test_models.py::TestUserModel::test_create_user -v
```

### Visualizar Relatório de Cobertura
```bash
# Gerar relatório HTML
pytest tests/ --cov=app --cov-report=html

# Abrir no navegador
firefox htmlcov/index.html
```

## 📝 Marcadores de Testes

Os testes usam marcadores pytest para categorização:

- `@pytest.mark.unit` - Testes unitários
- `@pytest.mark.integration` - Testes de integração
- `@pytest.mark.api` - Testes de API/endpoints

### Executar por Marcador
```bash
# Apenas testes de API
pytest tests/ -m api

# Apenas testes unitários
pytest tests/ -m unit

# Excluir testes de integração
pytest tests/ -m "not integration"
```

## 🔧 Fixtures Disponíveis

### Fixtures de Aplicação
- `app` - Instância Flask configurada para testes
- `client` - Cliente de teste Flask

### Fixtures de Usuários
- `socio_user` - Usuário com role 'socio'
- `funcionario_user` - Usuário com role 'funcionario'

### Fixtures de Autenticação
- `auth_headers_socio` - Headers com token JWT para sócio
- `auth_headers_funcionario` - Headers com token JWT para funcionário

### Fixtures de Dados
- `kanban_columns` - 4 colunas kanban padrão
- `demanda_sample` - Demanda de exemplo para testes

## 📈 Próximos Passos para Melhorar Cobertura

### Prioridade Alta
1. **app/main.py (43% → 70%)**
   - Adicionar testes para rotas de relatórios PDF
   - Testar rotas de auditoria
   - Testar filtros e buscas de demandas
   - Testar exceções e casos de erro

2. **app/pdf_generator.py (14% → 50%)**
   - Mockar biblioteca FPDF
   - Testar geração de PDF de demanda
   - Testar geração de relatórios
   - Testar formatação e estilos

### Prioridade Média
3. **app/json_handler.py (42% → 60%)**
   - Testar salvamento e atualização de JSON
   - Testar leitura de dados mock
   - Testar tratamento de erros

4. **app/audit.py (43% → 70%)**
   - Testar registro de auditoria completo
   - Testar consultas com diferentes filtros
   - Testar histórico de mudanças

## 🐛 Testes Falhando (3)

### 1. test_update_column_order
- **Arquivo:** `tests/test_api.py`
- **Erro:** assert 404 == 200
- **Motivo:** Rota `/kanban/colunas/reordenar` não encontrada (deve ser `/kanban/reordenar`)

### 2. test_get_coluna_especifica
- **Arquivo:** `tests/test_rotas_completo.py`
- **Erro:** assert 405 in [200, 404]
- **Motivo:** Método não permitido (rota pode não existir)

### 3. test_import_sem_token
- **Arquivo:** `tests/test_rotas_completo.py`
- **Erro:** assert 404 in [401, 405]
- **Motivo:** Rota retorna 404 ao invés de 401

## ✅ Requisito Atendido

**RNF05 - Testes Automatizados:** ✅ **IMPLEMENTADO**

- ✅ Suite de testes pytest configurada
- ✅ 71 testes implementados
- ✅ 96% de taxa de sucesso (68/71)
- ✅ 54% de cobertura de código
- ✅ Relatórios HTML de cobertura
- ✅ Testes de unidade, integração e API
- ✅ Fixtures reutilizáveis
- ✅ Marcadores para categorização

### Módulos Críticos com Alta Cobertura
- ✅ Models: 91%
- ✅ Auth: 90%
- ✅ Importador: 83%
- ✅ Decorators: 79%

## 📚 Referências

- [Pytest Documentation](https://docs.pytest.org/)
- [Pytest-Flask](https://pytest-flask.readthedocs.io/)
- [Pytest-Cov](https://pytest-cov.readthedocs.io/)
- [Flask Testing](https://flask.palletsprojects.com/testing/)
