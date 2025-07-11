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
PACKAGE_JSON="$PROJECT_ROOT/package.json"
APP_JSON="$PROJECT_ROOT/app.json"
EAS_JSON="$PROJECT_ROOT/eas.json"

# Default values
DEFAULT_PROFILE="production"
DEFAULT_PLATFORM="all"
LOCAL_BUILD=false
AUTO_SUBMIT=false
DRY_RUN=false
CLEAR_CACHE=false

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
    echo "Options:"
    echo "  -p, --platform <platform>    Platform to build (ios|android|web|all) [default: all]"
    echo "  -e, --profile <profile>      EAS build profile (development|preview|production) [default: production]"
    echo "  -l, --local                  Build locally instead of using EAS cloud"
    echo "  -s, --submit                 Auto-submit to app stores after successful build"
    echo "  -c, --clear-cache            Clear build cache before building"
    echo "  -d, --dry-run                Show what would be built without actually building"
    echo "  -h, --help                   Show this help message"
    echo ""
    echo "Platform-specific options:"
    echo "  --simulator                  Build for iOS simulator (iOS only)"
    echo "  --device                     Build for physical device (iOS only, implied for Android)"
    echo ""
    echo "Examples:"
    echo "  $0                           # Build all platforms with production profile"
    echo "  $0 -p ios -e preview         # Build iOS with preview profile"
    echo "  $0 -p android -l             # Build Android locally"
    echo "  $0 -p web                    # Build web version only"
    echo "  $0 --dry-run                 # Show what would be built"
    echo "  $0 -p ios -s                 # Build iOS and submit to App Store"
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v npx >/dev/null 2>&1 || missing_deps+=("npx")
    command -v git >/dev/null 2>&1 || missing_deps+=("git")
    
    # Check for EAS CLI if not building web only
    if [ "$PLATFORM" != "web" ]; then
        if ! command -v eas >/dev/null 2>&1; then
            missing_deps+=("eas-cli")
        fi
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "eas-cli") echo "  npm install -g @expo/eas-cli" ;;
                "node") echo "  Install Node.js from https://nodejs.org/" ;;
                "npm") echo "  npm is included with Node.js" ;;
                "git") echo "  Install git from https://git-scm.com/" ;;
            esac
        done
        exit 1
    fi
}

# Validate build configuration
validate_config() {
    # Check if required files exist
    local missing_files=()
    
    [ ! -f "$PACKAGE_JSON" ] && missing_files+=("package.json")
    [ ! -f "$APP_JSON" ] && missing_files+=("app.json")
    
    if [ "$PLATFORM" != "web" ]; then
        [ ! -f "$EAS_JSON" ] && missing_files+=("eas.json")
    fi
    
    if [ ${#missing_files[@]} -ne 0 ]; then
        log_error "Missing required files: ${missing_files[*]}"
        exit 1
    fi
    
    # Validate EAS profile exists
    if [ "$PLATFORM" != "web" ]; then
        if ! jq -e ".build.\"$PROFILE\"" "$EAS_JSON" >/dev/null 2>&1; then
            log_error "Build profile '$PROFILE' not found in eas.json"
            log_info "Available profiles:"
            jq -r '.build | keys[]' "$EAS_JSON" | sed 's/^/  - /'
            exit 1
        fi
    fi
    
    # Check git status
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Warn about uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "You have uncommitted changes. Consider committing them first."
        if [ "$DRY_RUN" = false ]; then
            read -p "Continue anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Aborted by user"
                exit 0
            fi
        fi
    fi
}

# Get current version info
get_version_info() {
    local package_version=$(jq -r '.version' "$PACKAGE_JSON")
    local app_version=$(jq -r '.version' "$APP_JSON")
    
    echo "Package version: $package_version"
    echo "App version: $app_version"
    
    if [ "$package_version" != "$app_version" ]; then
        log_warning "Version mismatch between package.json ($package_version) and app.json ($app_version)"
        log_info "Consider running: ./scripts/bump-version.sh $app_version --no-commit"
    fi
}

# Pre-build steps
pre_build() {
    log_step "Running pre-build checks..."
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm install
    
    # Run linting
    log_info "Running linter..."
    if npm run lint:check; then
        log_success "Linting passed"
    else
        log_error "Linting failed"
        read -p "Continue with build anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted due to linting errors"
            exit 1
        fi
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
    
    # Clear cache if requested
    if [ "$CLEAR_CACHE" = true ]; then
        log_info "Clearing build cache..."
        if [ "$PLATFORM" != "web" ]; then
            eas build:clear-cache --all --platform all
        fi
        # Clear local cache
        rm -rf node_modules/.cache
        rm -rf .expo
    fi
}

# Build for web
build_web() {
    log_build "Building for web..."
    
    # Clean previous build
    rm -rf dist
    
    # Build web bundle
    log_info "Generating web bundle..."
    npm run bundle:web
    
    log_success "Web build completed"
    log_info "Output directory: ./dist"
    
    # Optional: Test serve locally
    if command -v serve >/dev/null 2>&1; then
        log_info "To test locally, run: npm run serve:web"
    fi
}

# Build for native platforms
build_native() {
    local platform="$1"
    local build_command="eas build"
    
    # Add profile
    build_command="$build_command --profile $PROFILE"
    
    # Add platform
    build_command="$build_command --platform $platform"
    
    # Add local flag if specified
    if [ "$LOCAL_BUILD" = true ]; then
        build_command="$build_command --local"
    fi
    
    # Add device-specific options for iOS
    if [ "$platform" = "ios" ]; then
        if [ "$SIMULATOR_BUILD" = true ]; then
            # For simulator builds, we might need to use a different profile
            if jq -e ".build.\"$PROFILE\".ios.simulator" "$EAS_JSON" >/dev/null 2>&1; then
                log_info "Using simulator configuration from profile"
            else
                log_warning "Profile '$PROFILE' may not be configured for simulator builds"
            fi
        fi
    fi
    
    log_build "Building $platform with profile '$PROFILE'..."
    log_info "Command: $build_command"
    
    if [ "$DRY_RUN" = false ]; then
        eval "$build_command"
        log_success "$platform build completed"
        
        # Auto-submit if requested
        if [ "$AUTO_SUBMIT" = true ]; then
            submit_build "$platform"
        fi
    else
        log_warning "Dry run - would execute: $build_command"
    fi
}

# Submit build to app stores
submit_build() {
    local platform="$1"
    
    log_step "Submitting $platform build to app store..."
    
    case $platform in
        "ios")
            eas submit --platform ios --latest
            ;;
        "android")
            eas submit --platform android --latest
            ;;
        *)
            log_error "Auto-submit not supported for platform: $platform"
            ;;
    esac
}

# Show build summary
show_build_summary() {
    echo ""
    log_success "Build process completed!"
    echo ""
    echo "Build configuration:"
    echo "  Platform(s): $PLATFORM"
    echo "  Profile: $PROFILE"
    echo "  Local build: $LOCAL_BUILD"
    echo "  Auto-submit: $AUTO_SUBMIT"
    echo ""
    
    if [ "$PLATFORM" = "web" ] || [ "$PLATFORM" = "all" ]; then
        echo "Web build:"
        echo "  Output: ./dist"
        echo "  Test: npm run serve:web"
        echo ""
    fi
    
    if [ "$PLATFORM" != "web" ]; then
        echo "Native builds:"
        if [ "$LOCAL_BUILD" = false ]; then
            echo "  Check build status: eas build:list"
            echo "  Download builds: eas build:download"
        fi
        echo ""
    fi
    
    echo "Next steps:"
    if [ "$AUTO_SUBMIT" = false ] && [ "$PLATFORM" != "web" ]; then
        echo "  - Submit to app stores: eas submit --platform <platform> --latest"
    fi
    echo "  - Update version: ./scripts/bump-version.sh <patch|minor|major>"
    echo "  - Push changes: git push origin main --tags"
}

# Main execution
main() {
    local PLATFORM="$DEFAULT_PLATFORM"
    local PROFILE="$DEFAULT_PROFILE"
    local SIMULATOR_BUILD=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--platform)
                PLATFORM="$2"
                shift 2
                ;;
            -e|--profile)
                PROFILE="$2"
                shift 2
                ;;
            -l|--local)
                LOCAL_BUILD=true
                shift
                ;;
            -s|--submit)
                AUTO_SUBMIT=true
                shift
                ;;
            -c|--clear-cache)
                CLEAR_CACHE=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            --simulator)
                SIMULATOR_BUILD=true
                shift
                ;;
            --device)
                SIMULATOR_BUILD=false
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
    
    # Validate platform
    case $PLATFORM in
        "ios"|"android"|"web"|"all") ;;
        *)
            log_error "Invalid platform: $PLATFORM"
            log_info "Valid platforms: ios, android, web, all"
            exit 1
            ;;
    esac
    
    # Show configuration
    echo ""
    log_info "Build Configuration:"
    echo "  Platform(s): $PLATFORM"
    echo "  Profile: $PROFILE"
    echo "  Local build: $LOCAL_BUILD"
    echo "  Auto-submit: $AUTO_SUBMIT"
    echo "  Clear cache: $CLEAR_CACHE"
    echo "  Dry run: $DRY_RUN"
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No actual builds will be performed"
    fi
    
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Validate configuration
    validate_config
    
    # Show version info
    log_step "Version Information:"
    get_version_info
    echo ""
    
    # Confirm before proceeding
    if [ "$DRY_RUN" = false ]; then
        read -p "Proceed with build? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted by user"
            exit 0
        fi
    fi
    
    # Run pre-build steps
    pre_build
    
    # Build based on platform
    case $PLATFORM in
        "web")
            build_web
            ;;
        "ios")
            build_native "ios"
            ;;
        "android")
            build_native "android"
            ;;
        "all")
            build_web
            build_native "ios"
            build_native "android"
            ;;
    esac
    
    # Show summary
    show_build_summary
}

# Run main function
main "$@" 