import {
  _electron,
  expect,
  test,
  type ElectronApplication,
  type Page,
} from '@playwright/test';
import fs from 'fs-extra'; // Use fs-extra for robust file handling
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let electronApp: ElectronApplication | null = null;
let firstWindow: Page | null = null;

// Utility function to get the screenshots directory
function getScreenshotPath(fileName: string): string {
  const screenshotsDir = path.join(__dirname, 'e2e-result', 'screenshots');

  // Ensure the directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Return the full path for the screenshot
  return path.join(screenshotsDir, fileName);
}

// Clean up any existing Electron processes before starting
test.beforeAll(async () => {
  // Kill any existing Electron processes to prevent singleton conflicts
  try {
    if (process.platform === 'darwin') {
      await import('child_process').then(({ exec }) => {
        return new Promise<void>(resolve => {
          exec('pkill -f "electron-vite-project"', () => {
            // Ignore errors, just try to clean up
            resolve();
          });
        });
      });
    }
  } catch (error) {
    // Ignore cleanup errors
    console.log('Process cleanup completed');
  }

  // Wait a bit for processes to fully terminate
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.beforeEach(async () => {
  try {
    // Ensure any previous app is closed
    if (electronApp) {
      await electronApp.close().catch(() => {
        // Ignore close errors
      });
      electronApp = null;
      firstWindow = null;
    }

    // Wait a bit before launching new instance
    await new Promise(resolve => setTimeout(resolve, 500));

    // Configure Electron for headless CI environment
    const isCI = !!process.env.CI;
    const launchArgs = ['.'];

    // Add headless flags for CI environment
    if (isCI) {
      launchArgs.push(
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--no-sandbox',
        '--disable-extensions',
        '--disable-web-security'
      );
    }

    electronApp = await _electron.launch({
      args: launchArgs,
      env: {
        NODE_ENV: 'development',
        // Add unique identifier to prevent singleton conflicts
        ELECTRON_ENABLE_SECURITY_WARNINGS: 'false',
        ELECTRON_DISABLE_SANDBOX: 'true',
        // Additional CI environment variables
        ...(isCI && {
          DISPLAY: process.env.DISPLAY || ':99',
          ELECTRON_IS_DEV: '0',
          CI: '1',
        }),
      },
      timeout: isCI ? 30000 : 15000, // Longer timeout in CI
    });

    if (!electronApp) {
      throw new Error('Failed to launch Electron app');
    }

    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });
    console.log('appPath:', appPath);

    // Get the first window that the app opens, wait if necessary.
    firstWindow = await electronApp.firstWindow();

    if (!firstWindow) {
      throw new Error('Failed to get first window');
    }

    // Wait for the window to be ready
    await firstWindow.waitForLoadState('domcontentloaded', { timeout: 10000 });

    // Check Page Content
    // console.log("Page content:", await firstWindow.content());
  } catch (error) {
    console.error('Error in beforeEach:', error);
    // Clean up on error
    if (electronApp) {
      await electronApp.close().catch(() => {});
      electronApp = null;
      firstWindow = null;
    }
    throw error;
  }
});

test.afterEach(async () => {
  try {
    if (electronApp) {
      await electronApp.close();
      electronApp = null;
      firstWindow = null;
    }
  } catch (error) {
    console.error('Error closing Electron app:', error);
    electronApp = null;
    firstWindow = null;
  }

  // Wait a bit after closing
  await new Promise(resolve => setTimeout(resolve, 500));
});

test.afterAll(async () => {
  // Final cleanup
  try {
    if (electronApp) {
      await electronApp.close().catch(() => {});
      electronApp = null;
      firstWindow = null;
    }
  } catch (error) {
    // Ignore final cleanup errors
  }
});

test('save screenshot', async () => {
  if (!firstWindow) {
    throw new Error('First window is not available');
  }

  // Generate cross-platform path for the screenshot
  const screenshotFilePath = getScreenshotPath('intro.png');

  // Save the screenshot
  await firstWindow.screenshot({ path: screenshotFilePath });

  console.log(`Screenshot saved at: ${screenshotFilePath}`);

  // Verify screenshot was created
  expect(fs.existsSync(screenshotFilePath)).toBe(true);
});

test('app title', async () => {
  if (!firstWindow) {
    throw new Error('First window is not available');
  }

  const title = await firstWindow.title();
  expect(title).toEqual('Vite + React + TS');
});

test('increment count button', async () => {
  if (!firstWindow) {
    throw new Error('First window is not available');
  }

  // Wait for the count button with specific text to appear
  const button = firstWindow.getByRole('button', { name: /count is \d+/ });
  await button.waitFor({ timeout: 10000 });

  // Check initial button text
  const initialText = await button.textContent();
  console.log('Initial button text:', initialText);
  expect(initialText).toContain('count is 0');

  // Click the button
  await button.click();

  const screenshotFilePath = getScreenshotPath('intro2.png');
  await firstWindow.screenshot({ path: screenshotFilePath });

  // Wait for the button text to update and verify
  await expect(button).toContainText('count is 1', { timeout: 10000 });

  // Double check the updated text
  const updatedText = await button.textContent();
  console.log('Updated button text:', updatedText);
  expect(updatedText).toContain('count is 1');
});
