import { GetNotes, ReadNote } from "./types";

declare global {
  interface Window {
    ipcRenderer: import("electron").IpcRenderer;
    context: {
      locate?: string;
      getNotes: GetNotes;
      readNote: ReadNote;
    };
  }
}
