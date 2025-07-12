# Deploying PauseOne to Cloudflare Pages

## Overview

This guide walks you through deploying PauseOne's web version to Cloudflare Pages. PauseOne is built with Expo and React Native Web, making it perfectly suitable for web deployment.

## Prerequisites

- **Node.js 20+** (as specified in package.json)
- **Git repository** (GitHub, GitLab, or Bitbucket)
- **Cloudflare account** (free tier works)
- **Expo CLI** (if not already installed)

## Quick Start

### 1. Prepare Your Repository

Ensure your code is pushed to a Git repository (GitHub recommended):

```bash
# If not already done
git add .
git commit -m "feat: prepare for Cloudflare Pages deployment"
git push origin main
```

### 2. Build Configuration

PauseOne already has the necessary build scripts. The key script is:

```bash
npm run bundle:web
```

This generates a `dist/` folder with the web build.

### 3. Cloudflare Pages Setup

#### Option A: Dashboard Deployment (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to **Pages** in the sidebar

2. **Create New Project**
   - Click **"Create a project"**
   - Choose **"Connect to Git"**
   - Select your repository (authorize if needed)

3. **Configure Build Settings**

   ```
   Framework preset: None (Custom)
   Build command: npm run bundle:web
   Build output directory: dist
   Root directory: / (leave empty)
   ```

4. **Environment Variables** (if needed)

   ```
   NODE_VERSION=20
   NPM_VERSION=latest
   ```

5. **Deploy**
   - Click **"Save and Deploy"**
   - Wait for the build to complete (~3-5 minutes)

#### Option B: Wrangler CLI Deployment

1. **Install Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

3. **Create Pages Project**

   ```bash
   wrangler pages project create pauseone
   ```

4. **Deploy**

   ```bash
   # Build first
   npm run bundle:web

   # Deploy
   wrangler pages deploy dist --project-name=pauseone
   ```

## Build Configuration Details

### Package.json Scripts

The relevant scripts for web deployment:

```json
{
  "scripts": {
    "web": "expo start --web",
    "bundle:web": "npx expo export --platform web",
    "serve:web": "npx serve dist",
    "build:web": "./scripts/build-release.sh -p web"
  }
}
```

### App.json Web Configuration

```json
{
  "web": {
    "favicon": "./assets/images/app-icon-web-favicon.png",
    "bundler": "metro"
  }
}
```

## Cloudflare Pages Configuration

### Build Settings

Create a `_headers` file in your `public/` directory (or it will be auto-generated):

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Custom Domain (Optional)

1. **Add Custom Domain**
   - In Cloudflare Pages dashboard
   - Go to your project → **Custom domains**
   - Add your domain (e.g., `pauseone.app`)

2. **DNS Configuration**
   - Add CNAME record pointing to your Pages URL
   - Or use Cloudflare's nameservers for full management

## Advanced Configuration

### Environment Variables

For different environments, set these in Cloudflare Pages:

```bash
# Production
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://api.pauseone.app

# Staging
NODE_ENV=staging
EXPO_PUBLIC_API_URL=https://staging-api.pauseone.app
```

### Build Optimization

#### 1. Create Cloudflare-specific Build Script

```bash
# Add to package.json
"build:cloudflare": "NODE_ENV=production npm run bundle:web"
```

#### 2. Optimize Bundle Size

Add to `metro.config.js`:

```javascript
const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Optimize for web
if (process.env.EXPO_PLATFORM === "web") {
  config.resolver.alias = {
    "react-native": "react-native-web",
  }
}

module.exports = config
```

### Performance Optimizations

#### 1. Enable Cloudflare Features

In your Cloudflare dashboard:

- **Speed** → **Optimization**
  - Enable Auto Minify (HTML, CSS, JS)
  - Enable Brotli compression
  - Enable Rocket Loader™

#### 2. Caching Rules

Create `_headers` file:

```
# Cache static assets
/static/*
  Cache-Control: public, max-age=31536000, immutable

# Cache images
*.png
  Cache-Control: public, max-age=31536000
*.jpg
  Cache-Control: public, max-age=31536000
*.svg
  Cache-Control: public, max-age=31536000

# Don't cache HTML
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

## Continuous Deployment

### Automatic Deployments

Cloudflare Pages automatically deploys when you push to your main branch:

1. **Production Branch**: `main` or `master`
2. **Preview Branches**: All other branches get preview deployments
3. **Build Triggers**: Every push triggers a new build

### Branch Deployments

- **Production**: `https://pauseone.pages.dev`
- **Preview**: `https://branch-name.pauseone.pages.dev`

## Troubleshooting

### Common Issues

#### 1. Build Fails - Node Version

**Error**: `Node version not supported`

**Solution**: Set environment variable:

```
NODE_VERSION=20
```

#### 2. Build Fails - Dependencies

**Error**: `Module not found`

**Solution**: Ensure all dependencies are in `dependencies`, not `devDependencies`:

```bash
npm install --save react-native-web
```

#### 3. Routing Issues

**Error**: 404 on page refresh

**Solution**: Create `_redirects` file:

```
/*    /index.html   200
```

#### 4. Large Bundle Size

**Error**: Build timeout or large bundle

**Solution**:

- Enable tree shaking
- Use dynamic imports
- Optimize images

### Debug Build Locally

```bash
# Test the exact build that will be deployed
npm run bundle:web
npm run serve:web

# Open http://localhost:3000
```

## Monitoring & Analytics

### Cloudflare Analytics

- **Web Analytics**: Built-in page views, visitors
- **Core Web Vitals**: Performance metrics
- **Security Events**: Attack attempts blocked

### Custom Analytics

Add to your app:

```javascript
// Add to app/app.tsx
if (typeof window !== "undefined" && window.location.hostname.includes("pages.dev")) {
  // Cloudflare Web Analytics
  // Add your beacon token
}
```

## Security Considerations

### Content Security Policy

Add to `_headers`:

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:
```

### HTTPS Enforcement

Cloudflare Pages automatically provides HTTPS and redirects HTTP traffic.

## Cost Considerations

### Cloudflare Pages Pricing

- **Free Tier**:
  - 1 build at a time
  - 500 builds per month
  - Unlimited bandwidth
  - Custom domains

- **Pro Tier** ($20/month):
  - 5 concurrent builds
  - 5,000 builds per month
  - Advanced analytics

For PauseOne, the free tier should be sufficient initially.

## Next Steps

1. **Set up monitoring** with Cloudflare Analytics
2. **Configure custom domain** for branding
3. **Set up staging environment** with branch deployments
4. **Optimize performance** with Cloudflare features
5. **Add CI/CD** with GitHub Actions for advanced workflows

---

Your PauseOne web app will be live at `https://your-project.pages.dev` within minutes of deployment! 🚀
