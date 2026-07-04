#!/bin/bash
set -e

echo "🚗 CarDekho — starting..."
echo ""

# Terminal 1: backend
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Terminal 2: frontend
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Backend:  http://localhost:4000"
echo "✅ Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both."

# Wait and clean up both on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
