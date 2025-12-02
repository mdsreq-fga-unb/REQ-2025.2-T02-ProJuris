#!/bin/bash

echo "🚀 Iniciando Backend..."

cd "src/backend"

# Verifica se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativa o ambiente virtual
source venv/bin/activate

# Instala dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt > /dev/null 2>&1

# Verifica se o banco de dados existe
if [ ! -f "app.db" ]; then
    echo "🗄️  Inicializando banco de dados..."
    python3 -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all(); print('✅ Banco de dados criado!')"
fi

# Inicia o servidor
echo "✅ Backend rodando em http://localhost:5000"
python3 run.py
