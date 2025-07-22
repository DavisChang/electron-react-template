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
  SubscribeSomeData,
  OpenSecondaryWindow,
  OpenDevTool,
  OnPerformanceData,
  OnPerformanceAlert,
} from './types';

declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer;
    context: {
      locate?: string;
      electron: ElectronVersion;
      chrome: ChromeVersion;
      subscribeSomeData: SubscribeSomeData; // example ipcRenderer.on
      openUrl: OpenUrl;
      openExternalUrl: OpenUrl;
      openDevTool: OpenDevTool;
      openSecondaryWindow: OpenSecondaryWindow;
      getDeviceInfo: GetDeviceInfo;
      getNotes: GetNotes;
      readNote: ReadNote;
      writeNote: WriteNote;
      createNote: CreateNote;
      deleteNote: DeleteNote;
      onPerformanceData: OnPerformanceData;
      onPerformanceAlert: OnPerformanceAlert;
    };
  }
}
