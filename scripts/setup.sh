#!/bin/bash

# Suplementor Setup Script
# Automated setup for MongoDB-based T3 Stack application

set -e

echo "🚀 Setting up Suplementor - Polish Supplement Education Platform"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional)
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        echo "✅ MongoDB is running locally"
    else
        echo "⚠️  MongoDB is not running locally. Make sure to configure MONGODB_URI in .env"
    fi
else
    echo "⚠️  MongoDB CLI not found. Make sure to configure MONGODB_URI in .env"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your MongoDB connection string and other settings"
else
    echo "✅ .env file already exists"
fi

# Check if MONGODB_URI is set
if grep -q "MONGODB_URI=" .env; then
    MONGODB_URI=$(grep "MONGODB_URI=" .env | cut -d'=' -f2 | tr -d '"')
    if [ "$MONGODB_URI" = "mongodb://localhost:27017/suplementor" ] || [ "$MONGODB_URI" = "" ]; then
        echo "⚠️  Please update MONGODB_URI in .env file with your actual MongoDB connection string"
    else
        echo "✅ MONGODB_URI is configured"
    fi
else
    echo "❌ MONGODB_URI not found in .env file"
    exit 1
fi

# Test MongoDB connection
echo "🔌 Testing MongoDB connection..."
if npm run db:seed &> /dev/null; then
    echo "✅ MongoDB connection successful and database seeded"
else
    echo "❌ Failed to connect to MongoDB or seed database"
    echo "   Please check your MONGODB_URI in .env file"
    exit 1
fi

# Run type checking
echo "🔍 Running TypeScript type checking..."
if npm run type-check; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Run linting
echo "🧹 Running code linting..."
if npm run lint; then
    echo "✅ Code linting passed"
else
    echo "❌ Code linting failed"
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
if npm run build; then
    echo "✅ Application build successful"
else
    echo "❌ Application build failed"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Review and update .env file with your settings"
echo "2. Start the development server: npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run db:seed      - Seed database with sample data"
echo "  npm run test         - Run tests"
echo "  npm run lint         - Run linting"
echo ""
echo "📚 Documentation: Check README.md for detailed information"
echo "🐛 Issues: Create an issue in the repository for support"
echo ""
echo "Happy coding! 🚀"
