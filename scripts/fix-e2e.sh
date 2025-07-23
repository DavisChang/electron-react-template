#!/bin/bash

# Enhanced E2E Environment Fix Script
# This script prepares the environment for E2E testing, with CI support

echo "🔧 Fixing E2E test environment..."

# Function to detect CI environment
detect_ci() {
    if [[ "$CI" == "true" ]] || [[ -n "$GITHUB_ACTIONS" ]] || [[ -n "$CONTINUOUS_INTEGRATION" ]]; then
        return 0  # Is CI
    else
        return 1  # Not CI
    fi
}

# Function to setup virtual display for CI
setup_virtual_display() {
    echo "🖥️ Setting up virtual display for CI..."
    
    # Check if DISPLAY is already set
    if [[ -n "$DISPLAY" ]]; then
        echo "✅ Display already configured: $DISPLAY"
        return 0
    fi
    
    # Set default display
    export DISPLAY=:99
    echo "✅ Display configured: $DISPLAY"
    
    # Verify Xvfb is available (should be installed in CI workflow)
    if command -v Xvfb &> /dev/null; then
        echo "✅ Xvfb found, virtual display should be available"
    else
        echo "⚠️ Xvfb not found, but continuing (may be handled by CI)"
    fi
}

# Cleanup function
cleanup_processes() {
    echo "▶ Cleaning up existing Electron processes..."
    
    # Kill any existing Electron processes (more gentle approach for CI)
    if detect_ci; then
        # In CI, be more careful with process cleanup
        pkill -f "electron" 2>/dev/null || true
        pkill -f "Electron" 2>/dev/null || true
    else
        # Local development - more aggressive cleanup
        killall Electron 2>/dev/null || true
        killall electron 2>/dev/null || true
        pkill -f "electron" 2>/dev/null || true
        pkill -f "Electron" 2>/dev/null || true
    fi
    
    # Wait for processes to clean up
    sleep 1
    echo "✅ Process cleanup completed"
}

# Main execution
main() {
    # Detect environment
    if detect_ci; then
        echo "🤖 CI environment detected"
        setup_virtual_display
    else
        echo "💻 Local development environment detected"
    fi
    
    # Common cleanup steps
    cleanup_processes
    
    # Cleanup singleton lock files
    echo "▶ Cleaning up singleton lock files..."
    rm -rf /tmp/.X*-lock 2>/dev/null || true
    rm -rf /tmp/.org.chromium.* 2>/dev/null || true
    rm -rf ~/.config/Electron 2>/dev/null || true
    
    # Clean up test artifacts
    echo "▶ Cleaning up test artifacts..."
    rm -rf test-results/ 2>/dev/null || true
    rm -rf playwright-report/ 2>/dev/null || true
    echo "✅ Test artifacts cleaned"
    
    # Check if application is built
    echo "▶ Checking application build..."
    if [[ -d "dist" ]] && [[ -d "dist-electron" ]]; then
        echo "✅ Application already built"
    else
        echo "⚠️ Application not built, building now..."
        npm run build
        if [[ $? -eq 0 ]]; then
            echo "✅ Application built successfully"
        else
            echo "❌ Application build failed"
            exit 1
        fi
    fi
    
    # Wait for system to stabilize (longer in CI)
    if detect_ci; then
        echo "▶ Waiting for CI system to stabilize..."
        sleep 5
    else
        echo "▶ Waiting for system to stabilize..."
        sleep 2
    fi
    
    echo "✅ System ready"
    echo ""
    echo "🎯 E2E test environment is now ready!"
    echo ""
    
    if detect_ci; then
        echo "🤖 CI Environment Info:"
        echo "  - Display: ${DISPLAY:-'Not set'}"
        echo "  - CI: ${CI:-'Not set'}"
        echo "  - GitHub Actions: ${GITHUB_ACTIONS:-'Not set'}"
    else
        echo "💻 Local Environment Info:"
        echo "  - Display: ${DISPLAY:-'System default'}"
    fi
    
    echo ""
    echo "You can now run:"
    if detect_ci; then
        echo "  npm run test:e2e:ci"
    else
        echo "  npm run test:e2e"
    fi
    echo ""
    
    if ! detect_ci; then
        echo "If you still encounter issues, try:"
        echo "  1. Close any open Electron apps manually"
        echo "  2. Restart your terminal"
        echo "  3. Run this script again"
    fi
}

# Execute main function
main "$@" 