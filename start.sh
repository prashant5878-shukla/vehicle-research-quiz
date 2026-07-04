#!/bin/bash
set -e

echo "🚗 CarDekho — starting via Docker..."
echo ""

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker Desktop and try again."
  exit 1
fi

docker compose up --build

