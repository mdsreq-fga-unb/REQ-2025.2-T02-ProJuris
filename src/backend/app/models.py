from app import db, login_manager
from flask_login import UserMixin
from datetime import datetime
from sqlalchemy.orm import relationship 

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class KanbanColumn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cor = db.Column(db.String(20), nullable=False, default='#3b82f6')
    ordem = db.Column(db.Integer, nullable=False)
    tipo_coluna = db.Column(db.String(20), nullable=False, default='em_andamento')  # Tipos: nova, em_andamento, revisao, concluido (também é o status da demanda)
    data_criacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<KanbanColumn {self.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'cor': self.cor,
            'ordem': self.ordem,
            'tipo_coluna': self.tipo_coluna,
            'data_criacao': self.data_criacao.isoformat()
        }

class AuditLog(db.Model):
    """RN03: Auditoria Compulsória de Ações"""
    __tablename__ = 'audit_log'
    
    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    usuario = relationship('User', backref='audit_logs')
    
    acao = db.Column(db.String(50), nullable=False)  # criar, editar, excluir, mover_kanban
    entidade = db.Column(db.String(50), nullable=False)  # demanda, coluna, notificacao
    entidade_id = db.Column(db.Integer, nullable=False)
    
    detalhes = db.Column(db.Text, nullable=True)  # JSON com mudanças específicas
    data_hora = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<AuditLog {self.acao} - {self.entidade}:{self.entidade_id} by User {self.usuario_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'usuario_id': self.usuario_id,
            'usuario_nome': self.usuario.nome if self.usuario else None,
            'acao': self.acao,
            'entidade': self.entidade,
            'entidade_id': self.entidade_id,
            'detalhes': self.detalhes,
            'data_hora': self.data_hora.isoformat()
        }

class Notificacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)  # 'revisao', 'prazo', etc
    mensagem = db.Column(db.Text, nullable=False)
    lida = db.Column(db.Boolean, default=False)
    data_criacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relacionamentos
    destinatario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destinatario = relationship('User', foreign_keys=[destinatario_id], backref='notificacoes_recebidas')
    
    demanda_id = db.Column(db.Integer, db.ForeignKey('demanda.id'), nullable=True)
    demanda = relationship('Demanda', backref='notificacoes')
    
    remetente_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    remetente = relationship('User', foreign_keys=[remetente_id])
    
    def __repr__(self):
        return f'<Notificacao {self.tipo} - {self.destinatario.nome}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'tipo': self.tipo,
            'mensagem': self.mensagem,
            'lida': self.lida,
            'data_criacao': self.data_criacao.isoformat(),
            'destinatario_id': self.destinatario_id,
            'demanda_id': self.demanda_id,
            'remetente_id': self.remetente_id,
            'remetente_nome': self.remetente.nome if self.remetente else None
        }

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    telefone = db.Column(db.String(20), nullable=True)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    oab = db.Column(db.String(50), nullable=True)
    role = db.Column(db.String(20), nullable=False, default='funcionario')

    def __repr__(self):
        return f'<User {self.nome} - {self.email}>'
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        from app import bcrypt
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        from app import bcrypt
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'telefone': self.telefone,
            'cpf': self.cpf,
            'oab': self.oab,
            'role': self.role
        }
    
class Demanda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text, nullable=True) 
    
    status = db.Column(db.String(50), nullable=False, default='Elaboração') 
    
    # NOVO CAMPO: Prioridade
    prioridade = db.Column(db.String(50), nullable=False, default='normal') 
    
    # Coluna específica do Kanban
    coluna_id = db.Column(db.Integer, db.ForeignKey('kanban_column.id'), nullable=True)
    coluna = relationship('KanbanColumn', backref='demandas_na_coluna', lazy=True)
    
    data_prazo = db.Column(db.DateTime, nullable=False)
    
    data_criacao = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    responsavel_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    responsavel = relationship('User', backref='demandas', lazy=True)

    def __repr__(self):
        return f'<Demanda {self.titulo} - Status: {self.status}>'

    # Método para serializar a demanda para resposta JSON
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'status': self.status,
            'prioridade': self.prioridade, # CRÍTICO: Novo campo para o frontend
            'coluna_id': self.coluna_id,
            'data_prazo': self.data_prazo.isoformat(),
            'data_criacao': self.data_criacao.isoformat(),
            'responsavel_id': self.responsavel_id,
            'responsavel_email': self.responsavel.email
        }