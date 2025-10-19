# Environment Variables & Secrets Validation Guide

## Overview

This guide provides comprehensive validation tools for ensuring your suplementor medical app is properly configured for production deployment. The validation system includes environment variable validation, secrets management verification, medical compliance checking, and production readiness assessment.

## Quick Start

### Pre-deployment Validation

Run all validation checks before deploying to production:

```bash
# Run all validation checks
npm run validate:all

# Run complete deployment validation (includes security audit and integration tests)
npm run deploy:validate

# Generate missing encryption keys
npm run keys:generate
```

### Individual Validation Scripts

```bash
# Environment variables validation
npm run validate:environment

# Secrets management verification
npm run validate:secrets

# Production readiness checklist
npm run validate:production

# Medical compliance verification
npm run validate:medical

# Security audit report
npm run audit:security

# Integration testing
npm run test:integration
```

## Validation Scripts

### 1. Environment Variables Validation (`validate:environment`)

Validates all environment variables for proper format, values, and production requirements.

**Features:**
- ✅ Required vs optional variable checking
- ✅ Format validation (URLs, emails, etc.)
- ✅ Production-specific requirements
- ✅ Security best practices
- ✅ Medical app compliance

**Exit Codes:**
- `0`: All variables valid
- `1`: Validation errors found

### 2. Secrets Management Verification (`validate:secrets`)

Comprehensive security validation for sensitive configuration data.

**Features:**
- 🔐 Encryption key strength validation
- 🔑 Secret format verification
- 🚫 Development secret detection
- ⚡ Key rotation recommendations
- 🛡️ Security scoring

**Exit Codes:**
- `0`: All secrets properly configured
- `1`: Critical security issues found

### 3. Production Readiness Checklist (`validate:production`)

Complete production deployment readiness assessment.

**Features:**
- 🚀 Environment configuration validation
- 💾 Database setup verification
- 🔒 Security compliance checking
- ⚡ Performance optimization validation
- 📊 Deployment scoring

**Exit Codes:**
- `0`: Ready for production
- `1`: Critical issues must be resolved

### 4. Medical Compliance Verification (`validate:medical`)

GDPR and medical data compliance validation.

**Features:**
- 🏥 GDPR compliance verification
- 📋 Medical data protection validation
- 🌍 Geographic compliance checking
- 📜 Legal requirement assessment
- 🏛️ Regulatory compliance scoring

**Exit Codes:**
- `0`: Compliant with medical regulations
- `1`: Critical compliance issues found

### 5. Security Audit Report (`audit:security`)

Comprehensive security assessment and reporting.

**Features:**
- 🔒 Multi-category security scoring
- 🚨 Risk level assessment
- 📊 Detailed security metrics
- 🔧 Remediation recommendations
- 📋 Audit trail generation

**Output:**
- Console report with scores and recommendations
- JSON report file: `security-audit-report.json`

### 6. Integration Testing (`test:integration`)

Real-world integration testing of environment configuration.

**Features:**
- 🌐 Service connectivity testing
- 💳 Payment system validation
- 📧 Third-party service verification
- 🔗 API endpoint testing
- ⚡ Performance baseline validation

## Environment Configuration

### Required Environment Variables

#### Core Application
```bash
NODE_ENV=production
NEXTAUTH_SECRET=<strong-32-char-secret>
NEXTAUTH_URL=https://yourdomain.com
```

#### Database
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
DATABASE_ENCRYPTION_KEY=<32-char-hex-key>
```

#### Medical Compliance
```bash
MEDICAL_DATA_PROTECTION=enabled
GDPR_COMPLIANCE_MODE=strict
POLISH_LOCALIZATION=enabled
```

#### Security & Encryption
```bash
MEDICAL_DATA_ENCRYPTION_KEY=<32-char-hex-key>
AUDIT_LOG_ENCRYPTION_KEY=<32-char-hex-key>
```

#### Payment Processing
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Monitoring
```bash
ERROR_TRACKING=enabled
SENTRY_DSN=https://...
```

### Optional but Recommended

```bash
# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI Features
OPENAI_API_KEY=sk-your-openai-key

# Performance
CDN_OPTIMIZATION=enabled
REGIONAL_CDN_EUROPE=enabled
```

## Security Best Practices

### Encryption Keys

1. **Generate Strong Keys**
   ```bash
   # Generate secure keys
   npm run keys:generate
   ```

2. **Key Requirements**
   - Minimum 32 characters
   - Hex format for encryption keys
   - Unique per environment
   - Regular rotation (90 days)

3. **Key Storage**
   - Never commit to version control
   - Use environment variables
   - Different keys per environment
   - Secure backup procedures

### Secret Management

1. **NextAuth Secret**
   - Must be 32+ characters
   - Not contain "development" or "staging"
   - Unique per environment

2. **Stripe Keys**
   - Secret key: `sk_live_...` format
   - Publishable key: `pk_live_...` format
   - Webhook secret: `whsec_...` format

3. **Database Credentials**
   - Strong passwords
   - Limited access permissions
   - Encrypted connections only

## Medical Compliance Requirements

### GDPR Compliance

- **Strict Mode Required**: `GDPR_COMPLIANCE_MODE=strict`
- **Medical Data Protection**: Must be enabled
- **Consent Management**: User consent tracking
- **Data Subject Rights**: Export, erasure, portability
- **Audit Logging**: All data access logged

### Polish Medical Law

- **Localization**: Polish language support
- **EU Data Residency**: European data centers
- **Medical Professional Oversight**: Where required
- **Patient Rights**: Full GDPR implementation

### Data Classification

```typescript
enum DataClassification {
  PUBLIC = "public",
  INTERNAL = "internal",
  CONFIDENTIAL = "confidential",
  RESTRICTED = "restricted",
  MEDICAL = "medical"
}
```

## Production Deployment Checklist

### Pre-deployment Steps

1. **Environment Validation**
   ```bash
   npm run validate:environment
   npm run validate:secrets
   ```

2. **Security Audit**
   ```bash
   npm run audit:security
   ```

3. **Medical Compliance**
   ```bash
   npm run validate:medical
   ```

4. **Integration Testing**
   ```bash
   npm run test:integration
   ```

5. **Production Readiness**
   ```bash
   npm run validate:production
   ```

### Deployment Verification

1. **Build Verification**
   ```bash
   npm run build
   npm run typecheck
   ```

2. **Health Checks**
   ```bash
   curl -s https://yourdomain.com/api/health
   ```

3. **Database Migration**
   ```bash
   npm run migrate
   ```

4. **Monitoring Setup**
   - Error tracking active
   - Performance monitoring
   - Security alerts configured

## Troubleshooting

### Common Issues

#### Missing Environment Variables
```bash
# Check which variables are missing
npm run validate:environment

# Generate missing keys
npm run keys:generate
```

#### Weak Secrets
```bash
# Validate secret strength
npm run validate:secrets

# Generate new keys if needed
node scripts/validate-secrets.js --generate-keys
```

#### Medical Compliance Issues
```bash
# Check GDPR compliance
npm run validate:medical

# Verify medical data protection
npm run validate:production
```

#### Integration Test Failures
```bash
# Test service connections
npm run test:integration

# Check individual services
# Database, Redis, Stripe, etc.
```

### Debug Mode

For detailed debugging, set:
```bash
ENABLE_DEBUG_LOGS=true
```

## Security Monitoring

### Regular Audits

1. **Daily Health Checks**
   ```bash
   npm run validate:environment
   ```

2. **Weekly Security Audit**
   ```bash
   npm run audit:security
   ```

3. **Monthly Compliance Review**
   ```bash
   npm run validate:all
   ```

4. **Quarterly Key Rotation**
   ```bash
   npm run keys:rotate
   ```

### Alert Setup

Configure alerts for:
- Failed security validations
- Missing encryption keys
- Compliance violations
- Service connection failures

## Emergency Procedures

### Security Incident Response

1. **Immediate Actions**
   ```bash
   # Run full security audit
   npm run audit:security

   # Check for unauthorized access
   npm run validate:medical
   ```

2. **Key Rotation**
   ```bash
   # Generate new keys
   npm run keys:generate

   # Update all services
   # Manual process required
   ```

3. **Compliance Reporting**
   - Document incident details
   - Notify data protection officer
   - Report to authorities if required

### Disaster Recovery

1. **Environment Restoration**
   ```bash
   # Validate backup environment
   npm run validate:all

   # Test service connections
   npm run test:integration
   ```

2. **Data Recovery**
   - Restore from encrypted backups
   - Verify data integrity
   - Re-establish service connections

## Support

For issues with validation scripts:

1. Check the console output for detailed error messages
2. Review the generated JSON reports for specific issues
3. Verify all required environment variables are set
4. Ensure proper key formats and strengths

## Advanced Configuration

### Custom Validation Rules

The validation scripts can be extended by modifying:
- `scripts/validate-environment.js`
- `scripts/validate-secrets.js`
- `scripts/medical-compliance-verification.js`

### Integration with CI/CD

Add to your deployment pipeline:
```yaml
# .github/workflows/deploy.yml
- name: Environment Validation
  run: npm run validate:all

- name: Security Audit
  run: npm run audit:security

- name: Integration Testing
  run: npm run test:integration
```

### Automated Monitoring

Set up scheduled validation:
```bash
# Daily validation
0 9 * * * cd /path/to/suplementor && npm run validate:environment

# Weekly security audit
0 9 * * 1 cd /path/to/suplementor && npm run audit:security
```

---

**Last Updated:** October 19, 2025
**Version:** 1.0.0
**Environment:** Production

For questions or issues, contact the development team or create an issue in the project repository.