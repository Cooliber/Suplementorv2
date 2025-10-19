# Environment Management Guide

## Overview

This document provides comprehensive guidance for managing environments in the Suplementor medical application, ensuring secure, compliant, and efficient deployment across development, staging, and production environments.

## Environment Types

### Development Environment
- **Purpose**: Local development and testing
- **Database**: SQLite (file-based) or local PostgreSQL/MongoDB
- **Features**: Debug logging, mock data, development tools enabled
- **Security**: Relaxed for development convenience

### Staging Environment
- **Purpose**: Pre-production testing and validation
- **Database**: Production-like database configuration
- **Features**: Production feature flags, monitoring enabled
- **Security**: Production-level security policies

### Production Environment
- **Purpose**: Live application serving real users
- **Database**: Production databases with proper scaling
- **Features**: All features enabled, optimization active
- **Security**: Maximum security and compliance enforcement

## Environment Configuration

### Environment Files

| File | Purpose | Contains Secrets |
|------|---------|------------------|
| `.env.template` | Template with all variables | No |
| `.env.development` | Development defaults | No |
| `.env.staging` | Staging configuration | No |
| `.env.production` | Production configuration | No |
| `.env.local` | Local overrides | **Yes** |

### Required Environment Variables

#### Core Application
```bash
NODE_ENV=production
VERCEL_ENV=production
NEXTAUTH_SECRET=<secure-random-string>
NEXTAUTH_URL=<your-domain>
```

#### Database Configuration
```bash
DATABASE_URL=<postgresql-connection-string>
MONGODB_URI=<mongodb-connection-string>
```

#### Medical Compliance
```bash
MEDICAL_DATA_PROTECTION=enabled
GDPR_COMPLIANCE_MODE=strict
POLISH_LOCALIZATION=enabled
```

#### Security & Encryption
```bash
DATABASE_ENCRYPTION_KEY=<32-character-hex-string>
MEDICAL_DATA_ENCRYPTION_KEY=<32-character-hex-string>
AUDIT_LOG_ENCRYPTION_KEY=<32-character-hex-string>
```

## Security Management

### Encryption Key Management

#### Generating Keys
```bash
# Generate keys for specific environment
npm run keys:generate production
npm run keys:generate staging
npm run keys:generate development
```

#### Key Rotation
```bash
# Rotate specific key
npm run keys:rotate database
npm run keys:rotate medical
npm run keys:rotate audit
```

#### Key Requirements
- **Length**: Minimum 32 characters
- **Algorithm**: AES-256-GCM
- **Rotation**: Every 90 days for production
- **Storage**: Encrypted in environment variables

### Secrets Management

#### Medical Data Secrets
- Database credentials
- API keys for medical services
- Encryption keys for health data
- OAuth provider secrets

#### Access Control
- Environment variables encrypted at rest
- Access logged and audited
- Rotation policies enforced
- Least privilege principle

## Medical Compliance

### GDPR Compliance

#### Data Protection
- All medical data encrypted using AES-256-GCM
- Geographic restrictions (EU/EEA only)
- Data retention policies enforced
- Right to erasure implemented

#### Consent Management
- Granular consent types (necessary, analytics, medical tracking)
- Consent withdrawal tracking
- Purpose limitation enforcement
- Consent version control

#### Audit Logging
- All data access logged
- GDPR-relevant events tracked
- Access logs encrypted and retained
- Regular compliance reporting

### HIPAA Considerations

#### Data Security
- Administrative safeguards
- Physical safeguards
- Technical safeguards
- Organizational requirements

#### Breach Notification
- Incident response procedures
- Breach notification policies
- Risk assessment protocols

## Database Management

### Database Setup

#### Development
```bash
# Start local databases with Docker
docker-compose up -d postgres mongo

# Run migrations
npm run migrate

# Seed with sample data
npm run db:seed
```

#### Production
```bash
# Use managed databases (recommended)
# PostgreSQL: Railway, Neon, Supabase
# MongoDB: MongoDB Atlas, Railway
# Redis: Upstash, Railway
```

### Migration Management

#### Running Migrations
```bash
# Run all migrations
npm run migrate

# Run specific migration set
npm run migrate:supplements
npm run migrate:brain-regions

# Check migration status
npm run migrate:status
```

#### Creating Migrations
```bash
# Generate new migration
npx prisma migrate dev --name <migration-name>

# Apply to production
npx prisma migrate deploy
```

## Deployment Procedures

### Pre-deployment Checklist

#### Medical Compliance
- [ ] GDPR compliance mode set to 'strict'
- [ ] Medical data protection enabled
- [ ] Encryption keys configured
- [ ] Consent management active
- [ ] Audit logging enabled

#### Security
- [ ] HTTPS enforcement verified
- [ ] Security headers configured
- [ ] Secrets encryption active
- [ ] Access controls implemented

#### Performance
- [ ] CDN optimization enabled
- [ ] Database connection pooling configured
- [ ] Caching strategies implemented
- [ ] Monitoring and alerting active

### Deployment Commands

#### Development Setup
```bash
# Complete environment setup
npm run dev:setup

# Setup with AI features
npm run dev:setup -- --with-ai

# Skip Docker setup
npm run dev:setup -- --skip-docker
```

#### Production Deployment
```bash
# Deploy with medical compliance validation
node scripts/deploy-medical.js

# Quick deployment (without full validation)
npm run vercel-deploy
```

### Post-deployment Verification

#### Health Checks
```bash
# Check application health
npm run health:check

# Verify medical compliance
curl -s https://your-domain.com/api/health | jq '.medical'
```

#### Monitoring Setup
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring
- Security monitoring

## Docker Configuration

### Development with Docker
```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up postgres mongo redis

# Start with AI features
docker-compose --profile ai up

# View logs
docker-compose logs suplementor
```

### Production Docker Setup
```bash
# Build production image
docker build --target production -t suplementor .

# Run with production configuration
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=<your-db-url> \
  suplementor
```

## Monitoring and Alerting

### Health Monitoring
- Application health endpoint: `/api/health`
- Database connectivity checks
- Memory and CPU monitoring
- Response time tracking

### Medical Compliance Monitoring
- GDPR compliance status
- Data access audit logs
- Consent withdrawal tracking
- Data retention policy compliance

### Security Monitoring
- Failed authentication attempts
- Suspicious access patterns
- Data breach detection
- Compliance violation alerts

## Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup
docker-compose exec postgres pg_dump -U suplementor suplementor_dev > backup.sql

# MongoDB backup
docker-compose exec mongo mongodump --db suplementor_dev --out /backup
```

### Recovery Procedures
1. Restore database from backup
2. Verify data integrity
3. Run compliance checks
4. Test application functionality
5. Monitor for issues

## Troubleshooting

### Common Issues

#### Environment Variables
```bash
# Validate environment configuration
npm run keys:validate

# Check for missing variables
node -e "console.log(Object.keys(process.env).filter(k => k.includes('SECRET') || k.includes('KEY')).length)"
```

#### Database Issues
```bash
# Check database health
npm run db:health

# Reset database (development only)
npm run db:reset
```

#### Medical Compliance Issues
```bash
# Check GDPR status
curl -s http://localhost:3000/api/health | jq '.checks.medical'

# Validate consent management
node -e "console.log('Check consent records in database')"
```

### Getting Help

1. Check the health endpoint: `/api/health`
2. Review audit logs for recent errors
3. Check environment variable configuration
4. Verify database connectivity
5. Review compliance status

## Security Best Practices

### Key Management
- Use strong, unique keys for each environment
- Rotate keys every 90 days in production
- Never commit secrets to version control
- Use different keys for different purposes

### Access Control
- Implement least privilege principle
- Regular access reviews
- Multi-factor authentication for production
- Audit all administrative actions

### Data Protection
- Encrypt all medical data at rest and in transit
- Implement proper data classification
- Regular security assessments
- Incident response procedures

## Performance Optimization

### Database Optimization
- Connection pooling configuration
- Query optimization and indexing
- Caching strategies implementation
- Regular performance monitoring

### Application Optimization
- CDN configuration for static assets
- Image optimization
- Bundle size monitoring
- Core Web Vitals tracking

## Compliance Reporting

### Regular Audits
- Monthly GDPR compliance review
- Quarterly security assessment
- Annual penetration testing
- Regular backup verification

### Documentation Requirements
- Data processing impact assessments
- Security incident reports
- Compliance violation logs
- Data retention schedules

## Support and Maintenance

### Regular Tasks
- Weekly: Review audit logs
- Monthly: Compliance status check
- Quarterly: Security assessment
- Annually: Full compliance audit

### Emergency Procedures
1. Identify the issue
2. Assess impact on medical compliance
3. Notify affected users if required
4. Implement fix
5. Document incident
6. Review and improve procedures

---

For questions or issues, please contact the development team or refer to the application health endpoint for current status information.