export type NoteInfo = {
  title: string;
  lastEditTime: number;
};

export type DeviceInfo = {
  platform: NodeJS.Platform;
};

export type NoteContent = string;
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
