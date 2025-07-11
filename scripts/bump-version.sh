#!/bin/bash

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PACKAGE_JSON="$PROJECT_ROOT/package.json"
APP_JSON="$PROJECT_ROOT/app.json"

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

usage() {
    echo "Usage: $0 <bump_type> [options]"
    echo ""
    echo "Bump types:"
    echo "  patch    - Increment patch version (x.y.Z)"
    echo "  minor    - Increment minor version (x.Y.0)"
    echo "  major    - Increment major version (X.0.0)"
    echo "  <version>- Set specific version (e.g., 1.2.3)"
    echo ""
    echo "Options:"
    echo "  --dry-run    Show what would be changed without making changes"
    echo "  --no-commit  Don't commit changes or create git tag"
    echo "  --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 patch"
    echo "  $0 minor --dry-run"
    echo "  $0 1.2.3 --no-commit"
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v git >/dev/null 2>&1 || missing_deps+=("git")
    command -v jq >/dev/null 2>&1 || missing_deps+=("jq")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "jq") echo "  brew install jq" ;;
                "node") echo "  Install Node.js from https://nodejs.org/" ;;
                "npm") echo "  npm is included with Node.js" ;;
                "git") echo "  Install git from https://git-scm.com/" ;;
            esac
        done
        exit 1
    fi
}

# Validate that we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "You have uncommitted changes. Consider committing them first."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted by user"
            exit 0
        fi
    fi
}

# Get current version from package.json
get_current_version() {
    if [ ! -f "$PACKAGE_JSON" ]; then
        log_error "package.json not found at $PACKAGE_JSON"
        exit 1
    fi
    
    jq -r '.version' "$PACKAGE_JSON"
}

# Calculate new version based on bump type
calculate_new_version() {
    local current_version="$1"
    local bump_type="$2"
    
    # If bump_type looks like a version number, use it directly
    if [[ $bump_type =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$bump_type"
        return
    fi
    
    # Parse current version
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $bump_type in
        "patch")
            echo "$major.$minor.$((patch + 1))"
            ;;
        "minor")
            echo "$major.$((minor + 1)).0"
            ;;
        "major")
            echo "$((major + 1)).0.0"
            ;;
        *)
            log_error "Invalid bump type: $bump_type"
            usage
            exit 1
            ;;
    esac
}

# Get current build numbers
get_build_numbers() {
    local ios_build_number=""
    local android_version_code=""
    
    # Get iOS build number if it exists
    if jq -e '.expo.ios.buildNumber' "$APP_JSON" >/dev/null 2>&1; then
        ios_build_number=$(jq -r '.expo.ios.buildNumber // "1"' "$APP_JSON")
    else
        ios_build_number="1"
    fi
    
    # Get Android version code if it exists
    if jq -e '.expo.android.versionCode' "$APP_JSON" >/dev/null 2>&1; then
        android_version_code=$(jq -r '.expo.android.versionCode // 1' "$APP_JSON")
    else
        android_version_code="1"
    fi
    
    echo "$ios_build_number $android_version_code"
}

# Update package.json version
update_package_json() {
    local new_version="$1"
    local temp_file=$(mktemp)
    
    jq --arg version "$new_version" '.version = $version' "$PACKAGE_JSON" > "$temp_file"
    mv "$temp_file" "$PACKAGE_JSON"
    
    log_success "Updated package.json version to $new_version"
}

# Update app.json version and build numbers
update_app_json() {
    local new_version="$1"
    local new_ios_build="$2"
    local new_android_version="$3"
    local temp_file=$(mktemp)
    
    # Update version and build numbers
    jq --arg version "$new_version" \
       --arg ios_build "$new_ios_build" \
       --argjson android_version "$new_android_version" \
       '.version = $version | 
        .expo.ios.buildNumber = $ios_build | 
        .expo.android.versionCode = $android_version' \
       "$APP_JSON" > "$temp_file"
    
    mv "$temp_file" "$APP_JSON"
    
    log_success "Updated app.json version to $new_version"
    log_success "Updated iOS build number to $new_ios_build"
    log_success "Updated Android version code to $new_android_version"
}

# Create git commit and tag
create_git_commit() {
    local new_version="$1"
    
    git add "$PACKAGE_JSON" "$APP_JSON"
    git commit -m "chore: bump version to $new_version"
    git tag -a "v$new_version" -m "Version $new_version"
    
    log_success "Created git commit and tag v$new_version"
}

# Main execution
main() {
    local bump_type=""
    local dry_run=false
    local no_commit=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                dry_run=true
                shift
                ;;
            --no-commit)
                no_commit=true
                shift
                ;;
            --help|-h)
                usage
                exit 0
                ;;
            -*)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
            *)
                if [ -z "$bump_type" ]; then
                    bump_type="$1"
                else
                    log_error "Too many arguments"
                    usage
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # Validate arguments
    if [ -z "$bump_type" ]; then
        log_error "Bump type is required"
        usage
        exit 1
    fi
    
    # Check dependencies and git status
    check_dependencies
    if [ "$no_commit" = false ]; then
        check_git_repo
    fi
    
    # Get current state
    local current_version
    current_version=$(get_current_version)
    log_info "Current version: $current_version"
    
    local new_version
    new_version=$(calculate_new_version "$current_version" "$bump_type")
    log_info "New version: $new_version"
    
    # Get and calculate build numbers
    read -r current_ios_build current_android_version <<< "$(get_build_numbers)"
    local new_ios_build=$((current_ios_build + 1))
    local new_android_version=$((current_android_version + 1))
    
    # Show what will be changed
    echo ""
    log_info "Changes to be made:"
    echo "  package.json version: $current_version → $new_version"
    echo "  app.json version: $(jq -r '.version' "$APP_JSON") → $new_version"
    echo "  iOS build number: $current_ios_build → $new_ios_build"
    echo "  Android version code: $current_android_version → $new_android_version"
    
    if [ "$dry_run" = true ]; then
        log_warning "Dry run mode - no changes made"
        exit 0
    fi
    
    # Confirm changes
    echo ""
    read -p "Proceed with version bump? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Aborted by user"
        exit 0
    fi
    
    # Make the changes
    echo ""
    log_info "Updating version files..."
    
    update_package_json "$new_version"
    update_app_json "$new_version" "$new_ios_build" "$new_android_version"
    
    if [ "$no_commit" = false ]; then
        log_info "Creating git commit and tag..."
        create_git_commit "$new_version"
        
        echo ""
        log_success "Version bump complete!"
        log_info "Don't forget to push your changes:"
        echo "  git push origin main --tags"
    else
        echo ""
        log_success "Version bump complete!"
        log_warning "No git commit created (--no-commit flag used)"
    fi
}

# Run main function
main "$@" 