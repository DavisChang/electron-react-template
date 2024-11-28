import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  MessageBoxOptions,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  createNote,
  deleteNote,
  getDeviceInfo,
  getNotes,
  readNote,
  writeNote,
} from "./lib";
import {
  CreateNote,
  DeleteNote,
  GetDeviceInfo,
  GetNotes,
  ReadNote,
  WriteNote,
} from "@/shared/types";
import { autoUpdater } from "electron-updater";
import dns from "dns";

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

let win: BrowserWindow | null;

export function registerIpcHandlers() {
  ipcMain.on("openUrl", (_, url: string) => {
    const newWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    newWindow.loadURL(url);
  });

  ipcMain.handle("getNotes", (_, ...args: Parameters<GetNotes>) =>
    getNotes(...args)
  );
  ipcMain.handle("readNote", (_, ...args: Parameters<ReadNote>) =>
    readNote(...args)
  );
  ipcMain.handle("writeNote", (_, ...args: Parameters<WriteNote>) =>
    writeNote(...args)
  );
  ipcMain.handle("createNote", (_, ...args: Parameters<CreateNote>) =>
    createNote(...args)
  );
  ipcMain.handle("deleteNote", (_, ...args: Parameters<DeleteNote>) =>
    deleteNote(...args)
  );
  ipcMain.handle("getDeviceInfo", (_, ...args: Parameters<GetDeviceInfo>) =>
    getDeviceInfo(...args)
  );
}

// Register IPC handlers
registerIpcHandlers();

function createWindow() {
  win = new BrowserWindow({
    title: "This is vite application",
    icon: path.join(process.env.VITE_PUBLIC || "", "electron-vite.svg"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    // fullscreen: true,
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());

    // Check for updates as soon as the window loads
    autoUpdater.checkForUpdates();
    win?.webContents.send(
      "onUpdateMessage",
      `V.${app.getVersion()} - Checking for updates`
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Dev Tools
  // win.webContents.openDevTools();

  // Set up auto-update events
  setupAutoUpdater();
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
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
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
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
    win?.webContents.send(
      "onUpdateMessage",
      "Update available. Downloading..."
    );
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Download Now", "Later"],
      title: "Application Update",
      message: "A new version is available. Would you like to download it?",
    };

    dialog.showMessageBox(win as BrowserWindow, dialogOpts).then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on("update-not-available", () => {
    win?.webContents.send("onUpdateMessage", "No updates available.");
  });

  autoUpdater.on("download-progress", (progress) => {
    const message = `Download speed: ${Math.round(
      progress.bytesPerSecond / 1024
    )} KB/s\nDownloaded ${Math.round(progress.percent)}%`;
    win?.webContents.send("onUpdateMessage", message);
  });

  autoUpdater.on("update-downloaded", () => {
    win?.webContents.send("onUpdateMessage", "Update downloaded.");
    const dialogOpts: MessageBoxOptions = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message:
        "A new version has been downloaded. Restart the application to apply the updates.",
    };

    dialog.showMessageBox(win as BrowserWindow, dialogOpts).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  autoUpdater.on("error", (error) => {
    win?.webContents.send("onUpdateMessage", `Error: ${error}`);
  });
}

// check internet
let lastStatus: boolean = true;

function checkInternetConnection(): void {
  dns.lookup("google.com", (err: NodeJS.ErrnoException | null) => {
    const isOnline = !err;
    if (isOnline !== lastStatus) {
      lastStatus = isOnline;
      const message = isOnline ? "You are now online." : "You are offline.";
      dialog.showMessageBox({
        type: "info",
        title: "Network Status",
        message,
      });
    }
  });
}

setInterval(checkInternetConnection, 5000);
