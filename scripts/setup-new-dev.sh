#!/bin/bash

# New Developer Setup Script
# Complete onboarding for new team members

set -e

echo "🚀 Welcome to Electron React Template!"
echo "This script will set up your development environment with quality controls."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}${1}${NC}"
    echo -e "${PURPLE}$(printf '=%.0s' {1..50})${NC}"
}

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_header "🎯 NEW DEVELOPER ONBOARDING"

# Project information
PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
PROJECT_VERSION=$(grep '"version"' package.json | cut -d'"' -f4)

echo "Project: $PROJECT_NAME"
echo "Version: $PROJECT_VERSION"
echo "Setup Date: $(date)"
echo ""

# 1. Prerequisites Check
print_header "🔍 PREREQUISITES CHECK"

print_step "Checking required tools..."

# Node.js version check
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
    
    # Check if version is adequate (v16+)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [[ $NODE_MAJOR -lt 16 ]]; then
        print_warning "Node.js version 16+ recommended (current: $NODE_VERSION)"
    fi
else
    print_error "Node.js not found. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# npm version check
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm: v$NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Git check
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "$GIT_VERSION"
    
    # Check git config
    GIT_USER=$(git config user.name 2>/dev/null || echo "")
    GIT_EMAIL=$(git config user.email 2>/dev/null || echo "")
    
    if [[ -z "$GIT_USER" || -z "$GIT_EMAIL" ]]; then
        print_warning "Git user information not configured"
        echo "Please run:"
        echo "  git config --global user.name 'Your Name'"
        echo "  git config --global user.email 'your.email@company.com'"
    else
        print_info "Git user: $GIT_USER <$GIT_EMAIL>"
    fi
else
    print_error "Git not found. Please install Git"
    exit 1
fi

# Optional tools check
print_step "Checking optional tools..."

if command -v code &> /dev/null; then
    print_success "VS Code found"
    VSCODE_AVAILABLE=true
else
    print_info "VS Code not found (recommended for development)"
    VSCODE_AVAILABLE=false
fi

if command -v cloc &> /dev/null; then
    print_success "cloc found (for code analysis)"
else
    print_info "cloc not found (optional, for advanced code metrics)"
fi

echo ""

# 2. Project Setup
print_header "📦 PROJECT SETUP"

print_step "Installing project dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

print_step "Running post-install setup..."
if npm run postinstall; then
    print_success "Post-install completed"
else
    print_warning "Post-install had issues (this may be normal)"
fi

echo ""

# 3. Quality Control Setup  
print_header "🛡️ QUALITY CONTROL SETUP"

print_step "Setting up Git hooks..."
if chmod +x scripts/setup-hooks.sh && ./scripts/setup-hooks.sh; then
    print_success "Git hooks configured"
else
    print_error "Failed to setup Git hooks"
    exit 1
fi

print_step "Validating ESLint configuration..."
if npm run lint > /dev/null 2>&1; then
    print_success "ESLint configuration valid"
else
    print_warning "ESLint found issues (will be addressed in quality check)"
fi

print_step "Checking TypeScript configuration..."
if npm run typecheck:web > /dev/null 2>&1 && npm run typecheck:node > /dev/null 2>&1; then
    print_success "TypeScript configuration valid"
else
    print_warning "TypeScript configuration issues detected"
fi

print_step "Running initial quality check..."
if ./scripts/quality-check.sh; then
    print_success "Initial quality check passed"
else
    print_warning "Quality check found issues - this is normal for initial setup"
fi

echo ""

# 4. VS Code Integration (if available)
if [[ "$VSCODE_AVAILABLE" == "true" ]]; then
    print_header "🔧 VS CODE INTEGRATION"
    
    print_step "Installing recommended VS Code extensions..."
    
    # Read recommended extensions from .vscode/extensions.json
    if [[ -f ".vscode/extensions.json" ]]; then
        EXTENSIONS=$(grep -o '"[^"]*"' .vscode/extensions.json | sed 's/"//g' | grep -v recommendations)
        
        for ext in $EXTENSIONS; do
            if code --list-extensions | grep -q "$ext"; then
                print_info "Extension already installed: $ext"
            else
                print_step "Installing: $ext"
                if code --install-extension "$ext" > /dev/null 2>&1; then
                    print_success "Installed: $ext"
                else
                    print_warning "Failed to install: $ext"
                fi
            fi
        done
    fi
    
    print_step "Configuring VS Code settings..."
    if [[ -f ".vscode/settings.json" ]]; then
        print_success "VS Code settings configured"
    else
        print_warning "VS Code settings not found"
    fi
    
    echo ""
fi

# 5. Documentation Overview
print_header "📚 DOCUMENTATION OVERVIEW"

print_step "Available documentation:"
echo ""

DOCS_FILES=(
    "docs/QUALITY_CONTROL_SYSTEM_OVERVIEW.md:Complete system overview"
    "docs/DEVELOPMENT_GUIDELINES.md:Development standards and workflows"
    "docs/TYPESCRIPT_CODING_STANDARDS.md:TypeScript coding standards"
    "docs/SONARQUBE_SETUP.md:SonarQube configuration guide"
    "docs/BRANCH_PROTECTION_SETUP.md:GitHub branch protection setup"
)

for doc in "${DOCS_FILES[@]}"; do
    FILE=$(echo $doc | cut -d':' -f1)
    DESC=$(echo $doc | cut -d':' -f2)
    if [[ -f "$FILE" ]]; then
        print_success "$DESC: $FILE"
    else
        print_warning "Missing: $FILE"
    fi
done

echo ""

# 6. Quick Start Guide
print_header "🚀 QUICK START GUIDE"

cat << EOF
You're all set! Here's how to get started:

📝 Essential Commands:
   npm run dev              - Start development server
   npm run quality:check    - Run comprehensive quality checks
   npm run test:unit        - Run unit tests
   npm run test:e2e         - Run end-to-end tests
   npm run format           - Format code with Prettier
   npm run lint:fix         - Fix ESLint issues automatically

🔍 Quality Control:
   - Pre-commit hooks will run quality checks automatically
   - Pre-push hooks prevent pushing poor quality code to main
   - SonarQube analysis runs on every PR
   - Coverage reports are generated with each test run

📖 Development Workflow:
   1. Create feature branch: git checkout -b feature/your-feature
   2. Make changes and commit regularly
   3. Run quality checks: npm run quality:check
   4. Push and create PR when ready
   5. Address any SonarQube feedback
   6. Get code review approval
   7. Merge to main

🎯 Quality Standards:
   - Minimum 80% test coverage required
   - No 'any' types allowed in TypeScript
   - ESLint strict rules enforced
   - Maximum function complexity: 10
   - Maximum file length: 300 lines

📚 Key Documentation:
   - System Overview: docs/QUALITY_CONTROL_SYSTEM_OVERVIEW.md
   - Coding Standards: docs/TYPESCRIPT_CODING_STANDARDS.md
   - Development Guide: docs/DEVELOPMENT_GUIDELINES.md

🆘 Need Help?
   - Check documentation in docs/ folder
   - Review error messages from quality tools
   - Ask team members for guidance
   - Refer to SonarCloud dashboard for quality insights

EOF

# 7. Final Validation
print_header "✅ FINAL VALIDATION"

print_step "Running final system check..."

CHECKS_PASSED=0
TOTAL_CHECKS=5

# Check 1: Dependencies
if [[ -d "node_modules" ]] && [[ -f "package-lock.json" ]]; then
    print_success "Dependencies: Installed"
    ((CHECKS_PASSED++))
else
    print_error "Dependencies: Issues found"
fi

# Check 2: Git hooks
if [[ -f ".githooks/pre-commit" ]] && [[ -x ".githooks/pre-commit" ]]; then
    print_success "Git hooks: Configured"
    ((CHECKS_PASSED++))
else
    print_error "Git hooks: Not configured"
fi

# Check 3: VS Code (if available)
if [[ "$VSCODE_AVAILABLE" == "true" ]] && [[ -f ".vscode/settings.json" ]]; then
    print_success "VS Code: Configured"
    ((CHECKS_PASSED++))
elif [[ "$VSCODE_AVAILABLE" == "false" ]]; then
    print_info "VS Code: Not available (skipped)"
    ((CHECKS_PASSED++))
else
    print_warning "VS Code: Partially configured"
fi

# Check 4: Build system
if npm run build > /dev/null 2>&1; then
    print_success "Build system: Working"
    ((CHECKS_PASSED++))
else
    print_error "Build system: Issues found"
fi

# Check 5: Documentation
if [[ -f "docs/QUALITY_CONTROL_SYSTEM_OVERVIEW.md" ]]; then
    print_success "Documentation: Available"
    ((CHECKS_PASSED++))
else
    print_error "Documentation: Missing"
fi

echo ""
print_header "🎉 SETUP COMPLETE"

if [[ $CHECKS_PASSED -eq $TOTAL_CHECKS ]]; then
    print_success "All systems ready! ($CHECKS_PASSED/$TOTAL_CHECKS checks passed)"
    echo ""
    echo "🎯 You're ready to start developing with confidence!"
    echo "🏆 This project maintains enterprise-grade quality standards."
    echo ""
    echo "Next steps:"
    echo "  1. Read docs/DEVELOPMENT_GUIDELINES.md"
    echo "  2. Try: npm run dev"
    echo "  3. Run: npm run quality:check"
    echo "  4. Create your first feature branch"
else
    print_warning "Setup completed with some issues ($CHECKS_PASSED/$TOTAL_CHECKS checks passed)"
    echo ""
    echo "Please address the issues above before starting development."
fi

# Create setup completion marker
echo "Setup completed on $(date)" > .dev-setup-complete
echo "User: $(whoami)" >> .dev-setup-complete
echo "Git user: $GIT_USER <$GIT_EMAIL>" >> .dev-setup-complete
echo "Node version: $NODE_VERSION" >> .dev-setup-complete
echo "Checks passed: $CHECKS_PASSED/$TOTAL_CHECKS" >> .dev-setup-complete

print_info "Setup completion logged to .dev-setup-complete" 