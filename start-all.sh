#!/bin/bash

echo "🚀 Iniciando LegisPRO - Sistema Completo"
echo "========================================"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Parando servidores..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Inicia o backend em background
echo "📡 Iniciando Backend..."
./start-backend.sh > backend.log 2>&1 &
BACKEND_PID=$!

# Aguarda o backend iniciar
sleep 3

# Inicia o frontend em background
echo "🎨 Iniciando Frontend..."
./start-frontend.sh > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✅ Servidores iniciados!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "⚠️  Pressione Ctrl+C para parar todos os servidores"
echo ""

# Monitora os logs
tail -f backend.log -f frontend.log &

# Aguarda até o usuário pressionar Ctrl+C
wait
