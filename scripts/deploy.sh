#!/bin/bash
# Production Deployment Script for Vercel
# Run this script to deploy suplementor to Vercel production

set -e

echo "🚀 Starting Suplementor Production Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Error: Please run this script from the suplementor project root"
    exit 1
fi

# Check required environment variables
REQUIRED_VARS=(
    "MONGODB_URI"
    "NEXTAUTH_SECRET"
    "SENTRY_DSN"
    "UPSTASH_REDIS_REST_URL"
    "UPSTASH_REDIS_REST_TOKEN"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set"
        echo "Please set all required environment variables before deploying"
        exit 1
    fi
done

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Run type checking
echo "🔍 Running TypeScript checks..."
bun run typecheck

# Run linting
echo "🧹 Running linting..."
bun run check

# Build the application
echo "🏗️ Building application..."
bun run build

# Run tests
echo "🧪 Running tests..."
bun run test:run

# Create deployment timestamp
echo "📅 Creating deployment info..."
echo "Deployment Date: $(date)" > DEPLOYMENT_INFO.txt
echo "Build ID: $(date +%s)" >> DEPLOYMENT_INFO.txt
echo "Node Version: $(node --version)" >> DEPLOYMENT_INFO.txt
echo "Bun Version: $(bun --version)" >> DEPLOYMENT_INFO.txt

# Deploy to Vercel
echo "🌐 Deploying to Vercel Production..."
vercel --prod --yes

# Get deployment URL
DEPLOYMENT_URL=$(vercel ls --scope=suplementor --yes | grep production | awk '{print $2}' | head -n 1)

if [ -n "$DEPLOYMENT_URL" ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Production URL: https://$DEPLOYMENT_URL"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up custom domain (if needed)"
    echo "2. Configure environment variables in Vercel dashboard"
    echo "3. Set up monitoring and analytics"
    echo "4. Test all features"
    echo ""
    echo "🔗 Access your application at: https://$DEPLOYMENT_URL"
else
    echo "❌ Deployment may have failed. Check Vercel dashboard for details."
    exit 1
fi

echo "🎉 Deployment completed successfully!"