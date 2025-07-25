import {
  ActionButton,
  ActionButtonProps,
} from '@/components/Button/ActionButton';
import { createEmptyNoteAtom } from '@/store';

import { useSetAtom } from 'jotai';
import { LuFileSignature } from 'react-icons/lu';

export const NewNoteButton = ({ ...props }: ActionButtonProps) => {
  const createEmptyNote = useSetAtom(createEmptyNoteAtom);

  const handleCreation = async () => {
    await createEmptyNote();
  };

  return (
    <ActionButton onClick={handleCreation} {...props}>
      <LuFileSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  );
};
