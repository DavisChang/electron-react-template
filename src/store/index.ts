import { NoteContent, NoteInfo } from "@/shared/types";
import { atom } from "jotai";
import { unwrap } from "jotai/utils";

const loadNotes = async () => {
  const notes = (await window.context.getNotes()) ?? [];
  return notes.sort(
    (a: NoteInfo, b: NoteInfo) => b.lastEditTime - a.lastEditTime
  );
};

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes());

// sync
// export const notesAtom = atom<NoteInfo[]>(notesMock);

// async
export const notesAtom = unwrap(notesAtomAsync, (prev) => prev);

export const selectedNoteIndexAtom = atom<number | null>(null);

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom);
  const selectedNoteIndex = get(selectedNoteIndexAtom);

  if (selectedNoteIndex == null || !notes) return null;

  const selectedNote = notes[selectedNoteIndex];

  const noteContent = (await window.context.readNote(selectedNote.title)) ?? "";
  return {
    ...selectedNote,
    content: noteContent,
  };
});

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: "",
      content: "",
      lastEditTime: Date.now(),
    }
);

export const saveNoteAtom = atom(
  null,
  async (get, set, newContent: NoteContent) => {
    const notes = get(notesAtom);
    const selectedNote = get(selectedNoteAtom);

    if (!selectedNote || !notes) return;

    // Save on disk
    await window.context.writeNote(selectedNote.title, newContent);

    // Find the index of the note to update
    const noteIndex = notes.findIndex(
      (note) => note.title === selectedNote.title
    );

    if (noteIndex !== -1) {
      // Update the note's last edit time
      const updatedNotes = [...notes];
      updatedNotes[noteIndex] = {
        ...notes[noteIndex],
        lastEditTime: Date.now(),
      };
      set(notesAtom, updatedNotes);
    }
  }
);

export const createEmptyNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom);

  if (!notes) return;

  const title = await window.context.createNote();

  if (!title) return;

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now(),
  };

  set(notesAtom, [
    newNote,
    ...notes.filter((note) => note.title !== newNote.title),
  ]);

  set(selectedNoteIndexAtom, 0);
});

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom);
  const selectedNote = get(selectedNoteAtom);

  if (!selectedNote || !notes) return;

  const isDeleted = await window.context.deleteNote(selectedNote.title);
  if (!isDeleted) return;

  set(
    notesAtom,
    notes.filter((note) => note.title !== selectedNote.title)
  );

  set(selectedNoteIndexAtom, null);
});
