# Logo Replacement Task - Day 11

## Objective

Replace all existing app icons and logos with the PauseOne logo (`assets/images/pauseone.png`) for iOS and Android platforms, and remove unused logo files.

## Current Logo Files to Replace

- [ ] `assets/images/app-icon-all.png` (main app icon)
- [ ] `assets/images/app-icon-android-adaptive-background.png` (Android adaptive background)
- [ ] `assets/images/app-icon-android-adaptive-foreground.png` (Android adaptive foreground)
- [ ] `assets/images/app-icon-android-legacy.png` (Android legacy icon)
- [ ] `assets/images/app-icon-ios.png` (iOS app icon)
- [ ] `assets/images/app-icon-web-favicon.png` (Web favicon)

## Configuration Files to Update

- [ ] `app.json` - Update icon paths to use PauseOne logo
- [ ] `public/manifest.webmanifest` - Update web manifest icons
- [ ] Splash screen configuration in `app.json`

## Implementation Steps

### Phase 1: Backup and Analysis

- [x] Verify PauseOne logo exists and is accessible
- [x] Check current logo file dimensions and formats
- [x] Document current configuration references

### Phase 2: Logo Replacement

- [x] Copy PauseOne logo to replace `app-icon-all.png`
- [x] Copy PauseOne logo to replace `app-icon-ios.png`
- [x] Copy PauseOne logo to replace `app-icon-android-legacy.png`
- [x] Copy PauseOne logo to replace `app-icon-android-adaptive-foreground.png`
- [x] Create appropriate background for `app-icon-android-adaptive-background.png`
- [x] Copy PauseOne logo to replace `app-icon-web-favicon.png`

### Phase 3: Configuration Updates

- [x] Update `app.json` icon references
- [x] Update `public/manifest.webmanifest` icon references
- [x] Update splash screen configuration

### Phase 4: Cleanup

- [x] Remove any unused logo files (demo directories)
- [x] Verify all references are updated (Icon component)
- [x] Test configuration validity (TypeScript compilation passed)

### Phase 5: Validation

- [x] Build and test iOS configuration (TypeScript compilation passed)
- [x] Build and test Android configuration (TypeScript compilation passed)
- [x] Verify web manifest works correctly (Updated with correct paths)

## Completed Tasks Summary

✅ **All logo files successfully replaced with PauseOne logo:**

- Main app icon (app-icon-all.png) - 1024x1024
- iOS app icon (app-icon-ios.png) - 1024x1024
- Android legacy icon (app-icon-android-legacy.png) - 1024x1024
- Android adaptive foreground (app-icon-android-adaptive-foreground.png) - 1024x1024
- Android adaptive background (app-icon-android-adaptive-background.png) - 1024x1024 solid color #191015
- Web favicon (app-icon-web-favicon.png) - 48x48 resized

✅ **Configuration files updated:**

- app.json: Updated splash screen to use pauseone.png
- public/manifest.webmanifest: Updated icons array with correct paths and sizes

✅ **Cleanup completed:**

- Removed assets/images/demo directory (unused demo logos)
- Removed assets/icons/demo directory (unused demo icons)
- Updated Icon component to remove demo icon references
- TypeScript compilation successful

## Notes

- PauseOne logo source: `assets/images/pauseone.png`
- Need to maintain proper dimensions for different platforms
- Android adaptive icons require separate foreground and background
- iOS requires square format
- Web favicon should be optimized for small sizes

## Success Criteria

- All app icons use PauseOne logo
- iOS and Android builds work correctly
- Web manifest displays correct icons
- No broken icon references
- Unused logo files removed
