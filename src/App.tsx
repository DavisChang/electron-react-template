import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import InputArea from "components/InputArea.tsx";
import { RootLayout, Sidebar, Content } from "@/components/AppLayout";
import { formatDateFromMs } from "@/utils/formatDate";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { FloatingNoteTitle } from "./components/FloatingNoteTitle";
import { PreviewList } from "./components/SideBar/PreviewList";
import { ActionButtonsRow } from "./components/SideBar/ActionButtonsRow";
import { DeviceInfo, Statistics } from "./shared/types";

function App() {
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>();
  const [updateMessage, setUpdateMessage] = useState("");

  const scrollToTop = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    window.ipcRenderer.on("onUpdateMessage", (_event, message) => {
      setUpdateMessage(message);
    });

    // example ipcRenderer.on
    window.context.subscribeSomeData((data: Statistics) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    const getDeviceInfo = async () => {
      const info: DeviceInfo = await window.context.getDeviceInfo();
      setDeviceInfo(info);
    };
    getDeviceInfo();
  }, [setDeviceInfo]);

  return (
    <RootLayout>
      <Sidebar className="p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <PreviewList className="mt-3 space-y-1" onSelect={scrollToTop} />
      </Sidebar>
      <Content
        ref={contentContainerRef}
        className="border-l bg-zinc-900/50 border-l-white/20 "
      >
        <FloatingNoteTitle />
        <div>
          <div className="flex justify-center m-4">
            <a href="https://electron-vite.github.io" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>

          <h1 className="text-3xl font-bold underline">
            Electron with Vite + React {formatDateFromMs(Date.now())}
          </h1>
          <p>Click on the Vite and React logos to learn more</p>
          <div>
            <button
              data-testid="count"
              className="mx-4 my-4 bg-transparent dark:bg-white/5"
              onClick={() => setCount((count) => count + 1)}
            >
              count is {count}
            </button>
            <p>
              Edit <code>src/App.tsx</code> and save to test HMR
            </p>

            <p className="text-base text-slate-900 font-semibold dark:text-slate-300">
              Chrome Version: <code>{window.context.chrome()}</code>
            </p>
            <p className="text-base text-slate-900 font-semibold dark:text-slate-300">
              Electron Version: <code>{window.context.electron()}</code>
            </p>

            <p className="text-base text-slate-900 font-semibold dark:text-slate-300">
              Device:
              <code>{JSON.stringify(deviceInfo)}</code>
            </p>

            <p className="text-base text-slate-900 font-semibold dark:text-slate-300">
              Update Message:
              <code>{updateMessage}</code>
            </p>

            <InputArea />
          </div>
          <hr />
          <div>
            <h2 className="my-3 text-3xl font-bold">MarkdownEditor</h2>
            <MarkdownEditor />
          </div>
        </div>
      </Content>
    </RootLayout>
  );
}

export default App;
