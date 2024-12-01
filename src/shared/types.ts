export type NoteInfo = {
  title: string;
  lastEditTime: number;
};

export type DeviceInfo = {
  platform: NodeJS.Platform;
};

export type NoteContent = string;

export type Note = NoteInfo & {
  content: NoteContent;
};

export type GetNotes = () => Promise<NoteInfo[]>;
export type ReadNote = (title: NoteInfo["title"]) => Promise<NoteContent>;
export type WriteNote = (
  title: NoteInfo["title"],
  content: NoteContent
) => Promise<void>;
export type CreateNote = () => Promise<NoteInfo["title"] | false>;
export type DeleteNote = (title: NoteInfo["title"]) => Promise<boolean>;
export type GetDeviceInfo = () => Promise<DeviceInfo>;
export type ChromeVersion = () => string;
export type ElectronVersion = () => string;
export type OpenUrl = (url: string) => void;
export type OpenSecondaryWindow = (note: Note) => void;

// example ipcRenderer.on
export type Statistics = {
  cupUsage: number;
  ramUsage: number;
  storageUsage: number;
};
export type SubscribeSomeData = (callback: (data: Statistics) => void) => void;
