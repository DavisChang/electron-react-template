/**
 * use fs-extra
 * create a folder at your home path
 * cd ~ && mkdir NoteMarkdown
 */
import { GetNotes, NoteInfo, ReadNote, WriteNote } from "@/shared/types";
import { ensureDir, readdir, readFile, stat, writeFile } from "fs-extra";
import { homedir } from "os";

const appDirectoryName = "NoteMarkdown";
const fileEncoding = "utf8";

export const getRootDir = () => {
  console.log(`${homedir()}/${appDirectoryName}`);
  return `${homedir()}/${appDirectoryName}`;
};

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  // exist
  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false,
  });

  const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"));

  return Promise.all(notes.map(getNoteInfoFromFileName));
};

export const getNoteInfoFromFileName = async (
  filename: string
): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`);

  return {
    title: filename.replace(/\.md$/, ""),
    lastEditTime: fileStats.mtimeMs,
  };
};

export const readNote: ReadNote = async (filename) => {
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
