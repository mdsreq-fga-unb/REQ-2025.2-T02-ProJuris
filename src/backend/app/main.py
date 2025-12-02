from flask import Blueprint, request, jsonify, send_file
from flask_login import login_required, current_user
from app import db 
from app.models import Demanda, User, KanbanColumn, Notificacao 
from app.decorators import token_required
from app.audit import registrar_auditoria
from app.pdf_generator import gerar_pdf_demandas
from app.importador import processar_importacao
from datetime import datetime, timedelta
from sqlalchemy import func, case
import io
from flask import send_from_directory, current_app

bp = Blueprint('main', __name__)

@bp.route('/', methods=['GET'])
def index():
    # Rota principal que serve o 'index.html' do React.
    # O `static_folder` já foi configurado no `create_app`.
    # O `errorhandler(404)` cuidará de servir o index.html para rotas do React.
    return send_from_directory(current_app.static_folder, 'index.html')

@bp.errorhandler(404)
def not_found(e):
    # Se uma rota de API não for encontrada, ou se for uma rota do React Router,
    # serve o index.html principal. O React Router cuidará do resto.
    return send_from_directory(current_app.static_folder, 'index.html')


@bp.route('/dashboard', methods=['GET'])
@token_required
def dashboard(current_user):
    
    return jsonify({
        'message': f'Bem-vindo ao seu dashboard, {current_user.email}!',
        'user_id': current_user.id
    })

@bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': current_user.id,
        'email': current_user.email
    })

@bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Nenhum dado enviado'}), 400
    
    if 'email' in data:
        novo_email = data['email']
        
        user_existente = User.query.filter(User.email == novo_email, User.id != current_user.id).first()
        if user_existente:
            return jsonify({'message': 'Este email já está em uso por outra conta'}), 400
        
        current_user.email = novo_email

    db.session.commit()
    
    return jsonify({'message': 'Perfil atualizado com sucesso!'})

@bp.route('/demandas', methods=['POST'])
@token_required
def create_demanda(current_user):
    data = request.get_json()
    
    # 1. Validação dos campos obrigatórios (RF01)
    if not all(k in data for k in ('titulo', 'data_prazo', 'responsavel_id')):
        return jsonify({'message': 'Dados incompletos. Título, Prazo e Responsável são obrigatórios.'}), 400

    # 2. Verifica se o responsável existe (RF03)
    responsavel = User.query.get(data['responsavel_id'])
    if not responsavel:
        return jsonify({'message': 'Responsável não encontrado.'}), 404

    # 3. Processa a data do prazo (deve vir no formato ISO 8601)
    try:
        data_prazo = datetime.fromisoformat(data['data_prazo'].replace('Z', '+00:00')) 
    except ValueError:
        return jsonify({'message': 'Formato de data de prazo inválido. Use formato ISO 8601.'}), 400

    # 4. Define a coluna inicial ou usa padrão
    coluna_id = data.get('coluna_id')
    
    if coluna_id:
        # Se foi especificado um ID de coluna, usa ele
        coluna = KanbanColumn.query.get(coluna_id)
        if not coluna:
            return jsonify({'message': f'Coluna com ID {coluna_id} não encontrada.'}), 404
    else:
        # Caso contrário, busca a primeira coluna do tipo 'nova'
        coluna = KanbanColumn.query.filter_by(tipo_coluna='nova').first()
        if not coluna:
            return jsonify({'message': 'Nenhuma coluna do tipo "nova" encontrada.'}), 404

    # 5. Cria a nova demanda 
    nova_demanda = Demanda(
        titulo=data['titulo'],
        descricao=data.get('descricao'),
        data_prazo=data_prazo,
        responsavel_id=data['responsavel_id'],
        prioridade=data.get('prioridade', 'normal'),
        status=coluna.tipo_coluna,  # Status = tipo da coluna (nova, em_andamento, revisao, concluido)
        coluna_id=coluna.id  # Vincula à coluna específica
    )

    # 6. Salva no banco de dados
    try:
        db.session.add(nova_demanda)
        db.session.commit()
        
        # RN03: Auditoria - Registra criação de demanda
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='criar',
            entidade='demanda',
            entidade_id=nova_demanda.id,
            detalhes={
                'titulo': nova_demanda.titulo,
                'responsavel_id': nova_demanda.responsavel_id,
                'status': nova_demanda.status,
                'coluna_id': nova_demanda.coluna_id
            }
        )
        
        # RN04: Notificação - Nova atribuição de demanda
        if nova_demanda.responsavel_id != current_user.id:
            # Verifica se já existe notificação idêntica nos últimos 10 segundos (evita duplicatas)
            limite_tempo = datetime.utcnow() - timedelta(seconds=10)
            notif_existente = Notificacao.query.filter(
                Notificacao.destinatario_id == nova_demanda.responsavel_id,
                Notificacao.demanda_id == nova_demanda.id,
                Notificacao.tipo == 'nova_atribuicao',
                Notificacao.data_criacao >= limite_tempo
            ).first()
            
            if not notif_existente:
                notificacao = Notificacao(
                    tipo='nova_atribuicao',
                    mensagem=f'Você foi atribuído à demanda "{nova_demanda.titulo}" por {current_user.nome}.',
                    destinatario_id=nova_demanda.responsavel_id,
                    demanda_id=nova_demanda.id,
                    remetente_id=current_user.id
                )
                db.session.add(notificacao)
                db.session.commit()
        
        return jsonify({'message': 'Demanda cadastrada com sucesso!', 'demanda': nova_demanda.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao salvar a demanda: {str(e)}'}), 500

# RN01: Rota Importação de Demandas via Excel/CSV ---
@bp.route('/demandas/importar', methods=['POST'])
@token_required
def import_demandas(current_user):
    """
    Importa demandas em lote via arquivo Excel/CSV
    
    Aceita:
        - arquivo: Arquivo Excel (.xlsx, .xls) ou CSV (.csv)
        - responsavel_padrao_id: ID do responsável padrão para demandas sem responsável
    
    Retorna:
        - preview: Lista de demandas validadas
        - relatório: Estatísticas da importação
    """
    # 1. Verifica permissão (apenas sócios podem importar em lote)
    if current_user.role != 'socio':
        return jsonify({'message': 'Apenas sócios podem importar demandas em lote.'}), 403
    
    # 2. Verifica se arquivo foi enviado
    if 'arquivo' not in request.files:
        return jsonify({'message': 'Nenhum arquivo foi enviado.'}), 400
    
    arquivo = request.files['arquivo']
    
    if arquivo.filename == '':
        return jsonify({'message': 'Nome de arquivo vazio.'}), 400
    
    # 3. Valida extensão do arquivo
    extensao = arquivo.filename.lower().split('.')[-1]
    if extensao not in ['xlsx', 'xls', 'csv']:
        return jsonify({'message': 'Formato de arquivo não suportado. Use .xlsx, .xls ou .csv'}), 400
    
    # 4. Processa importação
    try:
        arquivo_bytes = arquivo.read()
        demandas_validadas, relatorio = processar_importacao(arquivo_bytes, arquivo.filename)
        
        if not relatorio['sucesso']:
            return jsonify({
                'message': 'Erro ao processar arquivo.',
                'relatorio': relatorio
            }), 400
        
        # 5. Preview: Retorna demandas validadas SEM salvar no banco (usuário confirma depois)
        # Detecta duplicatas (título + descrição similar)
        duplicatas = []
        for idx, demanda in enumerate(demandas_validadas):
            demanda_existente = Demanda.query.filter(
                func.lower(Demanda.titulo) == func.lower(demanda['titulo'])
            ).first()
            
            if demanda_existente:
                duplicatas.append({
                    'linha': idx + 2,  # +2 porque linha 1 é header
                    'titulo': demanda['titulo'],
                    'demanda_existente_id': demanda_existente.id
                })
        
        return jsonify({
            'message': 'Arquivo processado com sucesso. Revise as demandas antes de confirmar importação.',
            'preview': demandas_validadas,
            'relatorio': relatorio,
            'duplicatas': duplicatas,
            'total_duplicatas': len(duplicatas)
        }), 200
    
    except Exception as e:
        return jsonify({'message': f'Erro ao processar arquivo: {str(e)}'}), 500

# RN01: Rota Confirmar Importação ---
@bp.route('/demandas/importar/confirmar', methods=['POST'])
@token_required
def confirmar_import_demandas(current_user):
    """
    Confirma e salva as demandas importadas no banco de dados
    
    Aceita:
        - demandas: Lista de demandas validadas para importar
        - responsavel_padrao_id: ID do responsável padrão (obrigatório)
        - ignorar_duplicatas: Boolean para pular duplicatas
    """
    # 1. Verifica permissão
    if current_user.role != 'socio':
        return jsonify({'message': 'Apenas sócios podem importar demandas em lote.'}), 403
    
    data = request.get_json()
    
    if 'demandas' not in data or not data['demandas']:
        return jsonify({'message': 'Nenhuma demanda foi enviada para importação.'}), 400
    
    if 'responsavel_padrao_id' not in data:
        return jsonify({'message': 'Responsável padrão é obrigatório para importação.'}), 400
    
    # 2. Valida responsável padrão
    responsavel_padrao = User.query.get(data['responsavel_padrao_id'])
    if not responsavel_padrao:
        return jsonify({'message': 'Responsável padrão não encontrado.'}), 404
    
    # 3. Busca coluna padrão (nova/pendente)
    coluna_padrao = KanbanColumn.query.filter_by(tipo_coluna='nova').first()
    if not coluna_padrao:
        coluna_padrao = KanbanColumn.query.filter_by(tipo_coluna='pendente').first()
    
    if not coluna_padrao:
        return jsonify({'message': 'Nenhuma coluna padrão encontrada para importação.'}), 500
    
    # 4. Importa demandas
    demandas_importadas = []
    demandas_puladas = []
    ignorar_duplicatas = data.get('ignorar_duplicatas', False)
    
    for demanda_data in data['demandas']:
        # Verifica duplicata
        if ignorar_duplicatas:
            demanda_existente = Demanda.query.filter(
                func.lower(Demanda.titulo) == func.lower(demanda_data['titulo'])
            ).first()
            
            if demanda_existente:
                demandas_puladas.append({
                    'titulo': demanda_data['titulo'],
                    'motivo': 'Demanda com título similar já existe'
                })
                continue
        
        # Busca responsável específico pelo nome (se fornecido)
        responsavel_id = data['responsavel_padrao_id']
        if 'responsavel_nome' in demanda_data and demanda_data['responsavel_nome']:
            responsavel_especifico = User.query.filter(
                func.lower(User.nome) == func.lower(demanda_data['responsavel_nome'])
            ).first()
            if responsavel_especifico:
                responsavel_id = responsavel_especifico.id
        
        # Cria demanda
        nova_demanda = Demanda(
            titulo=demanda_data['titulo'],
            descricao=demanda_data.get('descricao', ''),
            cliente=demanda_data.get('cliente', ''),
            data_prazo=datetime.strptime(demanda_data['prazo'], '%Y-%m-%d') if demanda_data.get('prazo') else None,
            responsavel_id=responsavel_id,
            prioridade=demanda_data.get('prioridade', 'normal'),
            status=demanda_data.get('status', 'pendente'),
            coluna_id=coluna_padrao.id
        )
        
        try:
            db.session.add(nova_demanda)
            db.session.flush()  # Flush para obter o ID antes do commit
            
            demandas_importadas.append(nova_demanda.to_dict())
            
            # Auditoria
            registrar_auditoria(
                usuario_id=current_user.id,
                acao='importar',
                entidade='demanda',
                entidade_id=nova_demanda.id,
                detalhes={
                    'titulo': nova_demanda.titulo,
                    'via': 'importacao_excel_csv'
                }
            )
            
            # Notificação
            if nova_demanda.responsavel_id != current_user.id:
                # Verifica se já existe notificação idêntica nos últimos 10 segundos (evita duplicatas)
                limite_tempo = datetime.utcnow() - timedelta(seconds=10)
                notif_existente = Notificacao.query.filter(
                    Notificacao.destinatario_id == nova_demanda.responsavel_id,
                    Notificacao.demanda_id == nova_demanda.id,
                    Notificacao.tipo == 'nova_atribuicao',
                    Notificacao.data_criacao >= limite_tempo
                ).first()
                
                if not notif_existente:
                    notificacao = Notificacao(
                        tipo='nova_atribuicao',
                        mensagem=f'Você foi atribuído à demanda "{nova_demanda.titulo}" via importação por {current_user.nome}.',
                        destinatario_id=nova_demanda.responsavel_id,
                        demanda_id=nova_demanda.id,
                        remetente_id=current_user.id
                    )
                    db.session.add(notificacao)
        
        except Exception as e:
            demandas_puladas.append({
                'titulo': demanda_data['titulo'],
                'motivo': f'Erro ao salvar: {str(e)}'
            })
    
    # 5. Commit final
    try:
        db.session.commit()
        
        return jsonify({
            'message': f'{len(demandas_importadas)} demandas importadas com sucesso!',
            'total_importadas': len(demandas_importadas),
            'total_puladas': len(demandas_puladas),
            'demandas_importadas': demandas_importadas,
            'demandas_puladas': demandas_puladas
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao salvar demandas: {str(e)}'}), 500

# Rota Listar Usuários (Auxiliar para RF03) ---
@bp.route('/usuarios', methods=['GET'])
@token_required
def list_users(current_user):
    users = User.query.all()
    return jsonify([{'id': u.id, 'nome': u.nome, 'email': u.email} for u in users]), 200

# Rota Atualizar Demanda ---
@bp.route('/demandas/<int:demanda_id>', methods=['PUT'])
@token_required
def update_demanda(current_user, demanda_id):
    # Busca a demanda
    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({'message': 'Demanda não encontrada.'}), 404
    
    # Verifica se o usuário tem permissão (sócio pode editar todas, funcionário só as suas)
    if current_user.role != 'socio' and demanda.responsavel_id != current_user.id:
        return jsonify({'message': 'Você não tem permissão para editar esta demanda.'}), 403
    
    data = request.get_json()
    
    # Atualiza os campos permitidos
    if 'titulo' in data:
        demanda.titulo = data['titulo']
    
    if 'descricao' in data:
        demanda.descricao = data['descricao']
    
    if 'data_prazo' in data:
        try:
            demanda.data_prazo = datetime.fromisoformat(data['data_prazo'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'message': 'Formato de data inválido.'}), 400
    
    if 'status' in data:
        demanda.status = data['status']
    
    if 'prioridade' in data: # NOVO: Atualiza a prioridade na edição
        demanda.prioridade = data['prioridade'] 
    
    # Apenas sócio pode reatribuir demandas
    if 'responsavel_id' in data and current_user.role == 'socio':
        responsavel_antigo_id = demanda.responsavel_id
        responsavel = User.query.get(data['responsavel_id'])
        if not responsavel:
            return jsonify({'message': 'Responsável não encontrado.'}), 404
        demanda.responsavel_id = data['responsavel_id']
        
        # RN04: Notificação - Reatribuição de demanda
        if responsavel_antigo_id != data['responsavel_id']:
            # Verifica se já existe notificação idêntica nos últimos 10 segundos (evita duplicatas)
            limite_tempo = datetime.utcnow() - timedelta(seconds=10)
            notif_existente = Notificacao.query.filter(
                Notificacao.destinatario_id == data['responsavel_id'],
                Notificacao.demanda_id == demanda.id,
                Notificacao.tipo == 'reatribuicao',
                Notificacao.data_criacao >= limite_tempo
            ).first()
            
            if not notif_existente:
                notificacao = Notificacao(
                    tipo='reatribuicao',
                    mensagem=f'A demanda "{demanda.titulo}" foi reatribuída para você por {current_user.nome}.',
                    destinatario_id=data['responsavel_id'],
                    demanda_id=demanda.id,
                    remetente_id=current_user.id
                )
                db.session.add(notificacao)
    
    try:
        db.session.commit()
        
        # RN03: Auditoria - Registra edição de demanda
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='editar',
            entidade='demanda',
            entidade_id=demanda.id,
            detalhes={
                'campos_alterados': list(data.keys()),
                'titulo': demanda.titulo
            }
        )
        
        return jsonify({'message': 'Demanda atualizada com sucesso!', 'demanda': demanda.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar demanda: {str(e)}'}), 500
    
# Rota para atualização rápida de status (Kanban) ---
@bp.route('/demandas/<int:demanda_id>/status', methods=['PATCH'])
@token_required
def patch_demanda_status(current_user, demanda_id):
    # 1. Busca a demanda
    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({'message': 'Demanda não encontrada.'}), 404
    
    # 2. Verifica permissão (Sócio pode alterar todas; Funcionário só pode alterar as suas)
    if current_user.role != 'socio' and demanda.responsavel_id != current_user.id:
        return jsonify({'message': 'Você não tem permissão para alterar o status desta demanda.'}), 403
    
    data = request.get_json()
    novo_tipo = data.get('tipo_coluna')
    nova_coluna_id = data.get('coluna_id')
    
    if not novo_tipo and not nova_coluna_id:
        return jsonify({'message': 'Tipo de coluna ou ID da coluna não fornecido.'}), 400
    
    # 3. Busca a coluna de destino
    if nova_coluna_id:
        coluna_destino = KanbanColumn.query.get(nova_coluna_id)
    else:
        coluna_destino = KanbanColumn.query.filter_by(tipo_coluna=novo_tipo).first()
    
    if not coluna_destino:
        return jsonify({'message': 'Coluna de destino não encontrada.'}), 404
    
    # 4. Busca a coluna de origem (status atual)
    coluna_origem = KanbanColumn.query.get(demanda.coluna_id) if demanda.coluna_id else None
    
    # 5. VALIDAÇÕES DE REGRAS DE NEGÓCIO (FUNCIONÁRIOS)
    if current_user.role == 'funcionario':
        # REGRA 1: Não pode mover para coluna de CONCLUÍDO
        if coluna_destino.tipo_coluna == 'concluido':
            return jsonify({
                'message': 'Apenas sócios podem mover demandas para a coluna de Concluído.',
                'tipo': 'restricao_concluido'
            }), 403
        
        # REGRA 2: Se a demanda está em REVISÃO, funcionário não pode mover
        if coluna_origem and coluna_origem.tipo_coluna == 'revisao':
            return jsonify({
                'message': 'Demandas em revisão só podem ser movidas pelo sócio.',
                'tipo': 'restricao_revisao'
            }), 403
        
        # REGRA 3: Se está movendo PARA coluna de REVISÃO, criar notificação para sócios
        if coluna_destino.tipo_coluna == 'revisao':
            # Busca todos os sócios para notificar
            socios = User.query.filter_by(role='socio').all()
            for socio in socios:
                # Verifica se já existe notificação idêntica nos últimos 10 segundos (evita duplicatas)
                limite_tempo = datetime.utcnow() - timedelta(seconds=10)
                notif_existente = Notificacao.query.filter(
                    Notificacao.destinatario_id == socio.id,
                    Notificacao.demanda_id == demanda.id,
                    Notificacao.tipo == 'revisao',
                    Notificacao.data_criacao >= limite_tempo
                ).first()
                
                if not notif_existente:
                    notificacao = Notificacao(
                        tipo='revisao',
                        mensagem=f'{current_user.nome} enviou a demanda "{demanda.titulo}" para revisão.',
                        destinatario_id=socio.id,
                        demanda_id=demanda.id,
                        remetente_id=current_user.id
                    )
                    db.session.add(notificacao)
    
    # RN04: Notificação - Mudança de status (para o responsável, se não for quem moveu)
    if demanda.responsavel_id != current_user.id and coluna_destino.tipo_coluna != 'revisao':
        # Verifica se já existe notificação idêntica nos últimos 10 segundos (evita duplicatas)
        limite_tempo = datetime.utcnow() - timedelta(seconds=10)
        notif_existente = Notificacao.query.filter(
            Notificacao.destinatario_id == demanda.responsavel_id,
            Notificacao.demanda_id == demanda.id,
            Notificacao.tipo == 'mudanca_status',
            Notificacao.data_criacao >= limite_tempo
        ).first()
        
        if not notif_existente:
            notificacao = Notificacao(
                tipo='mudanca_status',
                mensagem=f'A demanda "{demanda.titulo}" foi movida para "{coluna_destino.nome}" por {current_user.nome}.',
                destinatario_id=demanda.responsavel_id,
                demanda_id=demanda.id,
                remetente_id=current_user.id
            )
            db.session.add(notificacao)
    
    # 6. Status anterior para histórico
    status_anterior = demanda.status
    coluna_anterior_id = demanda.coluna_id
        
    # 7. Atualiza o status e coluna
    demanda.status = coluna_destino.tipo_coluna
    demanda.coluna_id = coluna_destino.id
    
    # 8. Salva no banco de dados
    try:
        db.session.commit()
        
        # RN03: Auditoria - Registra movimentação no Kanban
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='mover_kanban',
            entidade='demanda',
            entidade_id=demanda.id,
            detalhes={
                'titulo': demanda.titulo,
                'coluna_origem_id': coluna_anterior_id,
                'coluna_destino_id': coluna_destino.id,
                'status_anterior': status_anterior,
                'status_novo': coluna_destino.tipo_coluna
            }
        )
        
        return jsonify({
            'message': 'Status atualizado com sucesso!',
            'status_anterior': status_anterior,
            'status_novo': coluna_destino.tipo_coluna,
            'coluna_anterior_id': coluna_anterior_id,
            'coluna_nova_id': coluna_destino.id,
            'notificacao_enviada': coluna_destino.tipo_coluna == 'revisao' and current_user.role == 'funcionario'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar status: {str(e)}'}), 500

# Rota Obter Demanda por ID ---
@bp.route('/demandas/<int:demanda_id>', methods=['GET'])
@token_required
def get_demanda(current_user, demanda_id):
    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({'message': 'Demanda não encontrada.'}), 404
    
    return jsonify(demanda.to_dict()), 200

# Rota Deletar Demanda (Apenas Sócio) ---
@bp.route('/demandas/<int:demanda_id>', methods=['DELETE'])
@token_required
def delete_demanda(current_user, demanda_id):
    # RNF01: Apenas sócios podem excluir demandas
    if current_user.role != 'socio':
        return jsonify({'message': 'Acesso negado. Apenas sócios podem excluir demandas.'}), 403
    
    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({'message': 'Demanda não encontrada.'}), 404
    
    # Salvar info para auditoria antes de excluir
    demanda_info = {
        'id': demanda.id,
        'titulo': demanda.titulo,
        'responsavel_id': demanda.responsavel_id,
        'status': demanda.status
    }
    
    try:
        db.session.delete(demanda)
        db.session.commit()
        
        # RN03: Auditoria - Registra exclusão de demanda
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='excluir',
            entidade='demanda',
            entidade_id=demanda_info['id'],
            detalhes=demanda_info
        )
        
        return jsonify({'message': 'Demanda excluída com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao excluir demanda: {str(e)}'}), 500

# Rota Listar Demandas ---
@bp.route('/demandas', methods=['GET'])
@token_required
def list_demandas(current_user):
    try:
        demandas = Demanda.query.all()
        return jsonify([d.to_dict() for d in demandas]), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao listar demandas: {str(e)}'}), 500

# Rotas para Gerenciamento de Colunas do Kanban (Exclusivo Sócio) ---
@bp.route('/kanban/colunas', methods=['GET'])
@token_required
def get_kanban_columns(current_user):
    try:
        colunas = KanbanColumn.query.order_by(KanbanColumn.ordem).all()
        return jsonify([c.to_dict() for c in colunas]), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao listar colunas: {str(e)}'}), 500

@bp.route('/kanban/colunas', methods=['POST'])
@token_required
def create_kanban_column(current_user):
    # Apenas sócios podem criar colunas
    if current_user.role != 'socio':
        return jsonify({'message': 'Acesso negado. Apenas sócios podem gerenciar colunas.'}), 403
    
    data = request.get_json()
    
    if not all(k in data for k in ('nome', 'tipo_coluna')):
        return jsonify({'message': 'Dados incompletos. Nome e Tipo de Coluna são obrigatórios.'}), 400
    
    # Validação do tipo de coluna
    tipos_validos = ['nova', 'em_andamento', 'revisao', 'concluido']
    if data['tipo_coluna'] not in tipos_validos:
        return jsonify({'message': f'Tipo de coluna inválido. Use: {", ".join(tipos_validos)}'}), 400
    
    # Pega a maior ordem atual e adiciona 1
    max_ordem = db.session.query(db.func.max(KanbanColumn.ordem)).scalar() or 0
    
    nova_coluna = KanbanColumn(
        nome=data['nome'],
        cor=data.get('cor', '#3b82f6'),
        ordem=max_ordem + 1,
        tipo_coluna=data['tipo_coluna']
    )
    
    try:
        db.session.add(nova_coluna)
        db.session.commit()
        
        # RN03: Auditoria - Registra criação de coluna
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='criar',
            entidade='coluna',
            entidade_id=nova_coluna.id,
            detalhes={
                'nome': nova_coluna.nome,
                'tipo_coluna': nova_coluna.tipo_coluna,
                'cor': nova_coluna.cor,
                'ordem': nova_coluna.ordem
            }
        )
        
        return jsonify({'message': 'Coluna criada com sucesso!', 'coluna': nova_coluna.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao criar coluna: {str(e)}'}), 500

@bp.route('/kanban/colunas/<int:coluna_id>', methods=['PUT'])
@token_required
def update_kanban_column(current_user, coluna_id):
    # Apenas sócios podem editar colunas
    if current_user.role != 'socio':
        return jsonify({'message': 'Acesso negado. Apenas sócios podem gerenciar colunas.'}), 403
    
    coluna = KanbanColumn.query.get(coluna_id)
    if not coluna:
        return jsonify({'message': 'Coluna não encontrada.'}), 404
    
    data = request.get_json()
    
    if 'nome' in data:
        coluna.nome = data['nome']
    
    if 'cor' in data:
        coluna.cor = data['cor']
    
    if 'ordem' in data:
        coluna.ordem = data['ordem']
    
    if 'tipo_coluna' in data:
        tipos_validos = ['nova', 'em_andamento', 'revisao', 'concluido']
        if data['tipo_coluna'] not in tipos_validos:
            return jsonify({'message': f'Tipo de coluna inválido. Use: {", ".join(tipos_validos)}'}), 400
        coluna.tipo_coluna = data['tipo_coluna']
    
    try:
        db.session.commit()
        
        # RN03: Auditoria - Registra edição de coluna
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='editar',
            entidade='coluna',
            entidade_id=coluna.id,
            detalhes={
                'campos_alterados': list(data.keys()),
                'nome': coluna.nome,
                'tipo_coluna': coluna.tipo_coluna
            }
        )
        
        return jsonify({'message': 'Coluna atualizada com sucesso!', 'coluna': coluna.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao atualizar coluna: {str(e)}'}), 500

@bp.route('/kanban/colunas/<int:coluna_id>', methods=['DELETE'])
@token_required
def delete_kanban_column(current_user, coluna_id):
    # Apenas sócios podem deletar colunas
    if current_user.role != 'socio':
        return jsonify({'message': 'Acesso negado. Apenas sócios podem gerenciar colunas.'}), 403
    
    coluna = KanbanColumn.query.get(coluna_id)
    if not coluna:
        return jsonify({'message': 'Coluna não encontrada.'}), 404
    
    # Salvar info para auditoria antes de excluir
    coluna_info = {
        'id': coluna.id,
        'nome': coluna.nome,
        'tipo_coluna': coluna.tipo_coluna,
        'ordem': coluna.ordem
    }
    
    try:
        db.session.delete(coluna)
        db.session.commit()
        
        # RN03: Auditoria - Registra exclusão de coluna
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='excluir',
            entidade='coluna',
            entidade_id=coluna_info['id'],
            detalhes=coluna_info
        )
        
        return jsonify({'message': 'Coluna deletada com sucesso!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao deletar coluna: {str(e)}'}), 500

# Rotas para Notificações ---
@bp.route('/notificacoes', methods=['GET'])
@token_required
def get_notificacoes(current_user):
    """Lista todas as notificações do usuário logado"""
    try:
        # Busca notificações não lidas primeiro, depois as lidas
        notificacoes = Notificacao.query.filter_by(destinatario_id=current_user.id)\
            .order_by(Notificacao.lida.asc(), Notificacao.data_criacao.desc())\
            .all()
        
        return jsonify({
            'notificacoes': [n.to_dict() for n in notificacoes],
            'total': len(notificacoes),
            'nao_lidas': sum(1 for n in notificacoes if not n.lida)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao listar notificações: {str(e)}'}), 500

@bp.route('/notificacoes/<int:notificacao_id>/marcar-lida', methods=['PATCH'])
@token_required
def marcar_notificacao_lida(current_user, notificacao_id):
    """Marca uma notificação como lida"""
    notificacao = Notificacao.query.get(notificacao_id)
    
    if not notificacao:
        return jsonify({'message': 'Notificação não encontrada.'}), 404
    
    if notificacao.destinatario_id != current_user.id:
        return jsonify({'message': 'Você não tem permissão para marcar esta notificação.'}), 403
    
    notificacao.lida = True
    
    try:
        db.session.commit()
        return jsonify({'message': 'Notificação marcada como lida.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao marcar notificação: {str(e)}'}), 500

@bp.route('/notificacoes/marcar-todas-lidas', methods=['PATCH'])
@token_required
def marcar_todas_lidas(current_user):
    """Marca todas as notificações do usuário como lidas"""
    try:
        Notificacao.query.filter_by(destinatario_id=current_user.id, lida=False)\
            .update({Notificacao.lida: True})
        db.session.commit()
        return jsonify({'message': 'Todas as notificações foram marcadas como lidas.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Erro ao marcar notificações: {str(e)}'}), 500

# Rotas para Dashboard de KPIs (RNF06) ---
@bp.route('/dashboard/kpis', methods=['GET'])
@token_required
def get_dashboard_kpis(current_user):
    """Retorna KPIs do dashboard com filtros de período"""
    try:
        # Parâmetros de filtro (em dias)
        periodo = request.args.get('periodo', type=int, default=30)  # 7, 30 ou custom
        data_inicio_str = request.args.get('data_inicio')
        data_fim_str = request.args.get('data_fim')
        
        # Define intervalo de datas
        data_fim = datetime.now()
        if data_fim_str:
            data_fim = datetime.fromisoformat(data_fim_str.replace('Z', '+00:00'))
        
        if data_inicio_str:
            data_inicio = datetime.fromisoformat(data_inicio_str.replace('Z', '+00:00'))
        else:
            data_inicio = data_fim - timedelta(days=periodo)
        
        # KPI 1: Volume de tarefas (concluídas vs pendentes)
        total_demandas = Demanda.query.filter(
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).count()
        
        demandas_concluidas = Demanda.query.filter(
            Demanda.status == 'concluido',
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).count()
        
        demandas_pendentes = total_demandas - demandas_concluidas
        
        # KPI 2: Tempo médio de conclusão (em dias)
        demandas_concluidas_obj = Demanda.query.filter(
            Demanda.status == 'concluido',
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).all()
        
        if demandas_concluidas_obj:
            tempos = [(d.data_prazo - d.data_criacao).days for d in demandas_concluidas_obj if d.data_prazo]
            tempo_medio_conclusao = sum(tempos) / len(tempos) if tempos else 0
        else:
            tempo_medio_conclusao = 0
        
        # KPI 3: Taxa de cumprimento de prazos
        demandas_com_prazo = Demanda.query.filter(
            Demanda.status == 'concluido',
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim,
            Demanda.data_prazo.isnot(None)
        ).all()
        
        if demandas_com_prazo:
            cumpridas_no_prazo = sum(1 for d in demandas_com_prazo if d.data_prazo >= datetime.now())
            taxa_cumprimento = (cumpridas_no_prazo / len(demandas_com_prazo)) * 100
        else:
            taxa_cumprimento = 0
        
        # KPI 4: Demandas por status
        demandas_por_status = db.session.query(
            Demanda.status,
            func.count(Demanda.id).label('count')
        ).filter(
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).group_by(Demanda.status).all()
        
        # KPI 5: Demandas por prioridade
        demandas_por_prioridade = db.session.query(
            Demanda.prioridade,
            func.count(Demanda.id).label('count')
        ).filter(
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).group_by(Demanda.prioridade).all()
        
        # KPI 6: Top responsáveis (por número de demandas)
        top_responsaveis = db.session.query(
            User.id,
            User.nome,
            func.count(Demanda.id).label('count')
        ).join(Demanda, User.id == Demanda.responsavel_id)\
        .filter(
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).group_by(User.id, User.nome)\
        .order_by(func.count(Demanda.id).desc())\
        .limit(5).all()
        
        # KPI 7: Demandas atrasadas
        demandas_atrasadas = Demanda.query.filter(
            Demanda.status != 'concluido',
            Demanda.data_prazo < datetime.now(),
            Demanda.data_criacao >= data_inicio,
            Demanda.data_criacao <= data_fim
        ).count()
        
        return jsonify({
            'periodo': {
                'data_inicio': data_inicio.isoformat(),
                'data_fim': data_fim.isoformat(),
                'dias': periodo
            },
            'volume_tarefas': {
                'total': total_demandas,
                'concluidas': demandas_concluidas,
                'pendentes': demandas_pendentes,
                'percentual_conclusao': (demandas_concluidas / total_demandas * 100) if total_demandas > 0 else 0
            },
            'tempo_medio_conclusao_dias': round(tempo_medio_conclusao, 2),
            'taxa_cumprimento_prazos': round(taxa_cumprimento, 2),
            'demandas_por_status': [{'status': s, 'count': c} for s, c in demandas_por_status],
            'demandas_por_prioridade': [{'prioridade': p, 'count': c} for p, c in demandas_por_prioridade],
            'top_responsaveis': [{'id': id, 'nome': nome, 'demandas': count} for id, nome, count in top_responsaveis],
            'demandas_atrasadas': demandas_atrasadas
        }), 200
        
    except Exception as e:
        return jsonify({'message': f'Erro ao calcular KPIs: {str(e)}'}), 500

# Rota para Geração de PDF (RNF07) ---
@bp.route('/relatorios/pdf', methods=['GET'])
@token_required
def gerar_relatorio_pdf(current_user):
    """
    Gera relatório de demandas em PDF (resumido ou detalhado)
    
    Query params:
        - tipo: 'resumido' ou 'detalhado' (default: 'resumido')
        - status: Filtrar por status
        - prioridade: Filtrar por prioridade
        - responsavel_id: Filtrar por responsável
        - data_inicio: Filtrar demandas criadas após esta data (YYYY-MM-DD)
        - data_fim: Filtrar demandas criadas antes desta data (YYYY-MM-DD)
    
    Returns:
        PDF file (application/pdf)
    """
    try:
        # Parâmetros
        tipo = request.args.get('tipo', 'resumido')
        if tipo not in ['resumido', 'detalhado']:
            return jsonify({'message': 'Tipo inválido. Use "resumido" ou "detalhado"'}), 400
        
        # Construir query base
        query = Demanda.query
        
        # Aplicar filtros
        filtros_aplicados = {}
        
        status = request.args.get('status')
        if status:
            query = query.filter_by(status=status)
            filtros_aplicados['Status'] = status.capitalize()
        
        prioridade = request.args.get('prioridade')
        if prioridade:
            query = query.filter_by(prioridade=prioridade)
            filtros_aplicados['Prioridade'] = prioridade.capitalize()
        
        responsavel_id = request.args.get('responsavel_id', type=int)
        if responsavel_id:
            query = query.filter_by(responsavel_id=responsavel_id)
            responsavel = User.query.get(responsavel_id)
            if responsavel:
                filtros_aplicados['Responsável'] = responsavel.nome
        
        data_inicio = request.args.get('data_inicio')
        if data_inicio:
            query = query.filter(Demanda.data_criacao >= data_inicio)
            filtros_aplicados['Data Início'] = data_inicio
        
        data_fim = request.args.get('data_fim')
        if data_fim:
            query = query.filter(Demanda.data_criacao <= data_fim)
            filtros_aplicados['Data Fim'] = data_fim
        
        # RNF01: Funcionários só veem suas demandas
        if current_user.role == 'funcionario':
            query = query.filter_by(responsavel_id=current_user.id)
        
        # Executar query
        demandas_objs = query.all()
        
        # Converter para dicts
        demandas = []
        for d in demandas_objs:
            responsavel = User.query.get(d.responsavel_id) if d.responsavel_id else None
            
            demandas.append({
                'id': d.id,
                'titulo': d.titulo,
                'descricao': d.descricao,
                'status': d.status,
                'prioridade': d.prioridade,
                'cliente': d.cliente,
                'prazo': d.prazo.strftime('%Y-%m-%d') if d.prazo else None,
                'data_criacao': d.data_criacao.strftime('%Y-%m-%d') if d.data_criacao else None,
                'ultima_atualizacao': d.updated_at.strftime('%Y-%m-%d') if d.updated_at else None,
                'responsavel': responsavel.nome if responsavel else 'Não atribuído'
            })
        
        # Verificar se há demandas
        if not demandas:
            return jsonify({'message': 'Nenhuma demanda encontrada com os filtros especificados'}), 404
        
        # Gerar PDF
        pdf_bytes = gerar_pdf_demandas(demandas, tipo=tipo, filtros=filtros_aplicados)
        
        # Criar buffer
        buffer = io.BytesIO(pdf_bytes)
        buffer.seek(0)
        
        # Nome do arquivo
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'relatorio_{tipo}_{timestamp}.pdf'
        
        # Registrar auditoria
        registrar_auditoria(
            usuario_id=current_user.id,
            acao='gerou_relatorio_pdf',
            entidade='demanda',
            entidade_id=None,
            detalhes={
                'tipo': tipo,
                'total_demandas': len(demandas),
                'filtros': filtros_aplicados
            }
        )
        
        # Retornar PDF
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        return jsonify({'message': f'Erro ao gerar relatório PDF: {str(e)}'}), 500

# Rotas para Auditoria (RN03) ---
@bp.route('/auditoria', methods=['GET'])
@token_required
def get_auditoria(current_user):
    """Lista logs de auditoria - Apenas sócios têm acesso completo"""
    # RNF01: Apenas sócios podem acessar logs completos de auditoria
    if current_user.role != 'socio':
        return jsonify({'message': 'Acesso negado. Apenas sócios podem consultar logs de auditoria.'}), 403
    
    # Parâmetros de filtro opcionais
    entidade = request.args.get('entidade')  # demanda, coluna, notificacao
    entidade_id = request.args.get('entidade_id', type=int)
    usuario_id = request.args.get('usuario_id', type=int)
    limit = request.args.get('limit', 100, type=int)
    
    try:
        logs = get_audit_logs(
            entidade=entidade,
            entidade_id=entidade_id,
            usuario_id=usuario_id,
            limit=limit
        )
        return jsonify({
            'logs': logs,
            'total': len(logs)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao consultar logs de auditoria: {str(e)}'}), 500

@bp.route('/demandas/<int:demanda_id>/auditoria', methods=['GET'])
@token_required
def get_auditoria_demanda(current_user, demanda_id):
    """Lista histórico de auditoria de uma demanda específica"""
    demanda = Demanda.query.get(demanda_id)
    if not demanda:
        return jsonify({'message': 'Demanda não encontrada.'}), 404
    
    try:
        logs = get_audit_logs(entidade='demanda', entidade_id=demanda_id, limit=50)
        return jsonify({
            'demanda_id': demanda_id,
            'titulo': demanda.titulo,
            'historico': logs,
            'total': len(logs)
        }), 200
    except Exception as e:
        return jsonify({'message': f'Erro ao consultar histórico: {str(e)}'}), 500
