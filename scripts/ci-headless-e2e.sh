#!/bin/bash

# CI Headless E2E Test Script
# This script runs E2E tests in a headless CI environment

set -e

echo "🚀 Starting CI Headless E2E Tests"
echo "=================================="

# Environment info
echo "📊 Environment Information:"
echo "  - CI: ${CI:-'false'}"
echo "  - DISPLAY: ${DISPLAY:-'not set'}"
echo "  - Node: $(node --version)"
echo "  - npm: $(npm --version)"
echo ""

# Check if Xvfb is running
if command -v xdpyinfo &> /dev/null && xdpyinfo -display "${DISPLAY:-:99}" >/dev/null 2>&1; then
    echo "✅ Virtual display is ready: ${DISPLAY:-:99}"
else
    echo "⚠️ Virtual display not detected, but continuing..."
fi

# Set CI-specific environment variables
export CI=true
export NODE_ENV=test
export ELECTRON_DISABLE_SANDBOX=true
export ELECTRON_ENABLE_LOGGING=true

# Additional headless flags for Electron
export ELECTRON_RUN_AS_NODE=false
export ELECTRON_IS_DEV=0

echo "🔧 Preparing E2E environment..."

# Run the enhanced fix script
./scripts/fix-e2e.sh

echo ""
echo "🧪 Running Playwright E2E tests..."
echo "-----------------------------------"

# Run the tests with proper error handling
if npx playwright test; then
    echo ""
    echo "✅ E2E tests completed successfully!"
else
    echo ""
    echo "❌ E2E tests failed!"
    
    # List any generated artifacts for debugging
    if [ -d "test-results" ]; then
        echo ""
        echo "📁 Test artifacts generated:"
        find test-results -type f -name "*.png" -o -name "*.webm" -o -name "*.zip" | head -10
    fi
    
    if [ -d "playwright-report" ]; then
        echo ""
        echo "📊 Playwright report generated in: playwright-report/"
    fi
    
    exit 1
fi

echo ""
echo "🎉 CI Headless E2E Tests Complete!" 