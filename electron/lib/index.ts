/**
 * use fs-extra
 * create a folder at your home path
 * cd ~ && mkdir NoteMarkdown
 */
import {
  CreateNote,
  GetNotes,
  NoteInfo,
  ReadNote,
  WriteNote,
} from "@/shared/types";
import { dialog } from "electron";
import { ensureDir, readdir, readFile, stat, writeFile } from "fs-extra";
import { homedir } from "os";
import path from "path";

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

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "New note",
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: "Create",
    properties: ["showOverwriteConfirmation"],
    showsTagField: false,
    filters: [{ name: "Markdown", extensions: ["md"] }],
  });

  if (canceled || !filePath) {
    console.log("Note creation canceled");
    return false;
  }

  const { name: filename, dir: parentDir } = path.parse(filePath);
  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: "error",
      title: "Creation files",
      message: `All notes must be saved under ${rootDir}. Avoid using other directories!`,
    });

    return false;
  }

  console.log(`[createNote] Create note ${filePath}`);

  await writeFile(filePath, "");
  return filename;
};
