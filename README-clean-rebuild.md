# Clean Rebuild Script

## Overview

The `clean-rebuild.sh` script provides a comprehensive solution for cleaning up all build artifacts and rebuilding the PauseOne project from scratch. This is useful when you encounter build issues, dependency conflicts, or want to ensure a completely fresh build environment.

## Usage

### Command Line

```bash
# Make the script executable (first time only)
chmod +x clean-rebuild.sh

# Run the script
./clean-rebuild.sh
```

### NPM Script

```bash
# Using the npm script (recommended)
npm run clean-rebuild

# Or with yarn
yarn clean-rebuild
```

## What It Does

### 🧹 Cleanup Phase

1. **Node.js Dependencies**
   - Removes `node_modules` directory
   - Removes `package-lock.json` (preserves `yarn.lock`)

2. **Expo/Metro Cache**
   - Clears Expo development cache
   - Removes `.metro` cache directory
   - Resets React Native Metro bundler cache

3. **iOS Build Artifacts**
   - Removes iOS `build` directory
   - Removes `Pods` directory and `Podfile.lock`
   - Cleans Xcode workspace and derived data

4. **Android Build Artifacts**
   - Runs Gradle clean
   - Removes Android `build` directories
   - Clears `.gradle` cache

5. **Web Build Artifacts**
   - Removes `dist` directory
   - Removes `.expo` directory

6. **Development Caches**
   - Clears TypeScript build cache
   - Clears Jest cache
   - Clears ESLint cache
   - Removes temporary files (`.DS_Store`, `*.log`, etc.)

### 🔄 Rebuild Phase

1. **Dependencies Installation**
   - Automatically detects and uses the appropriate package manager (yarn, pnpm, or npm)
   - Installs Node.js dependencies

2. **iOS Dependencies** (macOS only)
   - Installs CocoaPods dependencies
   - Updates pod repository

3. **Project Setup**
   - Runs Expo prebuild with clean flag
   - Performs TypeScript compilation check
   - Runs lint check (non-blocking)

## Features

- **Smart Package Manager Detection**: Automatically uses yarn, pnpm, or npm based on lock files
- **Platform Awareness**: Only runs iOS-specific commands on macOS
- **Colored Output**: Uses colored terminal output for better readability
- **Error Handling**: Continues execution even if some steps fail
- **Progress Tracking**: Clear step-by-step progress indicators

## Output Example

```
🧹 Starting PauseOne Clean Rebuild Process...
================================================
📋 Cleaning Node.js dependencies...
✅ Removed node_modules directory
📋 Cleaning Expo and Metro cache...
✅ Cleared Expo cache
📋 Cleaning iOS build artifacts...
✅ Cleaned Xcode workspace
...
🎉 Clean rebuild completed successfully!
=======================================
✅ Project is ready for development
```

## When to Use

- **Build Issues**: When experiencing mysterious build failures
- **Dependency Conflicts**: After updating dependencies or resolving conflicts
- **Cache Problems**: When Metro bundler or other caches are corrupted
- **Fresh Start**: Before important builds or releases
- **Switching Branches**: After switching between branches with different dependencies
- **CI/CD**: As part of automated build pipelines

## Requirements

- **macOS**: For iOS development features
- **Node.js**: For npm/yarn/pnpm package management
- **CocoaPods**: For iOS dependency management (optional)
- **Android SDK**: For Android build cleaning (optional)
- **ImageMagick**: For image processing (used in logo replacement)

## Troubleshooting

### Script Permissions

```bash
chmod +x clean-rebuild.sh
```

### Missing Dependencies

The script will warn about missing tools but continue execution:

- CocoaPods not found: iOS pod install will be skipped
- Expo CLI not found: Some cache clearing will be skipped
- Android SDK not found: Android cleaning will be skipped

### Long Execution Time

The script can take several minutes to complete, especially:

- First run after major dependency changes
- When downloading large iOS/Android dependencies
- On slower internet connections

## Integration

The script is integrated into the project's package.json:

```json
{
  "scripts": {
    "clean-rebuild": "./clean-rebuild.sh"
  }
}
```

This allows it to be run using standard npm/yarn commands and integrates with development workflows.
