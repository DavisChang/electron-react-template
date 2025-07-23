#!/bin/bash

# Comprehensive Code Analysis Script
# This script provides detailed code metrics and analysis

set -e

echo "📊 Starting comprehensive code analysis..."

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

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Create analysis output directory
mkdir -p analysis-reports

print_header "🔍 CODE ANALYSIS REPORT"
echo "Generated on: $(date)"
echo "Project: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "Version: $(grep '"version"' package.json | cut -d'"' -f4)"
echo ""

# 1. Project Statistics
print_header "📈 PROJECT STATISTICS"

# Count files by type
print_step "Counting source files..."
TS_FILES=$(find src electron -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
JS_FILES=$(find src electron -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l)
TEST_FILES=$(find . -name "*.test.*" -o -name "*.spec.*" 2>/dev/null | wc -l)
CONFIG_FILES=$(find . -maxdepth 2 -name "*.config.*" 2>/dev/null | wc -l)

echo "📄 Source Files:"
echo "   TypeScript files: $TS_FILES"
echo "   JavaScript files: $JS_FILES"
echo "   Test files: $TEST_FILES"  
echo "   Config files: $CONFIG_FILES"

# Count lines of code
print_step "Analyzing lines of code..."
if command -v cloc &> /dev/null; then
    echo ""
    cloc src electron --exclude-dir=node_modules,dist,coverage --quiet
else
    # Fallback method without cloc
    TOTAL_LINES=$(find src electron -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
    echo "   Total lines of code: $TOTAL_LINES"
fi

echo ""

# 2. Code Quality Metrics
print_header "🎯 CODE QUALITY METRICS"

# Run ESLint analysis
print_step "Running ESLint analysis..."
if npm run lint > analysis-reports/eslint-report.txt 2>&1; then
    print_success "ESLint: No issues found"
else
    ESLINT_ERRORS=$(grep -c "error" analysis-reports/eslint-report.txt 2>/dev/null || echo "0")
    ESLINT_WARNINGS=$(grep -c "warning" analysis-reports/eslint-report.txt 2>/dev/null || echo "0")
    print_warning "ESLint: $ESLINT_ERRORS errors, $ESLINT_WARNINGS warnings"
fi

# TypeScript compilation check
print_step "Checking TypeScript compilation..."
if npm run typecheck:web > /dev/null 2>&1 && npm run typecheck:node > /dev/null 2>&1; then
    print_success "TypeScript: Compilation successful"
else
    print_warning "TypeScript: Compilation issues found"
fi

echo ""

# 3. Test Coverage Analysis
print_header "🧪 TEST COVERAGE ANALYSIS"

print_step "Generating test coverage report..."
if npm run test:coverage > analysis-reports/coverage-report.txt 2>&1; then
    # Extract coverage metrics
    if [[ -f "coverage/lcov.info" ]]; then
        if command -v lcov &> /dev/null; then
            COVERAGE_SUMMARY=$(lcov --summary coverage/lcov.info 2>/dev/null)
            
            LINES_COVERED=$(echo "$COVERAGE_SUMMARY" | grep "lines" | grep -o '[0-9]\+\.[0-9]\+%' | head -1)
            FUNCTIONS_COVERED=$(echo "$COVERAGE_SUMMARY" | grep "functions" | grep -o '[0-9]\+\.[0-9]\+%' | head -1)
            BRANCHES_COVERED=$(echo "$COVERAGE_SUMMARY" | grep "branches" | grep -o '[0-9]\+\.[0-9]\+%' | head -1)
            
            echo "📊 Coverage Summary:"
            echo "   Lines: ${LINES_COVERED:-N/A}"
            echo "   Functions: ${FUNCTIONS_COVERED:-N/A}"
            echo "   Branches: ${BRANCHES_COVERED:-N/A}"
            
            # Coverage grade
            LINES_NUM=$(echo $LINES_COVERED | grep -o '[0-9]\+\.[0-9]\+' | head -1)
            if (( $(echo "$LINES_NUM >= 80" | bc -l 2>/dev/null || echo "0") )); then
                print_success "Coverage Grade: Excellent (≥80%)"
            elif (( $(echo "$LINES_NUM >= 60" | bc -l 2>/dev/null || echo "0") )); then
                print_warning "Coverage Grade: Good (60-79%)"
            else
                print_warning "Coverage Grade: Needs Improvement (<60%)"
            fi
        fi
        
        # Test count
        TEST_COUNT=$(grep -c "✓\|PASS" analysis-reports/coverage-report.txt 2>/dev/null || echo "0")
        echo "   Total tests: $TEST_COUNT"
        
        print_success "Coverage report generated: coverage/lcov-report/index.html"
    fi
else
    print_warning "Failed to generate coverage report"
fi

echo ""

# 4. Dependency Analysis
print_header "📦 DEPENDENCY ANALYSIS"

print_step "Analyzing dependencies..."
TOTAL_DEPS=$(npm list --depth=0 --json 2>/dev/null | jq '.dependencies | length' 2>/dev/null || echo "N/A")
DEV_DEPS=$(npm list --depth=0 --json --dev 2>/dev/null | jq '.dependencies | length' 2>/dev/null || echo "N/A")

echo "📦 Dependency Count:"
echo "   Production dependencies: $TOTAL_DEPS"
echo "   Development dependencies: $DEV_DEPS"

# Security audit
print_step "Running security audit..."
if npm audit --json > analysis-reports/security-audit.json 2>/dev/null; then
    if command -v jq &> /dev/null; then
        VULNERABILITIES=$(jq '.metadata.vulnerabilities.total' analysis-reports/security-audit.json 2>/dev/null || echo "0")
        if [[ "$VULNERABILITIES" == "0" ]]; then
            print_success "Security: No vulnerabilities found"
        else
            print_warning "Security: $VULNERABILITIES vulnerabilities found"
        fi
    else
        print_info "Security audit completed (install jq for detailed analysis)"
    fi
else
    print_info "Security audit skipped"
fi

echo ""

# 5. Build Analysis
print_header "🏗️ BUILD ANALYSIS"

print_step "Analyzing build process..."
BUILD_START=$(date +%s)
if npm run build > analysis-reports/build-log.txt 2>&1; then
    BUILD_END=$(date +%s)
    BUILD_TIME=$((BUILD_END - BUILD_START))
    print_success "Build: Successful (${BUILD_TIME}s)"
    
    # Analyze build output size
    if [[ -d "dist" ]]; then
        DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
        echo "   Build output size: $DIST_SIZE"
    fi
    if [[ -d "dist-electron" ]]; then
        ELECTRON_SIZE=$(du -sh dist-electron 2>/dev/null | cut -f1)
        echo "   Electron output size: $ELECTRON_SIZE"
    fi
    
    # Clean up build artifacts
    rm -rf dist dist-electron
else
    print_warning "Build: Failed"
fi

echo ""

# 6. Complexity Analysis (if available)
print_header "🔍 COMPLEXITY ANALYSIS"

print_step "Analyzing code complexity..."
COMPLEX_FILES=()

# Find files with potential complexity issues
while IFS= read -r -d '' file; do
    if [[ -f "$file" ]]; then
        # Simple heuristic: files with many lines might be complex
        LINES=$(wc -l < "$file" 2>/dev/null || echo "0")
        if [[ "$LINES" -gt 200 ]]; then
            COMPLEX_FILES+=("$file ($LINES lines)")
        fi
    fi
done < <(find src electron -name "*.ts" -o -name "*.tsx" -print0 2>/dev/null)

if [[ ${#COMPLEX_FILES[@]} -gt 0 ]]; then
    print_warning "Files with high line count (>200 lines):"
    for file in "${COMPLEX_FILES[@]}"; do
        echo "     $file"
    done
else
    print_success "All files are reasonably sized"
fi

echo ""

# 7. Git Analysis
print_header "📈 GIT REPOSITORY ANALYSIS"

print_step "Analyzing git repository..."
if [[ -d ".git" ]]; then
    TOTAL_COMMITS=$(git rev-list --count HEAD 2>/dev/null || echo "N/A")
    CONTRIBUTORS=$(git log --format='%ae' | sort -u | wc -l 2>/dev/null || echo "N/A")
    LAST_COMMIT=$(git log -1 --format='%cr' 2>/dev/null || echo "N/A")
    
    echo "📊 Repository Stats:"
    echo "   Total commits: $TOTAL_COMMITS"
    echo "   Contributors: $CONTRIBUTORS"
    echo "   Last commit: $LAST_COMMIT"
    
    # Recent activity
    COMMITS_LAST_WEEK=$(git log --since="1 week ago" --oneline | wc -l 2>/dev/null || echo "0")
    echo "   Commits last week: $COMMITS_LAST_WEEK"
fi

echo ""

# 8. Generate Summary Report
print_header "📋 ANALYSIS SUMMARY"

# Create comprehensive report
cat > analysis-reports/summary.md << EOF
# Code Analysis Summary

**Generated:** $(date)
**Project:** $(grep '"name"' package.json | cut -d'"' -f4)
**Version:** $(grep '"version"' package.json | cut -d'"' -f4)

## Overview
- TypeScript files: $TS_FILES
- JavaScript files: $JS_FILES  
- Test files: $TEST_FILES
- Test coverage: $LINES_COVERED
- Total dependencies: $TOTAL_DEPS

## Quality Status
- ESLint: $(if npm run lint > /dev/null 2>&1; then echo "✅ Passed"; else echo "⚠️ Issues found"; fi)
- TypeScript: $(if npm run typecheck:web > /dev/null 2>&1 && npm run typecheck:node > /dev/null 2>&1; then echo "✅ Compiled"; else echo "⚠️ Errors found"; fi) 
- Build: $(if npm run build > /dev/null 2>&1; then echo "✅ Successful"; else echo "❌ Failed"; fi)
- Security: $(if [[ "$VULNERABILITIES" == "0" ]]; then echo "✅ No issues"; else echo "⚠️ $VULNERABILITIES issues"; fi)

## Recommendations
- Maintain test coverage above 80%
- Keep files under 300 lines
- Regular dependency updates
- Address any ESLint warnings

---
*Analysis completed by quality-check system*
EOF

print_success "Summary report generated: analysis-reports/summary.md"

# 9. Recommendations
print_header "💡 RECOMMENDATIONS"

echo "Based on the analysis, here are some recommendations:"
echo ""

# Coverage recommendations
LINES_NUM=$(echo $LINES_COVERED | grep -o '[0-9]\+\.[0-9]\+' | head -1 2>/dev/null || echo "0")
if (( $(echo "$LINES_NUM < 80" | bc -l 2>/dev/null || echo "1") )); then
    echo "🎯 Improve test coverage (current: $LINES_COVERED, target: ≥80%)"
fi

# Dependency recommendations
if [[ "$VULNERABILITIES" != "0" && "$VULNERABILITIES" != "N/A" ]]; then
    echo "🔒 Address security vulnerabilities: npm audit fix"
fi

# File size recommendations
if [[ ${#COMPLEX_FILES[@]} -gt 0 ]]; then
    echo "📏 Consider refactoring large files (>200 lines)"
fi

echo "📚 Review documentation: docs/QUALITY_CONTROL_SYSTEM_OVERVIEW.md"
echo "🚀 Run quality checks: npm run quality:check"
echo "📊 View coverage report: open coverage/lcov-report/index.html"

echo ""
print_success "Analysis complete! Check analysis-reports/ for detailed reports."

echo ""
print_header "🎉 ANALYSIS COMPLETE"
echo "View detailed reports in the analysis-reports/ directory"
echo "Next steps:"
echo "  1. Review coverage report: open coverage/lcov-report/index.html"
echo "  2. Check ESLint issues: cat analysis-reports/eslint-report.txt"
echo "  3. Review summary: cat analysis-reports/summary.md"
echo "  4. Run quality checks: npm run quality:check" 