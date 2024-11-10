import {
  ChromeVersion,
  CreateNote,
  DeleteNote,
  ElectronVersion,
  GetDeviceInfo,
  GetNotes,
  ReadNote,
  WriteNote,
} from "./types";

declare global {
  interface Window {
    ipcRenderer: import("electron").IpcRenderer;
    context: {
      locate?: string;
      electron: ElectronVersion;
      chrome: ChromeVersion;
      getDeviceInfo: GetDeviceInfo;
      getNotes: GetNotes;
      readNote: ReadNote;
      writeNote: WriteNote;
      createNote: CreateNote;
      deleteNote: DeleteNote;
    };
  }
}
