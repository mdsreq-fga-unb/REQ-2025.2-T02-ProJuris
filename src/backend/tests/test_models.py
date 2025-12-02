"""
Testes unitários para modelos - ProJuris
"""
import pytest
from app.models import User, Demanda, KanbanColumn, Notificacao, AuditLog
from datetime import datetime, timedelta

@pytest.mark.unit
class TestUserModel:
    """Testes para o modelo User"""
    
    def test_create_user(self, app):
        """Testa criação de usuário"""
        user = User(
            nome='Teste User',
            email='teste@test.com',
            cpf='11122233344',
            role='funcionario'
        )
        user.password = 'senha123'
        
        from app import db
        db.session.add(user)
        db.session.commit()
        
        assert user.id is not None
        assert user.nome == 'Teste User'
        assert user.email == 'teste@test.com'
        assert user.role == 'funcionario'
        assert user.check_password('senha123')
        assert not user.check_password('senha_errada')
    
    def test_user_to_dict(self, socio_user):
        """Testa serialização de usuário"""
        data = socio_user.to_dict()
        
        assert data['id'] == socio_user.id
        assert data['nome'] == 'Dr. João Silva'
        assert data['email'] == 'socio@test.com'
        assert data['role'] == 'socio'
        assert 'senha_hash' not in data

@pytest.mark.unit
class TestDemandaModel:
    """Testes para o modelo Demanda"""
    
    def test_create_demanda(self, app, funcionario_user, kanban_columns):
        """Testa criação de demanda"""
        from app import db
        demanda = Demanda(
            titulo='Nova Demanda',
            descricao='Descrição teste',
            data_prazo=datetime.now() + timedelta(days=10),
            responsavel_id=funcionario_user.id,
            prioridade='normal',
            status='nova',
            coluna_id=kanban_columns[0].id
        )
        db.session.add(demanda)
        db.session.commit()
        
        assert demanda.id is not None
        assert demanda.titulo == 'Nova Demanda'
        assert demanda.prioridade == 'normal'
        assert demanda.status == 'nova'
    
    def test_demanda_to_dict(self, demanda_sample):
        """Testa serialização de demanda"""
        data = demanda_sample.to_dict()
        
        assert data['id'] == demanda_sample.id
        assert data['titulo'] == 'Teste Demanda'
        assert data['prioridade'] == 'alta'
        assert 'responsavel_email' in data

@pytest.mark.unit
class TestKanbanColumnModel:
    """Testes para o modelo KanbanColumn"""
    
    def test_create_column(self, app):
        """Testa criação de coluna"""
        from app import db
        coluna = KanbanColumn(
            nome='Teste Coluna',
            tipo_coluna='teste',
            cor='#ff0000',
            ordem=1
        )
        db.session.add(coluna)
        db.session.commit()
        
        assert coluna.id is not None
        assert coluna.nome == 'Teste Coluna'
        assert coluna.tipo_coluna == 'teste'
        assert coluna.cor == '#ff0000'
    
    def test_column_to_dict(self, kanban_columns):
        """Testa serialização de coluna"""
        data = kanban_columns[0].to_dict()
        
        assert data['id'] == kanban_columns[0].id
        assert data['nome'] == 'Nova'
        assert data['tipo_coluna'] == 'nova'
        assert data['cor'] == '#e5e7eb'
        assert 'data_criacao' in data
