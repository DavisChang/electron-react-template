import { app, BrowserWindow, ipcMain } from "electron";
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

export const MAIN_VITE_OPEN_DEV_TOOLS =
  process.env.MAIN_VITE_OPEN_DEV_TOOLS || false;
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

    autoUpdater.checkForUpdates();
    win?.webContents.send("onUpdateMessage", "Checking for updates");
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Dev Tools
  if (MAIN_VITE_OPEN_DEV_TOOLS) {
    win.webContents.openDevTools();
  }
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

app.whenReady().then(() => {
  createWindow();
});

autoUpdater.on("update-available", (info) => {
  win?.webContents.send("onUpdateMessage", "Update Available");
  const path = autoUpdater.downloadUpdate();
  console.log("[update-available]:", { path, info });
  win?.webContents.send("onUpdateMessage", path);
});

autoUpdater.on("update-not-available", (info) => {
  win?.webContents.send("onUpdateMessage", "Update Not Available");
  console.log("[update-not-available]:", info);
});

autoUpdater.on("update-downloaded", (info) => {
  win?.webContents.send("onUpdateMessage", "Update Downloaded");
  console.log("[update-downloaded]:", info);
});

autoUpdater.on("error", (info) => {
  win?.webContents.send("onUpdateMessage", info);
  console.log("[error]:", info);
});
