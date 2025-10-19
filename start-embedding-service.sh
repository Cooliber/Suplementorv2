#!/bin/bash

# Start Embedding Service with Podman Desktop
# This script builds and runs the multilingual embedding model service

set -e

echo "🚀 Starting Polish Embedding Service for Suplementor..."
echo "📦 Model: intfloat/multilingual-e5-large (optimized for Polish text)"

# Check if Podman is available
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install Podman Desktop first."
    exit 1
fi

# Check if podman-compose is available
if ! command -v podman-compose &> /dev/null; then
    echo "❌ podman-compose is not installed. Installing..."
    pip install podman-compose
fi

# Create network if it doesn't exist
echo "🔗 Creating network..."
podman network create suplementor-network --if-exists ignore

# Build and start the service
echo "🏗️  Building embedding service container..."
podman-compose build

echo "▶️  Starting embedding service..."
podman-compose up -d

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 10

# Check if service is healthy
MAX_ATTEMPTS=30
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo "🔍 Health check attempt $ATTEMPT/$MAX_ATTEMPTS..."

    if curl -f http://localhost:8001/health &> /dev/null; then
        echo "✅ Embedding service is ready!"
        echo ""
        echo "🌐 Service endpoints:"
        echo "   Health check: http://localhost:8001/health"
        echo "   Embeddings:    http://localhost:8001/embed"
        echo "   Similarity:    http://localhost:8001/similarity"
        echo "   Models:        http://localhost:8001/models"
        echo ""
        echo "📖 Example usage:"
        echo "   curl -X POST http://localhost:8001/embed \\"
        echo "     -H 'Content-Type: application/json' \\"
        echo "     -d '{\"texts\": [\"L-lizyna wspomaga układ odpornościowy\", \"Lizyna dla zdrowia\"]}'"
        echo ""
        break
    fi

    sleep 5
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "❌ Service failed to start properly. Check logs:"
    echo "   podman-compose logs embedding-service"
    exit 1
fi

echo "🎉 Embedding service is running successfully!"