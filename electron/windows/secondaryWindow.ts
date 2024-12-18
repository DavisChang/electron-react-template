import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "node:url";
import { VITE_DEV_SERVER_URL } from "../main";
import { Note } from "@/shared/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let secondaryWindow: BrowserWindow | null = null;

export const createSecondaryWindow = (
  parent: BrowserWindow,
  RENDERER_DIST: string,
  note: Note
) => {
  if (!secondaryWindow) {
    secondaryWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
      },
    });

    // Test active push message to Renderer-process.
    secondaryWindow.webContents.on("did-finish-load", () => {
      secondaryWindow?.webContents.send("secondary-process-message", note);
    });

    if (VITE_DEV_SERVER_URL) {
      secondaryWindow.loadURL(path.join(VITE_DEV_SERVER_URL, "secondary.html"));
    } else {
      secondaryWindow.loadFile(path.join(RENDERER_DIST, "secondary.html"));
    }

    secondaryWindow.on("closed", () => {
      secondaryWindow = null;
    });
  } else {
    secondaryWindow.focus();
  }
};
