import { BrowserWindow, ipcMain, shell } from "electron";
import {
  createNote,
  deleteNote,
  getDeviceInfo,
  getNotes,
  readNote,
  writeNote,
} from "../lib";
import {
  CreateNote,
  DeleteNote,
  GetDeviceInfo,
  GetNotes,
  ReadNote,
  WriteNote,
} from "@/shared/types";

export function registerIpcHandlers() {
  ipcMain.on("openUrl", (_, url: string) => {
    const newWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });
    newWindow.loadURL(url);
  });

  // Handle the external browser opening and simulate monitoring
  ipcMain.on("openExternalUrl", (_, url) => {
    console.log("Opening external URL:", url);

    // Open the default browser
    shell.openExternal(url);
  });

  ipcMain.handle("openDevTool", (event) => {
    const webContents = event.sender;
    if (webContents) {
      webContents.openDevTools();
    }
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
