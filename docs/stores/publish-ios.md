# Publishing PauseOne to Apple App Store (iOS)

## Overview

This comprehensive guide walks you through publishing PauseOne to the Apple App Store, from initial setup to live deployment. PauseOne is built with Expo, which provides streamlined iOS publishing through EAS Build.

## Prerequisites

### Required Accounts & Tools

- **Apple Developer Account** ($99/year)
- **Expo Account** (free)
- **Xcode** (latest version, macOS only)
- **Node.js 20+** and npm/yarn
- **macOS** (required for iOS development)

### Development Environment

```bash
# Install Expo CLI
npm install -g @expo/cli

# Install EAS CLI (Expo Application Services)
npm install -g eas-cli

# Verify installation
expo --version
eas --version
```

## Publishing Methods

### Method 1: EAS Build (Recommended)

EAS Build handles the complex iOS build process in the cloud, including code signing.

#### 1. Configure EAS Build

The `eas.json` is already configured with iOS profiles:

```json
{
  "build": {
    "development": {
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": true,
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "ios": {
        "simulator": true,
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  }
}
```

#### 2. Configure App for Production

The `app.json` is already configured with iOS settings:

```json
{
  "ios": {
    "icon": "./assets/images/app-icon-ios.png",
    "supportsTablet": true,
    "bundleIdentifier": "com.thayminhtue.pauseone",
    "buildNumber": "1",
    "googleServicesFile": "./firebase/GoogleService-Info.plist"
  }
}
```

#### 3. Build for App Store

```bash
# Login to Expo
expo login

# Build for App Store distribution
eas build --platform ios --profile production

# Build for TestFlight (same as production)
eas build --platform ios --profile production

# Build for Simulator testing
eas build --platform ios --profile preview
```

#### 4. Download and Test Build

```bash
# List recent builds
eas build:list --platform ios

# Download IPA file for App Store submission
# Or install directly to TestFlight via EAS Submit
```

### Method 2: Local Build with Xcode

For developers who need custom native code or prefer local builds.

#### 1. Generate Native Code

```bash
# Create local iOS project
npx expo run:ios

# Or prebuild for manual compilation
npx expo prebuild --platform ios
```

#### 2. Build with Xcode

1. Open `ios/PauseOne.xcworkspace` in Xcode
2. Select **Product** → **Archive**
3. Choose distribution method (App Store Connect)
4. Upload to App Store Connect

#### 3. Manual Build Commands

```bash
cd ios

# Build for device
xcodebuild -workspace PauseOne.xcworkspace \
  -scheme PauseOne \
  -configuration Release \
  -destination generic/platform=iOS \
  archive -archivePath PauseOne.xcarchive

# Export for App Store
xcodebuild -exportArchive \
  -archivePath PauseOne.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

## Apple Developer Account Setup

### 1. Create Developer Account

1. Go to [Apple Developer](https://developer.apple.com)
2. Enroll in Apple Developer Program ($99/year)
3. Complete identity verification
4. Accept Developer Program License Agreement

### 2. App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** → **New App**
3. Fill in app information:
   - **Platform**: iOS
   - **Name**: PauseOne
   - **Primary Language**: English (U.S.)
   - **Bundle ID**: com.thayminhtue.pauseone
   - **SKU**: pauseone-ios (unique identifier)

### 3. Certificates & Provisioning

EAS Build handles this automatically, but for manual builds:

1. **Development Certificate**: For testing on devices
2. **Distribution Certificate**: For App Store submission
3. **Provisioning Profiles**: Link certificates to app bundle ID

## App Store Connect Configuration

### 1. App Information

#### Basic Details

- **Name**: PauseOne
- **Subtitle**: Mindful Breathing
- **Category**: Health & Fitness
- **Content Rights**: No, it does not contain, show, or access third-party content

#### Pricing and Availability

- **Price**: Free
- **Availability**: All countries/regions
- **App Store Distribution**: Available on the App Store

### 2. App Store Listing

Use content from `docs/stores/en.md`:

#### App Store Information

- **Name**: PauseOne
- **Subtitle**: Find peace in one breath
- **Description**: [Use full content from en.md]
- **Keywords**: mindfulness,meditation,breathing,stress relief,anxiety,calm,peace,wellness,zen
- **Support URL**: https://pauseone.app/support
- **Marketing URL**: https://pauseone.app

#### App Store Preview

- **App Preview**: Optional video preview (30 seconds max)
- **Screenshots**: Required for each device type
  - iPhone 6.7": 1290 x 2796 pixels (3 required)
  - iPhone 6.5": 1242 x 2688 pixels (3 required)
  - iPhone 5.5": 1242 x 2208 pixels (optional)
  - iPad Pro (6th gen): 2048 x 2732 pixels (optional)

### 3. App Review Information

#### Contact Information

- **First Name**: [Your first name]
- **Last Name**: [Your last name]
- **Phone Number**: [Your phone number]
- **Email**: [Your email]

#### Review Notes

```
PauseOne is a mindfulness app that helps users practice breathing exercises and view inspirational affirmations. The app:

- Does not require user accounts or collect personal data
- Works completely offline after initial download
- Contains 100 meaningful affirmations in 18 languages
- Provides guided breathing exercises with visual animations
- Is suitable for all ages and promotes mental wellness

Test Account: Not required (no login functionality)
Special Instructions: None required for testing
```

#### App Review Attachments

- Screenshots showing main features
- Demo video (optional but recommended)

## Code Signing & Certificates

### 1. Automatic Signing (EAS - Recommended)

EAS Build handles all signing automatically:

```bash
# EAS manages certificates and provisioning profiles
eas build --platform ios --profile production
```

### 2. Manual Signing

If managing certificates manually:

1. **Create App ID** in Apple Developer Portal
2. **Generate Certificates** (Development & Distribution)
3. **Create Provisioning Profiles**
4. **Configure in Xcode** or `credentials.json`

### 3. Credentials Management

```bash
# View current credentials
eas credentials

# Configure credentials interactively
eas credentials --platform ios
```

## TestFlight Beta Testing

### 1. Internal Testing

```bash
# Submit to TestFlight automatically
eas submit --platform ios --profile production
```

1. **Add Internal Testers** in App Store Connect
2. **Upload build** via EAS Submit or Xcode
3. **Distribute to testers** (up to 100 internal testers)
4. **Collect feedback** and iterate

### 2. External Testing

1. **Submit for Beta App Review** (required for external testing)
2. **Add External Testers** (up to 10,000 testers)
3. **Create Public Link** for easy tester recruitment
4. **Monitor feedback** and crash reports

### 3. TestFlight Configuration

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEFGHIJ"
      }
    }
  }
}
```

## App Store Review Process

### 1. Pre-Submission Checklist

- [ ] App tested on multiple iOS devices and versions
- [ ] All features working correctly
- [ ] No crashes or performance issues
- [ ] App follows iOS Human Interface Guidelines
- [ ] Privacy policy created and accessible
- [ ] App Store screenshots and metadata complete
- [ ] App Review Guidelines compliance verified

### 2. Submission Process

1. **Upload Build** to App Store Connect
2. **Complete App Store Information**
3. **Add Screenshots and Metadata**
4. **Submit for Review**
5. **Respond to Review Feedback** (if any)

### 3. Review Timeline

- **Standard Review**: 24-48 hours
- **Expedited Review**: 2-7 days (for critical issues)
- **Rejection**: Address feedback and resubmit

## Automated Publishing with EAS

### 1. Configure EAS Submit

Update `eas.json` with iOS submission settings:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDEFGHIJ"
      }
    }
  }
}
```

### 2. Apple App Store Connect API

1. **Generate API Key** in App Store Connect
2. **Download Key File** (.p8 format)
3. **Configure EAS** with API credentials

### 3. Automated Submission

```bash
# Build and submit in one command
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## CI/CD with GitHub Actions

Create `.github/workflows/ios-release.yml`:

```yaml
name: iOS Release

on:
  push:
    tags:
      - "v*"

jobs:
  build-and-deploy:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

      - name: Submit to App Store
        run: eas submit --platform ios --profile production --non-interactive
```

## Version Management

### 1. Version Numbers

iOS uses two version identifiers:

```json
{
  "version": "1.0.0", // Marketing version (user-facing)
  "ios": {
    "buildNumber": "1" // Build number (must increment)
  }
}
```

### 2. Semantic Versioning

Follow semantic versioning for marketing version:

```
1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features
2.0.0 - Major changes
```

### 3. Build Number Management

```bash
# Increment build number for each submission
# Can be automated in CI/CD pipeline
```

## App Store Optimization (ASO)

### 1. Keywords

Optimize for iOS App Store search:

```
Primary: mindfulness, meditation, breathing
Secondary: stress relief, anxiety, calm, peace
Long-tail: guided breathing, mindful meditation, stress management
```

### 2. Screenshots

Create compelling screenshots showing:

1. **Main breathing screen** with animation
2. **Affirmation display** with beautiful typography
3. **Language selection** showing multilingual support
4. **App overview** with key features highlighted

### 3. App Preview Video

30-second video showing:

- App launch and main interface
- Breathing exercise in action
- Affirmation display
- Smooth animations and transitions

## Monitoring & Analytics

### 1. App Store Connect Analytics

Monitor key metrics:

- **App Units**: Downloads and updates
- **Sales and Trends**: Revenue and conversion
- **App Analytics**: User engagement and retention
- **Crash Reports**: Stability monitoring

### 2. Firebase Analytics Integration

Already configured with Firebase:

```json
{
  "ios": {
    "googleServicesFile": "./firebase/GoogleService-Info.plist"
  },
  "plugins": ["@react-native-firebase/app", "@react-native-firebase/messaging"]
}
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and rebuild
eas build --platform ios --profile production --clear-cache
```

#### 2. Code Signing Issues

```bash
# Reset credentials
eas credentials --platform ios --clear-cache
eas credentials --platform ios
```

#### 3. App Store Rejection

- Review App Store Review Guidelines
- Check for policy violations
- Ensure metadata accuracy
- Test on multiple devices

### Debug Commands

```bash
# Check build status
eas build:list --platform ios

# View build logs
eas build:view [build-id]

# Test on simulator
npx expo run:ios --configuration Release
```

## Post-Launch

### 1. Monitor Performance

- Check crash reports daily
- Respond to user reviews
- Monitor app performance metrics
- Track keyword rankings

### 2. Updates

- Regular updates with new features
- Security patches and bug fixes
- iOS version compatibility updates
- Performance improvements

### 3. User Engagement

- Respond to reviews professionally
- Gather user feedback through support channels
- Plan feature roadmap based on user needs
- Monitor competitor apps

## Cost Considerations

### Required Costs

- **Apple Developer Program**: $99/year
- **EAS Build**: 30 builds/month free, then $99/month

### Optional Costs

- **App Store Search Ads**: Pay-per-tap advertising
- **Analytics Tools**: Advanced user analytics
- **Design Tools**: Professional screenshot creation

---

## Quick Commands Reference

```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Build for simulator testing
eas build --platform ios --profile preview

# Check build status
eas build:list --platform ios

# View submission status
eas submit:list --platform ios

# Test locally
npx expo run:ios --configuration Release
```

**Your PauseOne iOS app will be live on the App Store!** 🚀

For support, check [Expo documentation](https://docs.expo.dev) or [App Store Connect Help](https://developer.apple.com/support/app-store-connect/).
