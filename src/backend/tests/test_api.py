"""
Testes de integração para API - ProJuris
"""
import pytest
import json
from datetime import datetime, timedelta

@pytest.mark.api
class TestAuthAPI:
    """Testes para endpoints de autenticação"""
    
    def test_login_success(self, client, socio_user):
        """Testa login com credenciais válidas"""
        response = client.post('/auth/login', 
            json={
                'email': 'socio@test.com',
                'senha': 'senha123'
            }
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'token' in data
        assert 'user' in data
        assert data['user']['email'] == 'socio@test.com'
    
    def test_login_invalid_credentials(self, client, socio_user):
        """Testa login com credenciais inválidas"""
        response = client.post('/auth/login',
            json={
                'email': 'socio@test.com',
                'senha': 'senha_errada'
            }
        )
        
        assert response.status_code == 401

@pytest.mark.api
class TestDemandasAPI:
    """Testes para endpoints de demandas"""
    
    def test_create_demanda_success(self, client, auth_headers_socio, funcionario_user, kanban_columns):
        """Testa criação de demanda com sucesso"""
        response = client.post('/demandas',
            headers=auth_headers_socio,
            json={
                'titulo': 'Nova Demanda API',
                'descricao': 'Teste de API',
                'data_prazo': (datetime.now() + timedelta(days=5)).isoformat(),
                'responsavel_id': funcionario_user.id,
                'prioridade': 'alta',
                'coluna_id': kanban_columns[0].id
            }
        )
        
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'demanda' in data
        assert data['demanda']['titulo'] == 'Nova Demanda API'
    
    def test_create_demanda_missing_fields(self, client, auth_headers_socio):
        """Testa criação de demanda sem campos obrigatórios"""
        response = client.post('/demandas',
            headers=auth_headers_socio,
            json={
                'descricao': 'Sem título'
            }
        )
        
        assert response.status_code == 400
    
    def test_get_demandas(self, client, auth_headers_socio, demanda_sample):
        """Testa listagem de demandas"""
        response = client.get('/demandas',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_update_demanda_success(self, client, auth_headers_socio, demanda_sample):
        """Testa atualização de demanda"""
        response = client.put(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_socio,
            json={
                'titulo': 'Título Atualizado',
                'prioridade': 'urgente'
            }
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['demanda']['titulo'] == 'Título Atualizado'
        assert data['demanda']['prioridade'] == 'urgente'
    
    def test_delete_demanda_success(self, client, auth_headers_socio, demanda_sample):
        """Testa exclusão de demanda"""
        response = client.delete(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
    
    def test_update_demanda_permission_denied(self, client, auth_headers_funcionario, demanda_sample, socio_user):
        """Testa atualização de demanda sem permissão"""
        # Demanda pertence a outro usuário, funcionário não pode editar
        demanda_sample.responsavel_id = socio_user.id
        from app import db
        db.session.commit()
        
        response = client.put(f'/demandas/{demanda_sample.id}',
            headers=auth_headers_funcionario,
            json={
                'titulo': 'Tentativa de atualização'
            }
        )
        
        assert response.status_code == 403

@pytest.mark.api
class TestKanbanAPI:
    """Testes para endpoints de kanban"""
    
    def test_get_kanban_columns(self, client, auth_headers_socio, kanban_columns, demanda_sample):
        """Testa listagem de colunas kanban"""
        response = client.get('/kanban/colunas',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert isinstance(data, list)
        assert len(data) == 4  # 4 colunas criadas no fixture
    
    def test_update_column_order(self, client, auth_headers_socio, kanban_columns):
        """Testa reordenação de colunas"""
        response = client.put('/kanban/colunas/reordenar',
            headers=auth_headers_socio,
            json={
                'colunas': [
                    {'id': kanban_columns[0].id, 'ordem': 2},
                    {'id': kanban_columns[1].id, 'ordem': 1}
                ]
            }
        )
        
        assert response.status_code == 200

@pytest.mark.api
class TestDashboardAPI:
    """Testes para endpoints de dashboard"""
    
    def test_get_kpis(self, client, auth_headers_socio, demanda_sample):
        """Testa endpoint de KPIs"""
        response = client.get('/dashboard/kpis',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'volume_tarefas' in data
        assert 'demandas_por_status' in data
        assert 'periodo' in data
        assert 'tempo_medio_conclusao_dias' in data  # Nome correto do campo
        assert 'taxa_cumprimento_prazos' in data  # Nome correto do campo

@pytest.mark.api
class TestImportacaoAPI:
    """Testes para endpoints de importação"""
    
    def test_import_without_file(self, client, auth_headers_socio):
        """Testa importação sem arquivo"""
        response = client.post('/demandas/importar',
            headers=auth_headers_socio
        )
        
        assert response.status_code == 400
    
    def test_import_permission_denied(self, client, auth_headers_funcionario):
        """Testa importação sem permissão (funcionário)"""
        response = client.post('/demandas/importar',
            headers=auth_headers_funcionario
        )
        
        assert response.status_code == 403
