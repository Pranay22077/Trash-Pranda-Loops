#!/bin/bash

# 🦝 Trash Panda Loops - Quick Start Script
# This script starts both backend and frontend servers

echo "🦝 Starting Trash Panda Loops..."
echo ""

# Check if backend is already running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend already running on http://localhost:5000"
else
    echo "🔌 Starting backend API..."
    python3 api/server.py &
    BACKEND_PID=$!
    sleep 2
    echo "✅ Backend started (PID: $BACKEND_PID)"
fi

# Check if frontend is already running
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Frontend already running on http://localhost:5173"
else
    echo "🌐 Starting frontend..."
    cd /home/pranay22077/trash-panda-web
    npm run dev &
    FRONTEND_PID=$!
    sleep 3
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
fi

echo ""
echo "🎮 Trash Panda Loops is ready!"
echo ""
echo "🌐 Open your browser and go to: http://localhost:5173"
echo "🔌 Backend API available at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
wait
