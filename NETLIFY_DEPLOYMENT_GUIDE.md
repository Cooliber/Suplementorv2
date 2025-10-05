# 🚀 Netlify Deployment Guide - Suplementor

**Complete guide for deploying the Suplementor application to Netlify**

---

## ✅ Pre-Deployment Checklist

### 1. Code Quality Verification
- [x] **TypeScript**: Zero errors (`bun run typecheck`)
- [x] **Drag & Drop**: Fully implemented with @dnd-kit
- [x] **Database**: MongoDB integration complete
- [x] **Security**: Search sanitization and input validation
- [x] **Performance**: Indexes optimized

### 2. Features Verified
- [x] **Stack Builder**: Complete drag-and-drop functionality
- [x] **D3 Graph**: Node dragging implemented
- [x] **Interactions**: Real-time checking
- [x] **Polish Localization**: All UI translated
- [x] **Animations**: Framer Motion integrated
- [x] **Responsive Design**: Mobile-ready

---

## 📋 Step-by-Step Deployment

### Step 1: Prepare MongoDB Atlas

1. **Create MongoDB Atlas Account**
   ```
   https://www.mongodb.com/cloud/atlas/register
   ```

2. **Create a New Cluster**
   - Choose FREE tier (M0)
   - Select region closest to your users (Europe recommended for Polish users)
   - Cluster name: `suplementor-production`

3. **Configure Network Access**
   - Go to Network Access
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add Netlify's IP ranges for better security

4. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Username: `suplementor_app`
   - Password: Generate strong password (save it!)
   - Database User Privileges: "Read and write to any database"

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://suplementor_app:<password>@cluster.mongodb.net/suplementor_education?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

6. **Run Database Migration**
   ```bash
   # Set MongoDB URI in .env
   MONGODB_URI="your-connection-string-here"
   
   # Run migrations
   bun run src/lib/db/migrations/add-performance-indexes.ts
   ```

### Step 2: Prepare Netlify Account

1. **Create Netlify Account**
   ```
   https://app.netlify.com/signup
   ```

2. **Install Netlify CLI (Optional)**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

### Step 3: Deploy to Netlify

#### Option A: Deploy via Git (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "feat: production-ready deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your repository
   - Configure build settings:
     - **Build command**: `bun run build`
     - **Publish directory**: `.next`
     - **Node version**: 20

3. **Configure Environment Variables**
   - Go to Site settings → Environment variables
   - Add the following variables:

   ```env
   # Database
   MONGODB_URI=mongodb+srv://suplementor_app:YOUR_PASSWORD@cluster.mongodb.net/suplementor_education?retryWrites=true&w=majority
   
   # NextAuth.js
   NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
   NEXTAUTH_URL=https://your-app-name.netlify.app
   
   # Build
   NODE_ENV=production
   NODE_VERSION=20
   ```

4. **Generate NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (~3-5 minutes)

#### Option B: Deploy via CLI

```bash
# Build locally
bun run build

# Deploy to Netlify
netlify deploy --prod

# Follow prompts:
# - Create & configure new site
# - Publish directory: .next
```

### Step 4: Post-Deployment Configuration

1. **Set Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain
   - Configure DNS records

2. **Enable HTTPS**
   - Automatically enabled by Netlify
   - Force HTTPS redirect (already configured in netlify.toml)

3. **Configure Redirects**
   - Already configured in `netlify.toml`:
     - `/supplements` → `/suplementy`
     - `/brain` → `/wiedza`
     - `/knowledge` → `/wiedza`

4. **Test Deployment**
   - Visit your site: `https://your-app-name.netlify.app`
   - Test drag-and-drop: `/stack-builder`
   - Test knowledge graph: `/wiedza`
   - Test supplement search: `/suplementy`

---

## 🔧 Netlify Configuration

### netlify.toml (Already Configured)

```toml
[build]
  command = "bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Build Settings

- **Framework**: Next.js
- **Build command**: `bun run build`
- **Publish directory**: `.next`
- **Node version**: 20
- **Package manager**: Bun 1.1.38

---

## 🐛 Troubleshooting

### Build Fails

**Problem**: Build fails with "Module not found"
```bash
# Solution: Clear cache and rebuild
netlify build --clear-cache
```

**Problem**: TypeScript errors during build
```bash
# Solution: Run typecheck locally first
bun run typecheck
```

### Database Connection Issues

**Problem**: "MongooseError: Operation buffering timed out"
```bash
# Solution: Check MongoDB Atlas
# 1. Verify IP whitelist includes 0.0.0.0/0
# 2. Verify database user credentials
# 3. Check connection string format
```

**Problem**: "Authentication failed"
```bash
# Solution: Verify MONGODB_URI
# - Password must be URL-encoded
# - Special characters: @ → %40, # → %23, etc.
```

### Drag & Drop Not Working

**Problem**: Drag and drop doesn't work on mobile
```bash
# Solution: Already handled by @dnd-kit
# - Touch events supported
# - Pointer events enabled
# - Keyboard navigation available
```

### Performance Issues

**Problem**: Slow page loads
```bash
# Solution: Enable caching (already configured)
# - Static assets: 1 year cache
# - API responses: 5 minutes cache
# - Check Network tab in DevTools
```

---

## 📊 Monitoring & Analytics

### Netlify Analytics (Built-in)

1. **Enable Analytics**
   - Go to Site settings → Analytics
   - Enable Netlify Analytics ($9/month)

2. **Monitor**
   - Page views
   - Unique visitors
   - Top pages
   - Bandwidth usage

### Vercel Analytics (Optional)

```bash
# Already installed
@vercel/analytics
@vercel/speed-insights

# Configure in .env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-id
NEXT_PUBLIC_VERCEL_SPEED_INSIGHTS_ID=your-id
```

---

## 🔒 Security Checklist

- [x] **HTTPS**: Enabled by default
- [x] **Security Headers**: Configured in netlify.toml
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Content-Security-Policy: Configured
- [x] **Environment Variables**: Stored securely in Netlify
- [x] **Database**: MongoDB Atlas with authentication
- [x] **Input Validation**: Zod schemas + search sanitization
- [x] **Regex DoS Prevention**: Safe regex patterns

---

## 🚀 Performance Optimization

### Already Implemented

1. **Static Asset Caching**
   - 1 year cache for `/_next/static/*`
   - Immutable assets

2. **API Response Caching**
   - 5 minutes cache for `/api/*`
   - Stale-while-revalidate

3. **Database Indexes**
   - Optimized for common queries
   - Compound indexes for sorting

4. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports for heavy components

5. **Image Optimization**
   - Next.js Image component
   - Automatic WebP conversion

### Recommended Additions

1. **CDN Configuration**
   - Already handled by Netlify Edge Network
   - Global distribution

2. **Compression**
   - Brotli compression (automatic)
   - Gzip fallback

3. **Prefetching**
   - Next.js Link prefetching enabled
   - Automatic route prefetching

---

## 📈 Scaling Considerations

### Current Limits (Free Tier)

- **Netlify Free**:
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - 1 concurrent build

- **MongoDB Atlas Free (M0)**:
  - 512 MB storage
  - Shared RAM
  - Shared vCPU

### Upgrade Path

1. **Netlify Pro** ($19/month):
   - 1 TB bandwidth
   - 25,000 build minutes
   - 3 concurrent builds

2. **MongoDB Atlas M10** ($57/month):
   - 10 GB storage
   - 2 GB RAM
   - Dedicated cluster

---

## 🎯 Success Metrics

### Deployment Success Indicators

- ✅ Build completes without errors
- ✅ Site loads in <3 seconds
- ✅ Drag & drop works on all devices
- ✅ Database queries return in <200ms
- ✅ No console errors
- ✅ Lighthouse score >90

### Test Checklist

```bash
# 1. Homepage loads
curl -I https://your-app-name.netlify.app

# 2. API responds
curl https://your-app-name.netlify.app/api/health

# 3. Static assets cached
curl -I https://your-app-name.netlify.app/_next/static/...

# 4. Redirects work
curl -I https://your-app-name.netlify.app/supplements
# Should redirect to /suplementy
```

---

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **@dnd-kit Docs**: https://docs.dndkit.com

---

## 🎉 Deployment Complete!

Your Suplementor application is now live with:

- ✅ **Full drag-and-drop functionality**
- ✅ **MongoDB Atlas database**
- ✅ **Polish localization**
- ✅ **Production-ready security**
- ✅ **Optimized performance**
- ✅ **Global CDN distribution**

**Next Steps:**
1. Share your site URL
2. Monitor analytics
3. Gather user feedback
4. Iterate and improve

---

*Deployment Guide v1.0 - Last updated: 2025-10-05*  
*Maintained by: The Augster*

