#!/bin/bash

echo "🚀 Iniciando Frontend..."

cd frontend

# Verifica se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Inicia o servidor
echo "✅ Frontend rodando em http://localhost:3000"
npm start
