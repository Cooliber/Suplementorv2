# Deployment Guide

## Overview

This guide covers deployment strategies for the Suplementor application, including development, staging, and production environments. The application is optimized for deployment on Vercel with MongoDB Atlas.

## Deployment Environments

### Development Environment
- **URL**: `http://localhost:3000`
- **Database**: Local MongoDB or MongoDB Atlas development cluster
- **Features**: Hot reload, debug logging, development tools

### Staging Environment
- **URL**: `https://suplementor-staging.vercel.app`
- **Database**: MongoDB Atlas staging cluster
- **Features**: Production-like configuration, automated testing

### Production Environment
- **URL**: `https://suplementor.vercel.app`
- **Database**: MongoDB Atlas production cluster
- **Features**: Optimized performance, monitoring, analytics

## Quick Deployment (Vercel)

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Set up production database

### Step 1: Connect Repository to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Environment Variables
In your Vercel dashboard, go to Project Settings > Environment Variables:

```env
# Production MongoDB Atlas
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/suplementor"

# NextAuth.js Configuration
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://suplementor.vercel.app"

# Optional: Analytics and Monitoring
ANALYTICS_ID="your-analytics-id"
SENTRY_DSN="your-sentry-dsn"

# Optional: AI Services
EMBEDDING_SERVICE_URL="https://your-embedding-service.com"

# Security and Compliance
GDPR_COMPLIANCE_MODE="strict"
MEDICAL_DATA_ENCRYPTION="true"
```

### Step 3: Deploy
1. Push to the `main` branch to trigger production deployment
2. Push to the `develop` branch for preview deployments
3. Vercel will automatically build and deploy your application

## Manual Deployment

### Using Docker (Advanced)

#### Dockerfile
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  suplementor:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/suplementor
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongodb

  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=suplementor

volumes:
  mongodb_data:
```

### Manual Build and Deploy
```bash
# Build for production
bun run build

# Start production server
bun run start

# Or using npm
npm run build
npm start
```

## Database Deployment

### MongoDB Atlas Setup

#### 1. Create Atlas Account
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account and cluster

#### 2. Configure Database User
1. In Atlas dashboard, go to "Database Access"
2. Create a new database user with read/write permissions

#### 3. Whitelist IP Addresses
1. Go to "Network Access"
2. Add IP whitelist entry: `0.0.0.0/0` (for all IPs) or specific Vercel IPs

#### 4. Get Connection String
1. Go to "Clusters"
2. Click "Connect" > "Connect your application"
3. Copy the connection string and update your `MONGODB_URI`

### Database Migrations

```bash
# Run database migrations
bun run db:migrate

# Seed production database
bun run db:seed:production

# Verify database connection
bun run db:health-check
```

## Environment Configuration

### Environment Files Structure

```
suplementor/
├── .env.example          # Template for environment variables
├── .env.local           # Local development (gitignored)
├── .env.production      # Production environment
└── .env.staging         # Staging environment
```

### Required Environment Variables

#### Core Configuration
```env
# Database
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/suplementor"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Application
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

#### Optional Enhancements
```env
# Analytics
ANALYTICS_ID="your-analytics-id"
SENTRY_DSN="your-sentry-dsn"

# AI/Embedding Services
EMBEDDING_SERVICE_URL="https://your-embedding-service.com"
OPENAI_API_KEY="your-openai-key"

# Email Service (for notifications)
SMTP_HOST="smtp.your-provider.com"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"

# Monitoring
LOG_LEVEL="info"
LOG_FORMAT="json"

# Security
GDPR_COMPLIANCE_MODE="strict"
MEDICAL_DATA_ENCRYPTION="true"
RATE_LIMIT_WINDOW="15min"
RATE_LIMIT_MAX_REQUESTS="100"
```

## Monitoring and Analytics

### Application Performance Monitoring

#### Vercel Analytics (Built-in)
- Automatic performance monitoring
- Core Web Vitals tracking
- Error tracking and reporting

#### Sentry Integration (Recommended)
```bash
# Install Sentry
bun add @sentry/nextjs

# Configure in your application
```

#### Custom Monitoring
```typescript
// lib/monitoring.ts
export const trackEvent = (event: string, data?: Record<string, any>) => {
  // Custom analytics implementation
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  // Error tracking implementation
};
```

### Database Monitoring

#### MongoDB Atlas Monitoring
1. Enable monitoring in Atlas dashboard
2. Set up alerts for:
   - Connection spikes
   - Query performance degradation
   - Storage usage
   - Replication lag

#### Custom Database Metrics
```typescript
// Track slow queries
const trackSlowQuery = (query: string, duration: number) => {
  if (duration > 100) { // 100ms threshold
    console.warn(`Slow query detected: ${query} (${duration}ms)`);
  }
};
```

## Security Considerations

### Production Security Checklist

- [ ] Enable MongoDB Atlas encryption at rest
- [ ] Set up database user with minimal required permissions
- [ ] Configure IP whitelisting for database access
- [ ] Enable NextAuth.js production security features
- [ ] Set up HTTPS and security headers
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up backup strategy
- [ ] Configure monitoring and alerting

### GDPR Compliance

#### Data Protection Measures
- Data encryption at rest and in transit
- User consent management
- Data retention policies
- Right to erasure implementation
- Data processing impact assessments

#### Compliance Features
```typescript
// GDPR consent management
const manageGDPRConsent = (userId: string, consent: ConsentData) => {
  // Implement consent tracking
};

// Data export for GDPR Article 20
const exportUserData = (userId: string) => {
  // Export all user data in machine-readable format
};

// Data deletion for GDPR Article 17
const deleteUserData = (userId: string) => {
  // Implement complete data deletion
};
```

## Performance Optimization

### Production Optimizations

#### Bundle Optimization
```bash
# Analyze bundle size
bun run analyze

# Check for large dependencies
bun run bundle:check
```

#### Database Optimization
```bash
# Check query performance
bun run db:performance-check

# Optimize indexes
bun run db:optimize-indexes
```

#### Caching Strategy
```typescript
// Implement Redis caching for production
const cache = new RedisCache({
  ttl: 3600, // 1 hour
  namespace: 'suplementor'
});
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Check build logs
vercel logs --follow

# Debug locally
bun run build

# Check for TypeScript errors
bun run typecheck
```

#### Database Connection Issues
```bash
# Test database connection
bun run db:health-check

# Check MongoDB logs
# Check Atlas cluster logs
```

#### Performance Issues
```bash
# Run Lighthouse audit
bun run lighthouse

# Check bundle size
bun run analyze
```

### Emergency Procedures

#### Rollback Deployment
```bash
# Vercel rollback
vercel rollback

# Manual rollback
git revert HEAD
git push origin main
```

#### Database Recovery
```bash
# Restore from backup
bun run db:restore --from=backup-timestamp

# Emergency data recovery
bun run db:emergency-recover
```

## Cost Optimization

### Vercel Cost Management
- Monitor function usage in dashboard
- Set up usage alerts
- Optimize build frequency
- Use preview deployments efficiently

### MongoDB Atlas Cost Management
- Choose appropriate cluster tier
- Monitor data transfer costs
- Optimize query performance
- Set up data retention policies

## Support and Maintenance

### Regular Maintenance Tasks

#### Weekly
- Review application logs
- Check performance metrics
- Update dependencies (patch versions)
- Review security scan results

#### Monthly
- Update major dependencies
- Review and optimize database indexes
- Analyze user behavior and performance
- Update SSL certificates

#### Quarterly
- Major version updates
- Performance and security audits
- Backup verification
- Compliance review

### Monitoring Dashboard

Access monitoring information:
- **Vercel Dashboard**: Deployment status and metrics
- **MongoDB Atlas**: Database performance and alerts
- **Sentry**: Error tracking and performance
- **Google Analytics**: User behavior and engagement

## Getting Help

### Documentation
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### Community Support
- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Q&A and community support
- Stack Overflow: Technical questions

### Professional Support
- Medical compliance consultation
- Security audit services
- Performance optimization services
- Database administration support

---

For deployment issues or questions, please check this guide first, then create an issue in the repository with detailed information about your setup and the problem you're experiencing.