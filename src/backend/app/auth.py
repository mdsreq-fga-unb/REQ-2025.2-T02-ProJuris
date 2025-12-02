# app/auth.py
from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from flask_login import login_user, logout_user, current_user, login_required
import jwt
import datetime
from flask import current_app

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validação dos campos obrigatórios
    required_fields = ['nome', 'email', 'senha', 'cpf', 'role']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'message': 'Campos obrigatórios faltando'}), 400

    email = data.get('email')
    cpf = data.get('cpf')

    # Verifica se o email já existe
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email já cadastrado'}), 400
    
    # Verifica se o CPF já existe
    if User.query.filter_by(cpf=cpf).first():
        return jsonify({'message': 'CPF já cadastrado'}), 400

    # Cria novo usuário
    new_user = User(
        nome=data.get('nome'),
        email=email,
        telefone=data.get('telefone', ''),
        cpf=cpf,
        oab=data.get('oab', ''),
        role=data.get('role', 'funcionario')
    )
    new_user.password = data.get('senha')
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'Usuário cadastrado com sucesso',
        'user': new_user.to_dict()
    }), 201


@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not 'email' in data or not 'senha' in data:
        return jsonify({'message': 'Email e senha são obrigatórios'}), 400

    email = data.get('email')
    senha = data.get('senha')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(senha):
        login_user(user, remember=data.get('remember', False))
        
        # Gera token JWT
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'token': token,
            'user': user.to_dict()
        }), 200
    
    return jsonify({'message': 'Email ou senha inválidos'}), 401


@bp.route('/logout', methods=['POST'])
@login_required  
def logout():
    logout_user()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200


@bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({'user': current_user.to_dict()}), 200


@bp.route('/status', methods=['GET'])
def status():
    if current_user.is_authenticated:
        return jsonify({
            'logged_in': True, 
            'user': current_user.to_dict()
        }), 200
    else:
        return jsonify({'logged_in': False}), 200