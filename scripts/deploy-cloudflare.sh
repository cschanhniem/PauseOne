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
PROJECT_NAME="pauseone"
ENVIRONMENT="production"
DRY_RUN=false
SKIP_BUILD=false
SKIP_TESTS=false

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

log_deploy() {
    echo -e "${CYAN}🚀${NC} $1"
}

usage() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Deploy PauseOne to Cloudflare Pages"
    echo ""
    echo "Options:"
    echo "  -p, --project <name>         Cloudflare Pages project name [default: pauseone]"
    echo "  -e, --environment <env>      Environment (production|staging) [default: production]"
    echo "  -s, --skip-build            Skip the build step (use existing dist/)"
    echo "  -t, --skip-tests            Skip running tests"
    echo "  -d, --dry-run               Show what would be deployed without actually deploying"
    echo "  -h, --help                  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Deploy to production"
    echo "  $0 -e staging               # Deploy to staging environment"
    echo "  $0 -s                       # Deploy without rebuilding"
    echo "  $0 --dry-run                # Show deployment plan"
}

# Check if required tools are available
check_dependencies() {
    local missing_deps=()
    
    command -v node >/dev/null 2>&1 || missing_deps+=("node")
    command -v npm >/dev/null 2>&1 || missing_deps+=("npm")
    command -v git >/dev/null 2>&1 || missing_deps+=("git")
    command -v wrangler >/dev/null 2>&1 || missing_deps+=("wrangler")
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        log_info "Please install missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "wrangler") echo "  npm install -g wrangler" ;;
                "node") echo "  Install Node.js from https://nodejs.org/" ;;
                "npm") echo "  npm is included with Node.js" ;;
                "git") echo "  Install git from https://git-scm.com/" ;;
            esac
        done
        exit 1
    fi
}

# Check Wrangler authentication
check_auth() {
    log_step "Checking Cloudflare authentication..."
    
    if ! wrangler whoami >/dev/null 2>&1; then
        log_error "Not authenticated with Cloudflare"
        log_info "Please run: wrangler login"
        exit 1
    fi
    
    local user=$(wrangler whoami 2>/dev/null | grep "You are logged in" | cut -d' ' -f6 || echo "unknown")
    log_success "Authenticated as: $user"
}

# Validate git status
validate_git() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "You have uncommitted changes"
        if [ "$DRY_RUN" = false ]; then
            read -p "Continue with deployment? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log_info "Aborted by user"
                exit 0
            fi
        fi
    fi
    
    # Get current branch and commit
    local branch=$(git rev-parse --abbrev-ref HEAD)
    local commit=$(git rev-parse --short HEAD)
    
    log_info "Branch: $branch"
    log_info "Commit: $commit"
}

# Run pre-deployment checks
pre_deploy_checks() {
    log_step "Running pre-deployment checks..."
    
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
            read -p "Continue with deployment anyway? (y/N): " -n 1 -r
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
        read -p "Continue with deployment anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted due to type errors"
            exit 1
        fi
    fi
}

# Build the application
build_app() {
    if [ "$SKIP_BUILD" = true ]; then
        log_warning "Skipping build step"
        if [ ! -d "dist" ]; then
            log_error "No dist/ directory found. Cannot skip build."
            exit 1
        fi
        return
    fi
    
    log_step "Building application for web..."
    
    # Clean previous build
    rm -rf dist
    
    # Set environment variables
    export NODE_ENV="$ENVIRONMENT"
    export EXPO_PUBLIC_APP_ENV="$ENVIRONMENT"
    
    # Build web bundle
    log_info "Generating web bundle..."
    npm run bundle:web
    
    # Verify build output
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        log_error "Build failed - no dist/index.html found"
        exit 1
    fi
    
    # Show build info
    local build_size=$(du -sh dist | cut -f1)
    log_success "Build completed - Size: $build_size"
}

# Deploy to Cloudflare Pages
deploy_to_cloudflare() {
    log_deploy "Deploying to Cloudflare Pages..."
    
    local deploy_command="wrangler pages deploy dist"
    deploy_command="$deploy_command --project-name=$PROJECT_NAME"
    
    # Add environment-specific settings
    if [ "$ENVIRONMENT" = "staging" ]; then
        deploy_command="$deploy_command --env=staging"
    fi
    
    log_info "Deploy command: $deploy_command"
    
    if [ "$DRY_RUN" = false ]; then
        eval "$deploy_command"
        log_success "Deployment completed!"
        
        # Show deployment URL
        local deployment_url
        if [ "$ENVIRONMENT" = "production" ]; then
            deployment_url="https://$PROJECT_NAME.pages.dev"
        else
            deployment_url="https://$ENVIRONMENT.$PROJECT_NAME.pages.dev"
        fi
        
        log_success "🌐 Deployment URL: $deployment_url"
        
        # Optional: Open in browser
        if command -v open >/dev/null 2>&1; then
            read -p "Open deployment in browser? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                open "$deployment_url"
            fi
        fi
    else
        log_warning "Dry run - would execute: $deploy_command"
    fi
}

# Show deployment summary
show_summary() {
    echo ""
    log_success "Deployment Summary"
    echo ""
    echo "Project: $PROJECT_NAME"
    echo "Environment: $ENVIRONMENT"
    echo "Build directory: ./dist"
    
    if [ "$DRY_RUN" = false ]; then
        echo "Status: ✅ Deployed"
        if [ "$ENVIRONMENT" = "production" ]; then
            echo "URL: https://$PROJECT_NAME.pages.dev"
        else
            echo "URL: https://$ENVIRONMENT.$PROJECT_NAME.pages.dev"
        fi
    else
        echo "Status: 🔍 Dry run completed"
    fi
    
    echo ""
    echo "Next steps:"
    echo "  - Test the deployment thoroughly"
    echo "  - Monitor performance with Cloudflare Analytics"
    echo "  - Set up custom domain if needed"
    echo "  - Configure additional Cloudflare features (caching, security)"
}

# Main execution
main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--project)
                PROJECT_NAME="$2"
                shift 2
                ;;
            -e|--environment)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -s|--skip-build)
                SKIP_BUILD=true
                shift
                ;;
            -t|--skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
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
    
    # Validate environment
    case $ENVIRONMENT in
        "production"|"staging") ;;
        *)
            log_error "Invalid environment: $ENVIRONMENT"
            log_info "Valid environments: production, staging"
            exit 1
            ;;
    esac
    
    # Show configuration
    echo ""
    log_info "Cloudflare Pages Deployment Configuration:"
    echo "  Project: $PROJECT_NAME"
    echo "  Environment: $ENVIRONMENT"
    echo "  Skip build: $SKIP_BUILD"
    echo "  Skip tests: $SKIP_TESTS"
    echo "  Dry run: $DRY_RUN"
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No actual deployment will be performed"
    fi
    
    # Check dependencies
    check_dependencies
    
    # Check authentication
    check_auth
    
    # Validate git status
    validate_git
    
    # Confirm deployment
    if [ "$DRY_RUN" = false ]; then
        read -p "Proceed with deployment? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Aborted by user"
            exit 0
        fi
    fi
    
    # Run pre-deployment checks
    pre_deploy_checks
    
    # Build application
    build_app
    
    # Deploy to Cloudflare Pages
    deploy_to_cloudflare
    
    # Show summary
    show_summary
}

# Change to project root
cd "$PROJECT_ROOT"

# Run main function
main "$@"
