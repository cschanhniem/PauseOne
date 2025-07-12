# Publishing PauseOne to Google Play Store (Android)

## Overview

This comprehensive guide walks you through publishing PauseOne to the Google Play Store, from initial setup to live deployment. PauseOne is built with Expo, which provides multiple publishing options for Android.

## Prerequisites

### Required Accounts & Tools

- **Google Play Console Account** ($25 one-time registration fee)
- **Expo Account** (free)
- **Android Studio** (for testing and debugging)
- **Java Development Kit (JDK) 17+**
- **Node.js 20+** and npm/yarn

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

EAS Build is Expo's cloud build service that handles the complex Android build process.

#### 1. Configure EAS Build

Create `eas.json` configuration:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### 2. Configure App for Production

Update `app.json`:

```json
{
  "expo": {
    "name": "PauseOne",
    "slug": "pauseone",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/pauseone.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.pauseone.app"
    },
    "android": {
      "package": "com.pauseone.app",
      "versionCode": 1,
      "compileSdkVersion": 34,
      "targetSdkVersion": 34,
      "permissions": [],
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "playStoreUrl": "https://play.google.com/store/apps/details?id=com.pauseone.app"
    },
    "web": {
      "favicon": "./assets/images/app-icon-web-favicon.png",
      "bundler": "metro"
    },
    "plugins": ["expo-localization"],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

#### 3. Build for Production

```bash
# Login to Expo
expo login

# Initialize EAS project
eas init

# Build Android App Bundle (AAB) for Play Store
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview
```

#### 4. Download and Test Build

```bash
# Download the built APK/AAB
eas build:list

# Install APK on device for testing
adb install path/to/your-app.apk
```

### Method 2: Local Build (Advanced)

For developers who prefer local builds or need custom native code.

#### 1. Generate Native Code

```bash
# Create local build directory
npx expo run:android

# Or prebuild for manual compilation
npx expo prebuild --platform android
```

#### 2. Build with Android Studio

1. Open `android/` folder in Android Studio
2. Select **Build** → **Generate Signed Bundle/APK**
3. Choose **Android App Bundle**
4. Create or use existing keystore
5. Build release version

#### 3. Manual Gradle Build

```bash
cd android

# Build release AAB
./gradlew bundleRelease

# Build release APK
./gradlew assembleRelease
```

## Google Play Console Setup

### 1. Create Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 registration fee
3. Complete developer profile
4. Accept Developer Distribution Agreement

### 2. Create New App

1. Click **Create app**
2. Fill in app details:
   - **App name**: PauseOne
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free

### 3. App Content & Policies

#### Privacy Policy

Create and host a privacy policy. Example content:

```
Privacy Policy for PauseOne

PauseOne respects your privacy completely. We don't collect any personal data,
don't require accounts, and don't track your usage. All your mindfulness data
stays on your device. Your peace of mind is our priority.

Data Collection: None
Data Sharing: None
Data Storage: Local device only
Contact: privacy@pauseone.app
```

#### Content Rating

1. Go to **Policy** → **App content**
2. Complete content rating questionnaire
3. PauseOne should receive **Everyone** rating

#### Target Audience

- **Target age group**: 13+ (or Everyone)
- **Appeals to children**: No

### 4. Store Listing

Use the store descriptions from `docs/stores/en.md`:

#### Basic Information

- **App name**: PauseOne - Mindful Breathing
- **Short description**: Find peace in one breath. Simple mindfulness for busy lives.
- **Full description**: [Use content from en.md]

#### Graphics Assets

Required assets (create from your app icon):

```bash
# App icon: 512 x 512 px (PNG, no transparency)
# Feature graphic: 1024 x 500 px
# Screenshots: At least 2, up to 8
# Phone screenshots: 320-3840 px (16:9 or 9:16 ratio)
# Tablet screenshots: 1080-7680 px
```

#### Store Listing Details

- **Category**: Health & Fitness
- **Tags**: mindfulness, meditation, breathing, wellness
- **Contact details**: Your email and website
- **Privacy policy**: Link to your privacy policy

## App Signing & Security

### 1. App Signing by Google Play (Recommended)

Let Google Play manage your app signing key:

1. Upload your app bundle
2. Google Play generates and manages signing key
3. Automatic key rotation and security

### 2. Manual Key Management

If you prefer to manage your own keys:

```bash
# Generate keystore
keytool -genkey -v -keystore pauseone-release-key.keystore \
  -alias pauseone -keyalg RSA -keysize 2048 -validity 10000

# Sign AAB manually
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore pauseone-release-key.keystore \
  app-release.aab pauseone
```

## Release Management

### 1. Internal Testing

```bash
# Upload to internal testing track
eas submit --platform android --track internal
```

1. Go to **Testing** → **Internal testing**
2. Upload your AAB file
3. Add internal testers (email addresses)
4. Test thoroughly before production

### 2. Closed Testing (Alpha/Beta)

1. **Testing** → **Closed testing**
2. Create new release
3. Upload AAB
4. Add testers or create testing groups
5. Get feedback and iterate

### 3. Production Release

#### Pre-launch Checklist

- [ ] App tested on multiple devices
- [ ] All store listing content complete
- [ ] Privacy policy published
- [ ] Content rating completed
- [ ] App signing configured
- [ ] Release notes written

#### Release Process

1. **Production** → **Releases**
2. **Create new release**
3. Upload production AAB
4. Add release notes
5. Set rollout percentage (start with 20%)
6. **Review and rollout**

## Automated Publishing with EAS

### 1. Configure EAS Submit

Update `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production",
        "releaseStatus": "draft"
      }
    },
    "beta": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "beta"
      }
    }
  }
}
```

### 2. Service Account Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create service account
3. Download JSON key file
4. Grant Play Console access

### 3. Automated Submission

```bash
# Build and submit to production (as draft)
eas build --platform android --profile production
eas submit --platform android --profile production

# Submit to beta testing
eas submit --platform android --profile beta
```

## CI/CD with GitHub Actions

Create `.github/workflows/android-release.yml`:

```yaml
name: Android Release

on:
  push:
    tags:
      - "v*"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
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

      - name: Build Android
        run: eas build --platform android --profile production --non-interactive

      - name: Submit to Play Store
        run: eas submit --platform android --profile production --non-interactive
```

## Version Management

### 1. Version Codes

Android requires incrementing version codes:

```json
{
  "android": {
    "versionCode": 1 // Increment for each release
  }
}
```

### 2. Semantic Versioning

Follow semantic versioning in `version` field:

```json
{
  "version": "1.0.0" // MAJOR.MINOR.PATCH
}
```

### 3. Release Notes

Keep track of changes for each version:

```
Version 1.0.0
• Initial release
• 18 languages with meaningful affirmations
• One-minute breathing sessions
• Beautiful liquid-glass design
• Privacy-first approach
```

## Monitoring & Analytics

### 1. Google Play Console Analytics

Monitor key metrics:

- **Installs and uninstalls**
- **User ratings and reviews**
- **Crash reports**
- **Performance metrics**

### 2. Firebase Analytics (Optional)

Add Firebase for detailed analytics:

```bash
# Install Firebase
expo install @react-native-firebase/app @react-native-firebase/analytics

# Configure in app.json
{
  "plugins": [
    "@react-native-firebase/app"
  ]
}
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear cache and rebuild
expo r -c
eas build --platform android --profile production --clear-cache
```

#### 2. Upload Rejected

- Check app signing configuration
- Verify target SDK version (should be recent)
- Ensure all required permissions are declared

#### 3. Policy Violations

- Review Google Play policies
- Ensure privacy policy is accessible
- Check content rating accuracy

### Debug Commands

```bash
# Check build status
eas build:list

# View build logs
eas build:view [build-id]

# Test local build
npx expo run:android --variant release
```

## Post-Launch

### 1. Monitor Performance

- Check crash reports daily
- Respond to user reviews
- Monitor app performance metrics

### 2. Updates

- Regular updates with new features
- Security patches
- Performance improvements

### 3. User Engagement

- Respond to reviews professionally
- Gather user feedback
- Plan feature roadmap

## Cost Considerations

### Free Options

- **Expo EAS**: 30 builds/month free
- **Google Play Console**: $25 one-time fee

### Paid Options

- **EAS Production**: $99/month for unlimited builds
- **Firebase**: Pay-as-you-go pricing

---

## Quick Commands Reference

```bash
# Build for production
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production

# Build and test locally
npx expo run:android --variant release

# Check build status
eas build:list

# View submission status
eas submit:list
```

**Your PauseOne Android app will be live on Google Play Store!** 🚀

For support, check [Expo documentation](https://docs.expo.dev) or [Google Play Console Help](https://support.google.com/googleplay/android-developer).
