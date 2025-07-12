# PauseOne - Cloudflare Pages Quick Start

## 🚀 Deploy in 5 Minutes

### Method 1: Dashboard Deployment (Easiest)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: prepare for Cloudflare Pages deployment"
   git push origin main
   ```

2. **Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Click **Pages** → **Create a project**
   - Connect your GitHub repository

3. **Build Settings**

   ```
   Framework preset: None
   Build command: npm run bundle:web
   Build output directory: dist
   Root directory: (leave empty)
   ```

4. **Environment Variables**

   ```
   NODE_VERSION=20
   NODE_ENV=production
   ```

5. **Deploy**
   - Click **Save and Deploy**
   - Wait 3-5 minutes
   - Your app will be live at `https://your-project.pages.dev`

### Method 2: CLI Deployment (Advanced)

1. **Install Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**

   ```bash
   wrangler login
   ```

3. **Deploy with Script**

   ```bash
   # Quick deploy
   npm run deploy:cloudflare

   # Staging deploy
   npm run deploy:cloudflare:staging

   # Dry run (test without deploying)
   npm run deploy:cloudflare:dry-run
   ```

## ⚡ One-Command Deploy

```bash
# Deploy to production
./scripts/deploy-cloudflare.sh

# Deploy to staging
./scripts/deploy-cloudflare.sh -e staging

# Skip tests and build faster
./scripts/deploy-cloudflare.sh -s -t
```

## 🔧 Configuration Files

All configuration files are already created:

- ✅ `wrangler.toml` - Cloudflare configuration
- ✅ `public/_headers` - Security and caching headers
- ✅ `public/_redirects` - SPA routing
- ✅ `.github/workflows/deploy-cloudflare.yml` - Auto-deployment
- ✅ `scripts/deploy-cloudflare.sh` - Deployment script

## 🌐 URLs

After deployment, your app will be available at:

- **Production**: `https://pauseone.pages.dev`
- **Staging**: `https://staging.pauseone.pages.dev`
- **PR Previews**: `https://[commit-hash].pauseone.pages.dev`

## 🔐 Required Secrets (for GitHub Actions)

Add these to your GitHub repository secrets:

```
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

Get these from:

- API Token: [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
- Account ID: [Cloudflare Dashboard → Right sidebar](https://dash.cloudflare.com/)

## 📊 Features Included

- ✅ **Automatic HTTPS** - SSL certificates managed by Cloudflare
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Branch Previews** - Every PR gets a preview URL
- ✅ **Performance Optimization** - Caching, compression, minification
- ✅ **Security Headers** - XSS protection, CSRF protection
- ✅ **Analytics** - Built-in Cloudflare Web Analytics
- ✅ **Custom Domains** - Easy to add your own domain

## 🛠️ Troubleshooting

### Build Fails

```bash
# Check build locally
npm run bundle:web
npm run serve:web
```

### Authentication Issues

```bash
# Re-login to Cloudflare
wrangler logout
wrangler login
```

### Large Bundle Size

```bash
# Analyze bundle
npx expo export --platform web --dev false --clear
```

## 📈 Next Steps

1. **Custom Domain**: Add your domain in Cloudflare Pages dashboard
2. **Analytics**: Enable Cloudflare Web Analytics
3. **Performance**: Configure caching rules
4. **Security**: Set up additional security features
5. **Monitoring**: Set up uptime monitoring

## 🎯 Pro Tips

- **Free Tier**: Unlimited bandwidth, 500 builds/month
- **Preview Deployments**: Every branch gets its own URL
- **Instant Rollbacks**: One-click rollback to previous versions
- **Edge Functions**: Add serverless functions if needed
- **Integration**: Works with any Git provider

---

**Your PauseOne app will be live in minutes!** 🎉

Need help? Check the [full deployment guide](./cloudflare-pages.md) or [open an issue](https://github.com/your-username/pauseone/issues).
