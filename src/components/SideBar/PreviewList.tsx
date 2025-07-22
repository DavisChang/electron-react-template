import { ComponentProps } from 'react';
import { NotePreview } from './NotePreview';
import { twMerge } from 'tailwind-merge';
import { useNotesList } from '@/hooks/useNoteList';

export type PreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void;
};

export const PreviewList = ({
  onSelect,
  className,
  ...props
}: PreviewListProps) => {
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({
    onSelect,
  });

  if (!notes) return null;

  if (notes.length === 0) {
    return (
      <ul className={twMerge('text-center pt-4', className)} {...props}>
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
