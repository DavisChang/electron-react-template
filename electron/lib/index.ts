/**
 * use fs-extra
 * create a folder at your home path
 * cd ~ && mkdir NoteMarkdown
 */
import {
  CreateNote,
  DeleteNote,
  GetDeviceInfo,
  GetNotes,
  NoteInfo,
  ReadNote,
  WriteNote,
} from '@/shared/types';
import { dialog } from 'electron';
import {
  ensureDir,
  readdir,
  readFile,
  remove,
  stat,
  writeFile,
} from 'fs-extra';
import { isEmpty } from 'lodash';
import { homedir, platform } from 'os';
import path, { join } from 'path';
import welcomeNoteFile from '../../resources/welcomeNote.md?raw';

const appDirectoryName = 'NoteMarkdown';
const fileEncoding = 'utf8';

export const getRootDir = () => {
  console.log(`${homedir()}/${appDirectoryName}`);
  return join(homedir(), appDirectoryName);
};

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  // exist
  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false,
  });

  const notes = notesFileNames.filter(fileName => fileName.endsWith('.md'));

  if (isEmpty(notes)) {
    console.info('No notes found, creating a welcome note');

    // create the welcome note
    await writeFile(`${rootDir}/Welcome.md`, welcomeNoteFile, {
      encoding: fileEncoding,
    });

    notes.push('Welcome.md');
  }

  return Promise.all(notes.map(getNoteInfoFromFileName));
};

export const getNoteInfoFromFileName = async (
  filename: string
): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`);

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs,
  };
};

export const readNote: ReadNote = async filename => {
  const rootDir = getRootDir();

  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding });
};

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir();

  console.info(`[writeNote] Writing note ${filename}`);
  return writeFile(`${rootDir}/${filename}.md`, content, {
    encoding: fileEncoding,
  });
};

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }],
  });

  if (canceled || !filePath) {
    console.log('Note creation canceled');
    return false;
  }

  const { name: filename, dir: parentDir } = path.parse(filePath);
  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation files',
      message: `All notes must be saved under ${rootDir}. Avoid using other directories!`,
    });

    return false;
  }

  console.log(`[createNote] Create note ${filePath}`);

  await writeFile(filePath, '');
  return filename;
};

export const deleteNote: DeleteNote = async filename => {
  const rootDir = getRootDir();

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Delete', 'Cancel'], // 0 is Delete, 1 is Cancel
    defaultId: 1,
    cancelId: 1,
  });

  if (response === 1) {
    console.info('Note deletion canceled');
    return false;
  }

  console.info(`Deleting note: ${filename}`);
  await remove(`${rootDir}/${filename}.md`);
  return true;
};

export const getDeviceInfo: GetDeviceInfo = async () => {
  return { platform: platform() };
};
