import { ComponentProps } from "react";
import { NotePreview } from "./NotePreview";
import { twMerge } from "tailwind-merge";
import { useNotesList } from "@/hooks/useNoteList";

export const PreviewList = ({ className, ...props }: ComponentProps<"ul">) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({});

  if (notes.length === 0) {
    return (
      <ul className={twMerge("text-center pt-4", className)} {...props}>
        <span>No Data!</span>
      </ul>
    );
  }

  return (
    <ul {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  );
};
