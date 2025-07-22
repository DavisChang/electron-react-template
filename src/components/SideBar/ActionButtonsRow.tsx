import { NewNoteButton } from '@/components/Button/NewNoteButton';
import { DeleteNoteButton } from '@/components/Button/DeleteButton';
import { ComponentProps } from 'react';

export const ActionButtonsRow = ({ ...props }: ComponentProps<'div'>) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
    </div>
  );
};
