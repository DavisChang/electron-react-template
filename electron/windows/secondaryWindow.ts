import { BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "node:url";
import { VITE_DEV_SERVER_URL } from "../main";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let secondaryWindow: BrowserWindow | null = null;

export const createSecondaryWindow = (
  parent: BrowserWindow,
  RENDERER_DIST: string
) => {
  if (!secondaryWindow) {
    secondaryWindow = new BrowserWindow({
      width: 400,
      height: 300,
      parent,
      webPreferences: {
        preload: path.join(__dirname, "preload.mjs"),
      },
    });

    if (VITE_DEV_SERVER_URL) {
      secondaryWindow.loadURL(path.join(VITE_DEV_SERVER_URL, "secondary.html"));
    } else {
      secondaryWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
    }

    secondaryWindow.on("closed", () => {
      secondaryWindow = null;
    });
  } else {
    secondaryWindow.focus();
  }
};
