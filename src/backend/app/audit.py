"""
RN03: Sistema de Auditoria de Ações
Registra todas as ações críticas realizadas no sistema
"""
from app import db
from app.models import AuditLog
import json

def registrar_auditoria(usuario_id, acao, entidade, entidade_id, detalhes=None):
    """
    Registra uma ação de auditoria no banco de dados
    
    Args:
        usuario_id (int): ID do usuário que realizou a ação
        acao (str): Tipo de ação (criar, editar, excluir, mover_kanban)
        entidade (str): Tipo de entidade (demanda, coluna, notificacao)
        entidade_id (int): ID da entidade afetada
        detalhes (dict): Detalhes adicionais sobre a ação (opcional)
    """
    try:
        audit = AuditLog(
            usuario_id=usuario_id,
            acao=acao,
            entidade=entidade,
            entidade_id=entidade_id,
            detalhes=json.dumps(detalhes, ensure_ascii=False) if detalhes else None
        )
        db.session.add(audit)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Erro ao registrar auditoria: {str(e)}")
        db.session.rollback()
        return False

def get_audit_logs(entidade=None, entidade_id=None, usuario_id=None, limit=100):
    """
    Recupera logs de auditoria com filtros opcionais
    
    Args:
        entidade (str): Filtrar por tipo de entidade (opcional)
        entidade_id (int): Filtrar por ID da entidade (opcional)
        usuario_id (int): Filtrar por ID do usuário (opcional)
        limit (int): Limite de registros a retornar
    
    Returns:
        list: Lista de logs de auditoria
    """
    query = AuditLog.query
    
    if entidade:
        query = query.filter_by(entidade=entidade)
    if entidade_id:
        query = query.filter_by(entidade_id=entidade_id)
    if usuario_id:
        query = query.filter_by(usuario_id=usuario_id)
    
    logs = query.order_by(AuditLog.data_hora.desc()).limit(limit).all()
    return [log.to_dict() for log in logs]
