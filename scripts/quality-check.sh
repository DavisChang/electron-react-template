#!/bin/bash

# SonarQube Quality Check Script
# This script runs comprehensive quality checks before committing code

set -e

echo "🔍 Starting comprehensive code quality checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
    print_step "Installing dependencies..."
    npm ci
fi

# 1. Linting
print_step "Running ESLint..."
if npm run lint; then
    print_success "ESLint passed"
else
    print_error "ESLint failed. Please fix linting issues."
    exit 1
fi

# 2. Type checking
print_step "Running TypeScript type checking..."
if npm run typecheck:web && npm run typecheck:node; then
    print_success "Type checking passed"
else
    print_error "Type checking failed. Please fix type errors."
    exit 1
fi

# 3. Unit tests with coverage
print_step "Running unit tests with coverage..."
if npm run test:coverage; then
    print_success "Unit tests passed with coverage generated"
    
    # Check coverage file exists
    if [[ -f "coverage/lcov.info" ]]; then
        print_success "Coverage report generated successfully"
        
        # Extract coverage percentage (if available)
        if command -v lcov &> /dev/null; then
            COVERAGE=$(lcov --summary coverage/lcov.info 2>/dev/null | grep "lines" | grep -o '[0-9]\+\.[0-9]\+%' | head -1)
            if [[ -n "$COVERAGE" ]]; then
                print_success "Current test coverage: $COVERAGE"
                
                # Extract numeric value for comparison
                COVERAGE_NUM=$(echo $COVERAGE | grep -o '[0-9]\+\.[0-9]\+')
                THRESHOLD=80.0
                
                if (( $(echo "$COVERAGE_NUM >= $THRESHOLD" | bc -l) )); then
                    print_success "Coverage meets threshold ($THRESHOLD%)"
                else
                    print_warning "Coverage ($COVERAGE_NUM%) is below threshold ($THRESHOLD%)"
                    print_warning "Consider adding more tests to improve coverage"
                fi
            fi
        fi
    else
        print_warning "Coverage report not found"
    fi
else
    print_error "Unit tests failed. Please fix failing tests."
    exit 1
fi

# 4. Build check
print_step "Checking if project builds successfully..."
if npm run build > /dev/null 2>&1; then
    print_success "Build completed successfully"
else
    print_error "Build failed. Please fix build issues."
    exit 1
fi

# 5. E2E tests (optional, only if we're not in CI)
if [[ -z "$CI" ]]; then
    print_step "Running E2E tests (optional)..."
    
    # Check if Electron processes need cleanup first
    if ! npm run test:e2e > /dev/null 2>&1; then
        print_warning "E2E tests failed, attempting process cleanup..."
        if ./scripts/fix-e2e.sh > /dev/null 2>&1; then
            print_info "Process cleanup completed, retrying E2E tests..."
            if npm run test:e2e > /dev/null 2>&1; then
                print_success "E2E tests passed after cleanup"
            else
                print_warning "E2E tests still failing. Run 'npm run fix:e2e' manually if needed."
            fi
        else
            print_warning "E2E tests failed. This won't block the quality check."
        fi
    else
        print_success "E2E tests passed"
    fi
fi

# Clean up build artifacts after all tests complete
print_step "Cleaning up build artifacts..."
rm -rf dist dist-electron
print_success "Build artifacts cleaned up"

# 6. SonarQube local analysis (if sonar-scanner is available)
if command -v sonar-scanner &> /dev/null; then
    print_step "Running local SonarQube analysis..."
    if sonar-scanner > /dev/null 2>&1; then
        print_success "Local SonarQube analysis completed"
    else
        print_warning "Local SonarQube analysis failed. Check SonarCloud for full analysis."
    fi
else
    print_warning "sonar-scanner not found. Install it globally for local analysis:"
    print_warning "npm install -g sonarqube-scanner"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 All quality checks passed!${NC}"
echo ""
echo "📊 Quality Summary:"
echo "   ✅ Linting: Passed"
echo "   ✅ Type checking: Passed"
echo "   ✅ Unit tests: Passed"
echo "   ✅ Coverage: Generated"
echo "   ✅ Build: Successful"
echo ""
echo "🚀 Your code is ready for commit and push!"
echo ""
echo "💡 Next steps:"
echo "   1. git add ."
echo "   2. git commit -m 'your commit message'"
echo "   3. git push origin your-branch-name"
echo ""
echo "📈 View full analysis: https://sonarcloud.io/project/overview?id=DavisChang_electron-react-template" 