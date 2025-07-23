# 🎭 Headless E2E Testing Guide

This guide explains how E2E (End-to-End) testing works in headless environments, particularly in
CI/CD pipelines.

## 🎯 Overview

Electron applications require a display server to run, which presents challenges in headless CI
environments like GitHub Actions. This project implements a comprehensive solution for running E2E
tests in both local and CI environments.

## 🏗️ Architecture

### Local Development

- **Display**: Uses system's native display server
- **Electron**: Runs with full GUI capabilities
- **Testing**: Interactive mode with visible windows

### CI Environment (Headless)

- **Display**: Uses Xvfb (X Virtual Framebuffer)
- **Electron**: Runs with `--headless` and additional flags
- **Testing**: Automated mode without visible UI

## 🔧 Configuration Files

### 1. Playwright Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  // Extended timeout for CI environments
  timeout: process.env.CI ? 60000 : 30000,

  // More retries in CI due to environment instability
  retries: process.env.CI ? 2 : 0,

  // CI-specific reporting
  reporter: process.env.CI ? [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/report.json' }],
    ['github'], // GitHub Actions annotations
  ] : [...],

  use: {
    // Enhanced debugging in CI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

### 2. E2E Test Configuration (`e2e/example.spec.ts`)

```typescript
// CI-specific Electron launch configuration
const isCI = !!process.env.CI;
const launchArgs = ['.'];

if (isCI) {
  launchArgs.push(
    '--headless', // Run without GUI
    '--disable-gpu', // Disable GPU acceleration
    '--disable-dev-shm-usage', // Avoid /dev/shm issues
    '--no-sandbox', // Required for containers
    '--disable-extensions', // Disable browser extensions
    '--disable-web-security' // Disable web security for testing
  );
}

electronApp = await _electron.launch({
  args: launchArgs,
  env: {
    NODE_ENV: 'development',
    ELECTRON_DISABLE_SANDBOX: 'true',
    // CI-specific environment variables
    ...(isCI && {
      DISPLAY: process.env.DISPLAY || ':99',
      ELECTRON_IS_DEV: '0',
      CI: '1',
    }),
  },
  timeout: isCI ? 30000 : 15000, // Longer timeout in CI
});
```

## 🚀 Available Commands

### Local Development

```bash
# Standard E2E tests (with GUI)
npm run test:e2e

# Safe E2E tests (with environment cleanup)
npm run test:e2e:safe
```

### CI/Headless Testing

```bash
# CI-specific E2E tests
npm run test:e2e:ci

# Headless E2E tests (with display configuration)
npm run test:e2e:headless

# Using the dedicated CI script
./scripts/ci-headless-e2e.sh
```

## 🖥️ Virtual Display Setup

### Xvfb Configuration

The CI environment uses Xvfb (X Virtual Framebuffer) to provide a virtual display:

```bash
# Install Xvfb
sudo apt-get install -y xvfb x11-utils

# Start virtual display
Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &

# Set display environment variable
export DISPLAY=:99

# Verify display is working
xdpyinfo -display :99
```

### GitHub Actions Integration

```yaml
- name: 🖥️ Setup virtual display for headless testing
  run: |
    sudo apt-get update
    sudo apt-get install -y xvfb x11-utils
    export DISPLAY=:99
    Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &
    sleep 3
    xdpyinfo -display :99 >/dev/null 2>&1 && echo "✅ Virtual display ready"

- name: 🧪 Run E2E tests (headless)
  env:
    DISPLAY: :99
    CI: true
    ELECTRON_DISABLE_SANDBOX: true
  run: npm run test:e2e:headless
```

## 🔍 Environment Detection

The system automatically detects CI environments and adjusts behavior:

```bash
# CI Detection Logic
detect_ci() {
    if [[ "$CI" == "true" ]] || [[ -n "$GITHUB_ACTIONS" ]] || [[ -n "$CONTINUOUS_INTEGRATION" ]]; then
        return 0  # Is CI
    else
        return 1  # Not CI
    fi
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Electron Launch Failures

**Problem**: `electron.launch: Process failed to launch!`

**Solutions**:

- Ensure Xvfb is running
- Check DISPLAY environment variable
- Verify Electron headless flags
- Increase launch timeout

```typescript
// Debugging electron launch
electronApp = await _electron.launch({
  args: launchArgs,
  env: { ...env, ELECTRON_ENABLE_LOGGING: 'true' },
  timeout: 60000, // Increase timeout
});
```

#### 2. Display Server Issues

**Problem**: Virtual display not available

**Solutions**:

```bash
# Check if Xvfb is running
ps aux | grep Xvfb

# Restart Xvfb
killall Xvfb
Xvfb :99 -screen 0 1280x720x24 > /dev/null 2>&1 &

# Verify display
DISPLAY=:99 xdpyinfo
```

#### 3. Permission Issues

**Problem**: Sandbox or permission errors

**Solutions**:

```bash
# Set additional environment variables
export ELECTRON_DISABLE_SANDBOX=true
export ELECTRON_RUN_AS_NODE=false

# Add to Electron launch args
--no-sandbox
--disable-setuid-sandbox
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Run with debug output
DEBUG=electron:* npm run test:e2e:headless

# Check Electron logs
ELECTRON_ENABLE_LOGGING=true npm run test:e2e:ci
```

## 📊 Performance Considerations

### CI Optimization

- **Parallel Execution**: Disabled to prevent resource conflicts
- **Retry Strategy**: 2 retries in CI vs 0 locally
- **Timeout Management**: Extended timeouts for slower CI environments
- **Resource Cleanup**: Aggressive cleanup between tests

### Environment Variables

```bash
# Performance tuning
NODE_ENV=test                    # Test environment
ELECTRON_DISABLE_SANDBOX=true   # Faster startup
ELECTRON_IS_DEV=0               # Production mode
CI=true                         # CI optimizations
```

## 🎯 Best Practices

### 1. Environment Separation

- Use different configurations for local vs CI
- Implement environment detection
- Provide fallback configurations

### 2. Resource Management

- Clean up processes between tests
- Use singleton lock cleanup
- Implement proper timeout handling

### 3. Error Handling

- Capture screenshots on failure
- Generate trace files for debugging
- Upload artifacts for analysis

### 4. Stability Improvements

- Use longer timeouts in CI
- Implement retry mechanisms
- Add system stabilization delays

## 📚 Additional Resources

- [Playwright Electron Testing](https://playwright.dev/docs/api/class-electronapplication)
- [Xvfb Documentation](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml)
- [GitHub Actions Virtual Environments](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)
- [Electron Headless Mode](https://www.electronjs.org/docs/tutorial/testing-widevine-cdm#running-in-a-headless-ci-environment)

---

## 🚀 Quick Start

For immediate setup in a new CI environment:

```bash
# 1. Install dependencies
npm run setup:dev

# 2. Test locally first
npm run test:e2e:safe

# 3. Test in headless mode
npm run test:e2e:headless

# 4. Use in CI
# (GitHub Actions workflow handles this automatically)
```
