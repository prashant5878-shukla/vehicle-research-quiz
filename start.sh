#!/bin/bash
echo 'Starting CarDekho...'
cd backend && npm install && node server.js &
BACKEND_PID=$!
cd ../frontend && npm install && npm run dev
kill $BACKEND_PID
