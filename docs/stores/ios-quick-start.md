# PauseOne - iOS Quick Start Guide

## 🚀 Publish to Apple App Store in 45 Minutes

### Prerequisites (10 minutes)

```bash
# Install required tools (macOS only)
npm install -g @expo/cli eas-cli

# Login to Expo
expo login

# Verify authentication
expo whoami
```

**Required:**

- **macOS** (iOS development requires Mac)
- **Apple Developer Account** ($99/year)
- **Xcode** (latest version from Mac App Store)

### Step 1: Apple Developer Setup (15 minutes)

1. **Join Apple Developer Program**
   - Go to [developer.apple.com](https://developer.apple.com)
   - Enroll in Apple Developer Program ($99/year)
   - Complete identity verification

2. **App Store Connect Setup**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Click **My Apps** → **+** → **New App**
   - Platform: **iOS**
   - Name: **PauseOne**
   - Primary Language: **English (U.S.)**
   - Bundle ID: **com.thayminhtue.pauseone**
   - SKU: **pauseone-ios**

### Step 2: Build iOS App (15 minutes)

```bash
# Quick build for testing
npm run build:ios:eas

# Or build for production
npm run build:ios:production

# Build and submit directly to App Store
npm run build:ios:submit

# Check build status
eas build:list --platform ios
```

**Note:** First build may take longer as EAS sets up certificates and provisioning profiles.

### Step 3: TestFlight Beta Testing (10 minutes)

1. **Upload to TestFlight** (automatic with EAS Submit)
2. **Add Internal Testers**
   - Go to App Store Connect → TestFlight
   - Add testers by email
   - Distribute build to testers

3. **Test Key Features**
   - App launches without crashes
   - Breathing animation works smoothly
   - Affirmations display correctly
   - Language detection works
   - Touch interactions responsive

### Step 4: App Store Submission (5 minutes)

#### Required Assets

Create these from your existing app icon:

- **App icon**: 1024x1024 PNG (no transparency, no rounded corners)
- **Screenshots**: 3 per device type (iPhone 6.7", 6.5")

#### Store Listing Content

Use content from `docs/stores/en.md`:

**App Name**: PauseOne
**Subtitle**: Find peace in one breath
**Description**: [Copy from docs/stores/en.md]
**Keywords**: mindfulness,meditation,breathing,stress relief,anxiety,calm,peace,wellness,zen

#### Complete App Store Information

1. **App Store** tab in App Store Connect
2. Upload screenshots and app icon
3. Add description and keywords
4. Set support URL: `https://pauseone.app/support`
5. Select build from TestFlight
6. **Submit for Review**

---

## 🔧 Automated Publishing (Advanced)

### One-Command Publishing

```bash
# Build and submit automatically
npm run build:ios:submit
```

### GitHub Actions (Set and Forget)

1. **Add secrets** to GitHub repository:

   ```
   EXPO_TOKEN=your_expo_token
   ```

2. **Push a tag** to trigger release:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Automatic deployment** happens via GitHub Actions

---

## 📱 Quick Testing

### Test on Simulator

```bash
# Build for simulator
npm run build:ios:eas

# Download .app file from EAS dashboard
# Drag to iOS Simulator
```

### Test on Device

```bash
# Build for device
npm run build:ios:device

# Install via TestFlight or Xcode
```

### Test Key Features

- [ ] App launches without crashes
- [ ] Breathing animation smooth at 60fps
- [ ] Affirmations load in correct language
- [ ] Touch interactions responsive
- [ ] Works in both light and dark mode
- [ ] Accessibility features work (VoiceOver)

---

## 🎯 Essential App Store Assets

### App Icon (1024x1024)

- Use your existing `assets/images/pauseone.png`
- Resize to exactly 1024x1024 pixels
- PNG format, no transparency
- No rounded corners (iOS adds them automatically)

### Screenshots

Capture 3-6 screenshots showing:

1. **Main breathing screen** with animation
2. **Affirmation display** with beautiful typography
3. **App overview** showing key features
4. **Settings/language** selection (optional)

**Sizes needed:**

- iPhone 6.7": 1290 x 2796 pixels (iPhone 14 Pro Max)
- iPhone 6.5": 1242 x 2688 pixels (iPhone 11 Pro Max)

### App Preview Video (Optional)

- 30 seconds maximum
- Show breathing exercise in action
- Highlight key features
- No audio required

---

## 📋 Privacy Policy Template

Host this on your website:

```markdown
# Privacy Policy for PauseOne

**Effective Date**: [Current Date]

## Data Collection

PauseOne does not collect any personal data. All app data stays on your device.

## Data Sharing

We do not share any data with third parties.

## Data Storage

All mindfulness data is stored locally on your device only.

## Third-Party Services

PauseOne does not use any third-party analytics or tracking services.

## Contact

For questions about this privacy policy, contact: [your-email]

## Changes

We may update this policy. Changes will be posted on this page.
```

---

## ⚡ Troubleshooting

### Build Fails

```bash
# Clear cache and retry
eas build --platform ios --profile production --clear-cache
```

### Certificate Issues

```bash
# Reset credentials
eas credentials --platform ios --clear-cache
eas credentials --platform ios
```

### App Store Rejection

- Review App Store Review Guidelines
- Check Human Interface Guidelines compliance
- Ensure all metadata is accurate
- Test on multiple devices and iOS versions

### Common Rejection Reasons

1. **Incomplete information** - Fill all required fields
2. **Broken functionality** - Test thoroughly before submission
3. **Misleading metadata** - Ensure description matches app functionality
4. **Privacy policy issues** - Make sure policy is accessible

---

## 🎉 Success Checklist

- [ ] Apple Developer account active
- [ ] App builds successfully with EAS
- [ ] TestFlight testing completed
- [ ] App Store listing complete with assets
- [ ] Privacy policy published and linked
- [ ] App submitted for review

**Your PauseOne iOS app is now submitted to the App Store!** 🚀

### Review Timeline

- **Standard Review**: 24-48 hours
- **Holiday Periods**: Up to 7 days
- **First Submission**: May take longer

### Next Steps

1. **Monitor** App Store Connect for review status
2. **Respond** to any reviewer feedback quickly
3. **Prepare** marketing materials for launch
4. **Plan** post-launch updates and improvements

---

## 📞 Support Resources

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **App Store Connect Help**: [developer.apple.com/support](https://developer.apple.com/support)
- **iOS Human Interface Guidelines**: [developer.apple.com/design](https://developer.apple.com/design)
- **App Store Review Guidelines**: [developer.apple.com/app-store/review](https://developer.apple.com/app-store/review)

**Need help?** Check the [full iOS publishing guide](./publish-ios.md) for detailed instructions.

---

## 🎯 Pro Tips

- **Start with TestFlight** - Always test with real users before App Store submission
- **Optimize for ASO** - Use relevant keywords in app name and description
- **Create great screenshots** - They're your main marketing tool
- **Respond to reviews** - Engage with users professionally
- **Plan regular updates** - Keep your app fresh and relevant

**Congratulations!** PauseOne will soon be available to millions of iOS users worldwide! 🌍
