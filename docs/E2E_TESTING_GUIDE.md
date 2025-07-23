# E2E Testing Guide

This guide covers end-to-end testing with Playwright for our Electron application.

## 🚀 Quick Start

### Prerequisites

The Electron application must be built before running E2E tests:

```bash
# Option 1: Safe E2E testing (includes automatic build check)
npm run test:e2e:safe

# Option 2: Manual approach
npm run build
npm run test:e2e

# Option 3: Fix environment issues
npm run fix:e2e
npm run test:e2e
```

## 🛠️ Common Issues & Solutions

### Issue 1: "Unable to find Electron app"

**Error**: `Cannot find module 'dist-electron/main.js'`

**Solution**: Build the application first

```bash
npm run build  # Creates dist-electron/main.js and preload.mjs
npm run test:e2e
```

### Issue 2: Singleton Lock Conflicts

**Error**: `Failed to create SingletonLock: File exists (17)`

**Solution**: Clean up processes

```bash
npm run fix:e2e  # Cleans up Electron processes and locks
npm run test:e2e
```

### Issue 3: Tests Run in Parallel (Causing Conflicts)

**Configuration**: We use `workers: 1` in `playwright.config.ts` to prevent multiple Electron
instances.

### Issue 4: Element Selection Issues

**Solution**: We use role-based selectors:

```javascript
// ❌ Problematic (multiple elements with same testid)
const button = firstWindow.getByTestId('count');

// ✅ Better (specific role-based selection)
const button = firstWindow.getByRole('button', { name: /count is \d+/ });
```

## 📁 Test Structure

```
e2e/
├── example.spec.ts          # Main E2E tests
├── e2e-result/
│   └── screenshots/         # Test screenshots
└── playwright.config.ts     # Playwright configuration
```

## 🧪 Test Cases

### 1. Screenshot Test

- Launches Electron app
- Takes screenshot
- Verifies file creation

### 2. App Title Test

- Verifies window title is "Vite + React + TS"

### 3. Button Interaction Test

- Finds count button using role selector
- Verifies initial state ("count is 0")
- Clicks button
- Verifies updated state ("count is 1")

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)

```javascript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Prevent parallel execution
  workers: 1, // Single worker to avoid conflicts
  timeout: 30000, // 30 second timeout
  // No webServer needed for Electron tests
});
```

### Test Setup (`example.spec.ts`)

```javascript
// Process cleanup before tests
test.beforeAll(async () => {
  // Kill existing Electron processes
});

// Launch Electron app for each test
test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ['.'],
    env: {
      NODE_ENV: 'development',
      ELECTRON_ENABLE_SECURITY_WARNINGS: 'false',
      ELECTRON_DISABLE_SANDBOX: 'true',
    },
    timeout: 15000,
  });
});

// Clean up after each test
test.afterEach(async () => {
  if (electronApp) {
    await electronApp.close();
  }
});
```

## 🔧 Troubleshooting Commands

```bash
# Full diagnostic and fix
npm run fix:e2e

# Manual process cleanup (macOS)
pkill -f "electron-vite-project"
pkill -f "Electron Helper"
pkill -f "Electron.app"

# Manual singleton lock cleanup (macOS)
rm -rf "$HOME/Library/Application Support/electron-vite-project/SingletonLock"

# Check if build files exist
ls -la dist-electron/

# View test report
npx playwright show-report
```

## 🎯 Best Practices

### 1. Always Build First

```bash
# ✅ Good
npm run build
npm run test:e2e

# ✅ Better
npm run test:e2e:safe
```

### 2. Use Descriptive Selectors

```javascript
// ✅ Role-based (recommended)
const button = page.getByRole('button', { name: /count is \d+/ });

// ✅ Text-based
const button = page.getByText('count is 0');

// ❌ Avoid generic testids when multiple elements exist
const button = page.getByTestId('count'); // May match multiple elements
```

### 3. Proper Error Handling

```javascript
test('my test', async () => {
  if (!firstWindow) {
    throw new Error('First window is not available');
  }

  // Test logic here...
});
```

### 4. Use Appropriate Timeouts

```javascript
// For element waiting
await firstWindow.waitForSelector('button', { timeout: 10000 });

// For app launch
electronApp = await _electron.launch({
  // ...config
  timeout: 15000, // 15 seconds for Electron to start
});
```

## 📊 CI/CD Integration

E2E tests are integrated into our quality pipeline:

```bash
# Quality check includes E2E (optional, with auto-recovery)
npm run quality:check

# Full quality check (includes mandatory E2E)
npm run quality:full
```

In CI environments, E2E tests will:

- Automatically build the application
- Use single worker mode
- Clean up processes automatically
- Generate HTML reports

## 🚀 Performance Tips

1. **Use `workers: 1`** - Prevents Electron singleton conflicts
2. **Build once** - Reuse built files for multiple test runs
3. **Process cleanup** - Use `npm run fix:e2e` between test sessions
4. **Headless mode** - Faster execution in CI environments

## 📝 Debugging

### Enable Debug Logs

```bash
DEBUG=pw:api npm run test:e2e
```

### View Browser Console

```javascript
page.on('console', msg => console.log(msg.text()));
```

### Take Debug Screenshots

```javascript
await firstWindow.screenshot({
  path: 'debug-screenshot.png',
  fullPage: true,
});
```

---

**Need help?** Check the main README or run `npm run fix:e2e` for automatic issue resolution.
