export type NoteInfo = {
  title: string;
  lastEditTime: number;
};

export type NoteContent = string;

export type GetNotes = () => Promise<NoteInfo[]>;

export type ReadNote = (title: NoteInfo["title"]) => Promise<NoteContent>;
