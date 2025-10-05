# Przewodnik Wdrożenia - Graf Wiedzy o Suplementach

## Przegląd Architektury

System grafu wiedzy składa się z następujących komponentów:

- **Frontend**: Next.js 15 z React 19 (Vercel)
- **Backend API**: tRPC + Next.js API Routes
- **Baza danych**: MongoDB Atlas
- **Cache**: Redis (Upstash)
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Sentry
- **Search**: MongoDB Atlas Search

## Wymagania Systemowe

### Minimalne
- Node.js 18.17+
- MongoDB 6.0+
- Redis 6.0+
- 2GB RAM
- 10GB storage

### Zalecane (Produkcja)
- Node.js 20+
- MongoDB 7.0+
- Redis 7.0+
- 8GB RAM
- 100GB SSD storage
- CDN (Vercel/CloudFlare)

## Konfiguracja Środowiska

### 1. Zmienne Środowiskowe

Utwórz plik `.env.local`:

```bash
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/suplementor"
MONGODB_DB_NAME="suplementor_prod"

# Authentication
NEXTAUTH_URL="https://suplementor.pl"
NEXTAUTH_SECRET="your-secret-key-here"

# Redis Cache
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# External APIs
OPENAI_API_KEY="sk-your-openai-key"
PUBMED_API_KEY="your-pubmed-key"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
VERCEL_ANALYTICS_ID="your-analytics-id"

# Features
NEXT_PUBLIC_ENABLE_WEBGL="true"
NEXT_PUBLIC_MAX_GRAPH_NODES="1000"
NEXT_PUBLIC_DEFAULT_LOCALE="pl"

# Performance
NEXT_PUBLIC_CACHE_TTL="300000"
NEXT_PUBLIC_ENABLE_SW="true"
```

### 2. MongoDB Atlas Setup

#### Kolekcje i Indeksy

```javascript
// Utwórz indeksy dla optymalnej wydajności
db.supplements.createIndex({ "id": 1 }, { unique: true });
db.supplements.createIndex({ "polishName": "text", "polishDescription": "text" });
db.supplements.createIndex({ "category": 1, "isActive": 1 });
db.supplements.createIndex({ "evidenceLevel": 1 });
db.supplements.createIndex({ "createdAt": -1 });

db.relationships.createIndex({ "sourceId": 1, "targetId": 1 });
db.relationships.createIndex({ "type": 1, "evidenceLevel": 1 });
db.relationships.createIndex({ "isActive": 1 });

db.neurotransmitters.createIndex({ "id": 1 }, { unique: true });
db.neurotransmitters.createIndex({ "polishName": "text" });

db.brain_regions.createIndex({ "id": 1 }, { unique: true });
db.brain_regions.createIndex({ "polishName": "text" });

db.cognitive_functions.createIndex({ "id": 1 }, { unique: true });
db.cognitive_functions.createIndex({ "polishName": "text" });
```

#### Atlas Search Configuration

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "polishName": {
        "type": "string",
        "analyzer": "lucene.polish"
      },
      "polishDescription": {
        "type": "string",
        "analyzer": "lucene.polish"
      },
      "category": {
        "type": "string"
      },
      "evidenceLevel": {
        "type": "string"
      }
    }
  }
}
```

### 3. Redis Configuration

```redis
# redis.conf dla produkcji
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
```

## Wdrożenie na Vercel

### 1. Konfiguracja Projektu

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/graph/(.*)",
      "dest": "/api/graph/$1",
      "headers": {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
      }
    },
    {
      "src": "/api/supplements/(.*)",
      "dest": "/api/supplements/$1",
      "headers": {
        "Cache-Control": "s-maxage=600, stale-while-revalidate=1200"
      }
    }
  ],
  "functions": {
    "app/api/graph/generate.ts": {
      "maxDuration": 30
    },
    "app/api/supplements/search.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["fra1", "iad1"],
  "framework": "nextjs"
}
```

### 2. Build Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    reactCompiler: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Optymalizacje produkcyjne
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Obrazy
  images: {
    domains: ['cdn.suplementor.pl'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  
  // Headers bezpieczeństwa
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
          },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/graph',
        destination: '/wiedza/graf',
        permanent: true,
      },
    ];
  },
  
  // Rewrites dla API
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Rozpoczynanie wdrożenia..."

# Sprawdź zmienne środowiskowe
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Brak DATABASE_URL"
  exit 1
fi

# Build aplikacji
echo "📦 Budowanie aplikacji..."
npm run build

# Uruchom testy
echo "🧪 Uruchamianie testów..."
npm run test:ci

# Sprawdź linting
echo "🔍 Sprawdzanie kodu..."
npm run lint
npm run type-check

# Migracje bazy danych
echo "🗄️ Uruchamianie migracji..."
npm run db:migrate

# Seed danych (tylko dev/staging)
if [ "$VERCEL_ENV" != "production" ]; then
  echo "🌱 Seedowanie danych..."
  npm run db:seed
fi

# Deploy na Vercel
echo "🌐 Wdrażanie na Vercel..."
vercel --prod

echo "✅ Wdrożenie zakończone!"
```

## Wdrożenie Self-Hosted

### 1. Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/suplementor
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
      - MONGO_INITDB_DATABASE=suplementor
    volumes:
      - mongo_data:/data/db
      - ./scripts/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped

  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

### 3. Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=graph:10m rate=2r/s;

    server {
        listen 80;
        server_name suplementor.pl www.suplementor.pl;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name suplementor.pl www.suplementor.pl;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API rate limiting
        location /api/graph/ {
            limit_req zone=graph burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files caching
        location /_next/static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        # Main application
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Monitoring i Logging

### 1. Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Error filtering
  beforeSend(event) {
    // Filtruj błędy deweloperskie
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
        return null;
      }
    }
    return event;
  },
  
  // Dodatkowe tagi
  initialScope: {
    tags: {
      component: 'knowledge-graph',
      locale: 'pl'
    }
  }
});
```

### 2. Custom Metrics

```typescript
// lib/monitoring.ts
export class GraphMetrics {
  static trackGraphGeneration(nodeCount: number, duration: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'graph_generated', {
        custom_parameter_1: nodeCount,
        custom_parameter_2: duration,
        event_category: 'performance'
      });
    }
  }
  
  static trackSearchQuery(query: string, resultCount: number) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search_performed', {
        search_term: query,
        custom_parameter_1: resultCount,
        event_category: 'engagement'
      });
    }
  }
}
```

### 3. Health Checks

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { redis } from '@/lib/redis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const checks = {
    database: false,
    redis: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Test MongoDB connection
    const { db } = await connectToDatabase();
    await db.admin().ping();
    checks.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Test Redis connection
    await redis.ping();
    checks.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  const isHealthy = checks.database && checks.redis;
  
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    checks
  });
}
```

## Backup i Recovery

### 1. MongoDB Backup

```bash
#!/bin/bash
# backup-mongo.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongo"
DB_NAME="suplementor"

# Utwórz backup
mongodump --uri="$DATABASE_URL" --db="$DB_NAME" --out="$BACKUP_DIR/$DATE"

# Kompresja
tar -czf "$BACKUP_DIR/suplementor_$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Usuń nieskompresowany backup
rm -rf "$BACKUP_DIR/$DATE"

# Zachowaj tylko ostatnie 7 dni
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: suplementor_$DATE.tar.gz"
```

### 2. Automated Backups

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *' # Codziennie o 2:00

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup MongoDB tools
        run: |
          wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
          echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
          sudo apt-get update
          sudo apt-get install -y mongodb-database-tools
      
      - name: Create backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          mongodump --uri="$DATABASE_URL" --out=backup
          tar -czf backup-$(date +%Y%m%d).tar.gz backup/
      
      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp backup-$(date +%Y%m%d).tar.gz s3://suplementor-backups/
```

## Performance Optimization

### 1. Database Optimization

```javascript
// Optymalizacja zapytań MongoDB
db.supplements.aggregate([
  { $match: { isActive: true, category: "Kwasy tłuszczowe" } },
  { $lookup: {
      from: "relationships",
      localField: "id",
      foreignField: "sourceId",
      as: "outgoingRelationships"
  }},
  { $addFields: {
      relationshipCount: { $size: "$outgoingRelationships" }
  }},
  { $sort: { relationshipCount: -1, importance: -1 } },
  { $limit: 100 }
]);
```

### 2. Caching Strategy

```typescript
// lib/cache-strategy.ts
export const cacheConfig = {
  // Krótki cache dla często zmieniających się danych
  supplements: {
    ttl: 5 * 60, // 5 minut
    staleWhileRevalidate: 10 * 60 // 10 minut
  },
  
  // Długi cache dla stabilnych danych
  neurotransmitters: {
    ttl: 60 * 60, // 1 godzina
    staleWhileRevalidate: 2 * 60 * 60 // 2 godziny
  },
  
  // Bardzo długi cache dla statycznych danych
  brainRegions: {
    ttl: 24 * 60 * 60, // 24 godziny
    staleWhileRevalidate: 48 * 60 * 60 // 48 godzin
  }
};
```

## Security Checklist

- [ ] HTTPS włączone wszędzie
- [ ] CSP headers skonfigurowane
- [ ] Rate limiting włączony
- [ ] Input validation na wszystkich endpointach
- [ ] SQL injection protection (MongoDB)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers (HSTS, X-Frame-Options, etc.)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API keys secured
- [ ] Monitoring błędów bezpieczeństwa
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
