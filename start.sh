#!/bin/bash

# Ratchaburi Community Jobs - Quick Start Script

echo "🚀 Starting Ratchaburi Community Jobs Platform..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if all services have node_modules
if [ ! -d "backend/node_modules" ] || [ ! -d "web-app/node_modules" ] || [ ! -d "line-bot/node_modules" ]; then
    echo "📦 Installing service dependencies..."
    npm run install:all
fi

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

if [ ! -f "web-app/.env.local" ]; then
    echo "📝 Creating web-app/.env.local file..."
    cp web-app/.env.example web-app/.env.local
fi

if [ ! -f "line-bot/.env" ]; then
    echo "📝 Creating line-bot/.env file..."
    cp line-bot/.env.example line-bot/.env
    echo "⚠️  Please edit line-bot/.env with your LINE credentials"
fi

# Ask if user wants to seed the database
echo ""
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    cd backend && npm run seed && cd ..
fi

# Start all services
echo ""
echo "🎯 Starting all services..."
echo "   - Backend API: http://localhost:5000"
echo "   - Web App: http://localhost:3000"
echo "   - LINE Bot: http://localhost:4000"
echo "   - API Docs: http://localhost:5000/api-docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev