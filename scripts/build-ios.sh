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
DEVICE_TYPE="simulator"
SKIP_TESTS=false
CLEAN_BUILD=false
SUBMIT_TO_STORE=false

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
    echo "Build PauseOne for iOS"
    echo ""
    echo "Options:"
    echo "  -t, --type <type>           Build type (preview|production) [default: preview]"
    echo "  -d, --device <device>       Device type (simulator|device) [default: simulator]"
    echo "  -s, --skip-tests            Skip running tests"
    echo "  -c, --clean                 Clean build (clear cache)"
    echo "  --submit                    Submit to App Store after build (production only)"
    echo "  -h, --help                  Show this help message"
    echo ""
    echo "Build Types:"
    echo "  preview                     Build for testing (simulator/device)"
    echo "  production                  Build for App Store submission"
    echo ""
    echo "Device Types:"
    echo "  simulator                   Build for iOS Simulator"
    echo "  device                      Build for physical iOS device"
    echo ""
    echo "Examples:"
    echo "  $0                          # Build preview for simulator"
    echo "  $0 -t production -d device  # Build production for device"
    echo "  $0 --submit                 # Build and submit to App Store"
    echo "  $0 -c                       # Clean build"
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v expo >/dev/null 2>&1 || missing_deps+=("expo")
    command -v eas >/dev/null 2>&1 || missing_deps+=("eas")
    
    # Check if running on macOS for iOS development
    if [[ "$OSTYPE" != "darwin"* ]]; then
        log_error "iOS development requires macOS"
        exit 1
    fi
    
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

# Check Apple Developer account setup
check_apple_setup() {
    if [ "$BUILD_TYPE" = "production" ] || [ "$DEVICE_TYPE" = "device" ]; then
        log_step "Checking Apple Developer setup..."
        
        # Check if we have iOS credentials
        if ! eas credentials --platform ios >/dev/null 2>&1; then
            log_warning "iOS credentials not configured"
            log_info "EAS will guide you through credential setup during build"
        else
            log_success "iOS credentials configured"
        fi
    fi
}

# Check Xcode installation (for device builds)
check_xcode() {
    if [ "$DEVICE_TYPE" = "device" ] && [ "$BUILD_TYPE" = "preview" ]; then
        log_step "Checking Xcode installation..."
        
        if ! command -v xcodebuild >/dev/null 2>&1; then
            log_error "Xcode not found. Required for device builds."
            log_info "Please install Xcode from the Mac App Store"
            exit 1
        fi
        
        local xcode_version=$(xcodebuild -version | head -n 1)
        log_success "Found: $xcode_version"
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

# Build the iOS app
build_ios() {
    log_build "Building iOS app..."
    
    local build_command="eas build --platform ios"
    local profile="$BUILD_TYPE"
    
    # Determine profile based on build type and device
    if [ "$BUILD_TYPE" = "preview" ]; then
        if [ "$DEVICE_TYPE" = "simulator" ]; then
            profile="preview"
        else
            profile="preview:device"
        fi
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
    log_info "This may take 10-20 minutes depending on your internet connection..."
    
    # Execute build
    eval "$build_command"
    
    log_success "Build completed!"
}

# Submit to App Store
submit_to_app_store() {
    if [ "$SUBMIT_TO_STORE" = true ] && [ "$BUILD_TYPE" = "production" ]; then
        log_step "Submitting to App Store..."
        
        log_info "Submitting to App Store Connect..."
        eas submit --platform ios --profile production --non-interactive
        
        log_success "Submitted to App Store!"
        log_info "Check App Store Connect for review status"
    fi
}

# Install on simulator (for preview builds)
install_on_simulator() {
    if [ "$BUILD_TYPE" = "preview" ] && [ "$DEVICE_TYPE" = "simulator" ]; then
        log_step "Installing on iOS Simulator..."
        
        # Get the latest build info
        local build_info=$(eas build:list --platform ios --limit 1 --json)
        local build_status=$(echo "$build_info" | jq -r '.[0].status // empty')
        
        if [ "$build_status" != "FINISHED" ]; then
            log_error "Build not finished yet. Status: $build_status"
            return 1
        fi
        
        log_info "Build completed successfully"
        log_info "To install on simulator:"
        echo "  1. Download the .app file from EAS dashboard"
        echo "  2. Drag and drop to iOS Simulator"
        echo "  3. Or use: xcrun simctl install booted path/to/PauseOne.app"
        
    elif [ "$BUILD_TYPE" = "preview" ] && [ "$DEVICE_TYPE" = "device" ]; then
        log_info "Device build completed"
        log_info "Install via TestFlight or Xcode Devices window"
    fi
}

# Show build summary
show_summary() {
    echo ""
    log_success "Build Summary"
    echo ""
    echo "Build type: $BUILD_TYPE"
    echo "Device type: $DEVICE_TYPE"
    echo "Clean build: $CLEAN_BUILD"
    echo "Skip tests: $SKIP_TESTS"
    echo "Submit to store: $SUBMIT_TO_STORE"
    echo ""
    
    if [ "$BUILD_TYPE" = "preview" ]; then
        if [ "$DEVICE_TYPE" = "simulator" ]; then
            echo "Output: .app file (for iOS Simulator)"
            echo "Use case: Development and testing"
        else
            echo "Output: .ipa file (for device testing)"
            echo "Use case: TestFlight or direct device installation"
        fi
    else
        echo "Output: .ipa file (for App Store)"
        echo "Use case: App Store submission"
        if [ "$SUBMIT_TO_STORE" = true ]; then
            echo "Status: Submitted to App Store Connect"
        fi
    fi
    
    echo ""
    echo "Next steps:"
    if [ "$BUILD_TYPE" = "preview" ]; then
        echo "  - Test the app thoroughly"
        echo "  - Share with internal testers"
        echo "  - Report any issues found"
    else
        if [ "$SUBMIT_TO_STORE" = false ]; then
            echo "  - Download IPA from EAS dashboard"
            echo "  - Upload to App Store Connect"
            echo "  - Submit for review"
        else
            echo "  - Monitor App Store Connect for review status"
            echo "  - Respond to any review feedback"
            echo "  - Prepare for app launch"
        fi
    fi
    
    echo ""
    echo "Useful commands:"
    echo "  eas build:list --platform ios     # View build history"
    echo "  eas build:view [build-id]         # View specific build details"
    echo "  eas submit:list --platform ios    # View submission history"
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
            -d|--device)
                DEVICE_TYPE="$2"
                shift 2
                ;;
            -s|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -c|--clean)
                CLEAN_BUILD=true
                shift
                ;;
            --submit)
                SUBMIT_TO_STORE=true
                BUILD_TYPE="production"  # Force production for submission
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
    
    # Validate device type
    case $DEVICE_TYPE in
        "simulator"|"device") ;;
        *)
            log_error "Invalid device type: $DEVICE_TYPE"
            log_info "Valid device types: simulator, device"
            exit 1
            ;;
    esac
    
    # Show configuration
    echo ""
    log_info "iOS Build Configuration:"
    echo "  Build type: $BUILD_TYPE"
    echo "  Device type: $DEVICE_TYPE"
    echo "  Skip tests: $SKIP_TESTS"
    echo "  Clean build: $CLEAN_BUILD"
    echo "  Submit to store: $SUBMIT_TO_STORE"
    echo ""
    
    # Check dependencies
    check_dependencies
    
    # Check authentication
    check_auth
    
    # Check Apple Developer setup
    check_apple_setup
    
    # Check Xcode (if needed)
    check_xcode
    
    # Confirm build
    read -p "Proceed with iOS build? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Aborted by user"
        exit 0
    fi
    
    # Run pre-build checks
    pre_build_checks
    
    # Build iOS app
    build_ios
    
    # Submit to App Store if requested
    submit_to_app_store
    
    # Install on simulator if applicable
    install_on_simulator
    
    # Show summary
    show_summary
}

# Change to project root
cd "$PROJECT_ROOT"

# Run main function
main "$@"
