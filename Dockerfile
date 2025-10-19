# Multi-stage Dockerfile for Suplementor Medical App
# Optimized for development and production environments

# Base stage with common dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Install pnpm for faster package management
RUN npm install -g pnpm

# Copy package files
COPY package.json bun.lock ./

# Install dependencies only when needed
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy all files for development
COPY . .

# Install all dependencies (including dev dependencies)
RUN npm ci

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 suplementor

# Change ownership of app directory
RUN chown -R suplementor:nodejs /app
USER suplementor

# Expose development port
EXPOSE 3000

# Health check for development
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start development server
CMD ["npm", "run", "dev"]

# Builder stage for production
FROM base AS builder
WORKDIR /app

# Copy dependency files
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 suplementor

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Prisma files for migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Change ownership
RUN chown -R suplementor:nodejs /app
USER suplementor

# Expose production port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Health check for production
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start production server
CMD ["npm", "start"]