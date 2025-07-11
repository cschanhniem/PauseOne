# PauseOne Build Scripts

This directory contains automation scripts for version management and release building for the PauseOne React Native Expo application.

## Prerequisites

Before using these scripts, ensure you have the following tools installed:

- **Node.js** (>=20.0.0)
- **npm** or **yarn**
- **Git**
- **jq** (for JSON processing) - Install with `brew install jq`
- **EAS CLI** (for native builds) - Install with `npm install -g @expo/eas-cli`

## Scripts Overview

### 🏷️ bump-version.sh

Automates version bumping across all configuration files and creates git tags.

**Features:**

- Updates `package.json` version
- Updates `app.json` version and build numbers (iOS/Android)
- Synchronizes versions across files
- Creates git commits and tags
- Supports dry-run mode
- Validates dependencies and git status

**Usage:**

```bash
# Bump patch version (e.g., 1.0.0 → 1.0.1)
./scripts/bump-version.sh patch

# Bump minor version (e.g., 1.0.0 → 1.1.0)
./scripts/bump-version.sh minor

# Bump major version (e.g., 1.0.0 → 2.0.0)
./scripts/bump-version.sh major

# Set specific version
./scripts/bump-version.sh 1.2.3

# Dry run to preview changes
./scripts/bump-version.sh patch --dry-run

# Update files without git commit
./scripts/bump-version.sh patch --no-commit
```

**NPM Shortcuts:**

```bash
npm run bump:patch    # Increment patch version
npm run bump:minor    # Increment minor version
npm run bump:major    # Increment major version
```

### 🔨 build-release.sh

Comprehensive build script supporting multiple platforms and build profiles.

**Features:**

- Builds for iOS, Android, and Web
- Supports EAS build profiles (development, preview, production)
- Local and cloud builds
- Pre-build validation (linting, type checking)
- Auto-submission to app stores
- Build cache management
- Comprehensive error handling

**Usage:**

```bash
# Build all platforms (production profile)
./scripts/build-release.sh

# Build specific platform
./scripts/build-release.sh -p ios
./scripts/build-release.sh -p android
./scripts/build-release.sh -p web

# Use different build profile
./scripts/build-release.sh -e preview
./scripts/build-release.sh -e development

# Local builds (faster, no EAS cloud)
./scripts/build-release.sh --local

# Auto-submit to app stores after successful build
./scripts/build-release.sh -p ios --submit

# Clear cache before building
./scripts/build-release.sh --clear-cache

# Dry run to preview build configuration
./scripts/build-release.sh --dry-run
```

**NPM Shortcuts:**

```bash
npm run build          # Build all platforms (production)
npm run build:web      # Build web only
npm run build:ios      # Build iOS only
npm run build:android  # Build Android only
npm run build:preview  # Build all with preview profile
npm run build:local    # Build locally (no cloud)
```

## Common Workflows

### 🚀 Release Workflow

1. **Prepare Release:**

   ```bash
   # Ensure clean working directory
   git status

   # Run tests
   npm test

   # Bump version
   npm run bump:patch  # or minor/major
   ```

2. **Build Release:**

   ```bash
   # Build all platforms
   npm run build

   # Or build specific platforms
   npm run build:ios
   npm run build:android
   npm run build:web
   ```

3. **Submit to Stores:**

   ```bash
   # iOS App Store
   eas submit --platform ios --latest

   # Google Play Store
   eas submit --platform android --latest
   ```

4. **Push Changes:**
   ```bash
   git push origin main --tags
   ```

### 🧪 Development Workflow

```bash
# Quick development build
npm run build:preview --local

# Test web build locally
npm run build:web
npm run serve:web
```

### 🐛 Troubleshooting

**Version Mismatch:**
If `package.json` and `app.json` versions are out of sync:

```bash
./scripts/bump-version.sh 1.0.0 --no-commit
```

**Build Cache Issues:**
Clear cache and rebuild:

```bash
npm run build --clear-cache
```

**EAS Authentication:**
Login to EAS if builds fail:

```bash
eas login
```

## Build Profiles

The scripts work with EAS build profiles defined in `eas.json`:

- **development**: Debug builds for testing
- **preview**: Production-like builds for internal testing
- **production**: App store ready builds

## Platform-Specific Notes

### iOS

- Supports simulator and device builds
- Auto-increments `buildNumber` in `app.json`
- Requires Apple Developer account for device builds

### Android

- Auto-increments `versionCode` in `app.json`
- Supports both APK and AAB formats
- Local builds available without Google Play account

### Web

- Outputs to `./dist` directory
- Uses Metro bundler
- Can be served locally with `npm run serve:web`

## Error Handling

Both scripts include comprehensive error handling:

- **Dependency checks**: Validates required tools are installed
- **Git validation**: Ensures clean repository state
- **Build validation**: Runs linting and type checking before builds
- **Interactive prompts**: Confirms destructive operations
- **Detailed logging**: Color-coded output with clear error messages

## Environment Variables

Scripts respect the following environment variables:

- `CI`: Disables interactive prompts in CI environments
- `EXPO_TOKEN`: EAS authentication token for CI builds

## Contributing

When modifying these scripts:

1. Test with `--dry-run` option first
2. Maintain backward compatibility
3. Update documentation for new features
4. Follow existing error handling patterns
5. Add comprehensive logging for debugging

## Support

For issues with these scripts:

1. Check the console output for specific error messages
2. Verify all prerequisites are installed
3. Ensure `eas.json` profiles are properly configured
4. Check EAS build documentation: https://docs.expo.dev/build/introduction/
