"""
Configuração de fixtures para testes - ProJuris
"""
import pytest
import sys
import os

# Adiciona o diretório raiz ao path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models import User, Demanda, KanbanColumn, Notificacao, AuditLog
from datetime import datetime, timedelta
import jwt

@pytest.fixture(scope='function')
def app():
    """Cria aplicação Flask para testes"""
    app = create_app()
    app.config.update({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
        'SECRET_KEY': 'test-secret-key-for-testing',
        'WTF_CSRF_ENABLED': False
    })
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture(scope='function')
def client(app):
    """Cliente de teste Flask"""
    return app.test_client()

@pytest.fixture(scope='function')
def runner(app):
    """CLI runner para testes"""
    return app.test_cli_runner()

@pytest.fixture(scope='function')
def socio_user(app):
    """Cria usuário sócio para testes"""
    user = User(
        nome='Dr. João Silva',
        email='socio@test.com',
        cpf='12345678901',
        role='socio'
    )
    user.password = 'senha123'
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture(scope='function')
def funcionario_user(app):
    """Cria usuário funcionário para testes"""
    user = User(
        nome='Ana Santos',
        email='funcionario@test.com',
        cpf='98765432109',
        role='funcionario'
    )
    user.password = 'senha123'
    db.session.add(user)
    db.session.commit()
    return user

@pytest.fixture(scope='function')
def auth_headers_socio(app, socio_user):
    """Headers de autenticação para sócio"""
    token = jwt.encode(
        {'user_id': socio_user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture(scope='function')
def auth_headers_funcionario(app, funcionario_user):
    """Headers de autenticação para funcionário"""
    token = jwt.encode(
        {'user_id': funcionario_user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return {'Authorization': f'Bearer {token}'}

@pytest.fixture(scope='function')
def kanban_columns(app):
    """Cria colunas kanban para testes"""
    columns = [
        KanbanColumn(nome='Nova', tipo_coluna='nova', cor='#e5e7eb', ordem=1),
        KanbanColumn(nome='Em Andamento', tipo_coluna='em_andamento', cor='#3b82f6', ordem=2),
        KanbanColumn(nome='Revisão', tipo_coluna='revisao', cor='#f59e0b', ordem=3),
        KanbanColumn(nome='Concluído', tipo_coluna='concluido', cor='#10b981', ordem=4),
    ]
    for col in columns:
        db.session.add(col)
    db.session.commit()
    return columns

@pytest.fixture(scope='function')
def demanda_sample(app, socio_user, funcionario_user, kanban_columns):
    """Cria demanda de exemplo para testes"""
    demanda = Demanda(
        titulo='Teste Demanda',
        descricao='Descrição de teste',
        data_prazo=datetime.now() + timedelta(days=7),
        responsavel_id=funcionario_user.id,
        prioridade='alta',
        status='nova',
        coluna_id=kanban_columns[0].id
    )
    db.session.add(demanda)
    db.session.commit()
    return demanda
