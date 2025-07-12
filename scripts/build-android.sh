#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default values
BUILD_TYPE="preview"
INSTALL_ON_DEVICE=false
SKIP_TESTS=false
CLEAN_BUILD=false

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

log_step() {
    echo -e "${PURPLE}▶${NC} $1"
}

log_build() {
    echo -e "${CYAN}🔨${NC} $1"
}

usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Build PauseOne for Android"
    echo ""
    echo "Options:"
    echo "  -t, --type <type>           Build type (preview|production) [default: preview]"
    echo "  -i, --install               Install APK on connected device after build"
    echo "  -s, --skip-tests            Skip running tests"
    echo "  -c, --clean                 Clean build (clear cache)"
    echo "  -h, --help                  Show this help message"
    echo ""
    echo "Build Types:"
    echo "  preview                     Build APK for testing (faster)"
    echo "  production                  Build AAB for Play Store (slower)"
    echo ""
    echo "Examples:"
    echo "  $0                          # Build preview APK"
    echo "  $0 -t production            # Build production AAB"
    echo "  $0 -i                       # Build and install on device"
    echo "  $0 -c                       # Clean build"
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v expo >/dev/null 2>&1 || missing_deps+=("expo")
    command -v eas >/dev/null 2>&1 || missing_deps+=("eas")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "expo") echo "  npm install -g @expo/cli" ;;
                "eas") echo "  npm install -g eas-cli" ;;
                "node") echo "  Install Node.js from https://nodejs.org/" ;;
                "npm") echo "  npm is included with Node.js" ;;
            esac
        done
        exit 1
    fi
}

# Check EAS authentication
check_auth() {
    log_step "Checking Expo authentication..."
    
    if ! expo whoami >/dev/null 2>&1; then
        log_error "Not authenticated with Expo"
        log_info "Please run: expo login"
        exit 1
    fi
    
    local user=$(expo whoami 2>/dev/null || echo "unknown")
    log_success "Authenticated as: $user"
}

# Check for connected Android devices
check_devices() {
    if [ "$INSTALL_ON_DEVICE" = true ]; then
        log_step "Checking for connected Android devices..."
        
        if ! command -v adb >/dev/null 2>&1; then
            log_error "ADB not found. Please install Android SDK Platform Tools."
            exit 1
        fi
        
        local devices=$(adb devices | grep -v "List of devices" | grep "device$" | wc -l)
        
        if [ "$devices" -eq 0 ]; then
            log_error "No Android devices connected"
            log_info "Please connect an Android device and enable USB debugging"
            exit 1
        fi
        
        log_success "Found $devices connected device(s)"
        adb devices | grep "device$"
    fi
}

# Run pre-build checks
pre_build_checks() {
    log_step "Running pre-build checks..."
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    
    # Run tests unless skipped
    if [ "$SKIP_TESTS" = false ]; then
        log_info "Running tests..."
        if npm test; then
            log_success "Tests passed"
        else
            log_error "Tests failed"
            read -p "Continue with build anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Aborted due to test failures"
                exit 1
            fi
        fi
    else
        log_warning "Skipping tests"
    fi
    
    # Run linting
    log_info "Running linter..."
    if npm run lint:check; then
        log_success "Linting passed"
    else
        log_warning "Linting issues found"
    fi
    
    # Run type checking
    log_info "Running type check..."
    if npm run compile; then
        log_success "Type checking passed"
    else
        log_error "Type checking failed"
        read -p "Continue with build anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted due to type errors"
            exit 1
        fi
    fi
}

# Build the Android app
build_android() {
    log_build "Building Android app..."
    
    local build_command="eas build --platform android"
    local profile="$BUILD_TYPE"
    
    # Use correct profile name
    if [ "$BUILD_TYPE" = "preview" ]; then
        profile="preview"
    elif [ "$BUILD_TYPE" = "production" ]; then
        profile="production"
    fi
    
    build_command="$build_command --profile $profile"
    
    # Add clean flag if requested
    if [ "$CLEAN_BUILD" = true ]; then
        build_command="$build_command --clear-cache"
        log_info "Clean build requested - clearing cache"
    fi
    
    # Add non-interactive flag for CI
    build_command="$build_command --non-interactive"
    
    log_info "Build command: $build_command"
    log_info "This may take 5-15 minutes depending on your internet connection..."
    
    # Execute build
    eval "$build_command"
    
    log_success "Build completed!"
}

# Download and install APK
download_and_install() {
    if [ "$BUILD_TYPE" = "preview" ] && [ "$INSTALL_ON_DEVICE" = true ]; then
        log_step "Downloading and installing APK..."
        
        # Get the latest build URL
        local build_info=$(eas build:list --platform android --limit 1 --json)
        local build_url=$(echo "$build_info" | jq -r '.[0].artifacts.buildUrl // empty')
        local build_status=$(echo "$build_info" | jq -r '.[0].status // empty')
        
        if [ "$build_status" != "FINISHED" ]; then
            log_error "Build not finished yet. Status: $build_status"
            return 1
        fi
        
        if [ -z "$build_url" ] || [ "$build_url" = "null" ]; then
            log_error "Could not get build download URL"
            return 1
        fi
        
        log_info "Downloading APK from: $build_url"
        
        # Download APK
        local apk_file="pauseone-$(date +%Y%m%d-%H%M%S).apk"
        curl -L -o "$apk_file" "$build_url"
        
        if [ ! -f "$apk_file" ]; then
            log_error "Failed to download APK"
            return 1
        fi
        
        log_success "APK downloaded: $apk_file"
        
        # Install on device
        log_info "Installing APK on device..."
        adb install -r "$apk_file"
        
        log_success "APK installed successfully!"
        
        # Clean up
        rm "$apk_file"
        
        # Launch app
        log_info "Launching PauseOne..."
        adb shell am start -n com.thayminhtue.pauseone/.MainActivity
        
    elif [ "$BUILD_TYPE" = "production" ]; then
        log_info "Production build (AAB) completed"
        log_info "Download from EAS dashboard: https://expo.dev/accounts/[your-account]/projects/pauseone/builds"
    fi
}

# Show build summary
show_summary() {
    echo ""
    log_success "Build Summary"
    echo ""
    echo "Build type: $BUILD_TYPE"
    echo "Clean build: $CLEAN_BUILD"
    echo "Install on device: $INSTALL_ON_DEVICE"
    echo "Skip tests: $SKIP_TESTS"
    echo ""
    
    if [ "$BUILD_TYPE" = "preview" ]; then
        echo "Output: APK file (for testing)"
        echo "Use case: Internal testing, device installation"
    else
        echo "Output: AAB file (for Play Store)"
        echo "Use case: Google Play Store submission"
    fi
    
    echo ""
    echo "Next steps:"
    if [ "$BUILD_TYPE" = "preview" ]; then
        echo "  - Test the app thoroughly on device"
        echo "  - Share APK with internal testers"
        echo "  - Report any issues found"
    else
        echo "  - Download AAB from EAS dashboard"
        echo "  - Upload to Google Play Console"
        echo "  - Submit for review"
    fi
    
    echo ""
    echo "Useful commands:"
    echo "  eas build:list                    # View build history"
    echo "  eas build:view [build-id]         # View specific build details"
    echo "  adb logcat | grep PauseOne        # View app logs"
}

# Main execution
main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--type)
                BUILD_TYPE="$2"
                shift 2
                ;;
            -i|--install)
                INSTALL_ON_DEVICE=true
                shift
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -c|--clean)
                CLEAN_BUILD=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                log_error "Unexpected argument: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    # Validate build type
    case $BUILD_TYPE in
        "preview"|"production") ;;
        *)
            log_error "Invalid build type: $BUILD_TYPE"
            log_info "Valid build types: preview, production"
            exit 1
            ;;
    esac
    
    # Show configuration
    echo ""
    log_info "Android Build Configuration:"
    echo "  Build type: $BUILD_TYPE"
    echo "  Install on device: $INSTALL_ON_DEVICE"
    echo "  Skip tests: $SKIP_TESTS"
    echo "  Clean build: $CLEAN_BUILD"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Check authentication
    check_auth
    
    # Check devices if installation requested
    check_devices
    
    # Confirm build
    read -p "Proceed with Android build? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Aborted by user"
        exit 0
    fi
    
    # Run pre-build checks
    pre_build_checks
    
    # Build Android app
    build_android
    
    # Download and install if requested
    download_and_install
    
    # Show summary
    show_summary
}

# Change to project root
cd "$PROJECT_ROOT"

# Run main function
main "$@"
