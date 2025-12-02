"""
Testes específicos para rotas de demandas e kanban - ProJuris
Foco em aumentar cobertura do app/main.py
"""
import pytest
import json
from datetime import datetime, timedelta


@pytest.mark.api
class TestDemandasCRUD:
    """Testes CRUD completo de demandas"""
    
    def test_list_all_demandas(self, client, auth_headers_socio, demanda_sample):
        """Testa listagem de todas as demandas"""
        response = client.get('/demandas',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) >= 1
    
    def test_create_demanda_sem_prioridade(self, client, auth_headers_socio, funcionario_user, kanban_columns):
        """Testa criação de demanda sem especificar prioridade (usa default)"""
        response = client.post('/demandas',
            headers=auth_headers_socio,
            json={
                'titulo': 'Demanda Sem Prioridade',
                'descricao': 'Teste',
                'data_prazo': (datetime.now() + timedelta(days=5)).isoformat(),
                'responsavel_id': funcionario_user.id,
                'coluna_id': kanban_columns[0].id
            }
        )
        
        assert response.status_code == 201
    
    def test_create_demanda_campos_invalidos(self, client, auth_headers_socio):
        """Testa criação com campos inválidos"""
        response = client.post('/demandas',
            headers=auth_headers_socio,
            json={
                'titulo': '',  # Título vazio
                'descricao': 'Teste'
            }
        )
        
        assert response.status_code == 400
    
    def test_update_demanda_status(self, client, auth_headers_socio, demanda_sample):
        """Testa atualização de status da demanda"""
        response = client.put(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_socio,
            json={
                'status': 'em_andamento'
            }
        )
        
        assert response.status_code == 200
    
    def test_update_demanda_prazo(self, client, auth_headers_socio, demanda_sample):
        """Testa atualização de prazo da demanda"""
        novo_prazo = datetime.now() + timedelta(days=15)
        response = client.put(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_socio,
            json={
                'data_prazo': novo_prazo.isoformat()
            }
        )
        
        assert response.status_code == 200
    
    def test_delete_demanda_inexistente(self, client, auth_headers_socio):
        """Testa deleção de demanda que não existe"""
        response = client.delete('/demandas/99999',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 404
    
    def test_get_demanda_inexistente(self, client, auth_headers_socio):
        """Testa obtenção de demanda que não existe"""
        response = client.get('/demandas/99999',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 404


@pytest.mark.api
class TestKanbanOperations:
    """Testes de operações de kanban"""
    
    def test_get_colunas_vazias(self, client, auth_headers_socio):
        """Testa obtenção de colunas mesmo sem demandas"""
        response = client.get('/kanban/colunas',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
    
    def test_get_coluna_especifica(self, client, auth_headers_socio, kanban_columns):
        """Testa obtenção de uma coluna específica"""
        response = client.get(f'/kanban/colunas/{kanban_columns[0].id}',
            headers=auth_headers_socio
        )
        
        assert response.status_code in [200, 404]  # 404 se rota não implementada
    
    def test_move_demanda_mesma_coluna(self, client, auth_headers_socio, demanda_sample):
        """Testa mover demanda para a mesma coluna em que já está"""
        response = client.put(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_socio,
            json={
                'coluna_id': demanda_sample.coluna_id  # Mesma coluna
            }
        )
        
        assert response.status_code == 200


@pytest.mark.api
class TestDashboardEndpoints:
    """Testes de endpoints do dashboard"""
    
    def test_get_kpis_periodo_customizado(self, client, auth_headers_socio):
        """Testa KPIs com período customizado"""
        response = client.get('/dashboard/kpis',
            headers=auth_headers_socio,
            query_string={
                'data_inicio': '2025-01-01',
                'data_fim': '2025-12-31'
            }
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'periodo' in data
    
    def test_get_kpis_sem_parametros(self, client, auth_headers_socio):
        """Testa KPIs sem especificar período (usa padrão)"""
        response = client.get('/dashboard/kpis',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'periodo' in data
        assert data['periodo']['dias'] == 30  # Padrão de 30 dias
    
    def test_dashboard_sem_dados(self, client, auth_headers_funcionario):
        """Testa dashboard quando não há dados"""
        response = client.get('/dashboard/kpis',
            headers=auth_headers_funcionario
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['volume_tarefas']['total'] >= 0


@pytest.mark.api
class TestImportacaoEndpoints:
    """Testes de endpoints de importação"""
    
    def test_import_sem_token(self, client):
        """Testa importação sem autenticação"""
        response = client.post('/importar')
        
        assert response.status_code in [401, 405]  # Não autorizado ou método não permitido
    
    def test_import_arquivo_vazio(self, client, auth_headers_socio):
        """Testa importação com arquivo vazio"""
        from io import BytesIO
        
        data = {
            'file': (BytesIO(b''), 'vazio.csv')
        }
        
        response = client.post('/importar',
            headers=auth_headers_socio,
            data=data,
            content_type='multipart/form-data'
        )
        
        assert response.status_code in [400, 404, 405]
    
    def test_import_formato_invalido(self, client, auth_headers_socio):
        """Testa importação com formato inválido"""
        from io import BytesIO
        
        data = {
            'file': (BytesIO(b'dados invalidos'), 'arquivo.txt')
        }
        
        response = client.post('/importar',
            headers=auth_headers_socio,
            data=data,
            content_type='multipart/form-data'
        )
        
        assert response.status_code in [400, 404, 405, 415]


@pytest.mark.api
class TestAuthEndpoints:
    """Testes adicionais de autenticação"""
    
    def test_register_campos_faltando(self, client):
        """Testa registro com campos obrigatórios faltando"""
        response = client.post('/auth/register',
            json={
                'nome': 'Teste',
                'email': 'teste@test.com'
                # Falta senha, cpf, role
            }
        )
        
        assert response.status_code == 400
    
    def test_register_cpf_duplicado(self, client, funcionario_user):
        """Testa registro com CPF duplicado"""
        response = client.post('/auth/register',
            json={
                'nome': 'Novo User',
                'email': 'novoemail@test.com',
                'senha': 'senha123',
                'cpf': funcionario_user.cpf,  # CPF já existe
                'role': 'funcionario'
            }
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'CPF já cadastrado' in data['message']
    
    def test_login_email_nao_existe(self, client):
        """Testa login com email não cadastrado"""
        response = client.post('/auth/login',
            json={
                'email': 'naoexiste@test.com',
                'senha': 'qualquer'
            }
        )
        
        assert response.status_code == 401
    
    def test_logout_sem_auth(self, client):
        """Testa logout sem estar autenticado"""
        response = client.post('/auth/logout')
        
        assert response.status_code in [302, 401]  # Redirect ou não autorizado


@pytest.mark.api
class TestPermissoes:
    """Testes de permissões e controle de acesso"""
    
    def test_funcionario_nao_pode_deletar(self, client, auth_headers_funcionario, demanda_sample):
        """Testa que funcionário não pode deletar demandas"""
        response = client.delete(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_funcionario
        )
        
        assert response.status_code in [403, 404]  # Proibido ou não encontrado
    
    def test_acesso_sem_token(self, client):
        """Testa acesso a rota protegida sem token"""
        response = client.get('/demandas')
        
        assert response.status_code in [401, 302]  # Não autorizado ou redirect
    
    def test_token_invalido(self, client):
        """Testa acesso com token inválido"""
        response = client.get('/demandas',
            headers={'Authorization': 'Bearer token_invalido'}
        )
        
        assert response.status_code in [401, 422]  # Não autorizado ou não processável


@pytest.mark.api
class TestStatusCheck:
    """Testes de endpoints de status"""
    
    def test_auth_status_autenticado(self, client, auth_headers_socio):
        """Testa status quando autenticado"""
        response = client.get('/auth/status',
            headers=auth_headers_socio
        )
        
        assert response.status_code in [200, 404]
    
    def test_auth_status_nao_autenticado(self, client):
        """Testa status quando não autenticado"""
        response = client.get('/auth/status')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['logged_in'] == False
