from flask import Blueprint, render_template, request, redirect, url_for, jsonify

views = Blueprint("views", __name__)

# Função para obter dados do dashboard
def get_dashboard_data():
    return {
        'stats': {
            'processos_ativos': {
                'value': 48,
                'change': '+12% em relação ao mês anterior'
            },
            'prazos_prazo': {
                'value': '85%',
                'change': '+5% em relação ao mês anterior'
            },
            'prazos_criticos': {
                'value': 7,
                'change': ''
            },
            'tempo_medio': {
                'value': '45 dias',
                'change': '8% em relação ao mês anterior'
            }
        },
        'kanban': {
            'novos': [
                {'id': '#1234', 'prazo': '10/03/2025'},
                {'id': '#1235', 'prazo': '15/03/2025'}
            ],
            'em_andamento': [
                {'id': '#1230', 'prazo': '10/03/2025'},
                {'id': '#1231', 'prazo': '15/03/2025'},
                {'id': '#1232', 'prazo': '15/03/2025'}
            ],
            'aguardando': [
                {'id': '#1228', 'prazo': '10/03/2025'}
            ],
            'concluidos': [
                {'id': '#1220', 'prazo': '15/03/2025'},
                {'id': '#1221', 'prazo': '16/03/2025'}
            ]
        },
        'notificacoes': [
            {
                'tipo': 'Prazo Crítico',
                'mensagem': 'Processo #1234 vence em 2 dias',
                'tempo': 'Há 10 minutos',
                'urgente': True
            },
            {
                'tipo': 'Nova Atribuição',
                'mensagem': 'Processo #1245 foi atribuído a você',
                'tempo': 'Há 1 hora',
                'urgente': False
            },
            {
                'tipo': 'Processo Concluído',
                'mensagem': 'Processo #1220 foi finalizado',
                'tempo': 'Há 2 horas',
                'urgente': False
            },
            {
                'tipo': 'Lembrete',
                'mensagem': 'Audiência agendada para amanhã - Processo #1230',
                'tempo': 'Há 3 horas',
                'urgente': False
            },
            {
                'tipo': 'Prazo Atrasado',
                'mensagem': 'Processo #1200 está com prazo vencido',
                'tempo': 'Há 5 horas',
                'urgente': True
            }
        ]
    }

@views.route("/")
def index():
    # Pegar dados do dashboard
    dados = get_dashboard_data()
    return render_template("index.html", dados=dados)

@views.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Aqui você processará o login depois
        email = request.form.get('email')
        senha = request.form.get('senha')
        # TODO: Validar credenciais
        return redirect(url_for('views.index'))
    return render_template("login.html")

@views.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == "POST":
        # Aqui você processará o cadastro depois
        nome = request.form.get('nome')
        email = request.form.get('email')
        senha = request.form.get('senha')
        # TODO: Criar novo usuário
        return redirect(url_for('views.login'))
    return render_template('cadastro.html')

# API endpoint para atualização dinâmica do dashboard
@views.route('/api/dashboard')
def api_dashboard():
    data = get_dashboard_data()
    return jsonify(data)