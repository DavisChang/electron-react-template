import { test, expect, _electron } from "@playwright/test";
import fs from "fs-extra"; // Use fs-extra for robust file handling
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let firstWindow: Awaited<ReturnType<typeof electronApp.firstWindow>>;

// Utility function to get the screenshots directory
function getScreenshotPath(fileName: string): string {
  const screenshotsDir = path.join(__dirname, "e2e-result", "screenshots");

  // Ensure the directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Return the full path for the screenshot
  return path.join(screenshotsDir, fileName);
}

test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ["."],
    env: { NODE_ENV: "development" },
  });

  // Evaluation expression in the Electron context.
  const appPath = await electronApp.evaluate(async ({ app }) => {
    // This runs in the main Electron process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.getAppPath();
  });
  console.log("appPath:", appPath);

  // Get the first window that the app opens, wait if necessary.
  firstWindow = await electronApp.firstWindow();

  // Check Page Content
  // console.log("Page content:", await firstWindow.content());
});

test.afterEach(async () => {
  await electronApp.close();
});

test("save screenshot", async () => {
  // Generate cross-platform path for the screenshot
  const screenshotFilePath = getScreenshotPath("intro.png");

  // Save the screenshot
  await firstWindow.screenshot({ path: screenshotFilePath });

  console.log(`Screenshot saved at: ${screenshotFilePath}`);
});

test("app title", async () => {
  const title = await firstWindow.title();
  expect(title).toEqual("Vite + React + TS");
});

test("increment count button", async () => {
  // Wait for the button to appear
  await firstWindow.waitForSelector("[data-testid='count']", { timeout: 5000 });
  const button = await firstWindow.getByTestId("count");

  // Check initial button text
  const initialText = await button.textContent();
  console.log("Initial button text:", initialText);

  // Click the button
  await button.click();

  const screenshotFilePath = getScreenshotPath("intro2.png");
  await firstWindow.screenshot({ path: screenshotFilePath });

  // Wait for the button text to update
  await firstWindow.waitForFunction(
    () => {
      const button = document.querySelector("[data-testid='count']");
      return button && button.textContent?.includes("count is 1");
    },
    { timeout: 5000 }
  );

  // Check updated button text
  const updatedText = await button.textContent();
  expect(updatedText).toContain("count is 1");
});
