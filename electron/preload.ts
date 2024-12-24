import { ipcRenderer, contextBridge } from "electron";
import {
  CreateNote,
  DeleteNote,
  GetDeviceInfo,
  GetNotes,
  Note,
  ReadNote,
  SubscribeSomeData,
  WriteNote,
} from "@/shared/types";

// --------- Expose some API to the Renderer process ---------
const allowedChannels = [
  "onUpdateMessage",
  "main-process-message",
  "secondary-process-message",
];

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    if (!allowedChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed.`);
    }
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    if (!allowedChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed.`);
    }
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    if (!allowedChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed.`);
    }
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    if (!allowedChannels.includes(channel)) {
      throw new Error(`Channel "${channel}" is not allowed.`);
    }
    return ipcRenderer.invoke(channel, ...omit);
  },
});

try {
  contextBridge.exposeInMainWorld("context", {
    locate: navigator.language,
    electron: () => process.versions.electron,
    chrome: () => process.versions.chrome,

    // example ipcRenderer.on
    subscribeSomeData: (callback: SubscribeSomeData) =>
      ipcRenderer.on("some-data", (_, data) => {
        callback(data);
      }),
    openUrl: (url: string) => ipcRenderer.send("openUrl", url),
    openExternalUrl: (url: string) => ipcRenderer.send("openExternalUrl", url),
    openDevTool: () => ipcRenderer.invoke("openDevTool"),
    openSecondaryWindow: (note: Note) =>
      ipcRenderer.send("openSecondaryWindow", note),
    getDeviceInfo: (...args: Parameters<GetDeviceInfo>) =>
      ipcRenderer.invoke("getDeviceInfo", ...args),
    getNotes: (...args: Parameters<GetNotes>) =>
      ipcRenderer.invoke("getNotes", ...args),
    readNote: (...args: Parameters<ReadNote>) =>
      ipcRenderer.invoke("readNote", ...args),
    writeNote: (...args: Parameters<WriteNote>) =>
      ipcRenderer.invoke("writeNote", ...args),
    createNote: (...args: Parameters<CreateNote>) =>
      ipcRenderer.invoke("createNote", ...args),
    deleteNote: (...args: Parameters<DeleteNote>) =>
      ipcRenderer.invoke("deleteNote", ...args),
  });
} catch (error) {
  console.error("ContextBridge, context");
}
