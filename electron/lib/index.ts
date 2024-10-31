/**
 * use fs-extra
 * create a folder at your home path
 * cd ~ && mkdir NoteMarkdown
 */
import { appDirectoryName, fileEncoding } from "@/shared/constants";
import { GetNotes, NoteInfo } from "@/shared/types";
import { ensureDir, readdir, stat } from "fs-extra";
import { homedir } from "os";

export const getRootDir = () => {
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
