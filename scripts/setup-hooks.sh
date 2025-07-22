#!/bin/bash

# Setup Git Hooks for Quality Control
# This script sets up pre-commit and pre-push hooks

set -e

echo "🔧 Setting up Git hooks for quality control..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️ $1${NC}"
}

# Check if we're in a git repository
if [[ ! -d ".git" ]]; then
    echo "❌ Error: Not a git repository. Please run this script from the project root."
    exit 1
fi

# Create .githooks directory if it doesn't exist
mkdir -p .githooks

# Create pre-commit hook
print_step "Creating pre-commit hook..."
cat > .githooks/pre-commit << 'EOF'
#!/bin/bash

echo "🔍 Running pre-commit quality checks..."

# Run quality check script
if [[ -f "scripts/quality-check.sh" ]]; then
    ./scripts/quality-check.sh
    
    if [[ $? -eq 0 ]]; then
        echo "✅ All quality checks passed. Proceeding with commit."
    else
        echo "❌ Quality checks failed. Commit aborted."
        echo ""
        echo "💡 Fix the issues above and try again."
        echo "   Or run 'git commit --no-verify' to bypass checks (not recommended)."
        exit 1
    fi
else
    echo "⚠️ Quality check script not found. Skipping pre-commit checks."
fi
EOF

# Create pre-push hook
print_step "Creating pre-push hook..."
cat > .githooks/pre-push << 'EOF'
#!/bin/bash

echo "🚀 Running pre-push checks..."

# Get the remote and URL
remote="$1"
url="$2"

# Check if we're pushing to main branch
protected_branch='main'
current_branch=$(git symbolic-ref HEAD | sed 's/refs\/heads\///')

if [[ "$current_branch" == "$protected_branch" ]]; then
    echo "⚠️ Pushing to protected branch '$protected_branch'."
    echo "🔍 Running comprehensive quality checks..."
    
    # Run full quality check including E2E tests
    if command -v npm &> /dev/null; then
        if npm run quality:full; then
            echo "✅ All comprehensive checks passed."
        else
            echo "❌ Comprehensive checks failed."
            echo "💡 Please fix all issues before pushing to $protected_branch"
            echo "   Or use 'git push --no-verify' to bypass (not recommended for main branch)."
            exit 1
        fi
    fi
fi

echo "✅ Pre-push checks completed successfully."
EOF

# Make hooks executable
chmod +x .githooks/pre-commit
chmod +x .githooks/pre-push

# Configure git to use .githooks directory
print_step "Configuring Git to use custom hooks directory..."
git config core.hooksPath .githooks

print_success "Git hooks configured successfully!"

print_info "Hooks installed:"
print_info "  • pre-commit: Runs quality:check before each commit"
print_info "  • pre-push: Runs comprehensive checks before pushing to main"

echo ""
echo "🎯 Usage:"
echo "  • Hooks will run automatically on commit/push"
echo "  • To bypass: use --no-verify flag (not recommended)"
echo "  • To disable: git config core.hooksPath .git/hooks"
echo ""
echo "📝 Files created:"
echo "  • .githooks/pre-commit"
echo "  • .githooks/pre-push"
echo ""
echo "✨ Your development workflow is now protected with quality gates!" 