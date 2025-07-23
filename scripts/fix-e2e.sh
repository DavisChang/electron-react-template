#!/bin/bash

# Fix E2E Test Issues Script
# This script cleans up Electron processes and prepares for E2E testing

set -e

echo "🔧 Fixing E2E test environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# 1. Clean up any existing Electron processes
print_step "Cleaning up existing Electron processes..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    pkill -f "electron-vite-project" || true
    pkill -f "Electron Helper" || true
    pkill -f "Electron.app" || true
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    pkill -f "electron" || true
    pkill -f "electron-vite-project" || true
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    taskkill //F //IM electron.exe //T 2>/dev/null || true
fi

print_success "Process cleanup completed"

# 2. Clean up singleton lock files
print_step "Cleaning up singleton lock files..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LOCK_DIR="$HOME/Library/Application Support/electron-vite-project"
    if [[ -d "$LOCK_DIR" ]]; then
        rm -rf "$LOCK_DIR/SingletonLock" 2>/dev/null || true
        print_success "Removed macOS singleton locks"
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    LOCK_DIR="$HOME/.config/electron-vite-project"
    if [[ -d "$LOCK_DIR" ]]; then
        rm -rf "$LOCK_DIR/SingletonLock" 2>/dev/null || true
        print_success "Removed Linux singleton locks"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    LOCK_DIR="$APPDATA/electron-vite-project"
    if [[ -d "$LOCK_DIR" ]]; then
        rm -rf "$LOCK_DIR/SingletonLock" 2>/dev/null || true
        print_success "Removed Windows singleton locks"
    fi
fi

# 3. Clean up test results and rebuild if needed
print_step "Cleaning up test artifacts..."

# Remove old test results
rm -rf e2e-result test-results playwright-report 2>/dev/null || true

# Ensure screenshots directory exists
mkdir -p e2e/e2e-result/screenshots

print_success "Test artifacts cleaned"

# 4. Check if build is needed
print_step "Checking application build..."

if [[ ! -d "dist-electron" ]] || [[ ! -f "dist-electron/main.js" ]] || [[ ! -d "dist" ]]; then
    print_warning "Application not built or missing files, building now..."
    npm run build
    print_success "Build completed"
else
    print_success "Application already built"
fi

# 5. Wait for system to stabilize
print_step "Waiting for system to stabilize..."
sleep 2
print_success "System ready"

echo ""
echo "🎯 E2E test environment is now ready!"
echo ""
echo "You can now run:"
echo "  npm run test:e2e"
echo ""
echo "If you still encounter issues, try:"
echo "  1. Close any open Electron apps manually"
echo "  2. Restart your terminal"
echo "  3. Run this script again" 