import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  MessageBoxOptions,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { registerIpcHandlers } from "./ipc/registerIpcHandlers";
import { autoUpdater } from "electron-updater";
import { checkInternetConnection } from "./lib/internet";
import { createSecondaryWindow } from "./windows/secondaryWindow";
import { Note } from "@/shared/types";
import getSystemPerformance from "./lib/deviceSystemUsage";

// basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null;

// Check Internet status
setInterval(checkInternetConnection, 5000);

// Register IPC handlers
registerIpcHandlers();

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "This is vite application",
    icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    // fullscreen: true,
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );

    // Check for updates as soon as the window loads
    autoUpdater.checkForUpdates();
    mainWindow?.webContents.send(
      "onUpdateMessage",
      `V.${app.getVersion()} - Checking for updates`
    );
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Dev Tools
  // mainWindow.webContents.openDevTools();

  // Set up auto-update events
  setupAutoUpdater();

  // Send system performance data every 5 seconds
  monitorSystemPerformance(5000);
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle request to open a secondary window
ipcMain.on("openSecondaryWindow", (_, note: Note) => {
  if (mainWindow) {
    createSecondaryWindow(mainWindow, RENDERER_DIST, note);
  }
});

// Deep Links
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("electron-template", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("electron-template");
}

/**
 * Deep Links
 * Handle the protocol. In this case, we choose to show an Error Box.
 */

// Windows and Linux code:
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLine.pop()}`
    );
  });

  // Create mainWindow, load the rest of the app, etc...
  app.whenReady().then(createWindow);

  // MacOS code
  app.on("open-url", (_, url) => {
    dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
  });
}

function setupAutoUpdater() {
  // Listen for update events
  autoUpdater.on("update-available", () => {
    mainWindow?.webContents.send(
      "onUpdateMessage",
      "Update available. Downloading..."
    );
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Download Now", "Later"],
      title: "Application Update",
      message: "A new version is available. Would you like to download it?",
    };

    dialog
      .showMessageBox(mainWindow as BrowserWindow, dialogOpts)
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
  });

  autoUpdater.on("update-not-available", () => {
    mainWindow?.webContents.send("onUpdateMessage", "No updates available.");
  });

  autoUpdater.on("download-progress", (progress) => {
    const message = `Download speed: ${Math.round(
      progress.bytesPerSecond / 1024
    )} KB/s\nDownloaded ${Math.round(progress.percent)}%`;
    mainWindow?.webContents.send("onUpdateMessage", message);
  });

  autoUpdater.on("update-downloaded", () => {
    mainWindow?.webContents.send("onUpdateMessage", "Update downloaded.");
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message:
        "A new version has been downloaded. Restart the application to apply the updates.",
    };

    dialog
      .showMessageBox(mainWindow as BrowserWindow, dialogOpts)
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  });

  autoUpdater.on("error", (error) => {
    mainWindow?.webContents.send("onUpdateMessage", `Error: ${error}`);
  });
}

function monitorSystemPerformance(time: number) {
  setInterval(() => {
    if (mainWindow) {
      const performanceData = getSystemPerformance();
      mainWindow.webContents.send("performance-data", performanceData);

      // Example: Sending an alert if system CPU usage exceeds 80%
      const cpuUsage = parseFloat(performanceData.systemCpu.averageUsage);
      if (cpuUsage > 80) {
        mainWindow.webContents.send("performance-alert", {
          type: "CPU",
          message: `High CPU Usage: ${performanceData.systemCpu.averageUsage}`,
        });
      }
    }
  }, time);
}
