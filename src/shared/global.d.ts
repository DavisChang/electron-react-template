import {
  ChromeVersion,
  CreateNote,
  DeleteNote,
  ElectronVersion,
  GetDeviceInfo,
  GetNotes,
  OpenUrl,
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
      openUrl: OpenUrl;
      getDeviceInfo: GetDeviceInfo;
      getNotes: GetNotes;
      readNote: ReadNote;
      writeNote: WriteNote;
      createNote: CreateNote;
      deleteNote: DeleteNote;
    };
  }
}
