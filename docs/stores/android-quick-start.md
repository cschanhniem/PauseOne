# PauseOne - Android Quick Start Guide

## 🚀 Publish to Google Play Store in 30 Minutes

### Prerequisites (5 minutes)

```bash
# Install required tools
npm install -g @expo/cli eas-cli

# Login to Expo
expo login

# Verify authentication
expo whoami
```

### Step 1: Google Play Console Setup (10 minutes)

1. **Create Developer Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay $25 registration fee
   - Complete developer profile

2. **Create New App**
   - Click **Create app**
   - App name: **PauseOne**
   - Default language: **English (United States)**
   - App type: **App**
   - Free or paid: **Free**

3. **Basic Setup**
   - Category: **Health & Fitness**
   - Privacy policy: Create and host one (see template below)

### Step 2: Build Android App (10 minutes)

```bash
# Quick build for testing
npm run build:android:eas

# Or build for production
npm run build:android:production

# Check build status
eas build:list --platform android
```

### Step 3: Upload to Play Console (5 minutes)

1. **Download AAB file** from EAS dashboard
2. **Go to Play Console** → Your app → **Production**
3. **Create new release**
4. **Upload AAB file**
5. **Add release notes**
6. **Save as draft**

### Step 4: Complete Store Listing (10 minutes)

#### Required Assets

Create these quickly from your app icon:

- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: 2-8 images from device/emulator

#### Store Listing Content

Use content from `docs/stores/en.md`:

**Short Description** (80 chars):

```
Find peace in one breath. Simple mindfulness for busy lives.
```

**Full Description** (copy from `docs/stores/en.md`):

```
Discover calm in just one minute.

PauseOne is the beautifully simple mindfulness app that helps you find peace anywhere, anytime...
[Use full content from en.md]
```

### Step 5: Content Rating & Policies (5 minutes)

1. **Content Rating**
   - Go to **Policy** → **App content** → **Content rating**
   - Answer questionnaire (PauseOne should get "Everyone" rating)

2. **Target Audience**
   - Age group: **13+** or **Everyone**
   - Appeals to children: **No**

3. **Data Safety**
   - Data collection: **No data collected**
   - Data sharing: **No data shared**

### Step 6: Submit for Review (2 minutes)

1. **Review release**
2. **Start rollout to production** (or save as draft)
3. **Set rollout percentage**: Start with **20%**

---

## 🔧 Automated Publishing (Advanced)

### One-Command Publishing

```bash
# Build and submit automatically
eas build --platform android --profile production
eas submit --platform android --profile production
```

### GitHub Actions (Set and Forget)

1. **Add secrets** to GitHub repository:

   ```
   EXPO_TOKEN=your_expo_token
   GOOGLE_SERVICE_ACCOUNT_JSON=your_service_account_json
   ```

2. **Push a tag** to trigger release:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Automatic deployment** happens via GitHub Actions

---

## 📱 Quick Testing

### Test on Device

```bash
# Build and install APK directly
npm run build:android:install

# Or download APK from EAS and install
adb install pauseone.apk
```

### Test Key Features

- [ ] App launches without crashes
- [ ] Breathing animation works smoothly
- [ ] Affirmations load in correct language
- [ ] Touch interactions responsive
- [ ] App works offline

---

## 🎯 Essential Store Assets

### App Icon (512x512)

Use your existing `assets/images/pauseone.png` and resize to 512x512 PNG.

### Feature Graphic (1024x500)

Create a simple banner with:

- PauseOne logo
- Tagline: "Find peace in one breath"
- Calming background

### Screenshots

Capture 2-4 screenshots showing:

1. Main breathing screen
2. Affirmation display
3. Settings/language selection
4. About/info screen

---

## 📋 Privacy Policy Template

Host this on your website or GitHub Pages:

```markdown
# Privacy Policy for PauseOne

**Effective Date**: [Current Date]

## Data Collection

PauseOne does not collect any personal data. All app data stays on your device.

## Data Sharing

We do not share any data with third parties.

## Data Storage

All mindfulness data is stored locally on your device only.

## Contact

For questions about this privacy policy, contact: [your-email]
```

---

## ⚡ Troubleshooting

### Build Fails

```bash
# Clear cache and retry
eas build --platform android --profile production --clear-cache
```

### Upload Rejected

- Check target SDK version (should be 34+)
- Verify app signing configuration
- Ensure version code is incremented

### Policy Violations

- Review Google Play policies
- Ensure privacy policy is accessible
- Check content rating accuracy

---

## 🎉 Success Checklist

- [ ] App builds successfully
- [ ] AAB uploaded to Play Console
- [ ] Store listing complete with assets
- [ ] Content rating completed
- [ ] Privacy policy published
- [ ] Release submitted for review

**Your PauseOne Android app is now live on Google Play Store!** 🚀

### Next Steps

1. **Monitor** crash reports and user reviews
2. **Respond** to user feedback professionally
3. **Plan** regular updates with new features
4. **Optimize** store listing based on performance

---

## 📞 Support Resources

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Google Play Console Help**: [support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)
- **PauseOne Issues**: [GitHub Issues](https://github.com/your-username/pauseone/issues)

**Need help?** Check the [full Android publishing guide](./publish-android.md) for detailed instructions.
